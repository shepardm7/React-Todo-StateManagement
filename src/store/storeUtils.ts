import pick from 'lodash.pick';
import {RootState} from './store';

export const getStateOf = <StateKey extends keyof RootState, Key extends keyof RootState[StateKey]>(
	stateKey: StateKey, ...keys: Key[]
) => (rootState: RootState) => pick(rootState[stateKey], keys);

export const getSelector = <StateKey extends keyof RootState>(
	stateKey: StateKey
) => <KeyType extends keyof RootState[StateKey]>(...keys: KeyType[]) => getStateOf(stateKey, ...keys);
