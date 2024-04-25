<template>
  <v-dialog
    v-model="dialog"
    width="60%"
    height="auto"
  >
    <template #activator="{ on, attrs }">
      <v-btn
        depressed
        width="100%"
        v-bind="attrs"
        v-on="on"
      >
        + Add Project
      </v-btn>
    </template>

    <v-card>
      <v-card-title class="text-h5 lighten-2">
        Create a new project
      </v-card-title>

      <v-card-text>
        <v-text-field v-model="form.name" label="Your project's name" outlined />
        <v-text-field v-model="form.category" label="The category's project" outlined />
        <p>Description</p>
        <ck-editor v-model="form.description" />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="primary"
          text
          @click="submit()"
        >
          Create
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  name: 'CreateProject',
  data () {
    return {
      dialog: false,
      form: {
        name: '',
        category: '',
        description: '',
        teamUsers: [],
        sections: []
      }
    }
  },
  methods: {
    async submit () {
      await this.$axios.post('/projects/create', this.form)
      this.dialog = false
    }
  }
}
</script>
