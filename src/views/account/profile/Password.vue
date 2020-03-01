<template>
    <div class="profile-password">
        <PageHeader title="Password" subtitle=""/>
        <section>
            <div class="tabs">
                <ul>
                    <router-link tag="li" :to="{name: 'Profile'}" exact><a>Profile</a></router-link>
                    <router-link tag="li" :to="{name: 'ProfilePassword'}" class="is-active" exact><a>Password</a></router-link>
                </ul>
            </div>
            <div class="tab-content">
                <form v-on:submit.prevent="handlePasswordUpdate">
                    <b-field label="Current Password">
                        <b-input type="password" v-model="currentPassword" password-reveal></b-input>
                    </b-field>
                    <b-field label="New Password" :type="{ 'is-danger': this.newPassword !== this.confirmPassword }" :message="{ 'New password does not match confirmation': this.newPassword !== this.confirmPassword }">
                        <b-input type="password" v-model="newPassword" password-reveal></b-input>
                    </b-field>
                    <b-field label="Confirm Password">
                        <b-input type="password" v-model="confirmPassword" password-reveal></b-input>
                    </b-field>
                    <div class="content">
                        <p><b-button type="is-success" nativeType="submit" size="is-medium" expanded :disabled="isSubmitDisabled">Update</b-button></p>
                    </div>
                </form>
            </div>
        </section>
        <b-loading :is-full-page="false" :active.sync="isPageLoading"></b-loading>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import PageHeader from '@/components/PageHeader.vue'
import pingstock from '../../../services/pingstock'

export default {
  name: 'Profile',
  components: {
    PageHeader
  },
  data () {
    return {
      isPageLoading: false,
      isSubmitting: false,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  },
  methods: {
    handlePasswordUpdate: function () {
      this.isPageLoading = true
      this.isSubmitting = true
      pingstock.passwordUpdate(this.currentPassword, this.newPassword, this.confirmPassword)
        .then(resp => {
          this.$buefy.toast.open({
            duration: 5000,
            message: resp.data.message ? resp.data.message : 'Password update success',
            position: 'is-bottom-right',
            type: 'is-success'
          })
          this.currentPassword = ''
          this.newPassword = ''
          this.confirmPassword = ''
        })
        .catch(err => {
          this.$buefy.toast.open({
            duration: 5000,
            message: err.response.data.message,
            position: 'is-bottom-right',
            type: 'is-danger'
          })
        })
        .finally(() => {
          this.isPageLoading = false
          this.isSubmitting = false
        })
    }
  },
  computed: {
    ...mapState(['auth', 'user']),
    isSubmitDisabled: function () {
      return this.password === '' || this.newPassword === '' || this.confirmPassword === '' || this.newPassword !== this.confirmPassword || this.isSubmitting
    }
  }
}
</script>
