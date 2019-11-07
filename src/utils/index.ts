import store from '../store';
import { Purpose } from '../types';

/**
 * Get the localized string for a given key.
 * @param key
 */
export const trans = (key: string) => {
  const translation = store.translations[store.lang];
  if (translation === undefined) {
    console.error(`HAVEN: No translations found for language \`${store.lang}\``);
    return undefined;
  }
  const partials = key.split('.');
  let result: any = translation;
  for (const partial of partials) {
    if (!result[partial]) {
      return undefined;
    }
    result = result[partial];
  }

  return result;
};

/**
 * Get all purposes used by services in the application.
 */
export const getAllPurposes = (): Purpose[] => {
  if (store.purposes) {
    return store.purposes;
  }
  const purposes = store.services.map(service => service.purposes || []).flat();
  return [...new Set([...purposes])];
};

/**
 * Check whether a value is an object.
 * @param item
 */
export function isObject(item: any) {
  return (item && typeof item === 'object' && !Array.isArray(item));
}

/**
 * Deep-merge two objects (immutable).
 * @param target
 * @param source
 */
export function mergeDeep(target: any, source: any) {
  const output = Object.assign({}, target);
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key) => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] });
        } else {
          output[key] = mergeDeep(target[key], source[key]);
        }
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  return output;
}

/**
 * Check whether a script has been loaded already.
 * @param src
 */
export function hasLoadedScript(src: string) {
  return document.querySelector(`script[src="${src}"]`) !== null;
}
