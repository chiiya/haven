import { AnshinService, AnshinServiceOptions } from '@anshin/types';
import { getRandomId, hasLoadedScript } from '@anshin/helpers';

export interface GoogleTagManagerOptions extends AnshinServiceOptions {
  /**
   * Google Tag Manager ID: `GTM-XXXX`
   */
  id?: string;
}

type Options = AnshinService & { options: GoogleTagManagerOptions };

/**
 * Inject the google tag manager script tag.
 */
const injectScript = (options: GoogleTagManagerOptions) => {
  (<any>window).dataLayer = (<any>window).dataLayer || [];
  (<any>window).dataLayer.push({
    event: 'gtm.js',
    'gtm.start': new Date().getTime(),
  });
  const firstScript = document.getElementsByTagName('script')[0];
  const script = document.createElement('script');
  script.src = `https://www.googletagmanager.com/gtm.js?id=${options.id}`;
  firstScript.parentNode!.insertBefore(script, firstScript);
};

export function GoogleTagManager(options: Partial<Options> = {}): AnshinService {
  const defaults: AnshinService = {
    name: `google-tag-manager-${getRandomId()}`,
    purposes: ['analytics'],
    title: 'Google Tag Manager',
    cookies: ['_ga', '_gid', '_gat', '_gcl_au', 'AMP_TOKEN', /_dc_gtm_/, /_gac_/, /_gat_gtag_/, /_gat_/],
    required: false,
    options: {},
    inject() {
      // Need an ID to instantiate the service.
      if (!options?.options?.id) {
        console.error('GOOGLE_TAG_MANAGER: No ID specified. Please specify an ID using `options.id`.');
        return;
      }

      // Inject the script only once.
      if (hasLoadedScript(`https://www.googletagmanager.com/gtm.js?id=${options.options.id}`)) {
        return;
      }

      injectScript(options.options);
    },
  };

  return Object.freeze(Object.assign(defaults, options));
}
