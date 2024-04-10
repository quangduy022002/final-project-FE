export const state = () => ({
  userList: {}
})

export const getters = {
  getUserList (state) {
    return state.userList
  }
}

export const mutations = {
  setUserList (state, value) {
    state.userList = value
  }
}

export const actions = {
  userList ({ commit }, detail) {
    commit('setUserList', detail)
  }
}
