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

import styled from 'styled-components';
import { DragAndDrop } from '@controls/dragAndDrop';
import { DashboardListHeader } from '@components/dashboard/dashboardList/dashboardListHeader';
import { FormModal } from '@controls/modal/formModal/formDialog.component';

const MODAL_PADDING = 35;

export const Modal = styled(FormModal)`
	.MuiDialogContent-root {
		padding: 0;
		margin: 0;
	}
	padding: 0;
	margin: 0;
`;

export const Container = styled.div`
	display: flex;
	flex-direction: row;
	height: 550px;
	width: 100%;
	box-sizing: border-box;
	overflow-x: hidden;
`;

export const Padding = styled.div`
	margin: ${MODAL_PADDING}px;
	padding-bottom: 0;
	width: 100%;
	box-sizing: border-box;
	padding-right: ${MODAL_PADDING * 2}px;
`;

export const DropZone = styled(DragAndDrop)`
	max-height: 190px;
	width: auto;
`;

export const UploadsListHeader = styled(DashboardListHeader)`
	padding: 0 45px 13px 25px;
	margin-top: 0;
`;