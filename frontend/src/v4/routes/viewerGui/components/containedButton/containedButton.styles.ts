/**
 *  Copyright (C) 2020 3D Repo Ltd
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

import styled from 'styled-components';

import Button from '@mui/material/Button';

import { COLOR } from '../../../../styles';

export const StyledButton = styled(Button)<{ squeezed?: number }>`
	background-color: ${COLOR.SOFT_BLUE};
	padding: ${({ squeezed }) => squeezed ? '4px 5px' : '6px 20px'};
	min-width: 56px;
	min-height: 18px;
	font-size: 12px;
	text-transform: none;

	& > :first-child {
		width: 15px;
		font-size: 13px;
		margin-right: 2px;
		margin-bottom: 1px;
	}
`;
