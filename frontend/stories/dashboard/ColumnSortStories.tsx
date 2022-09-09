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

import { ComponentStory, ComponentMeta } from '@storybook/react';
import { DashboardListCollapse, DashboardListEmptyContainer, DashboardListEmptySearchResults, DashboardListHeader, DashboardListHeaderLabel, DashboardListItem } from '@components/dashboard/dashboardList';
import { DashboardListItemRow, DashboardListItemText } from '@components/dashboard/dashboardList/dashboardListItem/components';
import { useContext } from 'react';
import { ColumnSortComponent, SortContext, SortOrder } from '@controls/columnSort/columnSort.component';

export default {
	title: 'Crazy/ColumnSortContext',
	component: ColumnSortComponent,
	argTypes: {
		items: { control: 'object' },
	},
} as ComponentMeta<typeof ColumnSortComponent>;

const ObjectsListHeader = ({ columnNames, setSortConfig }) => (
	<DashboardListHeader onSortingChange={setSortConfig}>
		{(columnNames as string[]).map((columnName) => (
			<DashboardListHeaderLabel name={columnName}>{columnName}</DashboardListHeaderLabel>
		))}
	</DashboardListHeader>
);

const ObjectsList = () => {
	const { items, sortedItems } = useContext(SortContext);

	return (
		<DashboardListCollapse
			title={<>Sorted list</>}
		>
			{items.length > 0
			&& (
				<>
					<ObjectsListHeader setSortConfig={() => { }} columnNames={Object.keys(items[0])} />
					{
						sortedItems.map((item) => (
							<DashboardListItem key={JSON.stringify(item)}>
								<DashboardListItemRow>
									{Object.keys(item).map((key) => (
										<DashboardListItemText>
											{item[key]}
										</DashboardListItemText>
									))}
								</DashboardListItemRow>
							</DashboardListItem>
						))
					}
				</>
			)}

			{items.length === 0
			&& (
				<DashboardListEmptyContainer>
					<DashboardListEmptySearchResults />
				</DashboardListEmptyContainer>
			)}

		</DashboardListCollapse>
	);
};

const Template: ComponentStory<typeof ColumnSortComponent> = (args) => (
	<ColumnSortComponent {...args}>
		<ObjectsList />
	</ColumnSortComponent>
);

export const ListWithSortedItems = Template.bind({});
ListWithSortedItems.args = {
	items: [{ name: 'Winona', age: 43 }, { name: 'David', age: 42 }, { name: 'Millie', age: 14 }],
	defaultOrder: { column: 'name', order: SortOrder.Ascending },
};
