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
import { EditProfileUpdatePersonalSchema } from '@/v5/validation/userSchemes/editProfileSchemes';
import { CurrentUserActionsDispatchers } from '@/v5/services/actionsDispatchers/currentUsersActions.dispatchers';
import { CurrentUserHooksSelectors } from '@/v5/services/selectorsHooks/currentUserSelectors.hooks';
import { formatMessage } from '@/v5/services/intl';
import { ICurrentUser } from '@/v5/store/currentUser/currentUser.types';
import { clientConfigService } from '@/v4/services/clientConfig';
import { SuccessMessage } from '@controls/successMessage/successMessage.component';
import { FormTextField } from '@controls/formTextField/formTextField.component';
import { FormSelect } from '@controls/formSelect/formSelect.component';
import { yupResolver } from '@hookform/resolvers/yup';
import { MenuItem } from '@mui/material';
import { useForm, FormProvider } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { defaults, pick, pickBy, isEmpty } from 'lodash';
import { UnexpectedError } from '@controls/errorMessage/unexpectedError/unexpectedError.component';
import { ScrollArea } from '@controls/scrollArea';
import { ErrorMessage } from '@controls/errorMessage/errorMessage.component';
import { EditProfileAvatar } from './editProfileAvatar/editProfileAvatar.component';
import { ScrollAreaPadding } from './editProfilePersonalTab.styles';

interface IUpdatePersonalInputs {
	firstName: string;
	lastName: string;
	email: string;
	company?: string;
	countryCode?: string;
	avatarFile?: File;
}

type EditProfilePersonalTabProps = {
	setSubmitFunction: (fn: Function) => void,
	setIsSubmitting: (isSubmitting: boolean) => void,
	user: ICurrentUser,
};

export const EditProfilePersonalTab = ({
	setSubmitFunction,
	setIsSubmitting,
	user,
}: EditProfilePersonalTabProps) => {
	const formIsUploading = CurrentUserHooksSelectors.selectPersonalDataIsUpdating();
	const [alreadyExistingEmails, setAlreadyExistingEmails] = useState([]);
	const [unexpectedError, setUnexpectedError] = useState(false);
	const [expectedError, setExpectedError] = useState(null);
	const [submitWasSuccessful, setSubmitWasSuccessful] = useState(false);

	const trimPersonalValues = (personalValues: IUpdatePersonalInputs): IUpdatePersonalInputs => {
		const trimmedValues = {} as IUpdatePersonalInputs;
		Object.entries((personalValues)).forEach(([key, value]) => {
			trimmedValues[key] = value?.trim?.() ?? value;
		});
		return trimmedValues;
	};

	const getDefaultPersonalValues = () => {
		const values = trimPersonalValues(
			pick(user, ['firstName', 'lastName', 'email', 'company', 'countryCode']),
		);
		return defaults(values, { countryCode: 'GB', company: '', avatarFile: '' });
	};

	const formMethods = useForm<IUpdatePersonalInputs>({
		mode: 'all',
		resolver: yupResolver(EditProfileUpdatePersonalSchema(alreadyExistingEmails)),
		defaultValues: getDefaultPersonalValues(),
	});

	const {
		getValues,
		trigger,
		handleSubmit,
		reset,
		watch,
		setError: setFormError,
		control,
		formState: { errors: formErrors, isValid: formIsValid, isDirty, isSubmitted },
	} = formMethods;
	const getTrimmedValues = () => trimPersonalValues(getValues());

	const handleApiError = (apiError) => {
		if (apiError.message === 'Network Error') {
			setExpectedError(formatMessage({
				id: 'editProfile.networkError',
				defaultMessage: 'Network Error',
			}));
			return;
		}
		switch (apiError?.response?.data?.code) {
			case 'INVALID_ARGUMENTS':
				setAlreadyExistingEmails([...alreadyExistingEmails, getValues('email')]);
				break;
			case 'UNSUPPORTED_FILE_FORMAT':
				setFormError('avatarFile', {
					type: 'custom',
					message: formatMessage({
						id: 'editProfile.avatar.error.format',
						defaultMessage: 'The file format is not supported',
					}),
				});
				break;
			default:
				setUnexpectedError(true);
		}
	};

	const onSubmit = () => {
		setExpectedError('');
		setUnexpectedError(false);
		setSubmitWasSuccessful(false);
		const trimmedValues = pickBy(getTrimmedValues());
		CurrentUserActionsDispatchers.updatePersonalData(trimmedValues, handleApiError);
	};

	// enable submission only if form is valid and fields are dirty (or avatar was changed)
	useEffect(() => {
		const shouldEnableSubmit = formIsValid && isEmpty(formErrors) && isDirty;
		setSubmitFunction(() => (shouldEnableSubmit ? handleSubmit(onSubmit) : null));
	}, [JSON.stringify(watch()), user, formIsValid, JSON.stringify(formErrors)]);

	// update form values when user is updated
	useEffect(() => {
		if (
			!formIsUploading
			&& !unexpectedError
			&& !expectedError
			&& isSubmitted
			&& !alreadyExistingEmails.includes(getValues().email)
		) {
			reset(getDefaultPersonalValues(), { keepIsSubmitted: true });
			setSubmitWasSuccessful(true);
		}
	}, [formIsUploading]);

	useEffect(() => {
		if (alreadyExistingEmails.length) {
			trigger('email');
		}
	}, [alreadyExistingEmails]);

	useEffect(() => setIsSubmitting(formIsUploading));

	return (
		<ScrollArea>
			<ScrollAreaPadding>
				<FormProvider {...formMethods}>
					<EditProfileAvatar user={user} />
					<FormTextField
						name="firstName"
						control={control}
						label={formatMessage({
							id: 'editProfile.form.firstName',
							defaultMessage: 'First Name',
						})}
						required
						formError={formErrors.firstName}
					/>
					<FormTextField
						name="lastName"
						control={control}
						label={formatMessage({
							id: 'editProfile.form.lastName',
							defaultMessage: 'Last Name',
						})}
						required
						formError={formErrors.lastName}
					/>
					<FormTextField
						name="email"
						control={control}
						label={formatMessage({
							id: 'editProfile.form.email',
							defaultMessage: 'Email',
						})}
						required
						formError={formErrors.email}
					/>
					<FormTextField
						name="company"
						control={control}
						label={formatMessage({
							id: 'editProfile.form.company',
							defaultMessage: 'Company',
						})}
						formError={formErrors.company}
					/>
					<FormSelect
						name="countryCode"
						control={control}
						label={formatMessage({
							id: 'userSignup.form.countryCode',
							defaultMessage: 'Country',
						})}
						required
					>
						{clientConfigService.countries.map((country) => (
							<MenuItem key={country.code} value={country.code}>
								{country.name}
							</MenuItem>
						))}
					</FormSelect>
					{submitWasSuccessful && (
						<SuccessMessage>
							<FormattedMessage
								id="editProfile.form.success"
								defaultMessage="Your profile has been changed successfully."
							/>
						</SuccessMessage>
					)}
					{unexpectedError && <UnexpectedError />}
					{expectedError && <ErrorMessage>{expectedError}</ErrorMessage>}
				</FormProvider>
			</ScrollAreaPadding>
		</ScrollArea>
	);
};
