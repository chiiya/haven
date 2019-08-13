export interface CookieConsentOptions {
  prefix?: string;
  type?: ConsentType;
  services?: CookieConsentServices;
  callbacks?: ConsentCallbacks;
}

export interface CookieConsentServices {
  ga?: ServiceOptions;
  gtm?: ServiceOptions;
  aam?: boolean;
  navitas?: boolean;
}

export interface ServiceOptions {
  id: string;
}

export interface ConsentCallbacks {
  onAcceptAll?: () => void;
  onFunctionalEnabled?: () => void;
  onAnalyticsEnabled?: () => void;
  onAnalyticsDisabled?: () => void;
  onMarketingEnabled?: () => void;
  onMarketingDisabled?: () => void;
  onServicesLoaded?: () => void;
}

export type ConsentType = 'opt-in' | 'opt-out';
