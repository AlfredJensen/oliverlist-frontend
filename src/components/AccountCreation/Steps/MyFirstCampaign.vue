<template>
  <div id="app" class="bg-white">
      <Sidebar />
  <HeaderTopBar />
  <ToastNotifications/>
   <main class="main"  :class="{ 'expand-main' : isMenuCollapse }">
    <div class="">
      <div class="progress-step"
        :class="{'active': index === activeStep}"
        v-for="(step, index) in formSteps"
        :key="'step'+index">
        <span class="ml-2">{{ $t('lang.label.step') }}</span>
        {{ index + 1 }}
      </div> 
      <div class="progress-step my-4">
      <div class="p-4">
          <div class="">
            <h4 class="text-center my-1">{{ $t('lang.label.newcampaign') }}</h4>
            <div class="">
              <div class=" content-list py-4">
                <ul class="progressbar">
                  <li :class="(activeStep == 1) ? 'active' : '' ">{{ $t('lang.label.parameters') }}</li>
                  <li :class="(activeStep == 2) ? 'active' : '' ">{{ $t('lang.label.youraudience') }}</li>
                  <li :class="(activeStep == 5) ? 'active' : '' ">{{ $t('lang.label.sent') }}</li>
                  <li :class="(activeStep == 3) ? 'active' : '' " >{{ $t('lang.label.message') }}</li>
                  <li :class="(activeStep == 4) ? 'active' : '' ">{{ $t('lang.label.tracking')}}</li>
                  <li :class="(activeStep == 6) ? 'active' : '' ">{{ $t('lang.label.summary') }}</li>
                </ul>
              </div>
            </div>
          </div>        
        </div>
      </div>
    </div>
    <section :class="animation">
      <LoadingSpinner v-if="loading" />
      <div class="contenedor" v-if="!loading && activeStep == 1">
        <div class="row">
          <div class="col-sm-12 col-lg-12  mx-auto mt-4">
            <div class="card rounded shadow p-4">
              <form @submit.prevent="onSubmit">
                <vue-form-generator ref="campaignForm" :schema="schema" :model="this.model" :options="formOptions"></vue-form-generator>
              </form>
            <div class="form-check form-check-inline">
              <input class="form-check-input" type="checkbox" id="inlineCheckbox1" value="option1">
              <label class="form-check-label" for="inlineCheckbox1">1</label>
            </div>
            <div class="form-check form-check-inline">
              <input class="form-check-input" type="checkbox" id="inlineCheckbox2" value="option2">
              <label class="form-check-label" for="inlineCheckbox2">2</label>
            </div>
            </div>
            <div class="py-4 mb-4 justify-content-end">
              <button class="ml-3 btn btn-primary themed-button btn-sm text-right" @click="goToStepCampaign(2)">{{ $t('lang.button.next') }}</button>

            </div>
          </div>
        </div>
      </div>
      <div class="input-fields">
        <keep-alive>
          <YourAudience @goToStepCampaign="goToStepCampaign" 
            :model="model" 
            ref="parent" 
            v-if="activeStep == 2" 
            :activeStep="activeStep"  
            :total="formSteps.length" />
          <YourMessage 
            @goToStepCampaign="goToStepCampaign"
            :model="model" 
            ref="parent" 
            v-if="activeStep == 3" 
            :activeStep="activeStep"  
            :total="formSteps.length"/>
          <Tracking 
            @goToStepCampaign="goToStepCampaign" 
            :model="model" 
            ref="parent" 
            v-if="activeStep == 4" 
            :step="activeStep+1"  
            :total="formSteps.length"
            :currentUser="this.currentUser"/>
          <EmailsPerDay 
            @goToStepCampaign="goToStepCampaign" 
            :model="model" 
            ref="parent" 
            v-if="activeStep == 5" 
            :step="activeStep+1" 
            :total="formSteps.length"/>
          <Summary 
            @goToStepCampaign="goToStepCampaign" 
            :model="model" 
            ref="parent" 
            v-if="activeStep == 6" 
            :step="activeStep+1"  
            :total="formSteps.length"
            :currentUser="currentUser"/>
        </keep-alive>
      </div>
    </section>
  </main>
  </div>
</template>

<script>
import Vue from 'vue';
import { formattersMixin, campaignUtilsMixin} from "@/_mixins/";
  import Sidebar from '@/components/Sidebar';
  import HeaderTopBar from '@/components/HeaderTopBar.vue';
  import ToastNotifications from "@/components/ToastNotifications.vue";
  import Footer from "@/components/Footer.vue";
import VueFormGenerator from 'vue-form-generator';
import 'vue-form-generator/dist/vfg.css';


Vue.use(VueFormGenerator, {
  validators: {
    urlValidator: (value, field, model) => {

      let re = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+\/$/;

      if (!re.test(value)) {
        return ["Invalid URL"];
      } else {
        return []
      }
    },
  }
});

import Multiselect from 'vue-multiselect';

// if this component is not defined here, theres an error

Vue.component("multiselect", Multiselect);

import YourAudience from "@/components/AccountCreation/Steps/Campaign/YourAudience.vue";
import YourMessage from "@/components/AccountCreation/Steps/Campaign/YourMessage.vue";
import Budget from "@/components/AccountCreation/Steps/Campaign/Budget.vue";
import Tracking from "@/components/AccountCreation/Steps/Campaign/Tracking.vue";
import Summary from "@/components/AccountCreation/Steps/Campaign/Summary.vue";
import EmailsPerDay from "@/components/AccountCreation/Steps/Campaign/EmailsPerDay.vue";
import { campaignsService,regionsService } from "@/_services";
import { mapState, mapActions } from "vuex";


export default {
  components: {
    YourAudience,
    YourMessage,
    Budget,
    Tracking,
    Summary,
    EmailsPerDay,
    Sidebar,HeaderTopBar,
    ToastNotifications,
    Footer,
    "vue-form-generator": VueFormGenerator.component,
  },

  data() {
    return {
      activeStep: 1,
      animation: 'animate-in',
      formSteps: [],
      contactChoose: [],
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
            label: this.$t('lang.label.campaignname'),
            model: "campaign.name",
            readonly: false,
            featured: true,
            required: true,
            disabled: false,
            min: 5,
            max: 30,
            validator: VueFormGenerator.validators.string.locale({
              fieldIsRequired: this.$t('lang.label.required'),
              textTooSmall: this.$t("lang.validation.texttosmall", {min: "{1}"}),
            }),
          }, {
            type: "input",
            inputType: "hidden",
            model: "campaign.description",
            readonly: false,
            featured: true,
            disabled: false,
          }, {
            type: "input",
            inputType: "text",
            label: this.$t('lang.label.demourl'),
            model: "campaign.demo_url",
            readonly: false,
            featured: true,
            required: true,
            disabled: false,
            hint: this.$t('lang.label.inoliverprospectingcampaigns'),
            min: 5,
            styleClasses:'',
          },
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

  created() {
    
    this.$store.state.campaigns.modified = true
    this.$router.push({
      name: "step1"
    });
    this.getEmptyCampaign();
    this.getAllOptionsList();
  },
  computed: {
    ...mapState({
    isMenuCollapse: state => state.sidebar.isNavOpen,  
      loading: state => state.campaigns.loading,
      currentUser: state => state.authentication.user,
      model: state => state.campaigns.selected.data,
      availableTokens: state => state.optionsList.all['available_tokens'].data
    }),
  },

  methods: {

    ...mapActions("campaigns", {
      getEmptyCampaign: "getEmpty",
    }),

    ...mapActions("optionsList", {
      getAllOptionsList: "getAll",
    }),

    goToStepCampaign(active) {

      if(active == 2 && this.activeStep == 1){
        this.$refs.campaignForm.validate(); 
        if(this.$refs.campaignForm.errors.length > 0) {
          return;
        }
      }

      if(this.activeStep == 3 && active == 4){
        let result = this.createAllSteps();
        if(!result.status){
          this.$swal({
            type: "warning",
            title: this.$t('lang.label.missingdata'),
            text: result.cause,
            showCancelButton: false,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33a2c",
            confirmButtonText: this.$t('lang.button.yes')
          })
          return;
        }
      }
      this.animation = 'animate-out';
      setTimeout(() => {
        this.animation = 'animate-in';
        this.activeStep = active;
      }, 60);

      if(active != undefined){
        this.$router.push({
          name: "step" + active
        });
      }
    },

    goToStep(step) {
      this.$emit("goToStep", step);
    },

    createAllSteps(){
      if(this.model.campaign.is_tpl_first_step){
        for(var [key, value] of Object.entries(this.model.campaign.tpl_first_step)){
          if(value == ''){ 
            return {
              status: false,
              cause: this.$t('lang.label.thefield') + key + this.$t('lang.label.isrequired')
            }
          }
          if(key == 'final_message' && !this.checkAvailableTokens(value)){ 
            return {
              status: false,
              cause: this.$t('lang.label.invalidcontentforfinalmessage')
            }
          }
        }
        this.model.campaign_steps[0].subject = this.model.campaign.tpl_first_step.subject;
        this.model.campaign_steps[0].message = this.model.campaign.tpl_first_step.final_message;

        for(let i = 1; i < this.model.campaign_steps.length; i++){
          this.model.campaign_steps[i].subject = this.model.campaign.tpl_first_step.subject;
          
          if(this.selectedCampaignId != undefined){
            this.model.campaign_steps[i].message = 
              this.model.campaign_steps[i].message.replace(
                this.model.campaign.tpl_first_step_before.entrance,
                this.model.campaign.tpl_first_step.entrance
              ).replace(
                this.model.campaign.tpl_first_step_before.exit,
                this.model.campaign.tpl_first_step.exit
              );
          }else{
            this.model.campaign_steps[i].message = 
              this.model.campaign.tpl_first_step.entrance + 
              this.model.campaign_steps_default[i].message + 
              this.model.campaign.tpl_first_step.exit;
          }
        }
      }

      return {
        status: true
      }
    },
  }
}
</script>
<style>
.hidden{
  display: none !important;
}
</style>