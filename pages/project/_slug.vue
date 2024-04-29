<template>
  <v-layout column>
    <v-app-bar elevation="1" color="white">
      <v-toolbar-title class="text-h3">
        {{ projectDetail.name }}
        <v-icon size="40" class="mb-2">
          mdi-star-outline
        </v-icon>
      </v-toolbar-title>
    </v-app-bar>
    <v-sheet class="pa-4">
      <v-tabs v-model="tab" background-color="transparent" slider-color="black" dark>
        <v-tab v-for="item in items" :key="item.tab">
          <v-icon small color="black">
            {{ item.icon }}
          </v-icon>
          <p class="mb-0 black--text text-none text-subtitle-1 ml-2">
            {{ item.tab }}
          </p>
        </v-tab>
      </v-tabs>

      <v-tabs-items v-model="tab">
        <v-tab-item>
          <overview :project="projectDetail" :permission="permission" />
        </v-tab-item>
        <v-tab-item>
          <div>
            123
          </div>
        </v-tab-item>
        <v-tab-item>
          <board v-model="drawer" />
        </v-tab-item>
      </v-tabs-items>
    </v-sheet>
  </v-layout>
</template>
<script>
import { mapState } from 'vuex'
export default {
  data () {
    return {
      drawer: false,
      items: [
        { tab: 'Overview', content: 'Tab 1 Content', icon: 'mdi-text-box-edit-outline' },
        { tab: 'List', content: 'Tab 2 Content', icon: 'mdi-list-box-outline' },
        { tab: 'Board', content: 'Tab 3 Content', icon: 'mdi-bulletin-board' },
        { tab: 'Timeline', content: 'Tab 4 Content', icon: 'mdi-calendar-month-outline' }
      ],
      permission: false
    }
  },
  computed: {
    ...mapState('project', ['projectDetail']),
    tab: {
      get () {
        return Number(this.$route.query?.tab) || 0
      },
      set (val) {
        this.$router.replace({ query: { tab: val } })
      }
    }
  },
  async created () {
    await this.getProjectDetail()
    await this.getUserList()
    await this.getPriority()
    await this.getType()
    this.checkPermission()
  },
  methods: {
    async getUserList () {
      try {
        const { data } = await this.$axios.get('users/getAll')

        this.$store.commit('user/setUserList', data)
      } catch (error) {
      }
    },
    checkPermission () {
      if (this.$auth.$state.user.id === this.projectDetail.createdBy.id) {
        this.permission = true
      } else {
        this.permission = false
      }
    },
    async getProjectDetail () {
      const { data } = await this.$axios.get(`projects/projectDetail/${this.$route.params.slug}`)
      // this.project = data
      this.$store.commit('project/setProjectDetail', data)
    },
    async getPriority () {
      const res = await this.$axios.get('/priorities/getAll')
      this.$store.commit('project/setPriority', res.data)
    },
    async getType () {
      const res = await this.$axios.get('/types/getAll')
      this.$store.commit('project/setType', res.data)
    }
  }
}
</script>
