import CookieManager from './cookie-manager';
import { Configuration } from '../types';
export default class CookieNotification {
    protected cookieManager: CookieManager;
    protected cookieNotification: HTMLElement | null;
    protected cookiesAccept: HTMLElement | null;
    protected cookiesDecline: HTMLElement | null;
    constructor(options: Configuration);
    init(): void;
    showCookieNotification(): void;
    hideCookieNotification(): void;
}
