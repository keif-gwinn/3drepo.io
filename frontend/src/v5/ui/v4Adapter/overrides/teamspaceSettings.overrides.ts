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
import { StyledChipInput } from '@/v4/routes/components/chipsInput/chipsInput.styles';
import { Container as Panel, Title } from '@/v4/routes/components/panel/panel.styles';
import { ButtonContainer, CreateMitigationsGrid, DataText, Headline, StyledForm, StyledGrid, SuggestionsContainer } from '@/v4/routes/teamspaceSettings/teamspaceSettings.styles';
import styled from 'styled-components';

export const V5TeamspaceSettingsOverrides = styled.div`
	${Panel} {
		border: none;
		box-shadow: none;
		${Title} {
			display: none;
		}
		${StyledForm} {
			overflow-y: hidden;
			padding: 0;
			.MuiAutocomplete-popper {
				display: none;
			}
			${StyledGrid} {
				padding: 0 0 30px 0;
				&${StyledGrid}:first-of-type {
					display: none;
				}
				${Headline} {
					${({ theme }) => theme.typography.h2};
					color: ${({ theme }) => theme.palette.secondary.main};
				}
			}
			
			${StyledChipInput} {
				margin-top: 0;
				.MuiAutocomplete-inputRoot {
					padding: 0;
					.MuiAutocomplete-tag {
						background-color: ${({ theme }) => theme.palette.tertiary.lightest};
						color: ${({ theme }) => theme.palette.secondary.main};
						border-radius: 5px;
						font-weight: 600;
						font-size: 12px;
						height: 30px;
						padding: 7px 15px;
						.MuiChip-label {
							padding: 0;
						}
						svg {
							margin: 0 0 0 5px;
							color: ${({ theme }) => theme.palette.secondary.main};
						}
					}
					.MuiInputBase-input {
						color: ${({ theme }) => theme.palette.secondary.main};
					}
				}
				fieldset, &:hover fieldset, .Mui-focused fieldset {
					border: none;
					box-shadow: none;
				}
			}
			${DataText} {
				color: ${({ theme }) => theme.palette.base.main};
			}
			${SuggestionsContainer} {
				padding: 0;
				${Headline} {
					${({ theme }) => theme.typography.h5};
				}
				.MuiIconButton-root {
					svg {
						color: ${({ theme }) => theme.palette.secondary.main};
					}
					&.Mui-disabled svg {
						color: ${({ theme }) => theme.palette.base.lightest};
					}
				}
			}
			${CreateMitigationsGrid} {
				width: 320px;
			}
			${ButtonContainer} {
				width: 84px;
				height: 51px;
				background-color: transparent;
				right: 0;
				bottom: -8px;
				
				button:not(.Mui-disabled) {
					background-color: ${({ theme }) => theme.palette.primary.main};
					color: ${({ theme }) => theme.palette.primary.contrast};
					:hover {
						background-color: ${({ theme }) => theme.palette.primary.dark};
					}
				}
			}
		}
	}
`;
