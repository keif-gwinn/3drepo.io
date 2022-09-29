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

import { put, takeLatest } from 'redux-saga/effects';
import * as API from '@/v5/services/api';
import { formatMessage } from '@/v5/services/intl';
import {
	TicketsTypes,
	TicketsActions,
	FetchTicketsAction,
	FetchTemplatesAction,
} from './tickets.redux';
import { DialogsActions } from '../dialogs/dialogs.redux';

export function* fetchTickets({ teamspace, projectId, modelId, isFederation }: FetchTicketsAction) {
	try {
		const fetchModelTickets = isFederation
			? API.Tickets.fetchFederationTickets
			: API.Tickets.fetchContainerTickets;
		const tickets = yield fetchModelTickets({ teamspace, projectId, modelId });
		yield put(TicketsActions.fetchTicketsSuccess(modelId, tickets));
	} catch (error) {
		yield put(DialogsActions.open('alert', {
			currentActions: formatMessage(
				{ id: 'tickets.fetchTickets.error', defaultMessage: 'trying to fetch {model} tickets' },
				{ model: isFederation ? 'federation' : 'container' },
			),
			error,
		}));
	}
}

export function* fetchTemplates({ teamspace, projectId, modelId, isFederation }: FetchTemplatesAction) {
	try {
		const fetchModelTemplates = isFederation
			? API.Tickets.fetchFederationTemplates
			: API.Tickets.fetchContainerTemplates;
		const templates = yield fetchModelTemplates({ teamspace, projectId, modelId });
		yield put(TicketsActions.fetchTemplatesSuccess(modelId, templates));
	} catch (error) {
		yield put(DialogsActions.open('alert', {
			currentActions: formatMessage({
				id: 'tickets.fetchTemplates.error.action',
				defaultMessage: 'trying to fetch templates',
			}),
			error,
			details: formatMessage({
				id: 'tickets.fetchTemplates.error.details',
				defaultMessage: 'If reloading the page doesn\'t work please contact support',
			}),
		}));
	}
}

export default function* ticketsSaga() {
	yield takeLatest(TicketsTypes.FETCH_TICKETS, fetchTickets);
	yield takeLatest(TicketsTypes.FETCH_TEMPLATES, fetchTemplates);
}