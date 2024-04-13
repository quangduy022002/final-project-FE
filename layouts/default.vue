<template>
  <v-app dark>
    <navbar-drawer v-if="$auth.loggedIn" v-model="drawer" />
    <v-main>
      <Nuxt />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'DefaultLayout',
  data () {
    return {
      drawer: false
    }
  },
  mounted () {
    if (!this.$auth.loggedIn) {
      this.$router.push('/login')
    }
  }
}
</script>
