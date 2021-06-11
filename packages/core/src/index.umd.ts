import Cookies from './cookies';
import Anshin from './anshin';
export * from './store';

if (typeof window !== 'undefined') {
  (window as any).Anshin = Anshin;
  (window as any).Cookies = Cookies;
}

export { Cookies, Anshin };
