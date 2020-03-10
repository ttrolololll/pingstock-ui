<template>
    <div class="view-auth view-register">
        <section class="hero is-fullheight">
            <div class="hero-body">
                <div class="container">
                    <div class="columns">
                        <div class="column is-offset-3 is-6">
                            <figure class="logo has-text-centered">
                                <img src="../assets/logo.png" alt="PingStock.io">
                            </figure>
                            <form v-on:submit.prevent="handleRegister()">
                                <b-field label="First Name">
                                    <b-input type="text" v-model="first_name"></b-input>
                                </b-field>
                                <b-field label="Last Name">
                                    <b-input type="text" v-model="last_name"></b-input>
                                </b-field>
                                <b-field label="Email">
                                    <b-input type="email" v-model="email"></b-input>
                                </b-field>
                                <b-field label="Password">
                                    <b-input type="password" v-model="password" password-reveal></b-input>
                                </b-field>
                                <div class="content has-text-centered">
                                    <p><b-button type="is-success" nativeType="submit" size="is-medium" expanded :disabled="isSubmitDisabled">Submit</b-button></p>
                                </div>
                                <div class="content has-text-centered">
                                    <p>OR</p>
                                    <v-facebook-login :app-id="fbAppID" version="v6.0" @sdk-init="handleSdkInit" @login="handleFacebookRegister">
                                        <template slot="login">Register with Facebook</template>
                                    </v-facebook-login>
                                </div>
                                <div class="content has-text-centered">
                                    <p>Already have an account? <router-link to="/login">Login here</router-link>!</p>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <b-loading :is-full-page="true" :active.sync="isPageLoading"></b-loading>
    </div>
</template>

<script>
import VFacebookLogin from 'vue-facebook-login-component'
import pingstock from '../services/pingstock'

export default {
  name: 'Register',
  components: {
    VFacebookLogin
  },
  data () {
    return {
      fbAppID: process.env.VUE_APP_FACEBOOK_APP_ID,
      facebook: {
        FB: {},
        scope: {}
      },
      isPageLoading: false,
      first_name: undefined,
      last_name: undefined,
      email: undefined,
      password: undefined,
      submitting: false
    }
  },
  methods: {
    handleRegister: function () {
      this.submitting = true
      pingstock.register(this.first_name, this.last_name, this.email, this.password)
        .then(resp => {
          this.$router.push('/login')
          this.$buefy.toast.open({
            duration: 5000,
            message: 'Registration successful! Please click on the email verification link sent to you',
            position: 'is-bottom-right',
            type: 'is-success'
          })
        })
        .catch(err => {
          this.$buefy.toast.open({
            duration: 5000,
            message: err.response.data.message ? err.response.data.message : 'Please verify that your inputs are valid',
            position: 'is-bottom-right',
            type: 'is-danger'
          })
        })
        .finally(() => {
          this.submitting = false
        })
    },
    handleFacebookRegister: function ({ authResponse, status }) {
      this.isPageLoading = true
      if (status === 'connected') {
        pingstock.facebookAuth(authResponse.signedRequest)
          .then(fbAuthResp => {
            this.$store.dispatch('login', fbAuthResp.data.data.access_token)
              .then(() => {
                pingstock.profile()
                  .then(profileResp => {
                    this.$store.dispatch('set_user', profileResp.data.data)
                    this.$router.push('/stock-alert-rules')
                  })
                  .catch(err => {
                    this.$buefy.toast.open({
                      duration: 5000,
                      message: err.response.data.message ? err.response.data.message : 'Unable to retrieve profile',
                      position: 'is-bottom-right',
                      type: 'is-danger'
                    })
                  })
                  .finally(() => {
                    this.facebook.scope.logout()
                    this.isPageLoading = false
                  })
              })
          })
          .catch(err => {
            this.$buefy.toast.open({
              duration: 5000,
              message: err.response.data.message ? err.response.data.message : 'Unable to login via Facebook',
              position: 'is-bottom-right',
              type: 'is-danger'
            })
            this.facebook.scope.logout()
            this.isPageLoading = false
          })
      } else {
        this.$buefy.toast.open({
          duration: 5000,
          message: 'Unable to login with Facebook, please try again',
          position: 'is-bottom-right',
          type: 'is-danger'
        })
        this.isPageLoading = false
      }
    },
    handleSdkInit ({ FB, scope }) {
      this.facebook.scope = scope
      this.facebook.FB = FB
    }
  },
  computed: {
    isSubmitDisabled: function () {
      return !this.first_name || !this.last_name || !this.email || !this.password || this.submitting
    }
  }
}
</script>
