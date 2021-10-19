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

const { copyFile, mkdir, rm, writeFile } = require('fs/promises');
const { createResponseCode, templates } = require('../utils/responseCodes');
const amqp = require('amqplib');
const { events } = require('./eventsManager/eventsManager.constants');
const { generateUUIDString } = require('../utils/helper/uuids');
const { publish } = require('./eventsManager/eventsManager');
const { cn_queue: queueConfig } = require('../utils/config');
const queueLabel = require('../utils/logger').labels.queue;
const logger = require('../utils/logger').logWithLabel(queueLabel);

const Queue = {};

const SHARED_SPACE_TAG = '$SHARED_SPACE';
const sharedDir = queueConfig.shared_storage;
const modelq = queueConfig.model_queue;
const maxRetries = 3; // FIXME: add to config.

let retry = 0;
let connClosed = false;
let connectionPromise;

const reconnect = () => {
	if (++retry <= maxRetries) {
		logger.logError(`Trying to reconnect[${retry}/${maxRetries}]...`);
		// eslint-disable-next-line no-use-before-define
		return connect();
	}
	logger.logError('Retries exhausted');
	throw createResponseCode(templates.queueConnectionError, 'Max number of retries reached.');
	// FIXME EMAIL alert?
};

const connect = async () => {
	if (connectionPromise) return connectionPromise;
	try {
		logger.logInfo(`Connecting to ${queueConfig.host}...`);
		connectionPromise = amqp.connect(queueConfig.host);
		const conn = await connectionPromise;
		retry = 0;
		connClosed = false;

		conn.on('close', () => {
			if (!connClosed) {
				// this can be called more than once for some reason. Use a boolean to distinguish first timers.
				connClosed = true;
				connectionPromise = undefined;
				logger.logInfo('Connection closed.');
				reconnect();
			}
		});

		conn.on('error', (err) => {
			logger.logError(`Connection error: ${err.message}`);
		});
		return conn;
	} catch (err) {
		logger.logError(`Failed to establish connection to rabbit mq: ${err}.`);
		return reconnect();
	}
};

const queueJob = async (queueName, correlationId, msg) => {
	try {
		const conn = await connect();
		const channel = await conn.createChannel();
		await channel.assertQueue(queueName, { durable: true });

		// eslint-disable-next-line new-cap
		const dataBuf = new Buffer.from(msg);
		const meta = { correlationId, persistent: true };

		await channel.sendToQueue(queueName, dataBuf, meta);
		logger.logInfo(`[${queueName}][INSERT]\tOK\t${correlationId}\t${msg.toString()}`);
		await channel.close();
	} catch (err) {
		logger.logError(`[${queueName}][INSERT]\t${err.message}\t${correlationId}\t${msg.toString()}`);
		// FIXME Mailer.sendQueueFailedEmail({ message }).catch(() => {});
		throw createResponseCode(templates.queueConnectionError, err.message);
	}
};

const queueModelJob = (corId, msg) => queueJob(modelq, corId, msg);

Queue.queueModelUpload = async (teamspace, model, data, { originalname, path }) => {
	const revId = generateUUIDString();

	const fileNameSanitised = originalname.replace(/[ *"/\\[\]:;|=,<>$]/g, '_');

	const fileLoc = `${revId}/${fileNameSanitised}`;

	const json = {
		...data,
		file: `${SHARED_SPACE_TAG}/${fileLoc}`,
		database: teamspace,
		project: model,
		revId,
	};

	await mkdir(`${sharedDir}/${revId}`);

	await Promise.all(
		[
			copyFile(path, `${sharedDir}/${fileLoc}`),
			writeFile(`${sharedDir}/${revId}.json`, JSON.stringify(json)),

		],
	);
	try {
		await rm(path);
	} catch (err) {
		logger.logError(`Failed to remove file from upload dir: ${path}`);
	}

	const msg = `import -f ${SHARED_SPACE_TAG}/${revId}.json`;

	await queueModelJob(revId, msg);

	publish(events.QUEUE_ITEM_UPDATE, { teamspace, model, corId: revId, status: 'queued' });
};

module.exports = Queue;
