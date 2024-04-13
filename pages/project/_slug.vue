<template>
  <v-layout fill-height column>
    <navbar-project v-model="drawer" />
    <v-app-bar
      elevation="1"
      color="white"
    >
      <v-toolbar-title class="text-h3">
        {{ title }}
        <v-icon size="40" class="mb-2">
          mdi-star-outline
        </v-icon>
      </v-toolbar-title>
    </v-app-bar>
    <v-layout fill-height column>
      <v-layout class="my-2">
        <v-btn>
          <v-icon class="mr-1">
            mdi-filter-variant
          </v-icon>
          Filter
        </v-btn>
        <v-btn plain @click="addSection">
          + Add Section
        </v-btn>
      </v-layout>
      <v-layout fill-height class="pa-4 overflow-y-auto">
        <v-card v-for="(section, index) in sections" :key="section.id" min-width="381" flat class="mr-4">
          <v-layout align-center>
            <h2 contentEditable>
              {{ section.title }}
            </h2>
            <v-spacer />
            <v-icon>
              mdi-plus
            </v-icon>
            <v-icon>
              mdi-dots-horizontal
            </v-icon>
          </v-layout>
          <draggable group="task" :list="section.tasks">
            <v-card v-for="(task, index) in section.tasks" :key="index" class="mb-2" color="secondary" @click="drawer = true">
              <v-card-title class="pa-2 text-h5">
                <v-btn icon>
                  <v-icon>
                    mdi-check-circle-outline
                  </v-icon>
                </v-btn>
                <div contentEditable>
                  {{ task.title }}
                </div>
              </v-card-title>
              <v-layout justify-end>
                <v-btn icon class="mr-2">
                  <v-icon>mdi-account-multiple-plus-outline</v-icon>
                </v-btn>
              </v-layout>
            </v-card>
          </draggable>
          <v-layout justify-center align-center>
            <v-btn plain @click="addTask(index)">
              + Add task
            </v-btn>
          </v-layout>
        </v-card>
      </v-layout>
    </v-layout>
  </v-layout>
</template>
<script>
import draggable from 'vuedraggable'
const defaultSections = {
  title: 'Section title',
  tasks: [
    {
      title: 'Task title',
      complete: false,
      assign: []
    }
  ]
}
const defaultTask =
{
  title: 'Task title',
  complete: false,
  assign: []
}
export default {
  components: {
    draggable
  },
  data () {
    return {
      drawer: false,
      title: 'Project 1',
      icon: '',
      sections: []
    }
  },
  methods: {
    addSection () {
      this.$axios.post('/sections/create', defaultSections.title)
      const newSection = JSON.parse(JSON.stringify(defaultSections))
      newSection.id = this.sections.length
      this.sections.push(newSection)
    },
    addTask (indexSection) {
      const newTask = JSON.parse(JSON.stringify(defaultTask))
      this.sections[indexSection].tasks.push(newTask)
    },
    updateSection ({ id, title }) {
      this.$axios.patch(`/sections/update/${id}`, {
        title
      })
    }
  }
}
</script>
