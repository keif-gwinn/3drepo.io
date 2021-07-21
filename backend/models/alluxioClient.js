/**
 *  Copyright (C) 2020 3D Repo Ltd
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
const axios = require("axios");

const axiosJSONConfig = {
	headers: {
		"Content-Type": "application/json;charset=UTF-8",
		"Access-Control-Allow-Origin": "*"
	}
};

class AlluxioError extends Error {
	constructor(msg, innerError) {
		super(msg);
		this.innerError = innerError;
	}
}

class AlluxioClient {
	constructor(hostname) {
		this.hostname = hostname;
	}

	getURL(basePath) {
		return `http://${this.hostname}/api/v1/${basePath}`;
	}

	getPathsURL(action, path) {
		return `${this.getURL("paths")}/${path}/${action}`;
	}

	getStreamsURL(action, id) {
		return `${this.getURL("streams")}/${id}/${action}`;
	}

	async postToPathRoute(path, opts, action) {
		return (await axios.post(this.getPathsURL(action, path), opts, axiosJSONConfig)).data;
	}

	async postToStreamRoute(id, opts, action) {
		return (await axios.post(this.getStreamsURL(action, id), opts, axiosJSONConfig)).data;
	}

	/**
	 * Creates a directory
	 *
	 * @param {string} path - The absolute directory path to be created.
	 * @param {string} opts - The absolute directory path to be created.
	 */
	async createDirectory(path, opts) {
		return await this.postToPathRoute(path, opts, "create-directory");
	}

	async createFile(path, opts) {
		return await this.postToPathRoute(path, opts, "create-file");
	}

	async delete(path, opts) {
		return await this.postToPathRoute(path, opts, "delete");
	}

	async exists(path, opts) {
		return await this.postToPathRoute(path, opts, "exists");
	}

	async openFile(path, opts) {
		return await this.postToPathRoute(path, opts, "open-file");
	}

	async free(path, opts) {
		return await this.postToPathRoute(path, opts, "free");
	}

	async getStatus(path, opts) {
		return await this.postToPathRoute(path, opts, "get-status");
	}

	async listStatus(path, opts) {
		return await this.postToPathRoute(path, opts, "list-status");
	}

	async downloadFile(path) {
		const responseType = { responseType: "arraybuffer" };
		return (await axios.get(this.getPathsURL("download-file", path),responseType)).data;
	}

	async downloadFileStream(path) {
		const responseType = { responseType: "stream" };
		return (await axios.get(this.getPathsURL("download-file", path),responseType)).data;
	}

	async ls(path, opts) {
		return (await this.listStatus(path, opts)).map(s => s.name);
	}

	async closeFile(id, opts) {
		return await this.postToStreamRoute(id, opts, "close");
	}

	async getInfo() {
		return (await axios.get(`http://${this.hostname}/api/v1/proxy/info`)).data;
	}

	async uploadFile(path, data) {
		if (await this.exists(path)) {
			throw new Error(`Couldn't create file "${path}":file already exists.`);
		}

		let id = 0;

		try {
			id = await this.createFile(path, {recursive: true});
		} catch(e) {
			throw new AlluxioError(`Couldn't create file "${path}": unknown error.`, e);
		}

		try {
			await this.write(id, data);
		} catch(e) {
			throw new AlluxioError(`Couldn't write data to file "${path}": unknown error.`, e);
		}

		try {
			await this.closeFile(id);
		} catch(e) {
			throw new AlluxioError(`Couldn't closse file "${path}": unknown error.`, e);
		}

	}

	async write(id, data) {
		return axios({
			method: "post",
			url: this.getStreamsURL("write", id),
			data,
			headers: {
				"Content-Type": "application/octet-stream"
			}
		});
	}

}

module.exports = AlluxioClient;
