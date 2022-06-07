<template>
<div class="card no-border">
	<LoadingSpinner v-if="loading" />
	<div  v-if="!loading">
	  <line-chart :key="keylinkechart" :width="300" :height="100"  :chart-data="multiaxis" :options="multiaxis.options" />
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
import CampaignStatistics from "@/components/Campaigns/CampaignStatistics.vue";
import MyCampaign from "@/components/Campaigns/MyCampaign.vue";
export default {
  data () {
    return {
      keylinkechart:122,
      loading:true,
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

          
      
      multiaxis: {
        labels:[],
        datasets: [{
          type: 'bar',
          label: this.$t('lang.label.treated'),
          hidden: false,
          borderColor: 'RGB(173,198,244,1)',
          backgroundColor: 'RGBA(173,198,244,0.50)',
          pointBackgroundColor: "rgba(220,220,220,1)",
          data: []
        },
          {
          type: 'bar',
          label: this.$t('lang.label.tobetreated'),
          hidden: false,
          borderColor: 'rgba(255,255,255,1)',
          backgroundColor: 'RGBA(82,110,118,0.48)',
          pointBackgroundColor: "rgba(220,220,220,1)",
          data: []
        }],
        options: {
          responsive: true,
          title: {
            display: true,
            text: this.title
          },
          scales: {
            xAxes: [{
              stacked: true,
              categoryPercentage: 0.5,
              barPercentage: 1
            }],
            yAxes: [{
              stacked: true,
            }]
          }
        },
      },
      
    }     
  },

  props:{
    method: String,
    range: Object,
    title: String
  },
  
  components: { 
    BubbleChart,
    RadarChart,
    BarChart,
    DoughnutChart,
    LineChart,
    LoadingSpinner,
  },

  mixins: [statusBadgeMixin,statusPointMixin],

 
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

 
  created() {
    

    this.loadaxis()

  },

  methods:{
  
     getRandomRgb() {
      var num = Math.round(0xffffff * Math.random());
      var r = num >> 16;
      var g = num >> 8 & 255;
      var b = num & 255;
      return r + ', ' + g + ', ' + b;
    },

    loadaxis(){
      this.loading = true
        monitorService.getMonitorUser(this.currentUser.id,this.method,this.range).then(result2 => {
            this.multiaxis.labels = []
            if(this.method == 'taggedgroup'){
              result2.forEach((row,key) => {
                  if(Array.isArray(row)){
                    var r = row
                  }else{
                    var r = Object.entries(row)
                  }

                  r.forEach((a,index) => {
                    if(a[0] !==  undefined){
                      a = a[1]
                    }
                    if(this.multiaxis.labels.indexOf(a.date) < 0){
                      this.multiaxis.labels.push(a.date);
                    }
                    if(this.multiaxis.datasets[index] === undefined){
                       var rgbcolor = this.getRandomRgb()
                        this.multiaxis.datasets[index] = {
                                type: 'bar',
                                label: a.name,
                                hidden: false,
                                borderColor: 'RGB('+ rgbcolor+',1)',
                                backgroundColor: 'RGBA('+ rgbcolor+',0.50)',
                                pointBackgroundColor: "rgba('+ rgbcolor+',1)",
                                data: []
                              }
                    }

                    this.multiaxis.datasets[index].data.push(a.cant)
                    this.multiaxis.datasets[index].label = a.name
                  })
              })
              console.log(this.multiaxis.datasets)

            }else{
              result2.forEach((row,key) => {
                this.multiaxis.labels[key] = row.hour;
                this.multiaxis.datasets[0].data[key] = row.done
                this.multiaxis.datasets[1].data[key] = row.pending
              })
            }
        }).finally(() => {
              this.keylinkechart++
              this.loading=false
          });
    },

 
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