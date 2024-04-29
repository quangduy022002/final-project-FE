<template>
  <v-container>
    <v-layout fill-height column>
      <div class="text-h4">
        Analysis
      </div>
      <v-layout justify-space-around>
        <v-card class="pa-2 w-100">
          <chart-pie :tasks="tasks" :type="type" />
        </v-card>
        <v-card class="pa-2 w-100">
          <chart-bar :tasks="tasks" :priority="priority" />
        </v-card>
      </v-layout>
    </v-layout>
  </v-container>
</template>

<script>
import { mapFields } from 'vuex-map-fields'

export default {
  name: 'IndexPage',
  data () {
    return {
      drawer: false,
      permission: false,
      projects: []
    }
  },
  computed: {
    ...mapFields('project', ['projectDetail', 'type', 'priority']),
    tasks () {
      return this.projects.flatMap(item => item.tasks)
    }
  },
  async created () {
    const res = await this.$axios.get('/projects/getAll')
    this.projects = res.data
    await this.getPriority()
    await this.getType()
  },
  methods: {
    async getUserList () {
      try {
        const { data } = await this.$axios.get('users/getAll')

        this.$store.commit('user/setUserList', data)
      } catch (error) {
      }
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
