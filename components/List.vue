<!-- eslint-disable vue/no-template-shadow -->
<template>
  <div>
    <navbar-project ref="navTask" v-model="drawer" />
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
    <dialog-common ref="dialogTask" @click="closeDialogTask">
      <template #header>
        <h2>Add Task</h2>
      </template>
      <template #content>
        <v-form ref="taskForm" v-model="valid" class="mt-2" @submit.prevent="handleSubmitTask()">
          <v-text-field v-model="taskForm.name" :rules="[$rules.required]" outlined label="Title" />
          <select-email label="Invite with email" :user-list="userList" :return-object="true" @emailList="getEmailList" />
        </v-form>
      </template>
      <template #footer>
        <v-layout justify-end>
          <v-btn type="submit" :disabled="!valid" @click="handleSubmitTask()">
            Save
          </v-btn>
        </v-layout>
      </template>
    </dialog-common>
    <v-layout class="my-2 ml-4">
      <v-btn plain @click="openDialogSection('add')">
        + Add Section
      </v-btn>
    </v-layout>
    <v-layout>
      <v-expansion-panels accordion multiple class="w-100">
        <draggable v-model="sections" group="section" handle=".section-swap" style="width: 100%;">
          <v-expansion-panel
            v-for="(section) in sections"
            :key="section.id"
            class="w-100"
          >
            <v-expansion-panel-header>
              <v-layout align-center class="mx-2">
                <v-icon class="mr-2 section-swap">
                  mdi-reorder-horizontal
                </v-icon>
                <h2>
                  {{ section.title }}
                </h2>
                <v-spacer />
                <v-icon @click="openDialogTask(section, section.tasks)">
                  mdi-plus
                </v-icon>
                <MenuCrud @click-edit="openDialogSection('edit', section)" @click-delete="deleteSection(section)"/>
              </v-layout>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-list>
                <draggable v-model="section.tasks" group="tasks" class="pa-2" @change="$event => changePosition($event, section)">
                  <v-list-item
                    v-for="(task) in section.tasks"
                    :key="task.id"
                    @click="selectTask(task)"
                  >
                    <v-btn v-if="!task.type || task.type.name === 'Pending'" icon @click.stop="clickTaskType(task)">
                      <v-icon>
                        mdi-check-circle-outline
                      </v-icon>
                    </v-btn>
                    <v-btn v-else icon color="success" @click.stop="clickTaskType(task)">
                      <v-icon>
                        mdi-check-circle
                      </v-icon>
                    </v-btn>
                    <div class="mr-2">
                      {{ task.name }}
                    </div>
                    <div class="d-flex align-center">
                      <div v-if="task.priority" class="mr-2">
                        <v-chip
                          small
                          :color="getColorChip(task?.priority)"
                        >
                          {{ task?.priority?.name }}
                        </v-chip>
                      </div>
                      <div v-if="task.deadline.length">
                        <v-chip :color="getDateDeadlineColor(task.deadline)" small :outlined="getDateDeadlineColor(task.deadline) === 'error'">
                          {{ getDateDeadline(task.deadline) }}
                        </v-chip>
                      </div>
                    </div>
                    <v-spacer />
                    <div>
                      <v-btn v-if="!task.teamUsers.length" icon class="mr-2">
                        <v-icon>mdi-account-multiple-plus-outline</v-icon>
                      </v-btn>
                      <v-layout v-else align-center justify-end class="mr-2">
                        <v-avatar v-for="(user, index) in task.teamUsers" :key="user.id" size="34" :color="user.color" :class="{'mr-n3': index < (task.teamUsers.length - 1)}">
                          <img v-if="user.avatar" :src="user.avatar" alt="avatar">
                          <span v-else class="black--text text-subtitle-1 text-uppercase font-weight-medium ">{{ user.firstName.slice(0, 1) +
                            user.lastName.slice(0, 1) }}</span>
                        </v-avatar>
                      </v-layout>
                    </div>
                  </v-list-item>
                </draggable>
              </v-list>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </draggable>
      </v-expansion-panels>
    </v-layout>
  </div>
</template>

<script>
import moment from 'moment'
import draggable from 'vuedraggable'
import { mapFields } from 'vuex-map-fields'
import { mapState } from 'vuex'
import { Alert } from '~/store/alerts'

const defaultTask =
  {
    name: 'Task title',
    description: '',
    statusId: 0,
    typeId: 0,
    priorityId: 0,
    originalTime: 0,
    estimateTime: 0,
    teamUsers: [],
    deadline: '',
    projectId: ''
  }
export default {
  name: 'BoardIndex',
  components: {
    draggable
  },
  data () {
    return {
      drawer: false,
      valid: false,
      loading: false,
      icon: '',
      sectionForm: {
        id: undefined,
        title: undefined
      },
      taskForm: {
        name: undefined,
        description: '',
        statusId: 0, // id section
        typeId: 0,
        priorityId: 0,
        originalTime: 0,
        estimateTime: 0,
        teamUsers: [],
        deadline: '',
        projectId: '',
        position: 0
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
    ...mapFields('project', ['projectDetail', 'type']),
    ...mapState('user', ['userList']),
    sections: {
      get () {
        return this.projectDetail?.sectionsJson?.length ? JSON.parse(JSON.stringify(this.projectDetail.sectionsJson)) : []
      },
      async set (val) {
        this.$store.commit('project/setSections', val)
        await this.updateProject()
      }
    },
    tasks: {
      get () {
        return this.projectDetail?.tasksJson?.length ? JSON.parse(JSON.stringify(this.projectDetail.tasksJson)) : []
      },
      set (val) {
        this.$store.commit('project/setTasks', val)
      }
    }
  },
  methods: {
    async deleteSection (section) {
      const index = this.sections.findIndex(sectionData => sectionData.id === section.id)
      this.sections.splice(index, 1)
      this.$store.commit('project/setSections', this.sections)
      await this.$axios.delete(`/sections/remove/${section.id}`)
      this.$store.commit('alerts/add', new Alert(this, {
        type: 'success',
        icon: 'check',
        message: 'Update success'
      }))
    },
    getColorChip (priority) {
      if (priority?.name === 'High') {
        return 'error'
      } else if (priority?.name === 'Medium') {
        return 'warning'
      } else {
        return 'success'
      }
    },
    getDateDeadline (date) {
      return moment(date).fromNow()
    },
    getDateDeadlineColor (date) {
      const currentDate = moment()
      const inputDate = moment(date)
      if (inputDate.isSameOrAfter(currentDate)) {
        return ''
      } else {
        return 'error'
      }
    },
    async clickTaskType (task) {
      let type
      if (!task.type || task.type.name === 'Pending') {
        type = this.type.find(value => value.name === 'Done')
      } else {
        type = this.type.find(value => value.name === 'Pending')
      }
      task.type = type
      const formTask = this.getFormEditTask(task)
      formTask.typeId = type.id
      await this.$axios.patch(`/tasks/update/${task.id}`, formTask)
      this.$forceUpdate()
    },
    async changePosition (action, section) {
      if (action?.added) {
        const formTask = this.getFormEditTask(action?.added.element)
        formTask.statusId = section.id
        await this.$axios.patch(`/tasks/update/${action?.added.element.id}`, formTask)
      }
      const sections = JSON.parse(JSON.stringify(this.sections))
      const index = sections.findIndex(sectionOld => sectionOld.id === section.id)
      sections.splice(index, 1, section)
      this.sections = sections
      const formSection = JSON.parse(JSON.stringify(section))
      delete formSection.id
      formSection.tasks = formSection.tasks.map(task => task.id)
      await this.$axios.patch(`/sections/update/${section.id}`, formSection)
      this.$store.commit('alerts/add', new Alert(this, {
        type: 'success',
        icon: 'check',
        message: 'Update success'
      }))
    },
    selectTask (task) {
      this.$refs.navTask.task = task
      this.drawer = true
    },
    getFormEditTask (task) {
      const form = JSON.parse(JSON.stringify(task))
      delete form.id
      delete form.comments
      delete form.createdBy
      delete form.project
      if (form.priority) {
        form.priorityId = form.priority.id
      }
      if (form.type) {
        form.typeId = form.type.id
      }
      form.teamUsers = form.teamUsers.map(user => user.id)
      form.estimateTime = form.time.estimateTime
      form.originalTime = form.time.originalTime
      form.statusId = form.status.id
      return form
    },
    findTasksBySection (id) {
      const tasks = this.tasks.filter(task => task.status.id === id)
      const comparePosition = (a, b) => {
        return a.position - b.position
      }
      tasks.sort(comparePosition)
      return tasks
    },
    closeDialogTask () {
      this.$refs.dialogTask.dialog = false
      this.$refs.taskForm.reset()
    },
    closeDialogSection () {
      this.$refs.dialogSection.dialog = false
      this.$refs.sectionForm.reset()
    },
    getEmailList (payload) {
      this.taskForm.teamUsers = payload.map(user => user.id)
    },
    openDialogTask (section, tasks) {
      this.taskForm.statusId = section.id
      this.taskForm.position = tasks.length ? tasks[tasks.length - 1].position + 1 : 0
      this.$refs.dialogTask.dialog = true
    },
    openDialogSection (mode, section) {
      this.modeSection = mode
      if (this.modeSection === 'edit') {
        this.sectionForm = JSON.parse(JSON.stringify(section))
      }
      this.$refs.dialogSection.dialog = true
    },
    async handleSubmitTask () {
      try {
        const form = { ...this.taskForm }
        form.projectId = this.projectDetail.id
        const res = await this.$axios.post('/tasks/create', form)
        this.$store.commit('project/setTasks', res.data)
        const section = this.sections.find(section => section.id === res.data.status.id)
        const formSection = JSON.parse(JSON.stringify(section))
        delete formSection.id
        formSection.tasks = formSection.tasks.map(task => task.id)
        await this.$axios.patch(`/sections/update/${section.id}`, formSection)
        this.$store.commit('alerts/add', new Alert(this, {
          type: 'success',
          icon: 'check',
          message: 'Success'
        }))
      } catch (err) {
        console.error(err)
        this.$store.commit('alerts/add', new Alert(this, {
          type: 'error',
          message: 'Duplicate Task'
        }))
      } finally {
        this.closeDialogTask()
      }
    },
    async editSection (id) {
      await this.$axios.patch(`/sections/update/${id}`, { title: this.sectionForm.title })
    },
    async handleSubmitSection () {
      try {
        if (this.modeSection === 'add') {
          const res = await this.$axios.post('/sections/create', { title: this.sectionForm.title })
          this.sections.push(res.data)
          this.$store.commit('project/setSections', this.sections)
          await this.updateProject('Create Section Success')
        } else {
          this.sectionForm.tasks = this.sectionForm.tasks.map((task) => { return task.id })
          const res = await this.$axios.patch(`/sections/update/${this.sectionForm.id}`, this.sectionForm)
          const index = this.sections.findIndex(section => section.id === res.data.id)
          this.sections.splice(index, 1, res.data)
          this.$store.commit('project/setSections', this.sections)
          // await this.updateProject('Edit Section Success')
        }
      } catch (err) {
        this.$store.commit('alerts/add', new Alert(this, {
          type: 'error',
          message: err?.response?.data?.message
        }))
      } finally {
        this.closeDialogSection()
      }
    },
    async updateProject (message) {
      try {
        const project = JSON.parse(JSON.stringify(this.projectDetail))
        delete project.createdBy
        delete project.id
        delete project.tasks
        project.sectionsJson = project.sectionsJson.map(section => section.id)
        project.teamUsers = project.teamUsers.map(user => user.id)
        await this.$axios.patch(`/projects/update/${this.projectDetail.id}`, { ...project, sections: project.sectionsJson })
        this.$store.commit('alerts/add', new Alert(this, {
          type: 'success',
          icon: 'check',
          message: message ?? 'Update project success'
        }))
      } catch (err) {
        this.$store.commit('alerts/add', new Alert(this, {
          type: 'error',
          message: err?.response?.data?.message
        }))
      }
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
