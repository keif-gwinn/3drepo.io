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
	SYSTEMROLES_READ_ROLES,
	SYSTEMROLES_WRITE_ROLES,
	LICENSE_READ_ROLES,
	LICENSE_WRITE_ROLES,
	SYSTEM_ADMIN, 
	SUPPORT_ADMIN, 
	LICENSE_ADMIN 
	} = require('../utils/permissions/permissions.constants');
const db = require('../handler/db');
const { templates } = require('../utils/responseCodes');

const System = {};

const findByRoleID = async function(id) {
	return await db.findOne("admin", "system.roles", { _id: id});
};
const SystemQuery = (query, projection, sort) => db.findOne('admin', 'system.users', query, projection, sort);
const findMany = (query, projection, sort) => db.find('admin', 'system.users', query, projection, sort);

System.hasViewSystemRoles = async (username) => { 
	const 
}

System.hasEditSystemRoles = async (username) => { }
System.hasViewLicense = async (username) => { }
System.hasEditLicense = async (username) => { }

System.hasAccessToSystem = async (System, username) => {
	const query = { user: username, 'roles.db': SYSTEM_ADMIN };
	const userDoc = await SystemQuery(query, { _id: 1 });
	return !!userDoc;
};

module.exports = System;
