import { createContextWith } from "../util/contextUtil";

export type Todo = {
	id: string;
	addedOn: number;
	completedOn?: number;
	value: string;
}

interface TodoState {
	todos: Todo[];
	completedTodos: Todo[];
	idsForDeletion: Record<string, boolean> | null;
	searchText: string;
}

const initialState: TodoState = {
	todos: [],
	completedTodos: [],
	idsForDeletion: null,
	searchText: ''
};

export const { ContextProvider: TodoContextProvider, useStoreContext: useTodo } = createContextWith(initialState, {
	addToTodoList(state, value: string) {
		state.todos.unshift({
			id: new Date().getTime().toString(),
			addedOn: new Date().getTime(),
			value
		});
	},
	toggleTodoComplete(state, id: string) {
		let selectedTodo = state.todos.find(todo => todo.id === id);
		let fromKey: 'todos' | 'completedTodos' = 'todos';
		let toKey: 'todos' | 'completedTodos' = 'completedTodos';
		if (!selectedTodo) {
			selectedTodo = state.completedTodos.find(todo => todo.id === id);
			fromKey = 'completedTodos';
			toKey = 'todos';
		}
		if (!selectedTodo) return;
		state[toKey].unshift({ ...selectedTodo, ...(toKey === 'todos' ? { completedOn: undefined } : { completedOn: new Date().getTime() }) });
		state[fromKey] = state[fromKey].filter(todo => todo.id !== id);
	},
	setIdsForDeletion(state, deleteMode: boolean) {
		state.idsForDeletion = deleteMode ? {} : null;
	},
	toggleDeleteIds(state, id: string) {
		if (!state.idsForDeletion) return;
		if (state.idsForDeletion[id]) delete state.idsForDeletion[id];
		else state.idsForDeletion[id] = true;
	},
	deleteAllSelected(state) {
		if (!state.idsForDeletion) return;
		const filter = (todo: Todo) => !state.idsForDeletion![todo.id];
		state.todos = state.todos.filter(filter);
		state.completedTodos = state.completedTodos.filter(filter);
	},
	setSearchText(state, text: string) {
		state.searchText = text;
	},
});

export const todoUtils = {
	filteredTodoLists: (todo: TodoState) => {
		const parsedSearchText = todo.searchText.trim().toLowerCase();
		const filter = (todoItem: Todo) => todoItem.value.includes(parsedSearchText);
		return {
			filteredTodos: todo.todos.filter(filter),
			filteredCompletedTodos: todo.completedTodos.filter(filter)
		}
	}
}
