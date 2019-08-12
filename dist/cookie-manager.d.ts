import { CookieAttributes } from 'js-cookie';
import { ConsentCallbacks, ConsentType, CookieConsentOptions } from '../types';
export default class CookieManager {
    protected type: ConsentType;
    protected prefix: string;
    protected callbacks: ConsentCallbacks | undefined;
    constructor({ prefix, type, callbacks }?: CookieConsentOptions);
    static getCookie(name: string): string | undefined;
    static setCookie(name: string, value: string, options?: CookieAttributes): void;
    static removeCookie(name: string): void;
    static cookieExists(name: string): boolean;
    enableFunctionalCookie(): void;
    disableFunctionalCookie(): void;
    hasFunctionalCookie(): boolean;
    enableAnalyticsCookie(): void;
    disableAnalyticsCookie(): void;
    hasAnalyticsEnabled(): boolean;
    enableMarketingCookie(): void;
    disableMarketingCookie(): void;
    hasMarketingEnabled(): boolean;
    acceptAll(): void;
}
