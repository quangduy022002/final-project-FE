<template>
  <v-dialog v-model="dialog" width="500" content-class="rounded-xl">
    <template #activator="{ on, attrs }">
      <slot name="button" :on="on" :attrs="attrs" />
    </template>

    <v-card flat class="rounded-xl pa-8">
      <div class="mt-n4 mr-n4 text-end">
        <v-btn icon @click="$emit('click')">
          <v-icon>
            mdi-close
          </v-icon>
        </v-btn>
      </div>
      <slot name="header" />

      <slot name="content" />

      <slot name="footer" />
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'DialogAddMember',
  emits: ['click'],
  data () {
    return {
      dialog: false
    }
  }
}
</script>

<style lang="scss" scoped></style>
