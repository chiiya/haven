import { Translations } from './translations';

export interface HavenOptions {
  prefix: string;
  domains: string[];
  cookies: HavenCustomCookies;
  lang: string;
  type: ConsentType;
  services: HavenService[];
  purposes?: Purpose[];
  notification: HavenNotificationOptions;
  preferences: HavenPreferencesOptions;
  translations: Translations;
}

export interface HavenNotificationOptions {
  position: 'top' | 'bottom';
  policyUrl: string;
  styles: HavenNotificationStyles;
}

export interface HavenCustomCookies {
  [purpose: string]: (string | RegExp)[];
}

export interface HavenPreferencesOptions {
  styles: HavenPreferencesStyles;
}

export interface HavenPreferencesStyles {
  textColor: string;
  toggleBackground: string;
  toggleBorder: string;
}

export interface HavenNotificationStyles {
  background: string;
  textColor: string;
  linkColor: string;
  buttonBackgroundColor: string;
  buttonBackgroundColorHover: string;
  buttonTextColor: string;
}

export interface HavenService {
  name: string;
  purposes: Purpose[];
  title?: string;
  description?: string;
  type?: HavenServiceType;
  inject?: boolean | Function;
  required?: boolean;
  cookies?: (string | RegExp)[];
  options?: HavenServiceOptions;
}

export interface HavenServiceOptions {
  [option: string]: any;
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

export type ConsentType = 'opt-in' | 'opt-out';
export type Purpose = 'functional' | 'analytics' | 'marketing' | 'preferences' | string;
export type HavenServiceType = 'google-analytics' | 'google-tag-manager' | 'facebook-pixel';
