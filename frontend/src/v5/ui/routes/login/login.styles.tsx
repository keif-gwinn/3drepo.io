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
import UserIcon from '@assets/icons/user.svg';
import PasswordIcon from '@assets/icons/lock.svg';
import { FormTextField } from '@controls/formTextField/formTextField.component';
import { Typography } from '@controls/typography';
import { formatMessage } from '@/v5/services/intl';

export const AuthHeading = styled(Typography).attrs({
	variant: 'h1',
})`
	color: ${({ theme }) => theme.palette.secondary.main};
	user-select: none;
`;

export const AuthField = styled(FormTextField).attrs({
	required: true,

})`
	>* { color: ${({ theme }) => theme.palette.secondary.main}; }
`;

export const UsernameField = styled(AuthField).attrs({
	InputProps: {
		startAdornment: <UserIcon />,
	},
	name: 'username',
	label: formatMessage({
		id: 'auth.login.usernameLabel',
		defaultMessage: 'Username or email',
	}),
	autoComplete: 'login',
})``;

export const PasswordField = styled(AuthField).attrs({
	InputProps: {
		startAdornment: <PasswordIcon />,
	},
	name: 'password',
	label: formatMessage({
		id: 'auth.login.passwordLabel',
		defaultMessage: 'Password',
	}),
	autoComplete: 'current-password',
	type: 'password',
})``;

export const OtherOptions = styled.div`
	display: flex;
	padding: 14px 0 20px;
	color: ${({ theme }) => theme.palette.base.main};
	a {
		color: ${({ theme }) => theme.palette.primary.main};
	}
`;

export const SignUpPrompt = styled(Typography)`
	margin-right: auto;
`;

export const ForgotPasswordPrompt = styled(Typography)`
	margin-left: auto;
`;

export const ErrorMessage = styled(Typography)`
	color: ${({ theme }) => theme.palette.error.main};
	display: flex;
	align-items: center;
	margin-top: 15px;
	svg {
		margin-right: 5px;
	}
`;
