import { GettersObject, Purpose, State } from '@anshin/types';
import Cookies from '../cookies/cookies';

const getters: GettersObject<State> = {
  /**
   * Get all purposes used within the application.
   * @param state
   */
  GET_PURPOSES(state: State): Purpose[] {
    if (state.purposes !== undefined) {
      return state.purposes;
    }
    const purposes = (state.services || [])
      .map(service => service.purposes || [])
      .flat();
    return [...new Set(purposes)];
  },

  /**
   * Check whether cookies for all purposes have been set, regardless of whether they have been
   * accepted or not.
   * @param state
   * @param getters
   */
  HAS_ALL_COOKIES_SET(state: State, getters) {
    const purposes: Purpose[] = ['functional', ...getters.GET_PURPOSES];
    for (const purpose of purposes) {
      if (!Cookies.exists(`${state.prefix}-${purpose}`)) {
        return false;
      }
    }

    return true;
  },

  /**
   * Check whether cookies for a given purpose have been enabled.
   * @param state
   */
  HAS_COOKIES_ENABLED(state: State) {
    return (purpose: Purpose): boolean => {
      const cookie = Cookies.get(`${state.prefix}-${purpose}`);

      if (state.type === 'opt-in') {
        return cookie === 'true';
      }

      return cookie === undefined || cookie === 'true';
    };
  },

  /**
   * Check whether cookies for _all_ given purposes have been enabled.
   * @param state
   * @param getters
   */
  HAS_ALL_NECESSARY_COOKIES_ENABLED(state: State, getters) {
    return (purposes: Purpose[] = []): boolean => {
      for (const purpose of purposes) {
        if (!getters.HAS_COOKIES_ENABLED(purpose)) {
          return false;
        }
      }

      return true;
    };
  },
};

export default getters;
