import { CookieConsentOptions, CookieConsentServices } from '../types';
import CookieManager from './cookie-manager';

export default class ServiceLoader {
  protected cookieManager: CookieManager;
  protected services: CookieConsentServices;

  constructor(options: CookieConsentOptions = {}) {
    this.cookieManager = new CookieManager(options);
    this.services = options.services || {};
  }

  /**
   * Load all registered services.
   */
  public loadAnalyticsServices(): void {
    if (this.services.gtm && this.services.gtm.id) {
      this.loadGtm();
    }
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
   * Dynamically load GTM after consent was given.
   */
  protected loadGtm(): void {
    // Don't load GTM twice.
    if (this.hasLoadedGtm()) {
      return;
    }

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'gtm.start': new Date().getTime(),
      'event': 'gtm.js'
    });
    const firstScript = document.getElementsByTagName('script')[0];
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtm.js?id=${this.services.gtm!.id}`;
    firstScript.parentNode!.insertBefore(script, firstScript);
  }

  /**
   * Remove all cookies set by GTM.
   */
  protected destroyGtm(): void {
    CookieManager.removeCookie('_ga');
    CookieManager.removeCookie('_gid');
    if (this.services.ga && this.services.ga.id) {
      CookieManager.removeCookie(`_gat_gtag_${this.services.ga.id}`);
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

  /**
   * Check if GTM instance has already been created.
   */
  protected hasLoadedGtm(): boolean {
    const src = `https://www.googletagmanager.com/gtm.js?id=${this.services.gtm!.id}`;
    return document.querySelector(`script[src="${src}"`) !== null;
  }
}
