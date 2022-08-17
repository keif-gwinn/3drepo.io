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
import { TeamspacesActionsDispatchers } from '@/v5/services/actionsDispatchers/teamspacesActions.dispatchers';
import { TeamspacesHooksSelectors } from '@/v5/services/selectorsHooks/teamspacesSelectors.hooks';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { isQuotaExpired } from '@/v5/store/teamspaces/teamspaces.helpers';
import { TeamspaceParams } from '../../../../routes.constants';
import { TeamspaceQuotaLayout } from './teamspaceQuota.styles';
import { StorageQuota } from './teamspaceStorageQuota.component';
import { SeatsQuota } from './teamspaceSeatsQuota.component';
import { TeamspaceQuotaExpired } from './teamspaceQuotaExpired.component';

export const TeamspaceQuota = () => {
	const { teamspace } = useParams<TeamspaceParams>();
	const quota = TeamspacesHooksSelectors.selectCurrentQuota();
	const quotaLoaded = !!quota;

	useEffect(() => {
		if (quotaLoaded || !teamspace) return;
		TeamspacesActionsDispatchers.fetchQuota(teamspace);
	}, [quotaLoaded, teamspace]);

	if (!quotaLoaded) {
		return <>loading...</>;
	}

	if (isQuotaExpired(quota)) {
		return (<TeamspaceQuotaExpired />);
	}

	return (
		<TeamspaceQuotaLayout>
			<StorageQuota storage={quota.data} />
			<SeatsQuota seats={quota.seats} />
		</TeamspaceQuotaLayout>
	);
};
