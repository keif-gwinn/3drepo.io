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

import { createActions, createReducer } from 'reduxsauce';

interface IAuthActions {
	login: (username: string , password: string) => any;
	loginSuccess: () => any;
}

interface IAuthTypes {
	LOGIN_SUCCESS: string;
	LOGIN: string;
}

export const { Types: AuthTypes, Creators: AuthActions }: {Types: IAuthTypes,  Creators: IAuthActions} = createActions({
	login: ['username', 'password'],
	loginSuccess: []
}, { prefix: 'AUTH/' });

export const INITIAL_STATE = {
	isAuthenticated: null,
	isPending: false,
	message: ''
};

export const loginSuccess = (state = INITIAL_STATE) => {
	return { ...state, isAuthenticated: true, isPending: false };
};

export const reducer = createReducer(INITIAL_STATE, {
	[AuthTypes.LOGIN_SUCCESS]: loginSuccess,
});
