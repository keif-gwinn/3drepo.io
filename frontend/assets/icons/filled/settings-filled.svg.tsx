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
type IProps = {
	className?: any;
};

export default ({ className }: IProps) => (
	<svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
		<path d="M13.8101 9.84003L12.5759 9.1147C12.7004 8.43065 12.7004 7.72892 12.5759 7.04487L13.8101 6.31954C13.952 6.23699 14.0158 6.06597 13.9694 5.90676C13.6478 4.8571 13.1002 3.90769 12.3846 3.11749C12.2745 2.99661 12.0949 2.96712 11.9559 3.04968L10.7216 3.77501C10.203 3.32094 9.60622 2.97007 8.96014 2.74009V1.29239C8.96014 1.12727 8.84715 0.982795 8.68781 0.947414C7.62453 0.705638 6.53519 0.717432 5.52406 0.947414C5.36472 0.982795 5.25173 1.12727 5.25173 1.29239V2.74304C4.60855 2.97597 4.01172 3.32684 3.49023 3.77795L2.25892 3.05263C2.11695 2.97007 1.94022 2.99661 1.83013 3.12044C1.11452 3.90769 0.566949 4.8571 0.24536 5.9097C0.196108 6.06892 0.262743 6.23993 0.404706 6.32249L1.63891 7.04782C1.51433 7.73186 1.51433 8.4336 1.63891 9.11765L0.404706 9.84297C0.262743 9.92553 0.199005 10.0965 0.24536 10.2558C0.566949 11.3054 1.11452 12.2548 1.83013 13.045C1.94022 13.1659 2.11985 13.1954 2.25892 13.1128L3.49312 12.3875C4.01172 12.8416 4.60855 13.1924 5.25462 13.4224V14.8731C5.25462 15.0382 5.36761 15.1827 5.52696 15.2181C6.59023 15.4598 7.67958 15.448 8.6907 15.2181C8.85005 15.1827 8.96304 15.0382 8.96304 14.8731V13.4224C9.60622 13.1895 10.203 12.8386 10.7245 12.3875L11.9587 13.1128C12.1007 13.1954 12.2774 13.1689 12.3875 13.045C13.1031 12.2578 13.6507 11.3084 13.9723 10.2558C14.0158 10.0936 13.952 9.92258 13.8101 9.84003ZM7.10594 10.4386C5.82827 10.4386 4.78817 9.38006 4.78817 8.07978C4.78817 6.77951 5.82827 5.721 7.10594 5.721C8.3836 5.721 9.4237 6.77951 9.4237 8.07978C9.4237 9.38006 8.3836 10.4386 7.10594 10.4386Z" fill="currentColor" />
	</svg>

);