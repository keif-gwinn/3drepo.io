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

const SuperTest = require('supertest');
const FS = require('fs');
const ServiceHelper = require('../../../../../helper/services');
const { src, image } = require('../../../../../helper/path');

const { propTypes, presetEnumValues, presetModules } = require(`${src}/schemas/tickets/templates.constants`);

const { templates } = require(`${src}/utils/responseCodes`);
const { generateFullSchema } = require(`${src}/schemas/tickets/templates`);

let server;
let agent;

const users = {
	tsAdmin: ServiceHelper.generateUserCredentials(),
	viewer: ServiceHelper.generateUserCredentials(),
	noProjectAccess: ServiceHelper.generateUserCredentials(),
	nobody: ServiceHelper.generateUserCredentials(),
};

const teamspace = ServiceHelper.generateRandomString();

const project = ServiceHelper.generateRandomProject();

const models = [
	ServiceHelper.generateRandomModel({ viewers: [users.viewer.user] }),
	ServiceHelper.generateRandomModel({ viewers: [users.viewer.user] }),
	ServiceHelper.generateRandomModel({ isFederation: true }),
];

const modelWithTemplates = models[0];
const fed = models[2];

const templateWithAllModulesAndPresetEnums = {
	...ServiceHelper.generateTemplate(),
	config: {
		comments: true,
		issueProperties: true,
		attachments: true,
		defaultView: true,
		defaultImage: true,
		pin: true,
	},
	properties: Object.values(presetEnumValues).map((values) => ({
		name: ServiceHelper.generateRandomString(),
		type: propTypes.ONE_OF,
		values,
	})),
	modules: Object.values(presetModules).map((type) => ({ type, properties: [] })),
};

const templateWithImage = {
	...ServiceHelper.generateTemplate(),
	properties: [{
		name: ServiceHelper.generateRandomString(),
		type: propTypes.IMAGE,
	}],
};

const ticketTemplates = [
	ServiceHelper.generateTemplate(),
	ServiceHelper.generateTemplate(true),
	ServiceHelper.generateTemplate(),
	ServiceHelper.generateTemplate(true),
	templateWithAllModulesAndPresetEnums,
	templateWithImage,
];

const setupData = async () => {
	await ServiceHelper.db.createTeamspace(teamspace, [users.tsAdmin.user]);

	const userProms = Object.keys(users).map((key) => ServiceHelper.db.createUser(users[key], key !== 'nobody' ? [teamspace] : []));
	const modelProms = models.map((model) => ServiceHelper.db.createModel(
		teamspace,
		model._id,
		model.name,
		model.properties,
	));
	return Promise.all([
		...userProms,
		...modelProms,
		ServiceHelper.db.createProject(teamspace, project.id, project.name, models.map(({ _id }) => _id)),
		ServiceHelper.db.createTemplates(teamspace, ticketTemplates),
	]);
};
const testGetAllTemplates = () => {
	const route = (key, projectId = project.id, modelId = modelWithTemplates._id) => `/v5/teamspaces/${teamspace}/projects/${projectId}/containers/${modelId}/tickets/templates${key ? `?key=${key}` : ''}`;
	describe.each([
		['the user does not have a valid session', false, templates.notLoggedIn],
		['the user is not a member of the teamspace', false, templates.teamspaceNotFound, undefined, undefined, users.nobody.apiKey],
		['the project does not exist', false, templates.projectNotFound, ServiceHelper.generateRandomString(), undefined, users.tsAdmin.apiKey],
		['the container does not exist', false, templates.containerNotFound, project.id, ServiceHelper.generateRandomString(), users.tsAdmin.apiKey],
		['the container provided is a federation', false, templates.containerNotFound, project.id, fed._id, users.tsAdmin.apiKey],
		['the user does not have access to the container', false, templates.notAuthorized, undefined, undefined, users.noProjectAccess.apiKey],
		['should provide the list of templates that are not deprecated', true,
			{ templates: ticketTemplates.flatMap(({ _id, name, deprecated, code }) => (deprecated ? []
				: { _id, name, code })) },
			undefined, undefined, users.tsAdmin.apiKey],
		['should provide the list of templates including deprecated if the flag is set', true,
			{ templates: ticketTemplates.map(({ _id, name, code, deprecated }) => ({ _id, name, code, deprecated })) },
			undefined, undefined, users.tsAdmin.apiKey, true],

	])('Get all templates', (desc, success, expectedOutput, projectId, modelId, key, showDeprecated) => {
		test(`should ${success ? 'succeed' : 'fail'} if ${desc}`, async () => {
			const expectedStatus = success ? templates.ok.status : expectedOutput.status;
			const endpoint = route(key, projectId, modelId);
			const res = await agent.get(`${endpoint}${showDeprecated ? '&showDeprecated=true' : ''}`).expect(expectedStatus);

			if (success) {
				expect(res.body).toEqual(expectedOutput);
			} else {
				expect(res.body.code).toEqual(expectedOutput.code);
			}
		});
	});
};

const testGetTemplateDetails = () => {
	const route = (key, projectId = project.id, modelId = modelWithTemplates._id, templateId = ticketTemplates[0]._id) => `/v5/teamspaces/${teamspace}/projects/${projectId}/containers/${modelId}/tickets/templates/${templateId}${key ? `?key=${key}` : ''}`;
	const pruneDeprecated = (template) => {
		// eslint-disable-next-line no-param-reassign
		template.properties = template.properties.filter(({ deprecated }) => !deprecated);
		// eslint-disable-next-line no-param-reassign
		template.modules = template.modules.filter((mod) => {
			// eslint-disable-next-line no-param-reassign
			mod.properties = mod.properties.filter(({ deprecated }) => !deprecated);
			return !mod.deprecated;
		});

		return template;
	};
	describe.each([
		['the user does not have a valid session', false, templates.notLoggedIn],
		['the user is not a member of the teamspace', false, templates.teamspaceNotFound, undefined, undefined, undefined, users.nobody.apiKey],
		['the project does not exist', false, templates.projectNotFound, ServiceHelper.generateRandomString(), undefined, undefined, users.tsAdmin.apiKey],
		['the container does not exist', false, templates.containerNotFound, project.id, ServiceHelper.generateRandomString(), undefined, users.tsAdmin.apiKey],
		['the container provided is a federation', false, templates.containerNotFound, project.id, fed._id, undefined, users.tsAdmin.apiKey],
		['the user does not have access to the container', false, templates.notAuthorized, undefined, undefined, undefined, users.noProjectAccess.apiKey],
		['the template id is invalid', false, templates.templateNotFound, undefined, undefined, ServiceHelper.generateRandomString(), users.tsAdmin.apiKey],
		['should return the full template', true, generateFullSchema(ticketTemplates[0]), undefined, undefined, undefined, users.tsAdmin.apiKey, true],
		['should return the full template without deprecated fields', true, pruneDeprecated(generateFullSchema(ticketTemplates[0])), undefined, undefined, undefined, users.tsAdmin.apiKey],
	])('Get template details', (desc, success, expectedOutput, projectId, modelId, templateId, key, showDeprecated) => {
		test(`should ${success ? 'succeed' : 'fail'} if ${desc}`, async () => {
			const expectedStatus = success ? templates.ok.status : expectedOutput.status;
			const endpoint = route(key, projectId, modelId, templateId);
			const res = await agent.get(`${endpoint}${showDeprecated ? '&showDeprecated=true' : ''}`).expect(expectedStatus);

			if (success) {
				expect(res.body).toEqual(expectedOutput);
			} else {
				expect(res.body.code).toEqual(expectedOutput.code);
			}
		});
	});
};

const addTicketRoute = (key, projectId = project.id, modelId = modelWithTemplates._id) => `/v5/teamspaces/${teamspace}/projects/${projectId}/containers/${modelId}/tickets${key ? `?key=${key}` : ''}`;

const testAddTicket = () => {
	describe.each([
		['the user does not have a valid session', false, templates.notLoggedIn],
		['the user is not a member of the teamspace', false, templates.teamspaceNotFound, undefined, undefined, users.nobody.apiKey],
		['the project does not exist', false, templates.projectNotFound, ServiceHelper.generateRandomString(), undefined, users.tsAdmin.apiKey],
		['the container does not exist', false, templates.containerNotFound, project.id, ServiceHelper.generateRandomString(), users.tsAdmin.apiKey],
		['the container provided is a federation', false, templates.containerNotFound, project.id, fed._id, users.tsAdmin.apiKey],
		['the user does not have access to the container', false, templates.notAuthorized, undefined, undefined, users.noProjectAccess.apiKey],
		['the templateId provided does not exist', false, templates.templateNotFound, undefined, undefined, users.tsAdmin.apiKey, { type: ServiceHelper.generateRandomString() }],
		['the templateId is not provided', false, templates.invalidArguments, undefined, undefined, users.tsAdmin.apiKey, { type: undefined }],
		['the ticket data does not conforms to the template', false, templates.invalidArguments, undefined, undefined, users.tsAdmin.apiKey, { properties: { [ServiceHelper.generateRandomString()]: ServiceHelper.generateRandomString() } }],
		['the ticket data conforms to the template', true, undefined, undefined, undefined, users.tsAdmin.apiKey],
		['the ticket data conforms to the template but the user is a viewer', false, templates.notAuthorized, undefined, undefined, users.viewer.apiKey],
		['the ticket has a template that contains all preset modules, preset enums and configs', true, undefined, undefined, undefined, users.tsAdmin.apiKey, { properties: {}, modules: {}, type: templateWithAllModulesAndPresetEnums._id }],
	])('Add Ticket', (desc, success, expectedOutput, projectId, modelId, key, payloadChanges = {}) => {
		test(`should ${success ? 'succeed' : 'fail'} if ${desc}`, async () => {
			const payload = { ...ServiceHelper.generateTicket(ticketTemplates[0]), ...payloadChanges };

			const expectedStatus = success ? templates.ok.status : expectedOutput.status;
			const endpoint = addTicketRoute(key, projectId, modelId);

			const res = await agent.post(endpoint).send(payload).expect(expectedStatus);

			if (success) {
				// TODO : should check ticket is saved (when we have coded in the Get ticket function)
				expect(res.body._id).not.toBeUndefined();
			} else {
				expect(res.body.code).toEqual(expectedOutput.code);
			}
		});
	});
};

const testGetTicketResource = () => {
	const route = (key, projectId = project.id, modelId = modelWithTemplates._id, ticketId, resourceId) => `/v5/teamspaces/${teamspace}/projects/${projectId}/containers/${modelId}/tickets/${ticketId}/resources/${resourceId}${key ? `?key=${key}` : ''}`;
	describe('Get ticket resource', () => {
		let ticketID;
		let resourceID;

		beforeAll(async () => {
			const ticket = {
				type: templateWithImage._id,
				properties: {
					[templateWithImage.properties[0].name]: FS.readFileSync(image, { encoding: 'base64' }),
				},
			};
			const endpoint = addTicketRoute(users.tsAdmin.apiKey);
			const res = await agent.post(endpoint).send(ticket);
			ticketID = res.body._id;

			// TODO: get resource ID by getting the ticket data
		});

		describe.each([
			['the user does not have a valid session', templates.notLoggedIn],
			['the user is not a member of the teamspace', templates.teamspaceNotFound, undefined, undefined, undefined, undefined, users.nobody.apiKey],
			['the project does not exist', templates.projectNotFound, ServiceHelper.generateRandomString(), undefined, undefined, undefined, users.tsAdmin.apiKey],
			['the container does not exist', templates.containerNotFound, project.id, ServiceHelper.generateRandomString(), undefined, undefined, users.tsAdmin.apiKey],
			['the container provided is a federation', templates.containerNotFound, project.id, fed._id, undefined, undefined, users.tsAdmin.apiKey],
			['the user does not have access to the container', templates.notAuthorized, undefined, undefined, undefined, undefined, users.noProjectAccess.apiKey],
			['the ticket does not exist', templates.fileNotFound, undefined, undefined, ServiceHelper.generateRandomString(), undefined, users.tsAdmin.apiKey],
			['the resource does not exist', templates.fileNotFound, undefined, undefined, undefined, ServiceHelper.generateRandomString(), users.tsAdmin.apiKey],
		])('Error checks', (desc, expectedOutput, projectId, modelId, ticket, resource, key) => {
			test(`should fail with ${expectedOutput.code} if ${desc}`, async () => {
				const endpoint = route(key, projectId, modelId, ticket ?? ticketID, resource ?? resourceID);

				const res = await agent.get(endpoint).expect(expectedOutput.status);
				expect(res.body.code).toEqual(expectedOutput.code);
			});
		});

		// TODO: test for success (need the get api done);
	});
};

describe('E2E routes/teamspaces/projects/containers/tickets', () => {
	beforeAll(async () => {
		server = await ServiceHelper.app();
		agent = await SuperTest(server);
		await setupData();
	});
	afterAll(() => ServiceHelper.closeApp(server));

	testGetAllTemplates();
	testGetTemplateDetails();
	testAddTicket();
	testGetTicketResource();
});
