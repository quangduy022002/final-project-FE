<template>
  <v-layout fill-height column class=" align-center justify-center">
    <v-btn
      background-color="primary"
      color="primary"
      class="text-none"
      depressed
      @click="acceptInvite"
    >
      Accept Invite
    </v-btn>
  </v-layout>
</template>

<script>
export default {
  name: 'AcceptIndex',
  data () {
    return {}
  },
  methods: {
    async acceptInvite () {
      const { data } = await this.$axios.post('projects/acceptInvite', {
        projectId: this.$route.query.projectId,
        email: this.$route.query.email
      })

      if (data.status) {
        this.$router.push(`${this.$route.query.projectId}`)
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
