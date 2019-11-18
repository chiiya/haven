import { injectFacebookPixel } from './facebook-pixel';
import { injectGoogleAnalytics } from './google-analytics';
import { injectGoogleTagManager } from './google-tag-manager';
import { HavenService } from '../types';

export default class ServiceLoader {
  /**
   * Inject a specific service, if all requirements are met (cookies accepted _or_ service is required).
   * @param service
   */
  public static injectService(service: HavenService): boolean {
    const injector = this.getInjectorFunction(service);

    if (injector !== undefined) {
      injector(service.options || {});
      return true;
    }

    return false;
  }

  /**
   * Get the injector function.
   * @param service
   */
  protected static getInjectorFunction(service: HavenService): Function | undefined {
    let injector: Function  | undefined;
    if (service.inject === true) {
      const type = service.type || service.name;
      injector = this.getDefaultInjector(type);
      if (injector === undefined) {
        console.error(`No default injector found for ${type}. Please specify your own implementation.`);
        return;
      }
      return injector;
    } else if (service.inject) {
      return service.inject;
    }
  }

  /**
   * Get the default injector if it exists.
   * @param type
   */
  protected static getDefaultInjector(type: string | undefined): Function | undefined {
    switch (type) {
      case 'google-analytics':
        return injectGoogleAnalytics;
      case 'google-tag-manager':
        return injectGoogleTagManager;
      case 'facebook-pixel':
        return injectFacebookPixel;
      default:
        return undefined;
    }
  }
}
