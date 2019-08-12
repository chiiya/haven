import { CookieConsentOptions, CookieConsentServices } from '../types';
import CookieManager from './cookie-manager';
export default class ServiceLoader {
    protected cookieManager: CookieManager;
    protected services: CookieConsentServices;
    constructor(options?: CookieConsentOptions);
    loadAnalyticsServices(): void;
    destroyAnalyticsServices(): void;
    protected loadGtm(): void;
    protected destroyGtm(): void;
    protected destroyAam(): void;
    protected destroyNavitas(): void;
    protected hasLoadedGtm(): boolean;
}
