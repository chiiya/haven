import { HavenOptions, MutationsObject, Purpose, State } from '../types';

const mutations: MutationsObject<State> = {
  /**
   * Set the initial application state.
   * @param state
   * @param options
   */
  SET_INITIAL_STATE(state, options: HavenOptions) {
    for (const key of Object.keys(options)) {
      state[key] = options[key];
    }
    return state;
  },

  /**
   * Set consent status for a given purpose.
   * @param state
   * @param purpose
   * @param status
   */
  SET_CONSENT(state, { purpose, status }: { purpose: Purpose, status: boolean }) {
    state.consent[purpose] = status;
    return state;
  },

  /**
   * Set service (by name) as injected.
   * @param state
   * @param service
   */
  SET_INJECTED(state, service: string) {
    state.injected[service] = true;
    return state;
  }
};

export default mutations;
