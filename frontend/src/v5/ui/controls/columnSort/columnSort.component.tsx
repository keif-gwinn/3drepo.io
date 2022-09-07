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

export interface SortingType<T> {
	items: T[];
	sortedItems: T[];
	columnsSorting: Record<string, SortOrder>;
	sortBy: (columnName: string) => void
}

const defaultValue: SortingType<any> = { items: [], sortedItems: [], columnsSorting: {}, sortBy: () => {} };
export const SortContext = createContext(defaultValue);
SortContext.displayName = 'SortingContext';

export interface Props {
	items: any[];
	children: any;
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

export const ColumnSort = ({ items, children }:Props) => {
	const [columnsSorting, setColumns] = useState({});
	const sortBy = (field: string) => {
		let sortOrder = (columnsSorting[field] || SortOrder.Ascending);
		sortOrder = sortOrder === SortOrder.Ascending ? SortOrder.Descending : SortOrder.Ascending;

		setColumns({
			...columnsSorting,
			[field]: sortOrder,
		});
	};

	const [contextValue, setContextValue] = useState({ items, sortedItems: items, columnsSorting, sortBy });

	useEffect(() => {
		const sortingFunctionWithDirection = direction === SortingDirection.ASCENDING
		? sortingFunction : (a: T, b: T) => sortingFunction(b, a);

	return [...items].sort(sortingFunctionWithDirection);
};



		setContextValue({ items, sortedItems, sortBy });
	}, [columnsSorting]);

	return (
		<SortContext.Provider value={contextValue}>
			{children}
		</SortContext.Provider>
	);
};
