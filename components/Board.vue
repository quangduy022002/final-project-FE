<!-- eslint-disable vue/no-template-shadow -->
<template>
  <div>
    <dialog-common ref="dialogSection" @click="closeDialogSection">
      <template #header>
        <h2>{{ modeSection ==="add" ? 'Add section' : 'Edit Section' }}</h2>
      </template>
      <template #content>
        <v-form ref="sectionForm" v-model="valid" class="mt-2" @submit.prevent="handleSubmitSection()">
          <v-text-field v-model="sectionForm.title" :rules="[$rules.required]" outlined label="Title" />
        </v-form>
      </template>
      <template #footer>
        <v-layout justify-end>
          <v-btn type="submit" :disabled="!valid" @click="handleSubmitSection()">
            Save
          </v-btn>
        </v-layout>
      </template>
    </dialog-common>
    <v-layout class="my-2 ml-4">
      <v-btn>
        <v-icon class="mr-1">
          mdi-filter-variant
        </v-icon>
        Filter
      </v-btn>
      <v-btn plain @click="openDialogSection('add')">
        + Add Section
      </v-btn>
    </v-layout>
    <v-layout fill-height class="pa-4 overflow-y-auto">
      <v-card v-for="(section, index) in sections" :key="section.id" min-width="381" flat class="mr-4">
        <v-layout align-center>
          <h2>
            {{ section.title }}
          </h2>
          <v-spacer />
          <v-icon>
            mdi-plus
          </v-icon>
          <MenuCrud @click-edit="openDialogSection('edit', section)" />
        </v-layout>
        <draggable group="task" :list="section.tasks">
          <v-card
            v-for="(task, index) in section.tasks"
            :key="index"
            class="mb-2"
            color="secondary"
            @click="drawer = true"
          >
            <v-card-title class="pa-2 text-h5">
              <v-btn icon>
                <v-icon>
                  mdi-check-circle-outline
                </v-icon>
              </v-btn>
              <div>
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
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import { mapFields } from 'vuex-map-fields'

import { Alert } from '~/store/alerts'

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
  name: 'BoardIndex',
  components: {
    draggable
  },
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      valid: false,
      loading: false,
      icon: '',
      sectionForm: {
        id: undefined,
        title: undefined
      },
      modeSection: '',
      items: [{
        title: 'Edit',
        icon: 'mdi-account'
      },
      {
        title: 'Delete',
        icon: 'mdi-logout'
      }]
    }
  },
  computed: {
    ...mapFields('project', ['projectDetail']),
    drawer: {
      get () {
        return this.value
      },
      set (val) {
        this.$emit('input', val)
      }
    },
    sections: {
      get () {
        return this.projectDetail?.sections?.length ? JSON.parse(JSON.stringify(this.projectDetail.sections)) : []
      },
      set (val) {
        this.$store.commit('project/setSections', val)
      }
    }
  },
  methods: {
    closeDialogSection () {
      this.$refs.dialogSection.dialog = false
      this.$refs.sectionForm.reset()
    },
    openDialogSection (mode, section) {
      this.modeSection = mode
      if (this.modeSection === 'edit') {
        this.sectionForm = JSON.parse(JSON.stringify(section))
      }
      this.$refs.dialogSection.dialog = true
    },
    async handleSubmitSection () {
      try {
        if (this.modeSection === 'add') {
          const res = await this.$axios.post('/sections/create', { title: this.sectionForm.title })
          this.sections.push(res.data)
          this.$store.commit('project/setSections', this.sections)
          await this.updateProject()
        } else {
          const res = await this.$axios.patch(`/sections/update/${this.sectionForm.id}`, { title: this.sectionForm.title })
          const index = this.sections.findIndex(section => section.id === res.data.id)
          this.sections.splice(index, 1, res.data)
          this.$store.commit('project/setSections', this.sections)
          await this.updateProject()
        }
        this.$store.commit('alerts/add', new Alert(this, {
          type: 'success',
          icon: 'check',
          message: 'Create Section Success'
        }))
      } catch (err) {
        this.$store.commit('alerts/add', new Alert(this, {
          type: 'error',
          message: err?.response?.data?.message
        }))
      } finally {
        this.$refs.dialogSection.dialog = false
      }
    },
    async updateProject () {
      const project = JSON.parse(JSON.stringify(this.projectDetail))
      delete project.createdBy
      delete project.id
      delete project.tasks
      project.sections = project.sections.map(section => section.id)
      project.teamUsers = project.teamUsers.map(user => user.id)
      await this.$axios.patch(`/projects/update/${this.projectDetail.id}`, { ...project })
    },
    addTask (indexSection) {
      const newTask = JSON.parse(JSON.stringify(defaultTask))
      this.sections[indexSection].tasks.push(newTask)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
