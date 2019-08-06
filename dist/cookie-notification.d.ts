import CookieManager from './cookie-manager';
import { CookieConsentOptions } from '../types';
export default class CookieNotification {
    protected cookieManager: CookieManager;
    protected cookieNotification: HTMLElement | null;
    protected cookiesAccept: HTMLElement | null;
    protected cookiesDecline: HTMLElement | null;
    constructor(options?: CookieConsentOptions);
    init(): void;
    showCookieNotification(): void;
    hideCookieNotification(): void;
}
