import CookieNotification from './cookie-notification';
import CookiePreferences from './cookie-preferences';
import { CookieConsentOptions } from '../types';
export default class CookieConsent {
    protected cookieNotification: CookieNotification;
    protected cookiePreferences: CookiePreferences;
    constructor(options?: CookieConsentOptions);
    init(): void;
}
