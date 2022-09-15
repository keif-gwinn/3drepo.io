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
import styled, { css } from 'styled-components';
import { Ticket } from './ticketItem/ticketItem.styles';

export const List = styled.div`
	border: solid 1px ${({ theme }) => theme.palette.base.lightest};
	border-radius: 6px;
	overflow: hidden;
	${/* sc-selector */ Ticket}:not(:last-child) {
		border-bottom: solid 1px ${({ theme }) => theme.palette.base.lightest};
	}
`;

export const Filters = styled.div`
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	gap: 6px;
	margin-bottom: 15px;
`;

export const TemplateName = styled.div<{ $selected?: boolean }>`
	cursor: pointer;
	font-size: 8px;
	line-height: 14px;
	font-weight: 500;
	border-radius: 4px;
	padding: 1px 6px;
	border: solid 1px #6b778c;
	background-color: #f9faff;
	color: #6b778c;

	${({ $selected }) => $selected && css`
		color: ${({ theme }) => theme.palette.primary.main};
		border-color: ${({ theme }) => theme.palette.primary.main};
		background-color: ${({ theme }) => theme.palette.primary.lightest};
	`}
`;
