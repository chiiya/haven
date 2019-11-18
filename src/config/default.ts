import { HavenOptions } from '../types';
import translations from '../translations';

const config: HavenOptions = {
  prefix: 'consent',
  domains: [],
  cookies: {},
  lang: 'en',
  type: 'opt-in',
  services: [],
  notification: {
    position: 'bottom',
    includePolicyUrl: false,
    policyUrl: '/cookie-policy',
  },
  translations: translations,
};

export default config;
