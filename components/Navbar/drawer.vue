<template>
  <v-navigation-drawer
      v-model="drawer"
      fixed
      app
      permanent
    >
    <v-list>
      <v-list-item v-for="item in items" :key="item.title" :to="item.to">
        <v-list-item-icon>
          <v-icon>{{item.icon}}</v-icon>
        </v-list-item-icon>

        <v-list-item-title>{{item.title}}</v-list-item-title>
      </v-list-item>

      <v-list-group
        :value="true"
        :prepend-icon="project.icon"
      >
        <template v-slot:activator>
          <v-list-item-title>{{project.title}}</v-list-item-title>
        </template>
        <v-list-item
            v-for="projectItem in project.items"
            :key="projectItem.title"
            :to="`/project/${projectItem.id}`"
          >
            <v-list-item-title>{{projectItem.title}}</v-list-item-title>
          </v-list-item>
      </v-list-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: 'Drawer',
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
            icon: "mdi-chat-processing",
            title: "Inbox",
            to: "/inbox"
        }
      ],
      project: {
            icon: "mdi-view-grid-outline",
            title: "project",
            items: [
            { title: 'Project 1', id: 0},
            { title: 'Project 2', id: 1 },
            { title: 'Project 3', id: 2 },
            ]
        }
    }),
  computed: {
  }
}
</script>
