import { Configuration, CookieConsentServices } from '../types';
import CookieManager from './cookie-manager';
export default class ServiceLoader {
    protected cookieManager: CookieManager;
    protected options: Configuration;
    protected services: CookieConsentServices;
    constructor(options: Configuration);
    loadAnalyticsServices(): void;
    destroyAnalyticsServices(): void;
    protected loadGtm(): void;
    protected destroyGtm(): void;
    protected destroyAam(): void;
    protected destroyNavitas(): void;
    protected hasLoadedGtm(): boolean;
}
