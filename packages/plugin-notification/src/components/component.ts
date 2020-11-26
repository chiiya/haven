import { AnshinActions, AnshinGetters, AnshinState, PluginParameters } from '@anshin/types';
import { Options } from '../types';
import { EventStore } from '../event-store';

export default abstract class Component {
  protected events = EventStore();
  protected state: AnshinState;
  protected getters: AnshinGetters;
  protected commit: (action: keyof AnshinActions, data?: any) => void;
  protected options: Options;

  public constructor({ store, events }: PluginParameters, options: Options) {
    this.options = options;
    this.getters = store.getters;
    this.state = store.state;
    this.commit = store.commit;
    events.on('consent-updated', () => {
      this.render();
    });
    // Render once since we might not be able to catch the initial state change.
    this.render();
  }

  abstract render(): void;
}
