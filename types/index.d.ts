export interface CookieConsentOptions {
  prefix?: string;
  gtmId?: string;
  gaId?: string;
  type?: ConsentType;
}

export type ConsentType = 'opt-in' | 'opt-out';
