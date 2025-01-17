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

import { AlertModal } from './alertModal/alertModal.component';
import { DeleteModal } from './deleteModal/deleteModal.component';
import { InfoModal } from './infoModal/infoModal.component';
import { ShareModal } from './shareModal/shareModal.component';
import { WarningModal } from './warningModal/warningModal.component';

export const MODAL_TEMPLATES = {
	alert: AlertModal,
	warning: WarningModal,
	delete: DeleteModal,
	info: InfoModal,
	share: ShareModal,
};
