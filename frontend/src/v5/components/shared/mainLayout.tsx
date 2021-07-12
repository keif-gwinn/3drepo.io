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

import { AuthSelectors } from '@/v5/helpers/selectors';
import { AuthActions } from '@/v5/store/auth/auth.redux';
import React from 'react';
import { useDispatch } from 'react-redux';
const { selectIsAuthenticated } = AuthSelectors;

export const MainLayout = () => {
	const isAuthenticated = selectIsAuthenticated();
	const dispatch = useDispatch();

	const login = () => dispatch(AuthActions.login('tim', '12345'));

	return (<div>The user isAuthenticated {isAuthenticated.toString()}  <button onClick={login} > login</button></div>);
};
