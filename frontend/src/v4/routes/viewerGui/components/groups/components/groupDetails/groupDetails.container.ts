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

import { bindActionCreators } from 'redux';
import { createStructuredSelector } from 'reselect';

import { connect } from 'react-redux';
import { selectCurrentUser } from '../../../../../../modules/currentUser';
import {
	selectActiveGroupDetails,
	selectCriteriaFieldState,
	selectEditingGroupDetails,
	selectExpandDetails,
	selectFetchingDetailsIsPending,
} from '../../../../../../modules/groups/groups.selectors';
import { GroupsActions } from '../../../../../../modules/groups';
import { selectMetaKeys, selectSettings } from '../../../../../../modules/model';
import { selectSelectedNodes, selectTotalMeshes } from '../../../../../../modules/tree';
import { GroupDetails } from './groupDetails.component';

const mapStateToProps = createStructuredSelector({
	editingGroup: selectEditingGroupDetails,
	originalGroup: selectActiveGroupDetails,
	modelSettings: selectSettings,
	expandDetails: selectExpandDetails,
	currentUser: selectCurrentUser,
	totalMeshes: selectTotalMeshes,
	selectedNodes: selectSelectedNodes,
	fieldNames: selectMetaKeys,
	criteriaFieldState: selectCriteriaFieldState,
	isPending: selectFetchingDetailsIsPending,
});

export const mapDispatchToProps = (dispatch) => bindActionCreators({
	setState: GroupsActions.setComponentState,
	updateEditingGroup: GroupsActions.updateEditingGroup,
	updateGroup: GroupsActions.updateGroup,
	createGroup: GroupsActions.createGroup,
	setCriteriaState: GroupsActions.setCriteriaFieldState
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(GroupDetails);
