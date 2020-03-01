<template>
    <div class="view-create-stock-alert-rules">
        <PageHeader title="Create New Rule" subtitle=""/>
        <section>
            <div class="tab-content">
                <section>
                    <div class="content">
                        <b-message title="Upgrade to create more stock alert rules" type="is-info" v-if="isUpgradeNotice">
                            You have reached the maximum allowed stock alert rules, please consider <router-link :to="{name: 'Subscriptions'}">upgrading</router-link> to get more out of your membership
                        </b-message>
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
                        <form v-on:submit.prevent="createRule()">
                            <b-field label="Trigger Condition">
                                <b-select expanded required v-model="fields.operator">
                                    <option v-for="opt in optTriggerConditions" :value="opt.value" :key="opt.label">{{ opt.label }}</option>
                                </b-select>
                            </b-field>
                            <b-field label="Target Price / Unit">
                                <b-input expanded required placeholder="eg. 8.88" v-model="fields.target" type="text"></b-input>
                            </b-field>
                            <div class="content">
                                <p><b-button type="is-success" nativeType="submit" size="is-medium" expanded>Create</b-button></p>
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
  name: 'NewStockAlertRule',
  components: {
    PageHeader
  },
  data () {
    return {
      isPageLoading: false,
      isFetching: false,
      isUpgradeNotice: false,
      searchTerm: '',
      data: [],
      selected: null,
      fields: {
        operator: null,
        target: null
      },
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
  methods: {
    createRule: function () {
      this.isPageLoading = true
      pingstock.createStockAlertRule(this.selected.symbol, this.fields.operator, this.fields.target)
        .then(resp => {
          this.$buefy.toast.open({
            duration: 5000,
            message: 'New stock alert rule created successfully!',
            position: 'is-bottom-right',
            type: 'is-success'
          })
          this.$router.push('/stock-alert-rules')
        })
        .catch(err => {
          if (err.response.status === 403) {
            this.isUpgradeNotice = true
          }
          this.$buefy.toast.open({
            duration: 5000,
            message: err.response.data.message ? err.response.data.message : 'Unable to create rule, please try again',
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
