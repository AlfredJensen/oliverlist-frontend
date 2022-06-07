<template>
  <div>
    <section :class="animation" class="five-step-connection" v-if="activeStep == 6">
      <div class="contenedor pt-0">
        <div class="row ">
          <div class="col-sm-12 col-lg-12 mt-4">
            <div class=" card p-4">
              <form @submit.prevent="onSubmit">
                <h2 class="mt-3"> Connection </h2>
                <vue-form-generator ref="connectionForm" :schema="schema" :model="this.model" :options="formOptions">
                </vue-form-generator>
              </form>
            </div>
            <div class="py-4 mb-4 d-flex justify-content-end">
              <button class="ml-3 btn btn-primary themed-button btn-sm text-right" @click="goToStepCampaign(5)">{{ $t('lang.button.back') }}</button>
              <button class="ml-3 btn btn-primary themed-button btn-sm text-right" @click="goToStepCampaign(6)">{{ $t('lang.button.next') }}</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
<script>

import Vue from 'vue';
import { campaignsService, categoriesService, smtpMailboxesService } from "@/_services";
import { mapState, mapActions } from "vuex";
import VueFormGenerator from 'vue-form-generator';
import 'vue-form-generator/dist/vfg.css';

export default {
  components: {
    "vue-form-generator": VueFormGenerator.component,
  },
  props: {
    model: Object
  },
  computed: {
    ...mapState({
      consultors: state => state.optionsList.all['consultors'].data,
      loadingOptionsList: state => state.optionsList.loading,
    }),
  },
  data() {
    return {
      activeStep: 6,
      animation: 'animate-in',
      formSteps: [],
      schema: {
        fields: [
          {
            type: "select",
            label: this.$t('lang.label.consultor'),
            model: "campaign.smtp_mailbox_id",
            readonly: false,
            featured: true,
            required: true,
            disabled: false,
            validator: VueFormGenerator.validators.required,
            selectOptions: {},
            values: [],
            styleClasses:'col-md-12',
          },
        ],
      },
      formOptions: {
        validateAfterLoad: false,
        validateAfterChanged: true
      }
    }
  },

  created() {
    let field = this.schema.fields.find(field => field.model === 'campaign.smtp_mailbox_id')
    field.values = this.consultors;
  },

  methods: {
    goToStepCampaign(step) {
      this.$emit("goToStepCampaign", step);
    },
  }
} 
</script>