import { Translations } from './translations';
import { CookieAttributes } from './cookies';
import Component from '../components/component';

export declare type Getter<T> = (state: T, getters: Getters) => any;
export declare type Mutation<T> = (state: T, ...args: any[]) => T;
export declare type Action<T> = (context: T, ...args: any[]) => void;

export declare type GettersObject<T> = {
  [getter: string]: Getter<T>;
};
export declare type Getters = {
  [getter: string]: any;
};
export declare type MutationsObject<T> = {
  [mutation: string]: Mutation<T>;
};
export declare type ActionsObject<T> = {
  [action: string]: Action<T>;
};
export declare type ActionsContext<S> = {
  state: S;
  getters: Getters;
  commit: (mutation: string, payload: any) => void;
  dispatch: (action: string, payload: any) => void;
};

export interface State extends HavenOptions {
  consent: ConsentStatus;
  injected: InjectedServices;
}

export interface ConsentStatus {
  [purpose: string]: boolean;
}

export interface InjectedServices {
  [name: string]: boolean;
}

export interface HavenOptions {
  prefix: string;
  cookieAttributes: CookieAttributes;
  domains: string[];
  cookies: HavenCustomCookies;
  lang: string;
  type: ConsentType;
  services: HavenService[];
  purposes?: Purpose[];
  notification: HavenNotificationOptions;
  translations: Translations;
}

export interface HavenNotificationOptions {
  component?: Component;
  options: HavenDefaultNotification;
}

export interface HavenDefaultNotification {
  positionX: 'left' | 'right';
  positionY: 'top' | 'bottom';
  includePolicyUrl: boolean;
  policyUrl: string;
}

export interface HavenCustomCookies {
  [purpose: string]: (string | RegExp)[];
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

export type ConsentType = 'opt-in' | 'opt-out';
export type Purpose =
  | 'functional'
  | 'analytics'
  | 'marketing'
  | 'preferences'
  | string;
export type HavenServiceType =
  | 'google-analytics'
  | 'google-tag-manager'
  | 'facebook-pixel';
