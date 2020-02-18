<template>
    <div class="view-login">
        <section class="hero is-fullheight">
            <div class="hero-body">
                <div class="container">
                    <div class="columns">
                        <div class="column is-offset-3 is-6">
                            <figure class="logo has-text-centered">
                                <img src="https://raw.githubusercontent.com/buefy/buefy/dev/static/img/buefy-logo.png"
                                     alt="Lightweight UI components for Vue.js based on Bulma">
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
                                    <p>Already have an account? <router-link to="/login">Login here</router-link>!</p>
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
  name: 'Register',
  data () {
    return {
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
    }
  },
  computed: {
    isSubmitDisabled: function () {
      return !this.first_name || !this.last_name || !this.email || !this.password || this.submitting
    }
  }
}
</script>

<style lang="scss">
    .view-login {
        .hero {
            background: #f9f9f9;
            border: 1rem solid white;
        }
        .logo {
            margin-bottom: 1rem;
            img {
                max-width: 100px;
            }
        }
    }
</style>
