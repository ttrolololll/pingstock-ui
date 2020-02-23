<template>
    <div class="payments">
        <PageHeader title="Payment Settings" subtitle=""/>
        <section>
            <div class="tab-content">
                <div class="content" v-if="canShowInitButton">
                    <div class="buttons">
                        <b-button type="is-info" icon-left="credit-card-plus" @click="initiateCardSetup()">Add Card</b-button>
                    </div>
                    <p v-if="!user.card_last_four">No payment method found</p>
                </div>
                <div class="content" v-if="canShowCardForm">
                    <b-field>
                        <div id="card-element"></div>
                    </b-field>
                    <button id="card-button" class="button is-primary is-small" :data-secret="intentClientSecret" @click="cardSetupConfirm()" :disabled="isSubmitting || !intentClientSecret">Confirm</button>
                </div>
                <div class="card" v-if="canShowCard">
                    <header class="card-header is-primary">
                        <p class="card-header-title">{{user.card_brand.toUpperCase()}} - *** {{user.card_last_four}}</p>
                    </header>
                    <footer class="card-footer">
                        <a class="card-footer-item" @click.prevent="initiateCardSetup()">Edit</a>
                        <a class="card-footer-item" @click.prevent="deleteAllCards()">Delete</a>
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

// eslint-disable-next-line no-undef
const stripe = Stripe(process.env.VUE_APP_STRIPE_PUB_KEY)
const stripeElements = stripe.elements()
const cardElement = stripeElements.create('card')

export default {
  name: 'Payments',
  components: {
    PageHeader
  },
  data () {
    return {
      intentClientSecret: undefined,
      isEdit: false,
      isSubmitting: false
    }
  },
  methods: {
    initiateCardSetup: function () {
      this.isEdit = true
      pingstock.stripeSetupIntent()
        .then(resp => {
          this.intentClientSecret = resp.data.data.client_secret
          this.$nextTick(() => {
            cardElement.mount('#card-element')
          })
          this.isEdit = true
        })
        .catch(err => {
          this.$buefy.toast.open({
            duration: 5000,
            message: err.response.data.message ? err.response.data.message : 'Unable to assert card setup intent, please try again',
            position: 'is-bottom-right',
            type: 'is-danger'
          })
          this.isEdit = false
        })
    },
    cardSetupConfirm: async function () {
      this.isSubmitting = true
      // get payment_method from Stripe
      const { setupIntent, err } = await stripe.confirmCardSetup(
        this.intentClientSecret,
        {
          payment_method: {
            card: cardElement
          }
        })
      if (err) {
        this.$buefy.toast.open({
          duration: 5000,
          message: err.message ? err.message : 'Unable to confirm card setup, please try again',
          position: 'is-bottom-right',
          type: 'is-danger'
        })
        this.intentClientSecret = undefined
        this.isSubmitting = false
        return
      }
      if (!setupIntent) {
        this.$buefy.toast.open({
          duration: 5000,
          message: 'Please ensure the credit card details are valid',
          position: 'is-bottom-right',
          type: 'is-danger'
        })
        this.isSubmitting = false
        return
      }
      // update user payment details by payment_method
      const addCardResp = await pingstock.stripeAddCard(setupIntent.payment_method)
      if (addCardResp.status !== 200) {
        this.$buefy.toast.open({
          duration: 5000,
          message: 'Unable to update payment method, please try again',
          position: 'is-bottom-right',
          type: 'is-danger'
        })
        this.intentClientSecret = undefined
        this.isSubmitting = false
        return
      }
      // re-fetch user profile
      pingstock.profile()
        .then(resp => {
          this.$store.dispatch('set_user', resp.data.data)
            .finally(() => {
              this.$buefy.toast.open({
                duration: 5000,
                message: 'Payment method added successfully',
                position: 'is-bottom-right',
                type: 'is-success'
              })
            })
        })
        .catch(() => {
          // refresh if can't re-fetch profile
          location.reload()
        })
        .finally(() => {
          this.isSubmitting = false
          this.isEdit = false
        })
    },
    deleteAllCards: function () {
      pingstock.stripeDeleteAllCards()
        .then(resp => {
          this.$buefy.toast.open({
            duration: 5000,
            message: 'Payment method removed successfully',
            position: 'is-bottom-right',
            type: 'is-success'
          })
        })
        .finally(() => {
          this.$store.dispatch('remove_user_payment_method')
          this.isEdit = false
          this.intentClientSecret = undefined
        })
    }
  },
  computed: {
    ...mapState(['auth', 'user']),
    canShowInitButton: function () {
      return !this.user.card_last_four && !this.intentClientSecret
    },
    canShowCard: function () {
      return this.user.card_last_four && !this.isEdit
    },
    canShowCardForm: function () {
      return (!this.user.card_last_four && this.intentClientSecret) || this.isEdit
    }
  }
}
</script>
