import Alpine from 'alpinejs';
import { AnshinPlugin, AnshinStore, PluginParameters, Purpose } from '@anshin/types';

export interface PluginOptions {
  display: string;
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
    display: 'none',

    init() {
      store.state.consent.subscribe((consent) => {
        for (const [purpose, state] of Object.entries(consent)) {
          this[purpose] = state;
        }
        this.display = Object.values(consent).some((status) => status === null)
          ? config.display
          : 'none';
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
        functional: true,
        ...Object.fromEntries(purposes.map(purpose => [purpose, !!this[purpose]])),
      });
    },

    show() {
      this.display = 'block';
    },

    hide() {
      this.display = 'none';
    }
  });

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
  })
}


function resolveOptions(options: Partial<PluginOptions>): PluginOptions {
  return {
    display: 'block',
    ...options,
  };
}

