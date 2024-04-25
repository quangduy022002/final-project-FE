<template>
  <div />
</template>
<script>
export default {
  name: 'LogoutPage',
  async mounted () {
    await this.$auth.logout()
    this.$router.push('/login')
  }
}
</script>
