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

export const InvisibleContainer = styled.div`
	width: 100%;
	display: flex;
	justify-content: center;
	flex-direction: column;

	.MuiFormControl-root {
		width: 100%;

		&, & * {
			min-height: 0;
			height: 0;
			opacity: 0;
			padding: 0;
			margin: 0;
		}
	}
`;

export const ButtonContainer = styled.div`
	display: contents;
`;
