export const injectGoogleTagManager = (id: string) => {
  if (hasLoadedGoogleTagManager(id)) {
    return;
  }

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'gtm.js',
    'gtm.start': new Date().getTime(),
  });
  const firstScript = document.getElementsByTagName('script')[0];
  const script = document.createElement('script');
  script.src = `https://www.googletagmanager.com/gtm.js?id=${id}`;
  firstScript.parentNode!.insertBefore(script, firstScript);
};

export const hasLoadedGoogleTagManager = (id: string) => {
  const src = `https://www.googletagmanager.com/gtm.js?id=${id}`;
  return document.querySelector(`script[src="${src}"`) !== null;
};
