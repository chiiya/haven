import {
  AnshinActions,
  AnshinGetters,
  AnshinOptions,
  AnshinService,
  AnshinState,
  ConsentDTO,
  ConsentStatus,
  Purpose,
} from '@anshin/types';
import Cookies from '../cookies';
import EventBus from '../events';
import { resolveConfig } from '../config';

type AnshinActionsModule = (state: AnshinState, getters: AnshinGetters) => AnshinActions;

const module: AnshinActionsModule = (state: AnshinState, getters: AnshinGetters) => {
  const actions = {
    /**
     * Set state options.
     * @param options
     */
    SET_OPTIONS: (options: AnshinOptions) => {
      state.options = options;
    },

    /**
     * Set consent status for a given purpose. Will update the state, set cookies and
     * dispatch necessary events.
     */
    SET_CONSENT: ({ purpose, status }: ConsentDTO) => {
      state.consent.set({
        ...state.consent.get(),
        [purpose]: status,
      });
      if (status) {
        Cookies.set(`${state.options.prefix}-${purpose}`, 'true', state.options.cookieAttributes);
        EventBus.emit(`${purpose}-enabled`);
      } else {
        Cookies.set(`${state.options.prefix}-${purpose}`, 'false', state.options.cookieAttributes);
        EventBus.emit(`${purpose}-disabled`);
      }
      if (getters.HAS_ALL_COOKIES_SET()) {
        EventBus.emit('cookies-set');
      }
      EventBus.emit('consent-updated');
    },

    /**
     * Set all initial consent values. Does _not_ set any cookies. Use SET_CONSENT on individual purposes
     * to set cookies.
     */
    SET_INITIAL_CONSENT_VALUES: (consents: ConsentStatus) => {
      for (const purpose of Object.keys(consents)) {
        const consent = consents[purpose];
        if (consent === true) {
          EventBus.emit(`${purpose}-enabled`);
        } else if (consent === false) {
          EventBus.emit(`${purpose}-disabled`);
        }
      }

      if (getters.HAS_ALL_COOKIES_SET()) {
        EventBus.emit('cookies-set');
      }

      state.consent.set(consents);
      EventBus.emit('consent-updated');
    },

    /**
     * Enable cookies for all purposes.
     */
    ENABLE_ALL_COOKIES: () => {
      const purposes: Purpose[] = ['functional', ...getters.GET_PURPOSES()];
      purposes.map((purpose) => actions.SET_CONSENT({ purpose, status: true }));
    },

    /**
     * Disable cookies for all purposes (except functional).
     */
    DISABLE_ALL_COOKIES: () => {
      const purposes: Purpose[] = getters
        .GET_PURPOSES()
        .filter((purpose) => purpose !== 'functional');
      purposes.map((purpose) => actions.SET_CONSENT({ purpose, status: false }));
      actions.SET_CONSENT({ purpose: 'functional', status: true });
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

    /**
     * Remove all cookies set by services for a given purpose.
     */
    REMOVE_COOKIES_FOR_PURPOSE: (purpose: Purpose) => {
      for (const service of state.options.services) {
        if (service.purposes.indexOf(purpose) !== -1) {
          removeCookies(service.cookies || [], state.options.domains);
        }
      }
      // Remove user specified cookies across all domains as well.
      const cookies = state.options.cookies;
      if (cookies && cookies[purpose]) {
        removeCookies(cookies[purpose], state.options.domains);
      }
    },
  };

  return actions;
};

/**
 * Inject a specific service, if all requirements are met (cookies accepted _or_ service is required).
 */
function injectService(service: AnshinService): boolean {
  const injector = service.inject;

  if (injector !== undefined && !(injector === true || injector === false)) {
    injector(service.options || {});
    return true;
  }

  return false;
}

/**
 * Remove a list of cookies from all configured domains.
 */
function removeCookies(cookies: (string | RegExp)[], domains: string[]): void {
  for (const cookie of cookies) {
    for (const domain of domains) {
      Cookies.remove(cookie, { domain });
    }
    Cookies.remove(cookie);
  }
}

export default module;
