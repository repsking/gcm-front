<template>
  <div>
    <!-- Filters -->
    <demands-list-filters
      v-if="inFuture"
      :origin-filter.sync="originFilter"
      :status-filter.sync="statusFilter"
      :handler-filter.sync="handlerFilter"
      :origin-options="originsOptions"
      :status-options="statusOptions"
      :handler-options="handlerOptions"
    />

    <!-- Table Container Card -->
    <b-card
      no-body
      class="mb-0"
    >
      <div class="m-2">
        <!-- Table Top -->
        <b-row>
          <!-- Per Page -->
          <b-col
            cols="12"
            md="6"
            class="d-flex align-items-center justify-content-start mb-1 mb-md-0"
          >
            <text>Show</text>
            <v-select
              v-model="perPage"
              :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
              :options="perPageOptions"
              :clearable="false"
              class="per-page-selector d-inline-block mx-50"
            />
            <text>entries</text>
          </b-col>

          <!-- Search -->
          <b-col
            cols="12"
            md="6"
          >
            <div class="d-flex align-items-center justify-content-end">
              <b-form-input
                v-model="searchQuery"
                class="d-inline-block mr-1"
                placeholder="Filtrer par demandes de contact . . ."
                debounce="500"
              />
            </div>
          </b-col>
        </b-row>
      </div>

      <b-table
        ref="refUserListTable"
        class="position-relative"
        :items="fetchUsers"
        responsive
        :fields="tableColumns"
        primary-key="id"
        :sort-by.sync="sortBy"
        show-empty
        empty-text="Aucune demande de contact"
        :sort-desc.sync="isSortDirDesc"
      >
        <!-- Column: Date -->
        <template #cell(createdAt)="data">
          <b-media vertical-align="center">
            {{ data.item.createdAt | dateHour }}
          </b-media>
        </template>

        <!-- Column: User Informations -->
        <template #cell(userInfos)="data">
          <b-media vertical-align="center">
            <template #aside>
              <b-button
                v-if="inFuture"
                variant="outline-primary"
                class="btn-icon rounded-circle"
                title="Ajouter dans contact"
              >
                <feather-icon icon="UserPlusIcon" />
              </b-button>
            </template>

            <p v-if="data.item.user.name">
              Nom:
              <span
                class="search-link text-primary"
                @click="search(data.item.user.name)"
              >
                {{ data.item.user.name }}
              </span>
            </p>
            <p v-if="data.item.user.firstname">
              Prenom:
              <span
                class="search-link text-primary"
                @click="search(data.item.user.firstname)"
              >
                {{ data.item.user.firstname }}
              </span>
            </p>
            <p
              v-if="data.item.user.email"
              class="search-link text-primary"
              @click="search(data.item.user.email)"
            >
              <feather-icon
                icon="MailIcon"
                size="18"
                class="mr-50"
              /> {{ data.item.user.email }}
            </p>

            <p
              v-if="data.item.user.phone"
              class="search-link text-primary"
              @click="search(data.item.user.phone)"
            >
              <feather-icon
                icon="PhoneIcon"
                size="18"
                class="mr-50"
              /> {{ data.item.user.phone }}
            </p>
          </b-media>
        </template>

        <!-- Column: Status -->
        <template #cell(status)="data">
          <div class="text-nowrap">
            <b-badge
              v-if="data.item.handler.status && data.item.handler.status.label"
              pill
              :variant="`align-text-top text-capitalize text-${resolveUserStatusVariant(data.item.role)}`"
              class="text-capitalize"
            >
              {{ data.item.handler.status.label }}
            </b-badge>
            <i v-else>Aucun status</i>
          </div>
        </template>

        <!-- Column: Origin -->
        <template #cell(origin)="data">
          <b-badge
            pill
            :variant="`light-${resolveOriginColor(data.item.origin.url)}`"
            class="text-capitalize"
          >
            {{ data.item.origin.name }}
          </b-badge>
        </template>

        <!-- Column: Message -->
        <template #cell(message)="data">
          <!-- TODO: Do not forget to trunc the message -->

          <p>
            {{ data.item.message || "Aucun message" }}
          </p>
          <p>
            <b-button
              v-if="data.item.programme"
              variant="outline-primary"
              size="sm"
              @click="demandProgramme = data.item"
            >
              Voir programme
            </b-button>
          </p>
        </template>

        <!-- Column: Url -->
        <template #cell(url)="data">
          <a
            v-if="data.item.url"
            :href="data.item.url"
            target="_blank"
          > Voir page </a>
          <i v-else>Aucune url fournie</i>
        </template>

        <!-- Column: Actions -->
        <template #cell(actions)="data">
          <b-avatar
            variant="primary"
            button
            :badge="!!(data.item.comment && data.item.comment.text)"
            badge-variant="warning"
            badge-left
            badge-top
            @click="viewCommentModal(data.item)"
          >
            <feather-icon icon="FileTextIcon" />
          </b-avatar>

          <b-avatar
            variant="primary"
            button
            :text="data.item.handler && data.item.handler.userId && getUserInitials(data.item.handler.userId)"
            :title="data.item.handler && data.item.handler.userId && getFullName(data.item.handler.userId)"
            @click="viewAssignUserModal(data.item)"
          >
            <feather-icon
              v-if="!(data.item.handler && data.item.handler.userId)"
              icon="UserPlusIcon"
            />
          </b-avatar>

          <b-dropdown
            variant="link"
            no-caret
            :right="$store.state.appConfig.isRTL"
          >
            <template #button-content>
              <feather-icon
                icon="MoreVerticalIcon"
                size="16"
                class=" text-body"
              />
            </template>

            <b-dropdown-item :to="{ name: 'apps-users-view', params: { id: data.item.id } }">
              <feather-icon icon="FileTextIcon" />
              <span class="align-middle ml-50">Details</span>
            </b-dropdown-item>

            <b-dropdown-item>
              <feather-icon icon="TrashIcon" />
              <span class="align-middle ml-50">Delete</span>
            </b-dropdown-item>
          </b-dropdown>
        </template>
      </b-table>
      <div class="mx-2 mb-2">
        <b-row>
          <b-col
            cols="12"
            sm="6"
            class="d-flex align-items-center justify-content-center justify-content-sm-start"
          >
            <span
              class="text-muted"
            >Showing {{ dataMeta.from }} de {{ dataMeta.to }} of {{ dataMeta.of }} demands</span>
          </b-col>
          <!-- Pagination -->
          <b-col
            cols="12"
            sm="6"
            class="d-flex align-items-center justify-content-center justify-content-sm-end"
          >
            <b-pagination
              v-model="currentPage"
              :total-rows="totalDemands"
              :per-page="perPage"
              first-number
              last-number
              class="mb-0 mt-1 mt-sm-0"
              prev-class="prev-item"
              next-class="next-item"
            >
              <template #prev-text>
                <feather-icon
                  icon="ChevronLeftIcon"
                  size="18"
                />
              </template>
              <template #next-text>
                <feather-icon
                  icon="ChevronRightIcon"
                  size="18"
                />
              </template>
            </b-pagination>
          </b-col>
        </b-row>
      </div>
    </b-card>

    <comment-modal
      v-if="demandComment"
      :demand="demandComment"
      @close="closeCommentModal"
      @commentAdded="closeCommentModal"
    />

    <assign-demand-modal
      v-if="demandAssign"
      :demand="demandAssign"
      @close="closeAssignUserModal"
      @userAssigned="closeAssignUserModal"
    />
    <view-programme-modal
      v-if="demandProgramme && demandProgramme.programme"
      :programme="demandProgramme.programme"
      @close="demandProgramme = undefined"
    />
  </div>
</template>

<script>
import {
  BCard,
  BRow,
  BCol,
  BFormInput,
  BButton,
  BTable,
  BMedia,
  BBadge,
  BDropdown,
  BDropdownItem,
  BPagination,
  BAvatar,
} from "bootstrap-vue"
import vSelect from "vue-select"
import store from "@/store"
import { ref, onUnmounted } from "@vue/composition-api"
import { avatarText } from "@core/utils/filter"
import DemandsListFilters from "./DemandsListFilters.vue"
import useDemandsList from "./useDemandsList"
import demandStoreModule from "../demandStoreModule"
import CommentModal from "./CommentModal"
import AssignDemandModal from "./AssignDemandModal"
import ViewProgrammeModal from './ViewProgrammeModal'
import { mapActions, mapGetters, mapState } from "vuex"

export default {
  components: {
    DemandsListFilters,
    BCard,
    BRow,
    BCol,
    BFormInput,
    BButton,
    BTable,
    BMedia,
    BBadge,
    BDropdown,
    BDropdownItem,
    BPagination,
    BAvatar,
    vSelect,
    CommentModal,
    AssignDemandModal,
    ViewProgrammeModal
  },
  data: () => ({
    demandComment: undefined,
    demandAssign: undefined,
    demandProgramme: undefined
  }),
  computed: {
    ...mapGetters("Origin", ["originsOptions"]),
    ...mapGetters("Status", ["statusOptions"]),
    ...mapState("app-demands", ["demands"]),
  },
  created() {
    this.fetchOrigins()
    this.fetchStatus()
  },
  methods: {
    ...mapActions("Origin", ["fetchOrigins"]),
    ...mapActions("Status", ["fetchStatus"]),

    search(query) {
      this.searchQuery = query
    },
    viewCommentModal(demand) {
      this.demandComment = demand
    },
    viewAssignUserModal(demand) {
      this.demandAssign = demand
    },
    closeCommentModal() {
      this.demandComment = undefined
    },
    closeAssignUserModal() {
      this.demandAssign = undefined
    },
    deleteDemand() {
      if (confirm("Are you to delete this row ?")) {
        this.tryRequest(async () => {
          await this.$http.delete(`demands/${this.demand.id}`)
          this.alertSuccess({
            message: "La demande de contact a bien été supprimée",
            title: "Demande de contact Supprimée",
          })
        })
      }
    },
  },
  setup() {
    const USER_APP_STORE_MODULE_NAME = "app-demands"

    // Register module
    if (!store.hasModule(USER_APP_STORE_MODULE_NAME))
      store.registerModule(USER_APP_STORE_MODULE_NAME, demandStoreModule)

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(USER_APP_STORE_MODULE_NAME)) store.unregisterModule(USER_APP_STORE_MODULE_NAME)
    })

    const isAddNewUserSidebarActive = ref(false)

    const handlerOptions = [
      { value: null, text: "Classer par assignation" },
      { text: "Pending", value: "pending" },
      { text: "Active", value: "active" },
      { text: "Inactive", value: "inactive" },
    ]

    const {
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
      refetchData,

      // UI
      resolveUserRoleVariant,
      resolveUserRoleIcon,
      resolveUserStatusVariant,
      resolveOriginColor,

      // Extra Filters
      originFilter,
      statusFilter,
      handlerFilter,
    } = useDemandsList()

    return {
      // Sidebar
      isAddNewUserSidebarActive,

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
      refetchData,

      // UI
      resolveUserRoleVariant,
      resolveUserRoleIcon,
      resolveUserStatusVariant,
      resolveOriginColor,

      handlerOptions,

      // Extra Filters
      originFilter,
      statusFilter,
      handlerFilter,
    }
  },
}
</script>

<style lang="scss" scoped>
.per-page-selector {
  width: 90px;
}
.search-link {
  cursor: pointer;
}
</style>

<style lang="scss">
@import "@core/scss/vue/libs/vue-select.scss";
</style>
