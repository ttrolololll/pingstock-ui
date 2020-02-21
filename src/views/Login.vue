<template>
    <div class="view-auth view-login">
        <section class="hero is-fullheight">
            <div class="hero-body">
                <div class="container">
                    <div class="columns">
                        <div class="column is-offset-3 is-6">
                            <figure class="logo has-text-centered">
                                <img src="https://raw.githubusercontent.com/buefy/buefy/dev/static/img/buefy-logo.png"
                                     alt="Lightweight UI components for Vue.js based on Bulma">
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
    </div>
</template>

<script>
import pingstock from '../services/pingstock'

export default {
  name: 'Login',
  data () {
    return {
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
    handleLogin: async function () {
      this.submitting = true
      // login and dispatch action
      const loginResp = await pingstock.login(this.email, this.password)
      if (loginResp.status !== 200 || !loginResp.data.data.access_token) {
        this.$buefy.toast.open({
          duration: 5000,
          message: loginResp.data.message ? loginResp.data.message : 'Email or password not found',
          position: 'is-bottom-right',
          type: 'is-danger'
        })
        this.submitting = false
        return
      }
      await this.$store.dispatch('login', loginResp.data.data.access_token)
      // get user profile
      const profileResp = await pingstock.profile()
      if (profileResp.status !== 200) {
        this.$buefy.toast.open({
          duration: 5000,
          message: profileResp.data.message ? profileResp.data.message : 'Unable to retrieve profile',
          position: 'is-bottom-right',
          type: 'is-danger'
        })
        this.submitting = false
        return
      }
      await this.$store.dispatch('set_user', profileResp.data.data)
      await this.$router.push('/dashboard')
      // pingstock.login(this.email, this.password)
      //   .then(resp => {
      //     this.$store.dispatch('login', resp.data.data.access_token)
      //     this.$router.push('/dashboard')
      //   })
      //   .catch(err => {
      //     this.$buefy.toast.open({
      //       duration: 5000,
      //       message: err.response.data.message ? err.response.data.message : 'Email or password not found',
      //       position: 'is-bottom-right',
      //       type: 'is-danger'
      //     })
      //   })
      //   .finally(() => {
      //     this.submitting = false
      //   })
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

<style lang="scss">
</style>
