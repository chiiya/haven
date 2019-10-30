export const injectFacebookPixel = (id: string) => {
  if (hasLoadedFacebookPixel()) {
    return;
  }

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

  window.fbq('init', id);
  window.fbq('track', 'PageView');
};

export const hasLoadedFacebookPixel = () => {
  const src = 'https://connect.facebook.net/en_US/fbevents.js';
  return document.querySelector(`script[src="${src}"`) !== null;
};