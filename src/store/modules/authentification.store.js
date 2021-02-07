import storage from '@/utils/storage'
import $http from "@/libs/axios"

const storageKey = 'user'

// Mutattions constantes
const AUTH_LOGIN = 'AUTH_LOGIN'
const AUTH_LOGOUT = 'AUTH_LOGOUT'

const state = () => ({
  user: storage.get(storageKey),
  connected: !!storage.get(storageKey),
})

const getters = {
  userFullName: ({user}) => user && `${user.prenom} ${user.nom}`,
  userInitials: ({user}) => user && `${user.prenom[0]}${user.nom[0]}`
}

const actions = {
  async login({ commit }, { username, password }) {
    const res = await $http.post('users/login', { username, password })
    if (res && res.data) { commit(AUTH_LOGIN, res.data) }
    return res
  },
  logout({ commit }) {
    commit(AUTH_LOGOUT)
    return true
  },
}

const mutations = {
  [AUTH_LOGIN](state, user) {
    state.connected = true
    state.user = user
    storage.set(storageKey, user)
  },
  [AUTH_LOGOUT](state) {
    state.connected = false
    state.user = undefined
    storage.remove(storageKey)
  },
}

export default {
  actions,
  mutations,
  getters,
  state: state()
}