import { AnshinService } from '@anshin/types';

export class ServiceLoader {
  /**
   * Inject a specific service, if all requirements are met (cookies accepted _or_ service is required).
   * @param service
   */
  public static injectService(service: AnshinService): boolean {
    const injector = service.inject;

    if (injector !== undefined && !(injector === true || injector === false)) {
      injector(service.options || {});
      return true;
    }

    return false;
  }
}
