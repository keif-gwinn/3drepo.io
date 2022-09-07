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

const { src } = require('../../../../../../../../helper/path');
const { generateRandomString } = require('../../../../../../../../helper/services');

jest.mock('../../../../../../../../../../src/v5/utils/responder');
const Responder = require(`${src}/utils/responder`);

jest.mock('../../../../../../../../../../src/v5/middleware/dataConverter/inputs/teamspaces/settings');
const SettingsMW = require(`${src}/middleware/dataConverter/inputs/teamspaces/settings`);

jest.mock('../../../../../../../../../../src/v5/schemas/tickets');
const TicketSchema = require(`${src}/schemas/tickets`);

const Tickets = require(`${src}/middleware/dataConverter/inputs/teamspaces/projects/models/commons/tickets`);
const { createResponseCode, templates } = require(`${src}/utils/responseCodes`);
const { stringToUUID, generateUUIDString } = require(`${src}/utils/helper/uuids`);

const testValidateNewTicket = () => {
	describe('Validate new ticket', () => {
		test(`Should respond with ${templates.invalidArguments.code} if template type is not provided`, async () => {
			const fn = jest.fn();
			const req = { body: {} };
			const res = {};
			await Tickets.validateNewTicket(req, res, fn);
			expect(fn).not.toHaveBeenCalled();
			expect(Responder.respond).toHaveBeenCalledTimes(1);
			expect(Responder.respond).toHaveBeenCalledWith(req, res,
				createResponseCode(templates.invalidArguments, 'Template type must be provided'));
		});

		test('Should not call next if template doesn\'t exist', async () => {
			const fn = jest.fn();
			const templateId = generateUUIDString();
			const req = { params: {}, body: { type: templateId } };
			const res = {};

			SettingsMW.checkTicketTemplateExists.mockImplementationOnce(() => {});

			await Tickets.validateNewTicket(req, res, fn);

			expect(fn).not.toHaveBeenCalled();
			expect(req.params.template).toEqual(stringToUUID(templateId));
		});

		test(`Should respond with ${templates.invalidArguments.code} if the template is deprecated`, async () => {
			const fn = jest.fn();
			const templateId = generateUUIDString();
			const req = { params: {}, body: { type: templateId } };
			const res = {};

			SettingsMW.checkTicketTemplateExists.mockImplementationOnce(async (_req, _res, next) => {
				// eslint-disable-next-line no-param-reassign
				_req.templateData = { deprecated: true };
				await next();
			});

			await Tickets.validateNewTicket(req, res, fn);

			expect(Responder.respond).toHaveBeenCalledTimes(1);
			expect(Responder.respond).toHaveBeenCalledWith(req, res,
				createResponseCode(templates.invalidArguments, 'Template type has been deprecated'));

			expect(fn).not.toHaveBeenCalled();
		});

		test(`Should respond with ${templates.invalidArguments.code} if the validation failed`, async () => {
			const fn = jest.fn();
			const templateId = generateUUIDString();
			const req = { params: {}, body: { type: templateId } };
			const res = {};

			SettingsMW.checkTicketTemplateExists.mockImplementationOnce(async (_req, _res, next) => {
				// eslint-disable-next-line no-param-reassign
				_req.templateData = { };
				await next();
			});

			const errMsg = generateRandomString();
			TicketSchema.validateTicket.mockRejectedValueOnce(new Error(errMsg));

			await Tickets.validateNewTicket(req, res, fn);

			expect(Responder.respond).toHaveBeenCalledTimes(1);
			expect(Responder.respond).toHaveBeenCalledWith(req, res,
				createResponseCode(templates.invalidArguments, errMsg));

			expect(fn).not.toHaveBeenCalled();
		});

		test(`Should respond with ${templates.invalidArguments.code} if the processing read only values failed`, async () => {
			const fn = jest.fn();
			const templateId = generateUUIDString();
			const req = { params: {}, body: { type: templateId } };
			const res = {};

			SettingsMW.checkTicketTemplateExists.mockImplementationOnce(async (_req, _res, next) => {
				// eslint-disable-next-line no-param-reassign
				_req.templateData = { };
				await next();
			});

			const errMsg = generateRandomString();
			TicketSchema.validateTicket.mockResolvedValueOnce(req.body);
			TicketSchema.processReadOnlyValues.mockImplementationOnce(() => { throw new Error(errMsg); });

			await Tickets.validateNewTicket(req, res, fn);

			expect(Responder.respond).toHaveBeenCalledTimes(1);
			expect(Responder.respond).toHaveBeenCalledWith(req, res,
				createResponseCode(templates.invalidArguments, errMsg));

			expect(fn).not.toHaveBeenCalled();
		});

		test('Should call next if validation succeeded', async () => {
			const fn = jest.fn();
			const templateId = generateUUIDString();
			const req = { params: {}, body: { type: templateId } };
			const res = {};

			SettingsMW.checkTicketTemplateExists.mockImplementationOnce(async (_req, _res, next) => {
				// eslint-disable-next-line no-param-reassign
				_req.templateData = { };
				await next();
			});

			TicketSchema.validateTicket.mockResolvedValueOnce(req.body);

			await Tickets.validateNewTicket(req, res, fn);

			expect(fn).toHaveBeenCalled();
			expect(Responder.respond).not.toHaveBeenCalled();
		});
	});
};

const testValidateUpdateTicket = () => {
	describe('Validate update ticket', () => {
		test('Should not call next if ticket doesn\'t exist', async () => {
			const fn = jest.fn();
			const req = { params: {}, body: { } };
			const res = {};

			SettingsMW.checkTicketExists.mockImplementationOnce(() => {});

			await Tickets.validateUpdateTicket(req, res, fn);
			expect(fn).not.toHaveBeenCalled();
		});

		test(`Should respond with ${templates.invalidArguments.code} if the validation failed`, async () => {
			const fn = jest.fn();
			const req = { params: {}, body: { } };
			const res = {};

			SettingsMW.checkTicketExists.mockImplementationOnce(async (_req, _res, next) => {
				/* eslint-disable no-param-reassign */
				_req.templateData = { };
				_req.ticketData = { };
				/* eslint-enable no-param-reassign */

				await next();
			});

			const errMsg = generateRandomString();
			TicketSchema.validateTicket.mockRejectedValueOnce(new Error(errMsg));

			await Tickets.validateUpdateTicket(req, res, fn);

			expect(Responder.respond).toHaveBeenCalledTimes(1);
			expect(Responder.respond).toHaveBeenCalledWith(req, res,
				createResponseCode(templates.invalidArguments, errMsg));
			expect(fn).not.toHaveBeenCalled();
		});

		test(`Should respond with ${templates.invalidArguments.code} if the processing read only values failed`, async () => {
			const fn = jest.fn();
			const req = { params: {}, body: { } };
			const res = {};

			SettingsMW.checkTicketExists.mockImplementationOnce(async (_req, _res, next) => {
				/* eslint-disable no-param-reassign */
				_req.templateData = { };
				_req.ticketData = { };
				/* eslint-enable no-param-reassign */
				await next();
			});

			const errMsg = generateRandomString();
			TicketSchema.validateTicket.mockResolvedValueOnce(req.body);
			TicketSchema.processReadOnlyValues.mockImplementationOnce(() => { throw new Error(errMsg); });

			await Tickets.validateUpdateTicket(req, res, fn);

			expect(Responder.respond).toHaveBeenCalledTimes(1);
			expect(Responder.respond).toHaveBeenCalledWith(req, res,
				createResponseCode(templates.invalidArguments, errMsg));

			expect(fn).not.toHaveBeenCalled();
		});

		test('Should call next if validation succeeded', async () => {
			const fn = jest.fn();
			const req = { params: {}, body: { } };
			const res = {};

			SettingsMW.checkTicketExists.mockImplementationOnce(async (_req, _res, next) => {
				/* eslint-disable no-param-reassign */
				_req.templateData = { };
				_req.ticketData = { };
				/* eslint-enable no-param-reassign */
				await next();
			});

			TicketSchema.validateTicket.mockResolvedValueOnce(req.body);

			await Tickets.validateUpdateTicket(req, res, fn);

			expect(fn).toHaveBeenCalled();
			expect(Responder.respond).not.toHaveBeenCalled();
		});

		test('Should call next and set safetibase module props if user wants to update safetibase module', async () => {
			const safetiBaseProp1 = generateRandomString();
			const safetiBaseProp2 = generateRandomString();
			const fn = jest.fn();
			const req = { params: {}, body: { modules: { safetibase: { safetiBaseProp2 } } } };
			const res = {};

			SettingsMW.checkTicketExists.mockImplementationOnce(async (_req, _res, next) => {
				/* eslint-disable no-param-reassign */
				_req.templateData = { };
				_req.ticketData = { modules: { safetibase: { safetiBaseProp1 } } };
				/* eslint-enable no-param-reassign */
				await next();
			});

			TicketSchema.validateTicket.mockResolvedValueOnce(req.body);

			await Tickets.validateUpdateTicket(req, res, fn);

			expect(fn).toHaveBeenCalled();
			expect(req.body.modules.safetibase).toEqual({ safetiBaseProp1, safetiBaseProp2 });
			expect(Responder.respond).not.toHaveBeenCalled();
		});

		test('Should call next if validation succeeded and the template is deprecated', async () => {
			const fn = jest.fn();
			const req = { params: {}, body: { } };
			const res = {};

			SettingsMW.checkTicketExists.mockImplementationOnce(async (_req, _res, next) => {
				/* eslint-disable no-param-reassign */
				_req.templateData = { deprecated: true };
				_req.ticketData = { };
				/* eslint-enable no-param-reassign */
				await next();
			});

			TicketSchema.validateTicket.mockResolvedValueOnce(req.body);

			await Tickets.validateUpdateTicket(req, res, fn);

			expect(fn).toHaveBeenCalled();
			expect(Responder.respond).not.toHaveBeenCalled();
		});
	});
};

describe('middleware/dataConverter/inputs/teamspaces/projects/models/commons/tickets', () => {
	testValidateNewTicket();
	testValidateUpdateTicket();
});