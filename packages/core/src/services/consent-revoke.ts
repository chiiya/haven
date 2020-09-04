import store from '../store';
import { AnshinService, Purpose } from '@anshin/types';
import { GoogleAnalyticsOptions } from './google-analytics';
import { FacebookPixelOptions } from './facebook-pixel';
import Cookies from "../cookies/cookies";

export default class ConsentRevoke {
  /**
   * Remove all cookies set by tracking services after opt-out / consent revoke.
   */
  public static removeCookies(): void {
    for (const service of store.state.services) {
      this.removeCookiesSetByService(service);
    }
    // Remove user specified cookies across all domains as well.
    if (store.state.cookies) {
      Object.values(store.state.cookies).map(cookies => this.removeSimpleCookies(cookies));
    }
    window.location.reload();
  }

  public static removeCookiesForPurpose(purpose: Purpose) {
    for (const service of store.state.services) {
      if (service.purposes.indexOf(purpose) === -1) {
        continue;
      }
      this.removeCookiesSetByService(service);
    }
    // Remove user specified cookies across all domains as well.
    if (store.state.cookies && store.state.cookies[purpose]) {
      this.removeSimpleCookies(store.state.cookies[purpose]);
    }
  }

  /**
   * Remove all cookies set by a given service.
   * @param service
   */
  protected static removeCookiesSetByService(service: AnshinService) {
    if (service.cookies && service.cookies.length) {
      this.removeSimpleCookies(service.cookies);
    }
    const type = service.type || service.name;
    if (type === 'google-analytics') {
      this.removeGoogleAnalyticsCookies(service.options);
    }
    if (type === 'facebook-pixel') {
      this.removeFacebookPixelCookies(service.options);
    }
  }

  /**
   * Remove all cookies set by google analytics.
   */
  protected static removeGoogleAnalyticsCookies(options: GoogleAnalyticsOptions = {}): void {
    const simple = ['_ga', '_gid', '_gat', '_gcl_au', 'AMP_TOKEN'];
    const composite = ['_dc_gtm_', '_gac_', '_gat_gtag_', '_gat_'];
    this.removeSimpleCookies(simple);
    if (options.id !== undefined) {
      this.removeCompositeCookies(composite, options.id);
    }
    if (options.name !== undefined) {
      this.removeCompositeCookies(composite, options.name);
    }
  }

  protected static removeFacebookPixelCookies(options: FacebookPixelOptions = {}): void {
    const simple = ['_fbp'];
    this.removeSimpleCookies(simple);
  }

  /**
   * Remove simple cookies across all possible domains.
   * @param cookies
   */
  protected static removeSimpleCookies(cookies: (string | RegExp)[]): void {
    for (const cookie of cookies) {
      for (const domain of store.state.domains) {
        Cookies.remove(cookie, { domain });
      }
      Cookies.remove(cookie);
    }
  }

  /**
   * Remove composite cookies (prefix + unique id) across all possible domains.
   * @param cookies
   * @param id
   */
  protected static removeCompositeCookies(cookies: string[], id: string | number): void {
    for (const cookie of cookies) {
      for (const domain of store.state.domains) {
        Cookies.remove(`${cookie}${id}`, { domain });
      }
      Cookies.remove(`${cookie}${id}`);
    }
  }
}
