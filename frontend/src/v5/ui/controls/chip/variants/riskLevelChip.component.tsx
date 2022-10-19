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

import { formatMessage } from '@/v5/services/intl';
import { COLOR } from '@/v5/ui/themes/theme';
import { Chip } from '../chip.styles';

export enum RiskLevels {
	UNSET = 'Unset',
	VERY_LOW = 'Very Low',
	LOW = 'Low',
	MODERATE = 'Moderate',
	HIGH = 'High',
	VERY_HIGH = 'Very High',
}

const RISK_LEVELS_MAP = {
	[RiskLevels.UNSET]: {
		label: formatMessage({ id: 'chip.riskLevel.unset', defaultMessage: 'Unset Risk' }),
		$coloroverride: COLOR.BASE_LIGHT,
	},
	[RiskLevels.VERY_LOW]: {
		label: formatMessage({ id: 'chip.riskLevel.veryLow', defaultMessage: 'Very Low Risk' }),
		$coloroverride: COLOR.FAVOURITE_MAIN,
	},
	[RiskLevels.LOW]: {
		label: formatMessage({ id: 'chip.riskLevel.low', defaultMessage: 'Low Risk' }),
		$coloroverride: '#FF9800',
	},
	[RiskLevels.MODERATE]: {
		label: formatMessage({ id: 'chip.riskLevel.moderate', defaultMessage: 'Moderate Risk' }),
		$coloroverride: '#ED6C02',
	},
	[RiskLevels.HIGH]: {
		label: formatMessage({ id: 'chip.riskLevel.high', defaultMessage: 'High Risk' }),
		$coloroverride: COLOR.ERROR_MAIN,
	},
	[RiskLevels.VERY_HIGH]: {
		label: formatMessage({ id: 'chip.riskLevel.veryHigh', defaultMessage: 'Very High Risk' }),
		$coloroverride: '#000000',
	},
};

type IRiskLevelChip = {
	state: RiskLevels,
};

export const RiskLevelChip = ({ state = RiskLevels.UNSET }: IRiskLevelChip) => (
	<Chip variant="filled" {...RISK_LEVELS_MAP[state]} />
);
