declare module 'alpinejs' {
  export default class Alpine {
    static store(name: string, state?: Record<string, unknown>): () => void|any;
    static effect(callback: () => void): void;
  }
}
