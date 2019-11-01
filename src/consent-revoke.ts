import CookieManager from './cookies/cookie-manager';
import { Configuration, CookieConsentServices } from '../types';

export default class ConsentRevoke {
  protected services: CookieConsentServices;
  protected domains: string[];
  protected cookies: string[];

  constructor(options: Configuration) {
    this.services = options.services || {};
    this.domains = options.domains;
    this.cookies = options.cookies || [];
  }

  /**
   * Remove all cookies set by tracking services after opt-out / consent revoke.
   */
  public removeCookies(): void {
    if (this.services.ga) {
      this.removeGoogleAnalyticsCookies();
    }
    // Remove user specified cookies across all domains as well.
    this.removeSimpleCookies(this.cookies);
    window.location.reload();
  }

  /**
   * Remove all cookies set by google analytics.
   */
  protected removeGoogleAnalyticsCookies(): void {
    const simple = ['_ga', '_gid', '_gat', 'AMP_TOKEN'];
    const composite = ['_dc_gtm_', '_gac_', '_gat_gtag_', '_gat_'];
    this.removeSimpleCookies(simple);
    if (this.services.ga && this.services.ga.id) {
      this.removeCompositeCookies(composite, this.services.ga.id);
    }
  }

  /**
   * Remove simple cookies across all possible domains.
   * @param cookies
   */
  protected removeSimpleCookies(cookies: string[]): void {
    for (const cookie of cookies) {
      for (const domain of this.domains) {
        CookieManager.removeCookie(cookie, { domain });
      }
      CookieManager.removeCookie(cookie);
    }
  }

  /**
   * Remove composite cookies (prefix + unique id) across all possible domains.
   * @param cookies
   * @param id
   */
  protected removeCompositeCookies(cookies: string[], id: string): void {
    for (const cookie of cookies) {
      for (const domain of this.domains) {
        CookieManager.removeCookie(`${cookie}${id}`, { domain });
      }
      CookieManager.removeCookie(`${cookie}${id}`);
    }
  }
}
