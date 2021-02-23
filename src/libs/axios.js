import Vue from "vue"
import { getUserData } from "@/auth/utils"

// axios
import axios from "axios"

const axiosIns = axios.create({
  baseURL: " http://localhost:3008/api",
  timeout: 10000,
  // headers: {'X-Custom-Header': 'foobar'}
})

const error500 = {
  status: 500,
  message:
    "Une erreur inconnue s'est produite au niveau du serveur distant. Nous mettons tout en ouvre pour régler ce désagrément.",
}

axiosIns.interceptors.response.use(null, error => {
  let obj
  if (error.response) {
    const { status, data } = error.response

    if (status === 498) {
      store.dispatch("authentification/disconnect")
      obj = { status, message: "Votre session a expiré. Merci de vous reconnecter." }
      return Promise.reject(obj)
    }
    obj =
      status >= 500
        ? { ...error500, status }
        : { status, message: data.message || "No error message provided by the API" }
  } else if (error.request) {
    obj = error500
  } else {
    console.error("Error from axios : ", error.message)
    obj = error500
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
