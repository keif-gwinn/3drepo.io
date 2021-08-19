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

import React from 'react';
import { Typography, Button, Divider, TextField, SvgIcon } from '@material-ui/core';
import AddIcon from '@material-ui/icons/AddCircle';
import { useForm } from 'react-hook-form';

import { Breadcrumbs } from '@components/shared/breadcrumbs';
import { TopNavigation } from '@components/shared/topNavigation';
import { CircleButton } from '@components/shared/circleButton';
import { Container, ContrastBackground } from './themeLayout.styles';

export const ThemeLayout = (): JSX.Element => {
	const { register } = useForm();

	return (
		<Container>
			<Typography variant="h1" gutterBottom>Theme Demonstration Page</Typography>
			<Typography variant="h2" gutterBottom>Buttons</Typography>
			<Typography variant="h3" gutterBottom>button-contained-standard</Typography>

			<Button variant="contained" color="primary">Default</Button>
			<Button variant="contained" color="primary" disabled>Disabled</Button>
			<Divider />

			<Button variant="contained" color="primary" startIcon={<AddIcon />}>Default</Button>
			<Button variant="contained" color="primary" startIcon={<AddIcon />} disabled>Disabled</Button>
			<Divider />

			<Button variant="contained" color="secondary">Default</Button>
			<Button variant="contained" color="secondary" disabled>Disabled</Button>
			<Divider />

			<Button variant="contained" color="secondary" startIcon={<AddIcon />}>Default</Button>
			<Button variant="contained" color="secondary" startIcon={<AddIcon />} disabled>Disabled</Button>
			<Divider />

			<Typography variant="h3" gutterBottom>button-outlined-standard</Typography>

			<Button variant="outlined" color="primary">Default</Button>
			<Button variant="outlined" color="primary" disabled>Disabled</Button>
			<Divider />

			<Button variant="outlined" color="primary" startIcon={<AddIcon />}>Default</Button>
			<Button variant="outlined" color="primary" startIcon={<AddIcon />} disabled>Disabled</Button>
			<Divider />

			<Button variant="outlined" color="secondary">Default</Button>
			<Button variant="outlined" color="secondary" disabled>Disabled</Button>
			<Divider />

			<Button variant="outlined" color="secondary" startIcon={<AddIcon />}>Default</Button>
			<Button variant="outlined" color="secondary" startIcon={<AddIcon />} disabled>Disabled</Button>
			<Divider />

			<Typography variant="h3" gutterBottom>button-contained-small</Typography>

			<Button variant="contained" size="small" color="primary">Default</Button>
			<Button variant="contained" size="small" color="primary" disabled>Disabled</Button>
			<Divider />

			<Button variant="contained" size="small" color="primary" startIcon={<AddIcon />}>Default</Button>
			<Button variant="contained" size="small" color="primary" startIcon={<AddIcon />} disabled>Disabled</Button>
			<Divider />

			<Button variant="contained" size="small" color="secondary">Default</Button>
			<Button variant="contained" size="small" color="secondary" disabled>Disabled</Button>
			<Divider />

			<Button variant="contained" size="small" color="secondary" startIcon={<AddIcon />}>Default</Button>
			<Button variant="contained" size="small" color="secondary" startIcon={<AddIcon />} disabled>Disabled</Button>
			<Divider />

			<Typography variant="h3" gutterBottom>button-outlined-small</Typography>

			<Button variant="outlined" size="small" color="primary">Default</Button>
			<Button variant="outlined" size="small" color="primary" disabled>Disabled</Button>
			<Divider />

			<Button variant="outlined" size="small" color="primary" startIcon={<AddIcon />}>Default</Button>
			<Button variant="outlined" size="small" color="primary" startIcon={<AddIcon />} disabled>Disabled</Button>
			<Divider />

			<Button variant="outlined" size="small" color="secondary">Default</Button>
			<Button variant="outlined" size="small" color="secondary" disabled>Disabled</Button>
			<Divider />

			<Button variant="outlined" size="small" color="secondary" startIcon={<AddIcon />}>Default</Button>
			<Button variant="outlined" size="small" color="secondary" startIcon={<AddIcon />} disabled>Disabled</Button>
			<Divider />

			<Typography variant="h3" gutterBottom>button-text</Typography>

			<Button variant="text" color="primary">Default</Button>
			<Button variant="text" color="primary" disabled>Disabled</Button>
			<Divider />

			<Button variant="text" color="primary" startIcon={<AddIcon />}>Default</Button>
			<Button variant="text" color="primary" startIcon={<AddIcon />} disabled>Disabled</Button>
			<Divider />
			<TextField label="Input label" {...register('enabledInput')} />
			<br />
			<TextField label="Disabled*" value="disabled value" disabled />
			{' '}
			<br />
			<TextField label="Error*" {...register('errorInput')} error />
			&nbsp;
			{' '}
			<br />
			.
			<br />
			<TextField value="Input text without label" />
			<br />
			<Divider />

			<Typography variant="h2" gutterBottom>UI controls needed for basic layout</Typography>
			<Typography variant="h3" gutterBottom>Breadcrumbs</Typography>
			<Breadcrumbs />

			<Typography variant="h3" gutterBottom>Top Navigation</Typography>
			<ContrastBackground>
				<TopNavigation />
			</ContrastBackground>

			<Typography variant="h3" gutterBottom>Circle buttons</Typography>
			<Typography variant="h4" gutterBottom>icon-star</Typography>

			<ContrastBackground>
				<CircleButton>
					<SvgIcon viewBox="0 0 16 16">
						<path d="M15.4829 5.63406L10.6864 4.90408L8.54222 0.352135C8.48365 0.227506 8.38731 0.126615 8.26829 0.0652895C7.96981 -0.0890138 7.6071 0.0395723 7.45786 0.352135L5.3137 4.90408L0.517213 5.63406C0.384974 5.65384 0.26407 5.71912 0.171503 5.81803C0.0595945 5.93848 -0.0020722 6.10053 5.31712e-05 6.26856C0.00217854 6.4366 0.0679221 6.59688 0.182838 6.71418L3.65316 10.2572L2.83328 15.2602C2.81405 15.3766 2.82635 15.4963 2.86878 15.6057C2.91121 15.7151 2.98207 15.8099 3.07333 15.8793C3.16459 15.9488 3.27259 15.99 3.38509 15.9984C3.4976 16.0068 3.6101 15.982 3.70983 15.9269L8.00004 13.5648L12.2902 15.9269C12.4074 15.9922 12.5434 16.0139 12.6737 15.9902C13.0024 15.9308 13.2235 15.6044 13.1668 15.2602L12.3469 10.2572L15.8172 6.71418C15.9117 6.61724 15.974 6.49064 15.9929 6.35216C16.0439 6.00597 15.8135 5.68549 15.4829 5.63406Z" />
					</SvgIcon>
				</CircleButton>
				<CircleButton disabled>
					<SvgIcon viewBox="0 0 16 16">
						<path d="M15.4829 5.63406L10.6864 4.90408L8.54222 0.352135C8.48365 0.227506 8.38731 0.126615 8.26829 0.0652895C7.96981 -0.0890138 7.6071 0.0395723 7.45786 0.352135L5.3137 4.90408L0.517213 5.63406C0.384974 5.65384 0.26407 5.71912 0.171503 5.81803C0.0595945 5.93848 -0.0020722 6.10053 5.31712e-05 6.26856C0.00217854 6.4366 0.0679221 6.59688 0.182838 6.71418L3.65316 10.2572L2.83328 15.2602C2.81405 15.3766 2.82635 15.4963 2.86878 15.6057C2.91121 15.7151 2.98207 15.8099 3.07333 15.8793C3.16459 15.9488 3.27259 15.99 3.38509 15.9984C3.4976 16.0068 3.6101 15.982 3.70983 15.9269L8.00004 13.5648L12.2902 15.9269C12.4074 15.9922 12.5434 16.0139 12.6737 15.9902C13.0024 15.9308 13.2235 15.6044 13.1668 15.2602L12.3469 10.2572L15.8172 6.71418C15.9117 6.61724 15.974 6.49064 15.9929 6.35216C16.0439 6.00597 15.8135 5.68549 15.4829 5.63406Z" />
					</SvgIcon>
				</CircleButton>
			</ContrastBackground>

			<Typography variant="h4" gutterBottom>icon-intercom</Typography>

			<ContrastBackground>
				<CircleButton motive="contrast" aria-label="intercom">
					<SvgIcon viewBox="0 0 10 17">
						<path d="M4.31055 11.8936H5.72461V11.4804C5.74805 9.79699 6.2168 9.0318 7.63086 8.12123C9.11523 7.17241 9.86523 6.08584 9.86523 4.53252C9.86523 2.19871 8.08398 0.5 5.49023 0.5C2.99805 0.5 1.06836 2.11454 0.990234 4.63199H2.4668C2.54492 2.73434 3.92773 1.72429 5.49023 1.72429C7.13867 1.72429 8.44336 2.81851 8.44336 4.47131C8.44336 5.64969 7.80273 6.49904 6.66211 7.22597C5.10742 8.19775 4.32617 9.06241 4.31055 11.4804V11.8936ZM5.06055 16.5C5.68555 16.5 6.18555 16.0026 6.18555 15.3981C6.18555 14.786 5.68555 14.2963 5.06055 14.2963C4.44336 14.2963 3.93555 14.786 3.93555 15.3981C3.93555 16.0026 4.44336 16.5 5.06055 16.5Z" fill="white" />
						<path d="M4.31055 11.8936H5.72461V11.4804C5.74805 9.79699 6.2168 9.0318 7.63086 8.12123C9.11523 7.17241 9.86523 6.08584 9.86523 4.53252C9.86523 2.19871 8.08398 0.5 5.49023 0.5C2.99805 0.5 1.06836 2.11454 0.990234 4.63199H2.4668C2.54492 2.73434 3.92773 1.72429 5.49023 1.72429C7.13867 1.72429 8.44336 2.81851 8.44336 4.47131C8.44336 5.64969 7.80273 6.49904 6.66211 7.22597C5.10742 8.19775 4.32617 9.06241 4.31055 11.4804V11.8936ZM5.06055 16.5C5.68555 16.5 6.18555 16.0026 6.18555 15.3981C6.18555 14.786 5.68555 14.2963 5.06055 14.2963C4.44336 14.2963 3.93555 14.786 3.93555 15.3981C3.93555 16.0026 4.44336 16.5 5.06055 16.5Z" fill="url(#paint0_linear)" />
					</SvgIcon>
				</CircleButton>
				<CircleButton motive="contrast" aria-label="intercom" disabled>
					<SvgIcon viewBox="0 0 10 17">
						<path d="M4.31055 11.8936H5.72461V11.4804C5.74805 9.79699 6.2168 9.0318 7.63086 8.12123C9.11523 7.17241 9.86523 6.08584 9.86523 4.53252C9.86523 2.19871 8.08398 0.5 5.49023 0.5C2.99805 0.5 1.06836 2.11454 0.990234 4.63199H2.4668C2.54492 2.73434 3.92773 1.72429 5.49023 1.72429C7.13867 1.72429 8.44336 2.81851 8.44336 4.47131C8.44336 5.64969 7.80273 6.49904 6.66211 7.22597C5.10742 8.19775 4.32617 9.06241 4.31055 11.4804V11.8936ZM5.06055 16.5C5.68555 16.5 6.18555 16.0026 6.18555 15.3981C6.18555 14.786 5.68555 14.2963 5.06055 14.2963C4.44336 14.2963 3.93555 14.786 3.93555 15.3981C3.93555 16.0026 4.44336 16.5 5.06055 16.5Z" fill="white" />
						<path d="M4.31055 11.8936H5.72461V11.4804C5.74805 9.79699 6.2168 9.0318 7.63086 8.12123C9.11523 7.17241 9.86523 6.08584 9.86523 4.53252C9.86523 2.19871 8.08398 0.5 5.49023 0.5C2.99805 0.5 1.06836 2.11454 0.990234 4.63199H2.4668C2.54492 2.73434 3.92773 1.72429 5.49023 1.72429C7.13867 1.72429 8.44336 2.81851 8.44336 4.47131C8.44336 5.64969 7.80273 6.49904 6.66211 7.22597C5.10742 8.19775 4.32617 9.06241 4.31055 11.4804V11.8936ZM5.06055 16.5C5.68555 16.5 6.18555 16.0026 6.18555 15.3981C6.18555 14.786 5.68555 14.2963 5.06055 14.2963C4.44336 14.2963 3.93555 14.786 3.93555 15.3981C3.93555 16.0026 4.44336 16.5 5.06055 16.5Z" fill="url(#paint0_linear)" />
					</SvgIcon>
				</CircleButton>
			</ContrastBackground>

			<Typography variant="h4" gutterBottom>icon-nav-notifications</Typography>
			<ContrastBackground>
				<CircleButton motive="contrast" aria-label="notifications">
					<SvgIcon viewBox="0 0 17 17">
						<path d="M14.4737 8.96875L16.1916 11.9814H16.1914L16.2181 12.0281C16.2944 12.162 16.3328 12.3123 16.3295 12.4643C16.3263 12.6163 16.2815 12.765 16.1995 12.8958C16.1174 13.0267 16.0009 13.1352 15.8612 13.2107C15.7214 13.2861 15.5633 13.3259 15.4023 13.3259H11.9294H11.895L11.8983 13.3601C11.9077 13.4592 11.9128 13.5593 11.9128 13.6607C11.9128 14.5375 11.5461 15.3788 10.8929 15.9993C10.2396 16.6199 9.35317 16.9688 8.4286 16.9688C7.50402 16.9688 6.61762 16.6199 5.96431 15.9993C5.31107 15.3788 4.94439 14.5375 4.94439 13.6607C4.94447 13.5604 4.94931 13.4601 4.95891 13.3601L4.96219 13.3259H4.9278H1.45488C1.2939 13.3259 1.13576 13.2862 0.995977 13.2107C0.856198 13.1353 0.739649 13.0267 0.657602 12.8958C0.575564 12.765 0.530792 12.6163 0.527535 12.4643C0.524279 12.3123 0.562645 12.162 0.638996 12.0281L0.61185 12.0126L0.638997 12.0281L2.38362 8.96875L2.38773 8.96156V8.95327V5.76786C2.38773 2.60621 5.09617 0.03125 8.42864 0.03125C11.7611 0.03125 14.4695 2.60621 14.4695 5.76786V8.95327V8.96155L14.4737 8.96875ZM6.21474 13.3259H6.1879L6.18385 13.3524C6.13899 13.6459 6.1583 13.945 6.24056 14.231C6.32281 14.5171 6.46621 14.7838 6.66173 15.0146C6.85724 15.2455 7.10065 15.4355 7.37671 15.5728C7.65277 15.7102 7.95559 15.792 8.2663 15.8132C8.577 15.8344 8.88899 15.7945 9.18281 15.696C9.47663 15.5976 9.74605 15.4426 9.97419 15.2407C10.2023 15.0389 10.3844 14.7944 10.5088 14.5225C10.6332 14.2506 10.6973 13.9572 10.697 13.6607C10.6969 13.5575 10.689 13.4545 10.6734 13.3524L10.6693 13.3259H10.6425H6.21474ZM1.96428 12.1274L1.93763 12.1741H1.99143H14.8658H14.9196L14.8929 12.1274L13.2537 9.25273V5.76786C13.2537 4.55135 12.7449 3.38502 11.8399 2.52534C10.9349 1.66571 9.70782 1.18304 8.42864 1.18304C7.14946 1.18304 5.92236 1.66571 5.01738 2.52534C4.11234 3.38502 3.60358 4.55135 3.60358 5.76786V9.25273L1.96428 12.1274Z" fill="white" />
						<path d="M14.4737 8.96875L16.1916 11.9814H16.1914L16.2181 12.0281C16.2944 12.162 16.3328 12.3123 16.3295 12.4643C16.3263 12.6163 16.2815 12.765 16.1995 12.8958C16.1174 13.0267 16.0009 13.1352 15.8612 13.2107C15.7214 13.2861 15.5633 13.3259 15.4023 13.3259H11.9294H11.895L11.8983 13.3601C11.9077 13.4592 11.9128 13.5593 11.9128 13.6607C11.9128 14.5375 11.5461 15.3788 10.8929 15.9993C10.2396 16.6199 9.35317 16.9688 8.4286 16.9688C7.50402 16.9688 6.61762 16.6199 5.96431 15.9993C5.31107 15.3788 4.94439 14.5375 4.94439 13.6607C4.94447 13.5604 4.94931 13.4601 4.95891 13.3601L4.96219 13.3259H4.9278H1.45488C1.2939 13.3259 1.13576 13.2862 0.995977 13.2107C0.856198 13.1353 0.739649 13.0267 0.657602 12.8958C0.575564 12.765 0.530792 12.6163 0.527535 12.4643C0.524279 12.3123 0.562645 12.162 0.638996 12.0281L0.61185 12.0126L0.638997 12.0281L2.38362 8.96875L2.38773 8.96156V8.95327V5.76786C2.38773 2.60621 5.09617 0.03125 8.42864 0.03125C11.7611 0.03125 14.4695 2.60621 14.4695 5.76786V8.95327V8.96155L14.4737 8.96875ZM6.21474 13.3259H6.1879L6.18385 13.3524C6.13899 13.6459 6.1583 13.945 6.24056 14.231C6.32281 14.5171 6.46621 14.7838 6.66173 15.0146C6.85724 15.2455 7.10065 15.4355 7.37671 15.5728C7.65277 15.7102 7.95559 15.792 8.2663 15.8132C8.577 15.8344 8.88899 15.7945 9.18281 15.696C9.47663 15.5976 9.74605 15.4426 9.97419 15.2407C10.2023 15.0389 10.3844 14.7944 10.5088 14.5225C10.6332 14.2506 10.6973 13.9572 10.697 13.6607C10.6969 13.5575 10.689 13.4545 10.6734 13.3524L10.6693 13.3259H10.6425H6.21474ZM1.96428 12.1274L1.93763 12.1741H1.99143H14.8658H14.9196L14.8929 12.1274L13.2537 9.25273V5.76786C13.2537 4.55135 12.7449 3.38502 11.8399 2.52534C10.9349 1.66571 9.70782 1.18304 8.42864 1.18304C7.14946 1.18304 5.92236 1.66571 5.01738 2.52534C4.11234 3.38502 3.60358 4.55135 3.60358 5.76786V9.25273L1.96428 12.1274Z" />
						<path d="M14.4737 8.96875L16.1916 11.9814H16.1914L16.2181 12.0281C16.2944 12.162 16.3328 12.3123 16.3295 12.4643C16.3263 12.6163 16.2815 12.765 16.1995 12.8958C16.1174 13.0267 16.0009 13.1352 15.8612 13.2107C15.7214 13.2861 15.5633 13.3259 15.4023 13.3259H11.9294H11.895L11.8983 13.3601C11.9077 13.4592 11.9128 13.5593 11.9128 13.6607C11.9128 14.5375 11.5461 15.3788 10.8929 15.9993C10.2396 16.6199 9.35317 16.9688 8.4286 16.9688C7.50402 16.9688 6.61762 16.6199 5.96431 15.9993C5.31107 15.3788 4.94439 14.5375 4.94439 13.6607C4.94447 13.5604 4.94931 13.4601 4.95891 13.3601L4.96219 13.3259H4.9278H1.45488C1.2939 13.3259 1.13576 13.2862 0.995977 13.2107C0.856198 13.1353 0.739649 13.0267 0.657602 12.8958C0.575564 12.765 0.530792 12.6163 0.527535 12.4643C0.524279 12.3123 0.562645 12.162 0.638996 12.0281L0.61185 12.0126L0.638997 12.0281L2.38362 8.96875L2.38773 8.96156V8.95327V5.76786C2.38773 2.60621 5.09617 0.03125 8.42864 0.03125C11.7611 0.03125 14.4695 2.60621 14.4695 5.76786V8.95327V8.96155L14.4737 8.96875ZM6.21474 13.3259H6.1879L6.18385 13.3524C6.13899 13.6459 6.1583 13.945 6.24056 14.231C6.32281 14.5171 6.46621 14.7838 6.66173 15.0146C6.85724 15.2455 7.10065 15.4355 7.37671 15.5728C7.65277 15.7102 7.95559 15.792 8.2663 15.8132C8.577 15.8344 8.88899 15.7945 9.18281 15.696C9.47663 15.5976 9.74605 15.4426 9.97419 15.2407C10.2023 15.0389 10.3844 14.7944 10.5088 14.5225C10.6332 14.2506 10.6973 13.9572 10.697 13.6607C10.6969 13.5575 10.689 13.4545 10.6734 13.3524L10.6693 13.3259H10.6425H6.21474ZM1.96428 12.1274L1.93763 12.1741H1.99143H14.8658H14.9196L14.8929 12.1274L13.2537 9.25273V5.76786C13.2537 4.55135 12.7449 3.38502 11.8399 2.52534C10.9349 1.66571 9.70782 1.18304 8.42864 1.18304C7.14946 1.18304 5.92236 1.66571 5.01738 2.52534C4.11234 3.38502 3.60358 4.55135 3.60358 5.76786V9.25273L1.96428 12.1274Z" stroke="white" strokeWidth="0.0625" />
						<path d="M14.4737 8.96875L16.1916 11.9814H16.1914L16.2181 12.0281C16.2944 12.162 16.3328 12.3123 16.3295 12.4643C16.3263 12.6163 16.2815 12.765 16.1995 12.8958C16.1174 13.0267 16.0009 13.1352 15.8612 13.2107C15.7214 13.2861 15.5633 13.3259 15.4023 13.3259H11.9294H11.895L11.8983 13.3601C11.9077 13.4592 11.9128 13.5593 11.9128 13.6607C11.9128 14.5375 11.5461 15.3788 10.8929 15.9993C10.2396 16.6199 9.35317 16.9688 8.4286 16.9688C7.50402 16.9688 6.61762 16.6199 5.96431 15.9993C5.31107 15.3788 4.94439 14.5375 4.94439 13.6607C4.94447 13.5604 4.94931 13.4601 4.95891 13.3601L4.96219 13.3259H4.9278H1.45488C1.2939 13.3259 1.13576 13.2862 0.995977 13.2107C0.856198 13.1353 0.739649 13.0267 0.657602 12.8958C0.575564 12.765 0.530792 12.6163 0.527535 12.4643C0.524279 12.3123 0.562645 12.162 0.638996 12.0281L0.61185 12.0126L0.638997 12.0281L2.38362 8.96875L2.38773 8.96156V8.95327V5.76786C2.38773 2.60621 5.09617 0.03125 8.42864 0.03125C11.7611 0.03125 14.4695 2.60621 14.4695 5.76786V8.95327V8.96155L14.4737 8.96875ZM6.21474 13.3259H6.1879L6.18385 13.3524C6.13899 13.6459 6.1583 13.945 6.24056 14.231C6.32281 14.5171 6.46621 14.7838 6.66173 15.0146C6.85724 15.2455 7.10065 15.4355 7.37671 15.5728C7.65277 15.7102 7.95559 15.792 8.2663 15.8132C8.577 15.8344 8.88899 15.7945 9.18281 15.696C9.47663 15.5976 9.74605 15.4426 9.97419 15.2407C10.2023 15.0389 10.3844 14.7944 10.5088 14.5225C10.6332 14.2506 10.6973 13.9572 10.697 13.6607C10.6969 13.5575 10.689 13.4545 10.6734 13.3524L10.6693 13.3259H10.6425H6.21474ZM1.96428 12.1274L1.93763 12.1741H1.99143H14.8658H14.9196L14.8929 12.1274L13.2537 9.25273V5.76786C13.2537 4.55135 12.7449 3.38502 11.8399 2.52534C10.9349 1.66571 9.70782 1.18304 8.42864 1.18304C7.14946 1.18304 5.92236 1.66571 5.01738 2.52534C4.11234 3.38502 3.60358 4.55135 3.60358 5.76786V9.25273L1.96428 12.1274Z" strokeWidth="0.0625" />
					</SvgIcon>
				</CircleButton>
				<CircleButton motive="contrast" aria-label="notifications" disabled>
					<SvgIcon viewBox="0 0 17 17">
						<path d="M14.4737 8.96875L16.1916 11.9814H16.1914L16.2181 12.0281C16.2944 12.162 16.3328 12.3123 16.3295 12.4643C16.3263 12.6163 16.2815 12.765 16.1995 12.8958C16.1174 13.0267 16.0009 13.1352 15.8612 13.2107C15.7214 13.2861 15.5633 13.3259 15.4023 13.3259H11.9294H11.895L11.8983 13.3601C11.9077 13.4592 11.9128 13.5593 11.9128 13.6607C11.9128 14.5375 11.5461 15.3788 10.8929 15.9993C10.2396 16.6199 9.35317 16.9688 8.4286 16.9688C7.50402 16.9688 6.61762 16.6199 5.96431 15.9993C5.31107 15.3788 4.94439 14.5375 4.94439 13.6607C4.94447 13.5604 4.94931 13.4601 4.95891 13.3601L4.96219 13.3259H4.9278H1.45488C1.2939 13.3259 1.13576 13.2862 0.995977 13.2107C0.856198 13.1353 0.739649 13.0267 0.657602 12.8958C0.575564 12.765 0.530792 12.6163 0.527535 12.4643C0.524279 12.3123 0.562645 12.162 0.638996 12.0281L0.61185 12.0126L0.638997 12.0281L2.38362 8.96875L2.38773 8.96156V8.95327V5.76786C2.38773 2.60621 5.09617 0.03125 8.42864 0.03125C11.7611 0.03125 14.4695 2.60621 14.4695 5.76786V8.95327V8.96155L14.4737 8.96875ZM6.21474 13.3259H6.1879L6.18385 13.3524C6.13899 13.6459 6.1583 13.945 6.24056 14.231C6.32281 14.5171 6.46621 14.7838 6.66173 15.0146C6.85724 15.2455 7.10065 15.4355 7.37671 15.5728C7.65277 15.7102 7.95559 15.792 8.2663 15.8132C8.577 15.8344 8.88899 15.7945 9.18281 15.696C9.47663 15.5976 9.74605 15.4426 9.97419 15.2407C10.2023 15.0389 10.3844 14.7944 10.5088 14.5225C10.6332 14.2506 10.6973 13.9572 10.697 13.6607C10.6969 13.5575 10.689 13.4545 10.6734 13.3524L10.6693 13.3259H10.6425H6.21474ZM1.96428 12.1274L1.93763 12.1741H1.99143H14.8658H14.9196L14.8929 12.1274L13.2537 9.25273V5.76786C13.2537 4.55135 12.7449 3.38502 11.8399 2.52534C10.9349 1.66571 9.70782 1.18304 8.42864 1.18304C7.14946 1.18304 5.92236 1.66571 5.01738 2.52534C4.11234 3.38502 3.60358 4.55135 3.60358 5.76786V9.25273L1.96428 12.1274Z" fill="white" />
						<path d="M14.4737 8.96875L16.1916 11.9814H16.1914L16.2181 12.0281C16.2944 12.162 16.3328 12.3123 16.3295 12.4643C16.3263 12.6163 16.2815 12.765 16.1995 12.8958C16.1174 13.0267 16.0009 13.1352 15.8612 13.2107C15.7214 13.2861 15.5633 13.3259 15.4023 13.3259H11.9294H11.895L11.8983 13.3601C11.9077 13.4592 11.9128 13.5593 11.9128 13.6607C11.9128 14.5375 11.5461 15.3788 10.8929 15.9993C10.2396 16.6199 9.35317 16.9688 8.4286 16.9688C7.50402 16.9688 6.61762 16.6199 5.96431 15.9993C5.31107 15.3788 4.94439 14.5375 4.94439 13.6607C4.94447 13.5604 4.94931 13.4601 4.95891 13.3601L4.96219 13.3259H4.9278H1.45488C1.2939 13.3259 1.13576 13.2862 0.995977 13.2107C0.856198 13.1353 0.739649 13.0267 0.657602 12.8958C0.575564 12.765 0.530792 12.6163 0.527535 12.4643C0.524279 12.3123 0.562645 12.162 0.638996 12.0281L0.61185 12.0126L0.638997 12.0281L2.38362 8.96875L2.38773 8.96156V8.95327V5.76786C2.38773 2.60621 5.09617 0.03125 8.42864 0.03125C11.7611 0.03125 14.4695 2.60621 14.4695 5.76786V8.95327V8.96155L14.4737 8.96875ZM6.21474 13.3259H6.1879L6.18385 13.3524C6.13899 13.6459 6.1583 13.945 6.24056 14.231C6.32281 14.5171 6.46621 14.7838 6.66173 15.0146C6.85724 15.2455 7.10065 15.4355 7.37671 15.5728C7.65277 15.7102 7.95559 15.792 8.2663 15.8132C8.577 15.8344 8.88899 15.7945 9.18281 15.696C9.47663 15.5976 9.74605 15.4426 9.97419 15.2407C10.2023 15.0389 10.3844 14.7944 10.5088 14.5225C10.6332 14.2506 10.6973 13.9572 10.697 13.6607C10.6969 13.5575 10.689 13.4545 10.6734 13.3524L10.6693 13.3259H10.6425H6.21474ZM1.96428 12.1274L1.93763 12.1741H1.99143H14.8658H14.9196L14.8929 12.1274L13.2537 9.25273V5.76786C13.2537 4.55135 12.7449 3.38502 11.8399 2.52534C10.9349 1.66571 9.70782 1.18304 8.42864 1.18304C7.14946 1.18304 5.92236 1.66571 5.01738 2.52534C4.11234 3.38502 3.60358 4.55135 3.60358 5.76786V9.25273L1.96428 12.1274Z" />
						<path d="M14.4737 8.96875L16.1916 11.9814H16.1914L16.2181 12.0281C16.2944 12.162 16.3328 12.3123 16.3295 12.4643C16.3263 12.6163 16.2815 12.765 16.1995 12.8958C16.1174 13.0267 16.0009 13.1352 15.8612 13.2107C15.7214 13.2861 15.5633 13.3259 15.4023 13.3259H11.9294H11.895L11.8983 13.3601C11.9077 13.4592 11.9128 13.5593 11.9128 13.6607C11.9128 14.5375 11.5461 15.3788 10.8929 15.9993C10.2396 16.6199 9.35317 16.9688 8.4286 16.9688C7.50402 16.9688 6.61762 16.6199 5.96431 15.9993C5.31107 15.3788 4.94439 14.5375 4.94439 13.6607C4.94447 13.5604 4.94931 13.4601 4.95891 13.3601L4.96219 13.3259H4.9278H1.45488C1.2939 13.3259 1.13576 13.2862 0.995977 13.2107C0.856198 13.1353 0.739649 13.0267 0.657602 12.8958C0.575564 12.765 0.530792 12.6163 0.527535 12.4643C0.524279 12.3123 0.562645 12.162 0.638996 12.0281L0.61185 12.0126L0.638997 12.0281L2.38362 8.96875L2.38773 8.96156V8.95327V5.76786C2.38773 2.60621 5.09617 0.03125 8.42864 0.03125C11.7611 0.03125 14.4695 2.60621 14.4695 5.76786V8.95327V8.96155L14.4737 8.96875ZM6.21474 13.3259H6.1879L6.18385 13.3524C6.13899 13.6459 6.1583 13.945 6.24056 14.231C6.32281 14.5171 6.46621 14.7838 6.66173 15.0146C6.85724 15.2455 7.10065 15.4355 7.37671 15.5728C7.65277 15.7102 7.95559 15.792 8.2663 15.8132C8.577 15.8344 8.88899 15.7945 9.18281 15.696C9.47663 15.5976 9.74605 15.4426 9.97419 15.2407C10.2023 15.0389 10.3844 14.7944 10.5088 14.5225C10.6332 14.2506 10.6973 13.9572 10.697 13.6607C10.6969 13.5575 10.689 13.4545 10.6734 13.3524L10.6693 13.3259H10.6425H6.21474ZM1.96428 12.1274L1.93763 12.1741H1.99143H14.8658H14.9196L14.8929 12.1274L13.2537 9.25273V5.76786C13.2537 4.55135 12.7449 3.38502 11.8399 2.52534C10.9349 1.66571 9.70782 1.18304 8.42864 1.18304C7.14946 1.18304 5.92236 1.66571 5.01738 2.52534C4.11234 3.38502 3.60358 4.55135 3.60358 5.76786V9.25273L1.96428 12.1274Z" stroke="white" strokeWidth="0.0625" />
						<path d="M14.4737 8.96875L16.1916 11.9814H16.1914L16.2181 12.0281C16.2944 12.162 16.3328 12.3123 16.3295 12.4643C16.3263 12.6163 16.2815 12.765 16.1995 12.8958C16.1174 13.0267 16.0009 13.1352 15.8612 13.2107C15.7214 13.2861 15.5633 13.3259 15.4023 13.3259H11.9294H11.895L11.8983 13.3601C11.9077 13.4592 11.9128 13.5593 11.9128 13.6607C11.9128 14.5375 11.5461 15.3788 10.8929 15.9993C10.2396 16.6199 9.35317 16.9688 8.4286 16.9688C7.50402 16.9688 6.61762 16.6199 5.96431 15.9993C5.31107 15.3788 4.94439 14.5375 4.94439 13.6607C4.94447 13.5604 4.94931 13.4601 4.95891 13.3601L4.96219 13.3259H4.9278H1.45488C1.2939 13.3259 1.13576 13.2862 0.995977 13.2107C0.856198 13.1353 0.739649 13.0267 0.657602 12.8958C0.575564 12.765 0.530792 12.6163 0.527535 12.4643C0.524279 12.3123 0.562645 12.162 0.638996 12.0281L0.61185 12.0126L0.638997 12.0281L2.38362 8.96875L2.38773 8.96156V8.95327V5.76786C2.38773 2.60621 5.09617 0.03125 8.42864 0.03125C11.7611 0.03125 14.4695 2.60621 14.4695 5.76786V8.95327V8.96155L14.4737 8.96875ZM6.21474 13.3259H6.1879L6.18385 13.3524C6.13899 13.6459 6.1583 13.945 6.24056 14.231C6.32281 14.5171 6.46621 14.7838 6.66173 15.0146C6.85724 15.2455 7.10065 15.4355 7.37671 15.5728C7.65277 15.7102 7.95559 15.792 8.2663 15.8132C8.577 15.8344 8.88899 15.7945 9.18281 15.696C9.47663 15.5976 9.74605 15.4426 9.97419 15.2407C10.2023 15.0389 10.3844 14.7944 10.5088 14.5225C10.6332 14.2506 10.6973 13.9572 10.697 13.6607C10.6969 13.5575 10.689 13.4545 10.6734 13.3524L10.6693 13.3259H10.6425H6.21474ZM1.96428 12.1274L1.93763 12.1741H1.99143H14.8658H14.9196L14.8929 12.1274L13.2537 9.25273V5.76786C13.2537 4.55135 12.7449 3.38502 11.8399 2.52534C10.9349 1.66571 9.70782 1.18304 8.42864 1.18304C7.14946 1.18304 5.92236 1.66571 5.01738 2.52534C4.11234 3.38502 3.60358 4.55135 3.60358 5.76786V9.25273L1.96428 12.1274Z" strokeWidth="0.0625" />
					</SvgIcon>
				</CircleButton>
			</ContrastBackground>

			<Typography variant="h4" gutterBottom>icon-profile</Typography>
			<ContrastBackground>
				<CircleButton variant="avatar">
					GH
				</CircleButton>
				<CircleButton variant="avatar" disabled>
					GH
				</CircleButton>
			</ContrastBackground>

		</Container>
	);
};
