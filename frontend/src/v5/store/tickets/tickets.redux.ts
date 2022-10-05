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

import { produceAll } from '@/v5/helpers/reducers.helper';
import { merge } from 'lodash';
import { Action } from 'redux';
import { createActions, createReducer } from 'reduxsauce';
import { Constants } from '../../helpers/actions.helper';
import { TeamspaceAndProjectId } from '../store.types';
import { ITemplate, ITicket, NewTicket } from './tickets.types';

export const { Types: TicketsTypes, Creators: TicketsActions } = createActions({
	fetchTickets: ['teamspace', 'projectId', 'modelId', 'isFederation'],
	fetchTicket: ['teamspace', 'projectId', 'modelId', 'ticketId', 'isFederation'],
	fetchTicketsSuccess: ['modelId', 'tickets'],
	fetchTemplates: ['teamspace', 'projectId', 'modelId', 'isFederation'],
	fetchTemplate: ['teamspace', 'projectId', 'modelId', 'templateId', 'isFederation'],
	replaceTemplateSuccess: ['modelId', 'template'],
	fetchTemplatesSuccess: ['modelId', 'templates'],
	updateTicket: ['teamspace', 'projectId', 'modelId', 'ticketId', 'ticket', 'isFederation'],
	createTicket: ['teamspace', 'projectId', 'modelId', 'ticket', 'isFederation'],
	upsertTicketSuccess: ['modelId', 'ticket'],
}, { prefix: 'TICKETS/' }) as { Types: Constants<ITicketsActionCreators>; Creators: ITicketsActionCreators };

export const INITIAL_STATE: ITicketsState = {
	ticketsByModelId: {},
	templatesByModelId: {},
};

export const fetchTicketsSuccess = (state: ITicketsState, { modelId, tickets }: FetchTicketsSuccessAction) => {
	state.ticketsByModelId[modelId] = tickets;
};

export const upsertTicketSuccess = (state: ITicketsState, { modelId, ticket }: UpsertTicketSuccessAction) => {
	if (!state.ticketsByModelId[modelId]) state.ticketsByModelId[modelId] = [];

	const modelTicket = state.ticketsByModelId[modelId].find(({ _id }) => _id === ticket._id);
	merge(modelTicket, ticket);

	if (!modelTicket) {
		state.ticketsByModelId[modelId].push(ticket as ITicket);
	}
};

export const replaceTemplateSuccess = (state: ITicketsState, { modelId, template }: ReplaceTemplateSuccessAction) => {
	if (!state.templatesByModelId[modelId]) state.templatesByModelId[modelId] = [];

	state.templatesByModelId[modelId] = state.templatesByModelId[modelId]
		.filter((loadedTemplate) => loadedTemplate._id !== template._id);

	state.templatesByModelId[modelId].push(template);
};

export const fetchTemplatesSuccess = (state: ITicketsState, { modelId, templates }: FetchTemplatesSuccessAction) => {
	state.templatesByModelId[modelId] = templates;
};

export const ticketsReducer = createReducer(INITIAL_STATE, produceAll({
	[TicketsTypes.FETCH_TICKETS_SUCCESS]: fetchTicketsSuccess,
	[TicketsTypes.FETCH_TEMPLATES_SUCCESS]: fetchTemplatesSuccess,
	[TicketsTypes.UPSERT_TICKET_SUCCESS]: upsertTicketSuccess,
	[TicketsTypes.REPLACE_TEMPLATE_SUCCESS]: replaceTemplateSuccess,
}));

export interface ITicketsState {
	ticketsByModelId: Record<string, ITicket[]>;
	templatesByModelId: Record<string, ITemplate[]>,
}

export type FetchTicketsAction = Action<'FETCH_TICKETS'> & TeamspaceAndProjectId & { modelId: string, isFederation: boolean };
export type FetchTicketAction = Action<'FETCH_TICKET'> & TeamspaceAndProjectId & { modelId: string, ticketId: string, isFederation: boolean };
export type UpdateTicketAction = Action<'UPDATE_TICKET'> & TeamspaceAndProjectId & { modelId: string, ticketId: string, ticket: Partial<ITicket>, isFederation: boolean };
export type CreateTicketAction = Action<'CREATE_TICKET'> & TeamspaceAndProjectId & { modelId: string, ticket: NewTicket, isFederation: boolean };
export type FetchTicketsSuccessAction = Action<'FETCH_TICKETS_SUCCESS'> & { modelId: string, tickets: ITicket[] };
export type UpsertTicketSuccessAction = Action<'UPSERT_TICKET_SUCCESS'> & { modelId: string, ticket: Partial<ITicket> };
export type ReplaceTemplateSuccessAction = Action<'REPLACE_TEMPLATE_SUCCESS'> & { modelId: string, template: ITemplate };
export type FetchTemplatesAction = Action<'FETCH_TEMPLATES'> & TeamspaceAndProjectId & { modelId: string, isFederation: boolean };
export type FetchTemplateAction = Action<'FETCH_TEMPLATES'> & TeamspaceAndProjectId & { modelId: string, templateId: string, isFederation: boolean };
export type FetchTemplatesSuccessAction = Action<'FETCH_TEMPLATES_SUCCESS'> & { modelId: string, templates: ITemplate[] };

export interface ITicketsActionCreators {
	fetchTickets: (
		teamspace: string,
		projectId: string,
		modelId: string,
		isFederation: boolean,
	) => FetchTicketsAction;
	fetchTicket: (
		teamspace: string,
		projectId: string,
		modelId: string,
		ticketId: string,
		isFederation: boolean,
	) => FetchTicketAction;
	updateTicket: (
		teamspace: string,
		projectId: string,
		modelId: string,
		ticketId: string,
		ticket: Partial<ITicket>,
		isFederation: boolean,
	) => UpdateTicketAction;
	createTicket: (
		teamspace: string,
		projectId: string,
		modelId: string,
		ticket: NewTicket,
		isFederation: boolean,
	) => CreateTicketAction;
	fetchTicketsSuccess: (
		modelId: string,
		tickets: ITicket[],
	) => FetchTicketsSuccessAction;
	fetchTemplates: (
		teamspace: string,
		projectId: string,
		modelId: string,
		isFederation: boolean,
	) => FetchTemplatesAction;
	fetchTemplatesSuccess: (modelId: string, templates: ITemplate[]) => FetchTemplatesSuccessAction;
	fetchTemplate: (
		teamspace: string,
		projectId: string,
		modelId: string,
		templateId: string,
		isFederation: boolean,
	) => FetchTemplateAction;
	upsertTicketSuccess: (modelId: string, ticket: Partial<ITicket>) => UpsertTicketSuccessAction;
	replaceTemplateSuccess: (modelId: string, ticket: ITemplate) => ReplaceTemplateSuccessAction;
}