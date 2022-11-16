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

import { selectCurrentModel } from '@/v4/modules/model';
import { IPin } from '@/v4/services/viewer/viewer';
import { createSelector } from 'reselect';
import { selectTicketById, selectTickets } from '../tickets.selectors';
import { ITicket } from '../tickets.types';
import { ITicketsCardState } from './ticketsCard.redux';

const selectTicketsCardDomain = (state): ITicketsCardState => state.ticketsCard || {};

export const selectCurrentTickets = createSelector(
	(state) => state,
	selectCurrentModel,
	selectTickets,
);

const ticketToPin = (ticket:ITicket): IPin => ({
	id: ticket._id,
	position: ticket.properties.Pin,
	colour: [195 / 255, 235 / 255, 52 / 255],
});

export const selectTicketPins = createSelector(
	selectCurrentTickets,
	(tickets) => tickets.reduce((accum, ticket) => (ticket.properties?.Pin
		? [...accum, ticketToPin(ticket)]
		: accum), [])
	,
);

export const selectView = createSelector(
	selectTicketsCardDomain,
	(ticketCardState) => ticketCardState.view,
);

const selectSelectedTicketId = createSelector(
	selectTicketsCardDomain,
	(ticketCardState) => ticketCardState.selectedTicketId,
);

export const selectSelectedTicket = createSelector(
	(state) => state,
	selectCurrentModel,
	selectSelectedTicketId,
	selectTicketById,
);
