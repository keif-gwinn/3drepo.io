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

const { cloneDeep } = require('lodash');
const { src } = require('../../../helper/path');
const { generateRandomString } = require('../../../helper/services');

const TemplateSchema = require(`${src}/schemas/tickets/templates`);
const { fieldTypes, presetModules, presetEnumValues, presetModulesProperties, defaultProperties } = require(`${src}/schemas/tickets/templates.constants`);

const testValidate = () => {
	const nameTests = [
		['the name is too long', { name: generateRandomString(121) }, false],
		['the name is an empty string', { name: '' }, false],
	];

	const schemaFieldsTest = [
		['all optional fields provided', {
			name: generateRandomString(),
			comments: false,
			deprecated: true,
			properties: undefined,
			modules: undefined,
		}, true],
		['properties is an empty array', { name: generateRandomString(), properties: [] }, true],
		['properties is of the wrong type', { name: generateRandomString(), properties: 'a' }, false],
		['property name is used by a default property', { name: generateRandomString(), properties: [defaultProperties[0]] }, false],
		['modules is an empty array', { name: generateRandomString(), modules: [] }, true],
		['modules is of the wrong type', { name: generateRandomString(), modules: 'a' }, false],
	];

	const propertiesTest = [
		['property is undefined', { name: generateRandomString(), properties: [undefined] }, false],
		['property is not an object', { name: generateRandomString(), properties: ['a'] }, false],
		['property is an empty object', { name: generateRandomString(), properties: [{}] }, false],
		['property has an unknown type', { name: generateRandomString(),
			properties: [{
				name: generateRandomString(),
				type: 'abc',
			}] }, false],
		['property has all required fields', { name: generateRandomString(),
			properties: [{
				name: generateRandomString(),
				type: fieldTypes.TEXT,
			}] }, true],
		['property with enum type without values', { name: generateRandomString(),
			properties: [{
				name: generateRandomString(),
				type: fieldTypes.ONE_OF,
			}] }, false],
		['property with enum type with values', { name: generateRandomString(),
			properties: [{
				name: generateRandomString(),
				type: fieldTypes.ONE_OF,
				values: [generateRandomString(), generateRandomString()],
			}] }, true],
		['property with enum type with values where default value is not within the values provided', { name: generateRandomString(),
			properties: [{
				name: generateRandomString(),
				type: fieldTypes.ONE_OF,
				values: [generateRandomString(), generateRandomString()],
				default: generateRandomString(),
			}] }, true],
		['property with enum type with values where default values are valid', { name: generateRandomString(),
			properties: [{
				name: generateRandomString(),
				type: fieldTypes.MANY_OF,
				values: ['a', 'b'],
				default: ['a', 'b'],
			}] }, true],
		['property with enum type with values being the wrong type', { name: generateRandomString(),
			properties: [{
				name: generateRandomString(),
				type: fieldTypes.MANY_OF,
				values: [123, 12354],
			}] }, false],

		['property with enum type with values being the a preset list', { name: generateRandomString(),
			properties: [{
				name: generateRandomString(),
				type: fieldTypes.MANY_OF,
				values: presetEnumValues.JOBS,
			}] }, true],
		['property with enum type with values is the wrong type', { name: generateRandomString(),
			properties: [{
				name: generateRandomString(),
				type: fieldTypes.ONE_OF,
				values: [generateRandomString(), generateRandomString(), 'a'],
				default: ['a'],
			}] }, false],
		['property with enum type with values where default values are duplicated', { name: generateRandomString(),
			properties: [{
				name: generateRandomString(),
				type: fieldTypes.MANY_OF,
				values: [generateRandomString(), generateRandomString(), 'a'],
				default: ['a', 'a'],
			}] }, false],
		['property name is too long', { name: generateRandomString(),
			properties: [{
				name: generateRandomString(121),
				type: fieldTypes.TEXT,
			}] }, false],
		['all properties has all required fields', { name: generateRandomString(),
			properties: [{
				name: generateRandomString(),
				type: fieldTypes.TEXT,
			}, {
				name: generateRandomString(),
				type: fieldTypes.NUMBER,
				default: 10,
			}] }, true],
		['one of the properties doesn\'t match the schema', { name: generateRandomString(),
			properties: [{
				name: generateRandomString(),
				type: fieldTypes.TEXT,
			}, {
				name: generateRandomString(),
				type: fieldTypes.NUMBER,
				default: generateRandomString(),
			}] }, false],
		['more than one property has the same name', { name: generateRandomString(),
			properties: [{
				name: 'A',
				type: fieldTypes.TEXT,
			}, {
				name: 'a',
				type: fieldTypes.NUMBER,
			}] }, false],
		['property default value type matches', { name: generateRandomString(),
			properties: [{
				name: generateRandomString(),
				type: fieldTypes.TEXT,
				default: generateRandomString(),
			}] }, true],
		['property default value type mismatches', { name: generateRandomString(),
			properties: [{
				name: generateRandomString(),
				type: fieldTypes.NUMBER,
				default: generateRandomString(),
			}] }, false],
	];

	const createSkeleton = (modules) => ({ name: generateRandomString(), modules });
	const moduleSchemaTest = [
		['module with all required fields filled in (custom module)', createSkeleton([{ name: generateRandomString() }]), true],
		['module with a name that is too long', createSkeleton([{ name: generateRandomString(121) }]), false],
		['module with all required fields filled in (preset module)', createSkeleton([{ type: presetModules.SEQUENCING }]), true],
		['module with an unrecognised preset module', createSkeleton([{ type: generateRandomString() }]), false],
		['module with a name that is the same as a preset module', createSkeleton([{ name: presetModules.SEQUENCING }]), false],
		['module trying to redefine a predefined property', {
			...createSkeleton([{ type: presetModules.SEQUENCING }]),
			properties: presetModulesProperties[presetModules.SEQUENCING][0],
		}, false],
		['module with both name and type are defined', createSkeleton([{ name: generateRandomString(), type: presetModules.SEQUENCING }]), false],
		['module with a property that has the same name as a root property', { ...createSkeleton([{ name: generateRandomString(), properties: [{ name: 'a', type: fieldTypes.TEXT }] }]), properties: [{ name: 'a', type: fieldTypes.TEXT }] }, true],
		['all modules provided are valid', createSkeleton([
			{ type: presetModules.SEQUENCING }, { name: generateRandomString() }]), true],
		['2 modules with same property name', createSkeleton([
			{ type: presetModules.SEQUENCING, properties: [{ name: 'a', type: fieldTypes.TEXT }] },
			{ name: generateRandomString(), properties: [{ name: 'a', type: fieldTypes.TEXT }] }]), true],
		['all modules names must be unique', createSkeleton([
			{ name: 'same' }, { name: 'same' }]), false],
		['all modules types must be unique', createSkeleton([
			{ name: 'same' }, { name: 'same' }]), false],
		['one of the modules are invalid', createSkeleton([
			{ type: generateRandomString() }, { name: generateRandomString() }]), false],
		// copy over the properties test and test it with module
		...propertiesTest.map(([desc, { properties, ...other }, output]) => [
			`module with ${desc}`,
			{ ...other, modules: [{ name: generateRandomString(), properties }, output] },
		]),
	];

	describe.each([
		['the template is undefined', undefined, false],
		['the template is empty', {}, false],
		['the template has all the required fields', { name: generateRandomString() }, true],
		...nameTests,
		...schemaFieldsTest,
		...propertiesTest,
		...moduleSchemaTest,

	])('Validate ticket template', (desc, data, output) => {
		test(`Validation should ${output ? 'succeed' : 'fail'} if ${desc}`, () => {
			const testCase = expect(() => TemplateSchema.validate(data));
			if (output) testCase.not.toThrow();
			else testCase.toThrow();
		});
	});

	test('Any unknown fields should be stripped from the schema and necessary fields filled in', () => {
		const data = {
			name: generateRandomString(),
			properties: [{
				name: 'I am an apple',
				type: fieldTypes.NUMBER,
			},
			{
				name: generateRandomString(),
				type: fieldTypes.TEXT,
				deprecated: true,
			},
			{
				name: generateRandomString(),
				type: fieldTypes.DATE,
				default: Date.now(),
			},
			],
			modules: [{
				name: generateRandomString(),
			}, {
				name: 'ANOTHER CASE CHECK',
			}, {
				type: presetModules.SAFETIBASE,
				deprecated: true,
			}],
		};
		const expectedData = { ...cloneDeep(data) };
		expectedData.properties[2].default = new Date(expectedData.properties[2].default);
		expectedData.modules = expectedData.modules.map(({ name, ...mod }) => (
			{ ...mod, name, properties: [] }));

		data[generateRandomString()] = generateRandomString();
		data.properties[0][generateRandomString()] = generateRandomString();
		data.modules[0][generateRandomString()] = generateRandomString();
		const output = TemplateSchema.validate(data);

		expect(output).toEqual(expectedData);
	});
};

describe('schema/tickets/templates', () => {
	testValidate();
});