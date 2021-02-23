// Notification
import { useToast } from 'vue-toastification/composition'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
const toast = useToast()


export default
{
  data: () => ({
    inFuture: false
  }),
  methods: {
    async tryRequest (requestFunc, cbError = undefined) {
      try {
        const res = await requestFunc()
        return res
      } catch (error) {
        if (!cbError) {
          this.alertError({ title: 'Oops ! An error occured', message: error.message || error })
        } else { cbError(error) }
      }
    },
    alertSuccess ({ title = 'Success', message = 'No message defined' }) {
      this.$bvToast.toast(message, {
        title,
        variant: 'success',
        solid: true,
      })
    },
    alertError ({title =  'Oops, an error occured', message = 'No message defined' }) {
      this.$bvToast.toast(message, {
        title,
        variant: 'danger',
        solid: true,
      })
    }
  }
}



