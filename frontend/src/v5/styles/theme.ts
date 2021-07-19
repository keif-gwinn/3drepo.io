import { createMuiTheme } from '@material-ui/core/styles';


export const theme = createMuiTheme({
	palette: {
		primary: {
			main: '#00C1D4',
			light: '#80E0E9',
			dark: '#01ACBD',
			contrastText: '#FFFFFF'
		}
	},
	overrides: {
		MuiButton: {
			root: {
				boxShadow: "1px 3px 1px #9E9E9E"
			}
		}
	}
});

