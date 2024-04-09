<template>
  <v-card flat>
    <div class="d-flex align-center">
      <v-avatar color="red">
        <img v-if="user.avatar" :src="user.avatar" alt="avatar">
        <span v-else class="white--text text-h6 font-weight-regular">
          {{ user.firstName.slice(0,1) }}{{ user.lastName.slice(0,1) }}
        </span>
      </v-avatar>
      <div class="ml-2">
        <p class="text-subtitle-1 mb-0 font-weight-medium">
          {{ user.firstName }} {{ user.lastName }}
        </p>
        <p class="mb-0 text-subtitle-2 font-weight-regular grey--text">
          {{ user.email }}
        </p>
      </div>
    </div>
  </v-card>
</template>

<script>
export default {
  name: 'CardMember',
  props: {
    user: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {}
  }
}
</script>

<style lang="scss" scoped>

</style>
