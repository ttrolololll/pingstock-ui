<template>
  <div class="container is-fluid">
    <div class="columns is-desktop">
      <div class="column is-12-tablet is-3-desktop">
        <SiteSidebar/>
      </div>
      <div class="column is-12-tablet is-9-desktop">
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
  .container.is-fluid {
    margin-left: 32px;
    margin-right: 32px;
  }
  .page-content {
    padding-top: 1rem;
    padding-bottom: 1rem;
    margin-top: 75px;
    @media (min-width: 1024px) {
      margin-top: 0;
    }
  }
</style>
