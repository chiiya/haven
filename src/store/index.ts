import state from './state';
import getters from './getters';
import mutations from './mutations';
import actions from './actions';
import Store from './store';

export default new Store({
  state,
  getters,
  mutations,
  actions,
});
