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

const Project = require(`${src}/models/projects`);
const db = require(`${src}/handler/db`);
const { templates } = require(`${src}/utils/responseCodes`);
const { PROJECT_ADMIN } = require(`${src}/utils/permissions/permissions.constants`);

const testProjectAdmins = () => {
	describe('Get project admins', () => {
		test('should return list of admins if project exists', async () => {
			const expectedData = {
				permissions: [
					{ user: 'personA', permissions: [PROJECT_ADMIN] },
					{ user: 'personB', permissions: ['someOtherPerm'] },
					{ user: 'personC', permissions: [PROJECT_ADMIN] },
				],
			};
			jest.spyOn(db, 'findOne').mockResolvedValue(expectedData);

			const res = await Project.getProjectAdmins('someTS', 'someProject');
			expect(res).toEqual(['personA', 'personC']);
		});
		test('should return error if project does not exists', async () => {
			jest.spyOn(db, 'findOne').mockResolvedValue(undefined);

			await expect(Project.getProjectAdmins('someTS', 'someProject'))
				.rejects.toEqual(templates.projectNotFound);
		});
	});
};

const testGetProjectList = () => {
	describe('Get project list', () => {
		test('should return list of projects', async () => {
			const expectedData = [
				{ _id: 1, name: 'proj1' },
				{ _id: 2, name: 'proj2' },
				{ _id: 3, name: 'proj3' },
				{ _id: 4, name: 'proj4' },
				{ _id: 5, name: 'proj5' },
			];
			jest.spyOn(db, 'find').mockResolvedValue(expectedData);

			const res = await Project.getProjectList('someTS');
			expect(res).toEqual(expectedData);
		});
	});
};

const testModelExistsInProject = () => {
	describe('Model Exists In Project', () => {
		test('should return error if the project does not exist', async () => {
			jest.spyOn(db, 'findOne').mockResolvedValue(undefined);

			await expect(Project.modelExistsInProject('someTS', 'someProject', 'a'))
				.rejects.toEqual(templates.projectNotFound);
		});

		test('should return true if a model is part of a project', async () => {
			const project = { models: ['a', 'b', 'c'] };
			jest.spyOn(db, 'findOne').mockResolvedValue(project);
			const res = await Project.modelExistsInProject('someTS', 'someProject', 'a');
			expect(res).toEqual(true);
		});

		test('should return false if a model is not part of a project', async () => {
			const project = { models: ['a', 'b', 'c'] };
			jest.spyOn(db, 'findOne').mockResolvedValue(project);
			const res = await Project.modelExistsInProject('someTS', 'someProject', 'd');
			expect(res).toEqual(false);
		});
	});
};

describe('models/projects', () => {
	testProjectAdmins();
	testGetProjectList();
	testModelExistsInProject();
});
