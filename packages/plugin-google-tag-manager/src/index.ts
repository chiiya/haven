import { AnshinPlugin, AnshinStore, AtLeast, PluginParameters, Purpose } from '@anshin/types';

export type GTMPurpose =
  'ad_storage'
  | 'analytics_storage'
  | 'functionality_storage'
  | 'personalization_storage'
  | 'security_storage';

export interface PluginOptions {
  /**
   * Google Tag Manager ID: `GTM-XXXX`.
   */
  id: string;

  /**
   * Enable GTM consent mode.
   * Defaults to `false`.
   * @see https://support.google.com/analytics/answer/9976101
   */
  consentMode: boolean;

  /**
   * Further redact ads data.
   * Defaults to `true`.
   * @see https://developers.google.com/tag-platform/devguides/consent#redact_ads_data
   */
  adsDataRedaction: boolean;

  /**
   * Map your custom purposes to GTM compatible purposes for consent mode.
   * Only necessary in case you use other purposes than the default ones.
   * @see https://support.google.com/tagmanager/answer/10718549#consent-types
   */
  purposeMappings: Record<Purpose, GTMPurpose>
}

export function GoogleTagManager(options: AtLeast<PluginOptions, 'id'>): AnshinPlugin {
  const config: PluginOptions = resolveOptions(options);

  function register(parameters: PluginParameters) {
    initGTM(config, parameters.store);
  }

  const self = {
    register,
  };

  return Object.freeze(self);
}

export function initGTM(options: PluginOptions, store: AnshinStore): void {
  const purposes: Purpose[] = ['functional', ...store.getters.GET_PURPOSES()];

  injectScript(options);

  store.state.consent.subscribe((consent) => {
    (<any>window).dataLayer.push({
      event: 'consent_updated',
      ...consent,
    });
    if (options.consentMode) {
      const consentValues = [
        ...new Map(
          purposes.map(item => [options.purposeMappings[item], consent[item] ? 'granted' : 'denied'])
        ).entries()
      ];
      gtag('consent', 'update', Object.fromEntries(consentValues));
    }
  });
}

/**
 * Resolve user specified config with default values
 */
function resolveOptions(options: AtLeast<PluginOptions, 'id'>): PluginOptions {
  const config = {
    consentMode: false,
    adsDataRedaction: true,
    purposeMappings: {},
    ...options,
  };

  config.purposeMappings = {
    functional: 'security_storage',
    analytics: 'analytics_storage',
    marketing: 'ad_storage',
    preferences: 'functionality_storage',
    ...(options.purposeMappings || {}),
  }

  return config;
}

function gtag(..._args: unknown[]) {
  (<any>window).dataLayer.push(arguments);
}

/**
 * Inject the GTM script tag.
 */
const injectScript = (options: PluginOptions) => {
  // Need an ID to instantiate the service.
  if (!options.id) {
    console.error(
      'GOOGLE_TAG_MANAGER: No ID specified'
    );
    return;
  }

  (<any>window).dataLayer = (<any>window).dataLayer || [];

  if (options.consentMode) {
    gtag('consent', 'default', {
      ad_storage: 'denied',
      analytics_storage: 'denied',
      wait_for_update: 500,
    });
    gtag('set', 'ads_data_redaction', options.adsDataRedaction);
  }

  (<any>window).dataLayer.push({
    event: 'gtm.js',
    'gtm.start': new Date().getTime(),
  });
  const firstScript = document.getElementsByTagName('script')[0];
  const script = document.createElement('script');
  script.src = `https://www.googletagmanager.com/gtm.js?id=${options.id}`;
  firstScript.parentNode?.insertBefore(script, firstScript);
};

