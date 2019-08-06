import CookieManager from './cookie-manager';

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
   * Fetch dom elements.
   */
  constructor() {
    this.cookieManager = new CookieManager();
    this.checkboxAnalytics = <HTMLInputElement>document.getElementById('cookie-preferences__analytics');
    this.checkboxMarketing = <HTMLInputElement>document.getElementById('cookie-preferences__marketing');
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
    // Set event listeners
    if (this.checkboxMarketing !== null) {
      this.checkboxMarketing.addEventListener('change', (event) => {
        this.cookieManager.setMarketingCookie(this.checkboxMarketing!.checked);
      })
    }
    if (this.checkboxAnalytics !== null) {
      this.checkboxAnalytics.addEventListener('change', (event) => {
        this.cookieManager.setAnalyticsCookie(this.checkboxAnalytics!.checked);
      })
    }
  }
}
