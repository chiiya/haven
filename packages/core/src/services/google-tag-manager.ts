import { AnshinServiceOptions } from '@anshin/types';
import { hasLoadedScript } from '../helpers/dom';

export interface GoogleTagManagerOptions extends AnshinServiceOptions {
  /**
   * Google Tag Manager ID: `GTM-XXXX`
   */
  id?: string;
}

/**
 * Inject the google tag manager service.
 * @param options
 */
export const injectGoogleTagManager = (options: GoogleTagManagerOptions = {}) => {
  // Need an ID to instantiate the service.
  if (options.id === undefined) {
    console.error('GOOGLE_TAG_MANAGER: No ID specified. Please specify an ID using `options.id`.');
    return;
  }

  // Inject the script only once.
  if (hasLoadedScript(`https://www.googletagmanager.com/gtm.js?id=${options.id}`)) {
    return;
  }

  injectScript(options);
};

/**
 * Inject the google tag manager script tag.
 */
const injectScript = (options: GoogleTagManagerOptions) => {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'gtm.js',
    'gtm.start': new Date().getTime(),
  });
  const firstScript = document.getElementsByTagName('script')[0];
  const script = document.createElement('script');
  script.src = `https://www.googletagmanager.com/gtm.js?id=${options.id}`;
  firstScript.parentNode!.insertBefore(script, firstScript);
};
