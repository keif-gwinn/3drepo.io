/**
 *  Copyright (C) 2022 3D Repo Ltd
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

const ServiceHelper = require('../../../helper/services');
const { src, objModel } = require('../../../helper/path');
const SuperTest = require('supertest');

const { EVENTS, ACTIONS } = require(`${src}/services/chat/chat.constants`);
const { templates } = require(`${src}/utils/responseCodes`);
const { queueMessage } = require(`${src}/handler/queue`);
const { cn_queue: queueConfig } = require(`${src}/utils/config`);
const { mkdirSync, writeFileSync } = require('fs');

const user = ServiceHelper.generateUserCredentials();
const teamspace = ServiceHelper.generateRandomString();
const project = ServiceHelper.generateRandomProject();
const container = ServiceHelper.generateRandomModel();
const federation = ServiceHelper.generateRandomModel({ isFederation: true });

let agent;
const setupData = async () => {
	await ServiceHelper.db.createTeamspace(teamspace, [user.user]);
	await Promise.all([
		ServiceHelper.db.createModel(
			teamspace,
			container._id,
			container.name,
			container.properties,
		),
		ServiceHelper.db.createModel(
			teamspace,
			federation._id,
			federation.name,
			federation.properties,
		),
	]);
	await Promise.all([
		ServiceHelper.db.createUser(user, [teamspace]),
		ServiceHelper.db.createProject(teamspace, project.id, project.name, [container._id, federation._id]),
	]);
};

const getSocket = async () => {
	const cookie = await ServiceHelper.loginAndGetCookie(agent, user.user, user.password);
	return ServiceHelper.connectToSocket(cookie);
};

const joinModelRoom = (socket, data) => new Promise((resolve, reject) => {
	socket.on(EVENTS.MESSAGE, (msg) => {
		expect(msg).toEqual(expect.objectContaining(
			{ event: EVENTS.SUCCESS, data: { action: ACTIONS.JOIN, data } },
		));
		socket.off(EVENTS.MESSAGE);
		socket.off(EVENTS.ERROR);
		resolve();
	});

	socket.on(EVENTS.ERROR, () => {
		socket.off(EVENTS.MESSAGE);
		socket.off(EVENTS.ERROR);
		reject();
	});
	socket.emit('join', data);
});
const modelUploadTest = () => {
	describe('Model uploads', () => {
		const route = `/v5/teamspaces/${teamspace}/projects/${project.id}/containers/${container._id}/revisions`;
		const fedRoute = `/v5/teamspaces/${teamspace}/projects/${project.id}/federations/${federation._id}/revisions`;
		test(`should receive a ${EVENTS.CONTAINER_SETTINGS_UPDATE} event after revision upload if the user has joined the room`, async () => {
			const socket = await getSocket();
			const data = { teamspace, project: project.id, model: container._id };

			await expect(joinModelRoom(socket, data)).resolves.toBeUndefined();
			const modelUpdatePromise = new Promise((resolve, reject) => {
				socket.on(EVENTS.CONTAINER_SETTINGS_UPDATE, resolve);
				setTimeout(reject, 100);
			});

			await agent.post(`${route}?key=${user.apiKey}`)
				.set('Content-Type', 'multipart/form-data')
				.field('tag', ServiceHelper.generateRandomString())
				.attach('file', objModel)
				.expect(templates.ok.status);

			await expect(modelUpdatePromise).resolves.toEqual({ ...data, status: 'queued' });
			socket.close();
		});

		test(`should receive a ${EVENTS.FEDERATION_SETTINGS_UPDATE} event after revision upload if the user has joined the room`, async () => {
			const socket = await getSocket();
			const data = { teamspace, project: project.id, model: federation._id };

			const joinPromise = joinModelRoom(socket, data);

			await expect(joinPromise).resolves.toBeUndefined();
			const modelUpdatePromise = new Promise((resolve, reject) => {
				socket.on(EVENTS.FEDERATION_SETTINGS_UPDATE, resolve);
				setTimeout(reject, 100);
			});

			await agent.post(`${fedRoute}?key=${user.apiKey}`)
				.send({ containers: [container._id] })
				.expect(templates.ok.status);

			await expect(modelUpdatePromise).resolves.toEqual({ ...data, status: 'queued' });
			socket.close();
		});

		test(`should not receive a ${EVENTS.CONTAINER_SETTINGS_UPDATE} event after revision upload if the user has left the room`, async () => {
			const socket = await getSocket();
			const data = { teamspace, project: project.id, model: container._id };

			await expect(joinModelRoom(socket, data)).resolves.toBeUndefined();

			const fn = jest.fn();
			const modelUpdatePromise = new Promise((resolve, reject) => {
				socket.on(EVENTS.CONTAINER_SETTINGS_UPDATE, () => { fn(); reject(); });
				setTimeout(resolve, 100);
			});

			const leavePromise = new Promise((resolve, reject) => {
				socket.on(EVENTS.MESSAGE, (msg) => {
					expect(msg).toEqual(expect.objectContaining(
						{ event: EVENTS.SUCCESS, data: { action: ACTIONS.LEAVE, data } },
					));
					resolve();
				});

				socket.on(EVENTS.ERROR, reject);
			});

			socket.emit('leave', data);

			await expect(leavePromise).resolves.toBeUndefined();

			await agent.post(`${route}?key=${user.apiKey}`)
				.set('Content-Type', 'multipart/form-data')
				.field('tag', ServiceHelper.generateRandomString())
				.attach('file', objModel)
				.expect(templates.ok.status);

			await expect(modelUpdatePromise).resolves.toBeUndefined();
			expect(fn).not.toHaveBeenCalled();
			socket.close();
		});
	});
};

const queueUpdateTest = () => {
	describe('On callback queue update', () => {
		test(`should receive a ${EVENTS.CONTAINER_SETTINGS_UPDATE} event if a container status has been updated`, async () => {
			const socket = await getSocket();
			const data = { teamspace, project: project.id, model: container._id };
			await expect(joinModelRoom(socket, data)).resolves.toBeUndefined();

			const modelUpdatePromise = new Promise((resolve, reject) => {
				socket.on(EVENTS.CONTAINER_SETTINGS_UPDATE, resolve);
				setTimeout(reject, 100);
			});

			const content = { status: 'processing', database: teamspace, project: container._id };
			await queueMessage(queueConfig.callback_queue, ServiceHelper.generateRandomString(),
				JSON.stringify(content));
			await expect(modelUpdatePromise).resolves.toEqual({ ...data, status: content.status });

			socket.close();
		});

		test(`should receive a ${EVENTS.FEDERATION_SETTINGS_UPDATE} event if a federation status has been updated`, async () => {
			const socket = await getSocket();
			const data = { teamspace, project: project.id, model: federation._id };
			await expect(joinModelRoom(socket, data)).resolves.toBeUndefined();

			const modelUpdatePromise = new Promise((resolve, reject) => {
				socket.on(EVENTS.FEDERATION_SETTINGS_UPDATE, resolve);
				setTimeout(reject, 100);
			});

			const content = { status: 'processing', database: teamspace, project: federation._id };
			await queueMessage(queueConfig.callback_queue, ServiceHelper.generateRandomString(),
				JSON.stringify(content));
			await expect(modelUpdatePromise).resolves.toEqual({ ...data, status: content.status });

			socket.close();
		});
	});
};

const queueFinishedTest = () => {
	describe('On callback queue task finished', () => {
		test(`should receive a ${EVENTS.CONTAINER_SETTINGS_UPDATE} event if a container revision has finished`, async () => {
			const socket = await getSocket();
			const data = { teamspace, project: project.id, model: container._id };
			await expect(joinModelRoom(socket, data)).resolves.toBeUndefined();

			const modelUpdatePromise = new Promise((resolve, reject) => {
				socket.on(EVENTS.CONTAINER_SETTINGS_UPDATE, resolve);
				setTimeout(reject, 100);
			});

			const content = { value: 0, database: teamspace, project: container._id };
			await queueMessage(queueConfig.callback_queue, ServiceHelper.generateRandomString(),
				JSON.stringify(content));
			const results = await modelUpdatePromise;
			expect(results).toEqual(expect.objectContaining(data));
			expect(results.timestamp).not.toBeUndefined();

			socket.close();
		});
		test(`should receive a ${EVENTS.FEDERATION_SETTINGS_UPDATE} event if a federation revision has finished`, async () => {
			const socket = await getSocket();
			const data = { teamspace, project: project.id, model: federation._id };
			await expect(joinModelRoom(socket, data)).resolves.toBeUndefined();

			const content = { value: 0, database: teamspace, project: federation._id };
			const corId = ServiceHelper.generateRandomString();
			const fileContent = { subProjects: [{ project: container._id }] };
			mkdirSync(`${queueConfig.shared_storage}/${corId}`);
			writeFileSync(`${queueConfig.shared_storage}/${corId}/obj.json`, JSON.stringify(fileContent));
			const modelUpdatePromise = new Promise((resolve, reject) => {
				socket.on(EVENTS.FEDERATION_SETTINGS_UPDATE, resolve);
				setTimeout(reject, 100);
			});
			await queueMessage(queueConfig.callback_queue, corId, JSON.stringify(content));
			const results = await modelUpdatePromise;
			expect(results).toEqual(expect.objectContaining({ ...data, containers: [container._id] }));
			expect(results.timestamp).not.toBeUndefined();

			socket.close();
		});
	});
};

describe('E2E Chat Service (Model Events)', () => {
	let server;
	let chatApp;
	beforeAll(async () => {
		server = ServiceHelper.app();
		chatApp = await ServiceHelper.chatApp();
		agent = await SuperTest(server);
		await setupData();
	});
	afterAll(() => Promise.all([
		ServiceHelper.closeApp(server),
		chatApp.close()]));
	modelUploadTest();
	queueUpdateTest();
	queueFinishedTest();
});
