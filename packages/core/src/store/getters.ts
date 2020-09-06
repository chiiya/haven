import { AnshinGetters, AnshinStore, Purpose } from '@anshin/types';
import Cookies from '../cookies';
import { GetState } from 'zustand';

type AnshinGettersModule = (get: GetState<AnshinStore>) => AnshinGetters;

const getters: AnshinGettersModule = (get) => {
  return {
    /**
     * Get all purposes used within the application.
     */
    GET_PURPOSES: () => {
      const userDefinedPurposes = get().options.purposes;
      if (userDefinedPurposes !== undefined) {
        return userDefinedPurposes;
      }

      const purposes = (get().options.services || [])
        .map(service => service.purposes || [])
        .flat();
      return [...new Set(purposes)];
    },

    /**
     * Check whether cookies for all purposes have been set, regardless of whether they have been
     * accepted or not.
     */
    HAS_ALL_COOKIES_SET: () => {
      const purposes: Purpose[] = ['functional', ...get().getters.GET_PURPOSES()];
      for (const purpose of purposes) {
        if (!Cookies.exists(`${get().options.prefix}-${purpose}`)) {
          return false;
        }
      }

      return true;
    },

    /**
     * Check whether cookies for a given purpose have been enabled.
     */
    HAS_COOKIES_ENABLED: (purpose: Purpose) => {
      const cookie = Cookies.get(`${get().options.prefix}-${purpose}`);

      if (get().options.type === 'opt-in') {
        return cookie === 'true';
      }

      return cookie === undefined || cookie === 'true';
    },

    /**
     * Check whether cookies for _all_ given purposes have been enabled.
     */
    HAS_ALL_NECESSARY_COOKIES_ENABLED: (purposes: Purpose[] = []) => {
      for (const purpose of purposes) {
        if (!get().getters.HAS_COOKIES_ENABLED(purpose)) {
          return false;
        }
      }

      return true;
    },
  }
};

export default getters;
