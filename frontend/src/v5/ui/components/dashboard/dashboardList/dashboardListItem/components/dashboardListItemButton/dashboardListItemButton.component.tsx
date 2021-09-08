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

import { FixedOrGrowContainer } from '@components/dashboard/dashboardList/dasboardList.styles';
import { Tooltip } from '@material-ui/core';
import React, { Dispatch, ReactNode, SyntheticEvent } from 'react';
import { Button } from './dashboardListItemButton.styles';

type IDashboardListItemButton = {
	children: ReactNode;
	width?: number;
	onClick: Dispatch<SyntheticEvent>;
	tooltipTitle?: string;
	className?: string;
};

export const DashboardListItemButton = ({
	children,
	width,
	onClick,
	tooltipTitle = '',
	className,
}: IDashboardListItemButton): JSX.Element => (
	<FixedOrGrowContainer width={width} className={className}>
		<Tooltip title={tooltipTitle}>
			<Button onClick={onClick}>
				{children}
			</Button>
		</Tooltip>
	</FixedOrGrowContainer>
);
