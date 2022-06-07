<template>
  <div> 
   <LoadingSpinner  v-if="loadingSp" />
   <div v-if="!loadingSp">
    <section class="five-step-company">
      <div class="styles-steps pb-4">
        <div class="contenedor pt-2">
          <div class="row ">
            <div class="col-sm-12 ">
              <div class="">
                <h2 class="font-dark-blue my-3"></h2>
                 <div class="card ">
                <div class="p-4 card-title-article">
                  <h5>{{ $t('lang.label.parameters') }}</h5>
                  <ul>
                    <li class="my-2">
                      <span>{{ $t('lang.label.name') }} :</span>
                      <span class="ml-2">{{ this.model.campaign.name }}</span>
                    </li>
                    <li class="my-2">
                      <span>{{ $t('lang.label.') }} :</span>
                      <span class="ml-2">{{ this.model.campaign.demo_url}}</span>
                    </li>
                  </ul>
                  
                </div>
              </div>

            

                <div class="card mt-2">
                <div class="p-4 card-title-article">
                  <li class="my-2">
                      <h5>{{ $t('lang.label.audience') }}</h5>
                    <span>{{ $t('lang.label.target') }} : </span>
                    <div class="row mt-2 mb-2">
                      <div class="col-12">
                        <div id="target" class="wrapper-badges badges-collpase" >
                        <span v-for="(item, key) in model.categories_search_words_selected" class="badge mr-2 px-3" :class="statusBadge('theme')">{{item}}</span>
                        </div>
                        <button v-if="seeMoreTarget"  @click="showMore('target')" class=" btn btn-light btn-sm my-2">See more ...</button>
                      </div>
                    </div>

                <div class="row mt-2">
                  <div class="col-12">
                    <span>{{ $t('lang.label.location') }} : </span>
                    <div class="row mt-2 mb-2">
                      <div class="col-12">
                        <div id="location" class="wrapper-badges badges-collpase">
                          <span v-for="(item, key) in model.regions_selected" class="badge mr-2 px-3" :class="statusBadge('theme')">{{item}}</span>
                        </div>
                         <button v-if="seeMoreReg"  @click="showMore('location')" class=" btn btn-light btn-sm my-2">See more ...</button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div class="row">
                  <div class="col-12">
                    <span>{{ $t('lang.label.industry') }} : </span>
                    <div class="row mt-2">
                      <div class="col-12">
                        <div id="industry" class="wrapper-badges badges-collpase">
                          <span v-for="(item, key) in model.categories_google_selected" class="badge mr-2 px-3" :class="statusBadge('theme')">{{item}}</span>
                        </div>
                         <button v-if="seeMoreInd"   @click="showMore('industry')"  class=" btn btn-light btn-sm my-2">See more ...</button>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="row mt-2">
                  <div class="col-12">
                    <span>{{ $t('lang.label.companysize') }} : </span>
                    <div class="row mt-3 ml-1 mb-3">
                      <span v-for="(item, key) in model.company_size_selected" class="badge mr-2 px-3" :class="statusBadge('theme')">{{item}}</span>
                    </div>
                  </div>
                </div>

                <!--
                <div class="row mt-2">
                  <div class="col-12">
                    <span>{{ $t('lang.label.companytype') }} : </span>
                    <div class="row mt-3 ml-1 mb-3">
                      <span v-for="(item, key) in model.company_type_selected" class="badge mr-2 px-3" :class="statusBadge('theme')">{{item}}</span>
                    </div>
                  </div>
                </div> -->

                <!-- <h6 class="mt-4">{{ $t('lang.label.decisionmakers') }}</h6>
                <div class="row ">
                  <div class="col-12">
                    <span>{{ $t('lang.label.department') }} : </span>
                   
                    <span v-for="(item, key) in model.categories_search_words_selected" class="badge mr-2 px-3" :class="statusBadge('theme')">{{item}}</span>
                  </div>
                  <div class="col-8">
                    
                  </div>
                </div> -->
                    </li>
                </div>
              </div>
                <div class="card mt-2">
                <div class="p-4 card-title-article">
                  <h5>{{ $t('lang.label.sent') }}</h5>
                  <div class="d-flex align-items-end">
                    <span class="font-md dark-blue">{{ this.model.campaign.emails_per_day }} {{ $t('lang.label.contactsperday') }}</span>
                    <!-- <small class="ml-3">{{ this.model.campaign.emails_per_day }} nouveaux contacts par jour dans votre campagne </small> -->
                  </div>
                </div>
              </div>
              </div>
            </div>
          </div>
          <div class="row my-3">
            <div class="col-sm-12 col-md-12">
              <div class="card p-4">
                <h5>{{ $t('lang.label.message') }}</h5>
                <div class="tl-wrapper-messages">
                  <ul class="tl-messages">
                    <li class="pb-5" v-for="(step, key) in this.model.campaign_steps" >
                      <div class="tl-icon"><span class="">{{ step.step }}</span></div>
                      <div class="tmlabel ">
                        <h6>{{ step.subject }}</h6>
                        <p class="email-body">
                          {{ step.message }}
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            </div>
            
          
            
          
        </div>
      </div>
    </section>
    </div>
  </div>
</template>
<script>
import { statusBadgeMixin } from "@/_mixins/";
import { campaignsService } from "@/_services";
import { mapState, mapActions } from "vuex";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import moment from "moment";

export default {
   components: {
    LoadingSpinner
  },
  props: {
    model: Object,
    currentUser: Object
  },

  data() {
    return {
      loadingSp:false,
      seeMoreInd:false,
      seeMoreReg:false,
      seeMoreTarget:false,
      verifyingresult:false,
      verifying:false,
      verifyfirst:false,
      datePickerConfig: {
        format: "DD-MM-YYYY",
        useCurrent: false,
        minDate: moment().startOf("day"),
      },
      date: moment().format("DD-MM-YYYY"),
    }
  },

  mixins: [statusBadgeMixin],

  created() {
    this.initial();   
   
  },
  
  methods: {
    goToStepCampaign(step) {
      this.$emit("goToStepCampaign", step);
    },
     
      initial(){
        setTimeout(() => {
     
        this.showSeeMoreBtns()
      }, 2500)
      },
      destroyEvent(){
       window.onbeforeunload  = null;
    },

      
    // mayor a 70 para que muestre 3 lines 
    showSeeMoreBtns(){
      var industry = document.getElementById("industry");
      var reg = document.getElementById("location");
      var target = document.getElementById("target");
      if (industry.offsetHeight > 68){this.seeMoreInd = true}
      if (reg.offsetHeight > 68){this.seeMoreReg = true}
      if (target.offsetHeight > 68){this.seeMoreTarget = true}       
      
    },
    showMore(id){
      let elem = document.getElementById(id);
      elem.classList.toggle('badges-collpase');
    },
    cleanModel(){
      // if(this.model.regions_allowed.length > 0){
      //   if(this.model.regions_allowed[0].name == "All options"){
      //     this.model.regions_allowed = []
      //   }
      // }

      // if(this.model.param_5.length > 0){
      //   if(this.model.param_5[0].name == "All options"){
      //     this.model.param_5 = []
      //   }
      // }
      
      // if(this.model.categories_allowed && this.model.categories_allowed.length > 0){
      //   if(this.model.categories_allowed[0].label == "All options"){
      //     this.model.categories_allowed = []
      //   }
      // }

      // if(this.model.categories_search_words_allowed.length > 0){
      //   if(this.model.categories_search_words_allowed[0].name == "All options"){
      //     this.model.categories_search_words_allowed = []
      //   }
      // }
      return this.model;
    },
    verifyScript() {
      this.verifying = true;
      this.verifyfirst = true;
      campaignsService
        .verifyScript(this.model.campaign.demo_url)
        .then(
          (response) => {
            this.verifyingresult = response;
            this.verifying = false;
          }
        );
    },
    get(){
      return btoa(this.model.campaign.demo_url)
    },
    submitCampaign(){
      if(this.model.campaign.start_date == '' && this.$route.fullPath == '/campaigns/step6'){
        var dateString = this.date;
        var momentObj = moment(dateString, 'DD-MM-YYYY');
        var momentString = momentObj.format('YYYY-MM-DD');
        this.model.campaign.start_date = momentString;
      }
      this.$swal({
          type: "warning",
          title: this.$t('lang.label.save'),
          text: this.$t('lang.label.thisactiondoesnothaveanyincidenceoncampaignstatus'),
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33a2c",
          confirmButtonText: this.$t('lang.button.yes'),
          cancelButtonText: this.$t('lang.button.cancel')
        }).then(result => {
          if (result.value) {
             this.loadingSp =true;
             this.destroyEvent();
             if(this.model.campaign.id){
              this.loadingSp =false
                  this.$swal({
                    type: "success",
                    title: this.$t('lang.label.great'),
                    text: this.$t('lang.label.campaignwasupdatedsuccessfully'),
                    showConfirmButton: false,
                    timer: 2000
                  }).then( result => {
                  this.$parent.saved=1
                  this.$route.fullPath == '/createaccount/step6' ? this.$router.push('/settings-account')  : this.$router.push('/dashboard') });
             }else{
              campaignsService
              .update(this.cleanModel())
                .then(
                  (response) => {
                    this.loadingSp =false
                    this.$swal({
                      type: "success",
                      title: this.$t('lang.label.great'),
                      text: this.$t('lang.label.campaignwasupdatedsuccessfully'),
                      showConfirmButton: false,
                      timer: 2000
                    });
                  }
                ).then( result => {
                  this.$parent.saved=1
                  this.$route.fullPath == '/createaccount/step6' ? this.$router.push('/settings-account')  : this.$router.push('/dashboard') });
             }
    
          }
      });
    }
  }
}
</script>
<style>
.tl-messages .email-body{
white-space: pre-line !important;}
.wrapper-badges.badges-collpase{
  height: auto;
  max-height: 70px;
  overflow-y: hidden;
}
</style>
