<!-- eslint-disable vue/no-mutating-props -->
<template>
  <v-navigation-drawer
    v-model="value"
    color="primary"
    fixed
    app
    permanent
  >
    <v-layout column fill-height>
      <v-list>
        <v-list-item v-for="item in items" :key="item.title" :to="item.to">
          <v-list-item-icon>
            <v-icon color="white">
              {{ item.icon }}
            </v-icon>
          </v-list-item-icon>

          <v-list-item-title class="white--text">
            {{ item.title }}
          </v-list-item-title>
        </v-list-item>

        <v-list-group
          color="white"
        >
          <template #prependIcon>
            <v-icon color="white">
              {{ project.icon }}
            </v-icon>
          </template>
          <template #activator>
            <v-list-item-title class="white--text">
              {{ project.title }}
            </v-list-item-title>
          </template>
          <v-list-item
            v-for="projectItem in project.items"
            :key="projectItem.id "
            class="white--text"
            :to="`/project/${projectItem.id}`"
          >
            <v-list-item-title>{{ projectItem.name }}</v-list-item-title>
          </v-list-item>
          <createProject />
        </v-list-group>
      </v-list>
      <v-spacer />
      <v-list>
        <v-list-item v-for="item in itemsBottom" :key="item.title" :to="item.to">
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-layout>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: 'DrawerIndex',
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    items: [
      {
        icon: 'mdi-home',
        title: 'Home',
        to: '/'
      },
      {
        icon: 'mdi-account-group',
        title: 'Team',
        to: '/team'
      },
      {
        icon: 'mdi-chat-processing',
        title: 'Inbox',
        to: '/inbox'
      }
    ],
    project: {
      icon: 'mdi-view-grid-outline',
      title: 'Project',
      items: [
        { title: 'Project 1', id: 0 },
        { title: 'Project 2', id: 1 },
        { title: 'Project 3', id: 2 }
      ]
    },
    itemsBottom: [{
      title: 'Setting',
      icon: 'mdi-cog',
      to: '/setting'
    },
    {
      title: 'Logout',
      icon: 'mdi-logout',
      to: '/logout'
    }
    ]
  }),
  async fetch () {
    const res = await this.$axios.get('/projects/getAll')
    this.project.items = res.data
  },
  computed: {
  },
  methods: {
    createProject () {

    }
  }
}
</script>
