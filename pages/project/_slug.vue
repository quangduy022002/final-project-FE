<template>
    <div>
    <v-app-bar
    elevation="1" color="white">
        <v-toolbar-title class="text-h3">{{ title }}
            <v-icon size="40" class="mb-2">
                mdi-star-outline
            </v-icon>
    </v-toolbar-title>
    </v-app-bar>
   <div class="pa-4">
    <v-btn>
        <v-icon class="mr-1">mdi-filter-variant</v-icon>    
        Filter
    </v-btn>
    <v-btn plain @click="addSection">+ Add Section</v-btn>
    <v-layout>
            <v-card min-width="381" flat v-for="(section, index) in sections" :key="section.id" class="mr-4">
                <v-layout align-center>
                    <h2 contentEditable>{{section.title}}</h2>
                    <v-spacer></v-spacer>
                    <v-icon>
                        mdi-plus
                    </v-icon>
                    <v-icon>
                        mdi-dots-horizontal
                    </v-icon>
                </v-layout>
                <v-card class="mb-2" color="secondary" v-for="(task, index) in section.tasks" :key="index">
                    <v-card-title class="pa-2 text-h5">
                        <v-btn icon>
                        <v-icon>
                            mdi-check-circle-outline
                        </v-icon>
                    </v-btn>
                        <div contentEditable>{{task.title}}</div>
                    </v-card-title>
                    <v-layout justify-end>
                        <v-btn icon class="mr-2"><v-icon>mdi-account-multiple-plus-outline</v-icon></v-btn>
                        
                    </v-layout>
                </v-card>
                <v-layout justify-center align-center>
                    <v-btn plain @click="addTask(index)">+ Add task</v-btn>
                </v-layout>
            </v-card>
    </v-layout>
   </div>
</div>
</template>
<script>
const defaultSections = {
                title: "Section title",
                tasks: [
                    {
                        title: "Task title",
                        complete: false,
                        assign: [] 
                    }
                ]
            };
const defaultTask =
{
                    title: "Task title",
                    complete: false,
                    assign: [] 
                };
export default {
  data(){
    return {
        title: "Project 1",
        icon: "",
        sections: [
            {
                id: 0,
                title: "Section title",
                tasks: [
                    {
                        title: "Task title",
                        complete: false,
                        assign: [] 
                    }
                ]
            }
        ]
    }
  },
  methods: {
    addSection(){
        const newSection = JSON.parse(JSON.stringify(defaultSections))
        newSection.id = this.sections.length
        this.sections.push(newSection)
    },
    addTask(indexSection){
        const newTask = JSON.parse(JSON.stringify(defaultTask))
        this.sections[indexSection].tasks.push(newTask)
    }
  }
}
</script>