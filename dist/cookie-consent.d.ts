import CookieNotification from './cookie-notification';
import CookiePreferences from './cookie-preferences';
import CookieManager from './cookie-manager';
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
    constructor(options?: CookieConsentOptions);
    init(): void;
    static create(options?: CookieConsentOptions): CookieConsent;
    protected loadGtm(): void;
}
