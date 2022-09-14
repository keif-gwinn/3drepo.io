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

import { SortContextComponent, ColumnSortComponentProps, SortContext, SortOrder } from '@controls/columnSort/sortContext';
import { SearchContext, SearchContextComponent, SearchContextComponentProps } from '@controls/search/searchContext';
import { createContext } from 'react';

export interface DashboardListContextType<T> {
	items:T[],
	processedItems: T[]
}

export const DEFAULT_SORT_CONFIG = {
	column: 'name',
	order: SortOrder.Descending,
};

const defaultValue: DashboardListContextType<any> = { items: [], processedItems: [] };
export const DashboardListContext = createContext(defaultValue);
DashboardListContext.displayName = 'DashboardListContext';

type DashboardListContextComponentProps = SearchContextComponentProps & ColumnSortComponentProps;

export const DashboardListContextComponent = ({ children, items, defaultSort }: DashboardListContextComponentProps) => (
	<SearchContextComponent items={items}>
		<SearchContext.Consumer>
			{({ filteredItems }) => (
				<SortContextComponent items={filteredItems} defaultSort={defaultSort}>
					<SortContext.Consumer>
						{({ sortedItems }) => (
							<DashboardListContext.Provider value={{ items, processedItems: sortedItems }}>
								{children}
							</DashboardListContext.Provider>
						)}
					</SortContext.Consumer>
				</SortContextComponent>
			)}
		</SearchContext.Consumer>
	</SearchContextComponent>
);
