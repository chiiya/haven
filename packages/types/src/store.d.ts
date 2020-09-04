import { AnshinOptions, Purpose } from "./anshin";

export declare type Getter<T> = (state: T, getters: Getters) => any;
export declare type Mutation<T> = (state: T, ...args: any[]) => T;
export declare type Action<T> = (context: T, ...args: any[]) => void;

export declare type GettersObject<T> = {
  [getter: string]: Getter<T>;
};
export declare type Getters = {
  GET_PURPOSES: Purpose[];
  HAS_ALL_COOKIES_SET: boolean;
  HAS_COOKIES_ENABLED: (purpose: Purpose) => boolean;
  HAS_ALL_NECESSARY_COOKIES_ENABLED: (purposes: Purpose[]) => boolean;
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

export interface State extends AnshinOptions {
  consent: ConsentStatus;
  injected: InjectedServices;
}

export interface AnshinStore {
  state: State;
  commit: (mutation: MutationType, payload: any) => void;
  dispatch: (action: ActionType, payload?: any) => void;
  getters: Getters;
}

export type MutationType = 'SET_STATE' | 'SET_CONSENTS' | 'SET_CONSENT' | 'SET_INJECTED' | string;
export type ActionType =
  | 'RESOLVE_CONFIG'
  | 'SET_CONSENT'
  | 'ENABLE_ALL_COOKIES'
  | 'DISABLE_ALL_COOKIES'
  | 'INJECT_SERVICES'
  | 'INJECT_SERVICE'
  | string;

export interface ConsentStatus {
  [purpose: string]: boolean;
}

export interface InjectedServices {
  [name: string]: boolean;
}
