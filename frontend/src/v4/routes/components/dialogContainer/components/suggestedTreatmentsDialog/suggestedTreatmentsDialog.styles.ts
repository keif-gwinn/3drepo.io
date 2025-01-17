/**
 *  Copyright (C) 2020 3D Repo Ltd
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

import DialogContent from '@mui/material/DialogContent';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import { ConditionalV5OrViewerScrollArea as ViewerScrollAreaBase } from '@/v5/ui/v4Adapter/components/conditionalV5OrViewerScrollArea.component';
import { isV5 } from '@/v4/helpers/isV5';

import { COLOR } from '../../../../../styles';

export const StyledTypography = styled(Typography).attrs({
	component: 'span'
})<{ inline: boolean }>`
	&& {
		display: ${({ inline }) => inline ? 'inline' : 'inherit'};
	}
`;

export const StyledList = styled(List)``;

export const TextLabel = styled.span``;

export const StyledListItem = styled(ListItem)`
	&& {
		padding-right: 80px;
	}
`;

export const StyledGrid = styled(Grid)`
	&& {
		position: absolute;
		z-index: 1;
		top: 0;
		left: 0;
		right: 0;
		padding: 12px 24px;
		background-color: ${COLOR.LIGHT_GRAY};
		border-bottom: 1px solid rgba(0, 0, 0, 0.12);
	}
`;

export const Label = styled(Grid)`
	&& {
		flex-grow: 0;
		max-width: 8.333333%;
		flex-basis: 8.333333%;
	}
`;

export const TextContainer = styled(Grid)`
	&& {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
`;

export const Container = styled.div`
	position: relative;
	width: 600px;
	min-height: 40vh;
`;

export const ViewerScrollArea = styled(ViewerScrollAreaBase).attrs({
	autoHeight: true,
	autoHeightMax: isV5() ? '100%' : '60vh',
})`
	margin-top: 66px;
`;

export const StyledDialogContent = styled(DialogContent)`
	&& {
		padding-top: 0;
		overflow: unset;
	}
`;

export const Description = styled.span`
	color: ${COLOR.BLACK_54};
	font-size: 0.75rem;
	font-weight: 400;
	line-height: 1.375em;
	white-space: normal;
	display: block;
	overflow: hidden;
`;

export const ExpandButton = styled.span`
	font-size: 0.75rem;
	cursor: pointer;
	display: block;
	text-align: right;
`;
