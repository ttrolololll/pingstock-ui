<template>
  <div id="app">
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
<!--    <div id="nav">-->
<!--      <router-link to="/">Home</router-link> |-->
<!--      <router-link to="/about">About</router-link>-->
<!--    </div>-->
<!--    <router-view/>-->
  </div>
</template>

<script>
import SiteSidebar from '@/components/layout/SiteSidebar'
export default {
  components: { SiteSidebar }
}

</script>

<style lang="scss">
  #app {
    padding-top: 1rem;
    padding-bottom: 1rem;
  }
</style>
