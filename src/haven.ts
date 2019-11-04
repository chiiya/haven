import { CookieAttributes, HavenOptions, HavenService, Purpose } from './types';
import ConfigurationResolver from './store/configuration-resolver';
import CookieNotification from './notification';
import CookiePreferences from './preferences';
import { getAllPurposes } from './utils';
import CookieManager from './cookies/cookie-manager';
import EventBus, { EventBusSubscription } from './store/event-bus';
import store from './store';
import ServiceLoader from './services/service-loader';
import ConsentRevoke from './preferences/consent-revoke';

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
  private cookieNotification: CookieNotification;
  private cookiePreferences: CookiePreferences;
  private cookieManager: CookieManager;
  private serviceLoader: ServiceLoader;

  private constructor(options: Partial<HavenOptions>) {
    ConfigurationResolver.resolve(options);
    this.cookieNotification = new CookieNotification();
    this.cookiePreferences = new CookiePreferences();
    this.cookieManager = new CookieManager(store.prefix, store.type);
    this.serviceLoader = new ServiceLoader();
  }

  public init(): void {
    document.addEventListener('DOMContentLoaded', () => {
      this.cookieNotification.init();
      this.cookiePreferences.init();
    });
    this.registerDefaultListeners();
    this.checkInitialState();
  }

  /**
   * Check initial application state and fire events accordingly.
   */
  protected checkInitialState(): void {
    const purposes = getAllPurposes();
    for (const purpose of purposes) {
      if (this.cookieManager.hasCookiesEnabled(purpose)) {
        EventBus.emit(`${purpose}-enabled`);
      }
    }
  }

  /**
   * Register some default listeners for injecting services and removing cookies.
   */
  protected registerDefaultListeners(): void {
    const purposes = getAllPurposes();
    for (const purpose of purposes) {
      EventBus.on(`${purpose}-enabled`, () => {
        this.serviceLoader.injectServices();
      });
      EventBus.on(`${purpose}-disabled`, () => {
        ConsentRevoke.removeCookiesForPurpose(purpose);
      });
    }
  }

  /**
   * Dynamically register and inject a new service.
   * @param name
   * @param purposes
   * @param inject
   * @param options
   */
  public registerService(
    name: string,
    purposes: Purpose[],
    inject: boolean | Function,
    options: Partial<HavenService> = {},
  ) {
    this.serviceLoader.registerService(name, purposes, inject, options);
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
      console.warn('Replacing an existing Haven instance. Are you sure this behaviour is intended?');
    }
    Haven.instance = new Haven(options);
    Haven.instance.init();
    return Haven.instance;
  }

  public static getInstance(): Haven | undefined {
    if (Haven.instance) {
      return Haven.instance;
    }
    console.error('No Haven instance found. Make sure to create a Haven instance before attempting to access it.');
  }

  public static removeCookies(cookies: string[], options?: CookieAttributes) {
    for (const cookie of cookies) {
      CookieManager.removeCookie(cookie, options);
    }
  }
}
