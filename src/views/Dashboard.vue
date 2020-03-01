<template>
  <div class="home">
    <PageHeader title="Dashboard" :subtitle="'Welcome ' + user.first_name"/>
  </div>
</template>

<script>
import PageHeader from '@/components/PageHeader.vue'
import { mapState } from 'vuex'

export default {
  name: 'Dashboard',
  components: {
    PageHeader
  },
  computed: {
    ...mapState(['auth', 'user'])
  }
}
</script>
