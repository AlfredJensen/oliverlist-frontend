<template>
  <div class="pt-3">
    <LoadingSpinner v-if="loading" />
    <div class="row mb-4">
      <div class="w-100">
        <div class="animated fadeIn faster" v-if="!loading">
          <div v-if="this.model !== undefined">
            <h5 class="title py-2 pl-3">{{ $t("lang.label.mycampaign") }}</h5>
            <div class="progress-step">
              <ul class="progressbar progressbar2">
                <li>
                  <span class="btn-sm">
                    <i class="icon-circle" :class="getClass(2)"></i>
                    <p>{{ $t("lang.label.youraudience") }}</p>
                  </span>
                </li>
                <li>
                  <span class="btn-sm">
                    <i class="icon-circle" :class="getClass(5)"></i>
                    <p>{{ $t("lang.label.sent") }}</p>
                  </span>
                </li>
                <li>
                  <span class="btn-sm">
                    <i class="icon-circle" :class="getClass(3)"></i>
                    <p>{{ $t("lang.label.message") }}</p>
                  </span>
                </li>
                <li>
                  <span class="btn-sm">
                    <i class="icon-circle" :class="getClass(4)"></i>
                    <p>{{ $t("lang.label.tracking") }}</p>
                  </span>
                </li>
                <li>
                  <span class="btn-sm">
                    <i
                      class="icon-circle"
                      :class="statusPoint(getStatus())"
                    ></i>
                    <p>{{ getStatus() }}</p>
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="mt-0" v-if="!loading">
      <div class="row">
        <div class="col-sm-6">
          <div class="card mt-2">
            <div class="p-4 card-title-article">
              <h5>{{ $t("lang.label.parameters") }}</h5>
              <ul>
                <li class="my-2">
                  <span>{{ $t("lang.label.name") }} :</span>
                  <span class="ml-2">{{ this.model.campaign.name }}</span>
                </li>
                <li
                  class="my-2"
                  v-if="this.model.campaign.demo_url != undefined && this.model.campaign.demo_url != 'undefined' && this.model.campaign.demo_url != ''"
                >
                  <span>{{ $t("lang.label.demourl") }} :</span>
                  <span class="ml-2">{{ this.model.campaign.demo_url }}</span>
                </li>
                <li
                  v-if="
                    this.model.sending_days_selected != undefined &&
                    Object.keys(this.model.sending_days_selected).length > 0
                  "
                >
                  <span class="mr-2">{{ $t("lang.label.days") }}:</span>

                  <span
                    v-for="(item, key) in this.model.sending_days_selected"
                    class="badge mr-2 px-3"
                    :class="statusBadge('theme')"
                    >{{ $t("lang.sending_days." + item) }}
                  </span>

                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="col-sm-6">
          <div class="card mt-2">
            <div class="col-12">
              <h5 class="my-3">
                {{ $t("lang.label.contacts") }}
              </h5>
              <div class="row mt-2 mb-2">
                <ContactsAvailable :id="this.model.campaign.id">
                </ContactsAvailable>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row my-3">
        <div class="col-sm-12">
          <div class="card p-4 mt-2">
            <h5>{{ $t("lang.label.message") }}</h5>
            <EmailsPreview :model="model" />
          </div>
        </div>
        <div class="col-sm-6 hidden">
          <div class="card mt-2">
            <div class="p-4 card-title-article">
              <li class="my-2">
                <h5>{{ $t("lang.label.audience") }}</h5>
                <div class="row mt-4">
                  <div class="col-12">
                    <h6>{{ $t("lang.label.target") }}:</h6>
                    <div class="row mt-2 mb-2">
                      <div class="col-12 overflowy-scroll">
                        <div
                          v-if="
                            this.model.categories_search_words_selected !=
                              undefined &&
                            Object.keys(
                              this.model.categories_search_words_selected
                            ).length > 0
                          "
                        >
                          <span
                            v-for="(item, key) in this.model
                              .categories_search_words_selected"
                            class="badge mr-2 px-3"
                            :class="statusBadge('theme')"
                            >{{ item }}</span
                          >
                        </div>
                        <div v-else>
                          <span class="badge mr-2 px-3 btn-secondary">{{
                            $t("lang.label.all")
                          }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="row mt-4">
                  <div class="col-12">
                    <h6>{{ $t("lang.label.location") }}:</h6>
                    <div class="row mt-2 mb-2">
                      <div class="col-12 overflowy-scroll">
                        <div
                          v-if="
                            this.model.regions_selected != undefined &&
                            Object.keys(this.model.regions_selected).length > 0
                          "
                        >
                          <span
                            v-for="(item, key) in this.model.regions_selected"
                            class="badge mr-2 px-3"
                            :class="statusBadge('theme')"
                            >{{ item }}</span
                          >
                        </div>
                        <div v-else>
                          <span class="badge mr-2 px-3 btn-secondary">{{
                            $t("lang.label.all")
                          }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="row mt-4">
                  <div class="col-12">
                    <h6>{{ $t("lang.label.industry") }}:</h6>
                    <div class="row mt-2">
                      <div class="col-12 overflowy-scroll">
                        <div
                          v-if="
                            this.model.categories_google_selected !=
                              undefined &&
                            Object.keys(this.model.categories_google_selected)
                              .length > 0
                          "
                        >
                          <span
                            v-for="(item, key) in this.model
                              .categories_google_selected"
                            class="badge mr-2 px-3"
                            :class="statusBadge('theme')"
                            >{{ item }}</span
                          >
                        </div>
                        <div v-else>
                          <span class="badge mr-2 px-3 btn-secondary">{{
                            $t("lang.label.all")
                          }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="row mt-4">
                  <div class="col-12 overflowy-scroll">
                    <h6>{{ $t("lang.label.companysize") }}:</h6>
                    <div
                      v-if="
                        this.model.company_size_selected != undefined &&
                        Object.keys(this.model.company_size_selected).length > 0
                      "
                    >
                      <span
                        v-for="(item, key) in model.company_size_selected"
                        class="badge mr-2 px-3"
                        :class="statusBadge('theme')"
                        >{{ item }}</span
                      >
                    </div>
                    <div v-else>
                      <span class="badge mr-2 px-3 btn-secondary">{{
                        $t("lang.label.all")
                      }}</span>
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
              </li>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import ContactsAvailable from "@/components/Campaigns/ContactsAvailable.vue";
import {
  statusBadgeMixin,
  statusPointMixin,
  formattersMixin,
} from "@/_mixins/";
import { mapState, mapActions } from "vuex";
import { router } from "@/_helpers";
import moment from "moment";
import Header from "@/components/Header.vue";
import {
  opportunitiesService,
  usersService,
  campaignsService,
  regionsService,
  categoriesService,
} from "@/_services";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import EmailsPreview from "@/components/AccountCreation/Steps/Campaign/EmailsPreview.vue";

export default {
  data() {
    return {
      progress: 0,
      selectedCampaignTab: "",
      currentPage: 1,
      cantPerPage: 10,
      cantPerPageOptions: [5, 10, 20, 50, 100],
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

      industry: {
        labels: ["Real Estate", "Construction", "Accounting", "Industry"],
        datasets: [
          {
            borderColor: ["#ff6384"],
            label: this.$t("lang.label.engagements"),
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
            label: this.$t("lang.label.engagements"),
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
            label: this.$t("lang.label.engagements"),
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
    };
  },

  props: {
    selCampaignId: String,
    selCampaignName: String,
  },

  components: {
    LoadingSpinner,
    EmailsPreview,
    ContactsAvailable,
  },

  mixins: [statusBadgeMixin, statusPointMixin, formattersMixin],

  computed: {
    user() {
      return this.$store.state.authentication.user;
    },
    ...mapState({
      loading: (state) => state.campaigns.loading,
      currentUser: (state) => state.authentication.user,
      model: (state) => state.campaigns.selected.data,
    }),
  },
  created() {
    this.calculateProgress();
  },

  methods: {
    calculateProgress() {
      if (
        this.model.campaign.available_contacts != null &&
        this.model.campaign.total_contacts != null &&
        this.model.campaign.total_contacts != 0
      ) {
        return (this.progress = Math.floor(
          (this.model.campaign.available_contacts /
            this.model.campaign.total_contacts) *
            100
        ));
      }
    },
    getStatus() {
      if (this.model.campaign_status_id == 2) return "Active";

      if (this.model.campaign_status_id == 1) return "Pending";

      if (this.model.campaign_status_id == 3) return "Stopped";
    },
    getClass(step) {
      var savedSteps;

      savedSteps = this.model.campaign.step;

      if (step == 2) {
        if (this.model.campaign.total_contacts > 0) {
          return "text-success";
        }
        return "text-secondary";
      }

      if (savedSteps == null) return "text-secondary";

      if (
        savedSteps.indexOf(step) >= 0 ||
        savedSteps.indexOf(step.toString()) >= 0
      ) {
        return "text-success";
      }
      if (savedSteps == null) return "text-secondary";

      if (
        (savedSteps.indexOf(1) >= 0 || savedSteps.indexOf("1") >= 0) &&
        (savedSteps.indexOf(2) >= 0 || savedSteps.indexOf("2") >= 0) &&
        (savedSteps.indexOf(3) >= 0 || savedSteps.indexOf("3") >= 0) &&
        (savedSteps.indexOf(4) >= 0 || savedSteps.indexOf("4") >= 0) &&
        (savedSteps.indexOf(5) >= 0 || savedSteps.indexOf("5") >= 0)
      ) {
        return "text-success";
      }
      return "text-secondary";
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
.card-contacts .destacated {
  font-weight: 600;
  font-size: 16px;
  color: #52be80;
}
.card-contacts .small-number {
  font-size: 12px;
  color: #b3b3b3;
}
.card-contacts .progress {
  height: 0.5rem;
}
.card-contacts .content-bar {
  width: 40%;
  padding-top: 10px;
}
.card-contacts .progress-bar {
  background-color: #52be80;
}
</style>