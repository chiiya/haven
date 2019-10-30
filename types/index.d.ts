export interface CookieConsentOptions {
  prefix?: string;
  domains?: string | string[];
  cookies?: string[];
  type?: ConsentType;
  strategy?: TrackingStrategy;
  inject?: InjectableService[];
  services?: CookieConsentServices;
}

export interface CookieManagerOptions {
  type?: ConsentType;
  prefix?: string;
}

export interface Configuration {
  prefix: string;
  domains: string[];
  cookies?: string[];
  type: ConsentType;
  strategy: TrackingStrategy;
  inject: InjectableService[];
  services?: CookieConsentServices;
}

export interface CookieConsentServices {
  ga?: ServiceOptions;
  gtm?: ServiceOptions;
  facebook?: ServiceOptions;
}

export interface ServiceOptions {
  id: string;
}

export interface CookieAttributes {
  /**
   * Define when the cookie will be removed. Value can be a Number
   * which will be interpreted as days from time of creation or a
   * Date instance. If omitted, the cookie becomes a session cookie.
   */
  expires?: number | Date | string;

  /**
   * Define the path where the cookie is available. Defaults to '/'
   */
  path?: string;

  /**
   * Define the domain where the cookie is available. Defaults to
   * the domain of the page where the cookie was created.
   */
  domain?: string;

  /**
   * A Boolean indicating if the cookie transmission requires a
   * secure protocol (https). Defaults to false.
   */
  secure?: boolean;
}

export type TrackingStrategy = 'inject' | 'google-tag-manager' | 'custom';
export type ConsentType = 'opt-in' | 'opt-out';
export type InjectableService = 'google-tag-manager' | 'google-analytics' | 'facebook-pixel';
