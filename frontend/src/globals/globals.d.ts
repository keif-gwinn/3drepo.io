declare global {
	// tslint:disable-next-line:interface-name
	interface Window {
		Module: any;
		Image: any;
	}
}

declare module '*.png';

export {};
