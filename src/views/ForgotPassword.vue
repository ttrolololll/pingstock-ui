<template>
    <div class="view-auth view-forgot-password">
        <section class="hero is-fullheight">
            <div class="hero-body">
                <div class="container">
                    <div class="columns">
                        <div class="column is-offset-3 is-6">
                            <figure class="logo has-text-centered">
                                <img src="https://raw.githubusercontent.com/buefy/buefy/dev/static/img/buefy-logo.png"
                                     alt="Lightweight UI components for Vue.js based on Bulma">
                            </figure>
                            <form v-on:submit.prevent="handleRequest()" v-if="isFormRequest">
                                <b-field label="Email">
                                    <b-input type="email" v-model="email"></b-input>
                                </b-field>
                                <div class="content has-text-centered">
                                    <p><b-button type="is-success" nativeType="submit" size="is-medium" expanded :disabled="isSubmitDisabled">Send Password Reset Request</b-button></p>
                                    <p><router-link to="/login">Back to Login</router-link></p>
                                    <p>Don't have an account? <router-link to="/register">Register here</router-link>!</p>
                                </div>
                            </form>
                            <form v-on:submit.prevent="handleReset()" v-if="!isFormRequest">
                                <b-field label="Email">
                                    <b-input type="email" v-model="email"></b-input>
                                </b-field>
                                <b-field label="New Password" v-bind:type="password === passwordConfirmation ? '' : 'is-danger'" v-bind:message="password === passwordConfirmation ? '' : 'Password values must match'">
                                    <b-input type="password" v-model="password" password-reveal></b-input>
                                </b-field>
                                <b-field label="Confirm Password">
                                    <b-input type="password" v-model="passwordConfirmation"></b-input>
                                </b-field>
                                <div class="content has-text-centered">
                                    <p><b-button type="is-success" nativeType="submit" size="is-medium" expanded :disabled="isSubmitDisabled">Reset Password</b-button></p>
                                    <p><router-link to="/login">Back to Login</router-link></p>
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
  name: 'ForgotPassword',
  data () {
    return {
      email: undefined,
      password: undefined,
      passwordConfirmation: undefined,
      submitting: false
    }
  },
  methods: {
    toggleForm: function () {
      console.log(this.$route.name)
      this.isFormRequest = !this.isFormRequest
    },
    handleRequest: function () {
      this.submitting = true
      pingstock.forgotPasswordRequest(this.email)
        .then(resp => {
          this.$buefy.toast.open({
            duration: 5000,
            message: 'You will receive reset instruction if email is valid',
            position: 'is-bottom-right',
            type: 'is-success'
          })
        })
        .catch(err => {
          this.$buefy.toast.open({
            duration: 5000,
            message: err.response.data.message ? err.response.data.message : 'You will receive reset instruction if email is valid',
            position: 'is-bottom-right',
            type: 'is-success'
          })
        })
        .finally(() => {
          this.submitting = false
        })
    },
    handleReset: function () {
      this.submitting = true
      console.log(this.$route.params.token)
      pingstock.forgotPasswordReset(this.email, this.password, this.passwordConfirmation, this.$route.params.token)
        .then(resp => {
          this.isFormRequest = true
          this.$buefy.toast.open({
            duration: 5000,
            message: 'Password reset successful, please login with your new password',
            position: 'is-bottom-right',
            type: 'is-success'
          })
          this.$router.push('/login')
        })
        .catch(err => {
          this.submitting = false
          this.$buefy.toast.open({
            duration: 5000,
            message: err.response.data.message ? err.response.data.message : 'Unable to reset password',
            position: 'is-bottom-right',
            type: 'is-danger'
          })
        })
    }
  },
  computed: {
    isFormRequest: function () {
      return this.$route.name === 'ForgotPassword'
    },
    isSubmitDisabled: function () {
      if (this.isFormRequest) {
        return !this.email || this.submitting
      }
      return !this.email || !this.password || !this.passwordConfirmation || this.submitting
    }
  }
}
</script>

<style lang="scss">
</style>
