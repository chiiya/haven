import CookieNotification from './cookie-notification';
import CookiePreferences from './cookie-preferences';
import CookieManager from './cookie-manager';
import ServiceLoader from './service-loader';
import { Configuration, CookieConsentOptions } from '../types';
import { EventBusSubscription } from './event-bus';
import ConsentRevoke from './consent-revoke';
declare global {
    const Haven: typeof CookieConsent;
}
export default class CookieConsent {
    protected options: Configuration;
    protected cookieNotification: CookieNotification;
    protected cookiePreferences: CookiePreferences;
    protected cookieManager: CookieManager;
    protected serviceLoader: ServiceLoader;
    protected consentRevoke: ConsentRevoke;
    constructor(options?: CookieConsentOptions);
    init(): void;
    protected checkInitialState(): void;
    protected registerDefaultListeners(): void;
    static on(event: string, callback: Function): EventBusSubscription;
    static create(options?: CookieConsentOptions): CookieConsent;
}
