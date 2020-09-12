import { AnshinPlugin, PluginParameters } from '@anshin/types';
import NotificationComponent from './components/notification';
import { Options } from './types';
import { resolveOptions } from './helpers/options';

export function CookieNotification(options: Partial<Options> = {}): AnshinPlugin {

  const config = resolveOptions(options);

  function register(parameters : PluginParameters) {
    if (/complete|interactive|loaded/.test(document.readyState)) {
      new NotificationComponent(parameters, config);
    } else {
      document.addEventListener('DOMContentLoaded', () => {
        new NotificationComponent(parameters, config);
      });
    }
  }

  const self: AnshinPlugin = {
    register,
  };

  return Object.freeze(self);
}
