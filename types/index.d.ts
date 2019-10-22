export interface CookieConsentOptions {
  domain?: string;
  prefix?: string;
  type?: ConsentType;
  inject?: InjectableService[];
  services?: CookieConsentServices;
}

export interface CookieManagerOptions {
  type?: ConsentType;
  prefix?: string;
}

export interface Configuration {
  prefix?: string;
  domain: string;
  type: ConsentType;
  inject: InjectableService[];
  services?: CookieConsentServices;
}

export interface CookieConsentServices {
  ga?: ServiceOptions;
  gtm?: ServiceOptions;
  aam?: boolean;
  navitas?: boolean;
}

export interface ServiceOptions {
  id: string;
}

export type ConsentType = 'opt-in' | 'opt-out';
export type InjectableService = 'google-tag-manager' | 'google-analytics';
