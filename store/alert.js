import { getField, updateField } from 'vuex-map-fields'
import { v4 as uuidv4 } from 'uuid'

export class Alert {
  key = uuidv4()
  value = true
  icon = 'information-outline'
  type = 'info'
  message = ''
  created = ''

  constructor (app, { icon, type, message }) {
    this.icon = icon
    this.type = type
    this.message = message
    this.created = new Date()
    this.time = new Date(this.created).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

    if (app.$gtag) {
      app.$gtag.event('alert', {
        event_category: this.type,
        event_label: this.message
      })
    }
  };
};

export const state = () => ({
  messages: []
})

export const getters = {
  getField
}

export const mutations = {
  updateField,
  add (state, alert) {
    state.messages.push(alert)
  },
  close (state, index) {
    state.messages.splice(index, 1)
  },
  closeAll (state) {
    state.messages = []
  }
}

export const AlertModule = {
  namespaced: true,
  state,
  getters,
  mutations
}
