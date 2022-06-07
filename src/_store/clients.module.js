import { clientsService } from '@/_services'
import { router } from '@/_helpers';

let user = null;
try {
  user = window.localStorage.getItem("xkhx$$") != null ? JSON.parse(decodeURIComponent(escape(atob(window.localStorage.getItem("xkhx$$"))))) : null;
}catch (error) {
  user = null;
}

const initialState = user ? { status: { loggedIn: true }, user } : { status: {}, user: null };

export const clients = {
  state: initialState,
  namespaced: true,
  actions: {

    create({ dispatch, commit }, args) {
      clientsService.create(args.company, args.website).then(
        clientid => {
          //const user = JSON.parse(localStorage.getItem('user'));
          state.client_id = clientid;
          //localStorage.setItem('user',JSON.stringify(user))
          localStorage.setItem("xkhx$$", btoa(unescape(encodeURIomponent(JSON.stringify(state)))));
          commit('companyCreated', user);
        },
        error => {
          dispatch('alert/error', error, { root: true });
        }
      )

    },
  },
  mutations: {
    companyCreated(state, user) {
      state.status = { loggedIn: true, companyCreated: true };
      state.user = user;

    },
  }
}
