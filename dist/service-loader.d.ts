import { Configuration, CookieConsentServices, InjectableService } from '../types';
export default class ServiceLoader {
    protected inject: InjectableService[];
    protected services: CookieConsentServices;
    constructor(options: Configuration);
    injectServices(): void;
    protected checkForPrerequisite(service: InjectableService): boolean;
    protected loadGtm(): void;
    protected loadGa(): void;
    protected hasLoadedGtm(): boolean;
    protected hasLoadedGa(): boolean;
}
