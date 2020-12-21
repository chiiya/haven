import {
  AnshinActions,
  AnshinGetters,
  AnshinOptions,
  AnshinService,
  AnshinState,
  Purpose,
} from '@anshin/types';
import Cookies from '../cookies';
import EventBus from '../events/event-bus';
import ConfigurationResolver from '../config/configuration-resolver';

type AnshinActionsModule = (state: AnshinState, getters: AnshinGetters) => AnshinActions;

const module: AnshinActionsModule = (state: AnshinState, getters: AnshinGetters) => {
  const actions = {
    /**
     * Resolve configuration and set initial options state.
     * @param options
     */
    RESOLVE_CONFIG: (options: Partial<AnshinOptions>) => {
      state.options = ConfigurationResolver.resolve(options, {
        ...state.options,
      });
    },

    /**
     * Set all initial consent values, based on currently set cookies. Does _not_ set
     * any new cookies. It is used at page-load to set initial consent state and dispatch
     * consent events even though the values have not technically changed.
     */
    SET_INITIAL_CONSENT_VALUES: () => {
      const purposes: Purpose[] = ['functional', ...getters.GET_PURPOSES()];
      const consent = purposes.map((purpose) =>
        getters.HAS_COOKIES_SET(purpose)
          ? [purpose, getters.HAS_COOKIES_ENABLED(purpose)]
          : [purpose, null]
      );
      // Dispatch initial events
      consent.map(([purpose, status]) => {
        if (status === true) {
          EventBus.emit(`${purpose}-enabled`);
        } else if (status === false) {
          EventBus.emit(`${purpose}-disabled`);
        }
      });
      state.consent.set(Object.fromEntries(consent));
    },

    /**
     * Sync cookies with current consent state. Executed every time the consent state changes.
     */
    SYNC_CONSENT_STATUS: () => {
      const consent = state.consent.get();
      Object.keys(consent).map((purpose) => {
        if (consent[purpose] === true && !getters.HAS_COOKIES_ENABLED(purpose)) {
          actions.SET_COOKIE_VALUE({ purpose, value: 'true' });
          EventBus.emit(`${purpose}-enabled`);
        } else if (consent[purpose] === false && !getters.HAS_COOKIES_DISABLED(purpose)) {
          actions.SET_COOKIE_VALUE({ purpose, value: 'false' });
          EventBus.emit(`${purpose}-disabled`);
        }
      });
      if (getters.HAS_ALL_COOKIES_SET()) {
        EventBus.emit('cookies-set');
      }
      EventBus.emit('consent-updated');
    },

    /**
     * Enable cookies for all purposes.
     */
    ENABLE_ALL_COOKIES: () => {
      const purposes: Purpose[] = ['functional', ...getters.GET_PURPOSES()];
      state.consent.set(Object.fromEntries(purposes.map((purpose) => [purpose, true])));
    },

    /**
     * Disable cookies for all purposes (except functional).
     */
    DISABLE_ALL_COOKIES: () => {
      const purposes: Purpose[] = getters.GET_PURPOSES();
      state.consent.set({
        ...Object.fromEntries(purposes.map((purpose) => [purpose, false])),
        functional: true,
      });
    },

    /**
     * Inject all registered services that can be injected.
     */
    INJECT_SERVICES: () => {
      for (const service of state.options.services || []) {
        actions.INJECT_SERVICE(service);
      }
    },

    /**
     * Inject a given service, when possible.
     * @param service
     */
    INJECT_SERVICE: (service: AnshinService) => {
      const injected = state.injected.get();
      // Only inject service if it fulfills all requirement and hasn't already been injected before
      if (
        injected[service.name] ||
        service.inject === false ||
        (!service.required && !getters.HAS_ALL_NECESSARY_COOKIES_ENABLED(service.purposes))
      ) {
        return;
      }

      if (injectService(service)) {
        state.injected.set({
          ...state.injected.get(),
          [service.name]: true,
        });
        EventBus.emit('service-loaded', service.name);
      }
    },

    SET_COOKIE_VALUE: ({ purpose, value }: { purpose: Purpose; value: string }) => {
      Cookies.set(`${state.options.prefix}-${purpose}`, value, state.options.cookieAttributes);
    },
  };

  return actions;
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

export default module;
