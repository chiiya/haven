import CookieManager from './cookie-manager';
import { Configuration, CookieConsentServices } from '../types';

export default class ConsentRevoke {
  protected services: CookieConsentServices;
  protected domain: string;

  constructor(options: Configuration) {
    this.services = options.services || {};
    this.domain = options.domain;
  }

  /**
   * Destroy all registered services after opt-out / consent revoke.
   */
  public destroyAnalyticsServices(): void {
    console.log(this.services);
    if (this.services.gtm && this.services.gtm.id) {
      this.destroyGtm();
    }
    if (this.services.aam) {
      this.destroyAam();
    }
    if (this.services.navitas) {
      this.destroyNavitas();
    }
    console.log('Reloading page');
    // window.location.reload();
  }
  /**
   * Remove all cookies possibly set by GTM.
   */
  protected destroyGtm(): void {
    CookieManager.removeCookie('_ga', { domain: this.domain });
    CookieManager.removeCookie('_gid', { domain: this.domain });
    CookieManager.removeCookie('_gat', { domain: this.domain });
    if (this.services.ga && this.services.ga.id) {
      CookieManager.removeCookie(`_dc_gtm_${this.services.ga.id}`, { domain: this.domain });
      CookieManager.removeCookie(`_gac_${this.services.ga.id}`, { domain: this.domain });
      CookieManager.removeCookie(`_gat_gtag_${this.services.ga.id}`, { domain: this.domain });
      CookieManager.removeCookie(`_gat_${this.services.ga.id}`, { domain: this.domain });
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
