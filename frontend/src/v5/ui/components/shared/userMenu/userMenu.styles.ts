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
import { Button } from '@controls/button';
import { Link } from '@material-ui/core';

export const AvatarContainer = styled.div`
	&& {
		padding: 0;
		margin: 8px 0;
	}
`;

export const AvatarSection = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	margin-bottom: 11px;
`;

export const UserFullName = styled.div`
	${({ theme }) => theme.typography.h3};
	color: ${({ theme }) => theme.palette.secondary.main};
`;

export const UserUserName = styled.div`
	font-size: 12px;
	color: ${({ theme }) => theme.palette.base.main};
	margin-bottom: 11px;
`;

export const EditProfileButton = styled(Link)`
	cursor: pointer;
	color: ${({ theme }) => theme.palette.primary.main};
	width: 100%;
	text-align: center;
	${({ theme }) => theme.typography.link};
	text-underline-offset: 2px;
`;

export const SignOutButton = styled(Button).attrs({
	variant: 'contained',
	color: 'primary',
})`
	&& {
		width: 100%;
		margin: 0;
	}
`;