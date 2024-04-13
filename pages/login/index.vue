<template>
  <v-layout fill-height color="primary">
    <v-sheet width="100%" height="100%" class="d-flex align-center justify-center" color="primary">
      <v-card outlined width="30%" class="d-block justify-center align-center rounded-xl pa-8" shaped>
        <v-layout column justify-center align-center class="">
          <h1 class="text-center">
            Sign In
          </h1>
        </v-layout>

        <v-card-text>
          <v-form v-model="valid" @submit.prevent="login()">
            <v-text-field
              v-model="form.username"
              class="rounded-xl"
              color="black"

              prepend-inner-icon="mdi-account"
              placeholder="Username"
              :rules="[$rules.required]"
            />
            <v-text-field
              v-model="form.password"
              class="rounded-xl"
              color="black"

              prepend-inner-icon="mdi-lock"
              placeholder="Password"
              :rules="[$rules.required]"
              :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              :type="showPassword ? 'text' : 'password'"
              @click:append="showPassword = !showPassword"
            />
            <v-layout justify-space-between align-center class="mb-6 accent--text">
              <v-btn to="/ForgotPassword" plain class="ma-0 pa-0 accent--text">
                Forgot password
              </v-btn>
            </v-layout>
            <v-layout column justify-center align-center>
              <v-btn
                width="90%"
                type="submit"
                :disabled="!valid || loading"
                large
                depressed
                color="primary"
                class="text-none text-h6 pa-5 mb-4 rounded-xl"
              >
                Sign In
              </v-btn>
              <v-btn
                width="90%"
                large
                depressed
                class="text-none text-h6 pa-5 primary--text rounded-xl"
                to="/login/create-account"
              >
                Create Account
              </v-btn>
            </v-layout>
          </v-form>
        </v-card-text>
      </v-card>
    </v-sheet>
  </v-layout>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      valid: false,
      form: {
        username: undefined,
        password: undefined
      },
      loading: false,
      showPassword: false
    }
  },
  methods: {
    async login () {
      try {
        const res = await this.$axios.post('auth/login', this.form)
        await this.$auth.setToken('local', 'Bearer ' + res.data.token)
        await this.$auth.setUser(res.data.user)
        this.$router.push('/')
      } catch (err) {

      }
    }
  }
}
</script>
  <style scoped>
  </style>
