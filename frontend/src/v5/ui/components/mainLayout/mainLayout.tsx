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
import { CurrentUserActions } from '@/v5/store/common/actions/currentUser.actions';
import { Button } from '@material-ui/core';
import { CurrentUserSelectors } from '@selectors/currentUser.selectors';
import React, { SyntheticEvent } from 'react';

export const MainLayout = (): JSX.Element => {
	const userName: string = CurrentUserSelectors.selectUsername();

	const onHandleClick = (e: SyntheticEvent) => {
		e.preventDefault();
		CurrentUserActions.fetchUser('teamSpace1');
	};

	return (
		<div>
			<h1>
				Main Layout:
				{userName}
			</h1>
			<Button onClick={onHandleClick}>Click me</Button>
		</div>
	);
};
