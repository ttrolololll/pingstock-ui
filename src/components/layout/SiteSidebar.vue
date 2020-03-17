<template>
    <b-menu class="site-menu">
        <figure class="menu-logo level is-mobile">
            <div class="level-left">
                <div class="level-item">
                    <img src="../../assets/logo.png" alt="PingStock.io">
                </div>
            </div>
            <div class="level-right is-hidden-desktop">
                <div class="level-item">
                    <b-button @click="toggleMenu()"><b-icon icon="menu"></b-icon></b-button>
                </div>
            </div>
        </figure>
        <div :class="{'menu-container': true, 'dislay-mobile-menu': isShowMobileMenu}" @click="toggleMenu()">
            <b-menu-list label="Watchlist">
                <b-menu-item
                        label="My Watchlist"
                        icon="bookmark-check"
                        tag="router-link"
                        to="/watchlists">
                </b-menu-item>
                <b-menu-item
                        label="Add New"
                        icon="bookmark-plus"
                        tag="router-link"
                        to="/watchlists/new">
                </b-menu-item>
            </b-menu-list>
            <b-menu-list label="Stock Alert Rules">
                <b-menu-item
                        label="My Alert Rules"
                        icon="bell-outline"
                        tag="router-link"
                        to="/stock-alert-rules">
                </b-menu-item>
                <b-menu-item
                        label="Triggered Rules"
                        icon="bell-ring-outline"
                        tag="router-link"
                        to="/stock-alert-rules/triggered">
                </b-menu-item>
                <b-menu-item
                        label="Create New"
                        icon="bell-plus"
                        tag="router-link"
                        to="/stock-alert-rules/new">
                </b-menu-item>
            </b-menu-list>
            <b-menu-list label="Account">
                <b-menu-item
                        label="Profile"
                        icon="account-circle"
                        tag="router-link"
                        to="/account/profile">
                </b-menu-item>
                <b-menu-item
                        label="Settings"
                        icon="cogs"
                        tag="router-link"
                        to="/account/settings/telegram">
                </b-menu-item>
                <b-menu-item
                        label="Payments"
                        icon="cash-multiple"
                        tag="router-link"
                        to="/account/payments">
                </b-menu-item>
                <b-menu-item
                        label="Subscriptions"
                        icon="ticket"
                        tag="router-link"
                        to="/account/subscriptions">
                </b-menu-item>
            </b-menu-list>
            <b-menu-list label="Actions">
                <b-menu-item
                        label="Logout"
                        icon="logout"
                        tag="router-link"
                        to="/logout">
                </b-menu-item>
            </b-menu-list>
        </div>
<!--        <b-menu-list>-->
<!--            <b-menu-item-->
<!--                    label="Dashboard"-->
<!--                    icon="home"-->
<!--                    tag="router-link"-->
<!--                    to="/dashboard">-->
<!--            </b-menu-item>-->
<!--        </b-menu-list>-->
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
      isActive: false,
      isShowMobileMenu: false
    }
  },
  methods: {
    toggleMenu: function () {
      this.isShowMobileMenu = !this.isShowMobileMenu
    }
  }
}
</script>

<style lang="scss">
    .site-menu {
        background: white;
        overflow: auto;
        padding-top: 1rem;
        padding-bottom: 1rem;
        position: fixed;
        z-index: 20;
        top: 0;
        left: 0;
        width: 100%;
        padding-left: 32px;
        padding-right: 32px;
        border-bottom: 1px solid #f2f2f2;
        @media  (min-width: 1024px) {
            position: relative;
            height: calc(100vh - 2rem);
            padding-left: 0;
            padding-right: 0;
            border-right: 1px solid #f2f2f2;
            border-bottom: none;
        }
        .menu-logo {
            margin-bottom: 0;
            @media (min-width: 1024px) {
                margin-bottom: 1rem;
            }
            img {
                max-width: 200px;
            }
        }
        .menu-container {
            position: relative;
            z-index: 30;
            display: none;
            background: white;
            margin-top: 32px;
            @media (min-width: 1024px) {
                display: block;
                height: auto;
                margin-top: 0;
            }
            &.dislay-mobile-menu {
                display: block;
            }
        }
    }
</style>
