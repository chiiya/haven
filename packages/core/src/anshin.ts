import { AnshinOptions, AnshinPlugin, AnshinStore, EventBusSubscription } from '@anshin/types';
import { state, getters, commit } from './store';
import EventBus from './events';
import { resolveConfig } from './config';

export default class Anshin {
  private static instance: Anshin;

  private constructor(options: Partial<AnshinOptions>) {
    commit('SET_OPTIONS', resolveConfig(options, { ...state.options }));
    this.registerPlugins(options.plugins || []);
    this.registerDefaultListeners();
    commit('SET_INITIAL_CONSENT_VALUES');
  }

  /**
   * Register some default listeners for injecting services and removing cookies.
   */
  protected registerDefaultListeners(): void {
    const purposes = getters.GET_PURPOSES();
    for (const purpose of purposes) {
      EventBus.on(`${purpose}-enabled`, () => {
        commit('INJECT_SERVICES');
      });
      EventBus.on(`${purpose}-disabled`, () => {
        commit('REMOVE_COOKIES_FOR_PURPOSE', purpose);
      });
    }
  }

  /**
   * Register any plugins.
   */
  protected registerPlugins(plugins: AnshinPlugin[]): void {
    // First, register config changes for all plugins
    for (const plugin of plugins) {
      if (plugin.config) {
        const options = { ...state.options };
        commit('SET_OPTIONS', resolveConfig(plugin.config(options), options));
      }
    }
    // Now, call the register functions with the final config values
    for (const plugin of plugins) {
      if (plugin.register) {
        plugin.register({
          store: { state, getters, commit },
          events: EventBus,
        });
      }
    }
  }

  /**
   * Proxy event bus subscription method to the event bus singleton so that users can call this method
   * anywhere in their application.
   */
  public static on(event: string, callback: (payload?: string) => void): EventBusSubscription {
    return EventBus.on(event, callback);
  }

  /**
   * Get access to the store.
   */
  public static store(): AnshinStore {
    return { state, getters, commit };
  }

  /**
   * Create a new Anshin singleton instance.
   */
  public static create(options: Partial<AnshinOptions>): Anshin {
    if (Anshin.instance) {
      console.warn(
        'Replacing an existing Anshin instance. Are you sure this behaviour is intended?'
      );
    }
    Anshin.instance = new Anshin(options);
    return Anshin.instance;
  }

  /**
   * Get Anshin singleton instance.
   */
  public static getInstance(): Anshin | undefined {
    if (Anshin.instance) {
      return Anshin.instance;
    }
    console.error(
      'No Anshin instance found. Make sure to create a Anshin instance before attempting to access it.'
    );
  }
}