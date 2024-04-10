<template>
  <v-card v-if="!permission" flat>
    <div class="d-flex align-center">
      <v-avatar max-height="38" max-width="38" :color="randomColor">
        <img v-if="user.avatar" :src="user.avatar" alt="avatar">
        <span v-else class="black--text text-subtitle-1 text-uppercase font-weight-medium ">{{ user.firstName.slice(0, 1) +
          user.lastName.slice(0, 1) }}</span>
      </v-avatar>
      <div class="ml-2">
        <p class="text-subtitle-1 mb-0 font-weight-medium ">
          {{ user.firstName + user.lastName }}
        </p>
        <p class="mb-0 text-subtitle-2 font-weight-regular grey--text">
          {{ user.email.slice(0,14) }}...
        </p>
      </div>
    </div>
  </v-card>
  <v-menu v-else offset-y rounded="lg" nudge-bottom="6" transition="scale-transition">
    <template #activator="{ on, attrs }">
      <v-btn
        color="white"
        depressed
        dark
        v-bind="attrs"
        class="text-none px-2 py-8 rounded-lg"
        v-on="on"
      >
        <div class="d-flex align-center">
          <v-avatar max-height="38" max-width="38" :color="randomColor">
            <img v-if="user.avatar" :src="user.avatar" alt="avatar">
            <span v-else class="black--text text-subtitle-1 text-uppercase font-weight-medium ">{{ user.firstName.slice(0, 1) +
              user.lastName.slice(0, 1) }}</span>
          </v-avatar>
          <div class="ml-2">
            <p class="text-subtitle-1 mb-0 font-weight-medium black--text text-start">
              {{ user.firstName + user.lastName }}
            </p>
            <p class="mb-0 text-subtitle-2 font-weight-regular grey--text">
              {{ user.email.slice(0,14) }}...
            </p>
          </div>
        </div>
      </v-btn>
    </template>
    <v-list>
      <v-list-item-group v-model="selected">
        <v-list-item>
          <v-list-item-title class="red--text text-subtitle-2 font-weight-regular">
            Remove from project
          </v-list-item-title>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-menu>
</template>

<script>
import { mapState } from 'vuex'
import { generateRandomColor } from './../utils/randomColor'
export default {
  name: 'CardMember',
  props: {
    user: {
      type: Object,
      default: () => {}
    },
    permission: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      randomColor: '',
      selected: null
    }
  },
  computed: {
    ...mapState('project', ['projectDetail'])
  },
  watch: {
    async selected (value) {
      if (!value) {
        await this.removeMemberProject()
      }
    }
  },
  created () {
    this.randomColor = generateRandomColor()
  },
  methods: {
    async removeMemberProject () {
      try {
        const { data } = await this.$axios.post(`projects/removeMemberFromProject/${this.projectDetail.id}`, {
          userId: this.user.id
        })
        if (data) {
          this.$store.commit('project/setProjectDetail', data)
        }
      } catch (error) {
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.v-avatar {
  min-width: 40px !important;
}
.v-btn:before {
  background-color: gray !important;
}
</style>
