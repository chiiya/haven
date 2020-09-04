import { Anshin } from '@anshin/core';
import { EventStore } from '../event-store';
import { AnshinStore } from "@anshin/types";
import { Options } from '../types';

export default abstract class Component {
  protected eventStore = EventStore();
  protected store: AnshinStore;
  protected options: Options;

  public constructor(store: AnshinStore, options: Options) {
    this.store = store;
    this.options = options;
    Anshin.on('state-updated', () => {
      this.render();
    });
  }

  abstract render(): void;
}
