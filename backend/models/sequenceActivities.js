/**
 *  Copyright (C) 2019 3D Repo Ltd
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

"use strict";
const db = require("../handler/db");
const responseCodes = require("../response_codes.js");
const utils = require("../utils");
const nodeuuid = require("uuid/v1");
const FileRef = require("./fileRef");
const yup = require("yup");
const {pick, last} = require("lodash");
const Sequence = require("./sequence");

const keyValueSchema = yup.object().shape({
	key: yup.string().required(),
	value: yup.mixed().required()
}).noUnknown();

const activityEditSchema = yup.object().shape({
	name: yup.string(),
	startDate: yup.number(),
	endDate: yup.number(),
	parent: yup.string(),
	resources: yup.object(),
	data: yup.array().of(keyValueSchema)
}).noUnknown();

const activitySchema = yup.object().shape({
	_id: yup.object(),
	name: yup.string().required(),
	startDate: yup.number().required(),
	endDate: yup.number().required(),
	parent: yup.string(),
	resources: yup.object(),
	data: yup.array().of(keyValueSchema),
	subActivities: yup.array()
}).noUnknown();

// const activityTreeSchema = yup.array().of(activitySchema).required();

const activityCol = (modelId) => `${modelId}.activities`;

const cleanActivityDetail = (activity) => {
	activity._id = utils.uuidToString(activity._id);
	activity.sequenceId = utils.uuidToString(activity.sequenceId);

	if (activity.parent) {
		activity.parent = utils.uuidToString(activity.parent);
	}

	return activity;
};

const traverseActivities = (activities, callback) => {
	const visited = [];
	const indexArr = [0];

	let actual = activities[0];

	do {
		while(actual) {
			visited.push(actual);
			indexArr.push(0);
			actual = (actual.subActivities || [])[0];
		}

		if (visited.length > 0) {
			const temp = visited.pop();
			indexArr.pop(); //  Get rid of leaf index;

			const index = last(indexArr) + 1;
			indexArr[indexArr.length - 1] = index; // Set index for sibling

			const parent = last(visited);

			if (visited.length > 0) {
				actual = parent.subActivities[index];
			} else {
				actual = activities[index];
			}

			callback(temp, parent);
		}
	} while (visited.length > 0 || actual);
};

const simplifyActivity = (activity, subActivities) => {
	const id = activity._id ? utils.uuidToString(activity._id) : null;

	if (subActivities && subActivities.length) {
		subActivities = { subActivities };
	} else {
		subActivities = {};
	}

	return  { id, ...pick(activity, "name", "startDate", "endDate"), ...subActivities };
};

const simplifyActivityTree = (activities) => {
	return activities.map(activity => {
		const subActivities = activity.subActivities ? simplifyActivityTree(activity.subActivities) : null;
		return simplifyActivity(activity, subActivities);
	});
};

const getDescendantsIds = (activities, parentId, ids = []) => {
	activities.forEach(activity => {
		if (utils.uuidToString(activity.parent) === parentId) {
			ids.push(activity._id);
			getDescendantsIds(activities, utils.uuidToString(activity._id), ids);
		}
	});

	return ids;
};

/**
 * @typedef {{_id: string, parents: Array<string>}} Activity
 * @param {string} parentId
 * @param {Array<Activity>} activities;
 * @return {Array<Activity>}
 */
const getSubActivities = (parentId, activities) => {
	return activities.filter(activity => {
		const parent = activity.parent;

		if (parentId) {
			return parent && utils.uuidToString(parent) === parentId;
		} else {
			return !parent;
		}
	}).map(activity => {
		const subActivities = getSubActivities(utils.uuidToString(activity._id), activities);
		return  simplifyActivity(activity, subActivities);
	});
};

const createActivitiesTree = async(account, model, sequenceId) => {
	let activities = {};
	const foundActivities = await db.find(account, model + ".activities",{sequenceId: utils.stringToUUID(sequenceId)}); // filter by sequenceId
	activities = getSubActivities(null, foundActivities);

	return { activities };
};

const addToActivityList = (activitiesList, sequenceIdUUID) => (activity, parent) => {

	// TODO: test that _id is a bson object
	if (!activitySchema.isValidSync(activity, { strict: true })) {
		throw responseCodes.INVALID_ARGUMENTS;
	}

	if (parent && !parent._id) {
		parent._id = utils.stringToUUID(nodeuuid());
	}

	if (!activity._id) {
		activity._id = utils.stringToUUID(nodeuuid());
	}

	const plainActivity = pick(activity,"_id", "name", "startDate", "endDate", "data", "resources");
	plainActivity.sequenceId = sequenceIdUUID;

	activitiesList.push(plainActivity);
};

const SequenceActivities = {};

SequenceActivities.getSequenceActivityDetail = async (account, model, sequenceId, activityId) => {
	await Sequence.sequenceExists(account, model, sequenceId);

	const activity = await db.findOne(account, activityCol(model), {"_id": utils.stringToUUID(activityId)});

	if (!activity) {
		throw responseCodes.ACTIVITY_NOT_FOUND;
	}

	return cleanActivityDetail(activity);
};

SequenceActivities.create = async (account, model, sequenceId, activity) => {
	await Sequence.sequenceExists(account, model, sequenceId);

	if (!activitySchema.isValidSync(activity, { strict: true })) {
		throw responseCodes.INVALID_ARGUMENTS;
	}

	if (activity.parent && !await db.findOne(account,  activityCol(model), { _id: utils.stringToUUID(activity.parent)})) {
		throw responseCodes.INVALID_ARGUMENTS;
	}

	const _id = nodeuuid();
	activity = {...activity, sequenceId:  utils.stringToUUID(sequenceId), _id: utils.stringToUUID(_id)};

	await Promise.all([
		db.insert(account,  activityCol(model), activity),
		FileRef.removeFile(account, model, "activities", sequenceId)
	]);

	return {...activity, _id, sequenceId: sequenceId};
};

SequenceActivities.edit = async (account, model, sequenceId, activityId, activity) => {
	await Sequence.sequenceExists(account, model, sequenceId);

	if (!activityEditSchema.isValidSync(activity, { strict: true })) {
		throw responseCodes.INVALID_ARGUMENTS;
	}

	if (activity.parent && !await db.findOne(account, activityCol(model), { _id: utils.stringToUUID(activity.parent)})) {
		throw responseCodes.INVALID_ARGUMENTS;
	}

	const query =  {_id: utils.stringToUUID(activityId), sequenceId: utils.stringToUUID(sequenceId)};
	const {result} = await db.update(account, activityCol(model), query, {$set: activity});

	if (!result.n) {
		throw responseCodes.ACTIVITY_NOT_FOUND;
	}

	await FileRef.removeFile(account, model, "activities", sequenceId);
};

SequenceActivities.remove = async (account, model, sequenceId, activityId) => {
	await Sequence.sequenceExists(account, model, sequenceId);

	const activities = await db.find(account,activityCol(model), {sequenceId: utils.stringToUUID(sequenceId), parent:{$exists: true}} , {parent:1, _id:1});

	const idsToDelete = getDescendantsIds(activities, activityId);
	idsToDelete.push(utils.stringToUUID(activityId));

	const query = {_id:{ $in: idsToDelete}, sequenceId: utils.stringToUUID(sequenceId)};
	const {result} = await db.remove(account,  activityCol(model), query);

	if (!result.n) {
		throw responseCodes.ACTIVITY_NOT_FOUND;
	}

	await FileRef.removeFile(account, model, "activities", sequenceId);

	return { _id: activityId};
};

SequenceActivities.get = async (account, model, sequenceId) => {
	await Sequence.sequenceExists(account, model, sequenceId);

	let activities = {};

	try {
		activities = await FileRef.getSequenceActivitiesFile(account, model, utils.uuidToString(sequenceId));
	} catch(e) {
		activities = await createActivitiesTree(account, model, sequenceId);
		await FileRef.storeFile(account, activityCol(model) + ".ref", account, utils.uuidToString(nodeuuid()), JSON.stringify(activities),  {"_id": sequenceId});
	}

	return activities;
};

SequenceActivities.createActivities = async (account, model, sequenceId, activities, overwrite) => {
	await Sequence.sequenceExists(account, model, sequenceId);

	if (!yup.array().isValidSync(activities, { strict: true })) {
		throw responseCodes.INVALID_ARGUMENTS;
	}

	const activitiesList = [];
	traverseActivities(activities, addToActivityList(activitiesList, utils.stringToUUID(sequenceId)));

	await FileRef.removeFile(account, model, "activities", sequenceId);

	if(overwrite) {
		const activityTreeFile = JSON.stringify({activities: simplifyActivityTree(activities) });

		await Promise.all([
			db.deleteMany(account, activityCol(model),{}),
			FileRef.storeFile(account, activityCol(model) + ".ref", account, utils.uuidToString(nodeuuid()), activityTreeFile, {"_id": sequenceId})
		]);
	}

	await db.insertMany(account, activityCol(model), activitiesList);
};

module.exports =  SequenceActivities;