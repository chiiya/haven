import { State } from '../types';
import translations from '../translations';

const state: State = {
  prefix: 'cookies',
  cookieAttributes: { expires: 395 },
  domains: [],
  cookies: {},
  lang: 'en',
  type: 'opt-in',
  services: [],
  notification: {
    options: {
      positionX: 'left',
      positionY: 'top',
      policyUrl: '/cookie-policy',
      includePolicyUrl: true,
    },
  },
  translations: translations,
  consent: {},
  injected: {},
};

export default state;
