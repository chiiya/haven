interface EventBusSubscriptions {
  [name: string]: {
    [id: string]: Function;
  };
}

export interface EventBusSubscription {
  unsubscribe: Function;
}

export interface EventBus {
  on(event: string, callback: Function): EventBusSubscription;
  emit(event: string, payload?: any): void;
}
