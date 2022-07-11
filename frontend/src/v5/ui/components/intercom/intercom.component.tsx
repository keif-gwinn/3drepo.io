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
import { useEffect } from 'react';
import { useIntercom, IntercomProvider } from 'react-use-intercom';
import { clientConfigService } from '@/v4/services/clientConfig';
import { CurrentUserHooksSelectors } from '@/v5/services/selectorsHooks/currentUserSelectors.hooks';
import { AuthHooksSelectors } from '@/v5/services/selectorsHooks/authSelectors.hooks';

// Must be a separate component used as IntercomProvider child
const IntercomButton = () => {
	const { boot, shutdown } = useIntercom();
	const currentUser = CurrentUserHooksSelectors.selectCurrentUser();
	const isAuthenticated = AuthHooksSelectors.selectIsAuthenticated();

	const setNameAndMail = () => {
		const { firstName, lastName, email, intercomRef } = currentUser;
		const name = `${firstName || ''} ${lastName || ''}`.trim();

		try {
			boot({
				name,
				email,
				userHash: intercomRef,
			});
		} catch (e) {
			console.debug(`Intercom api error: ${e}`);
		}
	};

	useEffect(() => {
		if (isAuthenticated) {
			setNameAndMail();
		} else {
			shutdown();
		}
	}, [isAuthenticated]);

	return <div />;
};

export const Intercom = () => {
	const { intercomLicense } = clientConfigService;
	return (
		intercomLicense ? (
			<IntercomProvider appId={intercomLicense}>
				<IntercomButton />
			</IntercomProvider>
		) : <></>
	);
};