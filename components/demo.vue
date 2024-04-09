<template>
  <v-app id="app">
    <v-container fluid>
      <v-row>
        <v-col cols="12" md="6">
          <v-select :items="taskItems" label="Task name" chips multiple />
        </v-col>
        <v-col cols="12" md="6">
          <v-select :items="assigneeItems" label="Assignee" chips multiple />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-menu
            ref="menu"
            v-model="menu"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            min-width="290px"
          >
            <template #activator="{ on, attrs }">
              <v-text-field
                v-model="date"
                label="Due date"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
              />
            </template>
            <v-date-picker v-model="date" @input="menu = false" />
          </v-menu>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-btn block color="primary" @click="addTask">
            Add task...
          </v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-expansion-panels>
            <v-expansion-panel v-for="(section, i) in sections" :key="i">
              <v-expansion-panel-header>Section {{ i + 1 }}</v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-row>
                  <v-col cols="12" md="6">
                    <v-select :items="taskItems" label="Task name" chips multiple />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-select :items="assigneeItems" label="Assignee" chips multiple />
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <v-menu
                      ref="menu"
                      v-model="menu"
                      :close-on-content-click="false"
                      transition="scale-transition"
                      offset-y
                      min-width="290px"
                    >
                      <template #activator="{ on, attrs }">
                        <v-text-field
                          v-model="date"
                          label="Due date"
                          prepend-icon="mdi-calendar"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                        />
                      </template>
                      <v-date-picker v-model="date" @input="menu = false" />
                    </v-menu>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <v-btn block color="primary" @click="addTask">
                      Add task...
                    </v-btn>
                  </v-col>
                </v-row>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
export default {
  data () {
    return {
      taskItems: ['demo', 'demo', 'ǎd'],
      assigneeItems: ['Assignee 1', 'Assignee 2', 'Assignee 3'],
      date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      menu: false,
      sections: [
        {
          title: 'Section 1',
          tasks: [],
          assignees: [],
          dueDate: ''
        },
        {
          title: 'Section 2',
          tasks: [],
          assignees: [],
          dueDate: ''
        }
      ]
    }
  },
  methods: {
    addTask () {
      // Add task logic here
    },
    addSection () {
      this.sections.push({
        title: 'Section ' + (this.sections.length + 1),
        tasks: [],
        assignees: [],
        dueDate: ''
      })
    }
  }

}
</script>

<style lang="scss" scoped></style>
