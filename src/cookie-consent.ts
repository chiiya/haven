import CookieNotification from './cookie-notification';
import CookiePreferences from './cookie-preferences';
import CookieManager from './cookie-manager';
import ServiceLoader from './service-loader';
import { CookieConsentOptions } from '../types';

declare global {
  interface Window { dataLayer: any; ga: any; }
}

export default class CookieConsent {
  protected options: CookieConsentOptions;
  protected cookieNotification: CookieNotification;
  protected cookiePreferences: CookiePreferences;
  protected cookieManager: CookieManager;
  protected serviceLoader: ServiceLoader;
  
  constructor(options: CookieConsentOptions = {}) {
    this.cookieNotification = new CookieNotification(options);
    this.cookiePreferences = new CookiePreferences(options);
    this.cookieManager = new CookieManager(options);
    this.serviceLoader = new ServiceLoader(options);
    this.options = options;
  }

  public init(): void {
    if (this.cookieManager.hasAnalyticsEnabled()) {
      this.serviceLoader.loadAnalyticsServices();
    }

    document.addEventListener('DOMContentLoaded', () => {
      this.cookieNotification.init();
      this.cookiePreferences.init();
    });
  }

  static create(options: CookieConsentOptions = {}): CookieConsent {
    const consent = new CookieConsent(options);
    consent.init();
    return consent;
  }
}
