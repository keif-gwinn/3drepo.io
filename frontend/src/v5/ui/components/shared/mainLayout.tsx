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

import { AuthActions } from '@/v5/helpers/actions';
import * as selectors from '@/v5/helpers/selectors';
import { theme } from '@/v5/styles/theme';
import Button from '@material-ui/core/Button';
import { MuiThemeProvider } from '@material-ui/core';
import React from 'react';
const { selectIsAuthenticated } = selectors.AuthSelectors;

export const MainLayout = () => {
	const isAuthenticated = selectIsAuthenticated();

	const login = () => {
		AuthActions.login('tim', '12345');
	};

	return (
		<MuiThemeProvider theme={theme}>
	 		<div>The user isAuthenticated {isAuthenticated.toString()}
			 <Button onClick={login} color="primary" variant="contained"> login</Button></div>
		</MuiThemeProvider>
	);
};
