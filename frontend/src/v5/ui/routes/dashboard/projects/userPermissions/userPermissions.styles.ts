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
import { BodyWrapper as CustomTableBody, Head, Row } from '@/v4/routes/components/customTable/customTable.styles';
import styled from 'styled-components';
import { Name as UserNameCell } from '@/v4/routes/components/userItem/userItem.styles';

export const Container = styled.div`
	display: flex;
	flex-direction: column;
	height: calc(100% - 40px);

	padding: 20px;

	${CustomTableBody} .simplebar-content {
		border: 1px solid ${({ theme }) => theme.palette.base.lightest};
		border-radius: 5px;
		background-color: ${({ theme }) => theme.palette.primary.contrast};
	}

	${Head} {
		border: 0;
	}

	${UserNameCell} {
		${({ theme }) => theme.typography.h5};
		color: ${({ theme }) => theme.palette.secondary.main};
	}

	${Row} {
		min-height: 80px;
	}
`;
