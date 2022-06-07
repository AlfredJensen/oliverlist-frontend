<template>
  <section class="campaign-info">
    <ol class="breadcrumb">
            <li class="breadcrumb-item cursor-pointer" @click="changeTab('ALL')">{{ $t('lang.label.allcampaigns') }}</li>
            <li class="breadcrumb-item active">{{selected.campaign.name}}</li>
        </ol>
    <!--<Header :user="user" />-->
    <main class="contenedor">
      <LoadingSpinner v-if="loading" />
      <div class="" v-if="!loading">
        <div class="row">
          <div class="">
            <div>
              <div style='min-height:180px;' class="notEffect p-3 mb-2">
                <div class="">
                  <div class="row pt-2">
                    <div class="col-1"></div>
                    <div class="col-10">
                      <div class="d-flex justify-content-between align-items-center">
                        <div class="d-flex align-items-center">
                          <form @submit.prevent="onSubmit">
                            <vue-form-generator ref="vfg" :schema="schema" :model="this.selected" :options="formOptions"></vue-form-generator>
                            <div class="vue-form-generator">
                              <div class="form-group valid field-submit col-sm-12">
                                <div class="field-wrap float-right">
                                  <input id="" type="submit" value=Submit>
                                </div>
                              </div>
                          </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> 
    </main>
  </section>
</template>
<script>
import { mapState, mapActions } from "vuex";
import { router } from "@/_helpers";
import Header from "@/components/Header.vue";
import { statusBadgeMixin } from "@/_mixins/";
import LoadingSpinner from "@/components/LoadingSpinner.vue";

import Vue from 'vue';

import VueFormGenerator from 'vue-form-generator';
import 'vue-form-generator/dist/vfg.css'

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
        decimal: (value, field, model) => {
          let re = /^\d+(\.\d{1,2})?$/;

          if (!re.test(value)) {
            return ["Invalid decimal."];
          } else {
            return []
          }
        },
    }
});

import Multiselect from 'vue-multiselect';

// if this component is not defined here, theres an error

Vue.component("multiselect", Multiselect);

import { categoriesService } from "@/_services";
import { campaignsService } from "@/_services";
import { clientsService } from "@/_services";
import { smtpMailboxesService } from "@/_services";
import { regionsService } from "@/_services";

export default {

  data() {
    return {
      model: {},
      schema: {
        fields: [{
          type: "input",
          inputType: "hidden",
          model: "campaign.id",
          readonly: true,
          featured: false,
          disabled: true,
        }, {
          type: "input",
          inputType: "text",
          label: this.$t('lang.label.name'),
          model: "campaign.name",
          readonly: false,
          featured: true,
          required: true,
          disabled: false,
          placeholder: "User's name",
          min: 5,
          validator: VueFormGenerator.validators.string.locale({
            fieldIsRequired: this.$t('lang.label.required'),
            textTooSmall: this.$t("lang.validation.texttosmall", {min: "{1}"}),
          }),
          styleClasses:'col-md-6',
        }, {
          type: "input",
          inputType: "text",
          label: this.$t('lang.label.description'),
          model: "campaign.description",
          readonly: false,
          featured: true,
          required: true,
          disabled: false,
          min: 5,
          validator: VueFormGenerator.validators.string.locale({
            fieldIsRequired: this.$t('lang.label.required'),
            textTooSmall: this.$t("lang.validation.texttosmall", {min: "{1}"}),
          }),
          styleClasses:'col-md-6',
        }, {
          type: "input",
          inputType: "text",
          label: this.$t('lang.label.demourl'),
          model: "campaign.demo_url",
          readonly: false,
          featured: true,
          required: true,
          disabled: false,
          hint: "Ex: https://www.yourwebsite.com/",
          min: 5,
          validator: VueFormGenerator.validators.urlValidator,
          styleClasses:'col-md-6',
        }, {
            type: "select",
            label: this.$t('lang.label.client'),
            model: "campaign.client_id",
            readonly: false,
            featured: true,
            required: true,
            disabled: false,
            validator: VueFormGenerator.validators.required,
            selectOptions: {},
            values: [],
            styleClasses:'col-md-6',
        }, {
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
            styleClasses:'col-md-6',
        }, {
          type: "input",
          inputType: "double",
          label: "Daily Budget",
          model: "campaign.daily_budget",
          readonly: false,
          featured: true,
          required: true,
          disabled: false,
          min: 5,
          hint: "Ex: 15.00",
          validator: VueFormGenerator.validators.decimal,
          styleClasses:'col-md-6',
        }, {
          type: "vueMultiSelect",
          label: this.$t('lang.label.categoriesallowed'),
          model: "categories_allowed",
          required: true,
          validator: VueFormGenerator.validators.required,
          featured: true,
          selectOptions: {
            multiple: true,
            trackBy : "id",
            label: "label",
            searchable: true,
            clearOnSelect: false,
            hideSelected: true,
            allowEmpty: false,
            taggable: false,
            tagPlaceholder: "tagPlaceholder",
            onNewTag(newTag, id, options, value) {
              //console.log("onNewTag", newTag, id, options, value);
            },
            // showPointer: true,
            onSearch(searchQuery, id, options) {
              //console.log("onSearch", searchQuery, id, options);
            }
          },
          values: [],
          styleClasses:'col-md-6',
        },
        {
          type: "vueMultiSelect",
          label: "Categories Job",
          model: "categories_job_allowed",
          required: true,
          validator: VueFormGenerator.validators.required,
          featured: true,
          selectOptions: {
            multiple: true,
            trackBy : "id",
            label: "name",
            searchable: true,
            clearOnSelect: false,
            hideSelected: true,
            allowEmpty: false,
            taggable: false,
            tagPlaceholder: "tagPlaceholder",
            onNewTag(newTag, id, options, value) {
              //console.log("onNewTag", newTag, id, options, value);
            },
            // showPointer: true,
            onSearch(searchQuery, id, options) {
              //console.log("onSearch", searchQuery, id, options);
            }
          },
          values: [],
          styleClasses:'col-md-6',
        },
        {
          type: "vueMultiSelect",
          label: "Regions",
          model: "regions_allowed",
          required: true,
          validator: VueFormGenerator.validators.required,
          featured: true,
          selectOptions: {
            multiple: true,
            trackBy : "id",
            label: "name",
            searchable: true,
            clearOnSelect: false,
            hideSelected: true,
            allowEmpty: false,
            taggable: false,
            tagPlaceholder: "tagPlaceholder",
            onNewTag(newTag, id, options, value) {
              //console.log("onNewTag", newTag, id, options, value);
            },
            // showPointer: true,
            onSearch(searchQuery, id, options) {
              //console.log("onSearch", searchQuery, id, options);
            }
          },
          values: [],
          styleClasses:'col-md-6',
        },
        {
          type: "checklist",
          label: this.$t('lang.label.parameters'),
          model: "parameters",
          listBox: true,
          featured: true,
          checklistOptions: {
            value: "id",
            name: "description" 
          },
          values: [],
          styleClasses:'col-md-6',
        }, {
          type: "checklist",
          label: this.$t('lang.label.sendingdays'),
          model: "param_4",
          listBox: true,
          required: true,
          featured: true,
          validator: VueFormGenerator.validators.required,
          checklistOptions: {
            value: "name",
            name: "description" 
          },
          values: [],
          styleClasses:'col-md-3',
        }, {
          type: "checklist",
          label: "Business Size",
          model: "param_5",
          listBox: true,
          required: true,
         
          featured: true,
          checklistOptions: {
            value: "name",
            name: "description" 
          },
          values: [],
          styleClasses:'col-md-3',
        }, {
          type: "textArea",
          label: this.$t('lang.label.signature'),
          model: "campaign.email_signature",
          readonly: false,
          featured: true,
          required: true,
          validator: VueFormGenerator.validators.required,
          disabled: false,
          styleClasses:'col-md-12',
         
        }, 
        /*{
          type: "submit",
          buttonText: this.$t('lang.label.submit'),
          caption: "Submit form",
          validateBeforeSubmit: true,
          onSubmit(model) {
              Dont use this submit button beacuse cannot call a function in here
          }
        }*/
      ]},

      formOptions: {
        validateAfterLoad: true,
        validateAfterChanged: true
      }
    }
  },

  props: {
    campaignId: String
  },

  mixins: [statusBadgeMixin],

  components: {
    Header,
    LoadingSpinner,
    "vue-form-generator": VueFormGenerator.component,
  },

  computed: {
    ...mapState({
      loading: state => state.campaigns.loading,
      selected: state => state.campaigns.selected.data,
      currentUser: state => state.authentication.user
    }),

    ...mapState({
      headerTab: state => state.header.tab
    })
  },

  user() {
    return this.$store.state.authentication.user;
  },

  created() {
     this.getCategories();
     this.getRegions();
     this.getParameters();
     this.getClients();
     this.getParametersOptions(4, "param_4"); //type_id, parameter_name
     this.getParametersOptions(5, "param_5");
  },

  methods: {
    ...mapActions("header", {
      changeHeaderTab: "changeTab"
    }),

    ...mapActions("campaigns", {
      getCampaignById: "getById",
      getEmptyCampaign: "getEmpty"
    }),

    sayHello: function () {
    }, 
    getCampaign() {
      this.searchCampaign();
    },

    searchCampaign() {
      if(this.campaignId){
        this.getCampaignById({
          id: this.campaignId 
        });
      }else{
        this.getEmptyCampaign();
    
      }
      
    },

    onSubmit($event) {
      if(this.$refs.vfg.errors.length > 0) {
        $event.preventDefault();
        this.$swal({
          type: "error",
          title: this.$t('lang.label.error'),
          text: this.$t('lang.label.checkdeerrormessagesintheformandtryagain'),
          showConfirmButton: true
        });
      } else {
        this.$swal({
          type: "warning",
          title: this.$t('lang.label.areyousure'),
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33a2c",
          confirmButtonText: this.$t('lang.button.yes'),
          cancelButtonText: this.$t('lang.button.cancel')
        }).then(result => {
          if (result.value) {
            campaignsService
            .update(this.$refs.vfg.model)
              .then(
                (response) => {
                  this.$swal({
                    type: "success",
                    title: this.$t('lang.label.great'),
                    text: this.$t('lang.label.campaignwasupdatedsuccessfully'),
                    showConfirmButton: false,
                    timer: 3000
                  });
                }
              );
          }
        });
      }
    },

    getCategories() {
      categoriesService
        .getAllParents()
        .then(
          (response) => {
            let field = this.schema.fields.find(field => field.model === 'categories_allowed')
            field.values = response;
          }
        );
      categoriesService
        .getCategoriesJobs()
        .then(
          (response) => {
            let field = this.schema.fields.find(field => field.model === 'categories_job_allowed')
            field.values = response;
          }
        );
    },

    getRegions(){
      regionsService
        .getAll()
        .then(
          (response) => {
            let field = this.schema.fields.find(field => field.model === 'regions_allowed')
            field.values = response;
          }
        );
    },

    getParameters() {
      campaignsService
        .getParameterTypes()
        .then(
          (response) => {
            let field = this.schema.fields.find(field => field.model === 'parameters')
            field.values = response;
          }
        );
    },

    getClients() {
      clientsService
        .getAll()
        .then(
          (response) => {
            let field = this.schema.fields.find(field => field.model === 'campaign.client_id')
            field.values = response;
          }
        );
    },

    getParametersOptions(type_id, parameter_name) {
      campaignsService
        .getParameterTypesOptions(type_id)
        .then(
          (response) => {
            let field = this.schema.fields.find(field => field.model == parameter_name)
            field.values = response;
          }
        );
    },

    changeTab(selectedTab) {
      this.changeHeaderTab({ tab: selectedTab });
    }, 
  }
}
</script>