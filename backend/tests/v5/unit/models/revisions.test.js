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

const { src } = require('../../helper/path');

const Revisions = require(`${src}/models/revisions`);
const db = require(`${src}/handler/db`);
const { templates } = require(`${src}/utils/responseCodes`);

const testGetRevisionCount = () => {
	describe('GetRevisionCount', () => {
		test('should return the number of revision as per from the database query', async () => {
			const expectedData = 10;
			jest.spyOn(db, 'count').mockResolvedValue(expectedData);

			const res = await Revisions.getRevisionCount('someTS', 'someModel');
			expect(res).toEqual(expectedData);
		});
	});
};

const testGetLatestRevision = () => {
	describe('GetLatestRevision', () => {
		test('Should return the latest revision if there is one', async () => {
			const expectedData = {
				_id: 1,
				tag: 'rev1',
			};
			jest.spyOn(db, 'findOne').mockResolvedValue(expectedData);

			const res = await Revisions.getLatestRevision('someTS', 'someModel');
			expect(res).toEqual(expectedData);
		});

		test('Should throw REVISION_NOT_FOUND if there is no revision', async () => {
			jest.spyOn(db, 'findOne').mockResolvedValue(undefined);
			await expect(Revisions.getLatestRevision('someTS', 'someModel')).rejects.toEqual(templates.revisionNotFound);
		});
	});
};

const testGetRevisions = () => {
	describe('GetRevisions', () => {
		const expectedData = [
			{ _id: 1, author: 'someUser', timestamp: new Date() },
			{ _id: 2, author: 'someUser', timestamp: new Date() },
			{ _id: 3, author: 'someUser', timestamp: new Date(), void: true },
		];

		test('Should return all container revisions', async () => {
			jest.spyOn(db, 'find').mockResolvedValue(expectedData);
			const res = await Revisions.getRevisions('someTS', 'someModel', true);
			expect(res).toEqual(expectedData);
		});

		test('Should return non void container revisions', async () => {
			const nonVoidRevisions = expectedData.filter((rev) => !rev.void);
			jest.spyOn(db, 'find').mockResolvedValue(nonVoidRevisions);
			const res = await Revisions.getRevisions('someTS', 'someModel', false);
			expect(res).toEqual(nonVoidRevisions);
		});

		test('Should return an empty object if there are no revisions', async () => {
			jest.spyOn(db, 'find').mockResolvedValue([]);
			const res = await Revisions.getRevisions('someTS', 'someModel', true);
			expect(res).toEqual([]);
		});
	});
};

const testUpdateRevisionStatus = () => {
	describe('UpdateRevisionStatus', () => {
		const expectedData = { _id: 1, author: 'someUser', timestamp: new Date(), void: true };

		test('Should update the void status of a revision', async () => {
			jest.spyOn(db, 'findOne').mockResolvedValue(expectedData);
			await Revisions.updateRevisionStatus('someTS', 'someModel', 3, false);
		});

		test('Should throw REVISION_NOT_FOUND if it cannot find the revision in the revisions table', async () => {
			jest.spyOn(db, 'findOne').mockResolvedValue(undefined);
			await expect(Revisions.updateRevisionStatus('someTS', 'someModel', -1, true)).rejects.toEqual(templates.revisionNotFound);
		});
	});
};

describe('models/revisions', () => {
	testGetRevisionCount();
	testGetLatestRevision();
	testGetRevisions();
	testUpdateRevisionStatus();
});
