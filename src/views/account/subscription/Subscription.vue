<template>
    <div class="view-subscription">
        <PageHeader title="My Subscription" subtitle=""/>
        <section>
            <div class="tab-content">
                <div class="content" v-if="!subscription">
                    <div class="buttons">
                        <b-button type="is-info" icon-left="plus-circle" @click="$router.push({ name: 'NewSubscription' })">Subscribe to a Plan</b-button>
                    </div>
                    <p>You have not subscribe to any service plan.</p>
                </div>
                <div class="card" v-if="subscription">
                    <header class="card-header is-primary">
                        <p class="card-header-title">{{subscription.db_data.name}} | {{subscription.plan.nickname}} ({{subStart}} &mdash; {{subEnd}})</p>
                        <a href="#" class="card-header-icon" @click.prevent>
                            <b-taglist>
                                <b-tag rounded type="is-primary" v-if="subscription.db_data.stripe_status === 'active'">{{subscription.db_data.stripe_status}}</b-tag>
                                <b-tag rounded type="is-light" v-if="subscription.db_data.stripe_status !== 'active'">{{subscription.db_data.stripe_status}}</b-tag>
                                <b-tooltip type="is-danger" position="is-left" :label="'Cancelled on ' + canceledAt">
                                    <b-tag rounded type="is-danger" v-if="subscription.cancel_at_period_end">subscription cancelled</b-tag>
                                </b-tooltip>
                            </b-taglist>
                        </a>
                    </header>
                    <div class="card-content">
                        <div class="content">
                            <h6>Stock Alert Rule Usage:</h6>
                            <b-progress type="is-success" size="is-medium" :value="usagePercentage" show-value>{{ subscription.usage }} / {{ subscription.db_data.stock_alerts }}</b-progress>
                        </div>
                    </div>
                    <footer class="card-footer">
                        <a class="card-footer-item" @click.prevent="cancelConfirmation()" v-if="!subscription.db_data.ends_at">Cancel Subscription</a>
                        <a class="card-footer-item" @click.prevent="resumeConfirmation()" v-if="subscription.db_data.ends_at">
                            <b-tooltip type="is-success" position="is-bottom" :label="'You can resume your subscription any time before the service expires on ' + subEnd">
                                Resume Subscription
                            </b-tooltip>
                        </a>
                    </footer>
                </div>
            </div>
        </section>
        <b-loading :is-full-page="false" :active.sync="isPageLoading" :can-cancel="true"></b-loading>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import moment from 'moment'
import PageHeader from '@/components/PageHeader.vue'
import pingstock from '../../../services/pingstock'

export default {
  name: 'Subscription',
  components: {
    PageHeader
  },
  data () {
    return {
      isPageLoading: false,
      subscription: undefined,
      subStart: undefined,
      subEnd: undefined,
      canceledAt: undefined
    }
  },
  created () {
    this.fetchSubscritpion()
  },
  methods: {
    cancel: function () {
      this.isPageLoading = true
      pingstock.cancelSubscription(this.subscription.id)
        .then(resp => {
          this.$buefy.toast.open({
            duration: 5000,
            message: 'Your subscription has been cancelled. Sorry to see you go :(',
            position: 'is-bottom-right',
            type: 'is-success'
          })
          this.fetchSubscritpion()
        })
        .catch(err => {
          this.$buefy.toast.open({
            duration: 5000,
            message: err.response.data.message ? err.response.data.message : 'Cancellation unsuccessful, please try again',
            position: 'is-bottom-right',
            type: 'is-danger'
          })
        })
        .finally(() => {
          this.isPageLoading = false
        })
    },
    resume: function () {
      this.isPageLoading = true
      pingstock.resumeSubscription(this.subscription.id)
        .then(resp => {
          this.$buefy.toast.open({
            duration: 5000,
            message: 'Your subscription has been resumed!',
            position: 'is-bottom-right',
            type: 'is-success'
          })
          this.fetchSubscritpion()
        })
        .catch(err => {
          this.$buefy.toast.open({
            duration: 5000,
            message: err.response.data.message ? err.response.data.message : 'Resume unsuccessful, please try again',
            position: 'is-bottom-right',
            type: 'is-danger'
          })
        })
        .finally(() => {
          this.isPageLoading = false
        })
    },
    cancelConfirmation: function () {
      const vm = this
      this.$buefy.dialog.confirm({
        message: 'Please confirm cancellation of your subscription',
        type: 'is-danger',
        onConfirm: function () {
          vm.cancel()
        }
      })
    },
    resumeConfirmation: function () {
      const vm = this
      this.$buefy.dialog.confirm({
        message: 'Resume subscription?',
        type: 'is-success',
        onConfirm: function () {
          vm.resume()
        }
      })
    },
    fetchSubscritpion: function () {
      pingstock.subscriptions()
        .then(resp => {
          this.subscription = resp.data.data
          this.subStart = moment.unix(resp.data.data.current_period_start).format('DD MMM YYYY')
          this.subEnd = moment.unix(resp.data.data.current_period_end).format('DD MMM YYYY')
          this.canceledAt = moment.unix(resp.data.data.canceled_at).format('DD MMM YYYY HH:mm:ss')
        })
        .catch(err => {
          this.$buefy.toast.open({
            duration: 5000,
            message: err.response.data.message ? err.response.data.message : 'Unable to retrieve subscription information, please refresh',
            position: 'is-bottom-right',
            type: 'is-danger'
          })
        })
    }
  },
  computed: {
    ...mapState(['auth', 'user']),
    usagePercentage: function () {
      return (this.subscription.usage / this.subscription.db_data.stock_alerts) * 100
    }
  }
}
</script>
