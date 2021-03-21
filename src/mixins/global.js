// Notification
import { useToast } from 'vue-toastification/composition'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
export default {
  data: () => ({
    inFuture: process.env.VUE_APP_FUTURE && process.env.VUE_APP_FUTURE === 'true',
    isDev: process.env.NODE_ENV && /dev/i.test(process.env.NODE_ENV)
  }),
  computed: {
    multiLang() {
      return this.$store.state.appConfig.layout.multiLang
    }   
  },  
  methods: {
    async tryRequest (requestFunc, cbError = undefined) {
      try {
        const res = await requestFunc()
        return res
      } catch (error) {
        if (!cbError) {
          this.alertError(error.message || error )
        } else { cbError(error) }
      }
    },
    getUserInitials: user => user && user.prenom && user.nom && `${user.prenom[0]}${user.nom[0]}`,
    getFullName: user => user && user.prenom && user.nom && `${user.prenom} ${user.nom}`,
    fgchvjb(text) {
      this.$toast({
        component: ToastificationContent,
        position: 'top-right',
        props: {
          icon: 'CoffeeIcon',
          variant: 'success',
          text
        },
      })
    },
    alertSuccess ({ title = 'Success', message = 'No message defined' }) {
      this.$toast.success(message)
    },
    alertError (text = 'Something wrong happened') {
      this.$toast.error(text)
      /*this.$toast({
        component: ToastificationContent,
        position: 'top-right',
        props: {
          icon: 'CoffeeIcon',
          variant: 'success',
          text
        },
      })*/
    }
  }
}



