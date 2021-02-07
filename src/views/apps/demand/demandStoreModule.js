import $http from '@/libs/axios'

export default {
  namespaced: true,
  state: {},
  getters: {},
  mutations: {},
  actions: {
    async fetchDemands(ctx, params) {

      const res = await $http.get('/demands/paginated', { params })
      return res && res.data
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
