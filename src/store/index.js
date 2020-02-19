import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    auth: {
      token: localStorage.getItem('token')
    },
    user: {}
  },
  mutations: {
    login (state, token) {
      state.auth.token = token
    },
    logout (state) {
      state.auth.token = null
    }
  },
  actions: {
    login ({ commit }, token) {
      localStorage.setItem('token', token)
      commit('login', token)
    },
    logout ({ commit }) {
      localStorage.removeItem('token')
      commit('logout')
    }
  },
  modules: {
  }
})
