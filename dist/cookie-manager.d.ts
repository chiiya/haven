import { CookieAttributes } from 'js-cookie';
import { ConsentType, CookieManagerOptions } from '../types';
export default class CookieManager {
    protected type: ConsentType;
    protected prefix: string | undefined;
    constructor({ prefix, type }?: CookieManagerOptions);
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
    protected getPrefixedCookieName(name: string): string;
}
