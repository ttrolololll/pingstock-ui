<template>
    <div class="view-watchlist">
        <PageHeader title="My Watchlist" subtitle=""/>
        <section>
            <b-notification type="is-info" aria-close-label="Close notification" v-cloak v-if="!user.telegram_id">
                You can now head over to <router-link :to="{name: 'SettingsTelegram'}">Account Settings</router-link> to link your account with your <b><b-icon icon="telegram"></b-icon> Telegram</b> and receive stock alerts via Telegram!
            </b-notification>
            <div class="tab-content">
                <div class="buttons">
                    <b-button type="is-info" icon-left="bookmark-plus" @click="$router.push('/watchlists/new')">Add New</b-button>
                </div>
                <section>
                    <b-table
                            :data="watchlistItems"
                            :paginated="true"
                            :per-page="10"
                            :current-page.sync="currentPage"
                            detailed
                            hoverable
                            :show-detail-icon="true"
                            detail-key="stock_symbol"
                            :opened-detailed="defaultOpenedDetails"
                            sort-icon="chevron-up"
                            sort-icon-size="is-small"
                            default-sort="index">
                        <template slot-scope="props">
                            <b-table-column field="index" label="S/N" sortable>{{ props.index + 1 }}</b-table-column>
                            <b-table-column field="stock_symbol" label="Stock" sortable>{{ props.row.stock_symbol }}</b-table-column>
                            <b-table-column field="exchange_symbol" label="Exchange" sortable>{{ props.row.exchange_symbol }}</b-table-column>
                            <b-table-column field="reference_target" label="Reference Price" sortable>{{ props.row.reference_target }}</b-table-column>
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
                        <template slot="detail" slot-scope="props">
                            <div class="content">
                                <h5>Circuit Breakers</h5>
                            </div>
                            <table class="table">
                                <thead>
                                <tr>
                                    <th>Key</th>
                                    <th>Threshold (%)</th>
                                    <th>Last Triggered</th>
                                    <th>Mute Till</th>
                                    <th>Status</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr v-for="(item, key) in props.row.circuit_breakers" :key="key">
                                    <td>{{key}}</td>
                                    <td>{{item.threshold}}</td>
                                    <td>
                                        <b-tooltip type="is-info" position="is-top" :label="item.last_triggered | toLocalTime | outDateTimeShort">
                                            {{ item.last_triggered | toLocalTime | outHumanizedTimeFromNow }}
                                        </b-tooltip>
                                    </td>
                                    <td>
                                        <b-tooltip type="is-info" position="is-top" :label="item.mute_till | toLocalTime | outDateTimeShort">
                                            {{ item.mute_till | toLocalTime | outHumanizedTimeFromNow }}
                                        </b-tooltip>
                                    </td>
                                    <td>
                                        <b-tag type="is-success" v-if="item.is_active">Active</b-tag>
                                        <b-tag type="is-default" v-if="!item.is_active">Inactive</b-tag>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </template>
                        <template slot="empty">
                            <section class="section">
                                <div class="content has-text-grey has-text-centered">
                                    <p><b-icon icon="emoticon-tongue" size="is-large"></b-icon></p>
                                    <p>Nothing in your watchlist yet</p>
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
                        <p class="modal-card-title">Modify Watchlist Item</p>
                    </header>
                    <section class="modal-card-body">
                        <b-field label="Reference Price" message="If you already own this stock, the recommended value is your average purchase price / unit. If not, you can use Simple Moving Average (SMA) or Exponential Moving Average (EMA) value for this stock. You can refer to TradingView to see the moving averages, eg for D05.SI: https://www.tradingview.com/symbols/SGX-D05/technicals">
                            <b-input expanded required placeholder="eg. 8.88" v-model="selectedItem.reference_target" type="text"></b-input>
                        </b-field>
                        <b-field label="Circuit Breakers">
                            <table class="table">
                                <thead>
                                <tr>
                                    <th>Key</th>
                                    <th>Active</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr v-for="(item, index) in selectedItem.circuit_breakers" :key="index">
                                    <td>{{index}}</td>
                                    <td>
                                        <b-switch v-model="item.is_active"
                                                  :true-value="true"
                                                  :false-value="false">
                                        </b-switch>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
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
import moment from 'moment'
import PageHeader from '@/components/PageHeader.vue'
import pingstock from '../../services/pingstock'
import { mapState } from 'vuex'

export default {
  name: 'Watchlist',
  components: {
    PageHeader
  },
  props: ['triggered'],
  data () {
    return {
      isPageLoading: false,
      isComponentModalActive: false,
      currentPage: 1,
      defaultOpenedDetails: [],
      watchlistItems: [],
      selectedItem: {}
    }
  },
  created () {
    this.fetchWatchlistItems()
  },
  methods: {
    edit: function (item) {
      this.selectedItem = item
      this.isComponentModalActive = true
    },
    cancelEdit: function () {
      this.selectedItem = {}
    },
    update: function () {
      this.isPageLoading = true
      this.isComponentModalActive = false
      const cbs = JSON.stringify(this.selectedItem.circuit_breakers)
      pingstock.updateWatchlistItem(this.selectedItem.id, this.selectedItem.reference_target, cbs)
        .then(resp => {
          this.$buefy.toast.open({
            duration: 5000,
            message: 'Watchlist item has been updated',
            position: 'is-bottom-right',
            type: 'is-success'
          })
        })
        .catch(err => {
          this.$buefy.toast.open({
            duration: 5000,
            message: err.response.data.message ? err.response.data.message : 'Unable to update watchlist item, please try again',
            position: 'is-bottom-right',
            type: 'is-danger'
          })
        })
        .finally(() => {
          this.fetchWatchlistItems()
          this.selectedRule = {}
          this.isPageLoading = false
        })
    },
    delete: function (itemID) {
      this.isPageLoading = true
      pingstock.deleteWatchlistItem(itemID)
        .then(resp => {
          this.$buefy.toast.open({
            duration: 5000,
            message: 'Deleted from watchlist',
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
          this.fetchWatchlistItems()
          this.isPageLoading = false
        })
    },
    deleteConfirmation: function (itemID, stockSymbol) {
      const vm = this
      this.$buefy.dialog.confirm({
        message: 'Delete ' + stockSymbol + ' from watchlist?',
        type: 'is-danger',
        onConfirm: function () {
          vm.delete(itemID)
        }
      })
    },
    fetchWatchlistItems: function () {
      this.isPageLoading = true
      pingstock.watchlistItems()
        .then(resp => {
          const symbols = []
          resp.data.data.forEach(function (item, index) {
            item.circuit_breakers = JSON.parse(item.circuit_breakers)
            if (index === 0) {
              symbols.push(item.stock_symbol)
            }
          })
          this.watchlistItems = resp.data.data
          this.defaultOpenedDetails = symbols
        })
        .catch(err => {
          this.$buefy.toast.open({
            duration: 5000,
            message: err.response.data.message ? err.response.data.message : 'Unable to retrieve watchlist items',
            position: 'is-bottom-right',
            type: 'is-danger'
          })
        })
        .finally(() => {
          this.isPageLoading = false
        })
    },
    formatDatetime: function (d) {
      return moment(d).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  computed: {
    ...mapState(['user'])
  }
}
</script>
