import { Configuration, CookieConsentOptions } from '../types';
export default class ConfigurationResolver {
    static resolve(options: CookieConsentOptions): Configuration;
    protected static getDomain(): string | undefined;
}
