import { HavenOptions, Purpose } from '../../types';
import translations from '../translations';

const store: HavenOptions = {
  prefix: 'cookies',
  domains: [],
  cookies: {},
  lang: 'en',
  type: 'opt-in',
  services: [],
  notification: {
    position: 'bottom',
    policyUrl: '/cookie-policy',
    styles: {
      background: '#3C366B',
      textColor: '#FFF',
      linkColor: '#F7FAFC',
      buttonBackgroundColor: '#F1D600',
      buttonBackgroundColorHover: '#F6E05E',
      buttonTextColor: '#1A202C',
    },
  },
  preferences: {
    styles: {
      textColor: '#666666',
      toggleBorder: '#666666',
      toggleBackground: '#9FD6AE',
      buttonColor: '#FFF',
      buttonBackground: '#3273DC',
      buttonBackgroundHover: '#2F6BCD',
    },
  },
  translations: translations,
};

export default store;
