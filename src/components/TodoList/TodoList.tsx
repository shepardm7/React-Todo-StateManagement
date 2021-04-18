import React, {useCallback} from 'react';
import {Todo} from '../../App';
import {Checkbox, Grid, List, ListItem, ListItemIcon, ListItemText, makeStyles, Typography} from '@material-ui/core';
import {TreeItem, TreeView} from '@material-ui/lab';
import {ChevronRight, ExpandMore} from '@material-ui/icons';
import moment from 'moment';
import formats from '../../constants/formats';

type TodoListProps = {
	todoList: Todo[];
	completedTodoList: Todo[];
	completeTodo: (id: string) => void;
	unCompleteTodo: (id: string) => void;
	selectedForDelete: Set<string> | null;
	addToDeleteList: (id: string) => void;
}

export default function TodoList({
	                                 todoList,
	                                 completedTodoList,
	                                 completeTodo,
	                                 unCompleteTodo,
	                                 selectedForDelete,
	                                 addToDeleteList
                                 }: TodoListProps) {
	const classes = useStyles();
	if (!todoList.length && !completedTodoList.length) {
		return (
			<div className={classes.emptyList}>Your todo list is empty</div>
		)
	}

	return (
		<div className={classes.listContainer}>
			<TreeView defaultCollapseIcon={<ExpandMore />} defaultExpandIcon={<ChevronRight />} defaultExpanded={['todo']}>
				{!!todoList.length && (
					<TreeItem nodeId="todo" label={`Todo [${todoList.length}]`}>
						<List>
							{todoList.map(todoItem => <TodoListItem key={todoItem.id}
							                                        todo={todoItem}
							                                        onClick={completeTodo}
							                                        selectedForDelete={selectedForDelete}
							                                        addToDeleteList={addToDeleteList} />)}
						</List>
					</TreeItem>)}
				{!!completedTodoList.length && (
					<TreeItem nodeId="completed" label={`Completed [${completedTodoList.length}]`}>
						<List>
							{completedTodoList.map(todoItem => <TodoListItem key={todoItem.id}
							                                                 todo={todoItem}
							                                                 onClick={unCompleteTodo}
							                                                 selectedForDelete={selectedForDelete}
							                                                 addToDeleteList={addToDeleteList} />)}
						</List>
					</TreeItem>
				)}
			</TreeView>
		</div>
	);
};

type TodoListItemProps = {
	todo: Todo;
	onClick: (id: string) => void;
	selectedForDelete: Set<string> | null;
	addToDeleteList: (id: string) => void;
}

function TodoListItem({todo, onClick, selectedForDelete, addToDeleteList}: TodoListItemProps) {
	const classes = useItemStyles(!!todo?.completedOn);
	const handleOnClick = useCallback(() => {
		if (selectedForDelete) {
			addToDeleteList(todo.id);
		} else {
			onClick(todo.id);
		}
	}, [addToDeleteList, onClick, selectedForDelete, todo.id])
	return (
		<ListItem button onClick={handleOnClick}>
			{!!selectedForDelete && (
				<ListItemIcon>
					<Checkbox checked={selectedForDelete?.has(todo.id)} />
				</ListItemIcon>)}
			<ListItemText primary={<Typography className={classes.todoText}>{todo.value}</Typography>} secondary={(
				<Grid container>
					<Grid item className={classes.addedGridItem}>
						<Typography>
							Added: {moment(todo.addedOn).format(formats.dateTime)}
						</Typography>
					</Grid>
					{!!todo?.completedOn && (
						<Grid item>
							<Typography>
								Completed: {moment(todo.completedOn).format(formats.dateTime)}
							</Typography>
						</Grid>
					)}
				</Grid>
			)} />
		</ListItem>
	);
}

const useStyles = makeStyles({
	emptyList: {
		height: '100%',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		fontSize: '1.2em'
	},
	listContainer: {
		paddingTop: '1rem',
		paddingBottom: '1rem'
	}
});

const useItemStyles = (isCompletedTodo = false) => makeStyles({
	todoText: {
		textDecoration: isCompletedTodo ? 'line-through !important' : 'inherit'
	},
	addedGridItem: {
		marginRight: '2rem'
	}
})();
