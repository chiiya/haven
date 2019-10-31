import { Service } from './service';

export default class FacebookPixel implements Service {
  protected id: string;

  constructor(id: string) {
    this.id = id;
  }

  inject() {
    if (this.hasBeenInjected()) {
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

    window.fbq('init', this.id);
    window.fbq('track', 'PageView');
  }

  hasBeenInjected(): boolean {
    const src = 'https://connect.facebook.net/en_US/fbevents.js';
    return document.querySelector(`script[src="${src}"`) !== null;
  }
}
