<template>
  <v-app dark>
    <navbar-drawer v-model="drawer"></navbar-drawer>
    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
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
  }
}
</script>
