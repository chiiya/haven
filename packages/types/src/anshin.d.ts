import { CookieAttributes } from './cookies';
import { EventBus } from './events';

export type AnshinOptions = {
  prefix: string;
  cookieAttributes: CookieAttributes;
  domains: string[];
  cookies: AnshinCustomCookies;
  services: AnshinService[];
  thirdPartyServices?: AnshinThirdPartyService[];
  purposes?: Purpose[];
  plugins: AnshinPlugin[];
};

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

export type Purpose = 'functional' | 'analytics' | 'marketing' | 'preferences' | string;

export interface AnshinPlugin {
  config?: Function;
  register?: (parameters: PluginParameters) => void;
}

export interface PluginParameters {
  store: AnshinStore;
  events: EventBus;
}

/**
 * Store Types
 */

export type ConsentDTO = {
  purpose: Purpose;
  status: boolean;
};

export type AnshinState = {
  consent: Store<ConsentStatus>;
  injected: Store<InjectedServices>;
  options: AnshinOptions;
};

export type AnshinStore = {
  state: AnshinState;
  getters: AnshinGetters;
  commit: (action: keyof AnshinActions, data?: any) => void;
};

export interface Store<T> {
  subscribe: (callback: (val: T) => void) => () => void;
  set: (val: T) => void;
  update: (callback: (val: T) => T) => void;
  get: () => T;
}

export interface AnshinGetters {
  GET_PURPOSES: () => Purpose[];
  HAS_ALL_COOKIES_SET: () => boolean;
  HAS_COOKIES_SET: (purpose: Purpose) => boolean;
  HAS_COOKIES_ENABLED: (purpose: Purpose) => boolean;
  HAS_COOKIES_DISABLED: (purpose: Purpose) => boolean;
  HAS_ALL_NECESSARY_COOKIES_ENABLED: (purposes: Purpose[]) => boolean;
}

export interface AnshinActions {
  RESOLVE_CONFIG: (options: Partial<AnshinOptions>) => void;
  SET_INITIAL_CONSENT_VALUES: () => void;
  SYNC_CONSENT_STATUS: () => void;
  ENABLE_ALL_COOKIES: () => void;
  DISABLE_ALL_COOKIES: () => void;
  INJECT_SERVICES: () => void;
  INJECT_SERVICE: (service: AnshinService) => void;
  SET_COOKIE_VALUE: (data: { purpose: Purpose; value: string }) => void;
}

export interface ConsentStatus {
  [purpose: string]: boolean | null;
}

export interface InjectedServices {
  [name: string]: boolean;
}
