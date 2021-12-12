interface EventBusSubscriptions {
  [name: string]: {
    [id: string]: (payload?: string) => void;
  };
}

export interface EventBusSubscription {
  unsubscribe: () => void;
}

export interface EventBus {
  on(event: string, callback: (payload?: string) => void): EventBusSubscription;
  emit(event: string, payload?: string): void;
}
