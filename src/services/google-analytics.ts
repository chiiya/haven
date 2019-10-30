export const injectGoogleAnalytics = (id: string) => {
  if (hasLoadedGoogleAnalytics()) {
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
  window.ga('send', 'pageview');
};

export const hasLoadedGoogleAnalytics = () => {
  const src = 'https://www.google-analytics.com/analytics.js';
  return document.querySelector(`script[src="${src}"`) !== null;
};
