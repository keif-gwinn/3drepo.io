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

import { Dispatch, ReactNode, useContext } from 'react';
import ArrowIcon from '@assets/icons/arrow.svg';
import { FixedOrGrowContainerProps } from '@controls/fixedOrGrowContainer';
import { SortContext } from '@controls/columnSort/columnSort.component';
import { Container, Button, Indicator, Label } from './dashboardListHeaderLabel.styles';

interface IDashboardListHeaderLabel extends FixedOrGrowContainerProps{
	children?: ReactNode;
	name?: string;
	onClick?: Dispatch<void>;
	hidden?: boolean;
}

export const DashboardListHeaderLabel = ({
	children,
	hidden = false,
	name,
	...containerProps
}: IDashboardListHeaderLabel): JSX.Element => {
	const { sortOrder, sortBy } = useContext(SortContext);

	const sortingDirection = sortOrder?.column === name ? sortOrder.order : null;

	const onClick = (e) => {
		e.stopPropagation();
		sortBy(name);
	};

	return (
		<Container
			{...containerProps}
			hidden={hidden}
		>
			{name ? (
				<Button onClick={onClick}>
					<Label>
						{children}
					</Label>
					{sortingDirection !== null && (
						<Indicator sortingDirection={sortingDirection}>
							<ArrowIcon />
						</Indicator>
					)}
				</Button>
			) : (
				<Label>
					{children}
				</Label>
			)}
		</Container>
	);
};
