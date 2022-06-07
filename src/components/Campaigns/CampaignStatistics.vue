<template>
<div> 

    <div class=" bg-light border-bottom border-grey px-4 pt-3  mb-3">
          <div class="">
            <span
              @click="active('activity')"
              :class="isActive('activity')"
              type="button"
              class="it-tabs pb-2"
              >{{ $t("lang.label.activity") }}</span
            >
            <span
              @click="active('post')"
              :class="isActive('post')"
              type="button"
              class="it-tabs pb-2 ml-3"
              >{{ $t("lang.label.hierarchicallevel") }}</span
            >
            <span
              @click="active('region')"
              :class="isActive('region')"
              type="button"
              class="it-tabs pb-2 ml-3"
              >{{ $t("lang.label.location") }}</span
            >
            <span
              @click="active('google')"
              :class="isActive('google')"
              type="button"
              class="it-tabs pb-2 ml-3"
              >{{ $t("lang.label.industry") }}</span
            >
          </div>

        </div>
    <div class="row">
      <div class="col-12">

        <div class="">
          <div class="float-left ml-4 mb-4">
            <date-picker
              id="startDatePicker"
              class=""
              v-model="range.startDate"
              :config="datePickerConfig"
              placeholder="Start Date"
            ></date-picker>
          </div>
          <div class="float-left ml-2">
            <date-picker
              id="endDatePicker"
              class=""
              v-model="range.endDate"
              :config="datePickerConfigEndDate"
              placeholder="End Date"
            ></date-picker>
          </div>
          <div class="float-left ml-2">
            <button
              class="btn-sm p-2 px-3 btn btn-success"
              @click="loadRangeStats()"
              style="width: 100%"
            >
              <i class="icon-calendar-check-o mr-2"></i>
              <small>
                {{ $t("lang.button.filter") }}
              </small>
            </button>
          </div>
        </div>
      </div>
    </div>

    <ActivityTable
      v-if="tab != 'activity'"
      :campaignId="selCampaignId"
      :dateFrom="range.startDate"
      :dateTo="range.endDate"
      :tab="tab"
      :key="activityTableId"
    />

    <LoadingSpinner v-if="loadingStats && tab == 'activity'" />

    <div
      class="animated fadeIn faster"
      v-if="!loadingStats && tab == 'activity'"
    >
      <div class="row">
        <div class="col-xl-2 col-sm-6 mb-4 offset-xl-1" >
          <div class="card border-left-warning shadow h-100 py-2">
            <div class="card-body">
              <div class="row no-gutters align-items-center">
                <div class="col mr-2">
                  <div
                    class="text-xs font-weight-bold text-uppercase mb-1"
                    style="color: #8580f2"
                  >
                    {{ $t("lang.label.contacted") }}
                  </div>
                  <span class="h5 mb-0 mr-1 font-weight-bold text-gray-800"
                    >{{ this.stats.activity.emails_sent }}
                  </span>
                </div>
                <div class="col-auto">
                  <i class="fas fa-comments fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-xl-2 col-sm-6 mb-4 ">
          <div class="card border-left-success shadow h-100 py-2">
            <div class="card-body">
              <div class="row no-gutters align-items-center">
                <div class="col mr-2">
                  <div
                    class="text-xs font-weight-bold text-uppercase mb-1"
                    style="color: #adc6f4"
                  >
                    {{ $t("lang.label.delivered") }}
                  </div>
                  <span
                    class="h5 mb-0 mr-1 font-weight-bold text-gray-800"
                    v-html="getsentrate()"
                  ></span>
                  <span class="h6 mb-0 font-weight-light text-gray-800"
                    >({{ this.stats.activity.emails_sent - this.stats.activity.bounce_total }})</span
                  >
                </div>
                <div class="col-auto">
                  <i class="fas fa-dollar-sign fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-xl-2 col-sm-6 mb-4">
          <div class="card border-left-warning shadow h-100 py-2">
            <div class="card-body">
              <div class="row no-gutters align-items-center">
                <div class="col mr-2">
                  <div
                    class="text-xs font-weight-bold text-uppercase mb-1"
                    style="color: #52be80"
                  >
                    {{ $t("lang.label.openedemails") }}
                  </div>
                  <span
                    class="h5 mb-0 mr-1 font-weight-bold text-gray-800"
                    v-html="getopenrate()"
                  ></span>
                  <span class="h6 mb-0 font-weight-light text-gray-800"
                    >({{ this.stats.activity.emails_opened }})</span
                  >
                </div>
                <div class="col-auto">
                  <i class="fas fa-comments fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-xl-2 col-sm-6 mb-4">
          <div class="card border-left-info shadow h-100 py-2">
            <div class="card-body">
              <div class="row no-gutters align-items-center">
                <div class="col mr-2">
                  <div
                    class="text-xs font-weight-bold text-uppercase mb-1"
                    style="color: #fb0062"
                  >
                    {{ $t("lang.label.clicked") }}
                  </div>
                  <div class="row no-gutters align-items-center">
                    <div class="col-auto">
                      <span
                        class="h5 mb-0 mr-1 font-weight-bold text-gray-800"
                        v-html="getsessionrate()"
                      ></span>
                      <span class="h6 mb-0 mr-3 font-weight-light text-gray-800"
                        >({{ this.stats.activity.activity_total }})</span
                      >
                    </div>
                  </div>
                </div>
                <div class="col-auto">
                  <i class="fas fa-clipboard-list fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-xl-2 col-sm-6 mb-4">
          <div class="card border-left-warning shadow h-100 py-2">
            <div class="card-body">
              <div class="row no-gutters align-items-center">
                <div class="col mr-2">
                  <div
                    class="text-xs font-weight-bold text-uppercase mb-1"
                    style="color: #808080"
                  >
                    {{ $t("lang.label.answered") }}
                  </div>
                  <span
                    class="h5 mb-0 mr-1 font-weight-bold text-gray-800"
                    v-html="getanswerrate()"
                  ></span>
                  <span class="h6 mb-0 font-weight-light text-gray-800"
                    >({{ this.stats.activity.email_response_total }})</span
                  >
                </div>
                <div class="col-auto">
                  <i class="fas fa-comments fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-xl-2 col-sm-6 mb-4" v-if="false">
          <div class="card border-left-warning shadow h-100 py-2">
            <div class="card-body">
              <div class="row no-gutters align-items-center">
                <div class="col mr-2">
                  <div
                    class="text-xs font-weight-bold text-uppercase mb-1"
                    style="color: #808080"
                  >
                    {{ $t("lang.label.bounce") }}
                  </div>
                  <span
                    class="h5 mb-0 mr-1 font-weight-bold text-gray-800"
                    v-html="getbouncerate()"
                  ></span>
                  <span class="h6 mb-0 font-weight-light text-gray-800"
                    >({{ this.stats.activity.bounce_total }})</span
                  >
                </div>
                <div class="col-auto">
                  <i class="fas fa-comments fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row mt-4 mx-4">
        <div class="col-md-12">
          <div class="content-chart">
            <div class="card">
              <LoadingSpinner v-if="loadingStats" />
              <div v-if="!loadingStats">
                <line-chart
                  :width="300"
                  :height="100"
                  :chart-data="multiaxis"
                  :options="multiaxis.options"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="contenedor animated fadeIn faster d-none">
      <div
        class="eff-blur"
        v-if="currentUser.role_id === '2' && checkBilling === true"
      ></div>
      <div class="effect-blur">
        <h2 class="title py-2">{{ $t("lang.label.interestlevels") }}</h2>
        <div class="row mt-2">
          <div class="col-md-4">
            <div class="content-chart">
              <div class="card no-border">
                <LoadingSpinner v-if="loadingStats" />
                <div v-if="!loadingStats">
                  <h5 class="title py-2 text-center">
                    {{ $t("lang.label.industry") }}
                  </h5>
                  <radar-chart
                    class="py-2"
                    :chartdata="industry"
                    :options="industry"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="content-chart">
              <div class="card no-border">
                <LoadingSpinner v-if="loadingStats" />
                <div v-if="!loadingStats">
                  <h5 class="title py-2 text-center">
                    {{ $t("lang.label.hierarchicallevel") }}
                  </h5>
                  <radar-chart
                    class="py-2"
                    :chartdata="hierarchicallevel"
                    :options="hierarchicallevel.options"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="content-chart">
              <div class="card no-border">
                <LoadingSpinner v-if="loadingStats" />
                <div v-if="!loadingStats">
                  <h5 class="title py-2 text-center">
                    {{ $t("lang.label.area") }}
                  </h5>
                  <radar-chart
                    class="py-2"
                    :chartdata="area"
                    :options="area.options"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="contenedor animated fadeIn faster d-none">
        <h2 class="title py-2">{{ $t("lang.label.websiteactivity") }}</h2>
        <div class="row mt-2">
          <div class="col-md-4 d-none">
            <div class="card py-2 px-3 no-border mb-auto">
              <h5 class="title py-2 text-center">
                {{ $t("lang.label.topurl") }}
              </h5>
              <div class="table"></div>
            </div>
          </div>
          <div class="col-md-4 d-none">
            <div class="content-chart">
              <div class="card no-border">
                <LoadingSpinner v-if="loadingStats" />
                <div v-if="!loadingStats">
                  <h5 class="title py-2 text-center">
                    {{ $t("lang.label.sessionquantity") }}
                  </h5>
                  <doughnut-chart
                    class="py-2"
                    :chartdata="sessionquantity"
                    :options="sessionquantity.options"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-4 d-none">
            <div class="content-chart">
              <div class="card no-border">
                <LoadingSpinner v-if="loadingStats" />
                <div v-if="!loadingStats">
                  <h5 class="title py-2 text-center">
                    {{ $t("lang.label.sessionsduration") }}
                  </h5>
                  <doughnut-chart
                    class="py-2"
                    :chartdata="timesessions"
                    :options="timesessions.options"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { statusBadgeMixin, statusPointMixin } from "@/_mixins/";
import { mapState, mapActions } from "vuex";
import { router } from "@/_helpers";
import moment from "moment";
import Header from "@/components/Header.vue";
import LineChart from "@/components/Chart.vue";
import BubbleChart from "@/components/BubbleChart.vue";
import DoughnutChart from "@/components/DoughnutChart.vue";
import RadarChart from "@/components/RadarChart.vue";
import ActivityTable from "@/components/Campaigns/ActivityTable.vue";
import BarChart from "@/components/BarChart.vue";
import Tutorial from "@/components/Tutorial.vue";
import {
  businessContactService,
  opportunitiesService,
  usersService,
  campaignsService,
  regionsService,
  categoriesService,
} from "@/_services";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import CampaignStatistics from "@/components/Campaigns/CampaignStatistics.vue";
import MyCampaign from "@/components/Campaigns/MyCampaign.vue";
export default {
  data() {
    return {
      tab: "activity",
      checkBilling: false,
      activityTableId: 1,
      currentPage: 1,
      cantPerPage: 50,
      cantPerPageOptions: [5, 10, 20, 50, 100],
      selected: [],
      selectedSearch: [],
      selectedGoogle: [],
      searchFilter: "",
      day: "",
      date: "",
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

      range: {
        startDate: moment().subtract(7, "days").format("YYYY-MM-DD"),
        endDate: moment().format("YYYY-MM-DD"),
      },
      chartdata: {
        labels: "",
        datasets: [
          {
            label: "Clicks",
            type: "line",
            fill: "false",
            pointBorderWidth: 5,
            backgroundColor: "#36a2eb",
            borderColor: "#36a2eb",
            data: "",
          },
          {
            label: this.$t("lang.label.answers"),
            type: "line",
            fill: "false",
            pointBorderWidth: 5,
            backgroundColor: "#ff6384",
            borderColor: "#ff6384",
            data: "",
          },
        ],
        options: {
          responsive: true,
          maintainAspectRatio: true,
          devicePixelRatio: 2,
          title: {
            display: true,
            text: "Exemple",
          },
        },
      },

      multiaxis: {
        labels: [],
        datasets: [
          {
            type: "bar",
            label: this.$t("lang.label.contacted"),
            borderColor: "RGB(133,128,242,1)",
            backgroundColor: "RGBA(133,128,242,0.51)",
            pointBackgroundColor: "rgba(220,220,220,1)",
            yAxisID: "y2",
            data: [],
          },
          {
            type: "bar",
            label: this.$t("lang.label.delivered"),
            hidden: true,
            borderColor: "RGB(173,198,244,1)",
            backgroundColor: "RGBA(173,198,244,0.50)",
            pointBackgroundColor: "rgba(220,220,220,1)",
            yAxisID: "y2",
            data: [],
          },
          {
            type: "bar",
            label: this.$t("lang.label.openedemails"),
            hidden: true,
            borderColor: "rgba(255,255,255,1)",
            backgroundColor: "RGBA(82,190,128,0.48)",
            pointBackgroundColor: "rgba(220,220,220,1)",
            yAxisID: "y2",
            data: [],
          },
          {
            type: "bar",
            label: this.$t("lang.label.clicked"),
            hidden: true,
            borderColor: "RGB(251,0,98,1)",
            backgroundColor: "RGBA(251,0,98,0.51)",
            pointBackgroundColor: "rgba(220,220,220,1)",
            yAxisID: "y2",
            data: [],
          },
          {
            type: "bar",
            label: this.$t("lang.label.answered"),
            hidden: true,
            borderColor: "#808080",
            backgroundColor: "#808080",
            pointBackgroundColor: "#808080",
            yAxisID: "y2",
            data: [],
          },
        ],
        options: {
          responsive: true,
          title: {
            display: true,
            text: this.$t("lang.label.activity"),
          },

          scales: {
            yAxes: [
              {
                type: "linear",
                id: "y1",
                position: "right",
                display: true,
                gridLines: {
                  drawOnChartArea: false,
                },
                ticks: {
                  beginAtZero: true,
                },
              },
              {
                type: "linear",
                id: "y2",
                position: "left",
                display: true,
                ticks: {
                  beginAtZero: true,
                },
              },
            ],
            xAxes: [
              {
                ticks: {
                  // min: "2020/06/08",
                  // max: "2020/06/20",
                },
                type: "time",
                time: {
                  unit: "day",
                },
                stacked: false,
                offset: true,
                gridLines: {
                  display: false,
                },
              },
            ],
          },
        },
      },
      industry: {
        labels: ["Real Estate", "Construction", "Accounting", "Industry"],
        datasets: [
          {
            borderColor: ["#ff6384"],
            label: this.$t("lang.label.answers"),
            data: [2, 5, 7, 12],
          },
          {
            borderColor: ["#36a2eb"],
            label: "Tx Clicks",
            data: [22, 12, 67, 55],
          },
        ],
      },

      hierarchicallevel: {
        labels: ["Owner", "General Management", "Services Direction"],
        datasets: [
          {
            borderColor: ["#ff6384"],
            label: this.$t("lang.label.answers"),
            data: [3, 10, 4],
          },
          {
            borderColor: ["#36a2eb"],
            label: "Tx Clicks",
            data: [45, 13, 10],
          },
        ],
      },

      area: {
        labels: [
          "Ile de France",
          "Paca",
          "Bretagne",
          "Franche-Compté",
          "Bourgogne",
          "Nord",
        ],
        datasets: [
          {
            borderColor: ["#ff6384"],
            label: this.$t("lang.label.answers"),
            data: [3, 10, 4, 3, 10, 4],
          },
          {
            borderColor: ["#36a2eb"],
            label: "Tx Clicks",
            data: [45, 13, 10, 13, 10, 45],
          },
        ],
      },

      timesessions: {
        datasets: [
          {
            data: [10, 20, 40],
            backgroundColor: ["#ff6384", "#ff9f40", "#4bc0c0"],
            hoverBackgroundColor: ["#fbd2cd", "#fef5c9", "#d1e3f7"],
          },
        ],
        labels: ["0 - 2 min", "2 - 5 min", "+ 5 min"],
        option: {},
      },

      sessionquantity: {
        datasets: [
          {
            data: [10, 20, 40, 70, 40, 20],
            backgroundColor: [
              "#ffce56",
              "#36a2eb",
              "#185190",
              "#ff6384",
              "#ff9f40",
            ],
            hoverBackgroundColor: [
              "#fbd2cd",
              "#fef5c9",
              "#d1e3f7",
              "#fbd2cd",
              "#fef5c9",
            ],
          },
        ],
        labels: ["1", "2", "3", "4", "5+"],
        option: {},
      },

      datacollection: {
        labels: ["Data"],
        datasets: [
          {
            label: "Clicks",
            backgroundColor: "#f87979",
            pointBackgroundColor: "white",
            borderWidth: 1,
            pointBorderColor: "#249EBF",
            data: [
              {
                x: 100,
                y: 62,
                r: 25,
              },
              {
                x: 60,
                y: 30,
                r: 15,
              },
              {
                x: 40,
                y: 60,
                r: 5,
              },
              {
                x: 80,
                y: 80,
                r: 10,
              },
              {
                x: 20,
                y: 30,
                r: 25,
              },
              {
                x: 15,
                y: 80,
                r: 20,
              },
            ],
          },
        ],
        options: {
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                },
                gridLines: {
                  display: true,
                },
              },
            ],
            xAxes: [
              {
                ticks: {
                  beginAtZero: true,
                },
                gridLines: {
                  display: false,
                },
              },
            ],
          },
          legend: {
            display: true,
          },
          tooltips: {
            enabled: true,
            mode: "single",
            callbacks: {
              label: function (tooltipItems, data) {
                return "$" + tooltipItems.yLabel;
              },
            },
          },
          responsive: true,
          maintainAspectRatio: false,
          height: 200,
        },
      },
    };
  },

  props: {
    selCampaignId: String,
    selectedCampaignName: String,
  },

  components: {
    BubbleChart,
    RadarChart,
    ActivityTable,
    BarChart,
    DoughnutChart,
    LineChart,
    LoadingSpinner,
    Tutorial,
  },

  mixins: [statusBadgeMixin, statusPointMixin],

  mounted() {
    if (this.model !== undefined && this.model.campaign_status_id == 3) {
      this.range.endDate = this.model.campaign_status_date;
    }
  },
  updated() {
    // if( this.currentUser.role_id === '2'){
    //       this.getDataUserBilling();
    // }
  },

  computed: {
    user() {
      return this.$store.state.authentication.user;
    },

    ...mapState({
      currentUser: (state) => state.authentication.user,
      loadingStats: (state) => state.campaigns.loadingStats,
      stats: (state) => state.campaigns.stats.data,
      model: (state) => state.campaigns.selected.data,
      loadingContacts2: (state) => state.contacts.loading,
      contacts2: (state) => state.contacts.all2.data,
      headerTab: (state) => state.header.tab,
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
      if (this.contacts2 !== undefined && this.contacts2.total !== undefined) {
        return this.contacts2.total;
      } else {
        return 0;
      }
    },
  },

  watch: {
    loadingStats: function () {
      this.loadStatsData();
    },

    currentPage() {
      this.searchContacts2();
    },
    cantPerPage() {
      this.searchContacts2WithPageReset();
    },
  },

  created() {
    if(this.selCampaignId == undefined && this.$route.params.id != undefined){
      this.selCampaignId = this.$route.params.id
    }

    if (this.selCampaignId == undefined) {
      this.firstLoadRangeStats();
    }else{
      let startDate = this.user.creation_date.split(" ");
      this.range.startDate = startDate[0];
      this.loadRangeStats();
    }

    if (!this.loadingStats) {
      this.loadStatsData();
    }
    this.getContacts2();
  },

  methods: {
    ...mapActions("header", {
      changeHeaderTab: "changeTab",
    }),

    ...mapActions("campaigns", {
      getCampaignStatsByIdAndRange: "getStatsByIdAndRange",
    }),

    ...mapActions("contacts", {
      getAll2Contacts: "getAll2",
    }),
    getStatus() {
      if (this.model.campaign_status_id == 2) return "Active";

      if (this.model.campaign_status_id == 1) return "Pending";

      if (this.model.campaign_status_id == 3) return "Stopped";
    },
    updatevalues() {
      var startDatePk = document.getElementById("startDatePicker");
      var endDatePk = document.getElementById("endDatePicker");
      startDatePk.addEventListener("change", function () {});
    },
    isActive(active) {
      if (this.tab == active) return "active";
    },
    active(active) {
      this.tab = active;
    },
    getDataUserBilling() {
      this.checkBilling = this.checkPaymentMethodAndBudget();
    },
    alertShowCampaign() {
      this.$swal({
        type: "warning",
        title: "De nouvelles opportunités vous attendent !",
        text: "De nouvelles opportunités ont été générées depuis la fin de votre essai. Félicitations! Pour les découvrir, complétez votre profil de facturation dans la section dédiée à cet effet.",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33a2c",
        confirmButtonText: this.$t("lang.label.addpaymentmethod"),
      }).then((result) => {
        if (result.value) {
          this.$router.push("/settings-account");
        }
      });
    },

    getContacts2() {
      // this.searchContacts2();
    },
    getsentrate() {
      return this.getPercentage(
        this.stats.activity.emails_sent - this.stats.activity.bounce_total,
        this.stats.activity.emails_sent
      );
    },
    getsessionrate() {
      return this.getPercentage(
        this.stats.activity.activity_total,
        this.stats.activity.emails_sent
      );
    },
    getanswerrate() {
      return this.getPercentage(
        this.stats.activity.email_response_total,
        this.stats.activity.emails_sent
      );
    },
    getopenrate() {
      return this.getPercentage(
        this.stats.activity.emails_opened,
        this.stats.activity.emails_sent
      );
    },
    getbouncerate() {
      return this.getPercentage(
        this.stats.activity.bounce_total,
        this.stats.activity.emails_sent
      );
    },
    getPercentage(fraction, total) {
      if (total == 0) {
        return "-%";
      } else {
        var result = (fraction / total) * 100;
        result = parseFloat(result).toFixed(0);
        return result + "%";
      }
    },

    searchContacts2() {

      if (this.selCampaignId != undefined) {
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
      }).then((result) => (this.currentPage = 1));
    },

    loadStatsData() {
      if (!this.loadingStats) {
        this.multiaxis.labels = this.stats.activity_by_date.labels;
        this.multiaxis.datasets[0].data =
          this.stats.activity_by_date.emails_sent;
        this.multiaxis.datasets[1].data =
          this.stats.activity_by_date.emails_delivered;
        this.multiaxis.datasets[2].data =
         this.stats.activity_by_date.emails_opened;
        this.multiaxis.datasets[3].data =
          this.stats.activity_by_date.activity_total;
        this.multiaxis.datasets[4].data =
          this.stats.activity_by_date.email_response_total;
      }
    },
    validarDate() {
      let startDate = new Date(this.range.startDate);
      let endDate = new Date(this.range.endDate);
      if (startDate.getTime() > endDate.getTime()) {
        return true;
      } else {
        return false;
      }
    },
    firstLoadRangeStats() {
      this.getCampaignStatsByIdAndRange({
        id: this.selCampaignId != undefined ? this.selCampaignId : 0,
        startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          .toISOString()
          .slice(0, 10),
        endDate: new Date().toISOString().slice(0, 10),
      });
    },

    formatLastMailDate(date) {
      return date.split(" ")[0];
    },

    loadRangeStats() {
      if (this.validarDate() === true) {
        this.$swal({
          type: "warning",
          title: "Error!",
          text: "Start date should be less than end date. ",
          showCancelButton: false,
          confirmButtonColor: "#3085d6",
          confirmButtonText: "Close",
        });
      } else {
        this.getCampaignStatsByIdAndRange({
          id: this.selCampaignId != undefined ? this.selCampaignId : 0,
          startDate: this.range.startDate,
          endDate: this.range.endDate,
        });
        this.activityTableId++;
      }
    },
  },
};
</script>
<style>
.status-colors.positive {
  color: #61de4d;
}
.status-colors.paused {
  color: #babac2;
}
.status-colors.stopped {
  color: #ff6584;
}
.eff-blur {
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