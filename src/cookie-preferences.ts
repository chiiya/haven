import CookieManager from './cookie-manager';
import { CookieConsentOptions } from '../types';

export default class CookiePreferences {
  /**
   * Cookie manager instance.
   */
  protected cookieManager: CookieManager;
  /**
   * Checkbox for accepting analytics cookies.
   */
  protected checkboxAnalytics: HTMLInputElement | null = null;
  /**
   * Checkbox for accepting marketing cookies.
   */
  protected checkboxMarketing: HTMLInputElement | null = null;
  /**
   * Button for saving preferences.
   */
  protected saveButton: HTMLButtonElement | null = null;

  /**
   * Fetch dom elements.
   */
  constructor(options: CookieConsentOptions = {}) {
    this.cookieManager = new CookieManager(options);
    this.checkboxAnalytics = <HTMLInputElement>document.getElementById('cookie-preferences__analytics');
    this.checkboxMarketing = <HTMLInputElement>document.getElementById('cookie-preferences__marketing');
    this.saveButton = <HTMLButtonElement>document.getElementById('cookie-preferences__save');
  }

  /**
   * Initialize cookie preferences initial states and event listeners.
   */
  public init(): void {
    // Set initial checked states
    if (this.checkboxMarketing !== null) {
      this.checkboxMarketing.checked = this.cookieManager.hasMarketingCookie();
    }
    if (this.checkboxAnalytics !== null) {
      this.checkboxAnalytics.checked = this.cookieManager.hasAnalyticsCookie();
    }
    if (this.saveButton !== null) {
      this.saveButton.addEventListener('click', () => {
        this.disableButton();
        this.cookieManager.setFunctionalCookie(true);
        if (this.checkboxMarketing && this.checkboxMarketing.checked) {
          this.cookieManager.setMarketingCookie(true);
        } else {
          this.cookieManager.setMarketingCookie(false);
        }
        if (this.checkboxAnalytics && this.checkboxAnalytics.checked) {
          this.cookieManager.setAnalyticsCookie(true);
        } else {
          this.cookieManager.setMarketingCookie(false);
        }
      })
    }
    if (this.checkboxAnalytics !== null) {
      this.checkboxAnalytics.addEventListener('change', () => {
        this.enableButton();
      })
    }
    if (this.checkboxMarketing !== null) {
      this.checkboxMarketing.addEventListener('change', () => {
        this.enableButton();
      })
    }
  }

  /**
   * Enable the submit button.
   */
  protected enableButton(): void {
    this.saveButton!.disabled = false;
    this.saveButton!.innerText = 'Änderungen speichern';
  }

  /**
   * Disable the submit button.
   */
  protected disableButton(): void {
    this.saveButton!.disabled = true;
    this.saveButton!.innerText = 'Gespeichert';
  }
}
