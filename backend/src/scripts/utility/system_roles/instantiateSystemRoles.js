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

/**
 * This script is used to create the roles used in the admin permissions system.
 */
const Path = require('path');

const { v5Path } = require('../../../interop');

const run = require(`${v5Path}/../scripts/migrations/4.28/instantiateSystemRoles`);

const genYargs = (yargs) => {
	const commandName = Path.basename(__filename, Path.extname(__filename));
	return yargs.command(commandName,
		'Instantiate all the system roles',
		(argv) => run(argv.username, argv.role));
};

module.exports = { run, genYargs };