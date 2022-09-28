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
import { InvisibleContainer } from './formInvisibleSelect.styles';
import { FormSelect, FormSelectProps } from '../formSelect/formSelect.component';

type FormInvisibleSelectProps = FormSelectProps & {
	TriggerComponent: JSX.Element,
};

export const FormInvisibleSelect = ({ TriggerComponent, ...props }: FormInvisibleSelectProps) => {
	const [open, setOpen] = useState(false);

	return (
		<InvisibleContainer onClick={() => setOpen(!open)}>
			{TriggerComponent}
			<FormSelect {...props} open={open} />
		</InvisibleContainer>
	);
};
