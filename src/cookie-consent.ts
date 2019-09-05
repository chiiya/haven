import CookieNotification from './cookie-notification';
import CookiePreferences from './cookie-preferences';
import CookieManager from './cookie-manager';
import ServiceLoader from './service-loader';
import { Configuration, CookieConsentOptions } from '../types';
import ConfigurationResolver from './configuration-resolver';
import EventBus, { EventBusSubscription } from './event-bus';
import ConsentRevoke from './consent-revoke';

declare global {
  const Haven: typeof CookieConsent;
}

export default class CookieConsent {
  protected options: Configuration;
  protected cookieNotification: CookieNotification;
  protected cookiePreferences: CookiePreferences;
  protected cookieManager: CookieManager;
  protected serviceLoader: ServiceLoader;
  /**
   * Cookie consent revoke instance.
   */
  protected consentRevoke: ConsentRevoke;

  constructor(options: CookieConsentOptions = {}) {
    const config = ConfigurationResolver.resolve(options);
    this.cookieNotification = new CookieNotification(config);
    this.cookiePreferences = new CookiePreferences(config);
    this.cookieManager = new CookieManager(config);
    this.serviceLoader = new ServiceLoader(config);
    this.consentRevoke = new ConsentRevoke(config);
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

  protected checkInitialState(): void {
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

  protected registerDefaultListeners(): void {
    // Inject analytics services once analytics cookies have been accepted
    EventBus.on('analytics-enabled', () => {
      console.log('Injecting services...');
      if (this.options.injectServices) {
        this.serviceLoader.loadAnalyticsServices();
      }
    });
    // Remove analytics cookies when analytics cookie consent is revoked
    EventBus.on('analytics-disabled', () => {
      console.log('Destroying services...');
      this.consentRevoke.destroyAnalyticsServices();
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

  public static create(options: CookieConsentOptions = {}): CookieConsent {
    const haven = new CookieConsent(options);
    haven.init();
    return haven;
  }
}
