import CookieManager from '../cookies/cookie-manager';
import store from '../store';
import { HavenService, Purpose } from '../types';

export default class ConsentRevoke {
  /**
   * Remove all cookies set by tracking services after opt-out / consent revoke.
   */
  public static removeCookies(): void {
    for (const service of store.services) {
      this.removeCookiesSetByService(service);
    }
    // Remove user specified cookies across all domains as well.
    if (store.cookies) {
      Object.values(store.cookies).map(cookies => this.removeSimpleCookies(cookies));
    }
    window.location.reload();
  }

  public static removeCookiesForPurpose(purpose: Purpose) {
    for (const service of store.services) {
      if (service.purposes.indexOf(purpose) === -1) {
        continue;
      }
      this.removeCookiesSetByService(service);
    }
    // Remove user specified cookies across all domains as well.
    if (store.cookies && store.cookies[purpose]) {
      this.removeSimpleCookies(store.cookies[purpose]);
    }
  }

  /**
   * Remove all cookies set by a given service.
   * @param service
   */
  protected static removeCookiesSetByService(service: HavenService) {
    if (service.cookies && service.cookies.length) {
      this.removeSimpleCookies(service.cookies);
    }
    if (service.name === 'google-analytics') {
      this.removeGoogleAnalyticsCookies(service.id);
    }
  }

  /**
   * Remove all cookies set by google analytics.
   */
  protected static removeGoogleAnalyticsCookies(id: string | undefined): void {
    const simple = ['_ga', '_gid', '_gat', 'AMP_TOKEN'];
    const composite = ['_dc_gtm_', '_gac_', '_gat_gtag_', '_gat_'];
    this.removeSimpleCookies(simple);
    if (id !== undefined) {
      this.removeCompositeCookies(composite, id);
    }
  }

  /**
   * Remove simple cookies across all possible domains.
   * @param cookies
   */
  protected static removeSimpleCookies(cookies: string[]): void {
    for (const cookie of cookies) {
      for (const domain of store.domains) {
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
  protected static removeCompositeCookies(cookies: string[], id: string): void {
    for (const cookie of cookies) {
      for (const domain of store.domains) {
        CookieManager.removeCookie(`${cookie}${id}`, { domain });
      }
      CookieManager.removeCookie(`${cookie}${id}`);
    }
  }
}
