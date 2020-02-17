import axios from 'axios'

const baseUrl = process.env.VUE_APP_URL

const pingstock = {
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
