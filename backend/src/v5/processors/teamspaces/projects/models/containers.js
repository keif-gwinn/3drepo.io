/**
 *  Copyright (C) 2021 3D Repo Ltd
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

const { getContainerById, getContainers } = require('../../../../models/modelSettings');
const { getLatestRevision, getRevisionCount, getRevisions, updateRevisionStatus } = require('../../../../models/revisions');
const { UUIDToString } = require('../../../../utils/helper/uuids');
const { getModelList } = require('./commons/modelList');
const { getProjectById } = require('../../../../models/projects');

const Containers = {};

Containers.getContainerList = async (teamspace, project, user) => {
	const { models } = await getProjectById(teamspace, project, { permissions: 1, models: 1 });
	const modelSettings = await getContainers(teamspace, models, { _id: 1, name: 1, permissions: 1 });

	return getModelList(teamspace, project, user, modelSettings);
};

Containers.getContainerStats = async (teamspace, project, container) => {
	let latestRev = {};
	const [settings, revCount] = await Promise.all([
		getContainerById(teamspace, container, { name: 1, type: 1, properties: 1, status: 1 }),
		getRevisionCount(teamspace, container),
	]);

	try {
		latestRev = await getLatestRevision(teamspace, container, { tag: 1, timestamp: 1 });
	} catch {
		// do nothing. A container can have 0 revision.
	}

	return {
		type: settings.type,
		code: settings.properties.code,
		status: settings.status,
		units: settings.properties.unit,
		revisions: {
			total: revCount,
			lastUpdated: latestRev.timestamp,
			latestRevision: latestRev.tag || latestRev._id,
		},
	};
};

Containers.getRevisions = async (teamspace, container, showVoid) => {
	const revisions = await getRevisions(teamspace, container, showVoid,
		{ _id: 1, author: 1, timestamp: 1, tag: 1, void: 1 });

	return revisions.map((revision) => ({ ...revision, _id: UUIDToString(revision._id) }));
};

Containers.updateRevisionStatus = async (teamspace, container, revision, status) => {
	if (typeof status === 'boolean') {
		await updateRevisionStatus(teamspace, container, revision, status);
	}
	return {};
};

module.exports = Containers;
