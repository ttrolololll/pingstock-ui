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
    },
    logout (state) {
      state.auth.token = null
      state.user = {}
    },
    set_user (state, user) {
      state.user = user
    },
    update_user_profile (state, user) {
      state.user.first_name = user.first_name
      state.user.last_name = user.last_name
      state.user.email = user.email
    },
    remove_user_payment_method (state) {
      state.user.card_brand = null
      state.user.card_last_four = null
    },
    update_user_facebook_id (state, fbID) {
      state.user.facebook_id = fbID
    }
  },
  actions: {
    login ({ commit }, token) {
      localStorage.setItem('token', token)
      axios.defaults.headers.common.Authorization = 'Bearer ' + localStorage.getItem('token')
      commit('login', token)
    },
    logout ({ commit }) {
      localStorage.removeItem('token')
      commit('logout')
    },
    set_user ({ commit }, user) {
      commit('set_user', user)
    },
    update_user_profile ({ commit }, user) {
      commit('update_user_profile', user)
    },
    remove_user_payment_method ({ commit }) {
      commit('remove_user_payment_method')
    },
    update_user_facebook_id ({ commit }, fbID) {
      commit('update_user_facebook_id', fbID)
    }
  },
  modules: {
  }
})
