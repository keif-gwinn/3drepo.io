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

const { createResponseCode, templates } = require('../utils/responseCodes');
const db = require('../handler/db');

const User = {};
const COLL_NAME = 'system.users';

const userQuery = (query, projection, sort) => db.findOne('admin', 'system.users', query, projection, sort);

const getUser = async (user, projection) => {
	const userDoc = await userQuery({ user }, projection);
	if (!userDoc) {
		throw templates.userNotFound;
	}
	return userDoc;
};

const updateUser = async (username, action) => {
	await db.updateOne('admin', COLL_NAME, { user: username }, action);
};

User.getFavourites = async (user, teamspace) => {
	const { customData } = await getUser(user, { 'customData.starredModels': 1 });
	const favs = customData.starredModels || {};
	return favs[teamspace] || [];
};

User.getAccessibleTeamspaces = async (username) => {
	const userDoc = await getUser(username, { roles: 1 });
	return userDoc.roles.map((role) => role.db);
};

User.appendFavourites = async (username, teamspace, favouritesToAdd) => {
	const userProfile = await getUser(username, { customData: 1 });

	const favourites = userProfile.customData.starredModels || {};
	if (!favourites[teamspace]) {
		favourites[teamspace] = [];
	}

	for (const favourite of favouritesToAdd) {
		if (favourites[teamspace].indexOf(favourite) === -1) {
			favourites[teamspace].push(favourite);
		}
	}

	await updateUser(username, { $set: { 'customData.starredModels': favourites } });
};

User.deleteFavourites = async (username, teamspace, favouritesToRemove) => {
	const userProfile = await getUser(username, { customData: 1 });

	const favourites = userProfile.customData.starredModels || {};

	if (favourites[teamspace]) {
		const updatedFav = favourites[teamspace].filter((i) => !favouritesToRemove.includes(i));
		if (updatedFav.length) {
			favourites[teamspace] = updatedFav;
			await updateUser(username, { $set: { 'customData.starredModels': favourites } });
		} else {
			const action = { $unset: {} };
			action.$unset[`customData.starredModels.${teamspace}`] = '';
			await updateUser(username, action);
		}
	} else {
		throw createResponseCode(templates.invalidArguments, "The IDs provided are not in the user's favourites list");
	}
};

module.exports = User;
