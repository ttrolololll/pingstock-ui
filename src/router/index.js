import Vue from 'vue'
import VueRouter from 'vue-router'
// import _ from 'lodash'
import DefaultLayout from '../layouts/DefaultLayout.vue'
import AuthLayout from '../layouts/AuthLayout.vue'

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
    path: '/',
    component: DefaultLayout,
    children: [
      {
        path: '',
        name: 'Home',
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
  // if (to.meta.no_auth === true) {
  //   next()
  //   return
  // }
  // if (_.isEmpty(localStorage.getItem('token'))) {
  //   next('/login')
  //   return
  // }
  next()
})

export default router
