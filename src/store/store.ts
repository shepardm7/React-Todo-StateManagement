import {configureStore} from '@reduxjs/toolkit';
import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux';
import {todoSlice} from './todoSlice';
import {themeSlice} from './themeSlice';

export const Store = configureStore({
	reducer: {
		todo: todoSlice.reducer,
		theme: themeSlice.reducer
	}
});

export type RootState = ReturnType<typeof Store.getState>;

export type AppDispatch = typeof Store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
