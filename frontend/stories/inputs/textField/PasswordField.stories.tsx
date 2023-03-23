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
import { PasswordField } from '@controls/inputs/passwordField/passwordField.component';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { FormContainer } from '../FormInput.styles';

export default {
	title: 'Inputs/TextField/PasswordField',
	argTypes: {
		label: {
			type: 'string',
		},
		defaultValue: {
			type: 'string',
		},
		disabled: {
			type: 'boolean',
		},
		value: {
			type: 'string',
		},
	},
	component: PasswordField,
	parameters: { controls: { exclude: [
		'margin',
		'ref',
		'hiddenLabel',
		'onBlur',
		'onChange',
		'name',
		'className',
		'inputRef',
	] } },
} as ComponentMeta<typeof PasswordField>;

const Controlled: ComponentStory<typeof PasswordField> = (args) => (
	<FormContainer>
		<PasswordField {...args} />
	</FormContainer>
);

export const ControlledFormPasswordField = Controlled.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
ControlledFormPasswordField.args = {
	label: 'Controlled String input',
};