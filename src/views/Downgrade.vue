<template>
  <section class="py-2">
  <div class="container">
    <div class="row">
      <div class="col-lg-6 offset-lg-3">
        <h1 class="dark-blue text-center">Unsubscribe</h1>    
      </div>
      <div class="col-lg-8 offset-lg-2">
        <div class="alert alert-warning text-center" role="alert">
            If you cancel your subscription, you and your sales team will lose access to the business opportunities listed in Oliver, prospects and contacts, scheduled emails, reports and all other information in your account.
          </div>
      </div>
    </div>
    <form @submit.prevent="validate">
    <div class="row">
      <div  class="col-lg-8 offset-lg-2" >
        <vue-form-generator ref="vfg" :schema="unsubscribe_schema" :model="this.model" :options="formOptions">
        </vue-form-generator>
      </div>
    </div>
    <div class="my-4 text-right mr-4">
      <button type="button" class="btn btn-primary themed-button btn-sm mr-1" @click="doToDashboard()">{{ $t('lang.label.bringmebacktomyaccount') }}</button>
      <button type="submit" class="btn btn-danger btn-sm" @click="validate()">{{ $t('lang.label.deletemyaccount') }}</button>
    </div>
  </form>
  </div>
</section>
</template>

<script>

import Vue from 'vue';
import { router } from "@/_helpers";
import { validators } from "vue-form-generator"; 
import { mapState, mapActions } from "vuex";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import { usersService , billingsService, subscriptionsService } from "@/_services";
import { lenguagesService } from "@/_services";
import i18n from '@/_helpers/i18n'
import VueFormGenerator from 'vue-form-generator';
import 'vue-form-generator/dist/vfg.css';
import AlertError from "@/components/AlertError.vue";
    
export default {
  data () {
    return {
      loading: true,
      unsubscribe_schema: {
          fields: [
            {
            type: "checklist",
            label: "Would you like to tell us the reasons why you are leaving us?",
            model: "reasons",
            listBox: true,
            featured: true,
            required: true,
            multiSelect: true,
            values: [
                "I have not been able to configure my account correctly",
                "Too complicated to use",
                "Too expensive",
                "Out of budget or in the process of reducing sail area",
                "I am not ready to use CRM software",
                "I didn't leave. I am using another account or I have created a new one.",
                "Missing functionality",
                "I didn't have the time",
                "I have not been able to convince others to use it.",
                "Coronavirus / Covid-19",
                "Completed Project",
                "I wanted a tool to do everything",
                "Closed company",
            ]  , 
            validator: validators.array
            },
            {
                type: "radios",
                label: "What are the chances of you coming back?",
                model: "chances_coming_back",
                featured: true,
                required: true,
                values: [
                    "1",
                    "2",
                    "3",
                    "4",
                    "5",
                    "6",
                    "7",
                    "8",
                    "9",
                    "10",
                ],
                validator: validators.required,
                styleClasses: "radio-inline"
            },
            {
                type: "textArea",
                label: "Is there anything else you would like to share about your experience with Oliver?",
                model: "oliver_experience",
                hint: "Max 500 characters",
                featured: true,
                max: 500,
                rows: 4,
            },
            {
                type: "checkbox",
                featured: true,
                required: true,
                label: "I understand that by continuing, I will lose access to my business opportunities, prospects, contacts, scheduled emails, dashboards, as well as the entire account history since the beginning of my subscription.",
                model: "confirmation",
                validator: validators.required
            }
          ]
        },
        formOptions: {
          validateAfterLoad: false,
          validateAfterChanged: true
        },
        model:{
          reasons:[],
          confirmed: false,
          chances_coming_back: "",
          oliver_experience: "",
        }
      }
    },

  components: {
    LoadingSpinner,
    AlertError,
    "vue-form-generator": VueFormGenerator.component,
  },

  computed: {
    ...mapState({
      headerTab: state => state.header.tab,
      plans: state => state.plans.all,
      activePlans: state => state.plans.allActives,
    })
  },

  created(){
    billingsService.getPendingPayments().then(
      response =>{
        if(response){
          router.push({
            name: "settings-account",
            query: { 
              billing: '1'
            } 
          });
        }
      });
  },

  methods: {
    ...mapActions("header", {
      changeHeaderTab: "changeTab"
    }),

    ...mapActions("plans", {
      getAllPlans: "getAll"
    }),

    doToDashboard(){
      this.$router.push('/');
    },
    validate(){
    let model = this.$refs.vfg.model;
    if(model.reasons.length == 0 || model.chances_coming_back == "" || !model.confirmation) {
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
        text: this.$t('lang.label.areyousureyouwanttodeleteyouraccount'),
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33a2c",
        confirmButtonText: this.$t('lang.button.yes'),
        cancelButtonText: this.$t('lang.button.cancel')
        }).then(result => {
          if (result.value) {
              billingsService.getPendingPayments().then(
                response => {
                  if(response){
                    this.$swal({
                    type: "error",
                    title: this.$t('lang.label.error'),
                    text: this.$t('lang.label.youhavependingpayments'),
                    showConfirmButton: true
                    });
                  }else{
                    subscriptionsService
                    .downgrade(this.$refs.vfg.model)
                    .then(
                        (response) => {
                        const { dispatch } = this.$store;
                        dispatch("authentication/refreshToken").then(
                          (response) => {
                            this.$router.push('/upgrade');
                          }  
                        )
                      }        
                    );
                  }
              });
          }
        });
    }

    }


  }
};

</script>

<style>

.field-checklist .wrapper {
	width: 100%;
}

/* Hover Effects on Card */

@media (min-width: 992px) {
  .pricing .card:hover {
    margin-top: -.25rem;
    margin-bottom: .25rem;
    box-shadow: 0 0.5rem 1rem 0 rgba(0, 0, 0, 0.3);
  }
  .pricing .card:hover .btn {
    opacity: 1;
  }
}

a.isDisabled {
  cursor: not-allowed;
  opacity: 0.5;
  text-decoration: none;
}

.radio-inline .radio-list{
  display: block;
  width: 100%;
}
.vue-form-generator .field-radios.radio-inline .radio-list label{
  display: inline-block;
  width: 10%;
}
.field-checkbox{
  position: relative
}
.field-checkbox label{
  margin-left: 40px;
}
.field-checkbox .field-wrap{
  position: absolute;
  top: 6px;
}
</style>