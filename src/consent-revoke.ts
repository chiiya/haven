import CookieManager from './cookie-manager';
import { Configuration, CookieConsentServices } from '../types';

export default class ConsentRevoke {
  protected services: CookieConsentServices;

  constructor(options: Configuration) {
    this.services = options.services || {};
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
    console.log('Reloading page');
    window.location.reload();
  }
  /**
   * Remove all cookies possibly set by GTM.
   */
  protected destroyGtm(): void {
    CookieManager.removeCookie('_ga');
    CookieManager.removeCookie('_gid');
    CookieManager.removeCookie('_gat');
    if (this.services.ga && this.services.ga.id) {
      CookieManager.removeCookie(`_dc_gtm_${this.services.ga.id}`);
      CookieManager.removeCookie(`_gac_${this.services.ga.id}`);
      CookieManager.removeCookie(`_gat_gtag_${this.services.ga.id}`);
      CookieManager.removeCookie(`_gat_${this.services.ga.id}`);
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
