import $http from "@/libs/axios"

// Mutattions constantes
const SET_LIST = 'SET_LIST'

const state = () => ({ list: [] })

const actions = {
  async fetchOrigins({ commit }) {
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
const getters = {
  originsOptions: state => [{ value: null, text: 'Classer par Site' },...state.list.map(({name, url}) => ({ text: name, value: url  }))]
}

export default {
  actions,
  mutations,
  getters,
  state: state()
}