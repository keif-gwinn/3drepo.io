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

import { createContext, useState, useEffect, lazy, Suspense } from 'react';
import { useParams } from 'react-router-dom';

import AddCircleIcon from '@assets/icons/add_circle.svg';
import { DashboardListEmptyText, Divider } from '@components/dashboard/dashboardList/dashboardList.styles';
import { DashboardSkeletonList } from '@components/dashboard/dashboardList/dashboardSkeletonList';
import { Button } from '@controls/button';
import { FormattedMessage } from 'react-intl';
import { enableRealtimeNewContainer } from '@/v5/services/realtime/container.events';
import { SearchContextComponent } from '@controls/search/searchContext';
import { CONTAINERS_SEARCH_FIELDS } from '@/v5/store/containers/containers.helpers';
import { ContainersList } from './containersList';
import { SkeletonListItem } from './containersList/skeletonListItem';
import { useContainersData } from './containers.hooks';
import { DashboardParams } from '../../../routes.constants';

const CreateContainerForm = lazy(() => import('./createContainerForm'));
const UploadFileForm = lazy(() => import('./uploadFileForm'));

export const IsMainList = createContext(false);

export const Containers = (): JSX.Element => {
	const { teamspace, project } = useParams<DashboardParams>();
	const [uploadModalOpen, setUploadModalOpen] = useState(false);
	const {
		containers,
		favouriteContainers,
		isListPending,
	} = useContainersData();

	const [createContainerOpen, setCreateContainerOpen] = useState(false);

	const onClickClose = () => setUploadModalOpen(false);

	useEffect(() => enableRealtimeNewContainer(teamspace, project), [project]);

	if (isListPending) {
		return (<DashboardSkeletonList itemComponent={<SkeletonListItem />} />);
	}

	return (
		<>
			<SearchContextComponent items={favouriteContainers} fieldsToFilter={CONTAINERS_SEARCH_FIELDS}>
				<ContainersList
					title={(
						<FormattedMessage
							id="containers.favourites.collapseTitle"
							defaultMessage="Favourites"
						/>
					)}
					titleTooltips={{
						collapsed: <FormattedMessage id="containers.favourites.collapse.tooltip.show" defaultMessage="Show favourites" />,
						visible: <FormattedMessage id="containers.favourites.collapse.tooltip.hide" defaultMessage="Hide favourites" />,
					}}
					onClickCreate={() => setCreateContainerOpen(true)}
					onClickUpload={() => setUploadModalOpen(true)}
					emptyMessage={(
						<DashboardListEmptyText>
							<FormattedMessage
								id="containers.favourites.emptyMessage"
								defaultMessage="You haven’t added any Favourites. Click the star on a container to add your first favourite Container."
							/>
						</DashboardListEmptyText>
					)}
				/>
			</SearchContextComponent>
			<Divider />
			<IsMainList.Provider value>
				<SearchContextComponent items={containers} fieldsToFilter={CONTAINERS_SEARCH_FIELDS}>
					<ContainersList
						title={(
							<FormattedMessage
								id="containers.all.collapseTitle"
								defaultMessage="All containers"
							/>
						)}
						titleTooltips={{
							collapsed: <FormattedMessage id="containers.all.collapse.tooltip.show" defaultMessage="Show all" />,
							visible: <FormattedMessage id="containers.all.collapse.tooltip.hide" defaultMessage="Hide all" />,
						}}
						showBottomButton
						onClickCreate={() => setCreateContainerOpen(true)}
						onClickUpload={() => setUploadModalOpen(true)}
						emptyMessage={(
							<>
								<DashboardListEmptyText>
									<FormattedMessage id="containers.all.emptyMessage" defaultMessage="You haven’t created any Containers." />
								</DashboardListEmptyText>
								<Button
									startIcon={<AddCircleIcon />}
									variant="contained"
									color="primary"
									onClick={() => setCreateContainerOpen(true)}
								>
									<FormattedMessage id="containers.all.newContainer" defaultMessage="New Container" />
								</Button>
							</>
						)}
					/>
				</SearchContextComponent>
			</IsMainList.Provider>
			<Suspense fallback={<div />}>
				<CreateContainerForm
					open={createContainerOpen}
					onClickClose={() => setCreateContainerOpen(false)}
				/>
				<UploadFileForm openState={uploadModalOpen} onClickClose={onClickClose} />
			</Suspense>
		</>
	);
};
