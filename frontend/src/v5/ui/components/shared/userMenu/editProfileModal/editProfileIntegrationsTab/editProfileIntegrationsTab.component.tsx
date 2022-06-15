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

import { ShareTextField } from '@controls/shareTextField';
import { FormattedMessage } from 'react-intl';
import { useState } from 'react';
import { CurrentUserHooksSelectors } from '@/v5/services/selectorsHooks/currentUserSelectors.hooks';
import { CurrentUserActionsDispatchers } from '@/v5/services/actionsDispatchers/currentUsersActions.dispatchers';
import { UnexpectedError } from '@controls/errorMessage/unexpectedError/unexpectedError.component';
import { formatMessage } from '@/v5/services/intl';
import { ErrorMessage } from '@controls/errorMessage/errorMessage.component';
import { isNetworkError } from '@/v5/validation/errors.helpers';
import { ButtonsContainer, Button, ShareTextFieldLabel } from './editProfileIntegrationsTab.styles';

export const EditProfileIntegrationsTab = () => {
	const apiKey = CurrentUserHooksSelectors.selectApiKey();
	const [error, setError] = useState(null);
	const [unexpectedError, setUnexpectedError] = useState(false);

	const handleApiError = (apiError) => {
		if (isNetworkError(apiError)) {
			setError(formatMessage({
				id: 'editProfile.networkError',
				defaultMessage: 'Network Error',
			}));
		} else {
			setUnexpectedError(true);
		}
	};

	const { generateApiKey, deleteApiKey } = CurrentUserActionsDispatchers;

	const handleApiKeyCall = (action) => {
		setError(null);
		setUnexpectedError(false);
		action(handleApiError);
	};

	return (
		<>
			<ShareTextField
				label={(
					<ShareTextFieldLabel>
						<FormattedMessage
							id="editProfile.apiKey"
							defaultMessage="API KEY"
						/>
					</ShareTextFieldLabel>
				)}
				value={apiKey}
				hideValue
				disabled={!apiKey}
			/>
			<ButtonsContainer>
				<Button variant="outlined" color="primary" onClick={() => handleApiKeyCall(generateApiKey)}>
					<FormattedMessage
						id="editProfile.generateApiKey"
						defaultMessage="Generate"
					/>
				</Button>
				<Button variant="outlined" color="secondary" onClick={() => handleApiKeyCall(deleteApiKey)} disabled={!apiKey}>
					<FormattedMessage
						id="editProfile.deleteApiKey"
						defaultMessage="Delete"
					/>
				</Button>
			</ButtonsContainer>
			{unexpectedError && <UnexpectedError />}
			{error && <ErrorMessage>{error}</ErrorMessage>}
		</>
	);
};
