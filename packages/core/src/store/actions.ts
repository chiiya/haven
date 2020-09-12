import {
  AnshinActions,
  AnshinOptions,
  AnshinService,
  AnshinStore,
  ConsentDTO,
  ConsentStatus,
  Purpose
} from '@anshin/types';
import Cookies from '../cookies';
import EventBus from '../events/event-bus';
import ConfigurationResolver from '../config/configuration-resolver';

type AnshinActionsModule = (set: (fn: (state: AnshinStore) => void) => void) => AnshinActions;

const actions: AnshinActionsModule = (set: (fn: (state: AnshinStore) => void) => void) => {
  return {
    /**
     * Resolve configuration and set initial options state.
     * @param options
     */
    RESOLVE_CONFIG: (options: Partial<AnshinOptions>) => set(state => {
      state.options = ConfigurationResolver.resolve(options, { ...state.options });
    }),

    /**
     * Set consent status for a given purpose. Will update the state, set cookies and
     * dispatch necessary events.
     * @param consent
     */
    SET_CONSENT: ({ purpose, status }: ConsentDTO) => set((state) => {
      state.consent = {
        ...state.consent,
        [purpose]: status,
      };
      if (status) {
        Cookies.set(`${state.options.prefix}-${purpose}`, 'true', state.options.cookieAttributes);
        EventBus.emit(`${purpose}-enabled`);
      } else {
        Cookies.set(`${state.options.prefix}-${purpose}`, 'false', state.options.cookieAttributes);
        EventBus.emit(`${purpose}-disabled`);
      }
      if (state.getters.HAS_ALL_COOKIES_SET()) {
        EventBus.emit('cookies-set');
      }
    }),

    /**
     * Set all initial consent values. Does _not_ set any cookies. Use SET_CONSENT on individual purposes
     * to set cookies.
     * @param consents
     */
    SET_INITIAL_CONSENT_VALUES: (consents: ConsentStatus) => set(state => {
      for (const purpose of Object.keys(consents)) {
        const consent = consents[purpose];
        if (consent) {
          EventBus.emit(`${purpose}-enabled`);
        } else {
          EventBus.emit(`${purpose}-disabled`);
        }
      }

      if (state.getters.HAS_ALL_COOKIES_SET()) {
        EventBus.emit('cookies-set');
      }

      state.consent = consents;
    }),

    /**
     * Enable cookies for all purposes.
     */
    ENABLE_ALL_COOKIES: () => set(state => {
      const purposes: Purpose[] = ['functional', ...state.getters.GET_PURPOSES()];
      purposes.map(purpose => state.actions.SET_CONSENT({ purpose, status: true }));
      EventBus.emit('cookies-set');
    }),

    /**
     * Disable cookies for all purposes (except functional).
     */
    DISABLE_ALL_COOKIES: () => set(state => {
      const purposes: Purpose[] = state.getters.GET_PURPOSES();
      purposes.map(purpose => state.actions.SET_CONSENT({ purpose, status: false }));
      state.actions.SET_CONSENT({ purpose: 'functional', status: true });
      EventBus.emit('cookies-set');
    }),

    /**
     * Inject all registered services that can be injected.
     */
    INJECT_SERVICES: () => set(state => {
      for (const service of state.options.services || []) {
        state.actions.INJECT_SERVICE(service);
      }
    }),

    /**
     * Inject a given service, when possible.
     * @param service
     */
    INJECT_SERVICE: (service: AnshinService) => set(state => {
      // Only inject service if it fulfills all requirement and hasn't already been injected before
      if (
        state.injected[service.name] ||
        service.inject === false ||
        (!service.required &&
          !state.getters.HAS_ALL_NECESSARY_COOKIES_ENABLED(service.purposes))
      ) {
        return;
      }

      if (injectService(service)) {
        state.injected[service.name] = true;
        EventBus.emit('service-loaded', service.name);
      }
    }),

    SHOW_NOTIFICATION: () => set(state => {
      state.showNotification = true;
    }),

    HIDE_NOTIFICATION: () => set(state => {
      state.showNotification = false;
    }),

    SHOW_PREFERENCES: () => set(state => {
      state.showPreferences = true;
    }),

    HIDE_PREFERENCES: () => set(state => {
      state.showPreferences = false;
    }),
  }
};

/**
 * Inject a specific service, if all requirements are met (cookies accepted _or_ service is required).
 * @param service
 */
function injectService(service: AnshinService): boolean {
  const injector = service.inject;

  if (injector !== undefined && !(injector === true || injector === false)) {
    injector(service.options || {});
    return true;
  }

  return false;
}

export default actions;
