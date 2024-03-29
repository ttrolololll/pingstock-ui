<template>
    <section>
        <div class="tabs">
            <ul>
                <router-link tag="li" :to="{name: 'SettingsTelegram'}" class="is-active"><a>Telegram</a></router-link>
                <router-link tag="li" :to="{name: 'SettingsFacebook'}"><a>Facebook</a></router-link>
            </ul>
        </div>
        <div class="tab-content">
            <div class="content">
                <p>You can receive stock alerts in your Telegram by link it with PingStock.io account.</p>
                <b-field label="">
                    <b-button
                            type="is-success"
                            v-if="!settings.notifications.telegram.is_set"
                            :disabled="!isTelegramTokenExpired"
                            @click="generateToken('telegram')"
                    >
                        Link with Telegram
                    </b-button>
                    <b-button type="is-danger" v-if="settings.notifications.telegram.is_set" @click="confirmUnlink()">Unlink Telegram</b-button>
                </b-field>
                <p class="token" v-if="!settings.notifications.telegram.is_set && !isTelegramTokenExpired">Search for <strong><a href="https://t.me/PingStockBot" target="_blank">PingStockBot</a></strong> in your Telegram. Then key in <strong>/link {{user.email}} {{settings.notifications.telegram.token}}</strong></p>
                <p>
                    <b-progress :value="tokenTTL" show-value v-if="!isTelegramTokenExpired">
                        Token expires in: {{tokenTTL}} / {{tokenLife}}
                    </b-progress>
                </p>
            </div>
        </div>
    </section>
</template>

<script>
import { mapState } from 'vuex'
import moment from 'moment'
import pingstock from '../../../services/pingstock'

export default {
  name: 'SettingsTelegram',
  data () {
    return {
      settings: {
        notifications: {
          telegram: {
            is_set: false,
            token: null,
            token_expiry: null
          }
        }
      },
      tokenLife: 120,
      tokenTTL: 0
    }
  },
  props: ['switchTab'],
  created () {
    this.getUserSettings()
  },
  methods: {
    getUserSettings: function () {
      this.$parent.isPageLoading = true
      pingstock.settings()
        .then(resp => {
          this.settings.notifications.telegram.is_set = resp.data.data.notifications.telegram.is_set
          this.settings.notifications.telegram.token = resp.data.data.notifications.telegram.token
          this.settings.notifications.telegram.token_expiry = resp.data.data.notifications.telegram.token_expiry
          this.initCountdown(resp.data.data.notifications.telegram.token_expiry)
        })
        .catch(err => {
          this.$buefy.toast.open({
            duration: 5000,
            message: err.response.data.message ? err.response.data.message : 'Unable to retrieve your settings, please try again',
            position: 'is-bottom-right',
            type: 'is-danger'
          })
        })
        .finally(() => {
          this.$parent.isPageLoading = false
        })
    },
    generateToken: function (service) {
      this.$parent.isPageLoading = true
      pingstock.generateServiceToken(service)
        .then(resp => {
          this.settings.notifications[service].token = resp.data.data.token
          this.settings.notifications[service].token_expiry = resp.data.data.expires_at
          this.initCountdown(resp.data.data.expires_at)
        })
        .catch(err => {
          this.$buefy.toast.open({
            duration: 5000,
            message: err.response.data.message ? err.response.data.message : 'Unable to generate token, please try again',
            position: 'is-bottom-right',
            type: 'is-danger'
          })
        })
        .finally(() => {
          this.$parent.isPageLoading = false
        })
    },
    unlink: function () {
      this.$parent.isPageLoading = true
      pingstock.unlinkService('telegram')
        .then(resp => {
          this.settings.notifications.telegram.is_set = false
          this.$buefy.toast.open({
            duration: 5000,
            message: 'Telegram unlinked',
            position: 'is-bottom-right',
            type: 'is-danger'
          })
        })
        .catch(err => {
          this.$buefy.toast.open({
            duration: 5000,
            message: err.response.data.message ? err.response.data.message : 'Unable to unlink service, please try again',
            position: 'is-bottom-right',
            type: 'is-danger'
          })
        })
        .finally(() => {
          this.$parent.isPageLoading = false
        })
    },
    confirmUnlink: function () {
      const vm = this
      this.$buefy.dialog.confirm({
        message: 'Unlink Telegram?',
        type: 'is-danger',
        onConfirm: function () {
          vm.unlink()
        }
      })
    },
    initCountdown: function (target) {
      if (!this.isTelegramTokenExpired) {
        const to = moment.unix(target)
        const from = moment()
        const diff = to.diff(from) / 1000
        this.tokenTTL = Math.ceil(diff)
        setInterval(() => {
          if (this.tokenTTL > 0) {
            this.tokenTTL--
            return
          }
          location.reload()
        }, 1000)
      }
    },
    isTokenExpired: function (expiresAt) {
      if (expiresAt === null || expiresAt === undefined) {
        return true
      }
      return moment.unix(expiresAt).isBefore(moment())
    }
  },
  computed: {
    ...mapState(['auth', 'user']),
    isTelegramTokenExpired: function () {
      return this.isTokenExpired(this.settings.notifications.telegram.token_expiry)
    }
  }
}
</script>
