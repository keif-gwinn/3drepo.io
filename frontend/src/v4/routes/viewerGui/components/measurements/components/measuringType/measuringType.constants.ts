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

import CSAMIcon from '@assets/icons/measure/custom_surface_area_measurement.svg';
import CSAMActiveIcon from '@assets/icons/measure/custom_surface_area_measurement_selected.svg';
import MinimumDistanceIcon from '@assets/icons/measure/minimum_distance.svg';
import MinimumDistanceActiveIcon from '@assets/icons/measure/minimum_distance_selected.svg';
import PointIcon from '@assets/icons/measure/point.svg';
import PointActiveIcon from '@assets/icons/measure/point_selected.svg';
import Point2PointIcon from '@assets/icons/measure/point_to_point.svg';
import Point2PointActiveIcon from '@assets/icons/measure/point_to_point_selected.svg';
import RayCastIcon from '@assets/icons/measure/ray_cast.svg';
import RayCastActiveIcon from '@assets/icons/measure/ray_cast_selected.svg';
import SAMIcon from '@assets/icons/measure/surface_area_measurement.svg';
import SAMActiveIcon from '@assets/icons/measure/surface_area_measurement_selected.svg';

import {
	ACTIVE, DEFAULT, MEASURING_TYPE
} from '@/v4/modules/measurements/measurements.constants';

import { VIEWER_MEASURING_MODE } from '@/v4/constants/viewer';

const MEASURING_TYPE_ICON = {
	[MEASURING_TYPE.POINT]: {
		[DEFAULT]: PointIcon,
		[ACTIVE]: PointActiveIcon,
	},
	[MEASURING_TYPE.POINT_TO_POINT]: {
		[DEFAULT]: Point2PointIcon,
		[ACTIVE]: Point2PointActiveIcon,
	},
	[MEASURING_TYPE.SAM]: {
		[DEFAULT]: SAMIcon,
		[ACTIVE]: SAMActiveIcon,
	},
	[MEASURING_TYPE.CSAM]: {
		[DEFAULT]: CSAMIcon,
		[ACTIVE]: CSAMActiveIcon,
	},
	[MEASURING_TYPE.MINIMUM_DISTANCE]: {
		[DEFAULT]: MinimumDistanceIcon,
		[ACTIVE]: MinimumDistanceActiveIcon,
	},
	[MEASURING_TYPE.RAY_CAST]: {
		[DEFAULT]: RayCastIcon,
		[ACTIVE]: RayCastActiveIcon,
	},
};

export const MEASURING_TYPES = [
	{
		name: MEASURING_TYPE.POINT,
		mode: VIEWER_MEASURING_MODE.POINT,
		icon: MEASURING_TYPE_ICON[MEASURING_TYPE.POINT][DEFAULT],
		activeIcon: MEASURING_TYPE_ICON[MEASURING_TYPE.POINT][ACTIVE],
	},
	{
		name: MEASURING_TYPE.POINT_TO_POINT,
		mode: VIEWER_MEASURING_MODE.POINT_TO_POINT,
		icon: MEASURING_TYPE_ICON[MEASURING_TYPE.POINT_TO_POINT][DEFAULT],
		activeIcon: MEASURING_TYPE_ICON[MEASURING_TYPE.POINT_TO_POINT][ACTIVE],
	},
	{
		name: MEASURING_TYPE.RAY_CAST,
		mode: VIEWER_MEASURING_MODE.RAY_CAST,
		icon: MEASURING_TYPE_ICON[MEASURING_TYPE.RAY_CAST][DEFAULT],
		activeIcon: MEASURING_TYPE_ICON[MEASURING_TYPE.RAY_CAST][ACTIVE],
	},
	{
		name: MEASURING_TYPE.MINIMUM_DISTANCE,
		mode: VIEWER_MEASURING_MODE.MINIMUM_DISTANCE,
		icon: MEASURING_TYPE_ICON[MEASURING_TYPE.MINIMUM_DISTANCE][DEFAULT],
		activeIcon: MEASURING_TYPE_ICON[MEASURING_TYPE.MINIMUM_DISTANCE][ACTIVE],
	},
	{
		name: MEASURING_TYPE.SAM,
		mode: VIEWER_MEASURING_MODE.SAM,
		icon: MEASURING_TYPE_ICON[MEASURING_TYPE.SAM][DEFAULT],
		activeIcon: MEASURING_TYPE_ICON[MEASURING_TYPE.SAM][ACTIVE],
	},
	{
		name: MEASURING_TYPE.CSAM,
		mode: VIEWER_MEASURING_MODE.CSAM,
		icon: MEASURING_TYPE_ICON[MEASURING_TYPE.CSAM][DEFAULT],
		activeIcon: MEASURING_TYPE_ICON[MEASURING_TYPE.CSAM][ACTIVE],
	},
];

export const BASIC_TYPES = [
	VIEWER_MEASURING_MODE.POINT_TO_POINT,
	VIEWER_MEASURING_MODE.CSAM
];
