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

const { src } = require('../../../helper/path');

const TypeChecker = require(`${src}/utils/helper/typeCheck`);

const testIsBuffer = () => {
	describe.each(
		[
			[Buffer.from('abc'), true],
			['', false],
			[3, false],
			[undefined, false],
		],
	)('Is Buffer', (item, isTrue) => {
		test(`${item} should return ${isTrue}`, () => {
			expect(TypeChecker.isBuffer(item)).toBe(isTrue);
		});
	});
};

const testIsString = () => {
	describe.each(
		[
			[Buffer.from('abc'), false],
			['', true],
			['some random string', true],
			[3, false],
			[undefined, false],
		],
	)('Is String', (item, isTrue) => {
		test(`${item} should return ${isTrue}`, () => {
			expect(TypeChecker.isString(item)).toBe(isTrue);
		});
	});
};

describe('utils/helpers/typeCheck', () => {
	testIsBuffer();
	testIsString();
});
