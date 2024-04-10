<template>
  <div>
    <dialog-common ref="dialogAddMember" @click="$refs.dialogAddMember.dialog = false">
      <template #header>
        <p class="mb-0 text-subtitle-1 font-weight-medium">
          Invite with email
        </p>
      </template>
      <template #content>
        <div class="mt-2">
          <select-email label="Email" :user-list="userList" @setDisabled="handleDisabled" @emailList="getEmailList" />
          <div>
            <p class="mb-0 font-weight-medium" style="font-size: 12px;">
              Message (optional)
            </p>
            <v-textarea
              v-model="message"
              class="mt-2 rounded-lg"
              outlined
              auto-grow
              placeholder="Add a message"
              rows="5"
              row-height="30"
            />
          </div>
        </div>
      </template>
      <template #footer>
        <v-card flat>
          <div class="d-flex align-center justify-end" style="gap: 10px">
            <v-btn outlined class="text-none" @click="$refs.dialogAddMember.dialog = false">
              Cancel
            </v-btn>
            <v-btn
              type="button"
              background-color="primary"
              color="primary"
              class="text-none"
              :disabled="disabled"
              depressed
              @click="sendInvite"
            >
              Send
            </v-btn>
          </div>
        </v-card>
      </template>
    </dialog-common>
    <v-card flat class="pa-10 d-flex flex-column justify-start" style="gap: 50px">
      <div>
        <h3 class="font-weight-medium mb-2">
          Project description
        </h3>
        <ck-editor v-if="permission" :value="project.description" @input="updateDescription" />
        <p v-else>
          {{ project.description }}
        </p>
      </div>
      <div>
        <h3 class="font-weight-medium mb-2">
          Project members
        </h3>
        <v-layout class="align-center flex-wrap" style="gap: 100px">
          <v-card flat>
            <v-btn
              class="d-flex align-center pl-2 py-6 pr-6 justify-start"
              color="transparent"
              elevation
              @click="$refs.dialogAddMember.dialog = true"
            >
              <v-card flat class="pa-2" style="border: 1px dashed grey; border-radius: 50%">
                <v-icon small color="grey">
                  mdi-plus
                </v-icon>
              </v-card>
              <p class="mb-0 ml-2 text-subtitle-1 grey--text font-weight-medium text-none">
                Add member
              </p>
            </v-btn>
          </v-card>
          <div v-for="user in project.teamUsers" :key="user.id">
            <card-member :user="user" />
          </div>
        </v-layout>
      </div>
    </v-card>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'OverviewIndex',
  props: {
    project: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      disabled: true,
      emailList: [],
      message: '',
      permission: false
    }
  },
  computed: {
    ...mapState('user', ['userList'])
  },
  async created () {
    await this.getUserList()
    this.checkPermission()
  },
  methods: {
    updateDescription (newValue) {
      this.$emit('update:description', newValue)
    },
    handleDisabled (payload) {
      this.disabled = payload
    },
    getEmailList (payload) {
      this.emailList = payload
    },
    async getUserList () {
      try {
        const { data } = await this.$axios.get('users/getAll')

        this.$store.commit('user/setUserList', data)
      } catch (error) {
      }
    },
    async sendInvite () {
      await Promise.all(
        this.emailList.forEach(async (email) => {
          await this.$axios.post('projects/sendInviteUser', {
            projectId: this.project.id,
            email,
            message: this.message
          })
        })
      )
    },
    checkPermission () {
      if (this.$auth.$state.user.id === this.project.createdBy.id) {
        this.permission = true
      } else {
        this.permission = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.v-textarea--auto-grow::v-deep {
  .v-text-field__slot {
    font-size: 14px !important;
  }
}
</style>