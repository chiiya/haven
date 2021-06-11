import { AnshinActions, AnshinState } from '@anshin/types';
import EventBus from '../events';
import { store } from './store';
import gettersModule from './getters';
import actionsModule from './actions';

const state: AnshinState = {
  consent: store({}),
  injected: store({}),
  options: {
    prefix: 'cookies',
    cookieAttributes: { expires: 395 },
    domains: [],
    cookies: {},
    type: 'opt-in',
    services: [],
    plugins: [],
  },
};

const getters = gettersModule(state);
const actions = actionsModule(state, getters);

const commit = (action: keyof AnshinActions, data: any = {}) => {
  actions[action](data);
  EventBus.emit('state-updated');
};

export { state, getters, commit };
