import { Anshin, FacebookPixel } from '@anshin/core';
import { AnshinPlugin } from '@anshin/types';
import NotificationComponent from './components/notification';
import { Options } from './types';

export function CookieNotification(options: Partial<Options>): AnshinPlugin {

  function register() {
    Anshin.on('dom-loaded', () => {
      new NotificationComponent(Anshin.store(), options);
    });
  }

  const self: AnshinPlugin = {
    register,
  };

  return Object.freeze(self);
}

Anshin.registerPlugin(CookieNotification({}));
Anshin.create({
  services: [
    FacebookPixel({
      options: {
        id: '123123',
      }
    }),
  ]
});
