import { AnshinOptions, ConsentStatus, AnshinStore } from '@anshin/types';
import store from './store';
import EventBus, { EventBusSubscription } from './events/event-bus';
import { ConsentRevoke, FacebookPixel, GoogleAnalytics, GoogleTagManager } from './services';
import { StoreApi } from 'zustand';

declare global {
  interface Window {
    dataLayer: any[];
    ga: any;
    fbq: Function;
    _fbq: Function;
    Anshin: typeof Anshin;
  }
}

export default class Anshin {
  public static FacebookPixel = FacebookPixel;
  public static GoogleAnalytics = GoogleAnalytics;
  public static GoogleTagManager = GoogleTagManager;
  private static instance: Anshin;

  private constructor(options: Partial<AnshinOptions>) {
    for (const plugin of options.plugins || []) {
      if (plugin.register) {
        plugin.register();
      }
    }

    store.getState().actions.RESOLVE_CONFIG(options);
  }

  public init(): void {
    this.registerDefaultListeners();
    this.checkInitialState();

    if (/complete|interactive|loaded/.test(document.readyState)) {
      EventBus.emit('dom-loaded');
    } else {
      document.addEventListener('DOMContentLoaded', () => {
        EventBus.emit('dom-loaded');
      });
    }
  }

  /**
   * Check initial application state and fire events accordingly.
   */
  protected checkInitialState(): void {
    const purposes = store.getState().getters.GET_PURPOSES();
    const consents: ConsentStatus = {};

    for (const purpose of purposes) {
      consents[purpose] = store.getState().getters.HAS_COOKIES_ENABLED(purpose);
    }

    store.getState().actions.SET_INITIAL_CONSENT_VALUES(consents);
  }

  /**
   * Register some default listeners for injecting services and removing cookies.
   */
  protected registerDefaultListeners(): void {
    const purposes = store.getState().getters.GET_PURPOSES();
    for (const purpose of purposes) {
      EventBus.on(`${purpose}-enabled`, () => {
        store.getState().actions.INJECT_SERVICES();
      });
      EventBus.on(`${purpose}-disabled`, () => {
        ConsentRevoke.removeCookiesForPurpose(purpose);
      });
    }
    EventBus.on('cookies-set', () => {
      store.getState().actions.SET_SHOW_NOTIFICATION(false);
    });
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
  public static store(): StoreApi<AnshinStore> {
    return store;
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
