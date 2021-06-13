import { createMuiTheme, ThemeOptions } from '@material-ui/core';
import { amber, grey, teal } from '@material-ui/core/colors';

const theme = (useDark = false) => createMuiTheme(useDark ? darkTheme : lightTheme);
export default theme;

const lightTheme: ThemeOptions = {
  palette: {
    type: 'light',
    primary: {
      light: teal['300'],
      main: teal['500'],
      dark: teal['700'],
    },
    secondary: {
      light: amber['300'],
      main: amber['500'],
      dark: amber['700'],
    },
    background: {
      default: grey['100'],
    },
  },
};

const darkTheme: ThemeOptions = {
  ...lightTheme,
  palette: {
    ...lightTheme.palette,
    type: 'dark',
    background: {
      default: grey['900'],
    },
  },
};
