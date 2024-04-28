<!-- eslint-disable vue/no-mutating-props -->
<template>
  <v-navigation-drawer
    :mini-variant.sync="mini"
    fixed
    height="100%"
    app
    permanent
    hide-overlay
    :temporary="!mini"
    :width="$vuetify.breakpoint.smAndDown ? '100%' : ''"
  >
    <v-layout column fill-height>
      <div class="text-h2 ml-4 mt-4 white--text d-flex" @click.stop="mini = !mini">
        <v-icon class="mr-4">
          mdi-text
        </v-icon>
      </div>
      <v-list>
        <v-list-item v-for="item in items" :key="item.title" :to="item.to">
          <v-list-item-icon>
            <v-icon>
              {{ item.icon }}
            </v-icon>
          </v-list-item-icon>

          <v-list-item-title>
            {{ item.title }}
          </v-list-item-title>
        </v-list-item>

        <v-list-group :value="!mini">
          <template #prependIcon>
            <v-icon>
              {{ project.icon }}
            </v-icon>
          </template>
          <template #activator>
            <v-list-item-title>
              {{ project.title }}
            </v-list-item-title>
          </template>
          <v-list-item
            v-for="projectItem in project.items"
            :key="projectItem.id "
            :to="`/project/${projectItem.id}`"
          >
            <v-list-item-title>{{ projectItem.name }}</v-list-item-title>
          </v-list-item>
          <createProject @createProject="createProject" />
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
      items: []
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
    mini: {
      get () {
        return this.value
      },
      set (val) {
        this.$emit('input', val)
      }
    }
  },
  methods: {
    createProject (data) {
      this.project.items.push(data)
    }
  }
}
</script>
