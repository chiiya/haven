export interface Service {
  inject: Function;
  hasBeenInjected: () => boolean;
}
