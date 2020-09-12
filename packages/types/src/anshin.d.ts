import { StoreApi } from 'zustand';
import { CookieAttributes } from './cookies';
import { EventBus } from './events';

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
  register?: (parameters: PluginParameters) => void;
}

export interface PluginParameters {
  store: StoreApi<AnshinStore>;
  commit: (action: keyof AnshinActions, data?: any) => void;
  events: EventBus;
}

/**
 * Store Types
 */

export type ConsentDTO = {
  purpose: Purpose;
  status: boolean;
}

export type AnshinStore = {
  consent: ConsentStatus;
  injected: InjectedServices;
  showNotification: boolean;
  showPreferences: boolean;
  options: AnshinOptions;
  getters: AnshinGetters;
  actions: AnshinActions;
}

export interface AnshinGetters {
  GET_PURPOSES: () => Purpose[];
  HAS_ALL_COOKIES_SET: () => boolean;
  HAS_COOKIES_ENABLED: (purpose: Purpose) => boolean;
  HAS_ALL_NECESSARY_COOKIES_ENABLED: (purposes: Purpose[]) => boolean;
}

export interface AnshinActions {
  RESOLVE_CONFIG: (options: Partial<AnshinOptions>) => void;
  SET_CONSENT: (consent: ConsentDTO) => void;
  SET_INITIAL_CONSENT_VALUES: (consents: ConsentStatus) => void;
  ENABLE_ALL_COOKIES: () => void;
  DISABLE_ALL_COOKIES: () => void;
  INJECT_SERVICES: () => void;
  INJECT_SERVICE: (service: AnshinService) => void;
  SHOW_NOTIFICATION: () => void;
  HIDE_NOTIFICATION: () => void;
  SHOW_PREFERENCES: () => void;
  HIDE_PREFERENCES: () => void;
}

export interface ConsentStatus {
  [purpose: string]: boolean;
}

export interface InjectedServices {
  [name: string]: boolean;
}
