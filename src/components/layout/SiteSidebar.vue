<template>
    <b-menu class="site-menu">
        <figure class="menu-logo">
            <img src="https://raw.githubusercontent.com/buefy/buefy/dev/static/img/buefy-logo.png"
                 alt="Lightweight UI components for Vue.js based on Bulma">
        </figure>
        <b-menu-list>
            <b-menu-item
                    label="Dashboard"
                    icon="home"
                    tag="router-link"
                    to="/">
            </b-menu-item>
        </b-menu-list>
        <b-menu-list label="Stock Alert Rules">
            <b-menu-item
                    label="Create New"
                    icon="home"
                    tag="router-link"
                    to="/expo">
            </b-menu-item>
            <b-menu-item
                    label="Active Rules"
                    icon="home"
                    tag="router-link"
                    to="/expo">
            </b-menu-item>
            <b-menu-item
                    label="Triggered Rules"
                    icon="home"
                    tag="router-link"
                    to="/expo">
            </b-menu-item>
        </b-menu-list>
        <b-menu-list label="Account">
            <b-menu-item
                    label="Profile"
                    icon="home"
                    tag="router-link"
                    to="/expo">
            </b-menu-item>
            <b-menu-item
                    label="Payments"
                    icon="home"
                    tag="router-link"
                    to="/expo">
            </b-menu-item>
            <b-menu-item
                    label="Subscriptions"
                    icon="home"
                    tag="router-link"
                    to="/expo">
            </b-menu-item>
        </b-menu-list>
        <b-menu-list label="Actions">
            <b-menu-item
                    label="Logout"
                    icon="settings"
                    tag="router-link"
                    to="/expo">
            </b-menu-item>
        </b-menu-list>
    </b-menu>
</template>

<script>
export default {
  name: 'SiteSidebar',
  props: {
    expanded: Boolean
  },
  data () {
    return {
      isActive: false
    }
  }
}
</script>

<style lang="scss">
    .site-menu {
        height: calc(100vh - 2rem);
        overflow: auto;
        padding-top: 1rem;
        padding-bottom: 1rem;
        border-right: 1px solid #f2f2f2;
        .menu-logo {
            margin-bottom: 1rem;
            img {
                max-width: 100px;
            }
        }
    }
</style>
