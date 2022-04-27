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

import { ViewerGui } from '@/v4/routes/viewerGui';
import { useParams } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { ThemeProvider as MuiThemeProvider } from '@mui/material';
import { ViewerParams } from '../routes.constants';
import { theme } from './theme';

export const Viewer = () => {
	const { teamspace, containerOrFederation } = useParams<ViewerParams>();
	const v4Match = {
		params: {
			model: containerOrFederation,
			teamspace,
			revision: '',
		} };

	return (
		<ThemeProvider theme={theme}>
			<MuiThemeProvider theme={theme}>
				<ViewerGui match={v4Match} />
			</MuiThemeProvider>
		</ThemeProvider>
	);
};