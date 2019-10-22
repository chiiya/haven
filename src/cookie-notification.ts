import CookieManager from './cookie-manager';
import { Configuration } from '../types';

export default class CookieNotification {
  /**
   * Cookie manager instance.
   */
  protected cookieManager: CookieManager;
  /**
   * Wrapper element for the cookie notification.
   */
  protected cookieNotification: HTMLElement | null = null;
  /**
   * Button for accepting cookies.
   */
  protected cookiesAccept: HTMLElement | null = null;
  /**
   * Button for declining cookies.
   */
  protected cookiesDecline: HTMLElement | null = null;

  /**
   * Fetch DOM elements.
   */
  constructor(options: Configuration) {
    this.cookieManager = new CookieManager(options);
  }

  /**
   * Initialize cookie notification event listeners.
   */
  public init(): void {
    this.cookieNotification = document.getElementById('cookie-notification');
    this.cookiesAccept = document.getElementById('cookie-notification__accept');
    this.cookiesDecline = document.getElementById('cookie-notification__decline');

    if (this.cookieNotification !== null && !this.cookieManager.hasFunctionalCookie()) {
      this.showCookieNotification();
    }
    if (this.cookiesAccept !== null) {
      this.cookiesAccept.addEventListener('click', (event) => {
        event.preventDefault();
        this.cookieManager.acceptAll();
        this.hideCookieNotification();
      })
    }
    if (this.cookiesDecline !== null) {
      this.cookiesDecline.addEventListener('click', (event) => {
        event.preventDefault();
        // Only set the functional cookie.
        this.cookieManager.enableFunctionalCookie();
        this.hideCookieNotification();
      })
    }
  }

  /**
   * Show cookie notification.
   */
  public showCookieNotification(): void {
    if (this.cookieNotification !== null) {
      this.cookieNotification.style.display = this.cookieNotification.dataset.display || 'block';
    }
  }

  /**
   * Hide cookie notification.
   */
  public hideCookieNotification(): void {
    if (this.cookieNotification !== null) {
      this.cookieNotification.style.display = 'none';
    }
  }
}
