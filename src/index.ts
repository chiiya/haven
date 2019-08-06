import CookieManager from './cookie-manager';
import CookieNotification from './cookie-notification';
import CookiePreferences from './cookie-preferences';
import CookieConsent from './cookie-consent';

export { CookieManager, CookieNotification, CookiePreferences, CookieConsent };

const init = () => {
  const consent = new CookieConsent();
  consent.init();
};

export default init;
