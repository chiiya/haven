import { CookieAttributes } from "./cookies";

export interface AnshinOptions {
  prefix: string;
  cookieAttributes: CookieAttributes;
  domains: string[];
  cookies: AnshinCustomCookies;
  type: ConsentType;
  services: AnshinService[];
  purposes?: Purpose[];
}

export interface AnshinCustomCookies {
  [purpose: string]: (string | RegExp)[];
}

export interface AnshinService {
  name: string;
  purposes: Purpose[];
  title?: string;
  description?: string;
  type?: AnshinServiceType;
  inject?: boolean | Function;
  required?: boolean;
  cookies?: (string | RegExp)[];
  options?: AnshinServiceOptions;
}

export interface AnshinServiceOptions {
  [option: string]: any;
}

export type ConsentType = 'opt-in' | 'opt-out';
export type Purpose =
  | 'functional'
  | 'analytics'
  | 'marketing'
  | 'preferences'
  | string;
export type AnshinServiceType =
  | 'google-analytics'
  | 'google-tag-manager'
  | 'facebook-pixel';

export interface AnshinPlugin {
  config?: Function;
  register?: Function;
}
