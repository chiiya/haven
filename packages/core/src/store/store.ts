import { Store } from '@anshin/types';

export function store<T>(value: T): Store<T> {
  let _val = value;
  let counter = 0;
  const subs: { [id: string]: Function } = {};

  const subscribe = (callback: (val: T) => void) => {
    const id = counter += 1;
    subs[id] = callback;
    callback(_val);

    return () => {
      delete subs[id];
    };
  };

  const set = (v: T) => {
    _val = v;
    for (const id of Object.keys(subs)) {
      subs[id](_val);
    }
  };

  const update = (callback: (val: T) => T) => set(callback(_val));
  const get = () => _val;

  return { subscribe, set, update, get };
}
