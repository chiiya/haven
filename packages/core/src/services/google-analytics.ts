import { AnshinService, AnshinServiceOptions } from '@anshin/types';
import { getRandomId, hasLoadedScript } from '@anshin/helpers';

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

type Options = AnshinService & { options: GoogleAnalyticsOptions };

/**
 * Inject the google analytics script tag.
 */
function injectScript() {
  window.ga =
    window.ga ||
    function () {
      (window.ga.q = window.ga.q || []).push(arguments);
    };

  window.ga.l = +new Date();

  const firstScript = document.getElementsByTagName('script')[0];
  const script = document.createElement('script');
  script.src = 'https://www.google-analytics.com/analytics.js';
  firstScript.parentNode!.insertBefore(script, firstScript);
}

/**
 * Create a named google analytics tracker.
 * Useful when having multiple trackers.
 * @param options
 */
function createNamedTracker(options: GoogleAnalyticsOptions) {
  window.ga('create', options.id, 'auto', options.name);
  if (options.anonymizeIp !== false) {
    window.ga(`${options.name}.set`, 'anonymizeIp', true);
  }
  window.ga(`${options.name}.send`, 'pageview');
}

/**
 * Create the default google analytics tracker.
 * @param options
 */
function createDefaultTracker(options: GoogleAnalyticsOptions) {
  window.ga('create', options.id, 'auto');
  if (options.anonymizeIp !== false) {
    window.ga('set', 'anonymizeIp', true);
  }
  window.ga('send', 'pageview');
}

export function GoogleAnalytics(options: Partial<Options> = {}): AnshinService {
  const defaults: AnshinService = {
    name: `google-analytics-${getRandomId()}`,
    purposes: ['analytics'],
    title: 'Google Analytics',
    description:
      'Collects information about the users and their activity on the website for analytics and reporting purposes.',
    cookies: [
      '_ga',
      '_gid',
      '_gat',
      '_gcl_au',
      'AMP_TOKEN',
      /_dc_gtm_/,
      /_gac_/,
      /_gat_gtag_/,
      /_gat_/,
    ],
    required: false,
    options: {},
    inject() {
      // Need an ID to instantiate the service.
      if (!options?.options?.id) {
        console.error(
          'GOOGLE_ANALYTICS: No ID specified. Please specify an ID using `options.id`.'
        );
        return;
      }

      // Inject the script only once.
      if (!hasLoadedScript('https://www.google-analytics.com/analytics.js')) {
        injectScript();
      }

      if (options.options.name !== undefined) {
        createNamedTracker(options.options);
      } else {
        createDefaultTracker(options.options);
      }
    },
  };

  return Object.freeze(Object.assign(defaults, options));
}
