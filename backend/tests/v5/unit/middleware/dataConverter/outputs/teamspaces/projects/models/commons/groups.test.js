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

const { src } = require('../../../../../../../../helper/path');
const { generateGroup } = require('../../../../../../../../helper/services');

jest.mock('../../../../../../../../../../src/v5/utils/responder');
const Responder = require(`${src}/utils/responder`);
const { UUIDToString } = require(`${src}/utils/helper/uuids`);
const { cloneDeep } = require(`${src}/utils/helper/objects`);
const { templates } = require(`${src}/utils/responseCodes`);

const GroupsOutputMiddlewares = require(`${src}/middleware/dataConverter/outputs/teamspaces/projects/models/commons/groups`);

// Mock respond function to just return the resCode
const respondFn = Responder.respond.mockImplementation((req, res, errCode) => errCode);

const testSerialiseGroupArray = () => {
	describe.each([
		[[], 'empty array'],
		[
			[
				generateGroup('a', 'b', false, false, false),
				generateGroup('a', 'b', true, false, false),
				generateGroup('a', 'b', false, true, false),
			],
			'3 different group types',
		],
	])('Serialise Group array data', (data, desc) => {
		test(`should serialise correctly with ${desc}`,
			() => {
				const nextIdx = respondFn.mock.calls.length;
				GroupsOutputMiddlewares.serialiseGroupArray({ outputData: cloneDeep(data) }, {}, () => {});
				expect(respondFn.mock.calls.length).toBe(nextIdx + 1);
				expect(respondFn.mock.calls[nextIdx][2]).toEqual(templates.ok);

				const serialisedGroups = data.map((group) => {
					const res = { ...group };

					res._id = UUIDToString(group._id);

					if ((group.objects || []).length) {
						res.objects = group.objects.map((entry) => {
							if (entry.shared_ids) {
								// eslint-disable-next-line no-param-reassign
								entry.shared_ids = entry.shared_ids.map(UUIDToString);
							}
							return entry;
						});
					}

					return res;
				});

				expect(respondFn.mock.calls[nextIdx][3]).toEqual({ groups: serialisedGroups });
			});
	});
};

describe('middleware/dataConverter/outputs/teamspaces/projects/models/commons/groups', () => {
	testSerialiseGroupArray();
});
