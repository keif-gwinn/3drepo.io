declare global {
	const ClientConfig: any;

	// tslint:disable-next-line:interface-name
	interface Window {
		Module: any;
		zxcvbn: any;
		io: any;
		ClientConfig: any;
		TDR: any;
		UnityUtil: any;
		Viewer: any;
		Pin: any;
		requestIdleCallback: any;
		__REDUX_DEVTOOLS_EXTENSION__: any;
		__RESELECT_TOOLS__: any;
	}

	// tslint:disable-next-line:interface-name
	interface Document {
		webkitCancelFullScreen: () => void;
	}

	// tslint:disable-next-line:interface-name
	interface Document {
		webkitCancelFullScreen: () => void;
	}

	// tslint:disable-next-line:interface-name
	interface HTMLElement {
		webkitRequestFullscreen: () => void;
	}
}

declare module '*.png';

export {};
