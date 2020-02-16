<template>
    <header class="page-header">
        <div class="titles">
            <h1 class="title">{{ title }}</h1>
            <h2 class="subtitle" v-if="subtitle !== undefined && subtitle !==''">{{ subtitle }}</h2>
        </div>
    </header>
</template>

<script>
export default {
  name: 'PageHeader',
  props: {
    title: String,
    subtitle: String
  },
  data () {
    return {
    }
  }
}
</script>

<style lang="scss">
    .page-header {
        border-bottom: 1px solid #f2f2f2;
        margin-bottom: 1rem;
        .titles {
            padding-bottom: 1rem;
        }
    }
</style>
