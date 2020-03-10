<template>
    <div class="view-auth view-login">
        <section class="hero is-fullheight">
            <div class="hero-body">
                <div class="container">
                    <div class="columns">
                        <div class="column is-offset-3 is-6">
                            <figure class="logo has-text-centered">
                                <img src="../assets/logo.png" alt="PingStock.io">
                            </figure>
                            <form v-on:submit.prevent="handleLogin()" v-if="isFormLogin">
                                <b-field label="Email">
                                    <b-input type="email" v-model="email"></b-input>
                                </b-field>
                                <b-field label="Password">
                                    <b-input type="password" v-model="password" password-reveal></b-input>
                                </b-field>
                                <div class="content has-text-centered">
                                    <p><router-link to="/forgotpassword">Forgot Password</router-link></p>
                                    <a v-on:click.prevent="toggleForm">Re-send Email Verification Link</a>
                                </div>
                                <div class="content has-text-centered">
                                    <p><b-button type="is-success" nativeType="submit" size="is-medium" expanded :disabled="isSubmitDisabled">Login</b-button></p>
                                </div>
                                <div class="content has-text-centered">
                                    <p>OR</p>
                                    <v-facebook-login :app-id="fbAppID" version="v6.0" @sdk-init="handleSdkInit" @login="handleFacebookLogin">
                                        <template slot="login">Login with Facebook</template>
                                    </v-facebook-login>
                                </div>
                                <div class="content has-text-centered">
                                    <p>Don't have an account? <router-link to="/register">Register here</router-link>!</p>
                                </div>
                            </form>
                            <form v-on:submit.prevent="handleResendVerificationEmail()" v-if="!isFormLogin">
                                <b-field label="Registered Email">
                                    <b-input type="email" v-model="email"></b-input>
                                </b-field>
                                <div class="content has-text-centered">
                                    <p><router-link to="/forgotpassword">Forgot Password</router-link></p>
                                    <a v-on:click.prevent="toggleForm">Back to Login</a>
                                </div>
                                <div class="content has-text-centered">
                                    <p><b-button type="is-success" nativeType="submit" size="is-medium" expanded :disabled="isSubmitDisabled">Re-send Verification Email</b-button></p>
                                    <p>Don't have an account? <router-link to="/register">Register here</router-link>!</p>
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
  name: 'Login',
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
      isFormLogin: true,
      email: undefined,
      password: undefined,
      submitting: false
    }
  },
  methods: {
    toggleForm: function () {
      this.isFormLogin = !this.isFormLogin
    },
    handleLogin: function () {
      this.submitting = true
      this.isPageLoading = true
      // login
      pingstock.login(this.email, this.password)
        .then(loginResp => {
          // dispatch login action
          this.$store.dispatch('login', loginResp.data.data.access_token)
            .then(() => {
              // get profile
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
                  this.isPageLoading = false
                })
            })
        })
        .catch(err => {
          this.$buefy.toast.open({
            duration: 5000,
            message: err.response.data.message ? err.response.data.message : 'Email or password not found',
            position: 'is-bottom-right',
            type: 'is-danger'
          })
          this.isPageLoading = false
        })
        .finally(() => {
          this.submitting = false
        })
    },
    handleFacebookLogin: function ({ authResponse, status }) {
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
    },
    handleResendVerificationEmail: function () {
      this.submitting = true
      pingstock.resendVerificationEmail(this.email)
        .then(resp => {
          this.isFormLogin = true
          this.$buefy.toast.open({
            duration: 5000,
            message: 'Verification email has been re-sent to ' + this.email,
            position: 'is-bottom-right',
            type: 'is-success'
          })
        })
        .catch(err => {
          this.$buefy.toast.open({
            duration: 5000,
            message: err.response.data.message ? err.response.data.message : 'Unable to re-send verification email',
            position: 'is-bottom-right',
            type: 'is-danger'
          })
        })
        .finally(() => {
          this.submitting = false
        })
    }
  },
  computed: {
    isSubmitDisabled: function () {
      if (this.isFormLogin) {
        return !this.email || !this.password || this.submitting
      }
      return !this.email || this.submitting
    }
  }
}
</script>
