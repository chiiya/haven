import { CookieAttributes } from './cookies';

export type AnshinOptions = {
  prefix: string;
  cookieAttributes: CookieAttributes;
  domains: string[];
  cookies: AnshinCustomCookies;
  type: ConsentType;
  services: AnshinService[];
  thirdPartyServices?: AnshinThirdPartyService[];
  purposes?: Purpose[];
  plugins: AnshinPlugin[];
}

export interface AnshinCustomCookies {
  [purpose: string]: (string | RegExp)[];
}

export interface AnshinService {
  name: string;
  purposes: Purpose[];
  title?: string;
  description?: string;
  inject?: boolean | Function;
  cookies?: (string | RegExp)[];
  options?: AnshinServiceOptions;
  required?: boolean;
}

export interface AnshinThirdPartyService {
  title?: string;
  description?: string;
  cookies?: (string | RegExp)[];
  link?: string;
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

export interface AnshinPlugin {
  config?: Function;
  register?: Function;
}
