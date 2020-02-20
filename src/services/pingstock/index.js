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
  }
}

export default pingstock
