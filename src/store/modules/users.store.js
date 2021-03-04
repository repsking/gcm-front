import $http from "@/libs/axios"

// Mutattions constantes
const SET_LIST = 'SET_LIST'

const state = () => ({ list: [] })

const actions = {
  async fetchCollaborators({ commit }) {
    const res = await $http.get('/users/contributors')
    if (res && res.data) { commit(SET_LIST, res.data)}
    return res.data
  },
}

const mutations = {
  [SET_LIST](state, list) {
    state.list = list
  },
}

const getters = {
  collaboratorsOptions: state => state.list.map(({ prenom, nom, id }) => ({ text: `${prenom} ${nom}`, value: {prenom, nom, id} }))
}

export default {
  actions,
  mutations,
  getters,
  state: state()
}