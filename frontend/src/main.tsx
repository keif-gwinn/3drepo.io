import { ConnectedRouter } from 'connected-react-router';
import 'font-awesome/css/font-awesome.min.css';
import 'normalize.css/normalize.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import 'simplebar';
import 'simplebar/dist/simplebar.min.css';

import { initialize as initializeActions } from '@/v5/helpers/actions';
import { dispatch, history, store } from './v4/modules/store';

import Root from './v4/routes/index';
import './v4/styles/global';

import { UnityUtil } from './globals/unity-util';
import { IS_DEVELOPMENT } from './v4/constants/environment';
import { clientConfigService } from './v4/services/clientConfig';
import './v4/services/fontAwesome';

window.UnityUtil = UnityUtil;

initializeActions(dispatch);

const render = () => {
	ReactDOM.render(
		// tslint:disable-next-line: jsx-wrap-multiline
		<Provider store={store} >
			<ConnectedRouter history={history}>
				<Root />
			</ConnectedRouter>
		</Provider>,
		document.getElementById('app')
	);
};

const initApp = () => {
	if (clientConfigService.isValid && !clientConfigService.isMaintenanceEnabled) {
		clientConfigService.injectCustomCSS();
		render();
	}

	clientConfigService.logAppVersion();
};

initApp();

if (!IS_DEVELOPMENT) {
	// tslint:disable-next-line: no-var-requires
	require('offline-plugin/runtime').install();
}
