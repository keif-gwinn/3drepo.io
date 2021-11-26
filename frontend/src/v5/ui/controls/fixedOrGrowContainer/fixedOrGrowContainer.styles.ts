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

import styled, { css } from 'styled-components';
import { Display } from '@/v5/ui/themes/media';

export const Container = styled.div<{width?: number}>`
	display: flex;
	flex: 1;
	
	${({ width }) => width && css`
		min-width: ${width}px;
		flex: 0;
	`}
	
	${({ tabletWidth }) => tabletWidth && css`
		@media (max-width: 1024px) {
			min-width: ${tabletWidth}px;
		}
	`}
	
	${({ mobileWidth }) => mobileWidth && css`
		@media (max-width: 768px) {
			min-width: ${mobileWidth}px;
		}
	`}

	${({ hideWhenSmallerThan }: { hideWhenSmallerThan: Display }) => hideWhenSmallerThan && css`
		@media (max-width: ${hideWhenSmallerThan}px) {
			display: none;
		}
  `};
`;
