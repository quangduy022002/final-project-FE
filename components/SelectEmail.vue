<!-- eslint-disable vue/no-v-text-v-html-on-component -->
<!-- eslint-disable vue/no-v-html -->
<template>
  <v-autocomplete
    v-model="selectedList"
    :search-input.sync="search"
    :disabled="isUpdating"
    :items="userList"
    filled
    chips
    label="Email"
    item-text="email"
    item-value="email"
    :return-object="returnObject"
    multiple
    hide-details
    solo
    flat
    class="rounded-lg"
    :menu-props="{
      maxHeight: 180, minWidth: '26.7%', nudgeBottom: '6px', nudgeRight: '16px',
      rounded: 'lg',

    }"
    :rules="[$rules.required]"
    :no-data-text="($vuetify.noDataText = 'Not found user')"
    placeholder="Search the email"
  >
    <template #selection="data">
      <v-chip
        v-bind="data.attrs"
        :input-value="data.selected"
        class="mt-2"
        close
        @click="data.select"
        @click:close="remove(data.item)"
      >
        <v-avatar size="10" left :color="data.item.color">
          <img v-if="data.item?.avatar" :src="data.item.avatar">
          <span v-else class="black--text text-uppercase font-weight-medium " style="font-size: 12px;">{{ data.item?.firstName?.slice(0, 1) +
            data.item?.lastName?.slice(0, 1) }}</span>
        </v-avatar>
        <p class="mb-0 font-weight-regular" style="font-size: 14px;">
          {{ data.item.email }}
        </p>
      </v-chip>
    </template>
    <template #item="data">
      <v-list-item-avatar class="mr-2">
        <img v-if="data.item?.avatar" :src="data.item.avatar">
        <v-avatar size="32" :color="data.item.color">
          <img v-if="data.item?.avatar" :src="data.item.avatar">
          <span v-else class="black--text text-subtitle-2 font-weight-medium text-uppercase">{{
            data.item?.firstName?.slice(0, 1) +
              data.item?.lastName?.slice(0, 1) }}</span>
        </v-avatar>
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title
          class=" font-weight-regular"
          style="font-size: 14px;"
          v-html="emphasizeMatchWord(data.item.email)"
        />
      </v-list-item-content>
    </template>
  </v-autocomplete>
</template>

<script>

export default {
  name: 'SelectEmail',
  props: {
    returnObject: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: undefined
    },
    userList: {
      type: Array,
      default: () => []
    },
    width: {
      type: Number,
      default: 280
    },
    fullWidth: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      list: [],
      selectedList: [],
      isUpdating: false,
      search: ''
    }
  },
  watch: {
    selectedList (value) {
      this.$emit('setDisabled', !value)
      this.$emit('emailList', [...value])
      if (value) {
        this.search = ''
      }
    },
    isUpdating (val) {
      if (val) {
        setTimeout(() => (this.isUpdating = false), 3000)
      }
    }
  },
  methods: {
    emphasizeMatchWord (name) {
      const regExp = new RegExp(this.search, 'i')

      return name.replace(
        regExp,
        match => "<strong class='textBlue--text'>" + match + '</strong>'
      )
    },

    remove (item) {
      let index
      if (typeof item === 'object') {
        index = this.selectedList.findIndex(select => select === item.email)
      } else {
        index = this.selectedList.indexOf(item.email)
      }

      if (index >= 0) { this.selectedList.splice(index, 1) }
    }
  }
}
</script>

<style lang="scss" scoped>
.v-autocomplete::v-deep {
.v-input__slot:hover {
background-color: transparent !important;

}

input,
label {
font-size: 14px;
}
}

.theme--light.v-text-field--outline>.v-input__control>.v-input__slot {
border: 1px solid red !important;
}
.v-list {
  padding: 0
}
</style>
