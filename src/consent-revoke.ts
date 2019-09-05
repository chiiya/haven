import CookieManager from './cookie-manager';
import { Configuration, CookieConsentServices } from '../types';

export default class ConsentRevoke {
  protected services: CookieConsentServices;
  protected domain: string | undefined;

  constructor(options: Configuration) {
    this.services = options.services || {};
    this.domain = options.domain;
  }

  /**
   * Destroy all registered services after opt-out / consent revoke.
   */
  public destroyAnalyticsServices(): void {
    if (this.services.gtm && this.services.gtm.id) {
      this.destroyGtm();
    }
    if (this.services.aam) {
      this.destroyAam();
    }
    if (this.services.navitas) {
      this.destroyNavitas();
    }
    window.location.reload();
  }
  /**
   * Remove all cookies possibly set by GTM.
   */
  protected destroyGtm(): void {
    const simpleCookies = ['_ga', '_gid', '_gat'];
    for (const cookie of simpleCookies) {
      if (this.domain) {
        CookieManager.removeCookie(cookie, { domain: this.domain });
      }
      CookieManager.removeCookie(cookie);
    }

    if (this.services.ga && this.services.ga.id) {
      const compositeCookies = ['_dc_gtm_', '_gac_', '_gat_gtag_', '_gat_'];
      for (const cookie of compositeCookies) {
        if (this.domain) {
          CookieManager.removeCookie(`${cookie}${this.services.ga.id}`, { domain: this.domain });
        }
        CookieManager.removeCookie(`${cookie}${this.services.ga.id}`);
      }
    }
  }

  /**
   * Remove all cookies set by Adobe Audience Manager.
   */
  protected destroyAam(): void {
    CookieManager.removeCookie('aam_uuid');
  }

  /**
   * Remove all cookies set by Navitas.
   */
  protected destroyNavitas(): void {
    CookieManager.removeCookie('AAMC_navitas_0');
    CookieManager.removeCookie('DST');
    CookieManager.removeCookie('demdex');
    CookieManager.removeCookie('dextp');
    CookieManager.removeCookie('navitas');
  }
}
