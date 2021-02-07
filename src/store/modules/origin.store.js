import $http from "@/libs/axios"

// Mutattions constantes
const SET_LIST = 'SET_LIST'

const state = () => ({ list: [] })

const actions = {
  async fetchOrigin({ commit }) {
    const res = await $http.get('origins')
    if (res && res.data) { commit(SET_LIST, res.data)}
    return res
  },
}

const mutations = {
  [SET_LIST](state, list) {
    state.list = list
  },
}

export default {
  actions,
  mutations,
  state: state()
}