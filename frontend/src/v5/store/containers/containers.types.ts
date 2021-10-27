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

import { Action } from 'redux';
import { IUser } from '@/v5/store/teamspaces/teamspaces.redux';

export interface IRevisions {
	timestamp: Date;
	tag: string;
	author: IUser | string;
	desc: string;
	void?: boolean;
}

export interface IContainersState {
	containers: Record<string, IContainer[]>;
	filterQuery: string;
	currentProject: string;
	isPending: boolean;
}

export enum ContainerStatuses {
	OK = 'ok',
	FAILED = 'failed',
	UPLOADING = 'uploading',
	UPLOADED = 'uploaded',
	QUEUED = 'queued',
	PROCESSING = 'processing',
}

export interface IContainer {
	_id: string;
	name: string;
	latestRevision: string;
	revisionsCount: number;
	lastUpdated: Date;
	type: string;
	code: string;
	status: ContainerStatuses;
	isFavourite: boolean;
	role: string;
	revisions: IRevisions[];
	isPending: boolean;
}

export interface FavouritePayload {
	teamspace: string;
	projectId: string;
	containerId: string;
}

export type FetchContainersPayload = {
	teamspace: string;
	projectId: string;
};

export type RevisionVoidStatusPayload = {
	teamspace?: string;
	projectId: string;
	containerId: string;
	revisionId: string;
	isVoid: boolean;
};

export type SetFilterQueryAction = Action<'SET_FILTER_QUERY'> & { query: string};
export type AddFavouriteAction = Action<'ADD_FAVOURITE'> & FavouritePayload;
export type RemoveFavouriteAction = Action<'REMOVE_FAVOURITE'> & FavouritePayload;
export type SetFavouriteSuccessAction = Action<'SET_FAVOURITE_SUCCESS'> & {projectId: string, containerId: string, isFavourite: boolean};
export type SetRevisionVoidStatusAction = Action<'SET_REVISION_VOID_STATUS'> & RevisionVoidStatusPayload;
export type SetRevisionVoidStatusSuccessAction = Action<'SET_REVISION_VOID_STATUS_SUCCESS'> & { projectId: string, containerId: string; revisionId: string, isVoid: boolean };
export type FetchContainersAction = Action<'FETCH_CONTAINERS'> & FetchContainersPayload;
export type FetchContainersSuccessAction = Action<'FETCH_CONTAINERS_SUCCESS'> & { projectId: string, containers: IContainer[] };

export interface IContainersActionCreators {
	setFilterQuery: (query: string) => SetFilterQueryAction;
	addFavourite: (teamspace: string, projectId: string, containerId: string) => AddFavouriteAction;
	removeFavourite: (teamspace: string, projectId: string, containerId: string) => RemoveFavouriteAction;
	setFavouriteSuccess: (projectId: string, containerId: string, isFavourite: boolean) => SetFavouriteSuccessAction;
	setRevisionVoidStatus:
	(teamspace: string, projectId: string, containerId: string, revisionId: string, isVoid: boolean) =>
	SetRevisionVoidStatusAction;
	setRevisionVoidStatusSuccess:
	(projectId: string, containerId: string, revisionId: string, isVoid: boolean) =>
	SetRevisionVoidStatusSuccessAction;
	fetchContainers: (teamspace: string, projectId: string) => FetchContainersAction;
	fetchContainersSuccess: (projectId: string, containers: IContainer[]) => FetchContainersSuccessAction;
	fetchRevisions: (teamspace: string, projectId: string, containerId: string) => any;
	setRevisionsIsPending: (projectId: string, containerId: string, isPending: boolean) => any;
	fetchRevisionsSuccess: (projectId: string, containerId: string, revisions: IRevisions[]) => any;
	setCurrentProject: (projectId: string) => any;
	setIsPending: (isPending: boolean) => any;
}
