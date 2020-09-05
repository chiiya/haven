/**
 * Get a random id.
 */
export function getRandomId(): string {
  return [...Array(5)].map(i=>(~~(Math.random()*36)).toString(36)).join('');
}
