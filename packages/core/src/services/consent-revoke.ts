import { Purpose } from '@anshin/types';
import { store } from '../store';
import Cookies from '../cookies';

export class ConsentRevoke {
  /**
   * Remove all cookies set by tracking services after opt-out / consent revoke.
   */
  public static removeAllCookies(): void {
    for (const service of store.getState().options.services) {
      this.removeCookies(service.cookies || []);
    }
    // Remove user specified cookies across all domains as well.
    const cookies = store.getState().options.cookies;
    if (cookies) {
      Object.values(cookies).map(cookies => this.removeCookies(cookies));
    }
    window.location.reload();
  }

  /**
   * Remove all cookies set by services for a given purpose.
   * @param purpose
   */
  public static removeCookiesForPurpose(purpose: Purpose) {
    for (const service of store.getState().options.services) {
      if (service.purposes.indexOf(purpose) !== -1) {
        this.removeCookies(service.cookies || []);
      }
    }
    // Remove user specified cookies across all domains as well.
    const cookies = store.getState().options.cookies;
    if (cookies && cookies[purpose]) {
      this.removeCookies(cookies[purpose]);
    }
  }

  /**
   * Remove a list of cookies from all configured domains.
   * @param cookies
   */
  protected static removeCookies(cookies: (string | RegExp)[]): void {
    for (const cookie of cookies) {
      for (const domain of store.getState().options.domains) {
        Cookies.remove(cookie, { domain });
      }
      Cookies.remove(cookie);
    }
  }
}
