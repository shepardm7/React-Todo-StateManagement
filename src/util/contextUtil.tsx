import React, { createContext, useContext, useMemo } from 'react';
import { NoUndefined } from '../types/util';
import { Draft } from 'immer';
import { useImmerReducer } from 'use-immer';

type GenericState = Record<string, any>;

type Actions<State extends GenericState, TKey extends string, TPayloadMap extends { [Key in TKey]?: any }> = {
  [Key in keyof TPayloadMap]: undefined extends Key
    ? (state: Draft<State>) => void | State
    : (state: Draft<State>, params: TPayloadMap[Key]) => void | State;
};

export const createContextWith = <
  State extends GenericState,
  TKey extends string,
  TPayloadMap extends { [Key in TKey]?: any },
>(
  initialState: State,
  actions: Actions<State, TKey, TPayloadMap>,
) => {
  type ConvertedActions = {
    [_key in keyof typeof actions]: Parameters<typeof actions[_key]>[1] extends NoUndefined
      ? (arg: Parameters<typeof actions[_key]>[1]) => { type: _key; payload: typeof arg }
      : (arg?: Parameters<typeof actions[_key]>[1]) => { type: _key; payload: typeof arg };
  };

  type ActionDispatchers = {
    [_key in keyof typeof actions]: Parameters<typeof actions[_key]>[1] extends NoUndefined
      ? (arg: Parameters<typeof actions[_key]>[1]) => void
      : (arg?: Parameters<typeof actions[_key]>[1]) => void;
  };

  const Context = createContext<{
    state: State;
    dispatch: React.Dispatch<ReturnType<ConvertedActions[keyof ConvertedActions]>>;
    dispatchers: ActionDispatchers;
  }>({} as any);

  const convertedActions: ConvertedActions = Object.keys(actions).reduce((acc, _key) => {
    const key = _key as keyof typeof actions;
    const fn = actions[key];
    return Object.assign(acc, {
      [key]: (arg?: Parameters<typeof fn>[1]) => ({ type: key, payload: arg }),
    });
  }, {}) as ConvertedActions;

  const reducer = (draft: Draft<State>, action: { type: keyof typeof actions; payload: any }) =>
    actions[action.type](draft, action.payload as any);

  const ContextProvider: React.FC<{ initialState?: Partial<State> }> = (props) => {
    const [state, dispatch] = useImmerReducer(reducer, { ...initialState, ...props.initialState } as State);

    const dispatchers: ActionDispatchers = useMemo(
      () =>
        Object.keys(actions).reduce((acc, _key) => {
          const key = _key as keyof typeof actions;
          const fn = actions[key];
          return Object.assign(acc, {
            [key]: (arg?: Parameters<typeof fn>[1]) => dispatch({ type: key, payload: arg }),
          });
        }, {}) as ActionDispatchers,
      [dispatch],
    );

    return <Context.Provider value={{ state, dispatch, dispatchers }}>{props.children}</Context.Provider>;
  };

  const useStoreContext = () => {
    return useContext(Context);
  };

  return { ContextProvider, Context, useStoreContext, actions: convertedActions };
};
