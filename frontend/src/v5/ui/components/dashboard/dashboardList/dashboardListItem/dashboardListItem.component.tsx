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

import React, { CSSProperties, Dispatch, ReactNode } from 'react';
import { ThemeProvider } from 'styled-components';
import { Container } from './dashboardListItem.styles';

type IDashboradListItem = {
	children?: ReactNode;
	onClick?: Dispatch<void>;
	selected: boolean;
	className?: string;
	color?: CSSProperties['color'];
};

export const DashboardListItem = ({
	children,
	onClick,
	color,
	className,
	selected,
}: IDashboradListItem): JSX.Element => (
	<ThemeProvider theme={{ selected }}>
		<Container onClick={onClick} color={color} className={className}>
			{children}
		</Container>
	</ThemeProvider>
);
