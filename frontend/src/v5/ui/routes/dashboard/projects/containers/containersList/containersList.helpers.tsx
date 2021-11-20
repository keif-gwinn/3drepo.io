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
import { Trans } from '@lingui/react';
import { IContainer } from '@/v5/store/containers/containers.types';

export const getContainerMenuItems = (id: IContainer['_id']) => [
	{
		key: 1,
		title: <Trans id="containers.ellipsisMenu.loadContainer" message="Load Container in 3D Viewer" />,
		to: `/${id}`,
	},
	{
		key: 2,
		title: <Trans id="containers.ellipsisMenu.uploadNewRevision" message="Upload new Revision" />,
		onClick: () => { },
	},
	{
		key: 3,
		title: <Trans id="containers.ellipsisMenu.viewIssues" message="View Issues" />,
		onClick: () => { },
	},
	{
		key: 4,
		title: <Trans id="containers.ellipsisMenu.viewRisks" message="View Risks" />,
		onClick: () => { },
	},
	{
		key: 5,
		title: <Trans id="containers.ellipsisMenu.viewRevisions" message="View Revisions" />,
		onClick: () => { },
	},
	{
		key: 6,
		title: <Trans id="containers.ellipsisMenu.editPermissions" message="Edit Permissions" />,
		onClick: () => { },
	},
	{
		key: 7,
		title: <Trans id="containers.ellipsisMenu.shareContainer" message="Share Container" />,
		onClick: () => { },
	},
	{
		key: 8,
		title: <Trans id="containers.ellipsisMenu.settings" message="Settings" />,
		onClick: () => {
		},
	},
	{
		key: 9,
		title: <Trans id="containers.ellipsisMenu.delete" message="Delete" />,
		onClick: () => { },
	},
];