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
  [purpose: string]: string[];
}

export interface HavenPreferencesOptions {
  styles: HavenPreferencesStyles;
}

export interface HavenPreferencesStyles {
  textColor: string;
  toggleBackground: string;
  toggleBorder: string;
  buttonBackground: string;
  buttonBackgroundHover: string;
  buttonColor: string;
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
  id?: string;
  inject?: boolean | Function;
  required?: boolean;
  cookies?: string[];
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
