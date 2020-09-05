import { Purpose } from '@anshin/types';
import store from '../store';
import Cookies from '../cookies';

export class ConsentRevoke {
  /**
   * Remove all cookies set by tracking services after opt-out / consent revoke.
   */
  public static removeAllCookies(): void {
    for (const service of store.state.services) {
      this.removeCookies(service.cookies || []);
    }
    // Remove user specified cookies across all domains as well.
    if (store.state.cookies) {
      Object.values(store.state.cookies).map(cookies => this.removeCookies(cookies));
    }
    window.location.reload();
  }

  /**
   * Remove all cookies set by services for a given purpose.
   * @param purpose
   */
  public static removeCookiesForPurpose(purpose: Purpose) {
    for (const service of store.state.services) {
      if (service.purposes.indexOf(purpose) !== -1) {
        this.removeCookies(service.cookies || []);
      }
    }
    // Remove user specified cookies across all domains as well.
    if (store.state.cookies && store.state.cookies[purpose]) {
      this.removeCookies(store.state.cookies[purpose]);
    }
  }

  /**
   * Remove a list of cookies from all configured domains.
   * @param cookies
   */
  protected static removeCookies(cookies: (string | RegExp)[]): void {
    for (const cookie of cookies) {
      for (const domain of store.state.domains) {
        Cookies.remove(cookie, { domain });
      }
      Cookies.remove(cookie);
    }
  }
}
