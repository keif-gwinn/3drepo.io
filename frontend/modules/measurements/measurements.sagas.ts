/**
 *  Copyright (C) 2020 3D Repo Ltd
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

import { all, put, select, takeLatest } from 'redux-saga/effects';
import { VIEWER_EVENTS } from '../../constants/viewer';
import { uuid as UUID } from '../../helpers/uuid';

import { Viewer } from '../../services/viewer/viewer';
import { DialogActions } from '../dialog';
import { dispatch } from '../store';
import {
	selectAreaMeasurements,
	selectLengthMeasurements,
	selectMeasurementsDomain,
	selectMeasureUnits,
	selectPointMeasurements,
	MeasurementsActions,
	MeasurementsTypes,
} from './';
import { MEASURE_TYPE, MEASURE_TYPE_NAME, MEASURE_TYPE_STATE_MAP, MEASURING_MODE } from './measurements.constants';

const onMeasurementDropped = (measure) => {
	dispatch(MeasurementsActions.addMeasurement(measure));
};

const onPointDropped =  ({ trans, position }) => {
	if (trans) {
		position = trans.inverse().multMatrixPnt(position);
	}
	const measure = {
		uuid: UUID(),
		position,
		type: MEASURE_TYPE.POINT,
		color: { r: 0, g: 1, b: 1, a: 1},
	};
	dispatch(MeasurementsActions.addMeasurement(measure));
};

export function* setMeasureMode({ mode }) {
	try {
		yield Viewer.off(VIEWER_EVENTS.MEASUREMENT_CREATED, onMeasurementDropped);
		yield Viewer.off(VIEWER_EVENTS.PICK_POINT, onPointDropped);
		yield Viewer.disableMeasure();
		yield Viewer.setPinDropMode(false);

		if (mode === MEASURING_MODE.POINT) {
			yield Viewer.setPinDropMode(true);
			yield Viewer.on(VIEWER_EVENTS.PICK_POINT, onPointDropped);
		} else if (mode !== '' ) {
			yield Viewer.setMeasureMode(mode);
			yield Viewer.activateMeasure();
			yield Viewer.on(VIEWER_EVENTS.MEASUREMENT_CREATED, onMeasurementDropped);
		}

		yield put(MeasurementsActions.setMeasureModeSuccess(mode));
	} catch (error) {
		DialogActions.showErrorDialog('set', `measure mode to ${mode}`, error);
	}
}

export function* setMeasureUnits({ units }) {
	try {
		yield all([
			Viewer.setMeasuringUnits(units),
			put(MeasurementsActions.setMeasureUnitsSuccess(units))
		]);
	} catch (error) {
		DialogActions.showErrorDialog('set', `measure units to ${units}`, error);
	}
}

export function* addMeasurement({ measurement }) {
	try {
		const measurementStateName = MEASURE_TYPE_STATE_MAP[measurement.type];

		if (measurementStateName) {
			const measurementsState = yield select(selectMeasurementsDomain);
			const index = measurementsState[measurementStateName].length + 1;

			measurement.name = `${MEASURE_TYPE_NAME[measurement.type]} ${index}`;
			measurement.color.r = measurement.color.r * 255;
			measurement.color.g = measurement.color.g * 255;
			measurement.color.b = measurement.color.b * 255;

			yield Viewer.setMeasurementName(measurement.uuid, measurement.name);
			yield put(MeasurementsActions.addMeasurementSuccess(measurement));
		}
	} catch (error) {
		DialogActions.showErrorDialog('add', `measurement`, error);
	}
}

export function* removeMeasurement({ uuid }) {
	try {
		yield all([
			Viewer.removeMeasurement(uuid),
			put(MeasurementsActions.removeMeasurementSuccess(uuid))
		]);
	} catch (error) {
		DialogActions.showErrorDialog('remove', `measurement`, error);
	}
}

export function* setMeasurementColor({ uuid, color }) {
	const colorToSet = [color.r / 255, color.g / 255, color.b / 255, color.a];
	try {
		yield Viewer.setMeasurementColor(uuid, colorToSet);
		yield put(MeasurementsActions.setMeasurementColorSuccess(uuid, color));
	} catch (error) {
		DialogActions.showErrorDialog('set color', 'measure', error);
	}
}

export function* setMeasurementName({ uuid, name, measureType }) {
	try {
		yield Viewer.setMeasurementName(uuid, name);
		yield put(MeasurementsActions.setMeasurementNameSuccess(uuid, name, measureType));
	} catch (error) {
		DialogActions.showErrorDialog('set name', 'measure', error);
	}
}

export function* resetMeasurementColors() {
	try {
		const areaMeasurements = yield select(selectAreaMeasurements);
		const lengthMeasurements = yield select(selectLengthMeasurements);
		const pointMeasurements = yield select(selectPointMeasurements);

		const setDefaultColor = async ({ uuid, color }) => {
			const colorToSet = [color.r / 255, color.g / 255, color.b / 255, color.a];
			await Viewer.setMeasurementColor(uuid, colorToSet);
		};

		if (areaMeasurements.length) {
			areaMeasurements.forEach(setDefaultColor);
		}

		if (lengthMeasurements.length) {
			lengthMeasurements.forEach(setDefaultColor);
		}

		if (lengthMeasurements.length) {
			pointMeasurements.forEach(setDefaultColor);
		}

		yield put(MeasurementsActions.resetMeasurementColorsSuccess());
	} catch (error) {
		DialogActions.showErrorDialog('set color', 'measure', error);
	}
}

export function* setMeasureEdgeSnapping({ edgeSnapping }) {
	try {
		if (edgeSnapping) {
			yield Viewer.enableEdgeSnapping();
		} else {
			yield Viewer.disableEdgeSnapping();
		}
		yield put(MeasurementsActions.setMeasureEdgeSnappingSuccess(edgeSnapping));
	} catch (error) {
		DialogActions.showErrorDialog('set edge snapping', 'measure', error);
	}
}

export function* setMeasureXyzDisplay({ xyzDisplay }) {
	try {
		if (xyzDisplay) {
			yield Viewer.enableMeasureXYZDisplay();
		} else {
			yield Viewer.disableMeasureXYZDisplay();
		}
		yield put(MeasurementsActions.setMeasureXyzDisplaySuccess(xyzDisplay));
	} catch (error) {
		DialogActions.showErrorDialog('set XYZ display', 'measure', error);
	}
}

export function* clearMeasurements() {
	try {
		yield Viewer.clearMeasurements();
		yield put(MeasurementsActions.clearMeasurementsSuccess());
	} catch (error) {
		DialogActions.showErrorDialog('clear', 'measurements', error);
	}
}

export function* resetMeasurementTool() {
	try {
		yield put(MeasurementsActions.resetMeasurementToolSuccess());
		const units = yield select(selectMeasureUnits);
		yield put(MeasurementsActions.setMeasureUnits(units));
	} catch (error) {
		DialogActions.showErrorDialog('reset', 'measurements tool', error);
	}
}

export default function* MeasurementsSaga() {
	yield takeLatest(MeasurementsTypes.SET_MEASURE_MODE, setMeasureMode);
	yield takeLatest(MeasurementsTypes.SET_MEASURE_UNITS, setMeasureUnits);
	yield takeLatest(MeasurementsTypes.ADD_MEASUREMENT, addMeasurement);
	yield takeLatest(MeasurementsTypes.REMOVE_MEASUREMENT, removeMeasurement);
	yield takeLatest(MeasurementsTypes.CLEAR_MEASUREMENTS, clearMeasurements);
	yield takeLatest(MeasurementsTypes.SET_MEASUREMENT_COLOR, setMeasurementColor);
	yield takeLatest(MeasurementsTypes.RESET_MEASUREMENT_COLORS, resetMeasurementColors);
	yield takeLatest(MeasurementsTypes.SET_MEASURE_EDGE_SNAPPING, setMeasureEdgeSnapping);
	yield takeLatest(MeasurementsTypes.SET_MEASURE_XYZ_DISPLAY, setMeasureXyzDisplay);
	yield takeLatest(MeasurementsTypes.SET_MEASUREMENT_NAME, setMeasurementName);
	yield takeLatest(MeasurementsTypes.RESET_MEASUREMENT_TOOL, resetMeasurementTool);
}
