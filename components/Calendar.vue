<!-- eslint-disable vue/no-template-shadow -->
<!-- <template>
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
    <draggable v-model="sections" group="section" class="d-flex pa-4 overflow-y-auto fill-height" handle=".section-swap">
      <v-card v-for="(section) in sections" :key="section.id" width="381" class="mr-4" outlined>
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
          <MenuCrud @click-edit="openDialogSection('edit', section)" />
        </v-layout>
        <draggable v-model="section.tasks" group="tasks" class="pa-2" @change="$event => changePosition($event, section)">
          <v-card
            v-for="(task) in section.tasks"
            :key="task.id"
            class="mb-2"
            outlined
            @click="selectTask(task)"
          >
            <v-card-title class="pa-2 text-h5">
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
              <div>
                {{ task.name }}
              </div>
            </v-card-title>
            <v-card-text>
              <div v-if="task.priority" class="mb-2">
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
            </v-card-text>
            <v-layout>
              <v-spacer />
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
            </v-layout>
          </v-card>
        </draggable>
        <v-layout justify-center align-center>
          <v-btn plain @click="openDialogTask(section, section.tasks)">
            + Add task
          </v-btn>
        </v-layout>
      </v-card>
    </draggable>
  </div>
</template> -->

<template>
  <v-row class="fill-height">
    <v-col>
      <v-sheet height="64">
        <v-toolbar
          flat
        >
          <v-btn
            outlined
            class="mr-4"
            color="grey darken-2"
            @click="setToday"
          >
            Today
          </v-btn>
          <v-btn
            fab
            text
            small
            color="grey darken-2"
            @click="prev"
          >
            <v-icon small>
              mdi-chevron-left
            </v-icon>
          </v-btn>
          <v-btn
            fab
            text
            small
            color="grey darken-2"
            @click="next"
          >
            <v-icon small>
              mdi-chevron-right
            </v-icon>
          </v-btn>
          <v-toolbar-title v-if="$refs.calendar">
            {{ $refs.calendar.title }}
          </v-toolbar-title>
          <v-spacer />
          <v-menu
            bottom
            right
          >
            <template #activator="{ on, attrs }">
              <v-btn
                outlined
                color="grey darken-2"
                v-bind="attrs"
                v-on="on"
              >
                <span>{{ typeToLabel[type] }}</span>
                <v-icon right>
                  mdi-menu-down
                </v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click="type = 'day'">
                <v-list-item-title>Day</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'week'">
                <v-list-item-title>Week</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'month'">
                <v-list-item-title>Month</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = '4day'">
                <v-list-item-title>4 days</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-toolbar>
      </v-sheet>
      <v-sheet height="600">
        <v-calendar
          ref="calendar"
          v-model="focus"
          color="primary"
          :events="events"
          :event-color="getEventColor"
          :type="type"
          @click:event="showEvent"
          @click:more="viewDay"
          @click:date="viewDay"
        />
        <navbar-project ref="navTask" v-model="selectedOpen" />
      </v-sheet>
    </v-col>
  </v-row>
</template>

<script>
import moment from 'moment'
import { mapFields } from 'vuex-map-fields'
export default {
  data: () => ({
    focus: '',
    type: 'month',
    typeToLabel: {
      month: 'Month',
      week: 'Week',
      day: 'Day',
      '4day': '4 Days'
    },
    selectedEvent: {},
    selectedElement: null,
    selectedOpen: false,
    // events: [],
    colors: ['blue', 'indigo', 'deep-purple', 'cyan', 'green', 'orange', 'grey darken-1'],
    names: ['Meeting', 'Holiday', 'PTO', 'Travel', 'Event', 'Birthday', 'Conference', 'Party']
  }),
  computed: {
    ...mapFields('project', ['projectDetail']),
    events () {
      const events = this.projectDetail?.tasksJson?.map((task) => {
        return {
          id: task.id,
          name: task.name,
          start: moment(task.timeCreated).format('YYYY-MM-DD'),
          end: task.deadline,
          color: 'primary',
          timed: false
        }
      })
      return events || []
    }
  },
  mounted () {
    this.$refs.calendar.checkChange()
  },
  methods: {
    viewDay ({ date }) {
      this.focus = date
      this.type = 'day'
    },
    getEventColor (event) {
      return event.color
    },
    setToday () {
      this.focus = ''
    },
    prev () {
      this.$refs.calendar.prev()
    },
    next () {
      this.$refs.calendar.next()
    },
    showEvent ({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = event
        this.selectedElement = nativeEvent.target
        const task = this.projectDetail?.tasksJson.find((task) => {
          return task.id === this.selectedEvent.id
        })
        this.$refs.navTask.task = task
        requestAnimationFrame(() => requestAnimationFrame(() => this.selectedOpen = true))
      }

      if (this.selectedOpen) {
        this.selectedOpen = false
        requestAnimationFrame(() => requestAnimationFrame(() => open()))
      } else {
        open()
      }

      nativeEvent.stopPropagation()
    },
    // updateRange ({ start, end }) {
    //   const events = []

    //   const min = new Date(`${start.date}T00:00:00`)
    //   const max = new Date(`${end.date}T23:59:59`)
    //   const days = (max.getTime() - min.getTime()) / 86400000
    //   const eventCount = this.rnd(days, days + 20)

    //   for (let i = 0; i < eventCount; i++) {
    //     const allDay = this.rnd(0, 3) === 0
    //     const firstTimestamp = this.rnd(min.getTime(), max.getTime())
    //     const first = new Date(firstTimestamp - (firstTimestamp % 900000))
    //     const secondTimestamp = this.rnd(2, allDay ? 288 : 8) * 900000
    //     const second = new Date(first.getTime() + secondTimestamp)

    //     events.push({
    //       name: this.names[this.rnd(0, this.names.length - 1)],
    //       start: first,
    //       end: second,
    //       color: this.colors[this.rnd(0, this.colors.length - 1)],
    //       timed: false
    //     })
    //   }

    //   this.events = events
    // },
    rnd (a, b) {
      return Math.floor((b - a + 1) * Math.random()) + a
    }
  }
}
</script>
  <style lang="scss" scoped>

  </style>
