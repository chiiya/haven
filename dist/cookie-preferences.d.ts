import CookieManager from './cookie-manager';
import { CookieConsentOptions } from '../types';
export default class CookiePreferences {
    protected cookieManager: CookieManager;
    protected checkboxAnalytics: HTMLInputElement | null;
    protected checkboxMarketing: HTMLInputElement | null;
    constructor(options?: CookieConsentOptions);
    init(): void;
}
