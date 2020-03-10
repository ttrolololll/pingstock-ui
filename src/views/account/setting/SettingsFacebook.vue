<template>
    <section>
        <div class="tabs">
            <ul>
                <router-link tag="li" :to="{name: 'SettingsTelegram'}"><a>Telegram</a></router-link>
                <router-link tag="li" :to="{name: 'SettingsFacebook'}" class="is-active"><a>Facebook</a></router-link>
            </ul>
        </div>
        <div class="tab-content">
            <div class="content">
                <p>You can login to your PingStock.io account with your Facebook account by linking them.</p>
                <v-facebook-login :app-id="fbAppID" version="v6.0" v-if="!user.facebook_id" @sdk-init="handleSdkInit" @login="handleLogin">
                    <template slot="login">Link with Facebook</template>
                </v-facebook-login>
                <b-button type="is-danger" @click="handleUnlink()" v-if="user.facebook_id">Unlink Facebook</b-button>
            </div>
        </div>
    </section>
</template>

<script>
import { mapState } from 'vuex'
import VFacebookLogin from 'vue-facebook-login-component'
import pingstock from '../../../services/pingstock'

export default {
  name: 'SettingsFacebook',
  components: {
    VFacebookLogin
  },
  data () {
    return {
      fbAppID: process.env.VUE_APP_FACEBOOK_APP_ID,
      facebook: {
        FB: {},
        scope: {}
      }
    }
  },
  created () {
  },
  methods: {
    handleSdkInit ({ FB, scope }) {
      this.facebook.scope = scope
      this.facebook.FB = FB
    },
    handleLogin ({ authResponse, status }) {
      this.$parent.isPageLoading = true
      if (status === 'connected') {
        pingstock.linkFacebook(authResponse.userID)
          .then(linkResp => {
            this.$store.dispatch('update_user_facebook_id', authResponse.userID)
            this.$buefy.toast.open({
              duration: 5000,
              message: 'Successfully linked with Facebook!',
              position: 'is-bottom-right',
              type: 'is-success'
            })
          })
          .catch(() => {
            this.facebook.scope.logout()
            this.$buefy.toast.open({
              duration: 5000,
              message: 'Unable to link with Facebook, please try again',
              position: 'is-bottom-right',
              type: 'is-danger'
            })
          })
      } else {
        this.$buefy.toast.open({
          duration: 5000,
          message: 'Unable to link with Facebook, please try again',
          position: 'is-bottom-right',
          type: 'is-danger'
        })
      }
      this.$parent.isPageLoading = false
    },
    handleUnlink: function () {
      this.$parent.isPageLoading = true
      // this.facebook.scope.logout()
      pingstock.unlinkFacebook()
        .then(resp => {
          this.$store.dispatch('update_user_facebook_id', null)
          this.$buefy.toast.open({
            duration: 5000,
            message: 'Successfully unlinked with Facebook',
            position: 'is-bottom-right',
            type: 'is-success'
          })
        })
        .catch(err => {
          this.$buefy.toast.open({
            duration: 5000,
            message: err.response.data.message ? err.response.data.message : 'Unable to unlink with Facebook, please try again',
            position: 'is-bottom-right',
            type: 'is-danger'
          })
        })
        .finally(() => {
          this.$parent.isPageLoading = false
        })
    }
  },
  computed: {
    ...mapState(['auth', 'user'])
  }
}
</script>
