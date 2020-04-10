import store from './store';
import { HavenOptions, ConsentStatus } from './types';
import Component from './components/component';
import CookieNotification from './components/notification';
import EventBus, { EventBusSubscription } from './events/event-bus';
import { EventStore } from './events/store';

declare global {
  interface Window {
    dataLayer: any[];
    ga: any;
    fbq: Function;
    _fbq: Function;
    Haven: typeof Haven;
  }
}

export default class Haven {
  private static instance: Haven;
  private cookieNotification: Component | undefined;

  private constructor(options: Partial<HavenOptions>) {
    store.dispatch('RESOLVE_CONFIG', options);
    console.log(store.state);
  }

  public init(): void {
    if (/complete|interactive|loaded/.test(document.readyState)) {
      this.initCookieNotification();
    } else {
      document.addEventListener('DOMContentLoaded', () => {
        this.initCookieNotification();
      });
    }

    this.registerDefaultListeners();
    this.checkInitialState();
  }

  protected initCookieNotification(): void {
    if (store.state.notification.component instanceof Component) {
      this.cookieNotification = store.state.notification.component;
    } else {
      const element = document.createElement('div');
      document.body.prepend(element);
      this.cookieNotification = new CookieNotification(element);
    }
    this.cookieNotification.render();
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
        // ConsentRevoke.removeCookiesForPurpose(purpose);
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

  public static create(options: Partial<HavenOptions>): Haven {
    if (Haven.instance) {
      console.warn(
        'Replacing an existing Haven instance. Are you sure this behaviour is intended?'
      );
    }
    Haven.instance = new Haven(options);
    Haven.instance.init();
    return Haven.instance;
  }

  public static getInstance(): Haven | undefined {
    if (Haven.instance) {
      return Haven.instance;
    }
    console.error(
      'No Haven instance found. Make sure to create a Haven instance before attempting to access it.'
    );
  }
}
