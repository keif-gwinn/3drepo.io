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

import Scrollbars from 'react-custom-scrollbars';
import styled from 'styled-components';
import { COLOR } from '@/v5/ui/themes/theme';

export const ScrollbarWrapper = styled(Scrollbars).attrs({
	autoHideTimeout: 3000,
	autoHideDuration: 300,
	autohide: true,
	renderThumbVertical: ({ style }) => (
		<div
			style={{
				...style,
				backgroundColor: COLOR.BASE_LIGHTEST,
				right: '3px',
				bottom: '6px',
				top: '0px',
				borderRadius: '3px',
				width: '6px',
			}}
		/>
	),
})`
	& > div:last-child > div {
		z-index: 6;
		right: 2px !important;
		/* scrollbar-width: 0px;
		::-webkit-scrollbar {
			width: 0;
		} */
	}
`;
