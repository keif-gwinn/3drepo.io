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

import StarIcon from '@assets/icons/outlined/star-outlined.svg';
import ClockIcon from '@assets/icons/clock.svg';
import CrossIcon from '@assets/icons/close.svg';
import BellIcon from '@assets/icons/notifications.svg';
import TickIcon from '@assets/icons/tick.svg';
import { COLOR } from '@/v5/ui/themes/theme';
import { formatMessage } from '@/v5/services/intl';
import { Chip } from '../chip.styles';

export enum TicketStatuses {
	OPEN = 'open',
	IN_PROGRESS = 'in-progress',
	FOR_APPROVAL = 'for approval',
	CLOSED = 'closed',
	VOID = 'void',
}

const STATUS_MAP = {
	[TicketStatuses.OPEN]: {
		label: formatMessage({ id: 'chip.ticketStatus.open', defaultMessage: 'Open' }),
		colour: COLOR.BASE_MAIN,
		icon: <StarIcon />,
	},
	[TicketStatuses.IN_PROGRESS]: {
		label: formatMessage({ id: 'chip.ticketStatus.inProgress', defaultMessage: 'In Progress' }),
		colour: '#7156FF',
		icon: <ClockIcon />,
	},
	[TicketStatuses.FOR_APPROVAL]: {
		label: formatMessage({ id: 'chip.ticketStatus.forApproval', defaultMessage: 'For Approval' }),
		colour: '#0288D1',
		icon: <BellIcon />,
	},
	[TicketStatuses.CLOSED]: {
		label: formatMessage({ id: 'chip.ticketStatus.closed', defaultMessage: 'Closed' }),
		colour: '#2E7D32',
		icon: <TickIcon />,
	},
	[TicketStatuses.VOID]: {
		label: formatMessage({ id: 'chip.ticketStatus.void', defaultMessage: 'Void' }),
		colour: '#000',
		icon: <CrossIcon />,
	},
};

type ITicketStatusChip = {
	variant: 'outlined' | 'noBorder' | 'filled',
	state: TicketStatuses,
};
export const TicketStatusChip = ({ variant, state }: ITicketStatusChip) => (
	<Chip variant={variant} {...STATUS_MAP[state]} />
);