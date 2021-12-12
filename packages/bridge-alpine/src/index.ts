import Alpine from 'alpinejs';
import { AnshinPlugin, AnshinStore, PluginParameters, Purpose } from '@anshin/types';

export interface PluginOptions {
  /**
   * Update cookies every time the state changes, as opposed to just when `save()` is
   * called (e.g. the user clicks on "Save")
   */
  reactive: boolean;

  /**
   * Additional global custom state
   */
  state?: Record<string, unknown>;
}

export function AlpineBridge(options: Partial<PluginOptions> = {}): AnshinPlugin {
  const config = resolveOptions(options);

  function register(parameters: PluginParameters) {
    createAlpineStore(config, parameters.store);
  }

  const self = {
    register,
  };

  return Object.freeze(self);
}

export function createAlpineStore(config: PluginOptions, store: AnshinStore): void {
  const purposes: Purpose[] = ['functional', ...store.getters.GET_PURPOSES()];
  const properties = Object.fromEntries(purposes.map(purpose => [purpose, null]));

  Alpine.store('anshin', {
    ...properties,
    purposes: purposes,
    display: false,
    ...(config.state || {}),

    init() {
      store.state.consent.subscribe((consent) => {
        for (const [purpose, state] of Object.entries(consent)) {
          this[purpose] = state;
        }
        this.display = !store.getters.HAS_ALL_COOKIES_SET();
      });
    },

    acceptAll() {
      store.commit('ENABLE_ALL_COOKIES');
    },

    declineAll() {
      store.commit('DISABLE_ALL_COOKIES');
    },

    save() {
      store.state.consent.set({
        ...store.state.consent.get(),
        ...Object.fromEntries(purposes.map(purpose => [purpose, !!this[purpose]])),
        functional: true,
      });
    },

    show() {
      this.display = true;
    },

    hide() {
      this.display = false;
    }
  });

  if (config.reactive) {
    Alpine.effect(() => {
      for (const purpose of purposes) {
        const state = Alpine.store('anshin')[purpose];

        if (state !== null && state !== store.state.consent.get()[purpose]) {
          store.state.consent.set({
            ...store.state.consent.get(),
            [purpose]: !!state,
          });
        }
      }
    });
  }
}

function resolveOptions(options: Partial<PluginOptions>): PluginOptions {
  return {
    reactive: false,
    ...options,
  };
}

