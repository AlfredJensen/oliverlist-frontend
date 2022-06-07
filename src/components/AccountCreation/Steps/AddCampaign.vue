<template>
<section :class="animation">
  <div>
      <div>
       
          <form @submit.prevent="onSubmit">
            <vue-form-generator ref="campaignForm" :schema="schema" :model="this.model" :options="formOptions"></vue-form-generator>
          </form>
      
          <button 
          class="btn btn-success btn-sm text-center" @click="goToStepCampaign(true)"><i class="icon-plus"></i>
          {{$t('lang.button.save')}}
          </button>
        


        </div>


      </div>
</section>
</template>

<script>
  import Vue from 'vue';
  import { formattersMixin, campaignUtilsMixin } from "@/_mixins/";
  import LoadingSpinner from "@/components/LoadingSpinner.vue";

  import VueFormGenerator from 'vue-form-generator';
  import 'vue-form-generator/dist/vfg.css';


  Vue.use(VueFormGenerator, {
    validators: {
      urlValidator: (value, field, model) => {
        let re = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+\/$/;

        if (!re.test(value)) {
          return ["Invalid URL."];
        } else {
          return []
        }
      },
    }
  });

  import Multiselect from 'vue-multiselect';

// if this component is not defined here, theres an error

Vue.component("multiselect", Multiselect);
import { campaignsService } from "@/_services";
import { mapState, mapActions } from "vuex";

export default {
  components: {
    LoadingSpinner,
    "vue-form-generator": VueFormGenerator.component,
  },

  data() {
    var self = this;
    return {
      loadingsp: false,
      copy: false,
      copytracking:true,
      copysendingparameters:true,
      copymessage:true,
      copyyouraudience:true,
      newIdCampaign: false,
      activeStep: 1,
      saved:0,
      imported:false,
      animation: 'animate-in',
      formSteps: [],
      consultors: [],
      classes: [],
      savedSteps: [],
      schema: {
        fields: [
        {
          type: "input",
          inputType: "hidden",
          model: "campaign.id",
          readonly: true,
          featured: false,
          disabled: true,
        }, {
          type: "input",
          inputType: "text",
          label: this.$t('lang.label.campaignname'),
          model: "campaign.name",
          featured: true,
          readonly: false,
          required: true,
          disabled: false,
          min: 5,
          max: 30,
          validator: VueFormGenerator.validators.string.locale({
            fieldIsRequired: this.$t('lang.label.required'),
            textTooSmall: this.$t("lang.validation.texttosmall", {min: "{1}"}),
          }),
          styleClasses:'',
        }
        ]
      },
      formOptions: {
        validateAfterLoad: false,
        validateAfterChanged: true
      },
    }
  },

  mixins: [
  formattersMixin,
  campaignUtilsMixin,
  ],

  props:{
    selectImport: true,
  },

  created() {

    this.loadingsp = false

    this.getConsultors();


    this.loadModel();

    this.getAllOptionsList();

    if(this.selectImport){
      this.model.parameters_tf.push("12")
      this.model.imported = true;
    }else{
      this.model.parameters_tf.pop("12")
      this.model.imported = false;
    }
    this.imported = this.model.imported


    this.model.campaign.step = [];    


  },
 

  computed: {
    ...mapState({
      currentUser: state => state.authentication.user,
      model: state => state.campaigns.selected.data,
    }),
  },

  methods: {
    ...mapActions("campaigns", {
      getEmptyCampaign: "getEmpty",
    }),
    ...mapActions("optionsList", {
      getAllOptionsList: "getAll",
    }),


    goToStepCampaign(save) {
      this.model.campaign.tpl_first_step = undefined;
      this.model.campaign.step = 1
      campaignsService.update(this.model).then(result => {
        if(this.model.campaign.id == undefined){
          this.$emit("campaignCreated")
        }
      });
    },

    loadModel() {      
        this.getEmptyCampaign();
    },


    getConsultors() {
      campaignsService
        .getConsultors(this.selectedCampaignId)
        .then(
          (response) => {
            if(response !== undefined){
              let field = this.schema.fields.find(field => field.model === 'campaign.client_nylas_id')
              if(field !== undefined){
                field.values = response;
                this.consultors = response
              }
            }
          }
        );
    },
  }
} 
</script>