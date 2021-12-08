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

const {
	hasEditLicense,
	hasEditUserRoles,
	hasViewLicense,
	hasViewUserRoles,
} = require('../../../utils/permissions/permissions');
const { getUserFromSession } = require('../../../utils/sessions');
const { respond } = require('../../../utils/responder');
const { templates } = require('../../../utils/responseCodes');

const SystemPerms = {};

const permissionsCheckTemplate = (callback) => async (req, res, next) => {
	const { session } = req;
	const user = getUserFromSession(session);

	try {
		if (await callback(user)) {
			next();
		} else {
			respond(req, res, templates.notAuthorized);
		}
	} catch (err) {
		respond(req, res, err);
	}
};

SystemPerms.isTeamspaceMember = async (req, res, next) => {
	const { session, params } = req;
	const user = getUserFromSession(session);
	const { teamspace } = params;

	const hasAccess = await hasAccessToTeamspace(teamspace, user);
	if (teamspace && user && hasAccess) {
		next();
	} else {
		respond(req, res, templates.teamspaceNotFound);
	}
};

SystemPerms.hasViewLicense = permissionsCheckTemplate(hasViewLicense);
SystemPerms.hasEditLicense = permissionsCheckTemplate(hasEditLicense);
SystemPerms.hasViewUserRoles = permissionsCheckTemplate(hasViewUserRoles);
SystemPerms.hasEditUserRoles = permissionsCheckTemplate(hasEditUserRoles);

module.exports = SystemPerms;