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
import { Button, Link } from '@material-ui/core';
import { CurrentUserHooksSelectors } from '@/v5/services/selectorsHooks/currentUserSelectors.hooks';
import React, { SyntheticEvent } from 'react';
import { CurrentUserActionsDispatchers } from '@/v5/services/actionsDispatchers/currentUsersActions.dispatchers';
import { i18n } from '@lingui/core';
import { I18nProvider, Trans } from '@lingui/react';

i18n.load('es', {
	'Hello world! {name}': 'Hola mundo! {name}',
	'Read <0>Description</0> below.': 'Lea la <0>Descripcion</0> abajo.',
	'{count, plural, =1 {There is one car} other {There are {count} cars}}': '{count, plural, =1 {Hay un auto} other {Hay {count} autos}}',
});
i18n.activate('es');

export const MainLayout = (): JSX.Element => {
	const userName: string = CurrentUserHooksSelectors.selectUsername();

	const onHandleClick = (e: SyntheticEvent) => {
		e.preventDefault();
		CurrentUserActionsDispatchers.fetchUser('teamSpace1');
	};

	const cars = ['ford', 'mazda'];

	return (
		<I18nProvider i18n={i18n}>
			<div>
				<h1>
					<Trans id="Hello world! {name}" values={{ name: 'pepe' }} />
					Main Layout:
					{userName}
				</h1>
				<br />
				With a embeded component
				<br />
				<Trans id="Read <0>Description</0> below." components={[<Link href="/docs" />]} />
				<br />
				With plurals
				<br />
				<Trans id="{count, plural, =1 {There is one car} other {There are {count} cars}}" values={{ count: cars.length }} />
				<br />
				<Button onClick={onHandleClick}>Click me</Button>
			</div>
		</I18nProvider>
	);
};
