import axios from 'axios'

const baseUrl = process.env.VUE_APP_URL
axios.defaults.headers.common.Authorization = 'Bearer ' + localStorage.getItem('token')

const pingstock = {
  register: (firstName, lastName, email, password) => {
    return axios({
      method: 'post',
      url: baseUrl + '/users/register',
      data: {
        first_name: firstName,
        last_name: lastName,
        email: email,
        password: password
      }
    })
  },
  verifyEmail: token => {
    return axios({
      method: 'get',
      url: baseUrl + '/users/verify/email/' + token
    })
  },
  resendVerificationEmail: email => {
    return axios({
      method: 'post',
      url: baseUrl + '/users/verify/email/resend',
      data: {
        email: email
      }
    })
  },
  forgotPasswordRequest: email => {
    return axios({
      method: 'post',
      url: baseUrl + '/users/auth/pwresetreq',
      data: {
        email: email
      }
    })
  },
  forgotPasswordReset: (email, password, passwordConfirmation, token) => {
    return axios({
      method: 'post',
      url: baseUrl + '/users/auth/pwreset',
      data: {
        email: email,
        password: password,
        password_confirmation: passwordConfirmation,
        token: token
      }
    })
  },
  login: (email, password) => {
    return axios({
      method: 'post',
      url: baseUrl + '/users/auth/login',
      data: {
        email: email,
        password: password
      }
    })
  },
  logout: () => {
    return axios({
      method: 'post',
      url: baseUrl + '/users/auth/logout'
    })
  },
  profile: () => {
    return axios({
      method: 'get',
      url: baseUrl + '/users/profile'
    })
  },
  profileUpdate: (firstName, lastName, email) => {
    return axios({
      method: 'patch',
      url: baseUrl + '/users/profile',
      data: {
        first_name: firstName,
        last_name: lastName,
        email: email
      }
    })
  },
  passwordUpdate: (password, newPassword, confirmPassword) => {
    return axios({
      method: 'post',
      url: baseUrl + '/users/auth/pw',
      data: {
        current_password: password,
        password: newPassword,
        password_confirmation: confirmPassword
      }
    })
  },
  facebookAuth: (sr) => {
    return axios({
      method: 'post',
      url: baseUrl + '/users/auth/facebook',
      data: {
        signed_request: sr
      }
    })
  },
  linkFacebook: fbID => {
    return axios({
      method: 'post',
      url: baseUrl + '/users/auth/facebook/link',
      data: {
        facebook_id: fbID
      }
    })
  },
  unlinkFacebook: () => {
    return axios({
      method: 'post',
      url: baseUrl + '/users/auth/facebook/unlink'
    })
  },
  settings: () => {
    return axios({
      method: 'get',
      url: baseUrl + '/users/settings'
    })
  },
  generateServiceToken: (service) => {
    return axios({
      method: 'post',
      url: baseUrl + '/users/settings/services/tokens',
      data: {
        service: service
      }
    })
  },
  unlinkService: (service) => {
    return axios({
      method: 'post',
      url: baseUrl + '/users/settings/services/unlink',
      data: {
        service: service
      }
    })
  },
  stripeSetupIntent: () => {
    return axios({
      method: 'post',
      url: baseUrl + '/users/payment/setup-intent'
    })
  },
  stripeAddCard: (paymentMethod) => {
    return axios({
      method: 'post',
      url: baseUrl + '/users/payment/cards',
      data: {
        payment_method: paymentMethod
      }
    })
  },
  stripeDeleteAllCards: (paymentMethod) => {
    return axios({
      method: 'delete',
      url: baseUrl + '/users/payment/cards/all'
    })
  },
  paymentMethods: () => {
    return axios({
      method: 'get',
      url: baseUrl + '/users/payment/cards'
    })
  },
  subscribe: (plan) => {
    return axios({
      method: 'post',
      url: baseUrl + '/users/subscriptions',
      data: {
        plan: plan
      }
    })
  },
  subscriptions: () => {
    return axios({
      method: 'get',
      url: baseUrl + '/users/subscriptions'
    })
  },
  cancelSubscription: subscriptionID => {
    return axios({
      method: 'post',
      url: baseUrl + '/users/subscriptions/cancel',
      data: {
        subscription_id: subscriptionID
      }
    })
  },
  resumeSubscription: subscriptionID => {
    return axios({
      method: 'post',
      url: baseUrl + '/users/subscriptions/resume',
      data: {
        subscription_id: subscriptionID
      }
    })
  },
  searchStocks: s => {
    return axios({
      method: 'get',
      url: baseUrl + '/users/stocks/search?s=' + s
    })
  },
  stockAlertRules: triggered => {
    let triggeredVal = 0
    if (triggered) {
      triggeredVal = 1
    }
    return axios({
      method: 'get',
      url: baseUrl + '/users/stock-alerts?triggered=' + triggeredVal
    })
  },
  createStockAlertRule: (symbol, operator, target) => {
    return axios({
      method: 'post',
      url: baseUrl + '/users/stock-alerts',
      data: {
        stock_symbol: symbol,
        operator: operator,
        target: target
      }
    })
  },
  updateStockAlertRule: rule => {
    return axios({
      method: 'patch',
      url: baseUrl + '/users/stock-alerts/' + rule.id,
      data: {
        stock_symbol: rule.stock_symbol,
        operator: rule.operator,
        target: rule.target
      }
    })
  },
  deleteStockAlertRule: ruleID => {
    return axios({
      method: 'delete',
      url: baseUrl + '/users/stock-alerts/' + ruleID
    })
  },
  watchlistItems: () => {
    return axios({
      method: 'get',
      url: baseUrl + '/users/watchlists/items'
    })
  },
  createWatchlistItem: (symbol, target) => {
    return axios({
      method: 'post',
      url: baseUrl + '/users/watchlists/items',
      data: {
        stock_symbol: symbol,
        reference_target: target
      }
    })
  },
  updateWatchlistItem: (itemID, target, cbsJsonStr) => {
    return axios({
      method: 'patch',
      url: baseUrl + '/users/watchlists/items',
      data: {
        item_id: itemID,
        reference_target: target,
        cb_json_str: cbsJsonStr
      }
    })
  },
  deleteWatchlistItem: (itemID) => {
    return axios({
      method: 'delete',
      url: baseUrl + '/users/watchlists/items',
      data: {
        item: itemID
      }
    })
  },
  products: () => {
    return axios({
      method: 'get',
      url: baseUrl + '/products'
    })
  }
}

export default pingstock
