export interface EventBusSubscription {
    unsubscribe: Function;
}
declare class EventBus {
    private subscriptions;
    private counter;
    on(event: string, callback: Function): EventBusSubscription;
    emit(event: string, payload?: any): void;
}
declare const _default: EventBus;
export default _default;
