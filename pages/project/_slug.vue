<template>
  <v-layout column>
    <navbar-project v-model="drawer" />
    <v-app-bar elevation="1" color="white">
      <v-toolbar-title class="text-h3">
        {{ project.name }}
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
          <overview :project="project" />
        </v-tab-item>
        <v-tab-item>
          <div>
            123
          </div>
        </v-tab-item>
        <v-tab-item>
          <board />
        </v-tab-item>
      </v-tabs-items>
    </v-sheet>
  </v-layout>
</template>
<script>
export default {
  data () {
    return {
      project: {},
      tab: null,
      items: [
        { tab: 'Overview', content: 'Tab 1 Content', icon: 'mdi-text-box-edit-outline' },
        { tab: 'List', content: 'Tab 2 Content', icon: 'mdi-list-box-outline' },
        { tab: 'Board', content: 'Tab 3 Content', icon: 'mdi-bulletin-board' },
        { tab: 'Timeline', content: 'Tab 4 Content', icon: 'mdi-calendar-month-outline' }
      ]
    }
  },
  async created () {
    await this.getProjectDetail()
  },
  methods: {
    async getProjectDetail () {
      const { data } = await this.$axios.get(`projects/projectDetail/${this.$route.params.slug}`)
      this.project = data
    }
  }
}
</script>
