/**
 * Check whether a script has been loaded already.
 * @param src
 */
export function hasLoadedScript(src: string) {
  return document.querySelector(`script[src="${src}"]`) !== null;
}
