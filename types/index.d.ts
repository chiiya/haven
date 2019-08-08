export interface CookieConsentOptions {
  prefix?: string;
  gaId?: string;
  type?: ConsentType;
}

export type ConsentType = 'opt-in' | 'opt-out';
