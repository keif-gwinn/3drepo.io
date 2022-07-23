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

import { formatMessage } from '@/v5/services/intl';
import { FormattedMessage } from 'react-intl';
import { ShareTextField } from '@controls/shareTextField';
import CloseIcon from '@assets/icons/close.svg';
import {
	Title,
	Header,
	CloseButton,
	Form,
	FormDialogContent,
} from '@controls/modal/formModal/formDialog.styles';
import { MailToButton } from './shareModal.styles';

type IShareModal = {
	// the title in the modal
	title: string;
	// the title in the email
	name: string;

	subject: string;
	link: string;
	onClickClose: () => void;
};

export const ShareModal = ({
	title,
	name,
	subject,
	onClickClose,
	link,
}: IShareModal) => (
	<Form>
		<Header>
			<Title>
				{title}
			</Title>
			<CloseButton aria-label="Close dialog" onClick={onClickClose}>
				<CloseIcon />
			</CloseButton>
		</Header>
		<FormDialogContent>
			<ShareTextField
				label={formatMessage({
					id: 'shareModal.linkLabel',
					defaultMessage: 'Link',
				})}
				value={link}
			/>
			<MailToButton href={`mailto:?subject=3D Repo ${subject} - ${name}&body=${link}`}>
				<FormattedMessage
					id="shareModal.mailTo"
					defaultMessage="Send by email"
				/>
			</MailToButton>
		</FormDialogContent>
	</Form>
);