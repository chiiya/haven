import CookieManager from './cookie-manager';
import { Configuration } from '../types';
export default class CookiePreferences {
    protected cookieManager: CookieManager;
    protected checkboxAnalytics: HTMLInputElement | null;
    protected checkboxMarketing: HTMLInputElement | null;
    protected saveButton: HTMLButtonElement | null;
    protected saveButtonInitialText: string;
    protected saveButtonSavedText: string;
    constructor(options: Configuration);
    init(): void;
    protected enableButton(): void;
    protected disableButton(): void;
}
