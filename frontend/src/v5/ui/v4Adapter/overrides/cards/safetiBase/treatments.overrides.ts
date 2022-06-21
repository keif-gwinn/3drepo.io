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

import { css } from 'styled-components';
import {
	SuggestionButtonWrapper,
	Container,
} from '@/v4/routes/viewerGui/components/risks/components/riskDetails/riskDetails.styles';
import { Content } from '@/v4/routes/viewerGui/components/risks/components/treatmentFormTab/treatmentFormTab.styles';
import { Container as TextField, FieldWrapper } from '@/v4/routes/components/textField/textField.styles';
import { StyledSelect } from '@/v4/routes/components/customTable/components/cellSelect/cellSelect.styles';

export default css`
	${Content} {
		margin-top: 15px;

		${TextField} {
			margin: 25px 0 0;

			.MuiFormControl-root {
				label {
					top: -17px;
				}
			}

			label {
				top: -16px;
				left: 0;
				font-size: 15px;
				transform: scale(.7);
				
				& ~ span {
					margin-top: 0;
					height: 24px;
					border: 1px solid ${({ theme }) => theme.palette.base.lightest};
				}
				
				& ~ * {
					position: relative;
					border-radius: 4px;
					background: #fff;
					height: 23px;
					box-sizing: border-box;
					line-height: 22px;
					padding: 0 10px;
					margin: -1px 0 0;
					font-size: 12px;
					color: ${({ theme }) => theme.palette.secondary.main};

					& > textarea {
						height: 100%;
					}
				}
			}
			
			button {
				margin: 0 10px 0 0;
				height: 15px;
				width: 15px;
				background-color: transparent;

				svg {
					margin: 0;
					font-size: 1rem;
				}
			}

			${FieldWrapper}:first-child::after {
				border-bottom: 1px solid transparent;
			}
		}

		${Container} {
			padding-top: 0;

			${StyledSelect} svg {
				/* TODO: fix after new palette is released */
				color: #C1C8D5;
				top: -13px;
			}

			&:first-of-type {
				padding-top: 30px;
			}
		}

		${SuggestionButtonWrapper} ~ * {
			margin-top: 10px;
		}
	}
`;
