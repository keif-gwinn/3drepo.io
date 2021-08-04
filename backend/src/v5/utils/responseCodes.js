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
const { toCamelCase, toSnakeCase } = require('./helper/strings');

const ResponseCodes = {};

ResponseCodes.template = {
	ok: { message: 'OK', status: 200 },

	// Auth
	notLoggedIn: { message: 'You are not logged in', status: 401 },

	// Fail safe
	unknown: { message: 'Unknown error occured. Please contact support.', status: 500 },

	// User document related error
	userNotFound: { message: 'User not found.', status: 404 },
};

Object.keys(ResponseCodes.template).forEach((key) => {
	ResponseCodes.template[key].code = toSnakeCase(key);
});

ResponseCodes.createResponseCode = (errCode, message) => {
	const res = { ...errCode } || ResponseCodes.UNKNOWN_ERROR;
	return message ? { ...res, message } : res;
};

ResponseCodes.codeExists = (code) => !!ResponseCodes.template[toCamelCase(code)];

module.exports = ResponseCodes;
