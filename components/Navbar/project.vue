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
            <select-email label="Email" :user-list="task.teamUsers" :selected="task.teamUsers" :return-object="true" @emailList="getEmailList" />
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
      <div class="text-h3 ma-4 d-flex align-center">
        {{ task?.name }}
        <v-btn v-if="!task.type || task.type.name === 'Pending'" icon @click.stop="clickTaskType(task)">
          <v-icon size="36">
            mdi-check-circle-outline
          </v-icon>
        </v-btn>
        <v-btn v-else icon color="success" @click.stop="clickTaskType(task)">
          <v-icon size="36">
            mdi-check-circle
          </v-icon>
        </v-btn>
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
          <v-card class="d-flex" elevation="0">
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
          </v-card>
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
        <div v-if="taskComments.length">
          <v-divider />
          <v-form @submit.prevent="editComment()">
            <v-layout
              v-for="taskComment in taskComments"
              :key="taskComment.id"
              class="my-4"
              align-start
              style="gap: 10px;"
            >
              <v-avatar min-height="38" max-height="38" max-width="38" min-width="38" :color="$auth.user.color">
                <img v-if="$auth.user.avatar" :src="user.avatar" alt="avatar">
                <span v-else class="black--text text-subtitle-2 text-uppercase font-weight-medium ">{{ $auth.user.firstName.slice(0, 1) +
                  $auth.user.lastName.slice(0, 1) }}</span>
              </v-avatar>
              <v-layout v-if="editMode.mode && editMode.id === taskComment.id">
                <v-text-field
                  v-model="editMode.content"
                  hide-details
                  outlined
                  dense
                  rounded
                  :autofocus="true"
                />
                <v-btn icon type="submit">
                  <v-icon>
                    mdi-send
                  </v-icon>
                </v-btn>
              </v-layout>
              <v-layout v-else>
                <div>
                  <v-card outlined class="px-2 text-wrap">
                    <div class="text-subtitle-2">
                      {{ taskComment.createdBy.firstName + ' ' + taskComment.createdBy.lastName }}
                    </div>
                    <v-card flat class="text-subtitle text-wrap">
                      {{ taskComment.content }}
                    </v-card>
                  </v-card>
                  <v-layout>
                    <v-btn x-small elevation="0" plain @click="openEditMode(taskComment.id, taskComment.content)">
                      Edit
                    </v-btn>
                    <v-btn x-small elevation="0" plain @click="openReplyMode(taskComment.id, taskComment.createdBy.firstName, taskComment.createdBy.lastName)">
                      Reply
                    </v-btn>
                    <v-btn x-small elevation="0" plain @click="deleteComment(taskComment)">
                      Delete
                    </v-btn>
                    <v-btn v-if="taskComment?.children && taskComment?.children.length" x-small elevation="0" plain @click="openViewReply(taskComment)">
                      {{ taskComment.viewReply ? "Close view" : `View reply(${taskComment.children.length})` }}
                    </v-btn>
                  </v-layout>
                  <div v-if="taskComment.viewReply">
                    <v-layout
                      v-for="childrenComment in taskComment.children"
                      :key="childrenComment.id"
                      class="my-4"
                      align-start
                      style="gap: 10px;"
                    >
                      <v-avatar min-height="38" max-height="38" max-width="38" min-width="38" :color="$auth.user.color">
                        <img v-if="$auth.user.avatar" :src="user.avatar" alt="avatar">
                        <span v-else class="black--text text-subtitle-2 text-uppercase font-weight-medium ">{{ $auth.user.firstName.slice(0, 1) +
                          $auth.user.lastName.slice(0, 1) }}</span>
                      </v-avatar>
                      <v-layout v-if="editMode.mode && editMode.id === childrenComment.id">
                        <v-text-field
                          v-model="editMode.content"
                          hide-details
                          outlined
                          dense
                          rounded
                          :autofocus="true"
                        />
                        <v-btn icon type="submit">
                          <v-icon>
                            mdi-send
                          </v-icon>
                        </v-btn>
                      </v-layout>
                      <v-layout v-else>
                        <div>
                          <v-card outlined class="px-2 text-wrap">
                            <div class="text-subtitle-2">
                              {{ childrenComment.createdBy.firstName + ' ' + taskComment.createdBy.lastName }}
                            </div>
                            <v-card flat class="text-subtitle text-wrap">
                              {{ childrenComment.content }}
                            </v-card>
                          </v-card>
                          <v-layout>
                            <v-btn x-small elevation="0" plain @click="openEditMode(childrenComment.id, childrenComment.content)">
                              Edit
                            </v-btn>
                            <v-btn x-small elevation="0" plain @click="openReplyMode(taskComment.id, taskComment.createdBy.firstName, taskComment.createdBy.lastName)">
                              Reply
                            </v-btn>
                            <v-btn x-small elevation="0" plain @click="deleteComment(childrenComment)">
                              Delete
                            </v-btn>
                          </v-layout>
                        </div>
                      </v-layout>
                    </v-layout>
                  </div>
                </div>
              </v-layout>
            </v-layout>
          </v-form>
        </div>
        <v-divider />
        <v-form ref="formComment" @submit.prevent="addComment(task.id)">
          <v-layout class="mt-4" style="gap: 10px;">
            <v-avatar min-height="38" max-height="38" max-width="38" min-width="38" :color="$auth.user.color">
              <img v-if="$auth.user.avatar" :src="user.avatar" alt="avatar">
              <span v-else class="black--text text-subtitle-2 text-uppercase font-weight-medium ">{{ $auth.user.firstName.slice(0, 1) +
                $auth.user.lastName.slice(0, 1) }}</span>
            </v-avatar>
            <v-text-field
              v-if="replyMode.mode"
              v-model="comment"
              hide-details
              outlined
              dense
              rounded
              class="mr-4"
              :append-icon="replyMode.mode? 'mdi-close' : ''"
              :label="replyMode.mode ? `Reply ${replyMode.person}` : ''"
              :autofocus="replyMode.autofocus"
              @click:append="clearReplyMode"
            />
            <v-text-field
              v-else
              v-model="comment"
              hide-details
              outlined
              dense
              rounded
              class="mr-4"
              :append-icon="replyMode.mode? 'mdi-close' : ''"
              :label="replyMode.mode ? `Reply ${replyMode.person}` : ''"
              :autofocus="replyMode.autofocus"
              @click:append="clearReplyMode"
            />
            <v-btn icon type="submit">
              <v-icon>
                mdi-send
              </v-icon>
            </v-btn>
          </v-layout>
        </v-form>
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
      comment: '',
      replyMode: {
        id: '',
        mode: false,
        person: '',
        autofocus: false
      },
      editMode: {
        mode: false,
        id: '',
        content: ''
      },
      menu: false,
      title: 'Project 1',
      icon: '',
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
    ...mapFields('project', ['projectDetail', 'priority', 'type', 'comments']),
    drawer: {
      get () {
        return this.value
      },
      set (value) {
        this.$emit('input', value)
      }
    },
    taskComments () {
      const comments = this.comments.filter(comment =>
        comment.taskId === this.task.id
      )
      return comments.map((comment) => {
        comment.viewReply = false
        return comment
      })
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
    openViewReply (comment) {
      comment.viewReply = !comment.viewReply
      this.$forceUpdate()
    },
    openReplyMode (id, firstName, lastName) {
      this.replyMode.id = id
      this.replyMode.person = firstName + ' ' + lastName
      this.replyMode.mode = true
      this.replyMode.autofocus = true
    },
    clearReplyMode () {
      this.replyMode.id = ''
      this.replyMode.person = ''
      this.replyMode.mode = false
      this.replyMode.autofocus = false
    },
    openEditMode (id, content) {
      this.editMode.mode = true
      this.editMode.id = id
      this.editMode.content = content
    },
    async editComment () {
      try {
        if (this.editMode.content.length) {
          this.$store.commit('project/editComment', { id: this.editMode.id, content: this.editMode.content })
          await this.$axios.patch(`/comments/update/${this.editMode.id}`, { content: this.editMode.content })
        }
      } catch (err) {
        console.error(err)
      } finally {
        this.editMode.mode = false
        this.editMode.id = ''
        this.editMode.content = ''
      }
    },
    async deleteComment (comment) {
      this.$store.commit('project/deleteComment', comment)
      await this.$axios.delete(`/comments/remove/${comment.id}`)
    },
    async addComment (taskId) {
      const body = {
        taskId,
        content: this.comment
      }
      if (this.replyMode.id.length && this.replyMode.mode) {
        body.parentId = this.replyMode.id
      }
      if (this.comment.length) {
        const res = await this.$axios.post('/comments/create', body)
        if (!this.replyMode.mode) {
          this.$store.commit('project/addComment', res.data)
        } else {
          this.$store.commit('project/addChildrenComment', { comment: res.data, parentId: this.replyMode.id })
        }
        this.$refs.formComment.reset()
        this.comment = ''
        this.replyMode.id = ''
        this.replyMode.person = ''
        this.replyMode.mode = false
      }
    },
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
