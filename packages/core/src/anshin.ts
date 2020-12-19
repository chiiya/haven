import { AnshinOptions, ConsentStatus, AnshinStore, EventBusSubscription } from '@anshin/types';
import { state, getters, commit } from './store';
import Cookies from './cookies';
import EventBus from './events/event-bus';
import { ConsentRevoke, GoogleAnalytics } from './services';

declare global {
  interface Window {
    dataLayer: any[];
    ga: any;
    fbq: Function;
    _fbq: Function;
    Anshin: typeof Anshin;
    Cookies: typeof Cookies;
  }
}

export default class Anshin {
  public static GoogleAnalytics = GoogleAnalytics;
  private static instance: Anshin;

  private constructor(options: Partial<AnshinOptions>) {
    commit('RESOLVE_CONFIG', options);
    for (const plugin of options.plugins || []) {
      if (plugin.register) {
        plugin.register({
          store: { state, getters, commit },
          events: EventBus,
        });
      }
    }
  }

  public init(): void {
    this.registerDefaultListeners();
    this.checkInitialState();
  }

  /**
   * Register some default listeners for injecting services and removing cookies.
   */
  protected registerDefaultListeners(): void {
    const purposes = getters.GET_PURPOSES();
    for (const purpose of purposes) {
      EventBus.on(`${purpose}-enabled`, () => {
        commit('INJECT_SERVICES');
      });
      EventBus.on(`${purpose}-disabled`, () => {
        ConsentRevoke.removeCookiesForPurpose(purpose);
      });
    }
  }

  /**
   * Check initial application state and fire events accordingly.
   */
  protected checkInitialState(): void {
    const purposes = ['functional', ...getters.GET_PURPOSES()];
    const consents: ConsentStatus = {};

    for (const purpose of purposes) {
      consents[purpose] = getters.HAS_COOKIES_SET(purpose)
        ? getters.HAS_COOKIES_ENABLED(purpose)
        : null;
    }

    commit('SET_INITIAL_CONSENT_VALUES', consents);
  }

  /**
   * Proxy event bus subscription method to the event bus singleton so that users can call this method
   * anywhere in their application.
   * @param event
   * @param callback
   */
  public static on(event: string, callback: Function): EventBusSubscription {
    return EventBus.on(event, callback);
  }

  /**
   * Get access to the store.
   */
  public static store(): AnshinStore {
    return { state, getters, commit };
  }

  public static create(options: Partial<AnshinOptions>): Anshin {
    if (Anshin.instance) {
      console.warn(
        'Replacing an existing Anshin instance. Are you sure this behaviour is intended?'
      );
    }
    Anshin.instance = new Anshin(options);
    Anshin.instance.init();
    return Anshin.instance;
  }

  public static getInstance(): Anshin | undefined {
    if (Anshin.instance) {
      return Anshin.instance;
    }
    console.error(
      'No Anshin instance found. Make sure to create a Anshin instance before attempting to access it.'
    );
  }
}
