import { AnshinOptions, ConsentStatus, AnshinPlugin } from '@anshin/types';
import store from './store';
import EventBus, { EventBusSubscription } from './events/event-bus';
import Store from './store/store';
import { ConsentRevoke } from './services';

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
  private static instance: Anshin;
  protected static plugins: AnshinPlugin[] = [];

  private constructor(options: Partial<AnshinOptions>) {
    for (const plugin of Anshin.plugins) {
      if (plugin.register) {
        plugin.register();
      }
    }
    store.dispatch('RESOLVE_CONFIG', options);
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
    const purposes = store.getters.GET_PURPOSES;
    const consents: ConsentStatus = {};

    for (const purpose of purposes) {
      if (store.getters.HAS_COOKIES_ENABLED(purpose)) {
        consents[purpose] = true;
        EventBus.emit(`${purpose}-enabled`);
      } else {
        consents[purpose] = false;
      }
    }

    if (store.getters.HAS_ALL_COOKIES_SET) {
      EventBus.emit('cookies-set');
    }

    store.commit('SET_CONSENTS', consents);
  }

  /**
   * Register some default listeners for injecting services and removing cookies.
   */
  protected registerDefaultListeners(): void {
    const purposes = store.getters.GET_PURPOSES;
    for (const purpose of purposes) {
      EventBus.on(`${purpose}-enabled`, () => {
        store.dispatch('INJECT_SERVICES');
      });
      EventBus.on(`${purpose}-disabled`, () => {
        ConsentRevoke.removeCookiesForPurpose(purpose);
      });
    }
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
  public static store(): Store {
    return store;
  }

  public static registerPlugin(plugin: AnshinPlugin): void {
    Anshin.plugins.push(plugin);
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
