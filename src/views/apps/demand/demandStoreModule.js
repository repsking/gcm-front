import $http from '@/libs/axios'
import Vue from 'vue'


export default {
  namespaced: true,
  state: {
    demands: []
  },
  getters: {},
  mutations: {
    SET_DEMANDS: (state, list) => state.demands = list,
    SET_DEMAND_FIELD(state, field, { demandId, value }) {
      const index = state.findIndex(demand => demand.id === demandId)
      if (index) Vue.set(state.demands[index], field, value)
      else console.warn(`Index not found while adding ${field} in demands list`)
    }

  },
  actions: {
    async fetchDemands({ commit }, params) {
      const res = await $http.get('/demands/paginated', { params })
      if (res && res.data) {
        commit('SET_DEMANDS', res.data && res.data.results)
        return res.data
      }
    },
    async assignCollaborator({ commit }, {demandId, userId}) {
      const res = await $http.post(`/demands/assignTo/${demandId}`, { userId })
      if (res && res.data) {
        commit('SET_DEMAND_FIELD','handler', { demandId, value: {userId} })
        return res.data
      }
    },
    async addComment({ commit }, { demandId, comment }) {
      const res = await $http.post(`demands/addComment/${demandId}`, { comment })
      if (res && res.data) {
        commit('SET_DEMAND_FIELD','comment', { demandId, value: comment })
        return res.data
      }
      //TODO: Uncomment when the back will provide the new comment object
      // throw new Error('Comment failed to register')
    },
    fetchUser(ctx, { id }) {
      return new Promise((resolve, reject) => {
        $http
          .get(`/apps/user/users/${id}`)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    addUser(ctx, userData) {
      return new Promise((resolve, reject) => {
        $http
          .post('/apps/user/users', { user: userData })
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
  },
}
