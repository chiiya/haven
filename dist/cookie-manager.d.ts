import { CookieAttributes } from 'js-cookie';
import { CookieConsentOptions } from '../types';
export default class CookieManager {
    protected prefix: string;
    constructor({ prefix }?: CookieConsentOptions);
    static getCookie(name: string): string | undefined;
    static setCookie(name: string, value: string, options: CookieAttributes): void;
    static removeCookie(name: string): void;
    static cookieExists(name: string): boolean;
    setFunctionalCookie(enabled: boolean): void;
    hasFunctionalCookie(): boolean;
    setAnalyticsCookie(enabled: boolean): void;
    hasAnalyticsCookie(): boolean;
    setMarketingCookie(enabled: boolean): void;
    hasMarketingCookie(): boolean;
    acceptAll(): void;
}
