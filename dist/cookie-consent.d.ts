import CookieNotification from './cookie-notification';
import CookiePreferences from './cookie-preferences';
import CookieManager from './cookie-manager';
import ServiceLoader from './service-loader';
import { CookieConsentOptions } from '../types';
declare global {
    interface Window {
        dataLayer: any;
    }
}
export default class CookieConsent {
    protected options: CookieConsentOptions;
    protected cookieNotification: CookieNotification;
    protected cookiePreferences: CookiePreferences;
    protected cookieManager: CookieManager;
    protected serviceLoader: ServiceLoader;
    constructor(options?: CookieConsentOptions);
    init(): void;
    static create(options?: CookieConsentOptions): CookieConsent;
}
