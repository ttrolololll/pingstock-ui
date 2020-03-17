<template>
    <div class="view-stock-alert-rules">
        <PageHeader title="My Stock Alert Rules" subtitle=""/>
        <section>
            <b-notification type="is-info" aria-close-label="Close notification" v-cloak v-if="!user.telegram_id">
                You can now head over to <router-link :to="{name: 'SettingsTelegram'}">Account Settings</router-link> to link your account with your <b><b-icon icon="telegram"></b-icon> Telegram</b> and receive stock alerts via Telegram!
            </b-notification>
            <b-notification type="is-info" aria-close-label="Close notification" v-cloak>
                You can now add stocks to <router-link :to="{name: 'Watchlist'}">watchlist</router-link>, and be notified when stock price is below or above 7%, 13%, 20% (circuit breakers) of your reference price.
            </b-notification>
            <div class="tab-content">
                <section>
                    <b-table
                            :data="stockAlertRules"
                            :paginated="true"
                            :per-page="10"
                            :current-page.sync="currentPage"
                            sort-icon="chevron-up"
                            sort-icon-size="is-small"
                            default-sort="index">
                        <template slot-scope="props">
                            <b-table-column field="index" label="S/N" sortable>{{ props.index + 1 }}</b-table-column>
                            <b-table-column field="stock_symbol" label="Stock" sortable>{{ props.row.stock_symbol }}</b-table-column>
                            <b-table-column field="exchange_symbol" label="Exchange" sortable>{{ props.row.exchange_symbol }}</b-table-column>
                            <b-table-column field="operator" label="Trigger Condition" sortable>{{ props.row.operator }} than</b-table-column>
                            <b-table-column field="target" label="Trigger Value" sortable>{{ props.row.target }}</b-table-column>
                            <b-table-column field="status" label="Status" sortable>
                                <span class="tag" :class="type(props.row.triggered_at)">{{ props.row.triggered_at ? 'Triggered' : 'Active' }}</span>
                            </b-table-column>
                            <b-table-column field="created_at" label="Created At" sortable>
                                <b-tooltip type="is-info" position="is-left" :label="props.row.created_at | toLocalTime | outDateTimeShort">
                                    {{ props.row.created_at | toLocalTime | outHumanizedTimeFromNow }}
                                </b-tooltip>
                            </b-table-column>
                            <b-table-column field="triggered_at" label="Triggered At" key="triggered_at" sortable v-if="props.row.triggered_at">
                                <b-tooltip type="is-info" position="is-left" :label="props.row.triggered_at | toLocalTime | outDateTimeShort">
                                    {{ props.row.triggered_at | toLocalTime | outHumanizedTimeFromNow }}
                                </b-tooltip>
                            </b-table-column>
                            <b-table-column field="actions" label="Actions" key="actions" v-if="!props.row.triggered_at">
                                <div class="buttons">
                                    <b-button type="is-success" rounded @click="edit(props.row)">
                                        <b-tooltip type="is-success" label="Edit"><b-icon icon="pencil" size="is-small"></b-icon></b-tooltip>
                                    </b-button>
                                    <b-button type="is-danger" rounded @click="deleteConfirmation(props.row.id, props.row.stock_symbol)">
                                        <b-tooltip type="is-danger" label="Delete"><b-icon icon="delete-circle" size="is-small"></b-icon></b-tooltip>
                                    </b-button>
                                </div>
                            </b-table-column>
                        </template>
                        <template slot="empty">
                            <section class="section">
                                <div class="content has-text-grey has-text-centered">
                                    <p><b-icon icon="emoticon-tongue" size="is-large"></b-icon></p>
                                    <p>No stock alert rule has been triggered yet</p>
                                </div>
                            </section>
                        </template>
                    </b-table>
                </section>
            </div>
        </section>
        <b-modal :active.sync="isComponentModalActive" :on-cancel="cancelEdit" has-modal-card trap-focus>
            <form @submit.prevent>
                <div class="modal-card">
                    <header class="modal-card-head">
                        <p class="modal-card-title">Modify Stock Alert Rule</p>
                    </header>
                    <section class="modal-card-body">
                        <b-field label="Target Value">
                            <b-input type="text" expanded v-model="selectedRule.stock_symbol" disabled=""></b-input>
                        </b-field>
                        <b-field label="Trigger Condition">
                            <b-select expanded required v-model="selectedRule.operator">
                                <option v-for="opt in optTriggerConditions" :value="opt.value" :key="opt.label">{{ opt.label }}</option>
                            </b-select>
                        </b-field>
                        <b-field label="Target Value">
                            <b-input type="text" expanded required v-model="selectedRule.target">{{ selectedRule.target }}</b-input>
                        </b-field>
                    </section>
                    <footer class="modal-card-foot">
                        <button class="button is-primary" @click="update()">Update</button>
                    </footer>
                </div>
            </form>
        </b-modal>
        <b-loading :is-full-page="false" :active.sync="isPageLoading"></b-loading>
    </div>
</template>

<script>
import PageHeader from '@/components/PageHeader.vue'
import pingstock from '../../services/pingstock'
import { mapState } from 'vuex'

export default {
  name: 'StockAlertRule',
  components: {
    PageHeader
  },
  props: ['triggered'],
  data () {
    return {
      isPageLoading: false,
      isComponentModalActive: false,
      currentPage: 1,
      stockAlertRules: [],
      selectedRule: {},
      optTriggerConditions: [
        {
          label: 'greater than',
          value: 'greater'
        },
        {
          label: 'lesser than',
          value: 'lesser'
        }
      ]
    }
  },
  created () {
    this.fetchStockAlertRules()
  },
  methods: {
    edit: function (rule) {
      this.selectedRule = rule
      this.isComponentModalActive = true
    },
    cancelEdit: function () {
      this.selectedRule = {}
    },
    update: function () {
      this.isPageLoading = true
      this.isComponentModalActive = false
      pingstock.updateStockAlertRule(this.selectedRule)
        .then(resp => {
          this.$buefy.toast.open({
            duration: 5000,
            message: 'Stock alert rule has been updated',
            position: 'is-bottom-right',
            type: 'is-success'
          })
        })
        .catch(err => {
          this.$buefy.toast.open({
            duration: 5000,
            message: err.response.data.message ? err.response.data.message : 'Unable to update rule, please try again',
            position: 'is-bottom-right',
            type: 'is-danger'
          })
        })
        .finally(() => {
          this.fetchStockAlertRules()
          this.selectedRule = {}
          this.isPageLoading = false
        })
    },
    delete: function (ruleID) {
      this.isPageLoading = true
      pingstock.deleteStockAlertRule(ruleID)
        .then(resp => {
          this.$buefy.toast.open({
            duration: 5000,
            message: 'Stock alert rule has been deleted',
            position: 'is-bottom-right',
            type: 'is-success'
          })
        })
        .catch(err => {
          this.$buefy.toast.open({
            duration: 5000,
            message: err.response.data.message ? err.response.data.message : 'Unable to delete rule, please try again',
            position: 'is-bottom-right',
            type: 'is-danger'
          })
        })
        .finally(() => {
          this.fetchStockAlertRules()
          this.isPageLoading = false
        })
    },
    deleteConfirmation: function (ruleID, stockSymbol) {
      const vm = this
      this.$buefy.dialog.confirm({
        message: 'Delete stock alert rule for ' + stockSymbol + '?',
        type: 'is-danger',
        onConfirm: function () {
          vm.delete(ruleID)
        }
      })
    },
    type (value) {
      if (value) {
        return 'is-light'
      }
      return 'is-success'
    },
    fetchStockAlertRules: function () {
      this.isPageLoading = true
      pingstock.stockAlertRules(this.$props.triggered)
        .then(resp => {
          this.stockAlertRules = resp.data
        })
        .catch(err => {
          this.$buefy.toast.open({
            duration: 5000,
            message: err.response.data.message ? err.response.data.message : 'Unable to retrieve your stock alert rules, please try again',
            position: 'is-bottom-right',
            type: 'is-danger'
          })
        })
        .finally(() => {
          this.isPageLoading = false
        })
    }
  },
  computed: {
    ...mapState(['user'])
  },
  watch: {
    '$props.triggered': function () {
      this.fetchStockAlertRules()
    }
  }
}
</script>
