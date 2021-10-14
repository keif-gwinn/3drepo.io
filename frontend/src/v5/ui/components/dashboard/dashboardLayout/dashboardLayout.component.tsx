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

import React, { ReactNode } from 'react';
import { AppBar } from '@components/shared/appBar';
import { ModalsDispatcher } from '@components/shared/modals';
import { Content, MainHeaderPortalRoot } from './dashboardLayout.styles';
import { MAIN_HEADER_PORTAL_TARGET_ID } from './dashboardLayout.constants';

interface IDashboardLayout {
	children: ReactNode;
	hasTopNavigation?: boolean;
}

export const DashboardLayout = ({ children, hasTopNavigation = true }: IDashboardLayout): JSX.Element => (
	<>
		<AppBar hasTopNavigation={hasTopNavigation} />
		<MainHeaderPortalRoot id={MAIN_HEADER_PORTAL_TARGET_ID} />
		<Content>
			{children}
		</Content>
		<ModalsDispatcher />
	</>
);
