import { deepmerge } from '@anshin/helpers';
import { Options } from '../types';

export function resolveOptions(options: Partial<Options>): Options {
  return deepmerge({
    lang: 'en',
    notification: {
      positionX: 'left',
      positionY: 'top',
      includePolicyUrl: false,
    },
    translations: {
      en: {
        notification: {
          message: 'This website uses cookies to ensure you get the best experience on our website.',
          policy: 'Learn more →',
          accept: 'Allow',
          decline: 'Decline',
          configure: 'Configure cookies',
        },
      },
    },
  }, options);
}
