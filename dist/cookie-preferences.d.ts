import CookieManager from './cookie-manager';
import { CookieConsentOptions } from '../types';
import ServiceLoader from './service-loader';
export default class CookiePreferences {
    protected cookieManager: CookieManager;
    protected serviceLoader: ServiceLoader;
    protected checkboxAnalytics: HTMLInputElement | null;
    protected checkboxMarketing: HTMLInputElement | null;
    protected saveButton: HTMLButtonElement | null;
    protected saveButtonInitialText: string;
    protected saveButtonSavedText: string;
    constructor(options?: CookieConsentOptions);
    init(): void;
    protected enableButton(): void;
    protected disableButton(): void;
}
