import { Configuration, CookieConsentServices } from '../types';
export default class ServiceLoader {
    protected services: CookieConsentServices;
    constructor(options: Configuration);
    loadAnalyticsServices(): void;
    protected loadGtm(): void;
    protected hasLoadedGtm(): boolean;
}
