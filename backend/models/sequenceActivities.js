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
const {pick} = require("lodash");

const keyValueSchema = yup.object().shape({
	key: yup.string().required(),
	value: yup.mixed().required()
});

const activityEditSchema = yup.object().shape({
	name: yup.string(),
	startDate: yup.number(),
	endDate: yup.number(),
	parent: yup.string(),
	resources: yup.object(),
	data: yup.array().of(keyValueSchema)
}).noUnknown();

const activitySchema = yup.object().shape({
	name: yup.string().required(),
	startDate: yup.number().required(),
	endDate: yup.number().required(),
	parent: yup.string(),
	resources: yup.object(),
	data: yup.array().of(keyValueSchema).required()
}).noUnknown();

const activityCol = (modelId) => `${modelId}.activities`;

const cleanActivityDetail = (activity) => {
	activity._id = utils.uuidToString(activity._id);
	activity.sequenceId = utils.uuidToString(activity.sequenceId);

	if (activity.parent) {
		activity.parent = utils.uuidToString(activity.parent);
	}

	return activity;
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
		const id = utils.uuidToString(activity._id);
		let subActivities = getSubActivities(id, activities);

		if (subActivities.length) {
			subActivities = { subActivities };
		} else {
			subActivities = {};
		}

		return  { id, ...pick(activity, "name", "startDate", "endDate"), ...subActivities };
	});
};

const createActivitiesTree = async(account, model, sequenceId) => {
	const foundActivities = await db.find(account, model + ".activities",{sequenceId: utils.stringToUUID(sequenceId)}); // filter by sequenceId
	const activities = getSubActivities(null, foundActivities);

	return { activities };
};

const SequenceActivities = {};

SequenceActivities.getSequenceActivityDetail = async (account, model, sequenceId, activityId) => {
	const sequence = await db.findOne(account, model + ".sequences", { _id: utils.stringToUUID(sequenceId)});

	if (!sequence) {
		throw responseCodes.SEQUENCE_NOT_FOUND;
	}

	const activity = await db.findOne(account, activityCol(model), {"_id": utils.stringToUUID(activityId)});

	if (!activity) {
		throw responseCodes.ACTIVITY_NOT_FOUND;
	}

	return cleanActivityDetail(activity);
};

SequenceActivities.create = async (account, model, sequenceId, activity) => {
	const sequence = await db.findOne(account, model + ".sequences", { _id: utils.stringToUUID(sequenceId)});

	if (!sequence) {
		throw responseCodes.SEQUENCE_NOT_FOUND;
	}

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
	const sequence = await db.findOne(account, model + ".sequences", { _id: utils.stringToUUID(sequenceId)});

	if (!sequence) {
		throw responseCodes.SEQUENCE_NOT_FOUND;
	}

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
	const sequence = await db.findOne(account, model + ".sequences", { _id: utils.stringToUUID(sequenceId)});

	if (!sequence) {
		throw responseCodes.SEQUENCE_NOT_FOUND;
	}

	const query =  {_id: utils.stringToUUID(activityId), sequenceId: utils.stringToUUID(sequenceId)};
	const {result} = await db.remove(account,  activityCol(model), query);

	if (!result.n) {
		throw responseCodes.ACTIVITY_NOT_FOUND;
	}

	await FileRef.removeFile(account, model, "activities", sequenceId);

	return { _id: activityId};
};

SequenceActivities.get = async (account, model, sequenceId) => {
	const sequence = await db.findOne(account, model + ".sequences", { _id: utils.stringToUUID(sequenceId)});

	if (!sequence) {
		throw responseCodes.SEQUENCE_NOT_FOUND;
	}

	let activities = {};
	try {
		activities = await FileRef.getSequenceActivitiesFile(account, model, utils.uuidToString(sequenceId));
	} catch(e) {
		activities = await createActivitiesTree(account, model, sequenceId);
		await FileRef.storeFile(account, activityCol(model) + ".ref", account, utils.uuidToString(nodeuuid()), JSON.stringify(activities),  {"_id": sequenceId});
	}

	return activities;
};

module.exports =  SequenceActivities;