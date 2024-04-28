<template>
  <v-navigation-drawer
    v-model="drawer"
    temporary
    fixed
    right
    width="35%"
  >
    <dialog-common ref="dialogAddMember" @click="$refs.dialogAddMember.dialog = false">
      <template #header>
        <h2>
          Add assignee
        </h2>
      </template>
      <template #content>
        <div class="mt-2">
          <v-form ref="">
            <select-email label="Email" :user-list="userList" :selected="task.teamUsers" :return-object="true" @emailList="getEmailList" />
          </v-form>
        </div>
      </template>
      <template #footer>
        <v-card flat>
          <div class="d-flex align-center justify-end" style="gap: 10px">
            <v-btn outlined class="text-none rounded-lg" @click="$refs.dialogAddMember.dialog = false">
              Cancel
            </v-btn>
            <v-btn
              type="button"
              background-color="primary"
              color="primary"
              class="text-none rounded-lg"
              depressed
              @click="setEmailList()"
            >
              Save
            </v-btn>
          </div>
        </v-card>
      </template>
    </dialog-common>
    <v-layout column fill-height>
      <div class="text-h3 ma-4 ">
        {{ task?.name }}
      </div>
      <div class="d-flex mx-4 align-center">
        <h3 class="mr-6 font-weight-bold">
          Assignee
        </h3>
        <v-card v-if="task?.teamUsers?.length === 0" flat>
          <v-btn
            class="d-flex align-center pl-2 py-8 pr-6 justify-start"
            color="transparent"
            elevation
            @click="$refs.dialogAddMember.dialog = true"
          >
            <v-card class="pa-2" style="border: 1px dashed grey; border-radius: 50%">
              <v-icon size="12" color="grey">
                mdi-plus
              </v-icon>
            </v-card>
            <p class="mb-0 ml-2 text-subtitle-1 grey--text font-weight-medium text-none">
              Add member
            </p>
          </v-btn>
        </v-card>
        <div v-else>
          <v-layout align-center @click="$refs.dialogAddMember.dialog = true">
            <v-avatar v-for="(user, index) in task.teamUsers" :key="user.id" size="34" :color="user.color" :class="{'mr-n3': index < (task.teamUsers.length - 1)}">
              <img v-if="user.avatar" :src="user.avatar" alt="avatar">
              <span v-else class="black--text text-subtitle-1 text-uppercase font-weight-medium ">{{ user.firstName.slice(0, 1) +
                user.lastName.slice(0, 1) }}</span>
            </v-avatar>
            <div v-if="task.teamUsers.length > 1" class="ml-2">
              {{ `${task.teamUsers.length} members` }}
            </div>
            <div v-else class="ml-2">
              {{ task.teamUsers[0].firstName +
                task.teamUsers[0].lastName }}
            </div>
          </v-layout>
        </div>
      </div>
      <div class="d-flex align-center mx-4">
        <h3 class="font-weight-bold mr-4">
          Due to
        </h3>
        <v-menu
          ref="menu"
          v-model="menu"
          :close-on-content-click="false"
          :return-value.sync="task.deadline"
          max-width="290"
        >
          <template #activator="{ on, attrs }">
            <!-- <v-text-field
              :value="computedDateFormattedMomentjs"
              clearable
              label="Formatted with Moment.js"
              readonly
              v-bind="attrs"
              v-on="on"
              @click:clear="date = null"
            /> -->
            <v-card v-if="!task.deadline.length" flat>
              <v-btn
                class="d-flex align-center pl-2 py-8 pr-6 justify-start"
                color="transparent"
                elevation
                v-bind="attrs"
                v-on="on"
              >
                <v-card class="pa-2" style="border: 1px dashed grey; border-radius: 50%">
                  <v-icon size="14" color="grey">
                    mdi-plus
                  </v-icon>
                </v-card>
                <p class="mb-0 ml-2 text-subtitle-1 grey--text font-weight-medium text-none">
                  Add deadline
                </p>
              </v-btn>
            </v-card>
            <v-card v-else flat>
              <v-btn
                class="d-flex align-center pl-2 py-8 pr-6 justify-start"
                color="transparent"
                elevation
                v-bind="attrs"
                v-on="on"
              >
                <v-icon size="24" color="grey">
                  mdi-calendar
                </v-icon>

                <p class="mb-0 ml-2 text-subtitle-1 grey--text font-weight-medium text-none">
                  {{ task.deadline }}
                </p>
              </v-btn>
            </v-card>
          </template>
          <v-date-picker
            v-model="task.deadline"
          />
          <v-spacer />
          <v-btn
            text
            color="primary"
            @click="menu = false"
          >
            Cancel
          </v-btn>
          <v-btn
            text
            color="primary"
            @click="$refs.menu.save(task.deadline)"
          >
            OK
          </v-btn>
        </v-menu>
      </div>
      <div class="d-flex mx-4 align-center">
        <h3 class="mr-6 font-weight-bold">
          Priority
        </h3>
        <v-menu offset-y>
          <template #activator="{ on, attrs }">
            <v-card v-if="!task.priority" flat>
              <v-btn
                class="d-flex align-center pl-2 py-8 pr-6 justify-start"
                color="transparent"
                elevation
                v-bind="attrs"
                v-on="on"
              >
                <v-card class="pa-2" style="border: 1px dashed grey; border-radius: 50%">
                  <v-icon size="14" color="grey">
                    mdi-plus
                  </v-icon>
                </v-card>
                <p class="mb-0 ml-2 text-subtitle-1 grey--text font-weight-medium text-none">
                  Add priority
                </p>
              </v-btn>
            </v-card>
            <v-card v-else flat>
              <!-- <v-btn
                class="d-flex align-center pl-2 py-8 pr-6 justify-start"
                color="transparent"
                elevation
                v-bind="attrs"
                v-on="on"
              >
                <v-icon size="24" color="grey">
                  mdi-calendar
                </v-icon>

                <p class="mb-0 ml-2 text-subtitle-1 grey--text font-weight-medium text-none">
                  {{ task.deadline }}
                </p>
              </v-btn> -->
              <v-chip
                :color="getColorChip(task.priority)"
                v-bind="attrs"
                v-on="on"
              >
                {{ task.priority.name }}
              </v-chip>
            </v-card>
          </template>
          <v-list>
            <v-list-item
              v-for="(item) in priority"
              :key="item.id"
              @click="setPriority(item)"
            >
              <v-chip
                :color="getColorChip(item)"
              >
                {{ item.name }}
              </v-chip>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
      <div class="ma-4">
        <h3 class="font-weight-bold mb-4">
          Description
        </h3>
        <ck-editor v-model="task.description" />
      </div>
      <v-spacer />
      <div class="pa-4 justify-content-end">
        <div class="font-weight-bold text-h6">
          Comments
        </div>
        <v-divider />
        <v-layout class="mt-4" style="gap: 10px;">
          <v-avatar min-height="38" max-height="38" max-width="38" min-width="38" :color="$auth.user.color">
            <img v-if="$auth.user.avatar" :src="user.avatar" alt="avatar">
            <span v-else class="black--text text-subtitle-2 text-uppercase font-weight-medium ">{{ $auth.user.firstName.slice(0, 1) +
              $auth.user.lastName.slice(0, 1) }}</span>
          </v-avatar>
          <v-text-field hide-details outlined dense rounded class="mr-4" />
          <v-icon>mdi-send</v-icon>
        </v-layout>
      </div>
    </v-layout>
  </v-navigation-drawer>
</template>

<script>
import { mapState } from 'vuex'
import { mapFields } from 'vuex-map-fields'
import { Alert } from '~/store/alerts'
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
      editEmail: [],
      menu: false,
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
      task: {
        deadline: '',
        description: '',
        id: '',
        name: 'chekc',
        priority: null,
        teamUsers: [],
        time: {
          estimateTime: 0,
          originalTime: 0
        },
        type: null
      },
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
    ...mapState('user', ['userList']),
    ...mapFields('project', ['projectDetail', 'priority']),
    drawer: {
      get () {
        return this.value
      },
      set (value) {
        this.$emit('input', value)
      }
    }
  },
  watch: {
    task: {
      deep: true,
      handler (newVal, oldVal) {
        const check = this.shallowCompare(newVal, oldVal)
        if (newVal.id === oldVal.id && check) {
          this.editTask()
        }
      }
    }
  },
  methods: {
    setPriority (priority) {
      this.task.priority = priority
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
    shallowCompare (obj1, obj2) {
      return Object.entries(obj1).every(([key, value]) => obj2[key] === value)
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

      form.teamUsers = form.teamUsers.map(user => user.id)
      form.estimateTime = form.time.estimateTime
      form.originalTime = form.time.originalTime
      form.statusId = form.status.id
      return form
    },
    async editTask () {
      try {
        const form = this.getFormEditTask(this.task)
        await this.$axios.patch(`/tasks/update/${this.task.id}`, form)
        this.$store.commit('alerts/add', new Alert(this, {
          type: 'success',
          icon: 'check',
          message: 'Update success'
        }))
      } catch (err) {
        console.error(err)
        this.$store.commit('alerts/add', new Alert(this, {
          type: 'error',
          message: err?.response?.data?.message
        }))
      }
    },
    getEmailList (payload) {
      this.editEmail = payload
    },
    setEmailList () {
      this.task.teamUsers = this.editEmail
    }
  }
}
</script>
<style scoped lang="scss">
.ck-rounded-corners .ck.ck-editor__main>.ck-editor__editable, .ck.ck-editor__main>.ck-editor__editable.ck-rounded-corners {
    height: 200px;
}
.select {
  width: 60px;
}
</style>
