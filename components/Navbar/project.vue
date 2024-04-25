<template>
  <v-navigation-drawer
    v-model="drawer"
    temporary
    fixed
    right
    width="35%"
  >
    <v-card class="fill-height" flat>
      <v-layout justify-end align-center class="ma-4">
        <v-icon size="40">
          mdi-exit-to-app
        </v-icon>
      </v-layout>
      <v-card-title content-editable class="text-h3 mx-4">
        Task Title
      </v-card-title>
      <v-card-text height="80%">
        <v-layout v-for="(header, index) in headers" :key="index" align-center class="ma-4">
          <h3 class="mr-6 font-weight-bold">
            {{ header.label }}
          </h3>
          <v-autocomplete
            :placeholder="header.placeholder"
            hide-details
            solo
          />
        </v-layout>
        <div class="ma-4">
          <h3 class="font-weight-bold mb-4">
            Description
          </h3>
          <ck-editor />
        </div>
      </v-card-text>
      <v-card-actions class="ma-6">
        <v-layout column>
          <h3 class="font-weight-bold mb-4">
            Comments
          </h3>
          <ck-editor />
        </v-layout>
      </v-card-actions>
    </v-card>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: 'ProjectIndex',
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      title: 'Project 1',
      icon: '',
      sections: [
        {
          id: 0,
          title: 'Section title',
          tasks: [
            {
              title: 'Task title',
              complete: false,
              assign: []
            }
          ]
        }
      ],
      headers: [
        {
          label: 'Assignee',
          placeholder: 'No Assignee'
        },
        {
          label: 'Due to',
          placeholder: 'No Due Date'
        }, {
          label: 'Priority',
          placeholder: 'No Priority'
        }
      ]
    }
  },
  computed: {
    drawer: {
      get () {
        return this.value
      },
      set (value) {
        this.$emit('input', value)
      }
    }
  },
  methods: {
    addSection () {
      const newSection = JSON.parse(JSON.stringify(defaultSections))
      newSection.id = this.sections.length
      this.sections.push(newSection)
    },
    addTask (indexSection) {
      const newTask = JSON.parse(JSON.stringify(defaultTask))
      this.sections[indexSection].tasks.push(newTask)
    }
  }
}
</script>
<style scoped>
.ck-rounded-corners .ck.ck-editor__main>.ck-editor__editable, .ck.ck-editor__main>.ck-editor__editable.ck-rounded-corners {
    height: 200px;
}
</style>
