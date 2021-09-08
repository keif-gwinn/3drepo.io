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
import { Typography } from '@material-ui/core';
import { typography } from '@/v5/ui/themes/theme';

export const KickerTypography = styled(Typography).attrs({
	component: 'span',
})`
	font-weight: ${typography.kicker.fontWeight};
	font-size: ${typography.kicker.fontSize};
	line-height: ${typography.kicker.lineHeight};
	letter-spacing: ${typography.kicker.letterSpacing};
	text-transform: ${typography.kicker.textTransform};
`;

export const KickerTitleTypography = styled(Typography).attrs({
	component: 'span',
})`
	font-weight: ${typography.kickerTitle.fontWeight};
	font-size: ${typography.kickerTitle.fontSize};
	line-height: ${typography.kickerTitle.lineHeight};
	letter-spacing: ${typography.kickerTitle.letterSpacing};
	text-transform: ${typography.kickerTitle.textTransform};
`;
