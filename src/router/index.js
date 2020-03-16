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
    path: '/',
    component: AuthLayout,
    beforeEnter: (to, from, next) => {
      next('/stock-alert-rules')
    }
  },
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
        .finally(() => {
          next('/login')
        })
    }
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
      },
      {
        path: 'reset/:token',
        name: 'ForgotPasswordReset',
        component: () => import('../views/ForgotPassword.vue'),
        meta: {
          no_auth: true
        }
      }
    ]
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
    path: '/logout',
    name: 'Logout',
    beforeEnter: (to, from, next) => {
      pingstock.logout()
        .then(resp => {
          Toast.open({
            duration: 5000,
            message: 'Logout successfully',
            position: 'is-bottom-right',
            type: 'is-success'
          })
        })
        .catch(err => {
          Toast.open({
            duration: 5000,
            message: err.response.data.message ? err.response.data.message : 'An error occurred, please clear your browser history and cache',
            position: 'is-bottom-right',
            type: 'is-danger'
          })
        })
        .finally(() => {
          store.dispatch('logout')
            .finally(() => {
              next('/login')
            })
        })
    }
  },
  {
    path: '/watchlists',
    component: DefaultLayout,
    children: [
      {
        path: '',
        name: 'Watchlist',
        component: () => import('../views/watchlist/Watchlist.vue')
      },
      {
        path: 'new',
        name: 'NewWatchlistItem',
        component: () => import('../views/watchlist/NewWatchlistItem.vue')
      }
    ]
  },
  {
    path: '/stock-alert-rules',
    component: DefaultLayout,
    children: [
      {
        path: '',
        name: 'StockAlertRules',
        component: () => import('../views/stockalertrule/StockAlertRule.vue'),
        props: {
          triggered: false
        }
      },
      {
        path: 'triggered',
        name: 'TriggeredStockAlertRules',
        component: () => import('../views/stockalertrule/StockAlertRule.vue'),
        props: {
          triggered: true
        }
      },
      {
        path: 'new',
        name: 'NewStockAlertRules',
        component: () => import('../views/stockalertrule/NewStockAlertRule.vue')
      }
    ]
  },
  {
    path: '/account',
    component: DefaultLayout,
    children: [
      {
        path: 'profile',
        name: 'Profile',
        component: () => import('../views/account/profile/Profile.vue')
      },
      {
        path: 'profile/password',
        name: 'ProfilePassword',
        component: () => import('../views/account/profile/Password.vue')
      },
      {
        path: 'settings',
        component: () => import('../views/account/setting/Settings.vue'),
        children: [
          {
            path: '',
            name: 'Settings',
            beforeEnter: (to, from, next) => {
              next('/account/settings/telegram')
            }
          },
          {
            path: 'telegram',
            name: 'SettingsTelegram',
            component: () => import('../views/account/setting/SettingsTelegram.vue')
          },
          {
            path: 'facebook',
            name: 'SettingsFacebook',
            component: () => import('../views/account/setting/SettingsFacebook.vue')
          }
        ]
      },
      {
        path: 'payments',
        name: 'Payments',
        component: () => import('../views/account/payment/Payment.vue')
      },
      {
        path: 'subscriptions',
        name: 'Subscriptions',
        component: () => import('../views/account/subscription/Subscription.vue')
      },
      {
        path: 'subscriptions/new',
        name: 'NewSubscription',
        component: () => import('../views/account/subscription/NewSubscription.vue')
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  // if route does not require auth
  if (to.meta.no_auth === true) {
    // user logged in, redirect to default protected route
    if (!_.isEmpty(store.state.auth.token)) {
      next('/stock-alert-rules')
      return
    }
    // proceed
    next()
    return
  }
  // go to login if auth token not found
  if (_.isEmpty(store.state.auth.token)) {
    next('/login')
    return
  }
  // get user profile if not exist
  if (_.isEmpty(store.state.user)) {
    pingstock.profile()
      .then(resp => {
        store.dispatch('set_user', resp.data.data)
          .then(resp => {
            next()
          })
          .catch(() => {
            Toast.open({
              duration: 5000,
              message: 'Unable to retrieve user, please refresh',
              position: 'is-bottom-right',
              type: 'is-warn'
            })
          })
      })
      .catch(() => {
        Toast.open({
          duration: 5000,
          message: 'Unable to retrieve user, please re-login',
          position: 'is-bottom-right',
          type: 'is-warn'
        })
        store.dispatch('logout')
      })
  }
  next()
})

export default router
