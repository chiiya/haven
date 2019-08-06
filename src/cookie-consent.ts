import CookieNotification from './cookie-notification';
import CookiePreferences from './cookie-preferences';
import { CookieConsentOptions } from '../types';

export default class CookieConsent {
  protected cookieNotification: CookieNotification;
  protected cookiePreferences: CookiePreferences;
  
  constructor(options: CookieConsentOptions = {}) {
    this.cookieNotification = new CookieNotification(options);
    this.cookiePreferences = new CookiePreferences(options);
  }

  init(): void {
    this.cookieNotification.init();
    this.cookiePreferences.init();
  }
}
