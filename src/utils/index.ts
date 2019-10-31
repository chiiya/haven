import store from '../store';

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
export const getAllPurposes = (): string[] => {
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
