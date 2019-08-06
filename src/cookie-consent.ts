import CookieNotification from './cookie-notification';
import CookiePreferences from './cookie-preferences';
import { CookieConsentOptions } from '../types';
import CookieManager from './cookie-manager';

export default class CookieConsent {
  protected cookieManager: CookieManager;
  protected cookieNotification: CookieNotification;
  protected cookiePreferences: CookiePreferences;
  
  constructor(options: CookieConsentOptions = {}) {
    this.cookieManager = new CookieManager(options);
    this.cookieNotification = new CookieNotification(options);
    this.cookiePreferences = new CookiePreferences(options);
  }

  init(): void {
    // @ts-ignore
    const gtm: any = dataLayer;
    if (gtm !== undefined) {
      if (this.cookieManager.hasMarketingCookie()) {
        gtm.push({ event: 'cookie-consent.marketing' });
      }
      if (this.cookieManager.hasAnalyticsCookie()) {
        gtm.push({ event: 'cookie-consent.analytics' });
      }
    }
    this.cookieNotification.init();
    this.cookiePreferences.init();
  }
}
