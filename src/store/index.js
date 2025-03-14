import { createStore } from 'vuex'

export default createStore({
  state: {
    token            :  null,
    noTokenRequiredBackendUrl : "http://localhost:9085/graphql",
    tokenRequiredBackendUrl   : "http://localhost:8081/graphql",
    redirectTimeout  : 2000,
    appName          : "Wanzami",
    count            : 1500,
    leftDrawer       : true,
    currentYear      : new Date(),
    copyright        : "",
    leftDrawer       : true,
  },
  getters: {
    token: (state) => state.token,
    redirectTimeout: (state) => state.redirectTimeout,
    noAuthBackendUrl: (state) => state.noAuthBackendUrl,
    authBackendUrl: (state) => state.authBackendUrl,
    leftDrawer: state => {
      return state.leftDrawer;
    },
    count: state => {
      return state.count;
    },
    leftDrawer: state => {
      return state.leftDrawer;
    },
  },
  setter: {
    leftDrawer: state => {
      state.leftDrawer = !state.leftDrawer;
    }
  },
  mutations: {
    SET_TOKEN(state, token) {
      state.token = token;
      localStorage.setItem('token', token);
    },
    CLEAR_TOKEN(state) {
      state.token = null;
      localStorage.removeItem('token');
    },
    TOOGLE_LEFT_DRAWER(state) {
      state.leftDrawer = !state.leftDrawer;
    }
  },
  actions: {
    initializeToken({ commit }) {
      const token = localStorage.getItem('token');
      if (token) {
        commit('SET_TOKEN', token);
      }
    },
    setToken({ commit }, token) {
      commit('SET_TOKEN', token);
    },
    clearToken({ commit }) {
      commit('CLEAR_TOKEN');
    },
    toogleLeftDrawer(state) {
      state.leftDrawer = !state.leftDrawer;
    }

  },
  modules: {
  }
}
)

