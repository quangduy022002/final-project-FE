<!-- eslint-disable vue/no-v-html -->
<template>
  <div>
    <dialog-common ref="dialogAddMember" @click="$refs.dialogAddMember.dialog = false">
      <template #header>
        <h2>
          Invite with email
        </h2>
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
            <v-btn outlined :loading="loading.sendInvite" class="text-none rounded-lg" @click="$refs.dialogAddMember.dialog = false">
              Cancel
            </v-btn>
            <v-btn
              type="button"
              background-color="primary"
              color="primary"
              class="text-none rounded-lg"
              :disabled="disabled"
              depressed
              :loading="loading.sendInvite"
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
        <v-card v-if="permission" flat>
          <v-card v-if="!displayCkeditor" flat style="border: 1px solid" class="rounded-lg pa-4" @click="handleDisplay(true)">
            <p class="mb-0" v-html="projectDetail.description" />
          </v-card>
          <div v-else>
            <ck-editor v-model="projectDetail.description" />
            <div class="d-flex align-center mt-2 justify-end" style="gap: 10px">
              <v-btn outlined class="text-none rounded-lg" :loading="loading.updateDsc" @click="handleDisplay(false)">
                Cancel
              </v-btn>
              <v-btn
                type="button"
                background-color="primary"
                color="primary"
                class="text-none rounded-lg"
                depressed
                :loading="loading.updateDsc"
                @click="updateProject"
              >
                Update
              </v-btn>
            </div>
          </div>
        </v-card>
        <p v-else class="mb-0" v-html="project.description" />
      </div>
      <div>
        <h3 class="font-weight-medium mb-2">
          Project members
        </h3>
        <v-layout class="align-center flex-wrap" style="gap: 100px">
          <v-card flat>
            <v-btn
              class="d-flex align-center pl-2 py-8 pr-6 justify-start"
              color="transparent"
              elevation
              @click="$refs.dialogAddMember.dialog = true"
            >
              <v-card flat class="pa-2" style="border: 1px dashed grey; border-radius: 50%">
                <v-icon size="21" color="grey">
                  mdi-plus
                </v-icon>
              </v-card>
              <p class="mb-0 ml-2 text-subtitle-1 grey--text font-weight-medium text-none">
                Add member
              </p>
            </v-btn>
          </v-card>
          <div v-for="user in project.teamUsers" :key="user.id">
            <card-member :user="user" :permission="permission" />
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
      permission: false,
      loading: {
        sendInvite: false,
        updateDsc: false
      },
      displayCkeditor: false
    }
  },
  computed: {
    ...mapState('user', ['userList']),

    projectDetail () {
      return { ...this.project }
    }
  },
  methods: {
    handleDisabled (payload) {
      this.disabled = payload
    },
    getEmailList (payload) {
      this.emailList = payload
    },
    async sendInvite () {
      this.loading.sendInvite = true
      try {
        await Promise.all(
          this.emailList.map(async (email) => {
            await this.$axios.post('projects/sendInviteUser', {
              projectId: this.project.id,
              email,
              message: this.message
            })
          })
        )
        this.message = ''
        this.$refs.dialogAddMember.dialog = false
      } catch (error) {
      } finally {
        this.loading.sendInvite = false
      }
    },
    async updateProject () {
      this.loading.updateDsc = true
      try {
        const convertTeamUsers = this.projectDetail.teamUsers.map(user => user.id)
        const { data } = await this.$axios.patch(`projects/update/${this.project.id}`, {
          ...this.project,
          description: this.projectDetail.description,
          teamUsers: convertTeamUsers
        })
        this.$store.commit('project/setProjectDetail', data)
        this.displayCkeditor = false
      } catch (error) {
      } finally {
        this.loading.updateDsc = false
      }
    },
    handleDisplay (payload) {
      this.displayCkeditor = payload
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
.v-btn:before {
  background-color: gray !important;
}
</style>
