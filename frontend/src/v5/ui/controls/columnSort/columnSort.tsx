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

import { get } from 'lodash';
import { createContext, useEffect, useState } from 'react';

export enum SortOrder {
	Ascending,
	Descending,
}

interface ColumnSortOrder {
	column: string;
	order: SortOrder
}

export interface SortingType<T> {
	items: T[];
	sortedItems: T[];
	sortOrder: ColumnSortOrder | null;
	sortBy: (columnName: string) => void
}

const defaultValue: SortingType<any> = { items: [], sortedItems: [], sortOrder: null, sortBy: () => {} };
export const SortContext = createContext(defaultValue);
SortContext.displayName = 'SortingContext';

export interface ColumnSortComponentProps {
	items: any[];
	children: any;
	defaultSort: ColumnSortOrder | null;
}

const sortingFunction = (column) => (a, b): number => {
	const aValue = get(a, column);
	const bValue = get(b, column);

	if (typeof aValue === 'string') {
		return aValue.localeCompare(bValue);
	}

	if (typeof aValue === 'number') {
		return aValue - bValue;
	}

	if (aValue instanceof Date || bValue instanceof Date) {
		return (aValue || new Date(0)).getTime() - (bValue || new Date(0)).getTime();
	}

	return 0;
};

export const SortContextComponent = ({ items, children, defaultSort }: ColumnSortComponentProps) => {
	const [sortOrder, setSortOrder] = useState(defaultSort);

	const sortBy = (column: string) => {
		let order = SortOrder.Ascending;

		if (sortOrder.column === column) {
			order = sortOrder.order === SortOrder.Ascending ? SortOrder.Descending : SortOrder.Ascending;
		}

		setSortOrder({ column, order });
	};

	// eslint-disable-next-line max-len
	const [contextValue, setContextValue] = useState<SortingType<any>>({ items, sortedItems: items, sortOrder, sortBy });

	useEffect(() => {
		if (!sortOrder) {
			return;
		}

		const sortingFunctionWithDirection = sortOrder.order === SortOrder.Ascending
			? sortingFunction(sortOrder.column) : (a, b) => sortingFunction(sortOrder.column)(b, a);

		const sortedItems = [...items].sort(sortingFunctionWithDirection);

		setContextValue({ items, sortedItems, sortOrder, sortBy });
	}, [sortOrder]);

	return (
		<SortContext.Provider value={contextValue}>
			{children}
		</SortContext.Provider>
	);
};
