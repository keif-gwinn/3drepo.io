/**
 *  Copyright (C) 2022 3D Repo Ltd
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

const { src } = require('../../../../../../helper/path');
const { generateRandomString, generateTemplate, generateTicket } = require('../../../../../../helper/services');

const Tickets = require(`${src}/processors/teamspaces/projects/models/commons/tickets`);

const { propTypes } = require(`${src}/schemas/tickets/templates.constants`);

jest.mock('../../../../../../../../src/v5/models/tickets');
const TicketsModel = require(`${src}/models/tickets`);
const { TICKETS_RESOURCES_COL } = require(`${src}/models/tickets.constants`);

jest.mock('../../../../../../../../src/v5/services/filesManager');
const FilesManager = require(`${src}/services/filesManager`);

const generatePropData = (buffer, isView) => (isView ? { screenshot: buffer } : buffer);

const generateImageTestData = (isView) => {
	const propName = generateRandomString();
	const moduleName = generateRandomString();

	const propTypeToTest = isView ? propTypes.VIEW : propTypes.IMAGE;

	const template = {
		properties: [
			{
				name: propName,
				type: propTypeToTest,
			},
		],
		modules: [
			{
				name: moduleName,
				properties: [
					{
						name: propName,
						type: propTypeToTest,
					},
				],
			},
			{
				type: 'safetibase',
			},
		],
	};

	const propBuffer = Buffer.from(generateRandomString());
	const modPropBuffer = Buffer.from(generateRandomString());

	const ticket = {
		_id: generateRandomString(),
		title: generateRandomString(),
		properties: {
			[propName]: generatePropData(propBuffer, isView),
		},
		modules: {
			[moduleName]: {
				[propName]: generatePropData(modPropBuffer, isView),
			},
		},
	};

	return { template, ticket, propName, moduleName, propBuffer, modPropBuffer };
};

const addTicketImageTest = async (isView) => {
	const teamspace = generateRandomString();
	const project = generateRandomString();
	const model = generateRandomString();
	const expectedOutput = generateRandomString();

	const imageTestData = generateImageTestData(isView);

	TicketsModel.addTicket.mockResolvedValueOnce(expectedOutput);

	await expect(Tickets.addTicket(teamspace, project, model, imageTestData.ticket, imageTestData.template))
		.resolves.toEqual(expectedOutput);

	const processedTicket = TicketsModel.addTicket.mock.calls[0][3];
	const propRef = isView ? processedTicket.properties[imageTestData.propName].screenshot
		: processedTicket.properties[imageTestData.propName];
	const modPropRef = isView ? processedTicket.modules[imageTestData.moduleName][imageTestData.propName].screenshot
		: processedTicket.modules[imageTestData.moduleName][imageTestData.propName];

	expect(TicketsModel.addTicket).toHaveBeenCalledTimes(1);
	expect(TicketsModel.addTicket).toHaveBeenCalledWith(teamspace, project, model,
		{
			...imageTestData.ticket,
			properties: { [imageTestData.propName]: generatePropData(propRef, isView) },
			modules: {
				[imageTestData.moduleName]: {
					[imageTestData.propName]: generatePropData(modPropRef, isView),
				},
			},
		});

	const meta = { teamspace, project, model, ticket: expectedOutput };
	expect(FilesManager.storeFile).toHaveBeenCalledTimes(2);
	expect(FilesManager.storeFile).toHaveBeenCalledWith(
		teamspace, TICKETS_RESOURCES_COL, propRef, imageTestData.propBuffer, meta,
	);
	expect(FilesManager.storeFile).toHaveBeenCalledWith(
		teamspace, TICKETS_RESOURCES_COL, modPropRef, imageTestData.modPropBuffer, meta,
	);
};

const updateTicketImageTest = async (isView) => {
	const teamspace = generateRandomString();
	const project = generateRandomString();
	const model = generateRandomString();

	const imageTestData = generateImageTestData(isView);
	const updatePropBuffer = Buffer.from(generateRandomString());
	const updateModPropBuffer = Buffer.from(generateRandomString());
	const updateData = {
		properties: {
			[imageTestData.propName]: generatePropData(updatePropBuffer, isView),
		},
		modules: {
			[imageTestData.moduleName]: {
				[imageTestData.propName]: generatePropData(updateModPropBuffer, isView),
			},
		},
	};

	await expect(Tickets.updateTicket(teamspace, project, model, imageTestData.template,
		imageTestData.ticket, updateData)).resolves.toBeUndefined();

	const processedTicket = TicketsModel.updateTicket.mock.calls[0][2];
	const propRef = isView ? processedTicket.properties[imageTestData.propName].screenshot
		: processedTicket.properties[imageTestData.propName];
	const modPropRef = isView ? processedTicket.modules[imageTestData.moduleName][imageTestData.propName].screenshot
		: processedTicket.modules[imageTestData.moduleName][imageTestData.propName];

	expect(TicketsModel.updateTicket).toHaveBeenCalledTimes(1);
	expect(TicketsModel.updateTicket).toHaveBeenCalledWith(teamspace, imageTestData.ticket._id,
		{
			properties: { [imageTestData.propName]: generatePropData(propRef, isView) },
			modules: {
				[imageTestData.moduleName]: {
					[imageTestData.propName]: generatePropData(modPropRef, isView),
				},
			},
		});

	const meta = { teamspace, project, model, ticket: imageTestData.ticket._id };
	expect(FilesManager.storeFile).toHaveBeenCalledTimes(2);
	expect(FilesManager.storeFile).toHaveBeenCalledWith(
		teamspace, TICKETS_RESOURCES_COL, propRef, updatePropBuffer, meta,
	);
	expect(FilesManager.storeFile).toHaveBeenCalledWith(
		teamspace, TICKETS_RESOURCES_COL, modPropRef, updateModPropBuffer, meta,
	);
	expect(FilesManager.removeFile).toHaveBeenCalledTimes(2);

	const imagePropBuffer = isView
		? imageTestData.ticket.properties[imageTestData.propName].screenshot
		: imageTestData.ticket.properties[imageTestData.propName];

	const viewPropBuffer = isView
		? imageTestData.ticket.modules[imageTestData.moduleName][imageTestData.propName].screenshot
		: imageTestData.ticket.modules[imageTestData.moduleName][imageTestData.propName];

	expect(FilesManager.removeFile).toHaveBeenCalledWith(
		teamspace, TICKETS_RESOURCES_COL, imagePropBuffer,
	);
	expect(FilesManager.removeFile).toHaveBeenCalledWith(
		teamspace, TICKETS_RESOURCES_COL, viewPropBuffer,
	);
};

const testAddTicket = () => {
	describe('Add ticket', () => {
		test('should call addTicket in model and return whatever it returns', async () => {
			const teamspace = generateRandomString();
			const project = generateRandomString();
			const model = generateRandomString();
			const template = generateTemplate();
			const ticket = generateTicket(template);

			const expectedOutput = generateRandomString();

			TicketsModel.addTicket.mockResolvedValueOnce(expectedOutput);

			await expect(Tickets.addTicket(teamspace, project, model, ticket, template))
				.resolves.toEqual(expectedOutput);

			expect(TicketsModel.addTicket).toHaveBeenCalledTimes(1);
			expect(TicketsModel.addTicket).toHaveBeenCalledWith(teamspace, project, model, ticket);

			expect(FilesManager.storeFile).not.toHaveBeenCalled();
		});

		test('should process image and store a ref', () => addTicketImageTest());
		test('should process screenshot from view data and store a ref', () => addTicketImageTest(true));
	});
};

const testUpdateTicket = () => {
	describe('Update ticket', () => {
		test('should call updateTicket in model', async () => {
			const teamspace = generateRandomString();
			const project = generateRandomString();
			const model = generateRandomString();
			const template = generateTemplate();
			const ticket = generateTicket(template);
			const updateData = {
				title: generateRandomString(),
				properties: {},
			};

			await expect(Tickets.updateTicket(teamspace, project, model, template, ticket, updateData))
				.resolves.toBeUndefined();

			expect(TicketsModel.updateTicket).toHaveBeenCalledTimes(1);
			expect(TicketsModel.updateTicket).toHaveBeenCalledWith(teamspace, ticket._id, updateData);

			expect(FilesManager.storeFile).not.toHaveBeenCalled();
			expect(FilesManager.removeFile).not.toHaveBeenCalled();
		});

		test('should process image and store a ref', () => updateTicketImageTest());
		test('should process screenshot from view data and store a ref', () => updateTicketImageTest(true));
	});
};

const testGetTicketResourceAsStream = () => {
	describe('Get ticket resource', () => {
		const teamspace = generateRandomString();
		const project = generateRandomString();
		const model = generateRandomString();
		const resource = generateRandomString();
		const ticket = generateRandomString();
		test('Should call getFileWithMetaAsStream and return whatever it returns', async () => {
			const expectedOutput = generateRandomString();
			FilesManager.getFileWithMetaAsStream.mockResolvedValueOnce(expectedOutput);

			await expect(Tickets.getTicketResourceAsStream(teamspace,
				project, model, ticket, resource)).resolves.toEqual(expectedOutput);

			expect(FilesManager.getFileWithMetaAsStream).toHaveBeenCalledTimes(1);
			expect(FilesManager.getFileWithMetaAsStream).toHaveBeenCalledWith(teamspace,
				TICKETS_RESOURCES_COL, resource, { teamspace, project, model, ticket });
		});

		test('Should throw whatever error getFileWithMetaAsStream thrown', async () => {
			const expectedOutput = generateRandomString();
			FilesManager.getFileWithMetaAsStream.mockRejectedValueOnce(expectedOutput);

			await expect(Tickets.getTicketResourceAsStream(teamspace,
				project, model, ticket, resource)).rejects.toEqual(expectedOutput);
		});
	});
};

const testGetTicketById = () => {
	describe('Get ticket by Id', () => {
		test('should call getTicketById in model and return whatever it returns', async () => {
			const teamspace = generateRandomString();
			const project = generateRandomString();
			const model = generateRandomString();
			const ticket = generateRandomString();

			const expectedOutput = generateRandomString();

			TicketsModel.getTicketById.mockResolvedValueOnce(expectedOutput);

			await expect(Tickets.getTicketById(teamspace, project, model, ticket))
				.resolves.toEqual(expectedOutput);

			expect(TicketsModel.getTicketById).toHaveBeenCalledTimes(1);
			expect(TicketsModel.getTicketById).toHaveBeenCalledWith(teamspace, project, model, ticket);
		});
	});
};

describe('processors/teamspaces/projects/models/commons/tickets', () => {
	testAddTicket();
	testGetTicketResourceAsStream();
	testGetTicketById();
	testUpdateTicket();
});