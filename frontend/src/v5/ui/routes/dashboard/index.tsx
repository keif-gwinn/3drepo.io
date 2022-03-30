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

import { useRouteMatch, useLocation, Route, Switch, Redirect } from 'react-router-dom';
import { GlobalStyle } from '@/v5/ui/themes/global';
import { discardSlash } from '@/v5/services/routing/routing';
import { NotFound } from '@/v5/ui/routes/notFound';
import { DashboardLayout } from '@components/dashboard/dashboardLayout';
import { TeamspacesList } from '@/v5/ui/routes/dashboard/teamspaces/teamspacesList/teamspacesList.component';
import { TeamspaceContent } from './teamspaces';
import { ProjectContent } from './projects';
import { Login } from '../login';
import { ForgotPassword } from '../login/forgotPassword';

export const Dashboard = () => {
	const { path } = useRouteMatch();
	const { pathname } = useLocation();

	return (
		<>
			<GlobalStyle />
			<Switch>
				<Route exact path={`${path}/login`}>
					<Login />
				</Route>
				<Route exact path={`${path}/password-forgot`}>
					<ForgotPassword />
				</Route>
				<Route path={`${path}/dashboard/:teamspace?/:project?`}>
					<DashboardLayout>
						<Route exact path={`${path}/dashboard/`}>
							<TeamspacesList />
						</Route>
						<Route path={`${path}/dashboard/:teamspace/`}>
							<TeamspaceContent />
						</Route>
						<Switch>
							<Route exact path={`${path}/dashboard/:teamspace/t/settings`}>
								<TeamspaceContent />
							</Route>
							<Route exact path={`${path}/dashboard/:teamspace/:project`}>
								<Redirect to={`${discardSlash(pathname)}/t/federations`} />
							</Route>
							<Route exact path={`${path}/dashboard/:teamspace/:project/t`}>
								<Redirect to={`${discardSlash(pathname)}/federations`} />
							</Route>
							<Route path={`${path}/dashboard/:teamspace/:project`}>
								<ProjectContent />
							</Route>
						</Switch>
					</DashboardLayout>
				</Route>
				<Route path="*">
					<DashboardLayout>
						<NotFound />
					</DashboardLayout>
				</Route>
			</Switch>
		</>
	);
};
