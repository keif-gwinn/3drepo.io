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

import IconButton from '@mui/material/IconButton';
import Menu from '@mui/icons-material/Menu';

import { COLOR } from '../../../../../../styles';

export const StyledIconButton = styled(IconButton)<{ active: boolean }>`
	&& {
		background-color: ${({ active }) => active ? 'rgba(0, 0, 0, 0.08)' : ''};
	}
`;

export const BurgerIcon = styled(Menu)`
	&& {
		color: ${COLOR.WHITE};
		font-size: 28px;
		filter: drop-shadow(0 0 2px ${COLOR.BLACK_30});
	}
`;
