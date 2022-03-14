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

const { EVENTS: chatEvents } = require('../../chat/chat.constants');
const { createDirectMessage } = require('../../chat');
const { events } = require('../../eventsManager/eventsManager.constants');
const { logger } = require('../../../utils/logger');
const { removeOldSessions } = require('../../sessions');
const { saveLoginRecord } = require('../../../models/loginRecord');
const { subscribe } = require('../../eventsManager/eventsManager');

const userLoggedIn = ({ username, sessionID, ipAddress, userAgent, referer }) => Promise.all([
	saveLoginRecord(username, sessionID, ipAddress, userAgent, referer),
	removeOldSessions(username, sessionID, referer),
]);

const sessionsRemoved = async ({ ids }) => {
	try {
		await createDirectMessage(chatEvents.LOGGED_OUT, { reason: 'You have logged in else where' }, ids);
	} catch (err) {
		logger.logError(`Failed to create direct message: ${err.message}`);
	}
};

const AuthEventsListener = {};

AuthEventsListener.init = () => {
	subscribe(events.SESSION_CREATED, userLoggedIn);
	subscribe(events.SESSIONS_REMOVED, sessionsRemoved);
};

module.exports = AuthEventsListener;
