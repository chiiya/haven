import CookieNotification from './cookie-notification';
import CookiePreferences from './cookie-preferences';
import { CookieConsentOptions } from '../types';
import CookieManager from './cookie-manager';
export default class CookieConsent {
    protected cookieManager: CookieManager;
    protected cookieNotification: CookieNotification;
    protected cookiePreferences: CookiePreferences;
    constructor(options?: CookieConsentOptions);
    init(): void;
}
