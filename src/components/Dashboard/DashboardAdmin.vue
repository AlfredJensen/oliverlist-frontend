<template>
	<div class="contenedor">
    <div class="row">
      <div class="col-12" >
       <div class="row mb-2">
        <div class="col-12" >
        <span
            :class="
              tab == 2
                ? 'active border-bottom-3 border-primary'
                : ''
            "
            class="p-0 cursor-pointer it-tabs pb-2 mr-3 bg-transparent"
          
            @click="changeThisTab(2)"
          >
            Agency Statistics
          </span>
        <span
            :class="
              tab == 1
                ? 'active border-bottom-3 border-primary'
                : ''
            "
            class="p-0 cursor-pointer it-tabs pb-2 mr-3 bg-transparent"
          
            @click="changeThisTab(1)"
          >
            Activity
          </span>
       </div>
       </div>
       <div class="row" v-if="tab == 1">
        <div class="col-md-3">
          <date-picker
          id="startDatePicker"
            class=""
            v-model="range.startDate"
            :config="datePickerConfig"
            placeholder="Start Date"
          ></date-picker>
        </div>
         <div class="col-md-3">
          <date-picker
           id="endDatePicker"
            class=""
             v-model="range.endDate"
            :config="datePickerConfigEndDate"
            placeholder="End Date"
          ></date-picker>
        </div>
        <div class="col-md-3">
          <select v-model="client" class="form-control">
            <option v-for="team in groups" :value="team.id">{{team.name}}</option>
          </select>
        </div>
        </div>
        <div class="row" v-if="tab == 1">
        <div class="col-md-12 my-2">
          <input  v-model="filters.sent" value="true" class="mx-1" type="checkbox" id="flexSwitchCheckDefault">
            <small class="form-check-label" for="flexSwitchCheckDefault">Sent, Bounces</small>
          </input>
          <input  v-model="filters.opened" value="true" class="mx-1" type="checkbox" id="flexSwitchCheckDefault2">
            <small class="form-check-label" for="flexSwitchCheckDefault2">Opened</small>
          </input>
          <input  v-model="filters.sessions" value="true" class="mx-1" type="checkbox" id="flexSwitchCheckDefault3">
            <small class="form-check-label" for="flexSwitchCheckDefault3">Sessions</small>
          </input>
          <input  v-model="filters.answers" value="true" class="mx-1" type="checkbox" id="flexSwitchCheckDefault4">
            <small class="form-check-label" for="flexSwitchCheckDefault4">Answers</small>
          </input>
          <input  v-model="filters.meetings" value="true" class="mx-1" type="checkbox" id="flexSwitchCheckDefault6">
            <small class="form-check-label" for="flexSwitchCheckDefault6">Meetings</small>
          </input>
          <input  v-model="filters.money" value="true" class="mx-1" type="checkbox" id="flexSwitchCheckDefault6">
            <small class="form-check-label" for="flexSwitchCheckDefault6">€€€</small>
          </input>

        </div>
        </div>

        <div  v-if="tab == 1">
          <button class=" btn btn-success my-2" @click="loadRangeStats()">
          <i class="icon-calendar-check-o mr-2"></i> 
          <small>
          Chart
          </small>
          </button>
        </div>

        <div class="mt-3"  v-if="tab == 1 && openchart">
          <button class="btn btn-outline-primary" :class="timechart == 'day' ? 'active' : ''"
          @click="changeChart('day')"> 
          <small>
          Days
          </small>
          </button>
          <button class="btn btn-outline-primary ml-2" :class="timechart == 'week' ? 'active' : ''"
          @click="changeChart('week')"> 
          <small>
          Weeks
          </small>
          </button>
          <button class="btn btn-outline-primary ml-2" :class="timechart == 'month' ? 'active' : ''"
          @click="changeChart('month')"> 
          <small>
          Months
          </small>
          </button>
           <LoadingSpinner v-if="loadingStats" />
          
          <div  v-if="!loadingStats">
           <div class="row">
          <div class="col-12">
            <line-chart
             :class="timechart == 'day' ? 'd-block':'d-none'"
               :width="300" :height="400"  :chart-data="groupedmeetigns" :options="groupedmeetigns.options" />

            <line-chart
            v-if="timechart == 'week'"
               :width="300" :height="400"  :chart-data="groupedmeetignsweek" :options="groupedmeetignsweek.options" />

            <line-chart
            v-if="timechart == 'month'"
               :width="300" :height="400"  :chart-data="groupedmeetignsmonth" :options="groupedmeetignsmonth.options" />
            </div>
            </div>

            <line-chart
            :class="timechart == 'week' ? 'd-block':'d-none'"
              v-if="multiaxisweek.datasets.length > 0" :width="300" :height="100"  :chart-data="multiaxisweek" :options="multiaxisweek.options" />
            <line-chart 
            :class="timechart == 'day' ? 'd-block':'d-none'"
            v-if="multiaxis.datasets.length > 0" :width="300" :height="100"  :chart-data="multiaxis" :options="multiaxis.options" />
            <line-chart 
            :class="timechart == 'month' ? 'd-block':'d-none'"
            v-if="multiaxismonth.datasets.length > 0" :width="300" :height="100"  :chart-data="multiaxismonth" :options="multiaxismonth.options" />
          </div>
        </div>

     <div  v-if="tab == 1">
      <button class=" btn btn-success mt-2" @click="loadAgencyStats()">
      <i class="icon-list mr-2"></i> 
      <small>
      List
      </small>
      </button>
    </div>
        <div class="card no-border mt-3"  v-if="tab == 1">
       
         
          <table class="mt-2 ml-2"  v-if="openlist">
            <thead>
              <tr>
              <td>Client</td>
              <td>Campaign</td>
              <td>Creation Date</td>
              <td>Event Date</td>
              <td>Status</td>
              <td>Business</td>
              </tr>
            </thead>
            <tr v-for="event in meetings_details">
                <td>{{event.client_name}}</td>
                <td>{{event.name}} 
                <i class="icon-calendar text-primary cursor-pointer" 
                v-if="calendlyid != event.remark" @click="calendlyid = event.remark"></i> 
                <CalendlyEvent :id="event.remark" 
                v-if="calendlyid == event.remark"></CalendlyEvent>
                </td>
                <td><strong>{{event.fdate}}</strong></td>
                <td><strong>{{event.event_date}}</strong></td>
                <td><strong v-if="event.status == null">Valid</strong>
                <strong v-if="event.status == 34">Cancelled</strong>
                <strong v-if="event.status == 24">Valid</strong>
                <strong v-if="event.status == 35">Absent</strong></td>
                <td><strong><a
                         class="text-primary ml-2 ml-2"
                         target="_blank"
                         :href="'/opportunities/'+event.link_id"
                       >{{event.business_name}}</a></strong></td>
            </tr>
          </table>
        </div>
       
      </div>
    </div>
    <div v-for="team in teamgroups" class="row"  v-if="tab == 2">
      <div  class="card w-100  p-2 my-3">
        <TableMonitor :team_id="team.id"></TableMonitor>
      </div>
    </div>
     
   
     <div class="text-center" v-if="tab == 2">   
      <h3 @click="getMoreTeam()"   class="icon-plus-circle cursor-pointer text-primary"></h3> 
     </div>

		<div class="row" v-if="false">
		<div class="col-md-6">
		<h3>Active Campaigns</h3>
		<div class="scrollable">
			<div class="row m-2 border " v-for="(campaign, key) in activecampaigns">
				<div class="col-6">
				<li>Campaign Name: {{campaign.name}}</li>
				<li>Client: {{campaign.clientname}}</li>
				</div>
				<div class="col-6">


				</div> 
			</div>
	     </div>
	     </div>

		<div class="col-md-6">
		<h3>Last Users</h3>
		<div class="card scrollable">

			<Table 
			v-if="lastusers.length > 0"
			:key="keytable"
	      :headers="headers"
	      :cols="cols"
	      :data="lastusers"
	      :checkbox="false"
	      :model="model"
	      >
	      </Table>
	     </div>
	     </div>

		<div class="col-md-12 mt-3">
		<h3>Gmaps Imports</h3>
		<button class="btn btn-sm btn-primary" @click="refreshgmail()">
		<i class="icon-refresh"></i>
		</button>
		<div class="card scrollable p-2">
			<Table 
			v-if="gmaillist.length > 0 && !loadinggmail"
			:key="keygmail"
	      :headers="headers3"
	      :cols="cols3"
	      :data="gmaillist"
	      :checkbox="false"
	      :model="model"
	      >
	      </Table>
	       <span 
		      v-if="loadinggmail"
		        class="loadingres mr-2 ml-2 spinner-border loading-spinner" 
		      ></span>
	     </div>
	     </div>

	     	<div class="col-md-12 mt-3">
		<h3>Linkedin Imports</h3>
		<button class="btn btn-sm btn-primary" @click="refreshlinkedin()">
		<i class="icon-refresh"></i>
		</button>
		<div class="card scrollable p-2">
			<Table 
			v-if="linkedinlist.length > 0 && !loadinglinkedin"
			:key="keygmail"
	      :headers="headers4"
	      :cols="cols4"
	      :data="linkedinlist"
	      :checkbox="false"
	      :model="model"
	      >
	      </Table>
	       <span 
		      v-if="loadinglinkedin"
		        class="loadingres mr-2 ml-2 spinner-border loading-spinner" 
		      ></span>
	     </div>
	     </div>


	     </div>

	</div>
</template>
<script>
import {
  statusBadgeMixin,
  statusPointMixin,
  statusFeedNotificationsMixin,
  formattersMixin,
} from "@/_mixins/";
import Table from "@/components/Common/Table.vue";

import TableMonitor from "@/components/Dashboard/Monitor/Table.vue";
import ContactsAvailable from "@/components/Campaigns/ContactsAvailable.vue";
import CalendlyEvent from "@/components/Common/CalendlyEvent.vue";
import { mapState, mapActions } from "vuex";
import { router } from "@/_helpers";
import moment from "moment";
import LineChart from "@/components/Chart.vue";
import Tutorial from "@/components/Tutorial.vue";
import { adminService,clientsService,monitorService,campaignsService } from "@/_services";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import DashboardStatistics from "@/components/Campaigns/DashboardStatistics.vue";

export default {
  data() {
    return {
      openlist:false,
      client:false,
      filters: {
          'meetings':true,
          'sent':false,
          'opened':false,
          'sessions':false,
          'answers':false,
          'bounces':false,
          'money':false
      },
      openchart:false,
      meetings_details:[],
      tab:2,
      timechart:'day',
      calendlyid:0,
     	lastusers:[],
     	cols:[],
      groups:[],
      teamgroups:[],
      cantgroups:2,
     	headers:[],
     	cols3:[],
     	headers3:[],
     	cols4:[],
     	headers4:[],
     	gmaillist:[],
     	keytable:100,
     	activecampaigns:[],
     	model:{},
     	keygmail:200,
     	loadinggmail:false,
     	keylinkedin:200,
     	loadinglinkedin:false,
     	linkedinlist:[], 
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
        startDate:moment().subtract(1, 'days').format("YYYY-MM-DD"),
        endDate:moment().format("YYYY-MM-DD"),
      },
      groupedmeetignsmonth:{
        labels: [],
        datasets: [
          {
          type: 'bar',
            label: 'Data One',
            backgroundColor: '#52BE80',
            data: []
          },
          {
          type: 'bar',
            label: 'Data Two',
            backgroundColor: '#dc3545',
            data: []
          },
           {
           type: 'bar',
            label: 'Data Three',
            backgroundColor: '#ffc107',
            data: []
          }
        ],
        options: {
          responsive: true, 
          maintainAspectRatio: false,
          scales: {
            xAxes: [{
              stacked: true,
              categoryPercentage: 0.5,
              barPercentage: 1,
              time: {
                unit: "month",
                displayFormats: {
                   month: 'M YYYY'
                },
              },
            }],
            yAxes: [{
                type: 'linear',
                stacked: true,
                id: 'y2',
                min:0,
                max: 100,
                position: 'left',
                display: true,
               ticks: {
                  beginAtZero: true,
                  stepSize: 10,
                  min:0,
                  max:100
                },
              }],
          }
        },
      },
      groupedmeetignsweek:{
        labels: [],
        datasets: [
          {
          type: 'bar',
            label: 'Data One',
            backgroundColor: '#52BE80',
            data: []
          },
          {
          type: 'bar',
            label: 'Data Two',
            backgroundColor: '#dc3545',
            data: []
          },
           {
           type: 'bar',
            label: 'Data Three',
            backgroundColor: '#ffc107',
            data: []
          }
        ],
        options: {
          responsive: true, 
          maintainAspectRatio: false,
          scales: {
            xAxes: [{
              stacked: true,
              categoryPercentage: 0.5,
              barPercentage: 1,
              time: {
                unit: "week",
                displayFormats: {
                   week: 'W YYYY'
                },
              },
            }],
            yAxes: [{
                type: 'linear',
                stacked: true,
                id: 'y2',
                min:0,
                max: 100,
                position: 'left',
                display: true,
               ticks: {
                  beginAtZero: true,
                  stepSize: 10,
                  min:0,
                  max:100
                },
              }],
          }
        },
      },
      groupedmeetigns:{
        labels: [],
        datasets: [
          {
          type: 'bar',
            label: 'Data One',
            backgroundColor: '#52BE80',
            data: []
          },
          {
          type: 'bar',
            label: 'Data Two',
            backgroundColor: '#dc3545',
            data: []
          },
           {
           type: 'bar',
            label: 'Data Three',
            backgroundColor: '#ffc107',
            data: []
          }
        ],
        options: {
          responsive: true, 
          maintainAspectRatio: false,
          scales: {
            xAxes: [{
              stacked: true,
              categoryPercentage: 0.5,
              barPercentage: 1,
              time: {
                unit: "day"
              },
            }],
            yAxes: [{
                type: 'linear',
                stacked: true,
                id: 'y2',
                min:0,
                max: 100,
                position: 'left',
                display: true,
                ticks: {
                  beginAtZero: true,
                  stepSize: 10,
                  min:0,
                  max:100
                },
              }],
          }
        },
      },
      multiaxismonth: {
        labels:[],
        datasets: [{
          type: 'bar',
          label: 'Meetings',
          borderColor: 'RGB(133,43,242,1)',
          backgroundColor: 'RGBA(133,43,242,0.51)',
          pointBackgroundColor: "rgba(220,220,220,1)",
          yAxisID: 'y2',
          data: []
        }],
        options: {
          responsive: true,
          title: {
            display: true,
            text: this.$t('lang.label.activity')
          }, 
          scales: {
            yAxes: [{
              type: 'linear',
              id: 'y1',
              position: 'right',
              display: true,
              gridLines: {
                drawOnChartArea: false,
              },
              ticks: {
                beginAtZero: true
              },
            }, {
              type: 'linear',
              id: 'y2',
              position: 'left',
              display: true,
              ticks: {
                beginAtZero: true,
              },
            }],
            xAxes: [{
              type: "time",
              time: {
                unit: "month"
              },
              stacked: false,
              offset: true,
              gridLines: {
                display: false,
              },
              
            }],
          }
        },
      },
      multiaxisweek: {
        labels:[],
        datasets: [{
          type: 'bar',
          label: 'Meetings',
          borderColor: 'RGB(122,43,242,1)',
          backgroundColor: 'RGBA(133,23,242,0.51)',
          pointBackgroundColor: "rgba(110,220,220,1)",
          yAxisID: 'y2',
          data: []
        }],
        options: {
          responsive: true,
          title: {
            display: true,
            text: this.$t('lang.label.activity')
          }, 
          scales: {
            yAxes: [{
              type: 'linear',
              id: 'y1',
              position: 'right',
              display: true,
              gridLines: {
                drawOnChartArea: false,
              },
              ticks: {
                beginAtZero: true
              },
            }, {
              type: 'linear',
              id: 'y2',
              position: 'left',
              display: true,
              ticks: {
                beginAtZero: true,
              },
            }],
            xAxes: [{
              type: "time",
              time: {
                unit: "week",
                displayFormats: {
                   week: 'W YYYY'
                },
              },
              offset: true,
              gridLines: {
                display: true,
              },
              
            }],
          }
        },
      },
      multiaxis: {
        labels:[],
        datasets: [],
        options: {
          responsive: true,
          title: {
            display: true,
            text: this.$t('lang.label.activity')
          }, 
          scales: {
            yAxes: [{
              type: 'linear',
              id: 'y1',
              position: 'right',
              display: true,
              gridLines: {
                drawOnChartArea: false,
              },
              ticks: {
                beginAtZero: true
              },
            }, {
              type: 'linear',
              id: 'y2',
              position: 'left',
              display: true,
              ticks: {
                beginAtZero: true,
              },
            }],
            xAxes: [{
              type: "time",
              time: {
                unit: "day"
              },
              stacked: false,
              offset: true,
              gridLines: {
                display: false,
              },
              
            }],
          }
        },
      },
    };
  },
  components: {
    LineChart,
    LoadingSpinner,
    DashboardStatistics,
    ContactsAvailable,
    Tutorial,
    Table,
    TableMonitor,
    CalendlyEvent
  },

  mixins: [statusBadgeMixin, statusPointMixin, statusFeedNotificationsMixin, formattersMixin],

  computed: {
    user() {
      return this.$store.state.authentication.user;
    },
    ...mapState({
      loading: (state) => state.campaigns.loading,
      campaigns: (state) => state.campaigns.alldashboard.data,
      currentUser: (state) => state.authentication.user,
      loadingStats: state => state.campaigns.loadingStats,
      stats: state => state.campaigns.stats.data,
      plans: (state) => state.plans.all,
    }),
    toastNotificationData() {
        return this.$store.state.authentication.toastNotificationData;
    },
  },
  watch: {
    loadingStats: function() {
      this.loadStatsData();
    },
  },

  created() {
    this.myTeamList()

    this.loadMultiaxis();

  	adminService.getLastUsers().then(
              (result) => {
  			this.lastusers = result
  			this.keytable++
  		});
  	adminService.getActive().then(
              (result) => {
  			this.activecampaigns = result
  		});
  	adminService.getGmailImports().then(
              (result) => {
  			this.gmaillist = result
  		});
  	this.loadinglinkedin = true
  	adminService.getLinkedinImports().then(
              (result) => {
  			this.linkedinlist = result
  			this.loadinglinkedin = false
  		});


    this.cols = [
      [{
      'value' : 'creation_date',
      }],
      [{
      'value' : 'name',
      }],
      [{
      'value' : 'lastname',
      }],
      [{
      'value' : 'email',
      }], 
     ]
  this.headers = [
      {
      'label' : this.$t('lang.label.creationdate'),
      'size':'130px',
      'class':'overflowhide'
      },
      {
      'label' : this.$t('lang.column.name'),
      'size':'80px',
      'class':'overflowhide'
      },
      {
      'label' : this.$t('lang.column.lastname'),
      'size':'80px',
      'class':'overflowhide'
      },
      {
      'label' : this.$t('lang.column.email'),
      'size':'100px',
      'class':'overflowhide'
      },
     ]

  this.headers3 = [
      {
      'label' : "id",
      'size':'130px',
      'class':'overflowhide'
      },
      {
      'label' : this.$t('lang.label.name'),
      'size':'130px',
      'class':'overflowhide'
      },
      {
      'label' : this.$t('lang.label.status'),
      'size':'130px',
      'class':'overflowhide'
      },
      {
      'label' : "Total points",
      'size':'130px',
      'class':'overflowhide'
      },
      {
      'label' : "Processed points",
      'size':'130px',
      'class':'overflowhide'
      },
      {
      'label' : "Business found",
      'size':'130px',
      'class':'overflowhide'
      },
      {
      'label' : "Bussiness processed",
      'size':'130px',
      'class':'overflowhide'
      },
      {
      'label' : "Imported",
      'size':'130px',
      'class':'overflowhide'
      },
      {
      'label' : this.$t('lang.label.industry'),
      'size':'130px',
      'class':'overflowhide'
      },
      {
      'label' : "Linkedin",
      'size':'130px',
      'class':'overflowhide'
      },
      {
      'label' : "Created",
      'size':'130px',
      'class':'overflowhide'
      },
      {
      'label' : "Updated",
      'size':'130px',
      'class':'overflowhide'
      },
      {
      'label' : "Time",
      'size':'130px',
      'class':'overflowhide'
      },
     ]

    this.cols3 = [
      [{
      'value' : 'id',
      }],
      [{
      'value' : 'name',
      }],
      [{
      'value' : 'status',
      'icons' : [
            {
            'icon_if_value':'finished',
            'icon_true':'icon-checkmark text-success',
            },
            {
            'icon_if_value':'pending',
            'icon_true':'icon-clock text-secondary',
            },
            {
            'icon_if_value':'paused',
            'icon_true':'icon-pause text-warning',
            },
            {
            'icon_if_value':'processing',
            'icon_true':'icon-download text-primary',
            },
        ],
      }],
      [{
      'value' : 'point_total',
      }],
      [{
      'value' : 'point_processed',
      }],
      [{
      'value' : 'total',
      }],
      [{
      'value' : 'finished',
      }],
      [{
      'value' : 'imported',
      }],
      [{
      'value' : 'industry',
      }],
      [{
      'value' : 'searchlinkedin',
      }],
      [{
      'value' : 'created',
      }],
      [{
      'value' : 'updated',
      }],
      [{
      'value' : 'difference',
      }],
    ]
  this.headers4 = [
      {
      'label' : "id",
      'size':'130px',
      'class':'overflowhide'
      },
      {
      'label' : this.$t('lang.label.name'),
      'size':'130px',
      'class':'overflowhide'
      },
      {
      'label' : this.$t('lang.label.status'),
      'size':'130px',
      'class':'overflowhide'
      },
      {
      'label' : "job_id",
      'size':'130px',
      'class':'overflowhide'
      },
      {
      'label' : "Total",
      'size':'130px',
      'class':'overflowhide'
      },
      {
      'label' : "Processed",
      'size':'130px',
      'class':'overflowhide'
      },
      {
      'label' : "Imported",
      'size':'130px',
      'class':'overflowhide'
      },
      {
      'label' : "Created",
      'size':'130px',
      'class':'overflowhide'
      },
      {
      'label' : "Updated",
      'size':'130px',
      'class':'overflowhide'
      },
      {
      'label' : "Time",
      'size':'130px',
      'class':'overflowhide'
      },
     ]

    this.cols4 = [
      [{
      'value' : 'id',
      }],
      [{
      'value' : 'name',
      }],
      [{
      'value' : 'status',
      'icons' : [
            {
            'icon_if_value':'imported',
            'icon_true':'icon-checkmark text-success',
            },
            {
            'icon_if_value':'pending',
            'icon_true':'icon-clock text-secondary',
            },
            {
            'icon_if_value':'importing',
            'icon_true':'icon-download text-primary',
            },
        ],
      }],
      [{
      'value' : 'job_id',
      }],
      [{
      'value' : 'result',
      }],
      [{
      'value' : 'processed',
      }],
      [{
      'value' : 'imported',
      }],
      [{
      'value' : 'created',
      }],
      [{
      'value' : 'updated',
      }],
      [{
      'value' : 'difference',
      }],
    ]

  },

  methods: {
    ...mapActions("campaigns", {
      getAllCampaigns: "getInfoCampaigns",
    }),
    ...mapActions("campaigns", {
      getCampaignStatsByIdAndRange: "getStatsByIdAndRange"
    }),
    ...mapActions("header", {
      changeHeaderTab: "changeTab",
    }),
    changeThisTab(id){
      this.tab = id
    },
    loadAgencyStats(){
      campaignsService.getAgencyStatsRange(this.range.startDate,this.range.endDate,this.client).then(result => {
        this.meetings_details = result.activity_by_date
        this.openlist = true
      })
    },
    changeChart(type){
     this.timechart = type
    },
    loadMultiaxis(){

      if(this.filters.sessions){
          this.multiaxis.datasets.push({
            type: 'bar',
            label: this.$t('lang.label.clicks'),
            hidden: false,
            filter: 'activity_total',
            borderColor: 'rgba(255,255,255,1)',
            backgroundColor: 'RGBA(82,190,128,0.48)',
            pointBackgroundColor: "rgba(220,220,220,1)",
            yAxisID: 'y2',
            data: []
          })
          this.multiaxisweek.datasets.push({
            type: 'bar',
            label: this.$t('lang.label.clicks'),
            hidden: false,
            filter: 'activity_total',
            borderColor: 'rgba(255,255,255,1)',
            backgroundColor: 'RGBA(82,190,128,0.48)',
            pointBackgroundColor: "rgba(220,220,220,1)",
            yAxisID: 'y2',
            data: []
          })
          this.multiaxismonth.datasets.push({
            type: 'bar',
            label: this.$t('lang.label.clicks'),
            hidden: false,
            filter: 'activity_total',
            borderColor: 'rgba(255,255,255,1)',
            backgroundColor: 'RGBA(82,190,128,0.48)',
            pointBackgroundColor: "rgba(220,220,220,1)",
            yAxisID: 'y2',
            data: []
          })
      }
      if(this.filters.answers){
          this.multiaxis.datasets.push({
            type: 'bar',
            label: this.$t('lang.label.answers'),
            hidden: false,
            filter: 'email_response_total',
            borderColor: 'RGB(251,0,98,1)',
            backgroundColor: 'RGBA(251,0,98,0.51)',
            pointBackgroundColor: "rgba(220,220,220,1)",
            yAxisID: 'y2',
            data: []
          })
          this.multiaxisweek.datasets.push({
            type: 'bar',
            label: this.$t('lang.label.answers'),
            hidden: false,
            filter: 'email_response_total',
            borderColor: 'RGB(251,0,98,1)',
            backgroundColor: 'RGBA(251,0,98,0.51)',
            pointBackgroundColor: "rgba(220,220,220,1)",
            yAxisID: 'y2',
            data: []
          })
          this.multiaxismonth.datasets.push({
            type: 'bar',
            label: this.$t('lang.label.answers'),
            hidden: false,
            filter: 'email_response_total',
            borderColor: 'RGB(251,0,98,1)',
            backgroundColor: 'RGBA(251,0,98,0.51)',
            pointBackgroundColor: "rgba(220,220,220,1)",
            yAxisID: 'y2',
            data: []
          })
      }
      if(this.filters.opened){
        this.multiaxis.datasets.push({
            type: 'bar',
            label: this.$t('lang.label.openedemails'),
            hidden: false,
            filter: 'emails_opened',
            borderColor: 'RGB(173,198,244,1)',
            backgroundColor: 'RGBA(173,198,244,0.50)',
            pointBackgroundColor: "rgba(220,220,220,1)",
            yAxisID: 'y2',
            data: []
          })

        this.multiaxisweek.datasets.push({
            type: 'bar',
            label: this.$t('lang.label.openedemails'),
            hidden: false,
            filter: 'emails_opened',
            borderColor: 'RGB(173,198,244,1)',
            backgroundColor: 'RGBA(173,198,244,0.50)',
            pointBackgroundColor: "rgba(220,220,220,1)",
            yAxisID: 'y2',
            data: []
          })

        this.multiaxismonth.datasets.push({
            type: 'bar',
            label: this.$t('lang.label.openedemails'),
            hidden: false,
            filter: 'emails_opened',
            borderColor: 'RGB(173,198,244,1)',
            backgroundColor: 'RGBA(173,198,244,0.50)',
            pointBackgroundColor: "rgba(220,220,220,1)",
            yAxisID: 'y2',
            data: []
          })
      }

      if(this.filters.money){

        this.multiaxis.datasets.push({
            type: 'bar',
            label: "€",
            hidden: false,
            filter: 'money',
            borderColor: 'RGB(82, 190, 128,1)',
            backgroundColor: 'RGBA(82, 190, 128,0.50)',
            pointBackgroundColor: "rgba(220,220,220,1)",
            yAxisID: 'y2',
            data: []
          })

        this.multiaxisweek.datasets.push({
            type: 'bar',
            label: "€",
            hidden: false,
            filter: 'money',
            borderColor: 'RGB(82, 190, 128,1)',
            backgroundColor: 'RGBA(82, 190, 128,0.50)',
            pointBackgroundColor: "rgba(220,220,220,1)",
            yAxisID: 'y2',
            data: []
          })

        this.multiaxismonth.datasets.push({
            type: 'bar',
            label: "€",
            hidden: false,
            filter: 'money',
            borderColor: 'RGB(82, 190, 128,1)',
            backgroundColor: 'RGBA(82, 190, 128,0.50)',
            pointBackgroundColor: "rgba(220,220,220,1)",
            yAxisID: 'y2',
            data: []
          })
      }
      
      if(this.filters.sent){
         this.multiaxis.datasets.push({
            type: 'bar',
            label: this.$t('lang.label.bounce'),
            hidden: false,
            filter: 'bounce_total',
            borderColor: '#808080',
            backgroundColor: '#808080',
            pointBackgroundColor: "#808080",
            yAxisID: 'y2',
            data: []
          })
         this.multiaxis.datasets.push({
            type: 'bar',
            label: this.$t('lang.label.sent'),
            hidden: false,
            filter: 'emails_sent',
            borderColor: 'RGB(133,128,242,1)',
            backgroundColor: 'RGBA(133,128,242,0.51)',
            pointBackgroundColor: "rgba(220,220,220,1)",
            yAxisID: 'y2',
            data: []
          })
         this.multiaxisweek.datasets.push({
            type: 'bar',
            label: this.$t('lang.label.bounce'),
            hidden: false,
            filter: 'bounce_total',
            borderColor: '#808080',
            backgroundColor: '#808080',
            pointBackgroundColor: "#808080",
            yAxisID: 'y2',
            data: []
          })
         this.multiaxisweek.datasets.push({
            type: 'bar',
            label: this.$t('lang.label.sent'),
            hidden: false,
            filter: 'emails_sent',
            borderColor: 'RGB(133,128,242,1)',
            backgroundColor: 'RGBA(133,128,242,0.51)',
            pointBackgroundColor: "rgba(220,220,220,1)",
            yAxisID: 'y2',
            data: []
          })

         this.multiaxismonth.datasets.push({
            type: 'bar',
            label: this.$t('lang.label.bounce'),
            hidden: false,
            filter: 'bounce_total',
            borderColor: '#808080',
            backgroundColor: '#808080',
            pointBackgroundColor: "#808080",
            yAxisID: 'y2',
            data: []
          })
         this.multiaxismonth.datasets.push({
            type: 'bar',
            label: this.$t('lang.label.sent'),
            hidden: false,
            filter: 'emails_sent',
            borderColor: 'RGB(133,128,242,1)',
            backgroundColor: 'RGBA(133,128,242,0.51)',
            pointBackgroundColor: "rgba(220,220,220,1)",
            yAxisID: 'y2',
            data: []
          })
      }
      if(this.filters.meetings){
        this.multiaxis.datasets.push({
            type: 'line',
            label: 'Meetings',
            filter: 'meetings',
            borderColor: 'RGB(133,43,242,1)',
            pointBackgroundColor: "rgba(220,220,220,1)",
            yAxisID: 'y1',
            data: []
          })
        this.multiaxisweek.datasets.push({
            type: 'line',
            label: 'Meetings',
            filter: 'meetings',
            borderColor: 'RGB(133,43,242,1)',
            pointBackgroundColor: "rgba(220,220,220,1)",
            yAxisID: 'y1',
            data: []
          })
        this.multiaxismonth.datasets.push({
            type: 'line',
            label: 'Meetings',
            filter: 'meetings',
            borderColor: 'RGB(133,43,242,1)',
            pointBackgroundColor: "rgba(220,220,220,1)",
            yAxisID: 'y1',
            data: []
          })
      }
    },
    getDetails(){
      this.loadAgencyStats()
    },
    getMultiaxisMonth(type){
        let stats = this.stats

        if(stats.activity_by_date[type] === undefined){
          return
        }
        
        let meetings = stats.activity_by_date[type]
        let labels = stats.activity_by_date.labels
        let newlabels=[]
        let indexof
        let days = ""
        let day = ""
        let resmeetings=[]
        let reflabelmeeting=[]
        let datescols=[]

          labels.forEach((r,index) => {
            let days = r.split("/")
            day = new Date(days[0], days[1]-1, days[2])
            var refd = day.getFullYear()+"/"+ days[1]
            if(reflabelmeeting.indexOf(refd) < 0){
              reflabelmeeting.push(refd)
            }
            indexof = reflabelmeeting.indexOf(refd)
            if(newlabels[indexof] == undefined && meetings[index] !== undefined){
             
              newlabels[indexof] = 0 + parseInt(meetings[index])
            }else{
              newlabels[indexof] = parseInt(newlabels[indexof]) + parseInt(meetings[index])
            }
          })

          newlabels.forEach((quantity,index) => {
             resmeetings.push(quantity)
          })
          this.multiaxismonth.labels = reflabelmeeting;
          this.multiaxis.datasets.forEach((r,index) =>{
            if(r.filter == type){
             this.multiaxismonth.datasets[index].data = resmeetings;
            }
          })
        

    },    
    getGroupMonth(){

        
        this.groupedmeetignsmonth.labels = this.stats.activity_by_date.labels;
        this.groupedmeetignsmonth.datasets[0].label = 'Planned'
        this.groupedmeetignsmonth.datasets[1].label = 'Canceled'
        this.groupedmeetignsmonth.datasets[2].label = 'Absent'

        let stats = this.stats
        let labels = stats.activity_by_date.labels
        let newplanned=[]
        let newcanceled=[]
        let newabsent=[]
        let indexof
        let days = ""
        let day = ""
        let planned=this.stats.activity_by_date["planned"]
        let canceled=this.stats.activity_by_date["canceled"]
        let absent=this.stats.activity_by_date["absent"]
        let reflabelmeeting=[]
        let datescols=[]


        if(labels !== undefined && labels.length > 0){
          labels.forEach((r,index) => {


            let days = r.split("/")
            day = new Date(days[0], days[1]-1, days[2])
            var refd = day.getFullYear()+"/"+ days[1]

           
            

            if(reflabelmeeting.indexOf(refd) < 0){
              datescols.push(refd)
              reflabelmeeting.push(refd)
            }
            indexof = reflabelmeeting.indexOf(refd)

            if(newplanned[indexof] == undefined && planned[index] !== undefined){     
              newplanned[indexof] = 0 + parseInt(planned[index])
            }else{
              newplanned[indexof] = parseInt(newplanned[indexof]) + parseInt(planned[index])
            }
            if(newcanceled[indexof] == undefined && canceled[index] !== undefined){     
              newcanceled[indexof] = 0 + parseInt(canceled[index])
            }else{
              newcanceled[indexof] = parseInt(newcanceled[indexof]) + parseInt(canceled[index])
            }
            if(newabsent[indexof] == undefined && absent[index] !== undefined){     
              newabsent[indexof] = 0 + parseInt(absent[index])
            }else{
              newabsent[indexof] = parseInt(newabsent[indexof]) + parseInt(absent[index])
            }
          })
        }

        if(newplanned !== undefined && newplanned.length > 0){
          newplanned.forEach((quantity,index) => {
             planned.push(quantity)
          })
          newcanceled.forEach((quantity,index) => {
             canceled.push(quantity)
          })
          newabsent.forEach((quantity,index) => {
             absent.push(quantity)
          })
          this.groupedmeetignsmonth.labels = datescols;
          this.groupedmeetignsmonth.datasets[0].data = planned;
          this.groupedmeetignsmonth.datasets[1].data = canceled;
          this.groupedmeetignsmonth.datasets[2].data = absent;
      }


    },
    getGroupWeek(){


        this.groupedmeetignsweek.labels = this.stats.activity_by_date.labels;
        this.groupedmeetignsweek.datasets[0].label = 'Planned'
        this.groupedmeetignsweek.datasets[1].label = 'Canceled'
        this.groupedmeetignsweek.datasets[2].label = 'Absent'

        let stats = this.stats
        let labels = stats.activity_by_date.labels
        let newplanned=[]
        let newcanceled=[]
        let newabsent=[]
        let indexof
        let days = ""
        let day = ""
        let planned=this.stats.activity_by_date["plannedcant"]
        let canceled=this.stats.activity_by_date["canceledcant"]
        let absent=this.stats.activity_by_date["absentcant"]
        let reflabelmeeting=[]
        let datescols=[]


        if(labels !== undefined && labels.length > 0){
          labels.forEach((r,index) => {


            let days = r.split("/")
            let day = new Date(days[0], days[1]-1, days[2])  
            
            var d = new Date(Date.UTC(day.getFullYear(), day.getMonth(), day.getDate()));
            var dayNum = d.getUTCDay() || 7;
            d.setUTCDate(d.getUTCDate() + 4 - dayNum);
            var yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
            var week = Math.ceil((((d - yearStart) / 86400000) + 1)/7)

            if(days[1]+"/"+days[2] == "01/01"){
              week = 1
            }
            if(days[1]+"/"+days[2] == "01/02"){
              week = 1
            }
            
            var refd = day.getFullYear()+" Week: "+week

            if(reflabelmeeting.indexOf(refd) < 0){
              datescols.push(refd)
              reflabelmeeting.push(refd)
            }
            indexof = reflabelmeeting.indexOf(refd)

            if(newplanned[indexof] == undefined && planned[index] !== undefined){     
              newplanned[indexof] = 0 + parseInt(planned[index])
            }else{
              newplanned[indexof] = parseInt(newplanned[indexof]) + parseInt(planned[index])
            }
            if(newcanceled[indexof] == undefined && canceled[index] !== undefined){     
              newcanceled[indexof] = 0 + parseInt(canceled[index])
            }else{
              newcanceled[indexof] = parseInt(newcanceled[indexof]) + parseInt(canceled[index])
            }
            if(newabsent[indexof] == undefined && absent[index] !== undefined){     
              newabsent[indexof] = 0 + parseInt(absent[index])
            }else{
              newabsent[indexof] = parseInt(newabsent[indexof]) + parseInt(absent[index])
            }
          })
        }

        let resplanned = []
        let rescanceled = []
        let resabsent = []

        if(newplanned !== undefined && newplanned.length > 0){
          newplanned.forEach((quantity,index) => {
             var total = newcanceled[index]+newabsent[index]+newplanned[index]
             var it = quantity
             var q = Math.round(it*100/total)
             resplanned.push(q)
             it = newcanceled[index]
             var q = Math.round(it*100/total)
             rescanceled.push(q)
             it = newabsent[index]
             var q = Math.round(it*100/total)
             resabsent.push(q)
          })

          this.groupedmeetignsweek.labels = datescols;
          this.groupedmeetignsweek.datasets[0].data = resplanned;
          this.groupedmeetignsweek.datasets[1].data = rescanceled;
          this.groupedmeetignsweek.datasets[2].data = resabsent;
      }
    },
    getMultiaxisWeek(type){
        let stats = this.stats
        if(stats.activity_by_date[type] === undefined){
          return
        }
        let meetings = stats.activity_by_date[type]
        let labels = stats.activity_by_date.labels
        let newlabels=[]
        let indexof
        let days = ""
        let day = ""
        let resmeetings=[]
        let reflabelmeeting=[]
        let datescols=[]


        if(labels !== undefined && labels.length > 0){
          labels.forEach((r,index) => {


            let days = r.split("/")
            let day = new Date(days[0], days[1]-1, days[2])  
            
            var d = new Date(Date.UTC(day.getFullYear(), day.getMonth(), day.getDate()));
            var dayNum = d.getUTCDay() || 7;
            d.setUTCDate(d.getUTCDate() + 4 - dayNum);
            var yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
            var week = Math.ceil((((d - yearStart) / 86400000) + 1)/7)

            if(days[1]+"/"+days[2] == "01/01"){
              week = 1
            }
            if(days[1]+"/"+days[2] == "01/02"){
              week = 1
            }
            
            var refd = day.getFullYear()+" Semana: "+week

            if(reflabelmeeting.indexOf(refd) < 0){
              datescols.push(day)
              reflabelmeeting.push(refd)
            }
            indexof = reflabelmeeting.indexOf(refd)
            if(newlabels[indexof] == undefined && meetings[index] !== undefined){     
              newlabels[indexof] = 0 + parseInt(meetings[index])
            }else{
              newlabels[indexof] = parseInt(newlabels[indexof]) + parseInt(meetings[index])
            }
          })
        }

        if(newlabels !== undefined && newlabels.length > 0){
          newlabels.forEach((quantity,index) => {
             resmeetings.push(quantity)
          })
          this.multiaxisweek.labels = datescols;

          this.multiaxis.datasets.forEach((r,index) =>{
            if(r.filter == type){
             this.multiaxisweek.datasets[index].data = resmeetings;
            }
          })
        }
    },
    getMultiaxis(){
      this.getMultiaxisMonth('meetings')
      this.getMultiaxisWeek('meetings')

      this.getMultiaxisMonth('money')
      this.getMultiaxisWeek('money')

      this.getMultiaxisMonth('activity_total')
      this.getMultiaxisWeek('activity_total')

      this.getMultiaxisMonth('email_response_total')
      this.getMultiaxisWeek('email_response_total')

      this.getMultiaxisMonth('emails_opened')
      this.getMultiaxisWeek('emails_opened')

      this.getMultiaxisMonth('activity_total')
      this.getMultiaxisWeek('activity_total')

      this.getMultiaxisMonth('emails_sent')
      this.getMultiaxisWeek('emails_sent')
      
      this.getMultiaxisMonth('bounce_total')
      this.getMultiaxisWeek('bounce_total')
    },
    refreshgmail(){
    	this.loadinggmail = true
  		adminService.getGmailImports().then(
              (result) => {
  			this.gmaillist = result
    		this.keygmail++
    		this.loadinggmail = false
  		});
    },
    validarDate(){ 
      let startDate = new Date(this.range.startDate);
      let endDate = new Date(this.range.endDate);
      if (startDate.getTime() > endDate.getTime()){
        return true
      }else{return false}
    },
    loadRangeStats(){
      this.multiaxis.datasets = []
      this.multiaxisweek.datasets = []
      this.multiaxismonth.datasets = []
      this.loadMultiaxis()
      this.meetings_details = []
      this.openlist = false
      this.openchart = true
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
          endDate: this.range.endDate,
          client:this.client,
          filters:this.filters
        });
      }
    },
    loadStatsData(){
      if (!this.loadingStats){
        this.multiaxis.labels = this.stats.activity_by_date.labels;
        this.multiaxis.datasets.forEach((r,index) =>{
          this.multiaxis.datasets[index].data = this.stats.activity_by_date[this.multiaxis.datasets[index].filter]
        })
      
        this.getMultiaxis()

        this.groupedmeetigns.labels = this.stats.activity_by_date.labels;
        this.groupedmeetigns.datasets[0].label = 'Planned'
        this.groupedmeetigns.datasets[1].label = 'Canceled'
        this.groupedmeetigns.datasets[2].label = 'Absent'
        this.groupedmeetigns.datasets[0].data = this.stats.activity_by_date["planned"]
        this.groupedmeetigns.datasets[1].data = this.stats.activity_by_date["canceled"] 
        this.groupedmeetigns.datasets[2].data = this.stats.activity_by_date["absent"]

        this.getGroupWeek()
        this.getGroupMonth()

      }
    },
    getMoreTeam(){
       let actualcant = this.teamgroups.length
       this.groups.forEach((r,index) => {
            if(index >= actualcant && index < (actualcant+10)){
              this.cantgroups++
              this.teamgroups.push(r)
            }
        })
    },
    myTeamList(){   
      monitorService.getClients().then((result) => {
        this.groups = result
        result.forEach((r,index) => {
            if(index < 10){
              this.cantgroups++
              this.teamgroups.push(r)
            }
        })
      })
    },
    refreshlinkedin(){
    	this.loadinglinkedin = true
  		adminService.getLinkedinImports().then(
              (result) => {
  			this.linkedinlist = result
    		this.keylinkedin++
    		this.loadinglinkedin = false
  		});
    }
  },
};
</script>

<style scoped>

.scrollable {
  height: 50vh;
  overflow: scroll !important;
  width: 100% !important;
}
</style>