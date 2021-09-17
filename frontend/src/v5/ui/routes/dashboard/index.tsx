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
import React from 'react';
import { RouteExcept } from '@/v5/services/routing/routing';
import { useRouteMatch, Route } from 'react-router-dom';
import { GlobalStyle } from '@/v5/ui/themes/global';

import { i18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';
import { messages as esMessages } from '@/locales/es/messages';
import { AppBar } from '@components/shared/appBar';
import { messages as enMessages } from '@/locales/en/messages';
import { TeamspaceContent } from './teamspaces';
import { ProjectContent } from './projects';
import { Content } from './index.styles';

i18n.load('en', enMessages);
i18n.load('es', esMessages);

i18n.activate('en');

export const Dashboard = () => {
	const { path } = useRouteMatch();

	return (
		<Route path={`${path}/:teamspace?/:project?`}>
			<I18nProvider i18n={i18n}>
				<GlobalStyle />
				<AppBar />
				<Content>
					<Route path={`${path}/:teamspace/`}>
						<TeamspaceContent />
					</Route>

					<RouteExcept path={`${path}/:teamspace/:project`} exceptPath={`${path}/:teamspace/settings`}>
						<ProjectContent />
					</RouteExcept>
				</Content>
			</I18nProvider>
		</Route>
	);
};