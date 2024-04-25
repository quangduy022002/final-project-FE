<template>
  <v-menu
    bottom
    offset-y
    :close-on-click="true"
  >
    <template #activator="{ on, attrs }">
      <v-icon
        v-bind="attrs"
        v-on="on"
      >
        mdi-dots-horizontal
      </v-icon>
    </template>
    <v-list class="d-block">
      <v-list-item @click="$emit('click-edit')">
        <v-list-item-title>
          <v-icon
            class="mr-2"
          >
            mdi-pencil
          </v-icon>Edit
        </v-list-item-title>
      </v-list-item>
      <v-list-item @click="$emit('click-delete')">
        <v-list-item-title>
          <v-icon
            class="mr-2"
          >
            mdi-delete
          </v-icon>Delete Post
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
export default {
  name: 'MenuCrud',
  data () {
    return {
    }
  }
}
</script>
