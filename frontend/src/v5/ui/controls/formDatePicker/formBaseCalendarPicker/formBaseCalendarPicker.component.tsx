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
import { useState } from 'react';
import { Controller } from 'react-hook-form';
import dayjs from 'dayjs';
import { TextField } from './formBaseCalendarPicker.styles';
import { formatDayOfWeek } from '../dateFormatHelper';

export type FormBaseCalendarPickerProps = any & {
	name: string;
	label: string | JSX.Element;
	control?: any;
	formError?: any;
	defaultValue?: Date;
	disabled?: boolean;
	PickerComponent: any;
};

export const FormBaseCalendarPicker = ({
	name,
	control,
	formError,
	disabled,
	defaultValue,
	PickerComponent,
	...props
}: FormBaseCalendarPickerProps) => {
	const [open, setOpen] = useState(false);

	const handleClick = (e) => {
		e.preventDefault();
		if (!disabled) setOpen(true);
	};

	return (
		<Controller
			control={control}
			name={name}
			defaultValue={defaultValue ? dayjs(defaultValue) : null}
			render={({ field }) => (
				<PickerComponent
					{...field}
					{...props}
					onOpen={() => setOpen(true)}
					onClose={() => {
						// This is to signal that the date has changed (we are using onblur to save changes)
						props.onBlur?.();
						setOpen(false);
					}}
					open={open}
					disabled={disabled}
					dayOfWeekFormatter={formatDayOfWeek}
					disableHighlightToday
					renderInput={({ ref, inputRef, ...textFieldProps }) => (
						<TextField
							{...textFieldProps}
							ref={inputRef}
							inputRef={inputRef}
							error={!!formError}
							helperText={formError?.message}
							onClick={handleClick}
							onKeyDown={(e) => e.preventDefault()}
							inputProps={{
								...textFieldProps.inputProps,
								placeholder: ' ',
							}}
						/>
					)}
				/>
			)}
		/>
	);
};
