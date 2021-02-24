<template>
  <b-card>

    <!-- form -->
    <b-form class="mt-2">
      <b-row>
        <b-col sm="6">
          <b-form-group
            label="Username"
            label-for="account-username"
          >
            <b-form-input
              v-model="optionsLocal.username"
              placeholder="Username"
              name="username"
            />
          </b-form-group>
        </b-col>
        <b-col sm="6">
          <b-form-group
            label="Email"
            label-for="account-name"
          >
            <b-form-input
              v-model="optionsLocal.fullName"
              name="name"
              placeholder="Name"
            />
          </b-form-group>
        </b-col>
        <b-col sm="3">
          <b-form-group
            label="Nom"
            label-for="account-e-mail"
          >
            <b-form-input
              v-model="optionsLocal.email"
              name="nom"
              placeholder="Nom"
            />

          </b-form-group>
        </b-col>
        <b-col sm="3">
          <b-form-group
            label="Prénom"
            label-for="account-company"
          >
            <b-form-input
              v-model="optionsLocal.company"
              name="preno"
              placeholder="Company name"
            />
          </b-form-group>
        </b-col>

        <!-- alert -->
        <b-col
          cols="12"
          class="mt-75"
        >
          <b-alert
            show
            variant="warning"
            class="mb-50"
          >
            <h4 class="alert-heading">
              Votre mot de passe par défaut n'a toujorus pas été mis à jour. Veuillez vous rendre dans l'onglet 'Change password' pour le mettre à jour
            </h4>
        
          </b-alert>
        </b-col>
        <!--/ alert -->

        <b-col cols="12">
          <b-button
            v-ripple.400="'rgba(255, 255, 255, 0.15)'"
            variant="primary"
            class="mt-2 mr-1"
          >
            Save changes
          </b-button>
          <b-button
            v-ripple.400="'rgba(186, 191, 199, 0.15)'"
            variant="outline-secondary"
            type="reset"
            class="mt-2"
            @click.prevent="resetForm"
          >
            Reset
          </b-button>
        </b-col>
      </b-row>
    </b-form>
  </b-card>
</template>

<script>
import {
  BFormFile, BButton, BForm, BFormGroup, BFormInput, BRow, BCol, BAlert, BCard, BCardText, BMedia, BMediaAside, BMediaBody, BLink, BImg,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import { useInputImageRenderer } from '@core/comp-functions/forms/form-utils'
import { ref } from '@vue/composition-api'

export default {
  components: {
    BButton,
    BForm,
    BFormGroup,
    BFormInput,
    BRow,
    BCol,
    BAlert,
    BCard,
  },
  directives: {
    Ripple,
  },
  props: {
    generalData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      optionsLocal: JSON.parse(JSON.stringify(this.generalData)),
      profileFile: null,
    }
  },
  methods: {
    resetForm() {
      this.optionsLocal = JSON.parse(JSON.stringify(this.generalData))
    },
  },
  setup() {
    const refInputEl = ref(null)
    const previewEl = ref(null)

    const { inputImageRenderer } = useInputImageRenderer(refInputEl, previewEl)

    return {
      refInputEl,
      previewEl,
      inputImageRenderer,
    }
  },
}
</script>
