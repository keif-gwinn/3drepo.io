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

import styled from 'styled-components';
import * as SearchInputStyles from '@controls/searchInput/searchInput.styles';

export const Container = styled.div`
	margin: 16px 0;
	min-width: 380px;
`;

export const CollapseSideElementGroup = styled.div`
	display: flex;
	align-items: center;
	
	${SearchInputStyles.TextField} {
		width: 405px;
		margin-right: 15px;
	}
	
	> :last-child {
		margin-right: 0;
	}
`;
