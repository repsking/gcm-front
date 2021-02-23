import $http from "@/libs/axios"

// Mutattions constantes
const SET_LIST = 'SET_LIST'

const state = () => ({ list: [] })

const actions = {
  async fetchStatus({ commit }) {
    const res = await $http.get('status')
    if (res && res.data) { commit(SET_LIST, res.data)}
    return res
  },
}

const mutations = {
  [SET_LIST](state, list) {
    state.list = list
  },
}

const getters = {
  statusOptions: state => [{ value: null, text: 'Classer par status' },...state.list.map(({label, code}) => ({ text: label, value: code  }))]
}

export default {
  actions,
  mutations,
  getters,
  state: state()
}