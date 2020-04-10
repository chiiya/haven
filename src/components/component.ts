import EventBus from '../events/event-bus';
import { EventStore } from '../events/store';

export default abstract class Component {
  protected element: HTMLElement;
  protected eventStore = EventStore();

  public constructor(element: HTMLElement) {
    EventBus.on('state-updated', () => this.render());
    this.element = element;
  }

  abstract render(): void;
}
