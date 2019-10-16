import { Configuration, CookieConsentServices } from '../types';
import EventBus from './event-bus';

export default class ServiceLoader {
  protected services: CookieConsentServices;

  constructor(options: Configuration) {
    this.services = options.services || {};
  }

  /**
   * Load all registered services.
   */
  public loadAnalyticsServices(): void {
    if (this.services.gtm && this.services.gtm.id) {
      this.loadGtm();
    } else if (this.services.ga && this.services.ga.id) {
      this.loadGa();
    }
    EventBus.emit('services-loaded');
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
    script.src = `https://www.googletagmanager.com/gtm.js?id=${this.services.gtm!.id}`;
    firstScript.parentNode!.insertBefore(script, firstScript);
  }

  /**
   * Dynamically load GA after consent was given.
   */
  protected loadGa(): void {
    // Don't load GA twice.
    if (this.hasLoadedGa()) {
      return;
    }

    window.ga = window.ga || function() {
      (window.ga.q = window.ga.q || []).push(arguments)
    };

    window.ga.l = +new Date;

    const firstScript = document.getElementsByTagName('script')[0];
    const script = document.createElement('script');
    script.src = 'https://www.google-analytics.com/analytics.js';
    firstScript.parentNode!.insertBefore(script, firstScript);

    window.ga('create', this.services.ga!.id, 'auto');
    window.ga('send', 'pageview');
  }

  /**
   * Check if GTM instance has already been created.
   */
  protected hasLoadedGtm(): boolean {
    const src = `https://www.googletagmanager.com/gtm.js?id=${this.services.gtm!.id}`;
    return document.querySelector(`script[src="${src}"`) !== null;
  }

  /**
   * Check if GA instance has already been created.
   */
  protected hasLoadedGa(): boolean {
    const src = 'https://www.google-analytics.com/analytics.js';
    return document.querySelector(`script[src="${src}"`) !== null;
  }
}
