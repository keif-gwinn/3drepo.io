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

import React from 'react';

import AutorenewIcon from '@material-ui/icons/Autorenew';
import Delete from '@material-ui/icons/Delete';
import SaveIcon from '@material-ui/icons/Save';

import { cloneDeep, isEqual } from 'lodash';
import * as Yup from 'yup';
import { GROUP_PANEL_NAME, GROUP_TYPES_ICONS, GROUPS_TYPES } from '../../../../../../constants/groups';
import { renderWhenTrue } from '../../../../../../helpers/rendering';
import { ICriteriaFieldState } from '../../../../../../modules/groups/groups.redux';
import { ColorPicker } from '../../../../../components/colorPicker/colorPicker.component';
import { CriteriaField } from '../../../../../components/criteriaField/criteriaField.component';
import { TooltipButton } from '../../../../../teamspaces/components/tooltipButton/tooltipButton.component';
import { PreviewDetails } from '../../../previewDetails/previewDetails.component';
import { ViewerPanelFooter } from '../../../viewerPanel/viewerPanel.styles';
import { ViewerPanelButton } from '../../../viewerPanel/viewerPanel.styles';
import { Actions, ColorPickerWrapper, Container, Content } from './groupDetails.styles';
import { GroupDetailsForm } from './groupDetailsForm.component';

interface IProps {
	editingGroup: any;
	originalGroup: any;
	teamspace: string;
	model: string;
	revision: string;
	expandDetails: boolean;
	currentUser: any;
	modelSettings: any;
	totalMeshes: number;
	canUpdate: boolean;
	selectedNodes: any;
	fieldNames: any[];
	criteriaFieldState: ICriteriaFieldState;
	createGroup: (teamspace: any, modelId: any, revision: any) => void;
	updateGroup: (teamspace: any, modelId: any, revision: any, groupId: any) => void;
	setState: (componentState: any) => void;
	setCriteriaState: (criteriaState: any) => void;
	resetToSavedSelection: () => void;
	isPending: boolean;
	deleteGroup: () => void;
}

interface IState {
	isFormValid: boolean;
	isFormDirty: boolean;
	scrolled: boolean;
}

const GroupSchema = Yup.object().shape({
	name: Yup.string().required(),
	desc: Yup.string().max(220),
	rules: Yup.array(),
	type: Yup.string()
}).test(({type, rules}) => {
	return type === GROUPS_TYPES.NORMAL ||  rules.length > 0 ;
});

export class GroupDetails extends React.PureComponent<IProps, IState> {
	get isNewGroup() {
		return !this.props.editingGroup._id;
	}

	get editingGroup() {
		return this.props.editingGroup;
	}

	get isFormValid() {
		return this.state.isFormDirty && this.state.isFormValid ;
	}

	public state = {
		isFormValid: false,
		isFormDirty: false,
		scrolled: false
	};

	public formRef = React.createRef<HTMLElement>() as any;
	public panelRef = React.createRef<any>();

	public renderRulesField = renderWhenTrue(() => (
		<CriteriaField
			name="rules"
			value={this.editingGroup.rules}
			{...this.props.criteriaFieldState}
			onChange={this.handleFieldChange}
			onCriterionSelect={this.handleCriterionSelect}
			setState={this.props.setCriteriaState}
			label="Filters"
			placeholder="Select first filter"
			disabled={!this.props.canUpdate}
			fieldNames={this.props.fieldNames}
		/>
	));

	public renderPreview = renderWhenTrue(() => (
		<PreviewDetails
			key={this.editingGroup._id}
			{...this.editingGroup}
			roleColor={this.editingGroup.color}
			created={this.editingGroup.createdAt}
			editable={this.props.canUpdate}
			onNameChange={this.handleFieldChange}
			renderCollapsable={this.renderGroupForm}
			renderNotCollapsable={() => this.renderRulesField(this.editingGroup.type === GROUPS_TYPES.SMART)}
			panelName={GROUP_PANEL_NAME}
			isSmartGroup={this.editingGroup.type === GROUPS_TYPES.SMART}
			StatusIconComponent={GROUP_TYPES_ICONS[this.editingGroup.type]}
			scrolled={this.state.scrolled}
			isNew={this.isNewGroup}
		/>
	));

	public areSharedIdsChanged = (selectedNodes = [], groupObjects = []) => {
		const toFullIdsDict = (dict, val) => {
			val.shared_ids.forEach((e) => dict[val.account + '.' + val.model + '.' + e] = true);
			return dict;
		};

		selectedNodes = selectedNodes.reduce(toFullIdsDict, {});
		groupObjects = groupObjects.reduce(toFullIdsDict, {});

		return !isEqual(selectedNodes, groupObjects);
	}

	public componentDidMount() {
		// We are setting isFormValid to false when is a new group because for
		// some reason we set the name to empty ¯\_(ツ)_/¯
		this.setState({ isFormDirty: this.isNewGroup, isFormValid: !this.isNewGroup });
	}

	public componentDidUpdate(prevProps: Readonly<React.PropsWithChildren<IProps>>) {
		if (prevProps === this.props) {
			return;
		}

		if (!this.isNewGroup) {
			// We ignore the setDirty in newgroup because is always dirty, just needs to be valid.
			const wasUpdated = !isEqual(this.editingGroup, this.props.originalGroup);
			const selectionChanged = this.areSharedIdsChanged(this.props.selectedNodes, this.editingGroup.objects);
			this.setIsFormDirty(wasUpdated || selectionChanged);
		}

		const groupHasValidSelection = this.editingGroup.type === GROUPS_TYPES.SMART || this.props.selectedNodes.length > 0;
		this.setIsFormValid(GroupSchema.isValidSync(this.editingGroup) && groupHasValidSelection);
	}

	public handleGroupFormSubmit = () => {
		const { teamspace, model, revision, updateGroup, createGroup } = this.props;

		if (this.isNewGroup) {
			createGroup(teamspace, model, revision);
		} else {
			updateGroup(teamspace, model, revision, this.editingGroup._id);
		}
	}

	public handleFieldChange = (event: { target: { name: any; value: any; }; }) => {
		this.props.setState({
			newGroup: {
				...this.editingGroup,
				[event.target.name]: event.target.value
			}
		});
	}

	public handleColorChange = (color: any) => {
		this.props.setState({
			newGroup: {
				...this.editingGroup, color
			}
		});
	}

	public renderGroupForm = () => (
		<GroupDetailsForm
			ref={this.formRef}
			key={`${this.editingGroup._id}.${this.editingGroup.updatedAt}`}
			group={this.editingGroup}
			currentUser={this.props.currentUser}
			totalMeshes={this.props.totalMeshes}
			canUpdate={this.props.canUpdate}
			fieldNames={this.props.fieldNames}
			handleChange={this.handleFieldChange}
			selectedNodes={this.props.selectedNodes}
		/>
	)

	public handleCriterionSelect = (criterion: any) => {
		this.props.setCriteriaState({ criterionForm: criterion });
	}

	public handlePanelScroll = (e: { target: { scrollHeight: number; offsetHeight: any; scrollTop: number; }; }) => {
		if (e.target.scrollHeight > e.target.offsetHeight + e.target.scrollTop) {
			if (e.target.scrollTop > 0 && !this.state.scrolled) {
				this.setState({ scrolled: true });
			}
			if (e.target.scrollTop === 0 && this.state.scrolled) {
				this.setState({ scrolled: false });
			}
		} else {
			if (this.state.scrolled) {
				this.setState({ scrolled: false });
			}
		}
	}

	public setIsFormValid = (isFormValid: boolean) => {
		this.setState({ isFormValid });
	}

	public setIsFormDirty = (isFormDirty: boolean) => {
		this.setState({ isFormDirty });
	}

	public renderFooter = () => {
		return (
			<ViewerPanelFooter container alignItems="center">
				<Actions>
					<ColorPickerWrapper>
						<ColorPicker
							value={this.editingGroup.color}
							onChange={this.handleColorChange}
							disabled={!this.props.canUpdate}
							opacityEnabled
						/>
					</ColorPickerWrapper>
					<TooltipButton
						label="Reset to saved selection"
						action={this.props.resetToSavedSelection}
						Icon={AutorenewIcon}
					/>
					<TooltipButton
						label="Delete"
						action={this.props.deleteGroup}
						Icon={Delete}
						disabled={!this.props.canUpdate}
					/>
				</Actions>
				<ViewerPanelButton
					variant="fab"
					color="secondary"
					type="submit"
					onClick={this.handleGroupFormSubmit}
					size="small"
					aria-label="Save group"
					disabled={!this.isFormValid || !this.props.canUpdate}
					pending={this.props.isPending}
					id="groups-card-save-button"
				>
					<SaveIcon />
				</ViewerPanelButton>
			</ViewerPanelFooter>
		);
	}

	public render() {
		return (
			<Container>
				<Content
					onScroll={this.handlePanelScroll}
					ref={this.panelRef}
				>
					{this.renderPreview(this.editingGroup)}
				</Content>
				{this.renderFooter()}
			</Container>
		);
	}
}
