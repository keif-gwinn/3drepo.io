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

import styled from 'styled-components';
import { Avatar } from '@mui/material';

const EXTENSION_COLOUR_MAP = {
	ifc: '#A8007A',
	bim: '#80E0E9',
	dgn: '#62BB46',
	rvt: '#186BFE',
	rfa: '#186BFE',
	spm: '#62BB46',
	dwg: '#E51050',
	dxf: '#1D1D1B',
	nwd: '#007628',
};

export const StyledIconButton = styled(Avatar)<{ extension: string}>`
	width: 32px;
	height: 32px;
	display: flex;
	overflow: hidden;
	position: relative;
	font-size: 14px;
	align-items: center;
	flex-shrink: 0;
	font-family: Inter, Arial, sans-serif;
	font-weight: 600;
	line-height: 1.125rem;
	justify-content: center;
	user-select: none;
	text-transform: uppercase;

	color: ${({ extension, theme }) => EXTENSION_COLOUR_MAP[extension] || theme.palette.tertiary.main};
	background-color: ${({ theme }) => theme.palette.primary.contrast};
	border: 1px solid ${({ theme }) => theme.palette.base.lightest};
`;