<template>
    <div class="payments">
        <PageHeader title="Payment Settings" subtitle=""/>
        <section>
            <div class="tab-content">
                <div class="buttons" v-if="!user.card_last_four">
                    <b-button type="is-info" icon-left="credit-card-plus" v-on:click="toggleEdit">Add Card</b-button>
                </div>
                <div class="content" v-if="!user.card_last_four">
                    <p>You have not added any payment card.</p>
                </div>
                <div class="card">
                    <header class="card-header">
                        <p class="card-header-title">VISA - *** 5536</p>
                    </header>
                    <footer class="card-footer">
                        <a href="#" class="card-footer-item">Edit</a>
                        <a href="#" class="card-footer-item">Delete</a>
                    </footer>
                </div>
            </div>
        </section>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import PageHeader from '@/components/PageHeader.vue'
import pingstock from '../../../services/pingstock'

export default {
  name: 'Payments',
  components: {
    PageHeader
  },
  data () {
    return {
      isReadOnly: true
    }
  },
  created () {
    if (!this.user) {
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
    }
  },
  methods: {
    toggleEdit: function () {
      this.isReadOnly = !this.isReadOnly
    },
    handleProfileUpdate: function () {
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
