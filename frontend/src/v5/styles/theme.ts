import { createMuiTheme } from '@material-ui/core/styles';

// color: '#237667'



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
			contained: {
				boxShadow: "0px 0px 0px #9E9E9E",
				'&:hover': {
					boxShadow: "0px 0px 10px #9Eff9E",
				}
			},
			containedPrimary: {
				color: 'white'
			}
		}
	}
});

