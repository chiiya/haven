import { AnshinService, AnshinServiceOptions } from '@anshin/types';
import { getRandomId, hasLoadedScript } from '@anshin/helpers';

export interface FacebookPixelOptions extends AnshinServiceOptions {
  /**
   * Facebook Pixel id
   */
  id?: string;
}

type Options = AnshinService & { options: FacebookPixelOptions };

/**
 * Inject the facebook pixel script tag.
 */
const injectScript = () => {
  if ((<any>window).fbq) {
    return;
  }

  const fb: any = ((<any>window).fbq = function () {
    fb.callMethod ? fb.callMethod.apply(fb, arguments) : fb.queue.push(arguments);
  });

  if (!(<any>window)._fbq) {
    (<any>window)._fbq = fb;
  }

  fb.push = fb;
  fb.loaded = true;
  fb.version = '2.0';
  fb.queue = [];

  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://connect.facebook.net/en_US/fbevents.js';
  const firstScript = document.getElementsByTagName('script')[0];
  firstScript.parentNode!.insertBefore(script, firstScript);
};

export function FacebookPixel(options: Partial<Options> = {}): AnshinService {
  const defaults: AnshinService = {
    name: `facebook-pixel-${getRandomId()}`,
    purposes: ['marketing', 'analytics'],
    title: 'Facebook Pixel',
    description:
      'Identifies browsers for the purposes of providing advertising and site analytics services.',
    cookies: ['_fbp'],
    required: false,
    options: {},
    inject() {
      // Need an ID to instantiate the service.
      if (!options?.options?.id) {
        console.error('FACEBOOK_PIXEL: No ID specified. Please specify an ID using `options.id`.');
        return;
      }

      // Inject the script only once.
      if (!hasLoadedScript('https://connect.facebook.net/en_US/fbevents.js')) {
        injectScript();
      }

      // Instantiate pixel instance and send initial page view.
      (<any>window).fbq('init', options.options.id);
      (<any>window).fbq('track', 'PageView');
    },
  };

  return Object.freeze(Object.assign(defaults, options));
}
