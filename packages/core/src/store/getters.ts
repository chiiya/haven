import { AnshinGetters, AnshinState, Purpose } from '@anshin/types';
import Cookies from '../cookies';

type AnshinGettersModule = (state: AnshinState) => AnshinGetters;

const getters: AnshinGettersModule = (state) => {
  const module = {
    /**
     * Get all purposes used within the application.
     */
    GET_PURPOSES: () => {
      const userDefinedPurposes = state.options.purposes;
      if (userDefinedPurposes !== undefined) {
        return userDefinedPurposes;
      }

      const purposes = (state.options.services || [])
        .map(service => service.purposes || [])
        .flat();
      return [...new Set(purposes)];
    },

    /**
     * Check whether cookies for all purposes have been set, regardless of whether they have been
     * accepted or not.
     */
    HAS_ALL_COOKIES_SET: () => {
      const purposes: Purpose[] = ['functional', ...module.GET_PURPOSES()];
      for (const purpose of purposes) {
        if (!Cookies.exists(`${state.options.prefix}-${purpose}`)) {
          return false;
        }
      }

      return true;
    },

    /**
     * Check whether cookies for a given purpose have been enabled.
     */
    HAS_COOKIES_ENABLED: (purpose: Purpose) => {
      const cookie = Cookies.get(`${state.options.prefix}-${purpose}`);

      if (state.options.type === 'opt-in') {
        return cookie === 'true';
      }

      return cookie === undefined || cookie === 'true';
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
