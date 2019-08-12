import CookieNotification from './cookie-notification';
import CookiePreferences from './cookie-preferences';
import CookieManager from './cookie-manager';
import { CookieConsentOptions } from '../types';

declare global {
  interface Window { dataLayer: any; }
}

export default class CookieConsent {
  protected options: CookieConsentOptions;
  protected cookieNotification: CookieNotification;
  protected cookiePreferences: CookiePreferences;
  protected cookieManager: CookieManager;
  
  constructor(options: CookieConsentOptions = {}) {
    this.cookieNotification = new CookieNotification(options);
    this.cookiePreferences = new CookiePreferences(options);
    this.cookieManager = new CookieManager(options);
    this.options = options;
  }

  public init(): void {
    if (this.cookieManager.hasAnalyticsEnabled()) {
      this.loadGtm();
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

  protected loadGtm()
  {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'gtm.start': new Date().getTime(),
      'event': 'gtm.js'
    });
    const firstScript = document.getElementsByTagName('script')[0];
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtm.js?id=${this.options.gtmId}`;
    firstScript.parentNode!.insertBefore(script, firstScript);
  }
}
