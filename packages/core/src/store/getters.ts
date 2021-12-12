import { AnshinGetters, AnshinState, Purpose } from '@anshin/types';
import Cookies from '../cookies';

const getters = (state: AnshinState): AnshinGetters => {
  const module: AnshinGetters = {
    /**
     * Get all purposes used within the application.
     */
    GET_PURPOSES: () => {
      const userDefinedPurposes = state.options.purposes;
      if (userDefinedPurposes !== undefined) {
        return userDefinedPurposes;
      }

      const purposes = (state.options.services || [])
        .map((service) => service.purposes || [])
        .flat();
      return [...new Set(purposes)];
    },

    /**
     * Check whether consent for all purposes has been set, regardless of whether they have been
     * accepted or not.
     */
    HAS_ALL_COOKIES_SET: () => {
      return ! Object.values(state.consent.get()).some((status) => status === null)
    },

    /**
     * Check whether cookies for the given purpose have been set.
     */
    HAS_COOKIES_SET: (purpose: Purpose) => {
      return Cookies.exists(`${state.options.prefix}-${purpose}`);
    },

    /**
     * Check whether cookies for a given purpose have been enabled.
     */
    HAS_COOKIES_ENABLED: (purpose: Purpose) => {
      const cookie = Cookies.get(`${state.options.prefix}-${purpose}`);

      return cookie === 'true';
    },

    /**
     * Check whether cookies for a given purpose have been disabled.
     */
    HAS_COOKIES_DISABLED: (purpose: Purpose) => {
      const cookie = Cookies.get(`${state.options.prefix}-${purpose}`);

      return cookie === 'false';
    },

    /**
     * Check whether cookies for _all_ given purposes have been enabled.
     */
    HAS_ALL_NECESSARY_COOKIES_ENABLED: (purposes: Purpose[] = []) => {
      for (const purpose of purposes) {
        if (!module.HAS_COOKIES_ENABLED(purpose)) {
          return false;
        }
      }

      return true;
    },
  };

  return module;
};

export default getters;
