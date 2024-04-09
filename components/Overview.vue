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
          <select-email label="Email" :data="data" @setDisabled="handleDisabled" @emailList="getEmailList" />
          <div>
            <p class="mb-0 font-weight-medium" style="font-size: 12px;">
              Message (optional)
            </p>
            <v-textarea
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
              background-color="primary"
              color="primary"
              class="text-none"
              :disabled="disabled"
              depressed
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
        <p>content here</p>
      </div>
      <div>
        <h3 class="font-weight-medium mb-2">
          Project members
        </h3>
        <v-row>
          <v-col>
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
          </v-col>
          <v-col v-for="n in 6" :key="n" cols="12" sm="3">
            <card-member />
          </v-col>
        </v-row>
      </div>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'OverviewIndex',
  data () {
    return {
      disabled: true,
      emailList: [],
      data: [
        {
          id: 'f953b2d7-1c44-4658-9fb7-520e90f8edbb',
          username: 'tambin',
          email: 'tamnguyen.10092000tv@gmail.com',
          firstName: 'tam',
          lastName: 'bin'
        },
        {
          id: 'f953b2d7-1c44-4658-9fb7-520e90f8edpp',
          username: 'abc',
          email: 'abc@gmail.com',
          firstName: 'la',
          lastName: 'binh'
        },
        {
          id: 'f953b2d7-1c44-4658-9fb7-520e90f8edpp',
          username: '123',
          email: '123@gmail.com',
          firstName: '123123',
          lastName: '123'
        },
        {
          id: 'f953b2d7-1c44-4658-9fb7-520e90f8edpp',
          username: '555',
          email: '555@gmail.com',
          firstName: '555',
          lastName: '555'
        },
        {
          id: 'f953b2d7-1c44-4658-9fb7-520e90f8edpp',
          username: '666',
          email: '666@gmail.com',
          firstName: '66',
          lastName: '66'
        },
        {
          id: 'f953b2d7-1c44-4658-9fb7-520e90f8edpp',
          username: '777',
          email: '777@gmail.com',
          firstName: '77',
          lastName: '77'
        },
        {
          id: 'f953b2d7-1c44-4658-9fb7-520e90f8edpp',
          username: '888',
          email: '888@gmail.com',
          firstName: '88',
          lastName: '8'
        },
        {
          id: 'f953b2d7-1c44-4658-9fb7-520e90f8edpp',
          username: '999',
          email: '99@gmail.com',
          firstName: '99',
          lastName: '99x'
        }
      ]
    }
  },
  methods: {
    handleDisabled (payload) {
      this.disabled = payload
    },
    getEmailList (payload) {
      this.emailList = payload
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
