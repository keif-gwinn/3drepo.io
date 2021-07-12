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
import * as CurrentUserSelectors_ from '@/v4/modules/currentUser/currentUser.selectors';
import * as AuthSelectors_ from '@/v5/store/auth/auth.selectors';

import { useSelector } from 'react-redux';

type NameMap<Type> = {
	[Property in keyof Type]: () => any;
};

const wrapSelectors = <T>(moduleSelectors: T) => {
	const exportObject = {};
	Object.keys(moduleSelectors).forEach((key) => {
		exportObject[key] = () => useSelector(moduleSelectors[key]);
	});

	return exportObject as NameMap<T>;
};

export const CurrentUserSelectors = wrapSelectors(CurrentUserSelectors_);
export const AuthSelectors = wrapSelectors(AuthSelectors_);
