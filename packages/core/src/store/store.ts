import EventBus from '../events/event-bus';
import {
  MutationsObject,
  State,
  Getters,
  GettersObject,
  ActionsObject,
  ActionsContext,
  AnshinStore,
  MutationType,
  ActionType,
} from '@anshin/types';
import state from './state';
import mutations from './mutations';
import getters from './getters';
import actions from './actions';

export default class Store implements AnshinStore {
  private _state: State;
  private readonly mutations: MutationsObject<State>;
  private readonly actions: ActionsObject<ActionsContext<State>>;
  // @ts-ignore
  public readonly getters: Getters = {};

  public constructor() {
    this._state = state;
    this.mutations = mutations;
    this.initGetters(getters);
    this.actions = actions;
    // bind commit and dispatch to self
    const store = this;
    const { dispatch, commit } = this;
    this.dispatch = function boundDispatch(type, payload) {
      return dispatch.call(store, type, payload);
    };
    this.commit = function boundCommit(type, payload) {
      return commit.call(store, type, payload);
    };
  }

  get state(): State {
    return this._state;
  }

  /**
   * Initialize getters, binding them to the state.
   * @param getters
   */
  protected initGetters(getters: GettersObject<State>) {
    for (const key of Object.keys(getters)) {
      Object.defineProperty(this.getters, key, {
        get: () => getters[key](this._state, this.getters),
      });
    }
  }

  /**
   * Commit a mutation and update state.
   * @param mutation
   * @param payload
   */
  public commit(mutation: MutationType, payload: any) {
    if (!this.mutations[mutation]) {
      console.error(`Mutation ${mutation} not found.`);
    }

    const newState = this.mutations[mutation](this._state, payload);
    this._state = Object.assign(this._state, newState);
    EventBus.emit('state-updated');
  }

  /**
   * Dispatch an action.
   * @param action
   * @param payload
   */
  public dispatch(action: ActionType, payload?: any) {
    if (!this.actions[action]) {
      console.error(`Action ${action} not found.`);
    }

    this.actions[action](this, payload);
  }
}
