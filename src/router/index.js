import Vue from 'vue'
import VueRouter from 'vue-router'
import _ from 'lodash'
import { ToastProgrammatic as Toast } from 'buefy'
import DefaultLayout from '../layouts/DefaultLayout.vue'
import AuthLayout from '../layouts/AuthLayout.vue'
import store from '../store'
import pingstock from '../services/pingstock'

Vue.use(VueRouter)

const routes = [
  {
    path: '/register',
    component: AuthLayout,
    children: [
      {
        path: '',
        name: 'Register',
        component: () => import('../views/Register.vue'),
        meta: {
          no_auth: true
        }
      }
    ]
  },
  {
    path: '/verify/email/:token',
    name: 'VerifyEmail',
    meta: {
      no_auth: true
    },
    beforeEnter: (to, from, next) => {
      if (!to.params.token) {
        next('/register')
        return
      }
      pingstock.verifyEmail(to.params.token)
        .then(resp => {
          Toast.open({
            duration: 5000,
            message: 'Email verified, you can now login',
            position: 'is-bottom-right',
            type: 'is-success'
          })
        })
        .catch(err => {
          Toast.open({
            duration: 5000,
            message: err.response.data.message ? err.response.data.message : 'Invalid email verification token',
            position: 'is-bottom-right',
            type: 'is-danger'
          })
        })
      next('/login')
    }
  },
  {
    path: '/login',
    component: AuthLayout,
    children: [
      {
        path: '',
        name: 'Login',
        component: () => import('../views/Login.vue'),
        meta: {
          no_auth: true
        }
      }
    ]
  },
  {
    path: '/forgotpassword',
    component: AuthLayout,
    children: [
      {
        path: '',
        name: 'ForgotPassword',
        component: () => import('../views/ForgotPassword.vue'),
        meta: {
          no_auth: true
        }
      }
    ]
  },
  {
    path: '/dashboard',
    component: DefaultLayout,
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: () => import('../views/Dashboard.vue')
      }
    ]
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/About.vue')
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.meta.no_auth === true) {
    if (!_.isEmpty(store.state.auth.token)) {
      next('/dashboard')
      return
    }
    next()
    return
  }
  if (_.isEmpty(store.state.auth.token)) {
    next('/login')
    return
  }
  next()
})

export default router
