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

"use strict";
const utils = require("../utils");
const db = require("../handler/db");
const ExternalServices = require("../handler/externalServices");
const matrix = require("./helper/matrix");

const dbFindOne = async (account, model, query, projection) => {
	return await db.findOne(account, model + ".scene", query, projection);
};

function cleanOne(sceneToClean) {
	if (sceneToClean) {
		if (sceneToClean._id) {
			sceneToClean._id = utils.uuidToString(sceneToClean._id);
		}

		if (sceneToClean.parents) {
			sceneToClean.parents = sceneToClean.parents.map(p => utils.uuidToString(p));
		}
	}

	return sceneToClean;
}

function clean(scenesToClean) {
	return scenesToClean.map(cleanOne);
}

const Scene = {};

Scene.findOneScene = async function (account, model, query, projection) {
	return cleanOne(await db.findOne(account, model + ".scene", query, projection));
};

Scene.findScenes = async function (account, model, query, projection) {
	return clean(await db.find(account, model + ".scene", query, projection));
};

Scene.getBySharedId = async (account, model, shared_id, revisionIds, projection = {}) => {
	return await dbFindOne(account, model, {shared_id, _id :{$in: revisionIds}}, projection);
};

Scene.getGridfsFileStream = async (account, model, filename) => {
	return await ExternalServices.getFileStream(account, model + ".scene", "gridfs", filename);
};

Scene.getObjectById = async (account, model, id, projection = {}) => {
	return await dbFindOne(account, model, {_id: id}, projection);
};

Scene.getParentMatrix = async (account, model, parent, revisionIds) => {
	const mesh = await Scene.getBySharedId(account, model, parent, revisionIds);

	if ((mesh.parents || []).length > 0) {
		const parentMatrix = await Scene.getParentMatrix(account, model, mesh.parents[0], revisionIds);
		if (mesh.matrix) {
			return matrix.multiply(parentMatrix, mesh.matrix);
		}
	}

	return mesh.matrix || matrix.getIdentity(4);
};

module.exports = Scene;
