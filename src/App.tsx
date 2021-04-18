import React, {useEffect, useMemo, useState} from 'react';
import {CssBaseline, ThemeProvider, useMediaQuery} from '@material-ui/core';
import theme from './theme';
import Header from './components/Header';
import MainContainer from './components/MainContainer/MainContainer';
import TodoInsert from './components/TodoInsert/TodoInsert';
import TodoList from './components/TodoList/TodoList';
import {useImmer} from 'use-immer';
import {enableMapSet} from 'immer';

enableMapSet();

export type Todo = {
	id: string;
	addedOn: number;
	completedOn?: number;
	value: string;
}

function App() {
	const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
	const [todoList, setTodoList] = useImmer<Todo[]>([]);
	const [completedList, setCompletedList] = useImmer<Todo[]>([]);
	const [useDark, setUseDark] = useState(false);
	const [selectedForDelete, setSelectedForDelete] = useImmer<Set<string> | null>(null);
	const [searchText, setSearchText] = useState('');
	const filteredTodoList = useMemo(() => {
		const parsedSearchText = searchText.trim().toLowerCase();
		return todoList.filter(todoItem => todoItem.value.toLowerCase().includes(parsedSearchText));
	}, [searchText, todoList]);
	const filteredCompletedTodoList = useMemo(() => {
		const parsedSearchText = searchText.trim().toLowerCase();
		return completedList.filter(todoItem => todoItem.value.toLowerCase().includes(parsedSearchText));
	}, [searchText, completedList]);

	useEffect(() => {
		setUseDark(prefersDarkMode);
	}, [prefersDarkMode]);

	const addToTodo = (value: string) => {
		setTodoList(draft => void draft.push({
			id: new Date().getTime().toString(),
			addedOn: new Date().getTime(),
			value
		}));
	}

	const handleTodoComplete = (id: string) => {
		const todo = todoList.find(todoItem => todoItem.id === id);
		if (!todo) return;

		setTodoList(draft => draft.filter(todoItem => todoItem.id !== id));
		setCompletedList(draft => void draft.unshift({...todo, completedOn: new Date().getTime()}));
	}

	const handleUnCompleteTodo = (id: string) => {
		const todo = completedList.find(todoItem => todoItem.id === id);
		if (!todo) return;

		setCompletedList(draft => draft.filter(todoItem => todoItem.id !== id));
		setTodoList(draft => void draft.unshift({...todo, completedOn: undefined}));
	}

	const setDeleteModeHandler = (deleteMode: boolean) => {
		setSelectedForDelete(deleteMode ? new Set<string>() : null);
	}

	const deleteHandler = () => {
		if (!selectedForDelete) return;
		setTodoList(draft => draft.filter(todoItem => !selectedForDelete.has(todoItem.id)));
		setCompletedList(draft => draft.filter(todoItem => !selectedForDelete.has(todoItem.id)));
	}

	const addToDeleteHandler = (id: string) => {
		setSelectedForDelete(draft => {
			if (!draft) return;
			if (draft.has(id)) draft.delete(id);
			else draft.add(id);
		});
	}

	return (
		<ThemeProvider theme={theme(useDark)}>
			<CssBaseline />
			<MainContainer
				header={<Header useDark={useDark}
				                toggleTheme={() => setUseDark(prevState => !prevState)}
				                deleteMode={!!selectedForDelete}
				                setDeleteMode={setDeleteModeHandler}
				                searchText={searchText}
				                setSearchText={setSearchText}
				                onDelete={deleteHandler} />}
				footer={<TodoInsert onAdd={addToTodo} />}>
				<TodoList todoList={filteredTodoList}
				          completedTodoList={filteredCompletedTodoList}
				          completeTodo={handleTodoComplete}
				          unCompleteTodo={handleUnCompleteTodo}
				          addToDeleteList={addToDeleteHandler}
				          selectedForDelete={selectedForDelete} />
			</MainContainer>
		</ThemeProvider>
	);
}

export default App;
