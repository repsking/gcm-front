<template>
  <b-modal
    id="modal-assignUser"
    ref="modal-assignUser"
    cancel-variant="outline-secondary"
    ok-title="Assigner"
    ok-variant="success"
    cancel-title="Annuler"
    centered
    :title="title"
    :ok-disabled="!selectedUser"
    @ok="valid"
    @close="$emit('close')"
  >
    <b-form>
      <b-form-select
        v-model="selectedUser"
        size="lg"
        class="mt-1"
      >
        <template #first>
          <b-form-select-option
            :value="null"
            disabled
          >
            -- Assigner un collaborateur --
          </b-form-select-option>
        </template>
        <b-form-select-option
          v-for="collaborator in collaborators"
          :key="collaborator.id"
          :value="collaborator.id"
        >
          {{ collaborator.prenom }} {{ collaborator.nom }}
        </b-form-select-option>
      </b-form-select>
    </b-form>
  </b-modal>
</template>

<script>
import { BModal, BFormTextarea, BForm, BFormGroup, BFormSelect, BFormSelectOption } from "bootstrap-vue"
import { createNamespacedHelpers } from "vuex"
const { mapActions, mapState } = createNamespacedHelpers("Users")
export default {
  components: {
    BModal,
    BFormSelect,
    BForm,
    BFormSelectOption,
  },
  props: {
    demand: {
      type: Object,
      required: true,
      default: undefined,
      validator: demand => demand && demand.id,
    },
  },
  data: () => ({
    selectedUser: undefined,
  }),
  computed: {
    ...mapState({ collaborators: "list" }),
    title() {
      return this.user ? `Assignée à ${this.user.prenom} ${this.user.nom}` : "Assigner à un utilisateur"
    },
    user() {
      return this.demand && this.demand.handler && this.demand.handler.userId
    },
  },
  mounted() {
    this.$refs["modal-assignUser"].show()
  },
  created() {
    this.fetchCollaborators()
    try {
      this.selectedUser = this.demand.handler.userId.id
    } catch {
      this.selectedUser = null
    }
  },
  methods: {
    ...mapActions(["fetchCollaborators"]),
    valid() {
      const user = this.collaborators.find(collaborator => collaborator.id === this.selectedUser)
      const demandId = this.demand.id
      this.tryRequest(async () => {
        if (!user || !demandId) {
          return this.alertError("User or demand Id no provided")
        }
        await this.$store.dispatch(`app-demands/assignCollaborator`, { demandId, userId: user.id })
        this.alertSuccess({ message: `${user.prenom} a bien été assigné(e) à cette demande` })
        this.$emit("userAssigned", { user })
      })
    },
  },
}
</script>

<style lang="scss" scoped></style>
