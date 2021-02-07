import { ref, watch, computed } from '@vue/composition-api'
import store from '@/store'

// Notification
import { useToast } from 'vue-toastification/composition'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'

export default function useDemandsList() {
  // Use toast
  const toast = useToast()

  const refUserListTable = ref(null)

  // Table Handlers
  const tableColumns = [
    { key: 'createdAt', label: "Date", sortable: true },
    { key: 'userInfos', label: "Prospect", sortable: true },
    { key: 'message', sortable: true },
    { key: 'status', sortable: true },
    { key: 'origin', sortable: true },
    { key: 'url', sortable: true },
    { key: 'actions' },
  ]
  const perPage = ref(25)
  const totalDemands = ref(0)
  const currentPage = ref(1)
  const perPageOptions = [10, 25, 50, 100]
  const searchQuery = ref('')
  const sortBy = ref('createdAt')
  const isSortDirDesc = ref(true)
  const originFilter = ref(null)
  const statusFilter = ref(null)
  const handlerFilter = ref(null)

  const dataMeta = computed(() => {
    const localItemsCount = refUserListTable.value ? refUserListTable.value.localItems.length : 0
    return {
      from: perPage.value * (currentPage.value - 1) + (localItemsCount ? 1 : 0),
      to: perPage.value * (currentPage.value - 1) + localItemsCount,
      of: totalDemands.value,
    }
  })

  const refetchData = () => {
    refUserListTable.value.refresh()
  }

  watch([currentPage, perPage, searchQuery, originFilter, statusFilter, handlerFilter], () => {
    refetchData()
  })

  const fetchUsers = (ctx, callback) => {
    store
      .dispatch('app-user/fetchDemands', {
        search: searchQuery.value,
        perPage: perPage.value,
        page: currentPage.value,
        sortBy: sortBy.value,
        sortDesc: isSortDirDesc.value,
        origin: originFilter.value,
        status: statusFilter.value,
        handler: handlerFilter.value,
      })
      .then(response => {
        // const { demands, total } = response.data
        const {results: demands, meta} = response
        callback(demands)
        totalDemands.value = meta.totalItems
      })
      .catch(error => {
        console.error('Error fetching demadns list', error)
        toast({
          component: ToastificationContent,
          props: {
            title: 'Une erreur inconnue est survenue lors de l’affichage de la liste' ,
            icon: 'AlertTriangleIcon',
            variant: 'danger',
          },
        })
      })
  }

  // *===============================================---*
  // *--------- UI ---------------------------------------*
  // *===============================================---*

  const resolveUserRoleVariant = role => {
    if (role === 'subscriber') return 'primary'
    if (role === 'author') return 'warning'
    if (role === 'maintainer') return 'success'
    if (role === 'editor') return 'info'
    if (role === 'admin') return 'danger'
    return 'primary'
  }

  const resolveUserRoleIcon = role => {
    if (role === 'subscriber') return 'UserIcon'
    if (role === 'author') return 'SettingsIcon'
    if (role === 'maintainer') return 'DatabaseIcon'
    if (role === 'editor') return 'Edit2Icon'
    if (role === 'admin') return 'ServerIcon'
    return 'UserIcon'
  }

  const resolveUserStatusVariant = status => {
    if (status === 'pending') return 'warning'
    if (status === 'active') return 'success'
    if (status === 'inactive') return 'secondary'
    return 'warning'
  }

  const resolveOriginColor = origin => {
    console.log(origin, "please")
    if (/com/i.test(origin)) return 'danger'
    if (/fr/i.test(origin)) return 'warning'
    if (/immo/i.test(origin)) return 'info'
    return 'warning'
  }

  return {
    fetchUsers,
    tableColumns,
    perPage,
    currentPage,
    totalDemands,
    dataMeta,
    perPageOptions,
    searchQuery,
    sortBy,
    isSortDirDesc,
    refUserListTable,

    resolveUserRoleVariant,
    resolveUserRoleIcon,
    resolveUserStatusVariant,
    resolveOriginColor,
    refetchData,

    // Extra Filters
    originFilter,
    statusFilter,
    handlerFilter,
  }
}
