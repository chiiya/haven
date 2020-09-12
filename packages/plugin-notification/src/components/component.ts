import { AnshinActions, AnshinStore, PluginParameters } from '@anshin/types';
import { GetState } from 'zustand/vanilla';
import { Options } from '../types';
import { EventStore } from '../event-store';

export default abstract class Component {
  protected events = EventStore();
  protected state: GetState<AnshinStore>;
  protected commit: (action: keyof AnshinActions, data?: any) => void;
  protected options: Options;

  public constructor({ store, commit, events}: PluginParameters, options: Options) {
    const { getState, subscribe } = store;
    this.options = options;
    this.commit = commit;
    this.state = getState;
    subscribe(() => {
      this.render();
    }, state => state.consent);
    // Render once since we might not be able to catch the initial state change.
    this.render();
  }

  abstract render(): void;
}
