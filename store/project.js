export const state = () => ({
  projectDetail: {}
})

export const getters = {
  getProjectDetail (state) {
    return state.projectDetail
  }
}

export const mutations = {
  setProjectDetail (state, value) {
    state.projectDetail = value
  }
}

export const actions = {
  projectDetail ({ commit }, detail) {
    commit('setProjectDetail', detail)
  }
}
