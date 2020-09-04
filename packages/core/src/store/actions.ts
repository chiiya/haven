import {
  ActionsContext,
  ActionsObject,
  AnshinOptions, AnshinPlugin,
  AnshinService,
  Purpose,
  State,
} from '@anshin/types';
import Cookies from '../cookies/cookies';
import EventBus from '../events/event-bus';
import ServiceLoader from '../services/service-loader';
import ConfigurationResolver from '../config/configuration-resolver';

interface ConfigResolveOptions {
  options: Partial<AnshinOptions>;
  plugins: AnshinPlugin[];
}

const actions: ActionsObject<ActionsContext<State>> = {
  /**
   * Resolve configuration and set initial state.
   * @param state
   * @param commit
   * @param options
   * @param plugins
   * @constructor
   */
  RESOLVE_CONFIG({ state, commit }, { options, plugins }: ConfigResolveOptions) {
    const config = ConfigurationResolver.resolve(options, plugins, { ...state });
    commit('SET_STATE', config);
  },

  /**
   * Set consent status for a given purpose. Will update the state, set cookies and
   * dispatch necessary events.
   * @param state
   * @param commit
   * @param consent
   * @constructor
   */
  SET_CONSENT(
    { state, commit },
    consent: { purpose: Purpose; status: boolean }
  ) {
    commit('SET_CONSENT', consent);
    const { purpose, status } = consent;
    if (status) {
      Cookies.set(`${state.prefix}-${purpose}`, 'true', state.cookieAttributes);
      EventBus.emit(`${purpose}-enabled`);
    } else {
      Cookies.set(`${state.prefix}-${purpose}`, 'false', state.cookieAttributes);
      EventBus.emit(`${purpose}-disabled`);
    }
  },

  /**
   * Enable cookies for all purposes.
   * @param getters
   * @param commit
   */
  ENABLE_ALL_COOKIES({ getters, dispatch }) {
    const purposes: Purpose[] = ['functional', ...getters.GET_PURPOSES];
    purposes.map(purpose => dispatch('SET_CONSENT', { purpose, status: true }));
    EventBus.emit('cookies-set');
  },

  /**
   * Disable cookies for all purposes (except functional).
   * @param getters
   * @param dispatch
   */
  DISABLE_ALL_COOKIES({ getters, dispatch }) {
    const purposes: Purpose[] = getters.GET_PURPOSES;
    purposes.map(purpose =>
      dispatch('SET_CONSENT', { purpose, status: false })
    );
    dispatch('SET_CONSENT', { purpose: 'functional', status: true });
    EventBus.emit('cookies-set');
  },

  /**
   * Inject all registered services that can be injected.
   * @param state
   * @param dispatch
   */
  INJECT_SERVICES({ state, dispatch }) {
    for (const service of state.services || []) {
      dispatch('INJECT_SERVICE', service);
    }
  },

  /**
   * Inject a given service, when possible.
   * @param state
   * @param getters
   * @param commit
   * @param service
   */
  INJECT_SERVICE({ state, getters, commit }, service: AnshinService) {
    // Only inject service if it fulfills all requirement and hasn't already been injected before
    if (
      state.injected[service.name] ||
      service.inject === false ||
      (!service.required &&
        !getters.HAS_ALL_NECESSARY_COOKIES_ENABLED(service.purposes))
    ) {
      return;
    }

    if (ServiceLoader.injectService(service)) {
      commit('SET_INJECTED', service.name);
      EventBus.emit('service-loaded', service.name);
    }
  },
};

export default actions;
