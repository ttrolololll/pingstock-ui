<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="scss">
  .view-auth {
    .hero {
      background: #f9f9f9;
      border: 1rem solid white;
      .logo {
        margin-bottom: 1rem;
        img {
          max-width: 200px;
        }
      }
      .v-facebook-login {
        cursor: pointer;
        margin: 0 auto;
      }
    }
  }
</style>
