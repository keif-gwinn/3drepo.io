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
		test('Should return container revisions', async () => {
			const expectedData = [
				{ _id: 1, author: 'someUser', timestamp: new Date() },
				{ _id: 2, author: 'someUser', timestamp: new Date() },
				{ _id: 3, author: 'someUser', timestamp: new Date() },
			];
			jest.spyOn(db, 'find').mockResolvedValue(expectedData);

			const res = await Revisions.getRevisions('someTS', 'someModel');
			expect(res).toEqual(expectedData);
		});

		test('Should throw CONTAINER_NOT_FOUND if there is no revisions table', async () => {
			jest.spyOn(db, 'find').mockResolvedValue({ length: 0 });
			await expect(Revisions.getRevisions('someTS', 'someModel')).rejects.toEqual(templates.containerNotFound);
		});
	});
};

describe('models/revisions', () => {
	testGetRevisionCount();
	testGetLatestRevision();
	testGetRevisions();
});