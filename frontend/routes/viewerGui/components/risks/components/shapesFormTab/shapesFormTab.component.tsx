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

import React from 'react';

// tslint:disable-next-line:max-line-length
import { AllMeasurementsList, IProps as IMeasusermentsListProps } from '../../../measurements/components/measurementsList/allMeasurementsList.component';
import { Content } from '../riskDetails/riskDetails.styles';

interface IProps extends IMeasusermentsListProps {
	active: boolean;
}

export const AttachmentsFormTab: React.FunctionComponent<IProps> = ({
	active,
	...props
}) => {
	return (
		<Content active={active}>
			<AllMeasurementsList {...props} />
		</Content>
		);
};
