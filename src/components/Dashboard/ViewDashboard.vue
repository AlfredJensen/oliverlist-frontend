<template>
  <div>
    <LoadingSpinner v-if="loading" />
    <div class="view-dashboard" v-if="!loading">
      <div class="mx-4 mb-3 animated fadeIn faster">
        <div class="row mt-3 px-3" v-if="permissionFront() && !currentUser.team_role_id">
            <div class="col-md-3 bg-white card rounded p-4">
              <h6>{{ $t("lang.label.currentplan") }}</h6>
              <h3 class="text-primary mb-2" v-if="user.subscription_status_id != 0">Plan {{ plans[user.plan_id].name }}</h3>
              <h3 class="text-primary mb-2" v-else>Free</h3>
              <span v-if="user.plan_id <= 1">{{toastNotificationData.credits.total}} credits / {{$t("lang.label.month")}}</span>
              <span v-else v-html="$t('lang.planfeatures.unlimitedcontacts')"></span>
              <router-link  to="/upgrade"  class="btn btn-sm btn-primary mt-2" >{{ $t("lang.button.upgrade") }}</router-link>
            </div>
            <div class="col-md-3 bg-white card rounded p-4">
              <h6>{{ $t("lang.label.activecampaigns") }}</h6>
              <h1>{{this.dashboardTotals.campaigns_active}}/{{toastNotificationData.campaignactivelimit}}</h1>
              <p v-if="dashboardTotals.campaigns_active_team"><b>Total Team: </b>{{ this.dashboardTotals.campaigns_active_team }}</p>
              <router-link to="/campaigns"><span class="text-primary">{{ $t("lang.label.allcampaigns") }}</span></router-link>
            </div>
            <div class="col-md-3 bg-white card rounded p-4">
              <h6>{{ $t("lang.label.opportunities") }}</h6>
              <h1>{{ this.dashboardTotals.links_total }}</h1>
              <p v-if="dashboardTotals.links_total_team"><b>Total Team: </b>{{ this.dashboardTotals.links_total_team }}</p>
              <router-link to="/opportunities"><span class="text-primary">{{ $t("lang.label.allopportunities") }}</span></router-link>
            </div>
            <div class="col-md-3 bg-white card rounded p-4">
              <h6>{{ $t("lang.label.contacts") }}</h6>
              <h1>{{ dashboardTotals.unlockedcontacts }}</h1>
              <p v-if="dashboardTotals.unlockedcontacts_team"><b>Total Team: </b>{{ this.dashboardTotals.unlockedcontacts_team }}</p>
              <router-link to="/businesses"><span class="text-primary">{{ $t("lang.label.allcontacts") }}</span></router-link>
            </div>
        </div>
        <div class="row">
          <div class="col-sm-12 col-md-12 "
          :class="permissionFront() ? 'col-lg-8':'col-lg-12'">
           
            <div class="row mt-2">
              <div class="col-md-12">
                <div class="content-chart">
                  <div class="card no-border">
                    <div>
                      <div class="contenedor animated fadeIn faster">
                        <DashboardStatistics v-if="permissionFront() && !currentUser.team_role_id" />
                        <DashboardTeamLeader v-if="currentUser.team_role_id == 2"/>
                        <InvoiceViewer  v-if="!permissionFront()"  />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <hr class="solid" />
            <h5 v-if="permissionFront()">{{ $t("lang.label.activecampaigns") }}</h5>
            <LoadingSpinner v-if="loading" />
            <div v-if="!loading  && permissionFront()">
              <div v-if="campaigns.length > 0" class="row mt-2 contCamps">
                <div
                  v-for="(campaign, key) in campaigns"
                  v-if="key < campaignsLoadedIndex"
                  :key="key"
                  class="col-sm-12 col-md-6 col-lg-6 containersCampagner"
                >
                  <div
                    class="card mt-2 py-3 px-3 rounded-25 mb-auto card-campaign cd-info"
                  >
                    <a :href="'/campaigns/' + campaign.id">
                    <div class="row px-3 mb-2">
                    <div
                        class="d-flex justify-content-between align-items-center"
                      >
                        <h5 class="name-campaign">{{ campaign.name }}</h5>
                        <ul
                          v-if="campaign.contacts.length > 0"
                          class="wrapper-imgs"
                        >
                          <li
                            v-for="(contact, keycontact) in campaign.contacts"
                            :key="keycontact"
                          >
                            <img
                              :src="getBusinessPhoto(contact.photo)"
                              class="d-block imgmain rounded-circle wcontact"
                              :style="position(keycontact)"
                            />
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-md-12">
                          <h6 class="badge badge-primary">{{ campaign.owner_name }}</h6>
                          <div class="d-flex align-items-center pt-2">
                            <span :class="statusPoint(campaign.campaign_status)">{{
                              campaign.campaign_status
                            }}</span>
                            <i
                              class="icon-circle ml-2"
                              :class="statusPoint(campaign.campaign_status)"
                            ></i>
                          </div>
                          <div class="mt-1 mb-2 cant-opp">
                            <small>{{
                              campaign.totalOpps + " opportunités"
                            }}</small>
                          </div>
                        </div>
                      </div>
                    </a>
                  </div>
                </div>
                 <div class="text-center mt-2 w-100" >   
                  <h3 @click="loadMoreCampaign()" v-if="campaignsLoadedIndex < this.campaigns.length" class="icon-plus-circle cursor-pointer text-primary"></h3> 
                 </div>
                <div class="col-sm-12 col-md-6 col-lg-6 containersCampagner">
                  <div
                    class="card mt-2 py-3 px-3 no-border rounded-25 mb-auto card-add-campaign"
                  >
                    <router-link to="/campaigns">
                      <div class="h-100 w-100">
                        <div
                          class="d-flex justify-content-center align-items-center"
                          style="height: 140px"
                        >
                          <div
                            class="d-flex flex-column align-items-center justify-content-between"
                          >
                            <div class="camp-circle mb-3">
                              <i class="icon-plus1"></i>
                            </div>
                            <h6>{{ $t("lang.label.createanewcampaign") }}</h6>
                          </div>
                        </div>
                      </div>
                    </router-link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-sm-12 col-md-12 col-lg-4"  v-if="permissionFront()">
            <div class="mt-4">
              <div
                class="card not-effect not-shadow no-border "
              >
                <div class="row">
                  <div class="col-sm-12">
                    
                    <div
                      class="d-flex flex-column justify-content-center h-100 p-3"
                    >
                    <h5 class="font-weight-light text-primary">
                      {{ $t("lang.opportunities.tasks") }}
                      <label v-if="this.notifications.length > 0" 
                      :class="this.notifications.length > 0 ? 'badge-danger': 'badge-success'"
                      class="ease-in-out badge badge-danger">{{ this.notifications.length }}</label>
                    </h5>
                    </div>
                    </div>
                    </div>
                    </div>
                    </div>
            <div class="mt-0">
              <div
                class="card not-effect not-shadow no-border dash-notifications p-3"
              >
                <div class="row">
                  <div class="col-sm-12">
                    
                    <div
                      class="d-flex flex-column justify-content-center h-100 p-3"
                    >
                      <ul>
                        <li
                          v-for="(notification, key) in notifications"
                          :key="key"
                          class="activityLine border-left pb-2"
                        >
                          <div class="item-list-notif">
                            <span
                              class="content-icon"
                              :class="
                                statusFeedNotif(
                                  notification.notification_type_id
                                )
                              "
                              ><i class="icon-circle"></i>
                            </span>
                          </div>
                          <div
                            class="card no-border body-notification not-effect not-shadow ml-3"
                          >
                            <div class="d-flex justify-content-between">
                              <!-- <div class="font-weight-bold">{{ $t('lang.label.account') }}</div> -->

                              
                              <small
                                @click="goToX(notification)"
                                class="font-weight-bold cursor-pointer"
                              >
                                {{ getTranslation(notification.title) }}
                              </small>
                              <div class="ml-2 time">
                                <small class="cdarkgray">{{
                                  formatData(notification.created)
                                }}</small>
                              </div>
                            </div>
                            <small class="d-flex justify-content-between mt-2">
                              <blockquote class="text-muted">
                                {{ getTranslation(notification.message) }}
                              </blockquote>
                            </small>
                          </div>
                        </li>
                      </ul>
                      <div class="w-100 text-center pt-5"  v-if="this.notifications.length == 0">
                        <img src="@/assets/images/not-todo.png" class="mw-70">
                        <div class="mt-3 text-center">
                          <span
                          class="font-weight-light ft-1-5 text-center text-secondary"
                          >{{ $t('lang.label.donthavetasks') }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
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
import {
  statusBadgeMixin,
  statusPointMixin,
  statusFeedNotificationsMixin,
  formattersMixin,
} from "@/_mixins/";
import ContactsAvailable from "@/components/Campaigns/ContactsAvailable.vue";
import { mapState, mapActions } from "vuex";
import { router } from "@/_helpers";
import moment from "moment";
import LineChart from "@/components/Chart.vue";
import InvoiceViewer from "@/components/Common/InvoiceViewer.vue"; 
import Tutorial from "@/components/Tutorial.vue";

import {
  opportunitiesService,
  usersService,
  campaignsService,
  notificationService
} from "@/_services";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import DashboardStatistics from "@/components/Campaigns/DashboardStatistics.vue";
import DashboardTeamLeader from "@/components/Dashboard/TeamLeaderDashboard.vue";

export default {
  data() {
    return {
      currentPage: 1,
      cantPerPage: 10,
      tutorialvideo:999,
      openvideo:false,
      cantPerPageOptions: [5, 10, 20, 50, 100],
      searchFilter: "",
      currentDay: "",
      day: "",
      campaignsLoadedIndex:1,
      date: "",
      progress: 0,
      datePickerConfig: {
        format: "DD-MM-YYYY",
        useCurrent: false,
        minDate: moment().startOf("day"),
      },
      period: {
        dateStar: "",
        dateEnd: "",
      },
      notifications: [
        {
          title: "",
          message: "",
          created: "",
        },
      ],
      options: {
        responsive: true,
        maintainAspectRatio: true,
        devicePixelRatio: 2,
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
      },
      dashboardTotals: {},
      loadingDashboard: true,
      opportunitiesByStatus: {
        created: {
          total: "20",
        },
        positive: {
          total: "0",
        },
        negative: {
          total: "0",
        },
        do_not_contact: {
          total: "0",
        },
        out: {
          total: "0",
        },
      },
      clients: {},
      sortedNotifications: [
        {
          title: "",
          message: "",
          created: "",
        },
      ],
      dontActivedCreate: false,
    };
  },
  components: {
    LineChart,
    LoadingSpinner,
    DashboardStatistics,
    DashboardTeamLeader,
    ContactsAvailable,
    Tutorial,
    InvoiceViewer
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
      plans: (state) => state.plans.all,
    }),
    toastNotificationData() {
        return this.$store.state.authentication.toastNotificationData;
    },
  },

  created() {

    if(this.currentUser.team_role_id !== null && this.currentUser.team_role_id == 3 && this.currentUser.role_id != 4){
      this.goToOpportunities();
    }

    this.getData();

    if (this.clients === undefined) this.getCurrentClients();
    this.calculateProgress();
  },

  methods: {
    ...mapActions("campaigns", {
      getAllCampaigns: "getInfoCampaigns",
    }),

    ...mapActions("header", {
      changeHeaderTab: "changeTab",
    }),
    position(num) {
      let n = num * 15;
      return "right: " + n + "px;";
    },

    loadMoreCampaign(){
     this.campaignsLoadedIndex++
    },
    permissionFront(){
      return (this.currentUser.team_role_id == undefined || this.currentUser.team_role_id != 3) && this.currentUser.role_id != 4
    },
    isOnboardingVisible(){
      return this.user.subscription_status_id != 1 && !this.loadingDashboard && (this.dashboardTotals.unlockedcontacts == 0 || !this.getCampaignId() || this.dashboardTotals.engadedcontacts.length == 0 || !this.getIsEmailSync() || this.campaigns.length == 0);
    },
    getCampaignId(){
      if(this.dashboardTotals.allcampaigns && this.dashboardTotals.allcampaigns[0] !== undefined){
        return this.dashboardTotals.allcampaigns[0].id
      }
    },
    getIsEmailSync(){
      return this.dashboardTotals.email_sync
    },
    calculateProgress(ac, tc) {
      let a = ac;
      let t = tc;
      if (a != null && t != null && t != 0) {
        return Math.floor((a / t) * 100);
      }
    },

    searchCampaigns() {
      this.getAllCampaigns();
    },

    getData() {
      this.getDashboardData();

      this.getNotifications();
      if (this.campaigns === undefined) this.searchCampaigns();
    },

    getDashboardData() {
       

      opportunitiesService.getDashboardTotals().then((result) => {
        this.dashboardTotals = result;
        this.loadingDashboard = false;
          if(this.permissionFront() && this.dashboardTotals.cant > 0 && this.$route.fullPath == '/dashboardfirst'){
            this.$router.push('/checklist');
          }
        
      });
    },
    orderByAscNotifications(arr) {
      arr.sort(function (x, y) {
        var dateA = new Date(x.created),
          dateB = new Date(y.created);
        return dateB - dateA;
      });
      this.notifications = arr;
    },

    getNotifications() {
      notificationService.getAllTasks(1).then((result) => {
        if (result !== "") {
          this.orderByAscNotifications(result);
        } else {
          this.notifications = result;
        }
      });
    },

    getCurrentClients() {
      opportunitiesService.getClients().then((result) => {
        this.clients = result;
      });
    },

    getCurrentDay() {
      var d = new Date();
      var weekday = new Array(7);
      weekday[0] = this.$t("lang.label.sunday");
      weekday[1] = this.$t("lang.label.monday");
      weekday[2] = this.$t("lang.label.tuesday");
      weekday[3] = this.$t("lang.label.wednesday");
      weekday[4] = this.$t("lang.label.thursday");
      weekday[5] = this.$t("lang.label.friday");
      weekday[6] = this.$t("lang.label.saturday");
      return weekday[d.getDay()];
    },
    getCurrentDate() {
      var now = new Date();
      var months = [
        this.$t("lang.label.january"),
        this.$t("lang.label.frebruary"),
        this.$t("lang.label.march"),
        this.$t("lang.label.april"),
        this.$t("lang.label.may"),
        this.$t("lang.label.june"),
        this.$t("lang.label.july"),
        this.$t("lang.label.august"),
        this.$t("lang.label.september"),
        this.$t("lang.label.october"),
        this.$t("lang.label.november"),
        this.$t("lang.label.december"),
      ];
      var time =
        now.getUTCDate() +
        " " +
        months[now.getMonth()] +
        " " +
        now.getFullYear();
      return time;
    },
    goToBilling() {
      router.push({
        name: "billing",
      });
    },
    goToX(notification) {
     if(notification.entity_type == 'link' || notification.title.includes("Opportunité")){
        this.goToO(notification.ref_id);
      }else if(notification.entity_type == 'campaign' || notification.title.includes("Campagne")){
        this.goToC(notification.ref_id, notification.title);
      }
      return false;
    },
    goToO(link_id) {
      this.$store.state.opportunities.clicked[link_id] = true;
      router.push({
        name: "opportunity",
        params: { id: link_id.toString() },
      });
    },
    goToC(campaign_id, campaign_name) {
      campaign_name = campaign_name.split("Campagne : ");
      router.push({
        name: "campaigns",
        params: {
          id: campaign_id.toString(),
          name: campaign_name[1].toString(),
        },
      });
    },
    goToOpportunities() {
      router.push({
        name: "opportunities",
        query: { list: 'all' }
      });
    },
    goToCampaigns() {
      router.push({
        name: "campaigns"
      });
    },

    formatData(data) {
      let timeNotif = new Date(data);
      let today = moment();

      let hours = today.diff(timeNotif, "hours");
      let days = today.diff(timeNotif, "days");
      let weeks = today.diff(timeNotif, "weeks");

      if (days < 1) {
        data = moment(timeNotif, "YYYYMMDD").fromNow();
      } else if (days < 7) {
        data = days + " days ago";
      } else if (days < 30) {
        data = weeks + " weeks ago";
      } else {
        data = data = moment(timeNotif, "YYYYMMDD").fromNow();
      }
      return data;
    },
  },
};
</script>
<style >
.card:hover.not-effect.not-shadow {
  box-shadow: none !important;
  -webkit-box-shadow: none !important;
}
.dash-notifications {
  max-height: 800px;
  overflow-y: scroll;
}
.item-list-notif {
  /* background: #F4F4F5; */
  background: #fff;
  position: absolute;
  width: 30px;
  height: 35px;
  left: -15px;
}
.card.dash-notifications {
  background: #fff;
}
.dash-notifications .content-icon {
  position: absolute;
  left: 50%;
  top: 3px;
  transform: translateX(-50%);
  -webkit-transform: translateX(-50%);
  background: #f4f4f5;
  border-radius: 50%;
  /* border: 1px solid #8f8fa0; */
  color: #8f8fa0;
  width: 26px;
  height: 26px;
}
.dash-notifications .content-icon .icon-circle:before {
  font-size: 10px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  -webkit-transform: translate(-50%, -50%);
}
.dash-notifications .content-icon.blue {
  color: #5155ea;
  background: #d3d4f3;
}
.dash-notifications .content-icon.pink {
  color: #ff1bbf;
  background: #f6c9ea;
}
.dash-notifications .content-icon.green {
  color: #80da7e;
  background: #ddefdd;
}
.dash-notifications .content-icon.gray {
  color: #6e7178;
  background: #dddee1;
}
.card.body-notification {
  background: #fff;
}
.card.body-notification .time {
  min-width: fit-content;
}
.card-campaign .name-campaign {
  font-size: 16px;
}
.card-campaign .card-contacts .destacated {
  font-weight: 600;
  font-size: 1rem;
}
.card-campaign .card-contacts .small-number {
  font-size: 12px;
  color: #b3b3b3;
}
.card-campaign .card-contacts .progress {
  height: 0.5rem;
}
.card-campaign .card-contacts .content-bar {
  width: 100%;
  padding-top: 10px;
}
.card-campaign .card-contacts .progress-bar {
  background-color: #52be80;
}
.card-campaign .wcontact {
  background: lightgrey;
  width: 28px;
  height: 28px;
}
.card-campaign .wrapper-imgs {
  position: relative;
  width: 75px;
  height: 30px;
}
.card-campaign .wrapper-imgs img {
  position: absolute;
  top: 0px;
  border: 2px solid #f3eaf0;
}
.card-add-campaign {
  min-height: 175px;
  border: 3px dashed #e7e8f3 !important;
}
.camp-circle {
  height: 50px;
  width: 50px;
  background: #f6f8fa;
  border-radius: 50%;
  position: relative;
}
.camp-circle .icon-plus1 {
  color: #4f54a4;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  -webkit-transform: translate(-50%, -50%);
}
.card-campaign.cd-info {
  min-height: 175px;
}
.card-campaign .cant-opp {
  color: darkgrey;
}
</style>

