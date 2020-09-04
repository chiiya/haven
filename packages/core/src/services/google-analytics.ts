import { hasLoadedScript } from '../helpers/dom';
import { AnshinServiceOptions } from '@anshin/types';

export interface GoogleAnalyticsOptions extends AnshinServiceOptions {
  /**
   * Google Analytics tracking ID: `UA-XXXXX-Y`
   */
  id?: string;
  /**
   * Set this to false to disable pseudonymisation of IP addresses.
   * Anshin enables this behaviour by default!
   */
  anonymizeIp?: boolean;
  /**
   * Custom tracker name. Useful when working with multiple trackers on the same page.
   */
  name?: string;
}

/**
 * Inject google analytics service.
 * @param options
 */
export const injectGoogleAnalytics = (options: GoogleAnalyticsOptions = {}) => {
  // Need an ID to instantiate the service.
  if (options.id === undefined) {
    console.error('GOOGLE_ANALYTICS: No ID specified. Please specify an ID using `options.id`.');
    return;
  }

  // Inject the script only once.
  if (!hasLoadedScript('https://www.google-analytics.com/analytics.js')) {
    injectScript();
  }

  if (options.name !== undefined) {
    createNamedTracker(options);
  } else {
    createDefaultTracker(options);
  }
};

/**
 * Inject the google analytics script tag.
 */
const injectScript = () => {
  window.ga = window.ga || function () {
    (window.ga.q = window.ga.q || []).push(arguments);
  };

  window.ga.l = +new Date;

  const firstScript = document.getElementsByTagName('script')[0];
  const script = document.createElement('script');
  script.src = 'https://www.google-analytics.com/analytics.js';
  firstScript.parentNode!.insertBefore(script, firstScript);
};

/**
 * Create a named google analytics tracker.
 * Useful when having multiple trackers.
 * @param options
 */
const createNamedTracker = (options: GoogleAnalyticsOptions) => {
  window.ga('create', options.id, 'auto', options.name);
  if (options.anonymizeIp !== false) {
    window.ga(`${options.name}.set`, 'anonymizeIp', true);
  }
  window.ga(`${options.name}.send`, 'pageview');
};

/**
 * Create the default google analytics tracker.
 * @param options
 */
const createDefaultTracker = (options: GoogleAnalyticsOptions) => {
  window.ga('create', options.id, 'auto');
  if (options.anonymizeIp !== false) {
    window.ga('set', 'anonymizeIp', true);
  }
  window.ga('send', 'pageview');
};
