import { HavenOptions, Purpose } from '../../types';
import translations from '../translations';

const store: HavenOptions = {
  prefix: 'cookies',
  domains: [],
  cookies: [],
  lang: 'en',
  type: 'opt-in',
  services: [],
  notification: {
    position: 'bottom',
    policyUrl: '/cookie-policy',
    styles: {
      background: '#702459',
      textColor: '#FFF',
      buttonBackgroundColor: '#F1D600',
      buttonBackgroundColorHover: '#F6E05E',
      buttonTextColor: '#FFF',
    },
  },
  translations: translations,
};

export default store;
