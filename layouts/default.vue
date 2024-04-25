<template>
  <v-app>
    <v-snackbar v-if="messages.length" v-model="snackbar" :timeout="3000">
      <v-alert
        :value="messages.at(-1).value"
        :type="messages.at(-1).type"
        :icon="`mdi-${messages.at(-1).icon || 'alert'}`"
        elevation="5"
        class="ma-0"
      >
        {{ messages.at(-1).message }}
      </v-alert>

      <template #action>
        <v-btn icon>
          <v-icon @click="(snackbar = false)">
            mdi-close
          </v-icon>
        </v-btn>
      </template>
    </v-snackbar>
    <navbar-drawer v-if="$auth.loggedIn" v-model="mini" v-click-outside="onClickOutside" />
    <v-main>
      <Nuxt />
    </v-main>
  </v-app>
</template>

<script>
import { mapFields } from 'vuex-map-fields'

export default {
  name: 'DefaultLayout',
  data () {
    return {
      mini: true,
      snackbar: false,
      snackbarTime: 0
    }
  },
  computed: {
    ...mapFields('alerts', ['messages'])
  },
  watch: {
    messages () {
      if (this.messages.length > 0 && this.messages.at(-1).created.getTime() > this.snackbarTime) {
        this.snackbar = true
        this.snackbarTime = this.messages.at(-1).created.getTime()
      }
    }
  },
  mounted () {
    if (!this.$auth.loggedIn && !this.$route.path.includes('/login')) {
      this.$router.push('/login')
    }
  },
  methods: {
    onClickOutside () {
      this.mini = true
    }
  }
}
</script>
