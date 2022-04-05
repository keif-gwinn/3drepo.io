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
import { useEffect } from 'react';
import { UserManagementActions } from '@/v4/modules/userManagement';

import { useDispatch, useSelector } from 'react-redux';
import { ProjectsHooksSelectors } from '@/v5/services/selectorsHooks/projectsSelectors.hooks';
import { TeamspacesActions } from '@/v4/modules/teamspaces';
import { selectCurrentUser } from '@/v4/modules/currentUser';
import { Container, V4ProjectsPermissions } from './projectPermissions.styles';

export const ProjectPermissions = () => {
	const dispatch = useDispatch();
	const projectName = ProjectsHooksSelectors.selectCurrentProjectDetails()?.name;
	const username = useSelector(selectCurrentUser)?.username;

	useEffect(() => {
		if (!username || !projectName) {
			return;
		}

		dispatch(UserManagementActions.fetchTeamspaceUsers());
		dispatch(UserManagementActions.fetchProject(projectName));
		dispatch(TeamspacesActions.fetchTeamspacesIfNecessary(username));
	}, [projectName, username]);

	if (!username || !projectName) {
		return (<></>);
	}

	return (
		<Container>
			<V4ProjectsPermissions />
		</Container>
	);
};
