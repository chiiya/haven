declare module 'alpinejs' {
  export default class Anshin {
    static store(name: string, state?: Record<string, unknown>): () => void|any;
    static effect(callback: () => void): void;
  }
}
