import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {getSelector} from './storeUtils';

interface ThemeState {
	darkMode: boolean;
}

const initialState: ThemeState = {
	darkMode: false
}

export const themeSlice = createSlice({
	name: 'theme',
	initialState,
	reducers: {
		setDarkMode: (state, {payload}: PayloadAction<boolean>) => void (state.darkMode = payload),
		toggleTheme: (state) => void (state.darkMode = !state.darkMode)
	}
});

export const themeActions = themeSlice.actions;

export const selectTheme = getSelector('theme');
