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

import * as ContainersSaga from '@/v5/store/containers/containers.sagas';
import { expectSaga } from 'redux-saga-test-plan';
import { call } from 'redux-saga-test-plan/matchers';
import { times } from 'lodash';

import { mockServer } from '../../internals/testing/mockServer';
import { ContainersActions } from '@/v5/store/containers/containers.redux';
import { revisionsMockFactory, userMockFactory } from '@/v5/store/containers/containers.fixtures';
import { prepareRevisionsData } from "@/v5/store/containers/containers.helpers";

describe('Containers: sagas', () => {
	const teamspace = 'teamspace';
	const projectId = 'projectId';
	const containerId = 'containerId';

	describe('fetchRevisions', () => {
		const mockUsers = times(5, () => userMockFactory());
		const mockRevisions = times(5, (index) => revisionsMockFactory({ author: mockUsers[index].user }));
		const mockStore = {
			teamspaces2: {
				teamspaces: [{
					name: teamspace,
					users: mockUsers,
				}]
			},
			projects: {
				currentTeamspace: teamspace,
			},
		};

		it('should fetch revisions data and dispatch FETCH_REVISIONS_SUCCESS', async () => {
			const revisionsWithUsersInfo = prepareRevisionsData(mockRevisions, mockUsers);
			mockServer
				.get(`/teamspaces/${teamspace}/projects/${projectId}/containers/${containerId}/revisions`)
				.reply(200, {
					revisions: mockRevisions
				});

			await expectSaga(ContainersSaga.default)
					.withState(mockStore)
					.provide([
						[call.fn(prepareRevisionsData), revisionsWithUsersInfo],
					])
					.dispatch(ContainersActions.fetchRevisions(teamspace, projectId, containerId))
					.put(ContainersActions.setRevisionsIsPending(projectId, containerId, true))
					.put(ContainersActions.fetchRevisionsSuccess(projectId, containerId, revisionsWithUsersInfo))
					.put(ContainersActions.setRevisionsIsPending(projectId, containerId, false))
					.silentRun();
		});

		it('should handle revisions api error', async () => {
			mockServer
					.get(`/teamspaces/${teamspace}/projects/${projectId}/containers/${containerId}/revisions`)
					.reply(404);

			await expectSaga(ContainersSaga.default)
					.withState(mockStore)
					.dispatch(ContainersActions.fetchRevisions(teamspace, projectId, containerId))
					.put(ContainersActions.setRevisionsIsPending(projectId, containerId, true))
					.put(ContainersActions.setRevisionsIsPending(projectId, containerId, false))
					.silentRun()
					.then(({ effects }: any) => {
						expect(effects.put).toBeUndefined();
					});
		})
	});
})
