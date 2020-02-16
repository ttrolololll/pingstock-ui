<template>
  <div class="container is-fluid is-full-fullhd">
    <div class="columns">
      <div class="column is-3">
        <SiteSidebar/>
      </div>
      <div class="column">
        <div class="page-content">
          <router-view/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SiteSidebar from '@/components/layout/SiteSidebar'
export default {
  name: 'DefaultLayout',
  components: { SiteSidebar }
}
</script>

<style lang="scss">
  .page-content {
    padding-top: 1rem;
    padding-bottom: 1rem;
  }
</style>
