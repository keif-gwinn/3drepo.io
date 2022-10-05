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

export type PropertyTypeDefinition = 'text' | 'longText' | 'boolean' | 'number' | 'date' | 'view' | 'manyOf' | 'oneOf' | 'image' | 'coords' | 'measurements';

export interface PropertyDefinition {
	name: string;
	type: PropertyTypeDefinition;
	values?: string[] | 'jobsAndUsers';
	default?: string;
	readOnly?: boolean;
	required?: boolean;
	deprecated?: boolean;
}

export interface ITicket {
	_id: string,
	title: string,
	number: number,
	type: string,
	properties: Record<string, any>,
	modules?: Record<string, Record<string, any>>,
}

export interface ITemplate {
	_id: string;
	name: string;
	code: string;
	properties: PropertyDefinition[];
	modules?: {
		name: string;
		deprecated?: boolean;
		properties: PropertyDefinition[];
	}
	config: any;
}

export type NewTicket = Omit<ITicket, '_id'>;