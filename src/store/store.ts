import EventBus from './event-bus';
import {
  ActionsContext,
  ActionsObject,
  Getters,
  GettersObject,
  MutationsObject,
  StoreOptions,
} from '../types';

enum StoreState {
  DEFAULT,
  MUTATION,
  ACTION,
}

export default class Store<S extends object = any> {
  private _state: S;
  public readonly getters: Getters = {};
  private readonly mutations: MutationsObject<S>;
  private readonly actions: ActionsObject<ActionsContext<S>>;
  private status: StoreState = StoreState.DEFAULT;

  public constructor({ state,  getters, mutations, actions }: StoreOptions<S>) {
    this._state = new Proxy<S>(state, {
      set: (state, key: keyof S, value) => {
        if (this.status !== StoreState.MUTATION) {
          console.error('Use a mutation to update state');
          return false;
        }

        state[key] = value;
        EventBus.emit('state-updated');
        this.status = StoreState.DEFAULT;

        return true;
      }
    });
    this.initGetters(getters || {});
    this.mutations = mutations || {};
    this.actions = actions || {};
  }

  get state(): S {
    return this._state;
  }

  /**
   * Initialize getters, binding them to the state.
   * @param getters
   */
  protected initGetters(getters: GettersObject<S>) {
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
  public commit(mutation: string, payload: any) {
    if (!this.mutations[mutation]) {
      console.error(`Mutation ${mutation} not found.`);
    }

    this.status = StoreState.MUTATION;
    const newState = this.mutations[mutation](this._state, payload);
    this._state = Object.assign(this._state, newState);
  }

  /**
   * Dispatch an action.
   * @param action
   * @param payload
   */
  public dispatch(action: string, payload: any) {
    if (!this.actions[action]) {
      console.error(`Action ${action} not found.`);
    }

    this.status = StoreState.ACTION;
    const context = {
      state: this.state,
      getters: this.getters,
      commit: this.commit,
      dispatch: this.dispatch,
    };
    this.actions[action](context, payload);
  }
}

