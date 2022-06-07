<template>
  <section class="campaign">
    <main class="main  animated fadeIn faster" :class="{ 'expand-main' : isMenuCollapse }">
      <ol class="breadcrumb">
        <li class="breadcrumb-item active">{{ $t('lang.menu.reports') }}</li>
      </ol>
      <div class="contenedor animated fadeIn faster">
        <div v-if="empty">
          <p>No Active Campaigns</p>
        </div>
        <div v-if="finished">
          <p>Report Finished</p>
        </div>
        <LoadingSpinner v-if="loading" />

        <div style="opacity: 0;">
          <div ref="printMe1">
            <h2 class="title py-2" >Summary</h2>
            <div v-if="statsSumarry" class="row">
              <div class="col-12">
                <div class="card-body p-0">
                  <div class="row">
                    <div class="col-sm-4 col-xl-2">
                      <div class="card shadow-none m-0">
                        <div class="card-body text-center">
                        <p class="text-muted mb-2">Active Campaigns</p>
                          <h3><span> {{ statsSumarry.totalActiveCampaigns }}</span></h3>
                        </div>
                      </div>
                    </div>
                    <div class="col-sm-4 col-xl-2">
                      <div class="card shadow-none m-0 border-left">
                        <div class="card-body text-center">
                        <p class="text-muted mb-2">New Opportunities</p>
                          <h3><span> {{ statsSumarry.totalContacts }}</span></h3>
                        </div>
                      </div>
                    </div>
                    <div class="col-sm-4 col-xl-2">
                      <div class="card shadow-none m-0 border-left">
                        <div class="card-body text-center">
                        <p class="text-muted mb-2">Expenses</p>
                          <h3><span> {{ statsSumarry.totalExpenses }} €</span></h3>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                  
                <br/><br/>
                <div class="bar_code">
                  <div>
                    <h3 :style="{ margin: '5px'}"><span> {{ statsSumarry.totalEmailsSent }} </span></h3>
                  </div>
                  <div :style="{ margin: '5px'}">
                    <p class="text-muted mb-2">Emails Sent</p>
                  </div>
                  <div class="bar_code_row">
                    <div :style="{ margin: '5px', width: '90%', background: '#36A2EB', color: '#36A2EB' }" >
                      .
                    </div>
                    <div :style="{ margin: '5px'}">
                      {{ statsSumarry.totalEmailsSent }} sent
                    </div>
                  </div>
                  <div class="bar_code_row">
                    <div :style="{ margin: '5px', width: statsSumarry.totalEmailsOpenedPercentage *0.9 + '%', background: '#FF9F40', color: '#FF9F40' }" >
                      .
                    </div>
                    <div :style="{ margin: '5px'}">
                      {{ statsSumarry.totalEmailsOpened }} opened
                    </div>
                  </div>
                  <div class="bar_code_row">
                    <div :style="{ margin: '5px', width: statsSumarry.totalClickPercentage *0.9  + '%', background: '#52BE80', color: '#52BE80' }" >
                      .
                    </div>
                    <div :style="{ margin: '5px'}">
                      {{ statsSumarry.totalClicks }} clicked
                    </div>
                  </div>

                  <div class="bar_code_row">
                    <div :style="{ margin: '5px', width: statsSumarry.totalEmailReponsesPercentage *0.9  + '%', background: '#A569BD', color: '#A569BD' }" >
                      .
                    </div>
                    <div :style="{ margin: '5px'}">
                      {{ statsSumarry.totalEmailReponses }} replied
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <img :src="summaryCanvasImage">
          </div>

          <div ref="printMe2">
            <h2 class="title py-2" >{{ multiaxisForPdf.campaign_name }}</h2>
              <div v-if="statsForPdf && statsForPdf.activity" class="row">
                <div class="col-12">
                  <div class="card widget-inline">
                    <div class="card-body p-0">
                      <div class="row no-gutters">
                        <div class="col-sm-4 col-xl-2">
                          <div class="card shadow-none m-0">
                            <div class="card-body text-center">
                            <p class="text-muted mb-2">{{ $t('lang.label.engagedcompanies') }}</p>
                              <h3><span> {{ statsForPdf.activity.total_business }}</span></h3>
                            </div>
                          </div>
                        </div>
                        <div class="col-sm-4 col-xl-2">
                          <div class="card shadow-none m-0 border-left">
                            <div class="card-body text-center">
                            <p class="text-muted mb-2">{{ $t('lang.label.engagedpeople') }}</p>
                              <h3>{{ statsForPdf.activity.total_contacts }}</h3>
                            </div>
                          </div>
                        </div>
                        <div class="col-sm-4 col-xl-2">
                          <div class="card shadow-none m-0 border-left">
                            <div class="card-body text-center">
                            <p class="text-muted mb-2">{{ $t('lang.label.sent') }}</p>
                              <h3><span>{{ statsForPdf.activity.emails_sent }}</span> <i class="mdi mdi-arrow-up text-success"></i></h3>
                            </div>
                          </div>
                        </div>
                        <div class="col-sm-4 col-xl-2">
                          <div class="card shadow-none m-0 border-left">
                            <div class="card-body text-center">
                            <p class="text-muted mb-2">{{ $t('lang.label.clicks') }}</p>
                              <h3><span>{{ statsForPdf.activity.activity_total }}</span></h3>
                            </div>
                          </div>
                        </div>
                        <div class="col-sm-4 col-xl-2">
                          <div class="card shadow-none m-0 border-left">
                            <div class="card-body text-center">
                            <p class="text-muted mb-2">{{ $t('lang.label.answers') }}</p>
                              <h3><span>{{ statsForPdf.activity.email_response_total }}</span> <i class="mdi mdi-arrow-up text-success"></i></h3>
                            </div>
                          </div>
                        </div>
                        <div class="col-sm-4 col-xl-2">
                          <div class="card shadow-none m-0 border-left">
                            <div class="card-body text-center">
                            <p class="text-muted mb-2">{{ $t('lang.label.expenses') }}</p>
                              <h3><span>{{ statsForPdf.activity.activity_price_total }} €</span> <i class="mdi mdi-arrow-up text-success"></i></h3>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            <line-chart :width="300" :height="100"  :chart-data="multiaxisForPdf" :options="multiaxisForPdf.options" />
          </div>
          <img :src="canvasImage">
        </div>
      </div>
    </main>
  </section>
</template>
<script>

import { mapState, mapActions } from "vuex";
import jsPDF from 'jspdf';
import moment from "moment";
import LineChart from '@/components/Chart.vue';
import { campaignsService } from "@/_services";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
export default {
  data () {
    return {
      loading: false,
      canvasImage: '',
      summaryCanvasImage: '',
      document: '',
      currentPosition: 10,
      statsForPdf:'',
      multiaxisForPdf: {},
      statsSumarry: {},
      empty: false,
      finished: false,
    }
  },

  
  components: { 
    LineChart,
    LoadingSpinner,
  },

  mounted(){
    this.generateFullReportPDF();
  },

  computed: {
    ...mapState({
      currentUser: state => state.authentication.user,
       isMenuCollapse: state => state.sidebar.isNavOpen,
    }),
  },

  methods:{
    ...mapActions("campaigns", {
      getCampaignStatsByIdAndRange: "getStatsByIdAndRange"
    }),

    async generateFullReportPDF(){
      this.loading = true;
      let lastMonthActiveCampaigns = await campaignsService.getLastMonthActiveCampaigns().then( result => {
        return result;
      });

      this.doc = new jsPDF("p", "mm", "a4");
      if (lastMonthActiveCampaigns != undefined && lastMonthActiveCampaigns.length >0){
        this.doc.text("Oliver Report - " + this.currentUser.client_name, 10, this.currentPosition);
        this.currentPosition += 8;
      }else{
        this.doc = '';
        this.empty = true;
        this.loading = false;
        this.finished = false;
        return;
      }


      let summary = [];

      for (const campaign of lastMonthActiveCampaigns){
        let startDate = moment().subtract(1, 'months').startOf('month').format("YYYY-MM-DD");
        let endDate = moment().subtract(1, 'months').endOf('month').format("YYYY-MM-DD");
        let stats = await campaignsService.getStatsRange(campaign.id,startDate,endDate).then((stats) => {
          return stats;
        })

        let groupStats = await campaignsService.getStatsGroupRange(campaign.id,startDate,endDate).then((groupStats) => {
          return groupStats;
        })

        let campaignSummary = {
          campaign: campaign,
          stats: stats,
          groupStats: groupStats
        }
        summary.push(campaignSummary);
      }


      let totalEmailsSent = 0;
      let totalEmailsOpened = 0;
      let totalClicks = 0;
      let totalEmailReponses = 0;
      let totalContacts = 0;
      let totalExpenses = 0.0;

      let totalEmailsOpenedPercentage = 0;
      let totalClickPercentage = 0;
      let totalEmailReponsesPercentage = 0;

      let totalActiveCampaigns = 0;

      for (const campaignSummary of summary){
        totalActiveCampaigns += 1;
        if (campaignSummary.stats.activity != undefined){
          let row = campaignSummary.stats.activity;

          totalEmailsSent += parseInt(row.emails_sent);
          totalEmailsOpened += parseInt(row.emails_opened);
          totalClicks += parseInt(row.activity_total);
          totalEmailReponses += parseInt(row.email_response_total);
          totalExpenses += parseInt(row.activity_price_total);
          totalContacts += parseInt(row.total_contacts);
        }
      }
      if (totalEmailsSent > 0){
        totalEmailsOpenedPercentage = Math.round(totalEmailsOpened * 100 / totalEmailsSent);
        totalClickPercentage = Math.round(totalClicks * 100 / totalEmailsSent);
        totalEmailReponsesPercentage = Math.round(totalEmailReponses * 100 / totalEmailsSent);
      }

      this.statsSumarry = {
        totalActiveCampaigns: totalActiveCampaigns,
        totalContacts: totalContacts,
        totalExpenses: parseFloat(totalExpenses).toFixed(2),
        totalEmailsSent: totalEmailsSent,
        totalEmailsOpened: totalEmailsOpened,
        totalEmailsOpenedPercentage: totalEmailsOpenedPercentage,
        totalClicks: totalClicks,
        totalClickPercentage: totalClickPercentage,
        totalEmailReponses: totalEmailReponses,
        totalEmailReponsesPercentage: totalEmailReponsesPercentage
      }
      await this.generateSummaryImage();

      for (const campaignSummary of summary){
        if (campaignSummary.stats != undefined ){
          this.statsForPdf = campaignSummary.stats;
          this.createMultiaxisForPdf();
          this.multiaxisForPdf.campaign_name = campaignSummary.campaign.name;
          this.multiaxisForPdf.labels = this.statsForPdf.activity_by_date.labels;
          //this.multiaxisForPdf.datasets[0].data = this.statsForPdf.activity_by_date.activity_price_total;
          this.multiaxisForPdf.datasets[0].data = this.statsForPdf.activity_by_date.emails_sent;
          this.multiaxisForPdf.datasets[1].data = this.statsForPdf.activity_by_date.emails_opened;
          this.multiaxisForPdf.datasets[2].data = this.statsForPdf.activity_by_date.activity_total;
          this.multiaxisForPdf.datasets[3].data = this.statsForPdf.activity_by_date.email_response_total;
          this.multiaxisForPdf.datasets[4].data = this.statsForPdf.activity_by_date.bounce_total;

          await new Promise(r => setTimeout(r, 8000));
          await this.generateImage();

          if (campaignSummary.groupStats.activity != undefined){

            let groupsTitles = ["Filtered By Industry", "Filtered By Hierarchical Level", "Filtered By Region"];
            let groupNumber = 0;
            for (let activities of [campaignSummary.groupStats.activity]){
              for (let activity of activities){

                if ((this.currentPosition + 8)>= 287){
                  this.currentPosition = 10;
                  this.doc.addPage();
                }

                let fontSize = this.doc.getFontSize();
                this.doc.setFontSize(12);
                this.doc.text(groupsTitles[groupNumber], 10, this.currentPosition);
                this.currentPosition += 8;
                groupNumber++;

                if ((this.currentPosition + 5)>= 287){
                  this.currentPosition = 10;
                  this.doc.addPage();
                }

                this.doc.setFontSize(10);
                this.doc.text("Name", 10, this.currentPosition);
                this.doc.text("Emails Sent", 60, this.currentPosition);
                this.doc.text("Contacts", 80, this.currentPosition);
                this.doc.text("Open Rate", 100, this.currentPosition);
                this.doc.text("Clicks", 120, this.currentPosition);
                this.doc.text("Reply Rate", 140, this.currentPosition);
                this.doc.text("Opportunities", 160, this.currentPosition);
                this.doc.text("Expenses", 183, this.currentPosition);
                this.currentPosition += 5;
                this.doc.setFontSize(fontSize);

                for (let row of activity){
                  if ((this.currentPosition + 5)>= 287){
                    this.currentPosition = 10;
                    this.doc.addPage();
                    let fontSize = this.doc.getFontSize();
                    this.doc.setFontSize(10);
                    this.doc.text("Name", 10, this.currentPosition);
                    this.doc.text("Emails Sent", 60, this.currentPosition);
                    this.doc.text("Contacts", 80, this.currentPosition);
                    this.doc.text("Open Rate", 100, this.currentPosition);
                    this.doc.text("Clicks", 120, this.currentPosition);
                    this.doc.text("Reply Rate", 140, this.currentPosition);
                    this.doc.text("Opportunities", 160, this.currentPosition);
                    this.doc.text("Expenses", 183, this.currentPosition);
                    this.currentPosition += 5;
                    this.doc.setFontSize(fontSize);
                  }
                  this.doc.setFontSize(8);

                  if (row.group_name.length >= 35){
                    row.group_name = row.group_name.substring(0,35) + "...";
                  }

                  this.doc.text(row.group_name, 10, this.currentPosition);
                  this.doc.text(row.emails_sent, 60, this.currentPosition);
                  this.doc.text(row.total_contacts, 80, this.currentPosition);

                  let emails_opened_percentage = 0;
                  let email_response_total_percentage = 0;
                  if (row.emails_sent > 0){
                    emails_opened_percentage = Math.round(row.emails_opened * 100 / row.emails_sent);
                    email_response_total_percentage = Math.round(row.email_response_total * 100 / row.emails_sent);
                  }

                  this.doc.text(emails_opened_percentage + "% (" + row.emails_opened + ")", 100, this.currentPosition);
                  this.doc.text(row.activity_total, 120, this.currentPosition);
                  this.doc.text(email_response_total_percentage + "% (" + row.email_response_total + ")", 140, this.currentPosition);
                  let expenses = parseFloat(row.activity_price_total).toFixed(2);

                  this.doc.text(row.total_business, 160, this.currentPosition);
                  this.doc.text(expenses, 183, this.currentPosition);

                  this.currentPosition += 5;
                }
                this.currentPosition += 5;
              }
            }
          }

          if ((this.currentPosition + 1)>= 287){
            this.currentPosition = 10;
            this.doc.addPage();
          }
          this.doc.line(10, this.currentPosition, 200, this.currentPosition, "F");
          this.currentPosition += 5;
        }
      }
      this.doc.save('FullReport.pdf');
      this.finished = true;
      this.loading = false;
      this.statsForPdf = '';
      this.statsSumarry = {};
    },
    async generateSummaryImage(){
      const options = {
        type: 'dataURL'
      }
      this.summaryCanvasImage = await this.$html2canvas(this.$refs.printMe1, options);
      
      if ((this.currentPosition + 30)>= 287){
        this.currentPosition = 10;
        this.doc.addPage();
      }
      this.doc.addImage(this.summaryCanvasImage , 'JPEG', 15, this.currentPosition, 176, 50);
      this.currentPosition += 50 + 10;
    },

    async generateImage(){
      const options = {
        type: 'dataURL'
      }
      this.canvasImage = await this.$html2canvas(this.$refs.printMe2, options);
      
      if ((this.currentPosition + 77)>= 287){
        this.currentPosition = 10;
        this.doc.addPage();
      }
      this.doc.addImage(this.canvasImage , 'JPEG', 15, this.currentPosition, 176, 77);
      this.currentPosition += 77 + 10;
    },

    createMultiaxisForPdf(){
      this.multiaxisForPdf = {
        labels:[],
        datasets: [{
          type: 'bar',
          label: this.$t('lang.label.sent'),
          backgroundColor: '#36a2eb',
          yAxisID: 'y2',
          data: []
        }, {
          type: 'bar',
          label: this.$t('lang.label.openedemails'),
          backgroundColor: '#ff9f40',
          yAxisID: 'y2',
          data: []
        }, {
          type: 'bar',
          label: this.$t('lang.label.clicks'),
          backgroundColor: '#52BE80',
          yAxisID: 'y2',
          data: []
        }, {
          type: 'bar',
          label: this.$t('lang.label.bouncerate'),
          hidden: true,
          borderColor: 'RGB(251,0,98,1)',
          backgroundColor: 'RGBA(251,0,98,0.51)',
          pointBackgroundColor: "rgba(220,220,220,1)",
          yAxisID: 'y2',
          data: []
        }],
        options: {
          responsive: true,
          reactive: true,
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
               ticks: {  
                // min: "2020/06/08",
                // max: "2020/06/20",
               },
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
      };
    },
  },
};
</script>

<style scoped>
.bar_code{
  width: 70%;
  display: flex;
  flex-direction:column;
}
.bar_code_row{
  display: flex;
}
</style>
