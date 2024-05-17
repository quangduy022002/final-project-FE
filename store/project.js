import { getField, updateField } from 'vuex-map-fields'

export const state = () => ({
  projectDetail: {},
  priority: [],
  type: [],
  comments: []
})

export const getters = {
  getField,
  getProjectDetail (state) {
    return state.projectDetail
  }
}

export const mutations = {
  updateField,
  addComment (state, comment) {
    state.comments.push(comment)
  },
  editComment (state, { id, content }) {
    const taskComment = state.comments.find(commentData => commentData.id === id)
    taskComment.content = content
  },
  deleteComment (state, comment) {
    const index = state.comments.findIndex(commentData => commentData.id === comment.id)
    state.comments.splice(index, 1)
  },
  setProjectDetail (state, value) {
    state.projectDetail = value
  },
  setPriority (state, val) {
    state.priority = val
  },
  setType (state, val) {
    state.type = val
  },
  setSections (state, val) {
    state.projectDetail.sectionsJson = val
  },
  setTasks (state, val) {
    const indexSection = state.projectDetail.sectionsJson.findIndex(section => section.id === val.status.id)
    state.projectDetail.sectionsJson[indexSection].tasks.push(val)
  },
  setComments (state, val) {
    state.comments = val
  }
}

export const actions = {
  projectDetail ({ commit }, detail) {
    commit('setProjectDetail', detail)
  }

}
