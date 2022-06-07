<template>
  <div>
  <!--Statistics-->
    <!-- <LoadingSpinner v-if="loading" /> -->
    <!-- <div class=" animated fadeIn faster" v-if="!loading"> -->
     

    <div v-if="this.$route.path !== '/dashboard'">
    <LoadingSpinner v-if="loadingContacts2" />  
    <div class=" pt-3 animated fadeIn faster" v-if="!loadingContacts2 && totalContacts2 > 0 ">
      <h5 class="title py-2" >{{ $t('lang.label.lastengagedcontacts') }}</h5>
      <div class="row mt-4"> 
        <div class="col-md-12">
            <div class="eff-blur" v-if="(currentUser.role_id === '2' && checkBilling === true)" @click="alertShowCampaign()"></div>
            <div class="effect-blur">     
            <div class="table-responsive opp">
              <table class="table table-hover min-width-table">
                <thead>
                  <tr>
                    <th style="white-space:nowrap;">{{ $t('lang.column.date') }}</th>
                    <th style="white-space:nowrap;">{{ $t('lang.label.step') }}</th>
                    <th></th>
                    <th style="white-space:nowrap;">{{ $t('lang.label.name') }}</th>
                    <th style="white-space:nowrap;">{{ $t('lang.label.email') }}</th>
                    <!--<th style="white-space:nowrap;">{{ $t('lang.label.department') }}</th>-->
                    <th style="white-space:nowrap;">{{ $t('lang.column.jobtitle') }}</th>
                    <th style="white-space:nowrap;">{{ $t('lang.label.company') }}</th>
                    <th style="white-space:nowrap;">{{ $t('lang.label.companysize') }}</th>
                    <th style="white-space:nowrap;">{{ $t('lang.label.city') }}</th>
                    
                    
                    <!--<th style="white-space:nowrap;">{{ $t('lang.label.activity') }}</th>
                    <th>{{ $t('lang.label.opportunity') }}</th>-->
                  </tr>
                </thead>
                <tbody>

                  <tr v-for="(contact) in this.contacts2.list" :key="contact.id">
                  <td  style="min-width: 150px;">{{ formatLastMailDate(contact.last_mail_date) }}</td>
                  <td><h6 style="min-width: 150px; color:#8580f2">{{ contact.campaign_step }}</h6></td>
                    <td class="right-align">
                      
                    </td>
                    <td style="white-space: nowrap; min-width: 250px;">
                      <div class="wrapper-img-person float-left mr-2" >
                        <img :src="getBusinessPhoto(contact.photo)" class="rounded-circle img-profile"  width="25" height="25"  alt="person image">
                      </div>
                      {{ contact.contact_name | formatContactName(contact.email) }}</td>
                    <td  style="white-space: nowrap;">{{ contact.email }}</td>
                    <!--<td style="max-width:200px">
                      <span class="badge" style="color:#5155ea">{{ contact.role.toUpperCase() }}</span>
                    </td>-->
                    <td style="min-width: 250px;">{{ contact.job }}</td>
                    <td style="min-width: 150px;">{{ contact.business_name }}</td>
                    <td style="min-width: 150px;">
                      <div class="badge" style="background-color:#5155ea; color:white">
                        <span v-if="contact.salariesmin == 0 || contact.salariesmin == null">0 -</span>
                        <span v-else>{{ contact.salariesmin }} - </span>
                        <span v-if="contact.salaries == 0 || contact.salaries == null">0</span>
                        <span v-else> {{ contact.salaries }}</span>
                      </div>
                    </td>
                    <td  style="min-width: 150px;">{{ contact.city }}</td>
                    
                    

                    <!--<td>
                      <div class="font-weight-bold" style="white-space: nowrap;">
                      <span v-if="contact.activity.open_total > 0" class="ml-1">
                        <span class="icon-eye ft-1-3 mr-1" style="color:#ffc107" />{{contact.activity.open_total}}
                      </span>
                      <span v-if="contact.activity.click_total > 0 " class="ml-1">
                        <span class="icon-one-finger-click ft-1-3 mr-1" style="color:#28a745" />{{contact.activity.click_total}}
                      </span>
                      <span v-if="contact.activity.email_response_total > 0" class="ml-1">
                        <span class="icon-mail ft-1-3 mr-1" style="color:#dc3545" />{{contact.activity.email_response_total}}
                      </span>
                      <span v-if="contact.activity.popup_total > 0" class="ml-1">
                        <span class="icon-calendar ft-1 mr-1" style="color:#3fcc91" />{{contact.activity.popup_total}}
                      </span>
                      </div>
                    </td>
                    <td style="vertical-align: baseline">
                      <a v-if="contact.link_id" :href="'/opportunities/'+contact.link_id" class="icon-search"> <i class="mdi mdi-eye"></i></a>
                    </td>-->
                  </tr>
                </tbody>
              </table>
            </div>
            </div>



            <div v-if="totalContacts2 > 0"  class="table-footer row mb-2 mt-2">
              <div class="col-12 text-left mb-3">
                <span
                class="font-weight-bold"
                >{{ $t('lang.label.showing') }} {{ firstInPage }} {{ $t('lang.label.to') }} {{ lastInPage }} {{ $t('lang.label.of') }} {{ totalContacts2 }} {{ $t('lang.label.actions') }}.</span>
              </div>
              <div class="col-md-9 col-8">
                <button
                  type="button"
                  class="btn btn-primary btn-sm themed-button btnNavTabla"
                  :disabled="isFirstPage"
                  @click="currentPage --"
                  >
                  <span class="icon-angle-double-left mr-2" />{{ $t('lang.button.previous') }}
                </button>
                <button
                  type="button"
                  class="btn btn-primary btn-sm themed-button ml-2 btnNavTabla"
                  :disabled="isLastPage"
                  @click="currentPage ++"
                  >
                  {{ $t('lang.button.next') }}
                  <span class="icon-angle-double-right ml-2" />
                </button>
              </div>

              <div class="col-3 dropdown text-right">
                <button
                  type="button"
                  class="btn btn-secondary btn-sm dropdown-toggle themed-button btnNavTabla"
                  id="dropdownCantPerPage"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                  data-offset="10,20">
                    <span>{{ cantPerPage }} {{ $t('lang.button.perpage') }}</span>
                </button>
                <div class="dropdown-menu" aria-labelledby="dropdownCantPerPage">
                  <a
                  class="dropdown-item cursor-pointer"
                  v-for="(optionCant, index) in cantPerPageOptions"
                  :key="index"
                  @click="cantPerPage = optionCant"
                  >{{ optionCant }} {{ $t('lang.button.perpage') }}</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      
    </div>

    <div class="w-100 text-center pt-5"  v-if="!loadingContacts2 && totalContacts2 == 0 ">

       <img src="@/assets/images/launch.png" class="">
          <div class="mt-3 text-center">
            <span
            class="font-weight-light ft-1-5 text-center text-secondary">
            {{ $t('lang.label.noemailssent') }}</span>
          </div>
          
    </div>
    </div>



     </div>
  </div>
</template>
<script>

import { statusBadgeMixin,statusPointMixin, formattersMixin } from "@/_mixins/";
import { mapState, mapActions } from "vuex";
import { router } from "@/_helpers";
import moment from "moment";
import Header from "@/components/Header.vue";
import LineChart from '@/components/Chart.vue';
import BubbleChart from '@/components/BubbleChart.vue';
import DoughnutChart from '@/components/DoughnutChart.vue';
import RadarChart from '@/components/RadarChart.vue';
import BarChart from '@/components/BarChart.vue';
import { businessContactService, opportunitiesService, usersService, campaignsService, regionsService, categoriesService } from "@/_services";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import CampaignStatistics from "@/components/Campaigns/CampaignStatistics.vue";
import MyCampaign from "@/components/Campaigns/MyCampaign.vue";
export default {
  data () {
    return {
      checkBilling:false,
      currentPage: 1,
      cantPerPage: 50,
      cantPerPageOptions: [5, 10, 20, 50, 100],
      selected:[],
      selectedSearch:[],
      selectedGoogle:[],
      searchFilter: "",
      day:'',
      date:'',
      datePickerConfig: {
        format: "YYYY-MM-DD",
        useCurrent: false,
        // minDate: moment().startOf("day")
        maxDate: moment().endOf("day"),
       
      },
      datePickerConfigEndDate: {
        format: "YYYY-MM-DD",
        useCurrent: false,
        maxDate: moment().endOf("day"),
      },

      range:{
        startDate:moment().subtract(7, 'days').format("YYYY-MM-DD"),
        endDate:moment().format("YYYY-MM-DD"),
      },
      
      
      
    }     
  },

  props:{
    selCampaignId: String,
    selectedCampaignName: String
  },
  
  components: { 
    BubbleChart,
    RadarChart,
    BarChart,
    DoughnutChart,
    LineChart,
    LoadingSpinner,
  },

  mixins: [statusBadgeMixin,statusPointMixin, formattersMixin],

  mounted(){
    // this.updatevalues();
  },
updated(){
    // if( this.currentUser.role_id === '2'){
    //       this.getDataUserBilling();
    // }
  },

  computed: {
    user() {
      return this.$store.state.authentication.user;
    },

    ...mapState({
      currentUser: state => state.authentication.user,
      stats: state => state.campaigns.stats.data,
      loadingContacts2: state => state.contacts.loading,
      contacts2: state => state.contacts.all2.data,
      headerTab: state => state.header.tab,
    }),

    isFirstPage() {
      return this.currentPage === 1;
    },

    isLastPage() {
      return this.currentPage === this.pageCount;
    },

    pageCount() {
      var cantPage = this.totalContacts2 / this.cantPerPage;
      var fixedCantPage = parseInt(cantPage.toFixed());
      if (cantPage > fixedCantPage) {
        return fixedCantPage + 1;
      } else {
        return fixedCantPage;
      }
    },

    firstInPage() {
      return (this.currentPage - 1) * this.cantPerPage + 1;
    },
    lastInPage() {
      if (
        this.contacts2.total >= this.firstInPage &&
        this.contacts2.total <= this.currentPage * this.cantPerPage
        ) {
        return this.contacts2.total;
      } else {
        return this.currentPage * this.cantPerPage;
      }
    },


    totalContacts2() {
      if (this.contacts2 !== undefined &&  this.contacts2.total !== undefined) {
        return this.contacts2.total;
      } else {
        return 0;
      }
    }

  },

  watch: {

    currentPage() {
      this.searchContacts2();
    },
    cantPerPage() {
      this.searchContacts2WithPageReset();
    }
  },

  created() {
    this.range.startDate = this.user.creation_date;
 
    this.getContacts2();
  },

  methods:{
    ...mapActions("header", {
      changeHeaderTab: "changeTab"
    }),

    ...mapActions("campaigns", {
      getCampaignStatsByIdAndRange: "getStatsByIdAndRange"
    }),

    ...mapActions("contacts", {
      getAll2Contacts: "getAll2"
    }),

    updatevalues(){
    var startDatePk = document.getElementById("startDatePicker");
    var endDatePk = document.getElementById("endDatePicker");
      startDatePk.addEventListener("change",function () {
       
       });

    },

    getDataUserBilling(){
      this.checkBilling= this.checkPaymentMethodAndBudget();
    },

    alertShowCampaign(){
      this.$swal({
        type: "warning",
        title: 'De nouvelles opportunités vous attendent !',
        text: 'De nouvelles opportunités ont été générées depuis la fin de votre essai. Félicitations! Pour les découvrir, complétez votre profil de facturation dans la section dédiée à cet effet.',
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33a2c",
        confirmButtonText: this.$t('lang.label.addpaymentmethod')
      }).then(result => {
        if (result.value) {
          this.$router.push('/settings-account');

        }
      });
    },

    getContacts2() {
      this.searchContacts2();
    },    
    getsessionrate() {
      return this.getPercentage(this.stats.activity.activity_total, this.stats.activity.emails_sent);
    },
    getanswerrate() {
      return this.getPercentage(this.stats.activity.email_response_total, this.stats.activity.emails_sent);
    },
    getopenrate() {
      return this.getPercentage(this.stats.activity.emails_opened, this.stats.activity.emails_sent);
    },
    getPercentage(fraction, total){
      if(total == 0){
        return "-%"
      }else{
        var result=(fraction/total)*100;
        result= (parseFloat(result).toFixed(0))
        return result+"%"
      }
    },

    searchContacts2() {


      if(this.selCampaignId != undefined){
        this.getAll2Contacts({
          currentPage: this.currentPage,
          cantPerPage: this.cantPerPage,
          searchFilter: this.searchFilter,
          campaignId: this.selCampaignId != undefined ? this.selCampaignId : 0,
        });
      }
    },

    searchContacts2WithPageReset() {
      this.getAll2Contacts({
        currentPage: this.currentPage,
        cantPerPage: this.cantPerPage,
        searchFilter: this.searchFilter,
        campaignId: this.selCampaignId != undefined ? this.selCampaignId : 0,
      }).then(result => (this.currentPage = 1));
    },

    validarDate(){ 
    let startDate = new Date(this.range.startDate);
    let endDate = new Date(this.range.endDate);
      if (startDate.getTime() > endDate.getTime()){
        return true
      }else{return false}
      
    },
    

    formatLastMailDate(date){
      return date.split(" ")[0];
    },

    loadRangeStats(){
      if(this.validarDate() === true){
          this.$swal({
          type: 'warning',
          title: 'Error!',
          text: 'Start date should be less than end date. ',
          showCancelButton: false,
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Close',
        });
      }else{
        this.getCampaignStatsByIdAndRange({
          id: this.selCampaignId != undefined ? this.selCampaignId : 0,
          startDate: this.range.startDate,
          endDate: this.range.endDate
        });
      }
    }
  },
  
};
</script>
<style>
.eff-blur{
  z-index: 20;
  position: absolute;
  display: block;
  width: 100%;
  height: 100%;

  left: 0;
  top: 0;
  right: 0;
  bottom: 0;

  filter: blur(3px);
  -webkit-filter: blur(3px);
  -moz-filter: blur(3px);
  -o-filter: blur(3px);
  -ms-filter: blur(3px);
}
.eff-blur + div.effect-blur .table-responsive {
  filter: blur(3px);
  -webkit-filter: blur(3px);
  -moz-filter: blur(3px);
  -o-filter: blur(3px);
  -ms-filter: blur(3px);
}
</style>