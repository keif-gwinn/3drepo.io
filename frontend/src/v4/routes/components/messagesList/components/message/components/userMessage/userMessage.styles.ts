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
import { isV5 } from '@/v4/helpers/isV5';
import styled, { css } from 'styled-components';

import { COLOR } from '../../../../../../../styles';
import { MarkdownMessage } from '../markdownMessage/markdownMessage.component';

export const Container = styled.div<{ self?: boolean }>`
	width: 100%;
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	position: relative;
	${({ self }) => self && isV5() && 'flex-direction: row-reverse;'}
`;

export const Comment = styled(MarkdownMessage)`
	margin: 0;
	color: ${COLOR.BLACK_50};
	font-size: 12px;

	p {
		margin: 0;
	}
`;

// TODO - fix after new palette is released
const regularCommentStyles = css`
	background-color: ${isV5() ? '#edf0f8' : COLOR.WHITE};
	${isV5() && 'margin-right: 0 !important;'}

	${Comment} {
		color: ${COLOR.BLACK_60};
	}
`;

// TODO - fix after new palette is released
const selfCommentStyles = css`
	background-color: ${isV5() ? '#f5f8fa' : COLOR.WHITE};
	${isV5() && 'margin-left: 0 !important;'}
`;

export const CommentContainer = styled.div<{self?: boolean}>`
	width: 100%;
	margin-left: 10px;
	margin-right: 32px;
	padding: 8px 14px;
	border-radius: 10px;
	${({ self }) => self ? selfCommentStyles : regularCommentStyles};
`;
