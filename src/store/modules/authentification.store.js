import storage from '@/utils/storage'
import { cleanUndefined } from "@/utils/object"
import $http from "@/libs/axios"

const storageKey = 'user'

// Mutattions constantes
const AUTH_LOGIN = 'AUTH_LOGIN'
const AUTH_LOGOUT = 'AUTH_LOGOUT'
const SET_USER = 'SET_USER'
const CONFIRM_PASSWORD = 'CONFIRM_PASSWORD'

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
  async updateUser({commit}, { nom, prenom, email, username }) {
    const res = await $http.put('users/updateUser', { nom, prenom, email, username })
    if(res && res.data) { commit(SET_USER, res.data); return res.data }
    return false
  },
  async updatePassword({commit}, { oldPassword, newPassword }) {
    const res = await $http.put('users/changePassword', { oldPassword, newPassword })
    if(res) { commit(CONFIRM_PASSWORD); return true }
    return false
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
  [SET_USER](state, { nom, prenom, email, username }) {
    const userStorage = storage.get(storageKey)
    const newValues = cleanUndefined({ nom, prenom, email, username })
    state.user =  { ...userStorage, ...newValues }
    storage.set(storageKey, { ...userStorage, ...newValues })
  },
  [CONFIRM_PASSWORD](state) {
    state.user.tmpPass = undefined
    const userStorage = storage.get(storageKey)
    storage.set(storageKey, cleanUndefined({ ...userStorage, tmpPass: undefined }))
  } 
}

export default {
  actions,
  mutations,
  getters,
  state: state()
}