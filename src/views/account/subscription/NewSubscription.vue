<template>
    <div class="view-subscription-new">
        <PageHeader title="New Subscription" subtitle=""/>
        <section>
            <div class="tab-content" v-if="products.length > 0">
                <b-steps v-model="activeStep" :has-navigation="false" size="is-small">
                    <b-step-item label="Billing Interval">
                        <b-field :label="products[0].name">
                            <b-select placeholder="Select Billing Interval" v-model="selectedPlan" expanded required>
                                <option v-for="(plan, index) in products[0].plans" :key="index" :value="plan.id">{{ plan.nickname }} @ {{ plan.currency.toUpperCase() }} {{ (plan.amount / 100).toFixed(2) }}</option>
                            </b-select>
                        </b-field>
                        <b-button
                                type="is-primary"
                                icon-right="chevron-right"
                                expanded
                                :disabled="selectedPlan === undefined"
                                @click="handleBillingSelect()">
                            Select
                        </b-button>
                    </b-step-item>
                    <b-step-item label="Payment">
                        <div class="content" v-if="paymentMethods.length === 0">
                            <p>You have not added any payment method. Add one <router-link :to="{name: 'Payments'}">here</router-link>.</p>
                        </div>
                        <div class="content" v-if="paymentMethods.length > 0">
                            <b-field label="Payment Method">
                                <b-select placeholder="Select Payment Method" v-model="selectedPayment" expanded required>
                                    <option v-for="(pm, index) in paymentMethods" :key="index" :value="pm.id">{{ pm.card.brand.toUpperCase() }} - {{ pm.card.last4 }}</option>
                                </b-select>
                            </b-field>
                            <b-button
                                    type="is-primary"
                                    icon-right="ticket"
                                    expanded
                                    :disabled="selectedPlan === undefined || selectedPayment === undefined || isSubscribing"
                                    @click="handlePaymentMethod()">
                                Subscribe
                            </b-button>
                        </div>
                    </b-step-item>
                </b-steps>
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
  name: 'NewSubscription',
  components: {
    PageHeader
  },
  data () {
    return {
      isPageLoading: false,
      products: [],
      paymentMethods: [],
      isSubscribing: false,
      activeStep: 0,
      selectedPlan: undefined,
      selectedPayment: undefined
    }
  },
  beforeRouteEnter: (to, from, next) => {
    pingstock.subscriptions()
      .then(resp => {
        if (resp.data.data && resp.data.data.stripe_plan !== '') {
          next(vm => {
            vm.$router.push({ name: 'Subscriptions' })
            vm.$buefy.toast.open({
              duration: 5000,
              message: 'Already have an active subscription',
              position: 'is-bottom-right',
              type: 'is-danger'
            })
          })
          return
        }
        next(vm => {})
      })
      .catch(() => {
        next(() => {})
      })
  },
  created () {
    pingstock.products()
      .then(resp => {
        this.products = resp.data.data
      })
      .catch(() => {
        this.$router.push('/stock-alert-rules')
      })
    pingstock.paymentMethods()
      .then(resp => {
        this.paymentMethods = resp.data.data
      })
      .catch(() => {
        this.$router.push('/stock-alert-rules')
      })
  },
  methods: {
    handleBillingSelect: function () {
      if (this.selectedPlan !== undefined) {
        this.activeStep += 1
      }
    },
    handlePaymentMethod: function () {
      this.isPageLoading = true
      this.isSubmitting = true
      pingstock.subscribe(this.selectedPlan)
        .then(resp => {
          this.$buefy.toast.open({
            duration: 5000,
            message: 'Successfully subscribed to selected plan',
            position: 'is-bottom-right',
            type: 'is-success'
          })
          this.$router.push({ name: 'Subscriptions' })
        })
        .catch(err => {
          this.$buefy.toast.open({
            duration: 5000,
            message: err.response.data.message ? err.response.data.message : 'Subscription attempt unsuccessful, please try again',
            position: 'is-bottom-right',
            type: 'is-danger'
          })
        })
        .finally(() => {
          this.isSubscribing = false
          this.isPageLoading = false
        })
    }
  },
  computed: {
    ...mapState(['auth', 'user'])
  }
}
</script>
