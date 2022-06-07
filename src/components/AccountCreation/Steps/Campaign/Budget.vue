<template>
  <div>
    <LoadingSpinner v-if="loading" />
    <section class="second-step-company" v-else>
      <div class="styles-steps pb-4">
        <div class="contenedor">
          <div class="row ">
            <div class="col-sm-12 col-md-8 ">
              <div class="mr-4">
                <h2 class="font-dark-blue mt-3">{{ $t('lang.label.defineyourbudget') }}</h2>
                <small>{{ $t('lang.label.selecttheoptionthatseemsthemostrelevantaccording') }}</small>
               <ul v-if=" this.$route.fullPath == '/createaccount/step5' || isFirstCampaign" class="my-4 createaccountfreetrial budget-options">
                    <li v-if="currentUser.role_id == '2'">
                      <div 
                      class="card shadow rounded-2 p-3 cursor-pointer my-3 selected">
                       <small class="font-weight-bold mb-2">{{ $t('lang.label.freetrialcredit') }}</small>
                      <div class="d-flex align-items-end">
                        <span class="font-lg dark-blue">{{dailyBudgetsDefaultFree * 10}} €</span>
                      </div>
                      <span class="mt-3">{{dailyBudgetsDefaultFree}} € / {{ $t('lang.label.day') }} / 10 {{ $t('lang.label.days') }}</span>
                    </div>
                  </li>
                  <li v-for="(budgetP, key) in dailyBudgetsPredefines" :key="key">
                      <div  
                      class="card shadow rounded-2 p-3 cursor-pointer my-3 disabled">
                      <div class="d-flex align-items-end">
                        <span class="font-lg dark-blue">{{ budgetP }} €</span>
                        <span class="ml-3">{{ $t('lang.label.averagedailybudget') }} : {{budgetP * 30}} €</span>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div 
                      class="card shadow rounded-2 p-3 cursor-pointer my-3 disabled">
                      <small class="font-weight-bold mb-2">{{ $t('lang.label.personnalisedbudget') }}</small>
                      <div class="d-flex align-items-end">
                        <div class="col-2 pl-0">
                        </div>
                        <span class="form-group">{{ $t('lang.label.averagedailybudget') }} : {{  this.model.campaign.daily_budget_custom * 30 }}€</span>
                      </div>
                    </div>
                  </li>
                </ul>

               <ul v-else-if="this.$route.fullPath !== '/campaigns/step5' && this.$route.fullPath !== '/createaccount/step5' && !hasPaymentcc" class="my-4 createaccountfreetrial budget-options">
                  <li v-for="(budgetP, key) in dailyBudgetsPredefines" :key="key">
                      <div  
                      class="card shadow rounded-2 p-3 my-3 disabled">
                      <div class="d-flex align-items-end">
                        <span class="font-lg dark-blue">{{ budgetP }} €</span>
                        <span class="ml-3">{{ $t('lang.label.averagedailybudget') }} : {{budgetP * 30}} €</span>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div 
                      class="card shadow rounded-2 p-3  my-3 disabled">
                      <small class="font-weight-bold mb-2">{{ $t('lang.label.personnalisedbudget') }}</small>
                      <div class="d-flex align-items-end">
                        <div class="col-2 pl-0">
                        </div>
                        <span class="form-group">{{ $t('lang.label.averagedailybudget') }} : {{  this.model.campaign.daily_budget_custom * 30 }}€</span>
                      </div>
                    </div>
                  </li>
                </ul>


                <ul v-else class="my-4 budget-options">
                  <li v-for="(budgetP, key) in dailyBudgetsPredefines" :key="key">
                      <div 
                      :class="{'selected': checkBudgetSelected(budgetP)}"
                      @click="selectBudget(budgetP)"
                      class="card shadow rounded-2 p-3 cursor-pointer my-3">
                      <div class="d-flex align-items-end">
                        <span class="col-4 pl-3 pr-0 font-lg dark-blue">{{ budgetP }} €</span>
                        <span class="ml-3">{{ $t('lang.label.averagedailybudget') }} : {{budgetP * 30}} €</span>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div 
                      :class="{'selected': checkBudgetSelected('custom')}"
                      @click="selectBudget('custom')"
                      class="card shadow rounded-2 p-3 cursor-pointer my-3">
                      <div class=" row d-flex align-items-end">
                        <div class="col-12 col-md-3">
                      <small class="font-weight-bold mb-2">{{ $t('lang.label.personnalisedbudget') }}</small>
                          <vue-form-generator ref="budgetForm" :schema="schemaBudget" :model="this.model" :options="formOptions">
                          </vue-form-generator>
                        </div>
                        <div class="col-12 col-md-8">                          
                        <span class="form-group">{{ $t('lang.label.averagedailybudget') }} : {{  this.model.campaign.daily_budget_custom * 30 }}€</span>
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
                <div class="d-flex justify-content-end">
                  <!-- <button class="ml-3 btn btn-primary themed-button text-right" @click="goToStepCampaign(3)">{{ $t('lang.button.back') }}</button>
                  <button class="ml-3 btn btn-primary themed-button text-right" @click="goToStepCampaign(5)" v-if="currentUser.role_id == '1'" >{{ $t('lang.button.next') }}</button>
                
                  <span v-else>
                    <button v-if="this.$route.fullPath == '/createaccount'" class="ml-3 btn btn-primary themed-button text-right" @click="goToStepCampaignbudgetfree(5)" >{{ $t('lang.button.next') }}</button>
                    <button class="ml-3 btn btn-primary themed-button text-right" @click="goToStepCampaign(5)" v-else >{{ $t('lang.button.next') }}</button>
                  </span> -->
                  <button class="ml-3 btn btn-primary themed-button btn-sm text-right" @click="goToStepCampaign(4)">{{ $t('lang.button.back') }}</button>

                  <button class="ml-3 btn btn-primary themed-button btn-sm text-right" @click="goToStepCampaign(6)" v-if="currentUser.role_id == '1'">{{ $t('lang.button.next') }}</button>

                 
                  <span v-else>
                    <span v-if="model.campaign.id == undefined">
                      <button v-if="this.$route.fullPath == '/createaccount'" class="ml-3 btn btn-primary themed-button btn-sm text-right" @click="goToStepCampaignbudgetfree(6)" >{{ $t('lang.button.next') }}</button>
                      <button class="ml-3 btn btn-primary themed-button btn-sm text-right" @click="goToStepCampaign(6)" v-else >{{ $t('lang.button.next') }}</button>
                    </span>
                    <span v-else>
                      <button v-if="this.$route.fullPath == '/createaccount'" class="ml-3 btn btn-primary themed-button btn-sm text-right" @click="goToStepCampaignbudgetfree(6)" >{{ $t('lang.button.saveAndContinue') }}</button>
                      <button class="ml-3 btn btn-primary themed-button btn-sm text-right" @click="goToStepCampaign(6)" v-else >{{ $t('lang.button.saveAndContinue') }}</button>
                    </span>
                  </span> 


                </div>
              </div>
            </div>
            <div class="col-sm-12 col-md-4 mt-4">
              <div class="card shadow mt-4">
                <div class="p-4 card shadow-title-article">
                  <h6>{{ $t('lang.label.howyourbudgetworks') }}</h6>
                </div>
                <div class="card shadow-body-article p-4">
                  <h6>{{ $t('lang.label.whatyoupay') }}</h6>
                  <p>{{ $t('lang.label.youonlypaywhenausershowsinterestforyouroffers') }}</p>
                </div>
                <div class="card shadow-body-article p-4">
                  <h6>{{ $t('lang.label.yourdailyaverage') }}</h6>
                  <p>{{ $t('lang.label.somedaysyoucanspendlessthanyourdailyaverage') }}</p>
                </div>
                <div class="card shadow-body-article p-4">
                  <h6>{{ $t('lang.label.ifyouchangeyourmind') }}</h6>
                  <p>{{ $t('lang.label.youcantrytobroadcastyourad') }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
import Vue from 'vue';

import VueFormGenerator from 'vue-form-generator';
import 'vue-form-generator/dist/vfg.css';

import Multiselect from 'vue-multiselect';
Vue.component("multiselect", Multiselect);

import LoadingSpinner from "@/components/LoadingSpinner.vue";
import { mapState, mapActions } from "vuex";
import { usersService, campaignsService } from "@/_services";
import { billingUtilsMixin } from "@/_mixins/";

export default {
  
  props: {
    model: Object,
  },
  mixins: [billingUtilsMixin],
  data() {
    return {
      loading: false,
      isFirstCampaign: false,
      hasPaymentcc:true,
      dailyBudgetsDefaultFree:5,
      dailyBudgetsPredefines: [15, 22, 42],
      schemaBudget: {
        fields: [{          
          type: "input",
          inputType: "number",
          label: "",
          model: "campaign.daily_budget_custom",
          readonly: false,
          featured: true,
          required: true,
          disabled: false,
          min: 5,
          max:500,
          validator: VueFormGenerator.validators.decimal,
          validator: VueFormGenerator.validators.number,
        }, {
          type: "input",
          inputType: "hidden",
          label: "",
          model: "campaign.daily_budget",
          readonly: false,
          featured: false,
          required: false,
          disabled: false,
          min: 5,
          max:500,
          styleClasses:'hidden',
          validator: VueFormGenerator.validators.decimal,
          validator: VueFormGenerator.validators.number,
        },
     ]},
      formOptions: {
        validateAfterLoad: false,
        validateAfterChanged: true
      },      
    }
  },

  created() {
    this.campaignBudget();
    if(!this.dailyBudgetsPredefines.includes(this.model.campaign.daily_budget)){
      this.model.campaign.daily_budget_custom = this.model.campaign.daily_budget;
        }
    this.currentUser.role_id == '2' ? this.hasPaymentDefault() : this.hasPaymentcc=true;
  },
  components: {
    LoadingSpinner,
  },
  computed: {
    ...mapState({
      currentUser: state => state.authentication.user
    }),
  },

  methods: {
    goToStepCampaignbudgetfree(step){
       this.model.campaign.daily_budget =  this.dailyBudgetsDefaultFree;
       if(this.model.campaign.id){
            if(
                  (this.activeStep == 1 && step == 2) ||
                  (this.activeStep == 2 && step == 5) ||
                  (this.activeStep == 5 && step == 3) ||
                  (this.activeStep == 3 && step == 4) ||
                  (this.activeStep == 4 && step == 6)
            ){
                this.model.step = this.activeStep;
                campaignsService.update(this.model);
            }
        }
       this.$emit("goToStepCampaign", step);
    },
    
    goToStepCampaign(step) {
        if(!this.dailyBudgetsPredefines.includes(this.model.campaign.daily_budget)){
        this.model.campaign.daily_budget = this.model.campaign.daily_budget_custom;
      }
      if( this.$route.fullPath == '/createaccount/step5' || this.isFirstCampaign ){
        this.model.campaign.daily_budget = this.dailyBudgetsDefaultFree;
      }
      if(this.model.campaign.daily_budget === 0 || this.model.campaign.daily_budget === '' || this.model.campaign.daily_budget > 500 ){
        this.$refs.budgetForm.validate(); 
        return;
      }
      if(this.model.campaign.id){
            if(
                  (this.activeStep == 1 && step == 2) ||
                  (this.activeStep == 2 && step == 5) ||
                  (this.activeStep == 5 && step == 3) ||
                  (this.activeStep == 3 && step == 4) ||
                  (this.activeStep == 4 && step == 6)

            ){
                this.model.step = this.activeStep;
                campaignsService.update(this.model);
            }
      }
      this.$emit("goToStepCampaign", step);
    },
    selectBudget(item){
        if(item === 'custom'){
          this.model.campaign.daily_budget = 0;
        }else{
          this.model.campaign.daily_budget = item;
          this.model.campaign.daily_budget_custom = '';
        }
    },
    checkBudgetSelected(budget){
      if(budget === 'custom' && !this.dailyBudgetsPredefines.includes(this.model.campaign.daily_budget)){
        return true;
      }
      if(this.model.campaign.daily_budget === budget){
        return true;
      }
      return false;
    },

    hasPaymentDefault(){
      this.hasPaymentcc = this.hasPaymentMethodCC();
    },
    campaignBudget(){
      this.loading = true;
      campaignsService.getAll(1,15,"","","","","").then(
        result => {
            if(!result){
                this.isFirstCampaign = true;
            }
            this.loading = false;
     });
    }

  }
}
</script>
<style>
ul.createaccountfreetrial.budget-options .card:hover.disabled{
border: 1px solid rgba(0,0,0,.125);
background-color: #E2E3E9;
}
ul.createaccountfreetrial.budget-options .card.disabled{
background-color: #E2E3E9;
color:#B0B0BD;
}
</style>
