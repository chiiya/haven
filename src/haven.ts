import CookieNotification from './cookie-notification';
import CookiePreferences from './cookie-preferences';
import CookieManager from './cookie-manager';
import ServiceLoader from './service-loader';
import { Configuration, CookieConsentOptions } from '../types';
import ConfigurationResolver from './configuration-resolver';
import EventBus, { EventBusSubscription } from './event-bus';

declare global {
  interface Window {
    dataLayer: any[];
    ga: any;
    Haven: Haven;
  }
}

export default class Haven {
  protected options: Configuration;
  protected cookieNotification: CookieNotification;
  protected cookiePreferences: CookiePreferences;
  protected cookieManager: CookieManager;
  protected serviceLoader: ServiceLoader;

  constructor(options: CookieConsentOptions = {}) {
    const config = ConfigurationResolver.resolve(options);
    this.cookieNotification = new CookieNotification(config);
    this.cookiePreferences = new CookiePreferences(config);
    this.cookieManager = new CookieManager(config);
    this.serviceLoader = new ServiceLoader(config);
    this.options = config;
  }

  public init(): void {
    document.addEventListener('DOMContentLoaded', () => {
      this.cookieNotification.init();
      this.cookiePreferences.init();
    });
    this.registerDefaultListeners();
    this.checkInitialState();
  }

  checkInitialState(): void {
    if (this.cookieManager.hasFunctionalCookie()) {
      EventBus.emit('functional-enabled');
    }
    if (this.cookieManager.hasAnalyticsEnabled()) {
      EventBus.emit('analytics-enabled');
    }
    if (this.cookieManager.hasMarketingEnabled()) {
      EventBus.emit('marketing-enabled');
    }
  }

  registerDefaultListeners(): void {
    // Inject analytics services once analytics cookies have been accepted
    EventBus.on('analytics-enabled', () => {
      if (this.options.injectServices) {
        this.serviceLoader.loadAnalyticsServices();
      }
    });
    // Destroy injected analytics services when analytics cookie consent is revoked
    EventBus.on('analytics-disabled', () => {
      if (this.options.injectServices) {
        this.serviceLoader.destroyAnalyticsServices();
      }
    });
  }

  /**
   * Proxy event bus subscription method to the event bus singleton so that users can call this method
   * anywhere in their application.
   * @param event
   * @param callback
   */
  on(event: string, callback: Function): EventBusSubscription {
    return EventBus.on(event, callback);
  }

  static create(options: CookieConsentOptions = {}): Haven {
    const haven = new Haven(options);
    haven.init();
    window.Haven = haven;
    return haven;
  }
}
