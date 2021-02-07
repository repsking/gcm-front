<template>
  <b-card no-body>
    <b-card-header class="pb-50">
      <h5>
        Filtres
      </h5>
    </b-card-header>
    <b-card-body>
      <b-row>
        <b-col
          cols="12"
          md="4"
          class="mb-md-0 mb-2"
        >
          <label>Origine Site</label>
          <b-form-select
            :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
            :value="originFilter"
            :options="originOptions"
            class="w-100"
            @input="(val) => $emit('update:originFilter', val)"
          />
        </b-col>
        <b-col
          cols="12"
          md="4"
          class="mb-md-0 mb-2"
        >
          <label>Status</label>
          <b-form-select
            :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
            :value="statusFilter"
            :options="statusOptions"
            class="w-100"
            @input="(val) => $emit('update:statusFilter', val)"
          />
        </b-col>
        <b-col
          cols="12"
          md="4"
          class="mb-md-0 mb-2"
        >
          <label>Assigneé à</label>
          <b-form-select
            :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
            :value="handlerFilter"
            :options="handlerOptions"
            class="w-100"
            :reduce="val => val.value"
            @input="(val) => $emit('update:handlerFilter', val)"
          />
        </b-col>
      </b-row>
    </b-card-body>
  </b-card>
</template>

<script>
import {
  BCard, BCardHeader, BCardBody, BRow, BCol,BFormSelect
} from 'bootstrap-vue'

export default {
  components: {
    BRow,
    BCol,
    BCard,
    BCardHeader,
    BCardBody,
    BFormSelect
  },
  props: {
    originFilter: {
      type: [String, null],
      default: null,
    },
    statusFilter: {
      type: [String, null],
      default: null,
    },
    handlerFilter: {
      type: [String, null],
      default: null,
    },
    originOptions: {
      type: Array,
      required: true,
    },
    statusOptions: {
      type: Array,
      required: true,
    },
    handlerOptions: {
      type: Array,
      required: true,
    },
  },
}
</script>

<style lang="scss">
@import '@core/scss/vue/libs/vue-select.scss';
</style>
