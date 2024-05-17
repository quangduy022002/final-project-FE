<template>
  <v-container>
    <v-layout fill-height column>
      <div class="text-h4">
        Analysis
      </div>
      <v-row>
        <v-col v-for="item in headerAnalysis" :key="item.title">
          <v-card class="pa-4 d-flex flex-column justify-center align-center">
            <div class="text-h6">
              {{ item.title }}
            </div>
            <div class="text-h4 primary--text">
              <v-layout align-center>
                <div class="mr-2">
                  {{ item.value }}
                </div>
                <div class="text-caption black--text">
                  {{ item.subLabel }}
                </div>
              </v-layout>
            </div>
          </v-card>
        </v-col>
      </v-row>
      <v-layout class="my-4">
        <v-card class="d-flex justify-center" style="width: 100%">
          <!-- <chart-pie :tasks="tasks" :type="type" /> -->
          <chart-bar :tasks="tasks" :priority="priority" />
        </v-card>
        <v-card style="width: 100%; height: 350px">
          <v-list max-height="350px" class="overflow-auto">
            <v-list-item
              v-for="(task) in taskSortByPriority(tasks)"
              :key="task.id"
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
          </v-list>
        </v-card>
      </v-layout>
    </v-layout>
  </v-container>
</template>

<script>
import { mapFields } from 'vuex-map-fields'
import moment from 'moment'
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
      return this.projects.flatMap(item => item.tasksJson)
    },
    headerAnalysis () {
      const dataTask = this.type.map((value) => {
        const tasksFilter = this.tasks.filter(task => task?.type?.id === value.id || (value.name === 'Pending' && !task.type))
        return {
          title: value.name,
          value: tasksFilter.length,
          subLabel: value.name
        }
      })
      return [{
        title: 'Total Project',
        value: this.projects.length,
        subLabel: 'Projects'
      }, {
        title: 'Total task',
        value: this.tasks.length,
        subLabel: 'Tasks'
      }, ...dataTask]
    }
  },
  async created () {
    const res = await this.$axios.get('/projects/getAll')
    this.projects = res.data
    await this.getPriority()
    await this.getType()
  },
  methods: {
    taskSortByPriority (tasks) {
      const clone = JSON.parse(JSON.stringify(tasks))
      clone.sort((a, b) => {
        if (a.priority === null && b.priority === null) {
          return 0
        }
        if (a.priority === null) {
          return 1
        }
        if (b.priority === null) {
          return -1
        }
        return a.priority.id - b.priority.id
      })
      return clone
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
