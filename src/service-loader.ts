import { Configuration, CookieConsentServices, InjectableService } from '../types';
import { injectFacebookPixel } from './services/facebook-pixel';
import { injectGoogleAnalytics } from './services/google-analytics';
import { injectGoogleTagManager } from './services/google-tag-manager';
import EventBus from './event-bus';

export default class ServiceLoader {
  /** Services to inject */
  protected inject: InjectableService[];
  /** Service configuration */
  protected services: CookieConsentServices;

  constructor(options: Configuration) {
    this.services = options.services || {};
    this.inject = options.inject;
  }

  /**
   * Inject all registered services.
   */
  public injectServices(): void {
    for (const service of this.inject) {
      if (!this.checkForPrerequisite(service)) {
        console.error(`Missing configuration for ${service} service. Could not inject service.`);
        return;
      }
      switch (service) {
        case 'google-analytics':
          injectGoogleAnalytics(this.services.ga!.id);
          break;
        case 'google-tag-manager':
          injectGoogleTagManager(this.services.gtm!.id);
          break;
        case 'facebook-pixel':
          injectFacebookPixel(this.services.facebook!.id);
      }
    }
    EventBus.emit('services-loaded');
  }

  /**
   * Check whether the configuration for a given service can be resolved.
   * @param service
   */
  protected checkForPrerequisite(service: InjectableService): boolean {
    switch (service) {
      case 'google-analytics':
        return (this.services.ga !== undefined && this.services.ga.id !== undefined);
      case 'google-tag-manager':
        return (this.services.gtm !== undefined && this.services.gtm.id !== undefined);
      case 'facebook-pixel':
        return (this.services.facebook !== undefined && this.services.facebook.id !== undefined);
    }
  }
}
