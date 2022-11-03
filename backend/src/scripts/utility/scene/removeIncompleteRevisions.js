/**
 *  Copyright (C) 2022 3D Repo Ltd
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU Affero General Public License as
 *  published by the Free Software Foundation, either version 3 of the
 *  License, or (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU Affero General Public License for more details.
 *
 *  You should have received a copy of the GNU Affero General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * This script is used to remove any incomplete (failed, not processing) revisions.
 * It will go through scenes and remove any revision data associated with revisions
 * that are incomplete and older than 14 days (i.e., unlikely to be queued)
 */

const { v5Path } = require('../../../interop');

const { logger } = require(`${v5Path}/utils/logger`);
const { getTeamspaceList, getCollectionsEndsWith } = require('../../utils');
const Path = require('path');

const { isString, isObject } = require(`${v5Path}/utils/helper/typeCheck`);

const { deleteMany, find } = require(`${v5Path}/handler/db`);
const { removeFilesWithMeta } = require(`${v5Path}/services/filesManager`);
const { UUIDToString } = require(`${v5Path}/utils/helper/uuids`);

const removeRecords = async (teamspace, collection, filter, refAttribute) => {
	if (refAttribute) {
		const projection = { [refAttribute]: 1 };
		const filesFilter = { ...filter, [refAttribute]: { $exists: true } };

		const results = await find(teamspace, collection, filesFilter, projection);
		const filenames = results.flatMap((record) => {
			const fileRefs = record[refAttribute];
			if (fileRefs) {
				// handle different ref formats
				// record refs currently stored in the following formats:
				// 1) { ref: 'refString' }
				// 2) { ref: {
				//        key1: 'key1RefString',
				//        key2: 'key2RefString',
				//    }
				if (isString(fileRefs)) {
					return fileRefs;
				} if (isObject(fileRefs)) {
					return Object.values(fileRefs);
				}
				logger.logError(`Unsupported record type: ${Object.prototype.toString.call(fileRefs)}`);
			}
			return [];
		});

		await removeFilesWithMeta(teamspace, collection, { _id: { $in: filenames } });
	}

	await deleteMany(teamspace, collection, filter);
};

const processModelStash = async (teamspace, model, revIds) => {
	// eslint-disable-next-line security/detect-non-literal-regexp
	const revIdsRegex = new RegExp(`.*(?:${revIds.map(UUIDToString).join('|')}).*`);

	const proms = [
		removeFilesWithMeta(teamspace, `${model}.stash.json_mpc.ref`, { _id: revIdsRegex }),
		removeRecords(teamspace, `${model}.stash.unity3d`, { _id: { $in: revIds } }),
		removeRecords(teamspace, `${model}.stash.3drepo`, { rev_id: { $in: revIds } }, '_extRef'),
	];
	const supermeshIds = (await find(teamspace, `${model}.stash.3drepo`, { rev_id: { $in: revIds }, type: 'mesh' }, { _id: 1 })).map(({ _id }) => UUIDToString(_id));
	if (supermeshIds.length) {
		for (let i = 0; i <= supermeshIds.length; i += 1000) {
			const meshGroup = supermeshIds.slice(i, i + 1000);
			// eslint-disable-next-line security/detect-non-literal-regexp
			const superMeshRegex = new RegExp(`.*(?:${meshGroup.join('|')}).*`);
			proms.push(
				removeFilesWithMeta(teamspace, `${model}.stash.json_mpc.ref`, { _id: superMeshRegex }),
				removeFilesWithMeta(teamspace, `${model}.stash.src.ref`, { _id: superMeshRegex }),
				removeFilesWithMeta(teamspace, `${model}.stash.unity3d.ref`, { _id: superMeshRegex }),
			);
		}
	}

	await Promise.all(proms);
};

const processModelSequences = async (teamspace, model, revIds) => {
	const sequences = await find(teamspace, `${model}.sequences`, { rev_id: { $in: revIds } }, { frames: 1 });
	if (sequences.length) {
		const stateIds = sequences.flatMap(({ frames }) => frames.map(({ state }) => state));

		const sequenceIds = sequences.map(({ _id }) => _id);

		await Promise.all([
			removeRecords(teamspace, `${model}.activities`, { sequenceId: { $in: sequenceIds } }),
			removeFilesWithMeta(teamspace, `${model}.activities.ref`, { _id: { $in: sequenceIds.map(UUIDToString) } }),
			removeFilesWithMeta(teamspace, `${model}.sequences.ref`, { _id: { $in: stateIds } }),
			deleteMany(teamspace, `${model}.sequences`, { _id: { $in: sequenceIds } }),
		]);
	}
};

const removeRevisions = async (teamspace, model, revNodes) => {
	const revIds = revNodes.map(({ _id }) => _id);
	const rFiles = revNodes.flatMap(({ rFile }) => rFile ?? []);

	logger.logInfo(`\t\t-${model} - removing ${revIds.length} zombie revisions`);

	await Promise.all([
		processModelSequences(teamspace, model, revIds),
		processModelStash(teamspace, model, revIds),
		removeFilesWithMeta(teamspace, `${model}.history.ref`, { _id: { $in: rFiles } }),
	]);

	// We can't remove mesh nodes until we've processed the stashes
	await removeRecords(teamspace, `${model}.scene`, { rev_id: { $in: revIds } }, '_extRef');
};

const cleanUpRevisions = async (teamspace, colName, filter) => {
	const badRevisions = await find(teamspace, colName, filter, { rFile: 1 });
	if (badRevisions.length) {
		const model = colName.slice(0, -('.history'.length));
		await removeRevisions(teamspace, model, badRevisions);
	}

	await removeRecords(teamspace, colName, filter);
};

const processTeamspace = async (teamspace, revisionAge) => {
	const cols = await getCollectionsEndsWith(teamspace, '.history');
	const threshold = new Date();
	threshold.setDate(threshold.getDate() - revisionAge);

	const query = {
		incomplete: { $exists: true },
		timestamp: { $lt: threshold },
	};

	for (const { name } of cols) {
		// eslint-disable-next-line no-await-in-loop
		await cleanUpRevisions(teamspace, name, query);
	}
};

const run = async (revisionAge) => {
	logger.logInfo(`Finding unfinished revisions from more than ${revisionAge} days ago...`);
	const teamspaces = await getTeamspaceList();
	for (const teamspace of teamspaces) {
		logger.logInfo(`\t-${teamspace}`);
		// eslint-disable-next-line no-await-in-loop
		await processTeamspace(teamspace, revisionAge);
	}
};

const genYargs = (yargs) => {
	const commandName = Path.basename(__filename, Path.extname(__filename));
	const argsSpec = (subYargs) => subYargs.option('revisionAge', {
		describe: 'Days threshold for failed revisions',
		type: 'number',
		default: 14,
	});
	return yargs.command(commandName,
		'Remove any incomplete (failed, not processing) revisions',
		argsSpec,
		(argv) => run(argv.revisionAge));
};

module.exports = {
	run,
	genYargs,
};
