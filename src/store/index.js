import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

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
    }
  },
  actions: {
    login ({ commit }, token) {
      localStorage.setItem('token', token)
      axios.defaults.headers.common.Authorization = token
      commit('login', token)
    }
  },
  modules: {
  }
})
