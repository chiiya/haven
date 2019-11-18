import { hasLoadedScript } from '../helpers/dom';
import { HavenServiceOptions } from '../types';

export interface FacebookPixelOptions extends HavenServiceOptions {
  /**
   * Facebook Pixel id
   */
  id?: string;
}

/**
 * Inject facebook pixel service.
 * @param options
 */
export const injectFacebookPixel = (options: FacebookPixelOptions = {}) => {
  // Need an ID to instantiate the service.
  if (options.id === undefined) {
    console.error('FACEBOOK_PIXEL: No ID specified. Please specify an ID using `options.id`.');
    return;
  }

  // Inject the script only once.
  if (!hasLoadedScript('https://connect.facebook.net/en_US/fbevents.js')) {
    injectScript();
  }

  // Instantiate pixel instance and send initial page view.
  window.fbq('init', options.id);
  window.fbq('track', 'PageView');
};

/**
 * Inject the facebook pixel script tag.
 */
const injectScript = () => {
  if (window.fbq) {
    return;
  }

  const fb: any = window.fbq = function () {
    fb.callMethod ? fb.callMethod.apply(fb, arguments) : fb.queue.push(arguments);
  };

  if (!window._fbq) {
    window._fbq = fb;
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
