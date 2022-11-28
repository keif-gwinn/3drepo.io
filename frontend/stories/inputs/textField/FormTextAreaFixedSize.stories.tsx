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
import { FormTextAreaFixedSize } from '@controls/inputs/formTextArea/formTextAreaFixedSize.component';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { useForm } from 'react-hook-form';
import { FormContainer } from '../FormInput.styles';

export default {
	title: 'Inputs/TextField/FormTextAreaFixedSize',
	argTypes: {
		label: {
			type: 'string',
		},
		defaultValue: {
			type: 'string',
		},
		formError: {
			type: 'string',
		},
		disabled: {
			type: 'boolean',
		},
		height: {
			type: 'number',
		},
	},
	component: FormTextAreaFixedSize,
	parameters: { controls: { exclude: ['control', 'margin', 'hiddenLabel', 'ref'] } },
} as ComponentMeta<typeof FormTextAreaFixedSize>;

const Controlled: ComponentStory<typeof FormTextAreaFixedSize> = ({ formError, ...args }) => {
	const { control } = useForm({ mode: 'onChange' });

	return (
		<FormContainer>
			<FormTextAreaFixedSize
				name="textarea"
				control={control}
				{...args}
				formError={formError ? { message: formError } : null}
			/>
		</FormContainer>
	);
};

export const ControlledFormTextArea = Controlled.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
ControlledFormTextArea.args = {
	label: 'Controlled Fixed Multi Line input',
};
