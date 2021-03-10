import Vue from "vue"
import { getUserData } from "@/auth/utils"
import store from "@/store"
import router from '@/router'

// axios
import axios from "axios"

const axiosIns = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
})

const unhandledError = {
  status: 500,
  message: "Une erreur inconnue s'est produite au niveau du serveur distant. Nous mettons tout en oeuvre pour régler ce désagrément.",
}

axiosIns.interceptors.response.use(null, error => {
  let obj
  if (error.response) {
    const { status, data } = error.response

    if (status === 498) {
      store.dispatch("Authentification/logout")
      obj = { status, message: "Votre session a expiré. Vous devez vous reconnecter." }
      router.replace('/login')
      return Promise.reject(obj)
    }
    obj = status >= 500
        ? {status, message: unhandledError.message }
        : { status, message: data.message || unhandledError.message }
  } else if (error.request) {
    obj = unhandledError
  } else {
    console.error("Error unhandled from API : ", error)
    obj = unhandledError
  }

  return Promise.reject(obj)
})

axiosIns.interceptors.request.use(config => {
  const user = getUserData()
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`
    config.headers.uuid = user.userId
  }
  return config
})

Vue.prototype.$http = axiosIns

export default axiosIns
