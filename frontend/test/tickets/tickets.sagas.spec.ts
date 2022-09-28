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

import { expectSaga } from 'redux-saga-test-plan';
import * as TicketsSaga from '@/v5/store/tickets/tickets.sagas';
import { TicketsActions } from '@/v5/store/tickets/tickets.redux';
import { mockServer } from '../../internals/testing/mockServer';
import { templateMockFactory, ticketMockFactory } from './tickets.fixture';
import { alertAction } from '../test.helpers';

describe('Tickets: sagas', () => {
	const teamspace = 'teamspace';
	const projectId = 'project';
	const modelId = 'modelId';
	const tickets = [ticketMockFactory()];

	describe('fetchTickets', () => {
		describe('tickets', () => {
			// Containers
			it('should call fetchContainerTickets endpoint', async () => {
				mockServer
					.get(`/teamspaces/${teamspace}/projects/${projectId}/containers/${modelId}/tickets`)
					.reply(200, { tickets });

				await expectSaga(TicketsSaga.default)
					.dispatch(TicketsActions.fetchTickets(teamspace, projectId, modelId, false))
					.put(TicketsActions.fetchTicketsSuccess(modelId, tickets))
					.silentRun();
			})

			it('should call fetchContainerTickets endpoint with a 404', async () => {
				mockServer
					.get(`/teamspaces/${teamspace}/projects/${projectId}/containers/${modelId}/tickets`)
					.reply(400);

				await expectSaga(TicketsSaga.default)
					.dispatch(TicketsActions.fetchTickets(teamspace, projectId, modelId, false))
					.put.like(alertAction('trying to fetch container tickets'))
					.silentRun();
			})

			it('should call fetch containers Ticket endpoint', async () => {
				const ticket = tickets[0];
				mockServer
					.get(`/teamspaces/${teamspace}/projects/${projectId}/containers/${modelId}/tickets/${ticket._id}`)
					.reply(200, ticket);

				await expectSaga(TicketsSaga.default)
					.dispatch(TicketsActions.fetchTicket(teamspace, projectId, modelId, ticket._id, false))
					.put(TicketsActions.upsertTicketSuccess(modelId, ticket))
					.silentRun();
			})
			
			it('should call container`s update ticket endpoint', async () => {
				const ticket = tickets[0];
				mockServer
					.patch(`/teamspaces/${teamspace}/projects/${projectId}/containers/${modelId}/tickets/${ticket._id}`)
					.reply(200);

				const updateProp = {title:'updatedName'};

				await expectSaga(TicketsSaga.default)
					.dispatch(TicketsActions.updateTicket(teamspace, projectId, modelId, ticket._id, updateProp, false))
					.put(TicketsActions.upsertTicketSuccess(modelId, updateProp))
					.silentRun();
			})

			// Federations
			it('should call fetchFederationsTickets endpoint', async () => {
				mockServer
					.get(`/teamspaces/${teamspace}/projects/${projectId}/federations/${modelId}/tickets`)
					.reply(200, { tickets });

				await expectSaga(TicketsSaga.default)
					.dispatch(TicketsActions.fetchTickets(teamspace, projectId, modelId, true))
					.put(TicketsActions.fetchTicketsSuccess(modelId, tickets))
					.silentRun();
			})

			it('should call fetchFederationsTickets endpoint with a 404', async () => {
				mockServer
					.get(`/teamspaces/${teamspace}/projects/${projectId}/federations/${modelId}/tickets`)
					.reply(400);

				await expectSaga(TicketsSaga.default)
					.dispatch(TicketsActions.fetchTickets(teamspace, projectId, modelId, true))
					.put.like(alertAction('trying to fetch federation tickets'))
					.silentRun();
			})

			it('should call fetchFederationsTicket endpoint', async () => {
				const ticket = tickets[0];
				mockServer
					.get(`/teamspaces/${teamspace}/projects/${projectId}/federations/${modelId}/tickets/${ticket._id}`)
					.reply(200, ticket);

				await expectSaga(TicketsSaga.default)
					.dispatch(TicketsActions.fetchTicket(teamspace, projectId, modelId, ticket._id, true))
					.put(TicketsActions.upsertTicketSuccess(modelId, ticket))
					.silentRun();
			})

			it('should call federation update ticket endpoint', async () => {
				const ticket = tickets[0];
				mockServer
					.patch(`/teamspaces/${teamspace}/projects/${projectId}/federations/${modelId}/tickets/${ticket._id}`)
					.reply(200, ticket);

				const updateProp = {title:'updatedName'};

				await expectSaga(TicketsSaga.default)
					.dispatch(TicketsActions.updateTicket(teamspace, projectId, modelId, ticket._id, updateProp, true))
					.put(TicketsActions.upsertTicketSuccess(modelId, updateProp))
					.silentRun();
			})
		})

		describe('templates', () => {
			const templates = [templateMockFactory()];

			// Basic Container templates
			it('should call fetchContainerTemplates endpoint', async () => {
				mockServer
					.get(`/teamspaces/${teamspace}/projects/${projectId}/containers/${modelId}/tickets/templates`)
					.reply(200, { templates });
	
				await expectSaga(TicketsSaga.default)
					.dispatch(TicketsActions.fetchTemplates(teamspace, projectId, modelId, false))
					.put(TicketsActions.fetchTemplatesSuccess(modelId, templates))
					.silentRun();
			})
	
			it('should call fetchTemplates endpoint with a 404', async () => {
				mockServer
					.get(`/teamspaces/${teamspace}/projects/${projectId}/containers/${modelId}/tickets/templates`)
					.reply(400);
	
				await expectSaga(TicketsSaga.default)
					.dispatch(TicketsActions.fetchTemplates(teamspace, projectId, modelId, false))
					.put.like(alertAction('trying to fetch templates'))
					.silentRun();
			})

			// Basic Federation templates
			it('should call fetchTemplates endpoint', async () => {
				mockServer
					.get(`/teamspaces/${teamspace}/projects/${projectId}/federations/${modelId}/tickets/templates`)
					.reply(200, { templates });
	
				await expectSaga(TicketsSaga.default)
					.dispatch(TicketsActions.fetchTemplates(teamspace, projectId, modelId, true))
					.put(TicketsActions.fetchTemplatesSuccess(modelId, templates))
					.silentRun();
			})
	
			it('should call fetchTemplates endpoint with a 404', async () => {
				mockServer
					.get(`/teamspaces/${teamspace}/projects/${projectId}/federations/${modelId}/tickets/templates`)
					.reply(400);
	
				await expectSaga(TicketsSaga.default)
					.dispatch(TicketsActions.fetchTemplates(teamspace, projectId, modelId, true))
					.put.like(alertAction('trying to fetch templates'))
					.silentRun();
			})
		})
	})
})
