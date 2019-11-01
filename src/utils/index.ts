import store from '../store';
import { Purpose } from '../../types';

/**
 * Get the localized string for a given key.
 * @param key
 */
export const trans = (key: string) => {
  const translation = store.translations[store.lang];
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
  const purposes = [];
  for (const service of store.services) {
    const servicePurposes = service.purposes || [];
    for (const purpose of servicePurposes) {
      if (purposes.indexOf(purpose) === -1) {
        purposes.push(purpose);
      }
    }
  }

  return purposes;
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
