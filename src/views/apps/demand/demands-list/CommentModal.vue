<template>
  <b-modal
    v-if="inFuture"
    id="modal-comment"
    ref="modal-comment"
    cancel-variant="outline-secondary"
    ok-title="Valider"
    ok-variant="success"
    cancel-title="Fermer"
    centered
    :title="title"
    :ok-disabled="!comment"
    @ok="valid"
    @close="$emit('close')"
  >
    <b-form>
      <b-form-group>
        <b-form-textarea
          id="textarea-rows"
          v-model="comment"
          placeholder="Noter un commentaire..."
          rows="3"
        />
      </b-form-group>
    </b-form>
  </b-modal>
</template>

<script>
import { BModal, BFormTextarea, BForm, BFormGroup } from "bootstrap-vue"
export default {
  components: {
    BModal,
    BFormTextarea,
    BForm,
    BFormGroup,
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
    comment: undefined,
  }),
  computed: {
    title() {
      return this.hasComment ? "Commentaire" : "Ajouter un commentaire"
    },
    hasComment() {
      return this.demand && this.demand.comment && this.demand.comment.text
    },
  },
  mounted() {
    this.$refs["modal-comment"].show()
  },
  created() {
    this.comment = this.demand && this.demand.comment && this.demand.comment.text
  },
  methods: {
    valid() {
      const { comment, demandId } = { comment: this.comment, demandId: this.demand.id }
      this.tryRequest(async () => {
        if (!comment || !demandId) {
          return this.alertError("Comment text or id no provided")
        }
        await this.$store.dispatch(`app-demands/addComment`, { demandId, comment })
        this.alertSuccess({ message: "Commentaire enregistré" })
        this.$emit("commentAdded", { comment })
      })
    },
  },
}
</script>

<style lang="scss" scoped></style>
