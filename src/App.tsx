import React, { useEffect } from 'react';
import { CssBaseline, ThemeProvider, useMediaQuery } from '@material-ui/core';
import theme from './theme';
import Header from './components/Header';
import MainContainer from './components/MainContainer/MainContainer';
import TodoInsert from './components/TodoInsert/TodoInsert';
import TodoList from './components/TodoList/TodoList';
import { ThemeContextProvider, useTheme } from "./store/themeSlice";
import { TodoContextProvider } from './store/todoSlice';


export type Todo = {
	id: string;
	addedOn: number;
	completedOn?: number;
	value: string;
}

function App() {
	return (
		<ThemeContextProvider>
			<Main />
		</ThemeContextProvider>
	);
}

function Main() {
	const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
	const { state: { darkMode }, action: { setDarkMode } } = useTheme();
	useEffect(() => {
		setDarkMode(prefersDarkMode);
	}, [prefersDarkMode, setDarkMode]);

	return (
		<ThemeProvider theme={theme(darkMode)}>
			<CssBaseline />
			<TodoContextProvider>
				<MainContainer
					header={<Header />}
					footer={<TodoInsert />}>
					<TodoList />
				</MainContainer>
			</TodoContextProvider>
		</ThemeProvider>
	)
}

export default App;
