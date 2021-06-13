import React, { useState } from 'react';
import { Grid, IconButton, makeStyles, TextField, TextFieldProps } from '@material-ui/core';
import { Add, KeyboardReturn } from '@material-ui/icons';
import { todoActions, useTodo } from '../../store/todoSlice';

export default function TodoInsert(): JSX.Element {
  const classes = useStyles();
  const [inputValue, setInputValue] = useState('');
  const { dispatch: dispatchTodo } = useTodo();

  const handleOnAdd = () => {
    const parsedValue = inputValue.trim();
    if (!parsedValue) return;
    dispatchTodo(todoActions.addToTodoList(parsedValue));
    setInputValue('');
  };

  const handleInputChange: TextFieldProps['onChange'] = ({ target: { value } }) => {
    setInputValue(value);
  };

  const handleOnKeyDown: TextFieldProps['onKeyDown'] = ({ code }) => {
    if (code === 'Enter') {
      handleOnAdd();
    }
  };

  return (
    <div className={classes.todoInsertWrapper}>
      <Grid container spacing={1} alignItems="flex-end">
        <Grid item>
          <Add />
        </Grid>
        <Grid item className={classes.textFieldWrapper}>
          <TextField
            id="input-with-icon-grid"
            label="Add a todo item..."
            variant="standard"
            fullWidth
            value={inputValue}
            autoComplete="off"
            onChange={handleInputChange}
            onKeyDown={handleOnKeyDown}
          />
        </Grid>
        {inputValue.trim() && (
          <Grid item>
            <IconButton aria-label="add" color="primary" onClick={handleOnAdd}>
              <KeyboardReturn />
            </IconButton>
          </Grid>
        )}
      </Grid>
    </div>
  );
}

const useStyles = makeStyles({
  todoInsertWrapper: {
    padding: '1rem',
  },
  textFieldWrapper: {
    flex: 1,
  },
});
