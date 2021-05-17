/**
 *  Copyright (C) 2017 3D Repo Ltd
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

import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { createStructuredSelector } from 'reselect';
import { CompareActions } from '../../../../../modules/compare';
import {
	selectIsPending,
	selectPendingRevision,
	selectRevisions,
	ModelActions
} from '../../../../../modules/model';
import { RevisionsDialog } from './revisionsDialog.component';

const mapStateToProps = createStructuredSelector({
	revisions: selectRevisions,
	isPending: selectIsPending,
	pendingRevision: selectPendingRevision
});

export const mapDispatchToProps = (dispatch) => bindActionCreators({
	resetModelRevisions: ModelActions.resetRevisions,
	setModelRevisionState: ModelActions.setModelRevisionState,
	updateCurrentRevision: CompareActions.updateCurrentRevision
}, dispatch);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(RevisionsDialog));
