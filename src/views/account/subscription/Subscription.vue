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
                            <b-tag rounded type="is-primary" v-if="subscription.db_data.stripe_status === 'active'">{{subscription.db_data.stripe_status}}</b-tag>
                            <b-tag rounded type="is-light" v-if="subscription.db_data.stripe_status !== 'active'">{{subscription.db_data.stripe_status}}</b-tag>
                        </a>
                    </header>
                    <div class="card-content">
                        <div class="content">
                            <h6>Stock Alert Rule Usage:</h6>
                            <b-progress type="is-success" size="is-medium" :value="(3 / subscription.db_data.stock_alerts) * 100" show-value>3 / 20</b-progress>
                        </div>
                    </div>
                    <footer class="card-footer">
                        <a class="card-footer-item" @click.prevent="deleteAllCards()">Cancel</a>
                    </footer>
                </div>
            </div>
        </section>
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
      subscription: undefined,
      subStart: undefined,
      subEnd: undefined
    }
  },
  created () {
    pingstock.subscriptions()
      .then(resp => {
        this.subscription = resp.data.data
        this.subStart = moment.unix(resp.data.data.current_period_start).format('DD MMM YYYY')
        this.subEnd = moment.unix(resp.data.data.current_period_end).format('DD MMM YYYY')
      })
      .catch(err => {
        this.$buefy.toast.open({
          duration: 5000,
          message: err.response.data.message ? err.response.data.message : 'Unable to retrieve subscription information, please refresh',
          position: 'is-bottom-right',
          type: 'is-danger'
        })
      })
  },
  methods: {
  },
  computed: {
    ...mapState(['auth', 'user'])
  }
}
</script>
