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
const { getLatestRevision, getRevisionCount, getRevisions } = require('../../../../models/revisions');
const { hasProjectAdminPermissions, isTeamspaceAdmin } = require('../../../../utils/permissions/permissions');
const { UUIDToString } = require('../../../../utils/helper/uuids');
const { getFavourites } = require('../../../../models/users');
const { getProjectById } = require('../../../../models/projects');

const Containers = {};

Containers.getContainerList = async (teamspace, project, user) => {
	const { permissions, models } = await getProjectById(teamspace, project, { permissions: 1, models: 1 });

	const [isTSAdmin, modelSettings, favourites] = await Promise.all([
		isTeamspaceAdmin(teamspace, user),
		getContainers(teamspace, models, { _id: 1, name: 1, permissions: 1 }),
		getFavourites(user, teamspace),
	]);

	const isAdmin = isTSAdmin || hasProjectAdminPermissions(permissions, user);

	return modelSettings.flatMap(({ _id, name, permissions: modelPerms }) => {
		const perm = modelPerms ? modelPerms.find((entry) => entry.user === user) : undefined;
		return (!isAdmin && !perm)
			? [] : { _id, name, role: isAdmin ? 'admin' : perm.permission, isFavourite: favourites.includes(_id) };
	});
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

module.exports = Containers;
