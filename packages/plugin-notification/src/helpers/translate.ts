import { Options } from '../types';

export function translate(options: Options, key: string): string | undefined {
  const translations = options.translations;
  const lang = options.lang || 'en';

  if (translations === undefined || !translations[lang]) {
    console.error(`HAVEN: No translations found for language \`${lang}\``);
    return undefined;
  }

  const translation = translations[lang];

  const partials = key.split('.');
  let result: any = translation;
  for (const partial of partials) {
    if (!result[partial]) {
      console.warn(`HAVEN: Missing translation value: \`${key}\``);
      return undefined;
    }
    result = result[partial];
  }

  return result;
}
