import CookieManager from './cookie-manager';
import { CookieConsentOptions } from '../types';
import ServiceLoader from './service-loader';
export default class CookieNotification {
    protected cookieManager: CookieManager;
    protected serviceLoader: ServiceLoader;
    protected cookieNotification: HTMLElement | null;
    protected cookiesAccept: HTMLElement | null;
    protected cookiesDecline: HTMLElement | null;
    constructor(options?: CookieConsentOptions);
    init(): void;
    showCookieNotification(): void;
    hideCookieNotification(): void;
}
