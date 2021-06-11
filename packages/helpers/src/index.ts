/**
 * Get a random id.
 */
export function getRandomId(): string {
  return [...Array(5)].map((i) => (~~(Math.random() * 36)).toString(36)).join('');
}

/**
 * Check whether a script has been loaded already.
 */
export function hasLoadedScript(src: string) {
  return document.querySelector(`script[src="${src}"]`) !== null;
}

export * from './deep-merge';
