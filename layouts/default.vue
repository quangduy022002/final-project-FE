<template>
  <v-app dark>
    <navbar-drawer v-if="$auth.loggedIn" v-model="drawer"></navbar-drawer>
    <v-main class="overflow-y-auto">
        <Nuxt />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'DefaultLayout',
  data () {
    return {
      drawer: false,
    }
  },
  mounted(){
    console.log(this.$auth)
  }
}
</script>
