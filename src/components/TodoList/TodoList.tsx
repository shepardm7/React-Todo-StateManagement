import React, { useCallback, useMemo } from 'react';
import { Todo } from '../../App';
import { Checkbox, Grid, List, ListItem, ListItemIcon, ListItemText, makeStyles, Typography } from '@material-ui/core';
import { TreeItem, TreeView } from '@material-ui/lab';
import { ChevronRight, ExpandMore } from '@material-ui/icons';
import moment from 'moment';
import formats from '../../constants/formats';
import { todoActions, todoUtils, useTodo } from '../../store/todoSlice';

const TodoList = React.memo(() => {
  const classes = useStyles();
  const { state: todoState } = useTodo();
  const { filteredTodos, filteredCompletedTodos } = useMemo(() => todoUtils.filteredTodoLists(todoState), [todoState]);
  if (!filteredTodos.length && !filteredCompletedTodos.length) {
    return <div className={classes.emptyList}>Your todo list is empty</div>;
  }

  return (
    <div className={classes.listContainer}>
      <TreeView defaultCollapseIcon={<ExpandMore />} defaultExpandIcon={<ChevronRight />} defaultExpanded={['todo']}>
        {!!filteredTodos.length && (
          <TreeItem nodeId="todo" label={`Todo [${filteredTodos.length}]`}>
            <List>
              {filteredTodos.map((todoItem) => (
                <TodoListItem key={todoItem.id} todo={todoItem} />
              ))}
            </List>
          </TreeItem>
        )}
        {!!filteredCompletedTodos.length && (
          <TreeItem nodeId="completed" label={`Completed [${filteredCompletedTodos.length}]`}>
            <List>
              {filteredCompletedTodos.map((todoItem) => (
                <TodoListItem key={todoItem.id} todo={todoItem} />
              ))}
            </List>
          </TreeItem>
        )}
      </TreeView>
    </div>
  );
});

TodoList.displayName = 'TodoList';

type TodoListItemProps = {
  todo: Todo;
};

const TodoListItem = React.memo(({ todo }: TodoListItemProps) => {
  const classes = useItemStyles(!!todo?.completedOn);
  const {
    state: { idsForDeletion },
    dispatch: dispatchTodo,
  } = useTodo();
  const selectedForDelete = useMemo(() => !!idsForDeletion, [idsForDeletion]);

  const handleOnClick = useCallback(() => {
    if (selectedForDelete) {
      dispatchTodo(todoActions.toggleDeleteIds(todo.id));
    } else {
      dispatchTodo(todoActions.toggleTodoComplete(todo.id));
      // onClick(todo.id);
    }
  }, [dispatchTodo, selectedForDelete, todo.id]);
  return (
    <ListItem button onClick={handleOnClick}>
      {selectedForDelete && (
        <ListItemIcon>
          <Checkbox checked={!!idsForDeletion?.[todo.id]} />
        </ListItemIcon>
      )}
      <ListItemText
        primary={<Typography className={classes.todoText}>{todo.value}</Typography>}
        secondary={
          <Grid container>
            <Grid item className={classes.addedGridItem}>
              <Typography>Added: {moment(todo.addedOn).format(formats.dateTime)}</Typography>
            </Grid>
            {!!todo?.completedOn && (
              <Grid item>
                <Typography>Completed: {moment(todo.completedOn).format(formats.dateTime)}</Typography>
              </Grid>
            )}
          </Grid>
        }
      />
    </ListItem>
  );
});

TodoListItem.displayName = 'TodoListItem';

const useStyles = makeStyles({
  emptyList: {
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '1.2em',
  },
  listContainer: {
    paddingTop: '1rem',
    paddingBottom: '1rem',
  },
});

const useItemStyles = (isCompletedTodo = false) =>
  makeStyles({
    todoText: {
      textDecoration: isCompletedTodo ? 'line-through !important' : 'inherit',
    },
    addedGridItem: {
      marginRight: '2rem',
    },
  })();

export default TodoList;
