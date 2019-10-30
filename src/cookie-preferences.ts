import CookieManager from './cookie-manager';
import { Configuration } from '../types';

export default class CookiePreferences {
  /** Cookie manager instance */
  protected cookieManager: CookieManager;
  /** Checkbox for accepting analytics cookies */
  protected checkboxAnalytics: HTMLInputElement | null = null;
  /** Checkbox for accepting marketing cookies */
  protected checkboxMarketing: HTMLInputElement | null = null;
  /** Button for saving preferences */
  protected saveButton: HTMLButtonElement | null = null;
  /** Initial save button text (e.g. `Save preferences`) */
  protected saveButtonInitialText: string = '';
  /** Saved button text (e.g. `Saved`) */
  protected saveButtonSavedText: string = '';

  /**
   * Fetch DOM elements.
   */
  constructor(options: Configuration) {
    this.cookieManager = new CookieManager(options);
  }

  /**
   * Initialize cookie preferences initial states and event listeners.
   */
  public init(): void {
    this.checkboxAnalytics = <HTMLInputElement | null>document.getElementById('cookie-preferences__analytics');
    this.checkboxMarketing = <HTMLInputElement | null>document.getElementById('cookie-preferences__marketing');
    this.saveButton = <HTMLButtonElement | null>document.getElementById('cookie-preferences__save');

    // Set initial checked states
    if (this.checkboxMarketing !== null) {
      this.checkboxMarketing.checked = this.cookieManager.hasMarketingEnabled();
      this.checkboxMarketing.addEventListener('change', () => {
        this.enableButton();
      });
    }
    if (this.checkboxAnalytics !== null) {
      this.checkboxAnalytics.checked = this.cookieManager.hasAnalyticsEnabled();
      this.checkboxAnalytics.addEventListener('change', () => {
        this.enableButton();
      });
    }

    if (this.saveButton !== null) {
      this.saveButtonInitialText = this.saveButton.innerText;
      this.saveButtonSavedText = this.saveButton.dataset.saved || 'Saved';
      this.saveButton.addEventListener('click', () => {
        this.disableButton();
        this.cookieManager.enableFunctionalCookie();
        if (this.hasCheckedMarketingCookies()) {
          this.cookieManager.enableMarketingCookie();
        } else {
          this.cookieManager.disableMarketingCookie();
        }
        if (this.hasCheckedAnalyticsCookies()) {
          this.cookieManager.enableAnalyticsCookie();
        } else {
          this.cookieManager.disableAnalyticsCookie();
        }
      });
    }
  }

  /**
   * Check whether the user has accepted marketing cookies.
   */
  protected hasCheckedMarketingCookies(): boolean {
    return !!(this.checkboxMarketing && this.checkboxMarketing.checked);
  }

  /**
   * Check whether the user has accepted analytics cookies.
   */
  protected hasCheckedAnalyticsCookies(): boolean {
    return !!(this.checkboxAnalytics && this.checkboxAnalytics.checked);
  }

  /**
   * Enable the submit button.
   */
  protected enableButton(): void {
    this.saveButton!.disabled = false;
    this.saveButton!.innerText = this.saveButtonInitialText;
  }

  /**
   * Disable the submit button.
   */
  protected disableButton(): void {
    this.saveButton!.disabled = true;
    this.saveButton!.innerText = this.saveButtonSavedText;
  }
}
