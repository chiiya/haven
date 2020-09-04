import {
  AnshinOptions,
  MutationsObject,
  Purpose,
  State,
  ConsentStatus,
} from '@anshin/types';

const mutations: MutationsObject<State> = {
  /**
   * Set the initial application state.
   * @param state
   * @param options
   */
  SET_STATE(state, options: AnshinOptions) {
    return {
      ...state,
      ...options,
    };
  },

  /**
   * Set all consent values.
   * @param state
   * @param consents
   */
  SET_CONSENTS(state, consents: ConsentStatus) {
    return {
      ...state,
      consent: consents,
    };
  },

  /**
   * Set consent status for a given purpose.
   * @param state
   * @param purpose
   * @param status
   */
  SET_CONSENT(
    state,
    { purpose, status }: { purpose: Purpose; status: boolean }
  ) {
    return {
      ...state,
      consent: {
        ...state.consent,
        purpose: status,
      },
    };
  },

  /**
   * Set service (by name) as injected.
   * @param state
   * @param service
   */
  SET_INJECTED(state, service: string) {
    return {
      ...state,
      injected: {
        ...state.injected,
        service: true,
      },
    };
  },
};

export default mutations;
