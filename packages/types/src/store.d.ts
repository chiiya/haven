import { AnshinOptions, AnshinService, Purpose } from './anshin';

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
