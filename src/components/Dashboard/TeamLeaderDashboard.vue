<template>
  <div>
    <div class=" animated fadeIn faster" >
      <div class="row">
          <div class="col-md-4">
            <date-picker
            id="startDatePicker"
              class=""
              v-model="range.startDate"
              :config="datePickerConfig"
              placeholder="Start Date"
            ></date-picker>
          </div>
           <div class="col-md-4">
            <date-picker
             id="endDatePicker"
              class=""
               v-model="range.endDate"
              :config="datePickerConfigEndDate"
              placeholder="End Date"
            ></date-picker>
          </div>
          <div class="col-12 col-md-3">
            <button class=" btn btn-success" @click="loadRangeStats()" style="width:100%">
            <i class="icon-calendar-check-o mr-2"></i> 
            <small>
            {{ $t('lang.button.filter') }}
            </small>
            </button>
          </div>
      </div>


      <span
        v-for="chart in chartInfo"
            type="button"
            class="p-0 it-tabs pb-2 mx-2 mt-4"
            :class="loadChart.indexOf(chart.name) >= 0 ? 'active border-primary':''"
            @click="loadMoreChart(chart.name)"
          >{{ chart.title }}</span>



      <div v-for="chart in chartInfo" 
       class="row mt-3" v-if="loadChart.indexOf(chart.name) >= 0">
        <div class="col-md-12">
          <MonitorBarChart :title="chart.title" :key="chart2" :range="range" :method="chart.name"/>
        </div>
      </div>



    
  </div>

  </div>
</template>
<script>

import { statusBadgeMixin,statusPointMixin } from "@/_mixins/";
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
import { monitorService } from "@/_services";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import MonitorBarChart from "@/components/Dashboard/Monitor/Barchart.vue";
import CampaignStatistics from "@/components/Campaigns/CampaignStatistics.vue";
import MyCampaign from "@/components/Campaigns/MyCampaign.vue";
export default {
  data () {
    return {
      checkBilling:false,
      currentPage: 1,
      cantPerPage: 50,
      chart1:100,
      chart2:200,
      loadChart:['taggedgroup'],
      chart3:300,
      cantPerPageOptions: [5, 10, 20, 50, 100],
      selected:[],
      selectedSearch:[],
      selectedGoogle:[],
      searchFilter: "",
      day:'',
      date:'',
      chartInfo:[
        {
          name: 'taggedgroup',
          title: 'Group Tags'
        },        {
          name: 'taskshour',
          title: this.$t('lang.label.tasks')
        },
        {
          name: 'taskshouranswer',
          title: 'Email answer'
        },
        {
          name: 'taskshourcall',
          title: 'Calls'
        },
        {
          name: 'tagged',
          title: 'Tags'
        }
      ],
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
    MonitorBarChart
  },

  mixins: [statusBadgeMixin,statusPointMixin],

  mounted(){
    if(this.model !== undefined && this.model.campaign_status_id == 3){
      this.range.endDate = this.model.campaign_status_date;
    }
  },
updated(){
  },

  computed: {
    user() {
      return this.$store.state.authentication.user;
    },

    ...mapState({
      currentUser: state => state.authentication.user,
      stats: state => state.campaigns.stats.data,
      model: state => state.campaigns.selected.data,
      loadingContacts2: state => state.contacts.loading,
      contacts2: state => state.contacts.all2.data,
      headerTab: state => state.header.tab,
    }),

 

  },

  watch: {
   

  },

  created() {
    

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
    loadMoreChart(type){
      this.loadChart = []
      this.loadChart.push(type)
    },
    loadaxis(){
      this.chart1++
      this.chart2++
      this.chart3++
    },



    getStatus(){

      if(this.model.campaign_status_id == 2)
        return "Active"

      if(this.model.campaign_status_id == 1)
        return "Pending"

      if(this.model.campaign_status_id == 3)
        return "Stopped"
        

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
      // this.searchContacts2();
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
    getbouncerate() {
      return this.getPercentage(this.stats.activity.bounce_total, this.stats.activity.emails_sent);
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
         this.loadaxis()
      }
    }
  },
  
};
</script>
<style>

.status-colors.positive {
  color: #61DE4D;
}
.status-colors.paused {
  color: #BABAC2;
}
.status-colors.stopped {
  color: #FF6584;
}
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