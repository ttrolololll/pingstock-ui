<template>
    <div class="view-create-watchlist-item">
        <PageHeader title="Add to Watchlist" subtitle=""/>
        <section>
            <div class="tab-content">
                <section>
                    <div class="content">
                        <b-field label="Stock Symbol" message="Currently supports SG, US and HK equities">
                            <b-autocomplete
                                    :data="data"
                                    placeholder="e.g. dbs"
                                    field="display_title"
                                    :loading="isFetching"
                                    :readonly="isFetching"
                                    icon="magnify"
                                    @typing="getSearchResults"
                                    @select="option => selected = option">
                                <template slot="empty" v-if="searchTerm.length === 0">Please enter at least 3 characters</template>
                                <template slot="empty" v-if="searchTerm.length > 2">No results found</template>
                            </b-autocomplete>
                        </b-field>
                    </div>
                    <div class="content" v-if="selected != null">
                        <form v-on:submit.prevent="createWatchlistItem()">
                            <b-field label="Reference Price" message="If you already own this stock, the recommended value is your average purchase price / unit. If not, you can use Simple Moving Average (SMA) or Exponential Moving Average (EMA) value for this stock. You can refer to TradingView to see the moving averages, eg for D05.SI: https://www.tradingview.com/symbols/SGX-D05/technicals">
                                <b-input expanded required placeholder="eg. 8.88" v-model="fields.reference_target" type="text"></b-input>
                            </b-field>
                            <div class="content">
                                <p><b-button type="is-success" nativeType="submit" size="is-medium" expanded>Add</b-button></p>
                            </div>
                        </form>
                    </div>
                </section>
            </div>
        </section>
        <b-loading :is-full-page="false" :active.sync="isPageLoading"></b-loading>
    </div>
</template>

<script>
import _ from 'lodash'
import PageHeader from '@/components/PageHeader.vue'
import pingstock from '../../services/pingstock'

export default {
  name: 'NewWatchlistItem',
  components: {
    PageHeader
  },
  data () {
    return {
      isPageLoading: false,
      isFetching: false,
      searchTerm: '',
      data: [],
      selected: null,
      fields: {
        reference_target: null
      }
    }
  },
  methods: {
    createWatchlistItem: function () {
      this.isPageLoading = true
      pingstock.createWatchlistItem(this.selected.symbol, this.fields.reference_target)
        .then(resp => {
          this.$buefy.toast.open({
            duration: 5000,
            message: 'Added to watchlist!',
            position: 'is-bottom-right',
            type: 'is-success'
          })
          this.$router.push('/watchlists')
        })
        .catch(err => {
          this.$buefy.toast.open({
            duration: 5000,
            message: err.response.data.message ? err.response.data.message : 'Unable to add to watchlist, please try again',
            position: 'is-bottom-right',
            type: 'is-danger'
          })
        })
        .finally(() => {
          this.isPageLoading = false
        })
    },
    getSearchResults: _.debounce(function (name) {
      if (name.length < 3) {
        this.data = []
        return
      }
      this.isFetching = true
      pingstock.searchStocks(name)
        .then(resp => {
          this.data = resp.data
        })
        .catch(err => {
          this.$buefy.toast.open({
            duration: 5000,
            message: err.response.data.message ? err.response.data.message : 'Unable to get search results, please try again',
            position: 'is-bottom-right',
            type: 'is-danger'
          })
        })
        .finally(() => {
          this.isFetching = false
        })
    }, 500)
  }
}
</script>
