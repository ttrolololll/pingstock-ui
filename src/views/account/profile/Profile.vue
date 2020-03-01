<template>
    <div class="profile">
        <PageHeader title="Profile" subtitle=""/>
        <section>
            <div class="tabs">
                <ul>
                    <router-link tag="li" :to="{name: 'Profile'}" class="is-active" exact><a>Profile</a></router-link>
                    <router-link tag="li" :to="{name: 'ProfilePassword'}" exact><a>Password</a></router-link>
                </ul>
            </div>
            <div class="tab-content">
                <div class="buttons">
                    <b-button type="is-info" icon-left="account-edit" :outlined="isReadOnly" v-on:click="toggleEdit">Edit</b-button>
                </div>
                <form v-on:submit.prevent="handleProfileUpdate">
                    <b-field label="First Name">
                        <b-input type="text" v-model="user.first_name" :readonly="isReadOnly"></b-input>
                    </b-field>
                    <b-field label="Last Name">
                        <b-input type="text" v-model="user.last_name" :readonly="isReadOnly"></b-input>
                    </b-field>
                    <b-field label="Email">
                        <b-input type="email" v-model="user.email" :readonly="isReadOnly"></b-input>
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
      isReadOnly: true
    }
  },
  created () {
    if (!this.user) {
      this.isPageLoading = true
      pingstock.profile()
        .then(resp => {
          this.$store.dispatch('set_user', resp.data.data)
        })
        .catch(() => {
          this.$buefy.toast.open({
            duration: 5000,
            message: 'Unable to retrieve user, please refresh',
            position: 'is-bottom-right',
            type: 'is-warn'
          })
        })
        .finally(() => {
          this.isPageLoading = false
        })
    }
  },
  methods: {
    toggleEdit: function () {
      this.isReadOnly = !this.isReadOnly
    },
    handleProfileUpdate: function () {
      this.isPageLoading = true
      this.isReadOnly = true
      pingstock.profileUpdate(this.user.first_name, this.user.last_name, this.user.email)
        .then(resp => {
          this.$buefy.toast.open({
            duration: 5000,
            message: 'Profile update successful',
            position: 'is-bottom-right',
            type: 'is-success'
          })
          const updateObj = {
            first_name: this.user.first_name,
            last_name: this.user.last_name,
            email: this.user.email
          }
          this.$store.dispatch('update_user_profile', updateObj)
        })
        .catch(err => {
          this.$buefy.toast.open({
            duration: 5000,
            message: err.response.data.message ? err.response.data.message : 'Unable to update profile, please try again',
            position: 'is-bottom-right',
            type: 'is-danger'
          })
          this.isReadOnly = false
        })
        .finally(() => {
          this.isPageLoading = false
        })
    }
  },
  computed: {
    ...mapState(['auth', 'user']),
    isSubmitDisabled: function () {
      return this.isReadOnly || !this.user.first_name || !this.user.last_name || !this.user.email
    }
  }
}
</script>
