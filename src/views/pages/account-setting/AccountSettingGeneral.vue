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
              v-model="userLocal.username"
              placeholder="Username"
              name="username"
            />
          </b-form-group>
        </b-col>
        <b-col sm="6">
          <b-form-group
            label="Email"
            label-for="Email"
          >
            <b-form-input
              v-model="userLocal.email"
              name="email"
              placeholder="Email"
            />
          </b-form-group>
        </b-col>
        <b-col sm="3">
          <b-form-group
            label="Nom"
            label-for="nom"
          >
            <b-form-input
              v-model="userLocal.nom"
              name="nom"
              placeholder="Nom"
            />

          </b-form-group>
        </b-col>
        <b-col sm="3">
          <b-form-group
            label="Prénom"
            label-for="prenom"
          >
            <b-form-input
              v-model="userLocal.prenom"
              name="prenom"
              placeholder="Prénom"
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
            <h4
              v-if="user.tmpPass"
              class="alert-heading"
            >
              Veuillez vous rendre dans l'onglet 'Change password' et mettre à jour votre mot de passe
            </h4>
        
          </b-alert>
        </b-col>
        <!--/ alert -->

        <b-col cols="12">
          <b-button
            v-ripple.400="'rgba(255, 255, 255, 0.15)'"
            variant="primary"
            class="mt-2 mr-1"
            @click="update"
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
import { mapState } from 'vuex'

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
      userLocal: undefined,
      profileFile: null,
    }
  },
  computed: {
    ...mapState('Authentification', ['user']),
  },
  created() {
    this.userLocal = {...this.user}
  },
  methods: {
    resetForm() {
      this.optionsLocal = JSON.parse(JSON.stringify(this.generalData))
    },
    async update() {
      const { nom, prenom, email, username } = this.userLocal
      this.tryRequest(async () => {
          await this.$store.dispatch('Authentification/updateUser', { nom, prenom, email, username })
          this.alertSuccess({message: "Informations mise à jour"})
      })
    } 
  }
}
</script>
