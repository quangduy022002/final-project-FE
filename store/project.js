import { getField, updateField } from 'vuex-map-fields'

export const state = () => ({
  projectDetail: {}
})

export const getters = {
  getField,
  getProjectDetail (state) {
    return state.projectDetail
  }
}

export const mutations = {
  updateField,
  setProjectDetail (state, value) {
    state.projectDetail = value
  },
  setSections (state, val) {
    state.projectDetail.sections = val
  },
  setTasks (state, val) {
    const indexSection = state.projectDetail.sections.findIndex(section => section.id === val.status.id)
    state.projectDetail.sections[indexSection].tasks.pushp(val)
  }
}

export const actions = {
  projectDetail ({ commit }, detail) {
    commit('setProjectDetail', detail)
  }

}
