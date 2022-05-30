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
	<svg
		width="22"
		height="22"
		viewBox="0 0 22 22"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		className={className}
	>
		<path
			d="M11.0012 9.20363e-07C4.92303 -0.00245691 0 4.91811 0 10.9914C0 15.794 3.07966 19.8764 7.36856 21.3757C7.94615 21.5207 7.85767 21.1103 7.85767 20.8301V18.9253C4.5224 19.3161 4.38722 17.1089 4.16356 16.7403C3.71132 15.9685 2.64216 15.7719 2.96168 15.4032C3.72115 15.0124 4.49536 15.5015 5.39247 16.8263C6.04134 17.7873 7.30712 17.6251 7.94861 17.4653C8.08871 16.8877 8.38856 16.3716 8.80148 15.971C5.34577 15.3516 3.90549 13.2428 3.90549 10.7358C3.90549 9.51916 4.30611 8.40085 5.09262 7.49883C4.59122 6.01184 5.13931 4.73869 5.21305 4.54944C6.64105 4.42163 8.12557 5.57189 8.24109 5.66283C9.05217 5.44409 9.97877 5.32857 11.016 5.32857C12.0581 5.32857 12.9872 5.449 13.8056 5.67021C14.0833 5.45883 15.4597 4.47079 16.787 4.59122C16.8582 4.78047 17.394 6.02413 16.9221 7.49145C17.7185 8.39593 18.124 9.52408 18.124 10.7432C18.124 13.2551 16.6739 15.3663 13.2084 15.9759C13.5052 16.2678 13.7409 16.6159 13.9017 16.9999C14.0624 17.384 14.1451 17.7962 14.1448 18.2125V20.9775C14.1645 21.1987 14.1448 21.4175 14.5135 21.4175C18.8663 19.9502 22 15.8382 22 10.9939C22 4.91811 17.0745 9.20363e-07 11.0012 9.20363e-07Z"
			fill="currentColor"
		/>
	</svg>
);
