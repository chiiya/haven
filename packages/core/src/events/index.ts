import { EventBusSubscription, EventBusSubscriptions, EventBus as IEventBus } from '@anshin/types';

class EventBus implements IEventBus {
  private subscriptions: EventBusSubscriptions = {};
  private counter: number = 0;

  /**
   * Register a new callback
   */
  on(event: string, callback: Function): EventBusSubscription {
    const id = (this.counter += 1);
    if (this.subscriptions[event] === undefined) {
      this.subscriptions[event] = {};
    }

    this.subscriptions[event][id] = callback;

    return {
      unsubscribe: () => {
        delete this.subscriptions[event][id];
      },
    };
  }

  /**
   * Emit a new event
   */
  emit(event: string, payload?: any): void {
    if (this.subscriptions[event] === undefined) {
      return;
    }

    for (const id of Object.keys(this.subscriptions[event])) {
      this.subscriptions[event][id](payload);
    }
  }
}

export default new EventBus();
