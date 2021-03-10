<template>
  <b-modal
    id="modal-programme"
    ref="modal-programme"
    ok-title="Fermer"
    ok-variant="primary"
    centered
    :title="title"
    ok-only
    @hidden="$emit('close')"
  >
    <div>
      <p
        v-for="key in Object.keys(formatedProgram)"
        :key="key"
      >
        {{ key }} : {{ formatedProgram[key] }}
      </p>
      <i>Prochainement, le lien, le prix et la rentabilité seront disponibles dans ce volet</i>
    </div>
  </b-modal>
</template>

<script>
import { BModal } from "bootstrap-vue"
export default {
  components: {
    BModal,
  },
  props: {
    programme: {
      type: Object,
      required: true,
      default: undefined,
      validator: value => value.name && value.gestionnaire && value.ville
    },
  },
  computed: {
    title() {
      return `${this.programme.name} par ${this.programme.gestionnaire} (${this.programme.ville})`
    },
    formatedProgram() {
      const {name, ville, gestionnaire, id} = this.programme
      return {name, ville, gestionnaire, id}
    }
  },
  mounted() {
    this.$refs["modal-programme"].show()
  }
}
</script>