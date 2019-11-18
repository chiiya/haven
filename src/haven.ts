import store from './store';
import { HavenOptions } from './types';
import ConfigurationResolver from './config/configuration-resolver';

declare global {
  interface Window {
    dataLayer: any[];
    ga: any;
    fbq: Function;
    _fbq: Function;
    Haven: typeof Haven;
  }
}

export default class Haven {
  private constructor(options: Partial<HavenOptions>) {
    store.dispatch('RESOLVE_CONFIG', options);
  }
}
