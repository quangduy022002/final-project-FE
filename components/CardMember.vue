<template>
  <v-card flat>
    <div class="d-flex align-center">
      <v-avatar :color="randomColor">
        <img v-if="user.avatar" :src="user.avatar" alt="avatar">
        <!-- <span v-else class="black--text text-h6 font-weight-medium text-capitalize">
          {{ user.firstName.slice(0,1) + user.lastName.slice(0,1) }}
        </span> -->
        <span v-else class="black--text text-h6 text-uppercase font-weight-medium ">{{ user.firstName.slice(0, 1) +
          user.lastName.slice(0, 1) }}</span>
      </v-avatar>
      <div class="ml-2">
        <p class="text-subtitle-1 mb-0 font-weight-medium ">
          {{ user.firstName + user.lastName }}
        </p>
        <p class="mb-0 text-subtitle-2 font-weight-regular grey--text">
          {{ user.email }}
        </p>
      </div>
    </div>
  </v-card>
</template>

<script>
import { generateRandomColor } from './../utils/randomColor'
export default {
  name: 'CardMember',
  props: {
    user: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      randomColor: ''
    }
  },
  created () {
    this.randomColor = generateRandomColor()
  }
}
</script>

<style lang="scss" scoped>

</style>
