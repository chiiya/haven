import produce from 'immer';
import create from 'zustand/vanilla';
import { State, StateCreator } from 'zustand';
import { AnshinActions, AnshinStore } from '@anshin/types';
import getters from './getters';
import actions from './actions';

const immer = <T extends State>(
  config: StateCreator<T, (fn: (state: T) => void) => void>
): StateCreator<T> => (set, get, api) => config(
  (fn) => set(produce(fn) as (state: T) => T),
  get,
  api
);

const store = create<AnshinStore>(
  immer((set, get) => ({
    consent: {},
    injected: {},
    showNotification: false,
    showPreferences: false,
    options: {
      prefix: 'cookies',
      cookieAttributes: { expires: 395 },
      domains: [],
      cookies: {},
      type: 'opt-in',
      services: [],
      plugins: [],
    },
    getters: getters(get),
    actions: actions(set),
  }))
);

const setState = (fn: (state: AnshinStore) => void) => store.setState(produce(fn));
const commit = (action: keyof AnshinActions, data: any = {}) => store.getState().actions[action](data);

export {
  store,
  setState,
  commit,
}
