export interface CookieConsentOptions {
  domain?: string;
  prefix?: string;
  type?: ConsentType;
  injectServices?: boolean;
  injectBothGtmAndGa?: boolean;
  services?: CookieConsentServices;
}

export interface CookieManagerOptions {
  type?: ConsentType;
  prefix?: string;
}

export interface Configuration {
  prefix?: string;
  domain?: string;
  type: ConsentType;
  injectServices: boolean;
  injectBothGtmAndGa: boolean;
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
