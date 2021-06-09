"use strict";

/**
 *  Copyright (C) 2014 3D Repo Ltd
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

const request = require("supertest");
const expect = require("chai").expect;
const app = require("../../services/api.js").createApp();
const logger = require("../../logger.js");
const systemLogger = logger.systemLogger;
const responseCodes = require("../../response_codes.js");
const helpers = require("../helpers/signUp");
const moment = require("moment");
const async = require("async");

describe("Uploading a model", function () {
	const User = require("../../models/user");
	let server;
	let agent;
	const username = "upload_username";
	const password = "Str0ngPassword!";
	const email = "test3drepo_upload@mailinator.com";
	const model = "project1";
	let modelId;
	const desc = "desc";
	const type = "type";
	const unit = "meter";
	const project = "sample";

	before(function(done) {

		server = app.listen(8080, function () {
			console.log("API test server is listening on port 8080!");

			async.series([
				function(done) {
					helpers.signUpAndLogin({
						server, request, agent, expect, User, systemLogger,
						username, password, email, model, desc, type, noBasicPlan: true, unit,
						done: function(err, _agent) {
							agent = _agent;
							done(err);
						}
					});
				},
				function(done) {
					// create a model
					agent.post(`/${username}/model`)
						.send({ type, desc, unit, modelName: model, project })
						.expect(200, function(err, res) {
							modelId = res.body.model;
							done(err);
						});
				}
			], done);

		});

	});

	after(function(done) {

		const q = require("../../services/queue");
		q.channel.purgeQueue(q.modelQName).then(() => {
			server.close(function() {
				console.log("API test server is closed");
				done();
			});
		});

	});

	describe("without quota", function() {

		it("should return error (no subscriptions)", function(done) {
			agent.post(`/${username}/${modelId}/upload`)
				.field("tag", "no_quota")
				.attach("file", __dirname + "/../../statics/3dmodels/8000cubes.obj")
				.expect(400, function(err, res) {
					expect(res.body.value).to.equal(responseCodes.SIZE_LIMIT_PAY.value);
					done(err);
				});
		});

	});

	describe("with not enough quota", function() {

		before(async function() {
			const subscriptions = {
				"discretionary" : {
						"collaborators" : 2,
						"data" : 4,
						"expiryDate" : moment().utc().add(1, "month").valueOf()
				}
			};

			await User.updateSubscriptions(username, subscriptions);
		});


		it("should return error (has a subscription but ran out of space)", function(done) {
			agent.post(`/${username}/${modelId}/upload`)
				.field("tag", "no_space")
				.attach("file", __dirname + "/../../statics/3dmodels/8000cubes.obj")
				.expect(400, function(err, res) {
					expect(res.body.value).to.equal(responseCodes.SIZE_LIMIT_PAY.value);
					done(err);
				});

		});
	});

	describe("with quota", function() {

		before(async function() {
			// give some money to this guy
			const subscriptions = {
				"discretionary" : {
						"collaborators" : 2,
						"data" : 1024,
						"expiryDate" : moment().utc().add(1, "month").valueOf()
				}
			};

			await User.updateSubscriptions(username, subscriptions);
		});

		it("should succeed", async function() {
			await agent.post(`/${username}/${modelId}/upload`)
				.field("tag", "with_quota")
				.attach("file", __dirname + "/../../statics/3dmodels/8000cubes.obj")
				.expect(200);
		});
		/*
		it("should have one item inserted into the queue", function(done) {

			const q = require("../../services/queue");

			// upload api return before insert item to queue so introduce some time lag here
			setTimeout(function() {

				q.channel.assertQueue(q.modelQName, { durable: true }).then(info => {

					// expect 1 message in the worker queue
					expect(info.messageCount).to.equal(1);
					done();

				}).catch(err => {
					done(err);
				});

			}, 1000);

		});
		*/
		it("should succeed (uppercase extension)", function(done) {
			agent.post(`/${username}/${modelId}/upload`)
				.field("tag", "uppercase_ext")
				.attach("file", __dirname + "/../../statics/3dmodels/upper.OBJ")
				.expect(200, function(err, res) {
					done(err);
				});
		});

		it("but without tag should fail", function(done) {
			agent.post(`/${username}/${modelId}/upload`)
				.attach("file", __dirname + "/../../statics/3dmodels/8000cubes.obj")
				.expect(400, function(err, res) {
					expect(res.body.value).to.equal(responseCodes.INVALID_TAG_NAME.value);
					done(err);
				});
		});

		it("but with invalid tag should fail", function(done) {
			agent.post(`/${username}/${modelId}/upload`)
				.field("tag", "bad tag!")
				.attach("file", __dirname + "/../../statics/3dmodels/8000cubes.obj")
				.expect(400, function(err, res) {
					expect(res.body.value).to.equal(responseCodes.INVALID_TAG_NAME.value);
					done(err);
				});
		});

		it("but empty file size should fail", function(done) {

			agent.post(`/${username}/${modelId}/upload`)
				.field("tag", "empty_file")
				.attach("file", __dirname + "/../../statics/3dmodels/empty.ifc")
				.expect(400, function(err, res) {
					expect(res.body.value).to.equal(responseCodes.FILE_FORMAT_NOT_SUPPORTED.value);
					done(err);
				});

		});

		it("but unaccepted extension should failed", function(done) {

			agent.post(`/${username}/${modelId}/upload`)
				.field("tag", "unsupported_ext")
				.attach("file", __dirname + "/../../statics/3dmodels/toy.abc")
				.expect(400, function(err, res) {
					expect(res.body.value).to.equal(responseCodes.FILE_FORMAT_NOT_SUPPORTED.value);
					done(err);
				});

		});

		it("but no extension should failed", function(done) {

			agent.post(`/${username}/${modelId}/upload`)
				.field("tag", "no_ext")
				.attach("file", __dirname + "/../../statics/3dmodels/toy")
				.expect(400, function(err, res) {
					expect(res.body.value).to.equal(responseCodes.FILE_NO_EXT.value);
					done(err);
				});

		});

		it("but file size exceeded fixed single file size limit should fail", function(done) {

			agent.post(`/${username}/${modelId}/upload`)
				.field("tag", "too_big")
				.attach("file", __dirname + "/../../statics/3dmodels/toy.ifc")
				.expect(400, function(err, res) {
					expect(res.body.value).to.equal(responseCodes.SIZE_LIMIT.value);
					done(err);
				});

		});

	});

	describe("MS Logic Apps chunking", function() {
		let corID1;
		let corID2;

		describe("Upload model request", function() {
			it("without invalid model should fail", async function() {
				await agent.post(`/${username}/invalidModel/upload/ms-chunking`)
					.send({
						"filename": "file.ifc",
						"tag": "rev0"
					})
					.expect(400, function(err, res) {
						expect(res.body.value).to.equal(responseCodes.MODEL_NOT_FOUND.value);
						done(err);
					});
			});

			it("without filename should fail", async function() {
				await agent.post(`/${username}/${modelId}/upload/ms-chunking`)
					.send({"tag": "no_filename"})
					.expect(400, function(err, res) {
						expect(res.body.value).to.equal(responseCodes.INVALID_ARGUMENTS.value);
						done(err);
					});
			});

			it("without tag should fail", async function() {
				await agent.post(`/${username}/${modelId}/upload/ms-chunking`)
					.send({"filename": "no_tag.ifc"})
					.expect(400, function(err, res) {
						expect(res.body.value).to.equal(responseCodes.INVALID_TAG_NAME.value);
						done(err);
					});
			});

			it("with invalid tag should fail", async function() {
				await agent.post(`/${username}/${modelId}/upload/ms-chunking`)
					.send({
						"filename": "file.ifc",
						"tag": "bad tag!"
					})
					.expect(400, function(err, res) {
						expect(res.body.value).to.equal(responseCodes.INVALID_TAG_NAME.value);
						done(err);
					});
			});

			it("without description should succeed", async function() {
				await agent.post(`/${username}/${modelId}/upload/ms-chunking`)
					.send({
						"filename": "MEP Core.ifc",
						"tag": "id1"
					})
					.expect(200, function(err, res) {
						corID1 = res.body.corID;
						done(err);
					});
			});

			it("should succeed", async function() {
				await agent.post(`/${username}/${modelId}/upload/ms-chunking`)
					.send({
						"filename": "MEP Core.ifc",
						"tag": "id2",
						"desc": "Revision 2"
					})
					.expect(200, function(err, res) {
						corID2 = res.body.corID;
						done(err);
					});
			});

			it("duplicate tag should fail", async function() {
				await agent.post(`/${username}/${modelId}/upload/ms-chunking`)
					.send({
						"filename": "file.ifc",
						"tag": "id2",
					})
					.expect(400, function(err, res) {
						expect(res.body.value).to.equal(responseCodes.DUPLICATE_TAG.value);
						done(err);
					});
			});
		});
	});
});
