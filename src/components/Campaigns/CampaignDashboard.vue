<template>
  <section class="campaign">
    <LoadingSpinner v-if="loading" />
    <main class="animated fadeIn faster" v-if="!loading">
      <div class="view-dashboard"></div>
      {{ udpdateHeader("campaigns") }}
      <div class="">

  <div class="row" v-if="openwhy">
          <div class="col-md-6"></div>
          <div class="col-md-6 float-right bg-white">
            <h4>{{ $t("lang.campaigns_dashboard.help_us") }}</h4>
            <h6>{{ $t("lang.campaigns_dashboard.why_stop") }}</h6>
            <div class="container mt-4 mb-5">
              <div class="row">
                <div class="col-10">
                  <input
                    type="checkbox"
                    v-model="answerwhy.anothercampaign"
                    value="anothercampaign"
                    class="mt-1"
                  />
                  {{ $t("lang.campaigns_dashboard.anothercampaign") }}
                </div>
              </div>
              <div class="row mt-2">
                <div class="col-10">
                  <input
                    type="checkbox"
                    v-model="answerwhy.relaunchlater"
                    value="relaunchlater"
                    class="mt-1"
                  />
                  {{ $t("lang.campaigns_dashboard.relaunchlater") }}
                </div>
              </div>
              <div class="row mt-2">
                <div class="col-10">
                  <input
                    type="checkbox"
                    v-model="answerwhy.notresults"
                    value="notresults"
                    class="mt-1"
                  />
                  {{ $t("lang.campaigns_dashboard.notresults") }}
                </div>
              </div>
              <div class="row mt-2">
                <div class="col-10">
                  <input
                    type="checkbox"
                    v-model="answerwhy.notcontacts"
                    value="notcontacts"
                    class="mt-1"
                  />
                  {{ $t("lang.campaigns_dashboard.notcontacts") }}
                </div>
              </div>
              <div class="row mt-2">
                <div class="col-10">
                  <input
                    type="checkbox"
                    v-model="answerwhy.nottarget"
                    value="nottarget"
                    class="mt-1"
                  />
                  {{ $t("lang.campaigns_dashboard.nottarget") }}
                </div>
              </div>
              <div class="row mt-2">
                <div class="col-10">
                  <input
                    type="checkbox"
                    v-model="answerwhy.notmoney"
                    value="notmoney"
                    class="mt-1"
                  />
                  {{ $t("lang.campaigns_dashboard.notmoney") }}
                </div>
              </div>
              <div class="row mt-2">
                <div class="col-10">
                  <input
                    type="checkbox"
                    v-model="answerwhy.problems"
                    value="problems"
                    class="mt-1"
                  />
                  {{ $t("lang.campaigns_dashboard.problems") }}
                </div>
              </div>
              <div class="row mt-2">
                <div class="col-10">
                  <input
                    type="checkbox"
                    v-model="answerwhy.stoptouse"
                    value="stoptouse"
                    class="mt-1"
                  />
                  {{ $t("lang.campaigns_dashboard.stoptouse") }}
                </div>
              </div>
            </div>
            <button
              class="btn btn-danger btn-sm"
              v-if="this.model.campaign_status_id == 2"
              :disabled="
                !(
                  answerwhy.anothercampaign ||
                  answerwhy.relaunchlater ||
                  answerwhy.notresults ||
                  answerwhy.notcontacts ||
                  answerwhy.nottarget ||
                  answerwhy.notmoney ||
                  answerwhy.problems ||
                  answerwhy.stoptouse
                )
              "
              @click="cancelCampaign(selectedCampaignId)"
            >
              {{ $t("lang.button.cancelcampaign") }}
            </button>

            <button
              class="ml-2 btn btn-primary btn-sm"
              @click="openwhy = false"
            >
              {{ $t("lang.button.cancel") }}
            </button>
          </div>
        </div>
      
        <div class="bg-white">
          <div
            class="eff-blur"
            v-if="currentUser.role_id === '2' && checkBilling === true"
          ></div>
          <div class="">
            <div class="">
              <div class="pb-3">
                

                <div class="mr-4 mb-4 float-right">
                  <button
                    class="btn btn-primary btn-sm mr-2"
                    @click="deleteCampaign(selectedCampaignId)"
                  >
                    <i class="icon-folder-open-o"></i>
                    {{ $t("lang.campaigns_dashboard.archivecampaign") }}
                  </button>
                  <button
                    class="btn btn-primary btn-sm mr-2"
                    @click="copy(selectedCampaignId)"
                  >
                    <i class="icon-copy"></i>
                    {{ $t("lang.campaigns_dashboard.copycampaign") }}
                  </button>
                  <button
                    class="btn btn-success btn-sm mr-2"
                    v-if="
                      this.model.campaign_status_id != 2 &&
                      checkBilling === false
                    "
                    @click="playCampaign(selectedCampaignId)"
                  >
                    <i class="icon-play"></i>
                    {{ $t("lang.button.setlive") }}
                  </button>
                  <button
                    class="btn btn-danger btn-sm"
                    v-if="model.campaign_status_id == 2 && !openwhy"
                    @click="precancelCampaign(selectedCampaignId)"
                  >
                    <i class="icon-hand-stop-o"></i>
                    {{ $t("lang.button.cancelcampaign") }}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <CampaignEdit
            v-if="editcampaign"
            :selectedCampaignId="selectedCampaignId"
            :selectedCampaignName="selectedCampaignName"
          >
          </CampaignEdit>
        </div>

      

        <div
          class="eff-blur"
          v-if="currentUser.role_id === '2' && checkBilling === true"
          @click="alertShowCampaign()"
        ></div>
        <div class="effect-blur">
          <main class=" ">
            <component
              :is="CampaignTabComponent"
              :selCampaignId="selectedCampaignId"
              @changeCampaignTab="changeCampaignTab($event)"
            ></component>
          </main>
        </div>
      </div>
    </main>
  </section>
</template>
<script>
import {
  statusBadgeMixin,
  statusPointMixin,
  billingUtilsMixin,
  tabsMixin,
} from "@/_mixins/";
import { mapState, mapActions } from "vuex";
import { router } from "@/_helpers";
import moment from "moment";
import Header from "@/components/Header.vue";
import CampaignEdit from "@/components/AccountCreation/Steps/CampaignEdit.vue";
import LineChart from "@/components/Chart.vue";
import BubbleChart from "@/components/BubbleChart.vue";
import DoughnutChart from "@/components/DoughnutChart.vue";
import RadarChart from "@/components/RadarChart.vue";
import BarChart from "@/components/BarChart.vue";
import {
  opportunitiesService,
  usersService,
  campaignsService,
  regionsService,
  categoriesService,
} from "@/_services";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import CampaignStatistics from "@/components/Campaigns/CampaignStatistics.vue";
import Tasksoliver from "@/components/Campaigns/Tasksoliver.vue";
import MyCampaign from "@/components/Campaigns/MyCampaign.vue";
import Mailings from "@/components/Campaigns/Mailings.vue";
import Tutorial from "@/components/Tutorial.vue";
import jQuery from "jquery";
let $ = jQuery;

export default {
  data() {
    return {
      editcampaign: false,
      selectedCampaignTab: "EDIT",
      currentPage: 1,
      openwhy: 0,
      cantPerPage: 10,
      answerwhy: {},
      cantPerPageOptions: [5, 10, 20, 50, 100],
      selected: [],
      savedSteps: [],
      selectedSearch: [],
      selectedGoogle: [],
      searchFilter: "",
      day: "",
      date: "",
      datePickerConfig: {
        format: "DD-MM-YYYY",
        useCurrent: false,
        minDate: moment().startOf("day"),
      },
      period: {
        dateStar: "",
        dateEnd: "",
      },
      checkBilling: false,
      tabs: [
        {
          referencia: "EDIT",
          nombre: this.$t("lang.label.edit"),
          classActive: "active",
        },
        {
          referencia: "MYCAMPAIGN",
          nombre: this.$t("lang.label.mycampaign"),
          classActive: "",
        },
        {
          referencia: "TASKSOLIVER",
          planIdAccess: [2, 3],
          nombre: this.$t("lang.label.sent"),
          classActive: "",
        },
        {
          referencia: "STATISTICS",
          nombre: this.$t("lang.label.statistics"),
          classActive: "",
        },
      ],
    };
  },

  props: {
    selectedCampaignId: String,
    selectedCampaignName: String,
  },

  components: {
    BubbleChart,
    RadarChart,
    BarChart,
    DoughnutChart,
    LineChart,
    CampaignEdit,
    LoadingSpinner,
    CampaignStatistics,
    MyCampaign,
    Tasksoliver,
    Mailings,
    Tutorial
  },

  mixins: [statusBadgeMixin, statusPointMixin, billingUtilsMixin, tabsMixin],
  watch: {},

  computed: {
    ...mapState({
      loading: (state) => state.campaigns.loading,
      currentUser: (state) => state.authentication.user,
      model: (state) => state.campaigns.selected.data,
      headerTab: (state) => state.header.tab,
    }),

    toastNotificationData() {
      return this.$store.state.authentication.toastNotificationData;
    },
    CampaignTabComponent() {
      if (this.selectedCampaignTab === "STATISTICS") {
        return "CampaignStatistics";
      }
      if (this.selectedCampaignTab === "TASKSOLIVER") {
        return "Mailings";
      }
      if (this.selectedCampaignTab === "MYCAMPAIGN") {
        return "MyCampaign";
      }
      return false;
    },
  },

  updated() {
    // if( this.currentUser.role_id === '2'){
    //       this.getDataUserBilling();
    // }
  },

  created() {
    this.editcampaign = true;
    this.loadModel();
  },

  methods: {
    ...mapActions("campaigns", {
      getCampaignById: "getById",
      getCampaignStatsByIdAndRange: "getStatsByIdAndRange",
      changeCampaignStatus: "changeCampaignStatus",
    }),

    ...mapActions("header", {
      changeHeaderTab: "changeTab",
    }),

    checkPlan(item) {
      return true;
    },

    changeCampaignTab(index) {
      if (index > 0) this.editcampaign = false;
      else this.editcampaign = true;

      for (var i = 0; i < this.tabs.length; i++) {
        this.tabs[i]["classActive"] = "";
      }
      this.tabs[index]["classActive"] = "active";
      this.selectedCampaignTab = this.tabs[index]["referencia"];
    },

    ...mapActions("headertopbar", {
      setCurrentRoute: "setRoute",
      setCurrentRouteChild: "setRouteChild",
    }),

    udpdateHeader(route) {
      this.setCurrentRoute({ page: route });
      this.setCurrentRouteChild({ child: this.model.campaign.name });
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

    getNotSavedSteps() {
      this.savedSteps = this.model.campaign.step.split(",");
      var code = "<ul class='text-left mt-2 pl-4'>";

      if (
        this.savedSteps.indexOf(5) == -1 &&
        this.savedSteps.indexOf("5") == -1
      ) {
        code =
          code + "<li><strong class='text-capitalize'>" + this.$t("lang.button.parameters") + "</strong></li>";
      }
      if (
        this.savedSteps.indexOf(3) == -1 &&
        this.savedSteps.indexOf("3") == -1
      ) {
        code =
          code +
          "<li><strong>" +
          this.$t("lang.label.message") +
          "</strong></li>";
      }
      if (
        this.savedSteps.indexOf(4) == -1 &&
        this.savedSteps.indexOf("4") == -1
      ) {
        code =
          code +
          "<li><strong>" +
          this.$t("lang.label.tracking") +
          "</strong></li>";
      }
      code = code + "</ul>";
      return code;
    },

    allStepSaved() {
      this.savedSteps = this.model.campaign.step.split(",");
      return (
        (this.savedSteps.indexOf(1) >= 0 ||
          this.savedSteps.indexOf("1") >= 0) &&
        (this.savedSteps.indexOf(3) >= 0 ||
          this.savedSteps.indexOf("3") >= 0) &&
        (this.savedSteps.indexOf(4) >= 0 ||
          this.savedSteps.indexOf("4") >= 0) &&
        (this.savedSteps.indexOf(5) >= 0 || this.savedSteps.indexOf("5") >= 0)
      );
    },

    copy(campaign_id) {
      this.goToCopyCampaign(this.selectedCampaignId, this.selectedCampaignName);
    },

    playCampaign(campaign_id) {
      if (!this.allStepSaved()) {
        this.$swal({
          type: "warning",
          title: "Terminez la configuration de la campagne",
          html:
            "Les étapes suivantes n'ont pas encore été sauvegardé:" +
            this.getNotSavedSteps(),
          showCancelButton: false,
          confirmButtonColor: "#3085d6",
          confirmButtonText: this.$t("lang.button.editcampaign"),
          cancelButtonColor: "#d33a2c",
        }).then((result) => {
          if (result.value) {
            this.goToEditCampaign(
              this.selectedCampaignId,
              this.selectedCampaignName
            );
          }
        });
      } else {
        if (this.model.campaign.conn_activated != 1) {
          this.$swal({
            type: "warning",
            title: this.$t("lang.label.unlockyoursalesinboxadvanced"),
            text: this.$t("lang.label.youneedtosync"),
            showCancelButton: false,
            confirmButtonColor: "#3085d6",
            confirmButtonText: this.$t("lang.button.connectmyemail"),
            cancelButtonColor: "#d33a2c",
          }).then((result) => {
            if (result.value) {
              this.$router.push({
                path: "/settings-account?synchronisation=1",
              });
            }
          });
        } else {
          let activecampaign = false;
          if (this.checkBilling) {
            campaignsService.getActiveCampaigns().then((result) => {
              activecampaign = result.total;
            });
          }
          if (this.checkBilling && activecampaign > 0) {
            this.$swal({
              type: "warning",
              text: this.$t("lang.label.youcanonlyactivateone"),
              showCancelButton: true,
              showCancelButton: true,
              confirmButtonColor: "#3085d6",
              confirmButtonText: this.$t("lang.button.upgrade"),
              cancelButtonText: this.$t("lang.button.cancel"),
            }).then((result) => {
              if (result.value == true) {
                this.$router.push("/upgrade");
              }
            });
          } else {
            campaignsService.getActiveCampaigns().then((result) => {
              if (result) {
                if (
                  result.total >= this.toastNotificationData.campaignactivelimit
                ) {
                  this.$swal({
                    type: "warning",
                    // title: this.$t('lang.label.error'),
                    text: this.$t(
                      "lang.label.thenumberofactivecampaignsishigher"
                    ),
                    showConfirmButton: true,
                    confirmButtonText: this.$t("lang.label.changemyplan"),
                  }).then((result) => {
                    if (result.value == true) {
                      this.$router.push("/upgrade");
                    }
                  });
                } else {
                  this.$swal({
                    type: "warning",
                    title: this.$t("lang.label.areyousure"),
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    confirmButtonText: this.$t("lang.button.yes"),
                    cancelButtonColor: "#d33a2c",
                    cancelButtonText: this.$t("lang.button.cancel"),
                  }).then((result) => {
                    if (result.value) {
                      campaignsService
                        .changeStatus(campaign_id, 2)
                        .then((response) => {
                          this.changeCampaignStatus({
                            id: campaign_id,
                            campaign_status_id: 2,
                            campaign_status: "Active",
                          });
                          this.$swal({
                            type: "success",
                            title: this.$t("lang.label.great"),
                            text: "started campaign",
                            showConfirmButton: false,
                            timer: 2000,
                          });
                        })
                        .then((result) => {
                          this.$router.push("/dashboard");
                        });
                    }
                  });
                }
              } else {
                this.$swal({
                  type: "warning",
                  title: this.$t("lang.label.areyousure"),
                  showCancelButton: true,
                  confirmButtonColor: "#3085d6",
                  confirmButtonText: this.$t("lang.button.yes"),
                  cancelButtonColor: "#d33a2c",
                  cancelButtonText: this.$t("lang.button.cancel"),
                }).then((result) => {
                  if (result.value) {
                    campaignsService
                      .changeStatus(campaign_id, 2)
                      .then((response) => {
                        this.changeCampaignStatus({
                          id: campaign_id,
                          campaign_status_id: 2,
                          campaign_status: "Active",
                        });
                        this.$swal({
                          type: "success",
                          title: this.$t("lang.label.great"),
                          text: "started campaign",
                          showConfirmButton: false,
                          timer: 2000,
                        });
                      })
                      .then((result) => {
                        this.$router.push("/dashboard");
                      });
                  }
                });
              }
            });
          }
        }
      }
    },

    precancelCampaign(campaign_id) {
      this.$store.state.campaigns.modified = true;
      this.$swal({
        type: "warning",
        title: "Attention",
        showCancelButton: true,
        text: this.$t("lang.label.attentionallfreereminderswillbecancelled"),
        confirmButtonColor: "#3085d6",
        confirmButtonText: this.$t("lang.button.next"),
        cancelButtonColor: "#d33a2c",
        cancelButtonText: this.$t("lang.button.cancel"),
      }).then((result) => {
        if (!result.dismiss) this.openwhy = 1;
      });
    },
    cancelCampaign(campaign_id) {
      this.$store.state.campaigns.modified = true;
      this.$swal({
        type: "warning",
        title: this.$t("lang.label.areyousure"),
        text: this.$t("lang.label.attentionallfreereminderswillbecancelled"),
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        confirmButtonText: this.$t("lang.button.cancelcampaign"),
        cancelButtonColor: "#d33a2c",
        cancelButtonText: this.$t("lang.button.cancel"),
      }).then((result) => {
        if (result.value) {
          campaignsService
            .stopCampaign(campaign_id, 3, this.answerwhy)
            .then((response) => {
              this.changeCampaignStatus({
                id: campaign_id,
                campaign_status_id: 3,
                campaign_status: "Stopped",
              });
              this.$swal({
                type: "success",
                title: this.$t("lang.label.great"),
                text: this.$t("lang.campaigns_dashboard.cancel_confirm"),
                showConfirmButton: false,
                timer: 2000,
              });
            })
            .then((result) => {
              this.$router.push("/dashboard");
            });
        }
      });
    },
    deleteCampaign(campaign_id) {
      this.$store.state.campaigns.modified = true;
      this.$swal({
        type: "warning",
        title: this.$t("lang.label.areyousure"),
        text: this.$t("lang.label.archivecampaigntext"),
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        confirmButtonText: this.$t("lang.button.yes"),
        cancelButtonColor: "#d33a2c",
        cancelButtonText: this.$t("lang.button.cancel"),
      }).then((result) => {
        if (result.value) {
          campaignsService
            .stopCampaign(campaign_id, 4, this.answerwhy)
            .then((response) => {
              this.changeCampaignStatus({
                id: campaign_id,
                campaign_status_id: 4,
                campaign_status: "Deleted",
              });
              this.$swal({
                type: "success",
                title: this.$t("lang.label.great"),
                text: this.$t("lang.campaigns_dashboard.delete_confirm"),
                showConfirmButton: false,
                timer: 2000,
              });
            })
            .then((result) => {
              this.$router.push("/campaigns");
            });
        }
      });
    },

    changeTab(selectedTab) {
      if (this.selectedCampaignId === undefined && this.saved === 0) {
        this.$swal({
          type: "warning",
          title: this.$t("lang.button.areyousureyouwanttoleave"),
          text: this.$t("lang.button.youareabouttoleavewithoutsaving"),
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33a2c",
          confirmButtonText: this.$t("lang.button.yes"),
        }).then((result) => {
          if (result.value) {
            this.changeHeaderTab({ tab: selectedTab });
          }
        });
      } else {
        this.changeHeaderTab({ tab: selectedTab });
      }
    },

    loadModel() {
      if (this.selectedCampaignId) {
        this.getCampaignById({
          id: this.selectedCampaignId,
        });

        this.getCampaignStatsByIdAndRange({
          id: this.selectedCampaignId,
          startDate: new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            1
          )
            .toISOString()
            .slice(0, 10),
          endDate: new Date().toISOString().slice(0, 10),
        });
      }
    },

    goToCopyCampaign(campaign_id, campaign_name) {
      this.changeHeaderTab({ tab: "SELECTED" });
      router.push({
        name: "copyCampaign",
        params: { id: campaign_id, isCopy: true },
      });
    },
  },
};
</script>
<style >
.card:hover.not-effect.not-shadow {
  box-shadow: none !important;
  -webkit-box-shadow: none !important;
}
#downloadform3D input[type="submit"] {
  outline: 0;
  display: inline-block;
  padding: 6px 12px;
  margin: 0;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.42857143;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  -ms-touch-action: manipulation;
  touch-action: manipulation;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  border: 1px solid #ccc;
  border-radius: 4px;
  color: #fff !important;
  background-color: #337ab7 !important;
  border-color: #2e6da4 !important;
  margin-top: 15px;
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
.eff-blur + div.effect-blur {
  filter: blur(3px);
  -webkit-filter: blur(3px);
  -moz-filter: blur(3px);
  -o-filter: blur(3px);
  -ms-filter: blur(3px);
}
</style>