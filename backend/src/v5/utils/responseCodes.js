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
const { toCamelCase, toConstantCase } = require('./helper/strings');
const { logger } = require('./logger');

const ResponseCodes = {};

ResponseCodes.templates = {
	ok: { message: 'OK', status: 200 },

	// Auth
	notLoggedIn: { message: 'You are not logged in.', status: 401 },
	notAuthorized: { message: 'You do not have sufficient access rights for this action.', status: 401 },

	// Fail safe
	unknown: { message: 'Unknown error occured. Please contact support.', status: 500 },

	// User document related error
	userNotFound: { message: 'User not found.', status: 404 },

	// Teamspace related error
	teamspaceNotFound: { message: 'Teamspace not found.', status: 404 },

	// Project related error
	projectNotFound: { message: 'Project not found.', status: 404 },

	// Model related error
	modelNotFound: { message: 'Model not found.', status: 404 },
	invalidModelName: { message: 'Model name invalid.', status: 400 },
	duplicateModelName: { message: 'Model name already exists.', status: 400 },

	// Federation related error
	federationNotFound: { message: 'Federation not found.', status: 404 },

	// Container related error
	containerNotFound: { message: 'Container not found.', status: 404 },
	invalidContainerName: { message: 'Container name invalid.', status: 400 },
	invalidContainerCode: { message: 'Container code invalid.', status: 400 },
	invalidContainerUnit: { message: 'Container unit invalid.', status: 400 },
	invalidContainerDefaultView: { message: 'Container default view invalid.', status: 400 },
	invalidContainerDefaultLegend: { message: 'Container default legend invalid.', status: 400 },
	missingContainerName: { message: 'Container name missing.', status: 400 },
	missingContainerUnit: { message: 'Container unit missing.', status: 400 },

	// Revision related error
	revisionNotFound: { message: 'Revision not found.', status: 404 },

	// Invalid Arguements
	invalidArguments: { message: 'The arguments provided are not valid.', status: 400 },
};

Object.keys(ResponseCodes.templates).forEach((key) => {
	ResponseCodes.templates[key].code = toConstantCase(key);
});

ResponseCodes.getSwaggerComponents = () => {
	const genSchema = ({ code, message, status }) => ({
		type: 'object',
		properties: {
			code: {
				type: 'string',
				description: '3D Repo error code',
				example: code,
			},
			message: {
				type: 'string',
				description: 'A descriptive reason for the error',
				example: message,
			},
			place: {
				type: 'string',
				description: 'Endpoint this error came from',
				example: 'GET /v5/teamspaces',

			},
			status: {
				type: 'integer',
				format: 'int32',
				description: 'HTTP status code',
				example: status,
			},
		},
	});

	const responses = {};
	Object.keys(ResponseCodes.templates).forEach((key) => {
		const errRes = ResponseCodes.templates[key];
		responses[key] = {
			description: errRes.message,
			content: {
				'application/json': {
					schema: genSchema(errRes),
				},
			},
		};
	});

	return responses;
};

ResponseCodes.codeExists = (code) => !!ResponseCodes.templates[toCamelCase(code)];

ResponseCodes.createResponseCode = (errCode, message) => {
	const codeExists = ResponseCodes.codeExists(errCode?.code);
	if (!codeExists) {
		const isError = errCode instanceof Error;
		logger.logError('Unrecognised error code', isError ? JSON.stringify(errCode, ['message', 'arguments', 'type', 'name', 'stack']) : errCode);
	}
	const res = codeExists ? errCode : ResponseCodes.templates.unknown;
	return message ? { ...res, message } : res;
};

module.exports = ResponseCodes;
