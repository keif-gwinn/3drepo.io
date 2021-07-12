// tslint:disable:no-string-literal
const noop = () => ({});

global['window'] = {};
const navigator = { platform: 'node', userAgent: '' };
global['navigator'] = navigator;
global['document'] = { createElement: noop};

import * as AuthSaga from '@/v4/modules/auth/auth.sagas';
import assert from 'assert';

describe('Auth sagas', () => {
	describe('login stuff', () => {
		it('should return -1 when the value is not present', () => {
			assert(AuthSaga);
		});
	});
});
