<template>
    <div class="settings">
        <PageHeader title="Account Settings" subtitle=""/>
        <router-view/>
        <b-loading :is-full-page="false" :active.sync="isPageLoading"></b-loading>
    </div>
</template>

<script>
import PageHeader from '@/components/PageHeader.vue'

export default {
  name: 'Settings',
  components: {
    PageHeader
  },
  data () {
    return {
      currentTab: 0,
      isPageLoading: false
    }
  },
  methods: {
    switchTab: function (e) {
      console.log(e)
      console.log(12)
    }
  }
}
</script>
