import axios from 'axios'

const baseUrl = process.env.VUE_APP_URL

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
  login: (email, password) => {
    return axios({
      method: 'post',
      url: baseUrl + '/users/auth/login',
      data: {
        email: email,
        password: password
      }
    })
  }
}

export default pingstock
