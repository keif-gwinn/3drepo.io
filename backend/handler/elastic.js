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

"use strict";
const { Client } = require("@elastic/elasticsearch");
const logger = require("../logger");
const systemLogger = logger.systemLogger;
const elasticConfig = require("../config").elastic;
const Elastic = {};

const loginRecordIndex = "io-teamspace-loginrecord";
const loginRecordMapping = {
	"username" : { "type": "text" },
	"loginTime" : { "type": "date" },
	"ipAddr" : { "type": "ip" },
	"location.country" : { "type": "text" },
	"location.city" : { "type": "text" },
	"referrer" : { "type": "text" },
	"application.name": { "type": "text" },
	"application.version": { "type": "text" },
	"application.type": { "type": "text" },
	"engine.name": { "type": "text" },
	"engine.version": { "type": "text" },
	"os.name": { "type": "text" },
	"os.version": { "type": "text" },
	"device": { "type": "text" }
};

let elasticClient;
const indicesMappings = [
	{
		index: loginRecordIndex,
		mapping: loginRecordMapping
	}
];

const createElasticClient = async () => {
	if(!elasticConfig) {
		return;
	}

	try {
		const client = new Client(elasticConfig);
		await client.cluster.health();
		systemLogger.logInfo(`Succesfully connected to ${elasticConfig.cloud.id.trim()}`);
		await establishIndices(client);
	} catch (err) {
		throw "Health check failed on elastic connection, please check settings.";
	}

	return client;
};

const establishIndices = async (elasticClient)=>{
	return Promise.all(indicesMappings.map(async ({index, mapping}) => {
		const { body } = await elasticClient.indices.exists({ index: index });
		if (!body) {
			await elasticClient.indices.create({index: index });
			systemLogger.logInfo(`Created index ${index}`);
			if (mapping) {
				await elasticClient.indices.putMapping({
					index: index,
					body: { properties: mapping }
				});
			}
			systemLogger.logInfo(`Created mapping ${index}`);
		}
	}));
};

const init = () => {
	let wait = true;
	let errMessage;
	//need to make this call synchronised so it will fail and exit the application if init failed.
	createElasticClient().then((client) => {
		elasticClient = client;
	}).catch((err) => {
		errMessage = err;
	}).finally(() => {
		wait = false;
	});

	while(wait) { require('deasync').sleep(100); }
	if (errMessage) {
		throw errMessage;
	}
}

const createElasticRecord = async (index, body, id) => {
	try {
		if (elasticClient && body) {
			await elasticClient.index({
				index,
				id,
				refresh: true,
				body
			});
			systemLogger.logInfo(`created doc ${index} ${JSON.stringify(body)}`);
		}
	} catch (error) {
		systemLogger.logError(`createElasticRecord ${error} ${index}`);
	}
};

Elastic.createLoginRecord = async (username, loginRecord) => {
	const elasticBody = {
		"Id" : loginRecord._id,
		"Username" : username,
		"LoginTime" : Date(loginRecord.loginTime),
		"IpAddress" : loginRecord.ipAddr,
		"Location.Country" : loginRecord.location.country,
		"Location.City" : loginRecord.location.city,
		"Referrer" : loginRecord.referrer,
		"Application.Name" : loginRecord.application.name,
		"Application.Version" : loginRecord.application.version,
		"Application.Type" : loginRecord.application.type,
		"Engine.Name" : loginRecord.engine.name,
		"Engine.Version" : loginRecord.engine.version,
		"OS.Name" : loginRecord.os.name,
		"OS.Version" : loginRecord.os.version,
		"Device" : loginRecord.device
	};

	await createElasticRecord(loginRecordIndex, elasticBody, elasticBody.Id);
};

init();
module.exports = Elastic;
