import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    auth: {
      token: localStorage.getItem('token') || undefined
    },
    user: {}
  },
  mutations: {
  },
  actions: {
    login ({ commit }, user) {
      return new Promise((resolve, reject) => {
        axios({ url: process.env.VUE_APP_URL + '/users/auth/login', data: user, method: 'POST' })
          .then(resp => {
            const token = resp.data.data.access_token
            localStorage.setItem('token', token)
            axios.defaults.headers.common.Authorization = token
            commit('auth_success', token)
            resolve(resp)
          })
          .catch(err => {
            commit('auth_error')
            localStorage.removeItem('token')
            reject(err)
          })
      })
    }
  },
  modules: {
  }
})
