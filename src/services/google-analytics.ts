import { hasLoadedScript } from '../utils';
import { HavenServiceOptions } from '../types';

export const injectGoogleAnalytics = (id: string, options: HavenServiceOptions = {}) => {
  if (hasLoadedScript('https://www.google-analytics.com/analytics.js')) {
    return;
  }

  window.ga = window.ga || function () {
    (window.ga.q = window.ga.q || []).push(arguments);
  };

  window.ga.l = +new Date;

  const firstScript = document.getElementsByTagName('script')[0];
  const script = document.createElement('script');
  script.src = 'https://www.google-analytics.com/analytics.js';
  firstScript.parentNode!.insertBefore(script, firstScript);

  window.ga('create', id, 'auto');
  if (options.anonymizeIp === true) {
    window.ga('set', 'anonymizeIp', true);
  }
  window.ga('send', 'pageview');
};
