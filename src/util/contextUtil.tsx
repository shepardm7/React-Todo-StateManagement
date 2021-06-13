import React, { createContext, useContext, useEffect, useMemo, useRef } from 'react';
import { NoUndefined } from '../types/util';
import { Draft } from 'immer';
import { useImmer } from 'use-immer';

type GenericState = Record<string, any>;
type GenericAction = Record<string, (...arg: any) => any>;

type StateAndAction<State extends GenericState, Action extends GenericAction> = {
  state: State;
  action: Action;
};

type Actions<State extends GenericState, TKey extends string, TPayloadMap extends { [Key in TKey]?: any }> = {
  [Key in keyof TPayloadMap]: undefined extends Key
    ? (state: Draft<State>) => void
    : (state: Draft<State>, params: TPayloadMap[Key]) => void;
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
    [_key in keyof TPayloadMap]: Parameters<typeof actions[_key]>[1] extends NoUndefined
      ? (arg: Parameters<typeof actions[_key]>[1]) => void
      : () => void;
  };

  const Context = createContext<StateAndAction<State, ConvertedActions>>({} as any);

  const ContextProvider: React.FC<{ initialState?: State }> = (props) => {
    const [state, setState] = useImmer({
      ...initialState,
      ...props.initialState,
    } as State);

    const stateRef = useRef(state);

    useEffect(() => {
      stateRef.current = state;
    }, [state]);

    const action = useMemo(() => {
      return Object.keys(actions).reduce((acc, key) => {
        const fn = actions[key as TKey];
        return Object.assign(acc, {
          [key]: (arg?: Parameters<typeof fn>[1]) => setState((d) => fn(d as Draft<State>, arg as any)),
        });
      }, {}) as ConvertedActions;
    }, [setState]);

    return <Context.Provider value={{ state, action }}>{props.children}</Context.Provider>;
  };

  const useStoreContext = () => {
    return useContext(Context);
  };

  return { ContextProvider, Context, useStoreContext };
};
