import React, {useEffect} from 'react';
import {CssBaseline, ThemeProvider, useMediaQuery} from '@material-ui/core';
import theme from './theme';
import Header from './components/Header';
import MainContainer from './components/MainContainer/MainContainer';
import TodoInsert from './components/TodoInsert/TodoInsert';
import TodoList from './components/TodoList/TodoList';
import {Provider} from 'react-redux';
import {Store, useAppDispatch, useAppSelector} from './store/store';
import {selectTheme, themeActions} from './store/themeSlice';


export type Todo = {
	id: string;
	addedOn: number;
	completedOn?: number;
	value: string;
}

function App() {
	return (
		<Provider store={Store}>
			<Main />
		</Provider>
	);
}

function Main() {
	const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
	const d = useAppDispatch();
	const {darkMode} = useAppSelector(selectTheme('darkMode'));
	useEffect(() => {
		d(themeActions.setDarkMode(prefersDarkMode));
	}, [d, prefersDarkMode]);

	return (
		<ThemeProvider theme={theme(darkMode)}>
			<CssBaseline />
			<MainContainer
				header={<Header />}
				footer={<TodoInsert />}>
				<TodoList />
			</MainContainer>
		</ThemeProvider>
	)
}

export default App;
