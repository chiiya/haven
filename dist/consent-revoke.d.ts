import { Configuration, CookieConsentServices } from '../types';
export default class ConsentRevoke {
    protected services: CookieConsentServices;
    constructor(options: Configuration);
    destroyAnalyticsServices(): void;
    protected destroyGtm(): void;
    protected destroyAam(): void;
    protected destroyNavitas(): void;
}
