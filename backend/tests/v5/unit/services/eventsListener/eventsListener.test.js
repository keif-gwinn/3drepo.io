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

const { src } = require('../../../helper/path');

jest.mock('../../../../../src/v5/models/modelSettings');
const ModelSettings = require(`${src}/models/modelSettings`);
const EventsManager = require(`${src}/services/eventsManager/eventsManager`);
const { events } = require(`${src}/services/eventsManager/eventsManager.constants`);

const EventsListener = require(`${src}/services/eventsListener/eventsListener`);

ModelSettings.updateModelStatus.mockResolvedValue(() => {});

const testModelEventsListener = () => {
	describe('Model Events', () => {
		test(`Should trigger model status update if there is a ${events.QUEUED_TASK_UPDATE}`, async () => {
			const waitOnEvent = new Promise((resolve) => EventsManager.subscribe(events.QUEUED_TASK_UPDATE, resolve));
			const data = { teamspace: '123', model: '345', corId: 1, status: 'happy' };
			EventsManager.publish(events.QUEUED_TASK_UPDATE, data);

			await waitOnEvent;
			expect(ModelSettings.updateModelStatus.mock.calls.length).toBe(1);
			expect(ModelSettings.updateModelStatus.mock.calls[0]).toEqual(
				[data.teamspace, data.model, data.status, data.corId],
			);
		});
	});
};

describe('services/eventsListener/eventsListener', () => {
	EventsListener.init();
	testModelEventsListener();
});
