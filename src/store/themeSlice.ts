import { createContextWith } from '../util/contextUtil';

interface ThemeState {
  darkMode: boolean;
}

const initialState: ThemeState = {
  darkMode: false,
};

const { ContextProvider, useStoreContext, actions } = createContextWith(initialState, {
  setDarkMode(draft, darkMode: boolean) {
    draft.darkMode = darkMode;
  },
  toggleTheme: (draft) => {
    draft.darkMode = !draft.darkMode;
  },
});

export { ContextProvider as ThemeContextProvider, useStoreContext as useTheme, actions as themeActions };
