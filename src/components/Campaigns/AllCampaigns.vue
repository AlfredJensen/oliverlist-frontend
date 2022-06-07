<template>
  <section class="campaigns">
    <main class="mt-3">
      <div>
        <div class="row">
          <div class="col-sm-12">
            <section class="">
              <div class="row">
              <div class="col-12 border-2 border-bottom border-grey ">
                 <div class="pb-3 px-4 ">
                   <Tutorial
                  id="GvLrDf3PuAU"
                  :linkText="$t('lang.label.howitworks')"
                  linkClass="small ml-2 mt-4"
                  :videoUrl="'https://www.youtube.com/embed/' + $t('lang.videos.mycampaign')"
                  playListurl="https://help.oliverlist.com/fr/category/campagnes-bn020l/"
                  />
                  </div>
              </div>
                <div class="col-12 bg-light pb-2">
                <div class="px-4">
                  
                  <div class="mt-2 float-left">
                    <FilterSystem
                      class="float-left"
                      :columns="campaignsColumns"
                      :reset="resetFilterSystem"
                      :sort="sort"
                      :dir="dir"
                      :filterSystem="filtersSystem"
                      :filterOldQuery="oldQuery"
                      :key="filterkey"
                      @callApi="callApi"
                      v-if="!showEmptyImage()"
                    />
                  </div>

                  <div
                    id="newcampaign"
                    class="top-area-opp mt-2 float-right d-none d-sm-block"
                  >
                    <button
                      class="
                        w-100
                        btn btn-sm btn-primary
                        themed-button
                        effect-btn
                      "
                      @click="addCampaign"
                      type="submit"
                    >
                      <i class="icon-plus1"></i>
                      {{ $t("lang.button.addnewcampaign") }}
                    </button>
                  </div>

                </div>
             
              </div>
              </div>
              <div class="mt-4 border-bottom border-grey">
        <div class="px-4 d-inline">
          <span
            type="button"
            class="p-0 it-tabs pb-2"
            :class="archived ? '':'active border-primary'"
            @click="refresh()"
             v-if="!showEmptyImage()"
          >
           {{ $t("lang.button.all") }}
          </span>
        </div>
        <div class="ml-0 d-inline">
          <span
            type="button" 
            v-if="!showEmptyImage()"
            class="p-0 it-tabs pb-2"
            :class="archived ? 'active border-primary':''"
            @click="archiveCampaigns()"
          >
           {{ $t("lang.campaigns_dashboard.campaignsarchived") }}
          </span>
        </div> 

              </div>
            </section>
            <section>
              <LoadingSpinner v-if="loading" />
              <div class="contTable animated fadeIn fast" v-if="!loading">
                <div class="p-2   px-4">
                  <div class="camp-blur-eff">
                    <div class="table-responsive">
                      <table
                        class="table table-hover card-style min-width-table"
                        v-if="!showEmptyImage()"
                      >
                        <thead>
                          <tr>
                            <th
                              scope="col"
                              style="white-space: nowrap"
                              class="cursor-pointer"
                              @click="orderBy('status')"
                            >
                              {{ $t("lang.label.status") }}
                              <span
                                v-if="
                                  sort ==
                                    'campaign_status_history.campaign_status_id.id' &&
                                  dir == 'asc'
                                "
                                class="icon-angle-double-up ml-2"
                              />
                              <span
                                v-if="
                                  sort ==
                                    'campaign_status_history.campaign_status_id.id' &&
                                  dir == 'desc'
                                "
                                class="icon-angle-double-down ml-2"
                              />
                              <span
                                v-if="
                                  sort !=
                                  'campaign_status_history.campaign_status_id.id'
                                "
                                class="icon-angle-down ml-2"
                              />
                            </th>
                            <th></th>
                            <th
                              v-if="currentUser.role_id == 1"
                              scope="col"
                              style="white-space: nowrap"
                            >
                              {{ $t("lang.label.emailsettings") }}
                            </th>
                            <th
                              scope="col"
                              style="white-space: nowrap"
                              class="cursor-pointer"
                              @click="orderBy('campaign')"
                            >
                              {{ $t("lang.column.campaign") }}
                              <span
                                v-if="sort == 'campaign.name' && dir == 'asc'"
                                class="icon-angle-double-up ml-2"
                              />
                              <span
                                v-if="sort == 'campaign.name' && dir == 'desc'"
                                class="icon-angle-double-down ml-2"
                              />
                              <span
                                v-if="sort != 'campaign.name'"
                                class="icon-angle-down ml-2"
                              />
                            </th>
                            <th
                              v-if="currentUser.role_id == 1"
                              scope="col"
                              style="white-space: nowrap"
                            >
                              {{ $t("lang.label.steps") }}
                            </th>
                            <th
                              scope="col"
                              style="white-space: nowrap"
                              class=""
                            >
                              {{ $t("lang.label.audience") }}
                            </th>
                            <th
                              scope="col"
                              style="white-space: nowrap"
                              class="cursor-pointer"
                              @click="orderBy('emailsPerDay')"
                            >
                              {{ $t("lang.column.budgetday") }}
                              <span
                                v-if="
                                  sort == 'campaign.emails_per_day' &&
                                  dir == 'asc'
                                "
                                class="icon-angle-double-up ml-2"
                              />
                              <span
                                v-if="
                                  sort == 'campaign.emails_per_day' &&
                                  dir == 'desc'
                                "
                                class="icon-angle-double-down ml-2"
                              />
                              <span
                                v-if="sort != 'campaign.emails_per_day'"
                                class="icon-angle-down ml-2"
                              />
                            </th>
                            <th scope="col" style="white-space: nowrap">
                              {{ $t("lang.label.newcontactsengagedtoday") }}
                            </th>
                            <th scope="col" style="white-space: nowrap">
                              {{ $t("lang.label.followupstoday") }}
                            </th>
                            <th scope="col" style="white-space: nowrap">
                              {{ $t("lang.label.totalcontactsengaged") }}
                            </th>
                            <th scope="col" style="white-space: nowrap">
                              {{ $t("lang.label.delivered") }}
                            </th>
                            <th scope="col" style="white-space: nowrap">
                              {{ $t("lang.label.openedemails") }}
                            </th>
                            <th scope="col" style="white-space: nowrap">
                              {{ $t("lang.label.clicked") }}
                            </th>
                            <th scope="col" style="white-space: nowrap">
                              {{ $t("lang.label.answered") }}
                            </th>
                            <th
                              v-if="currentUser.role_id == 1"
                              scope="col"
                              style="white-space: nowrap"
                            >
                              {{$t('lang.column.availablecontacts')}}
                            </th>
                            <th
                              v-if="currentUser.role_id == 1"
                              scope="col"
                              style="white-space: nowrap"
                            >
                              Total Contacts
                            </th>

                            <th scope="col" style="white-space: nowrap">
                              {{ $t("lang.column.owner") }}
                            </th>
                          </tr>
                        </thead>
                        <tbody v-if="!showEmptyImage()">
                          <tr
                            v-for="(campaign, key) in campaigns.list"
                            :key="key"
                            class="shadow-sm p-3 mb-5 bg-white rounded"
                          >
                            <td style="min-width: 150px">
                              <p>
                                <a
                                  class="cursor-pointer"
                                  @click="
                                    goToCampaign(campaign.id, campaign.name)
                                  "
                                >
                                  <i
                                    class="icon-circle ml-2"
                                    :class="
                                      statusPoint(campaign.campaign_status)
                                    "
                                  ></i>
                                  {{ campaign.campaign_status }}
                                </a>
                              </p>
                            </td>
                            <td>
                              <p
                                v-if="
                                  campaign.stats.emails_sent == 0 &&
                                  campaign.campaign_status_id == 2
                                "
                              >
                                <span class="badge badge-primary">{{
                                  $t("lang.label.imminentsending")
                                }}</span>
                              </p>
                              <p v-if="campaign.imported">
                                <small class="text-primary">
                                  <i class="icon-upload"></i>
                                  {{
                                    $t("lang.search.importedcontacts")
                                  }}</small
                                >
                              </p>
                            </td>
                            <td
                              v-if="currentUser.role_id == 1"
                              style="min-width: 150px"
                            >
                              <p v-if="campaign.conn">
                                <span
                                  class="icon-circle-campaign-green"
                                  v-if="campaign.conn_activated == 1"
                                >
                                  <i class="icon-check1"></i>
                                </span>
                                <span
                                  class="
                                    icon-circle-campaign-red
                                    cursor-pointer
                                  "
                                  v-if="
                                    campaign.conn_activated != 1 &&
                                    currentUser.role_id != 1
                                  "
                                  @click="goToSettings()"
                                >
                                  <i class="icon-remove cursor-pointer"></i>
                                </span>
                                <span
                                  class="icon-circle-campaign-red"
                                  v-if="
                                    campaign.conn_activated != 1 &&
                                    currentUser.role_id == 1
                                  "
                                >
                                  <i class="icon-remove"></i>
                                </span>
                              </p>
                            </td>

                            <td style="min-width: 150px">
                              <div
                                class="cursor-pointer"
                                style="color: #8580f2"
                              >
                                <a
                                  class="cursor-pointer"
                                  @click="
                                    goToCampaign(campaign.id, campaign.name)
                                  "
                                  >{{ campaign.name | capitalize }}
                                </a>
                              </div>
                            </td>
                            <td
                              v-if="currentUser.role_id == 1"
                              style="min-width: 150px"
                            >
                              <div class="progress-step">
                                <ul class="progressbar progressbar2">
                                  <li>
                                    <span class="btn-sm">
                                      <i
                                        class="icon-circle"
                                        :class="getClass(2, campaign)"
                                      ></i>
                                    </span>
                                  </li>
                                  <li>
                                    <span class="btn-sm">
                                      <i
                                        class="icon-circle"
                                        :class="getClass(5, campaign)"
                                      ></i>
                                    </span>
                                  </li>
                                  <li>
                                    <span class="btn-sm">
                                      <i
                                        class="icon-circle"
                                        :class="getClass(3, campaign)"
                                      ></i>
                                    </span>
                                  </li>
                                  <li>
                                    <span class="btn-sm">
                                      <i
                                        class="icon-circle"
                                        :class="getClass(4, campaign)"
                                      ></i>
                                    </span>
                                  </li>
                                </ul>
                              </div>
                            </td>
                            <td style="min-width: 300px">
                              <ContactsAvailable :id="campaign.id">
                              </ContactsAvailable>
                            </td>

                            <td style="min-width: 150px">
                              <a
                                class="cursor-pointer"
                                @click="
                                  goToCampaign(campaign.id, campaign.name)
                                "
                              >
                                <p>
                                  <span v-if="campaign.emails_per_day">
                                    {{ campaign.emails_per_day }}</span
                                  >
                                  <span
                                    v-else
                                    class="icon-remove"
                                    style="color: tomato"
                                  ></span>
                                </p>
                              </a>
                            </td>
                            <td style="min-width: 150px">
                              <a
                                class="cursor-pointer"
                                @click="
                                  goToCampaign(campaign.id, campaign.name)
                                "
                              >
                                <p>
                                  <span v-if="campaign.stats.new_emails_sent_today > 0">
                                    {{ campaign.stats.new_emails_sent_today }}
                                  </span>
                                  <span
                                    v-else
                                    class="icon-remove"
                                    style="color: tomato"
                                  ></span>
                                </p>
                              </a>
                            </td>
                            <td style="min-width: 150px">
                              <a
                                class="cursor-pointer"
                                @click="
                                  goToCampaign(campaign.id, campaign.name)
                                "
                              >
                                <p>
                                  <span v-if="campaign.stats.recurring_emails_sent_today > 0">
                                    {{ campaign.stats.recurring_emails_sent_today }}
                                  </span>
                                  <span
                                    v-else
                                    class="icon-remove"
                                    style="color: tomato"
                                  ></span>
                                </p>
                              </a>
                            </td>
                            <td style="min-width: 150px">
                              <a
                                class="cursor-pointer"
                                @click="
                                  goToCampaign(campaign.id, campaign.name)
                                "
                              >
                                <p>
                                  <span v-if="campaign.stats.total_contacts > 0">
                                    {{ campaign.stats.total_contacts }}
                                  </span>
                                  <span
                                    v-else
                                    class="icon-remove"
                                    style="color: tomato"
                                  ></span>
                                </p>
                              </a>
                            </td>
                            <td style="min-width: 150px">
                              <a
                                class="cursor-pointer"
                                @click="
                                  goToCampaign(campaign.id, campaign.name)
                                "
                              >
                                <p>
                                  <span v-if="campaign.stats.emails_sent > 0">{{
                                    getPercentage((campaign.stats.emails_sent - campaign.stats.bounce_total), campaign.stats.emails_sent)
                                  }}</span>
                                  <span
                                    v-else
                                    class="icon-remove"
                                    style="color: tomato"
                                  ></span>
                                </p>
                              </a>
                            </td>
                            <td style="min-width: 150px">
                              <a
                                class="cursor-pointer"
                                @click="
                                  goToCampaign(campaign.id, campaign.name)
                                "
                              >
                                <p>
                                  <span v-if="campaign.stats.emails_opened > 0">{{
                                    getPercentage(campaign.stats.emails_opened, campaign.stats.emails_sent)
                                  }}</span>
                                  <span
                                    v-else
                                    class="icon-remove"
                                    style="color: tomato"
                                  ></span>
                                </p>
                              </a>
                            </td>
                            <td style="min-width: 150px">
                              <a
                                class="cursor-pointer"
                                @click="
                                  goToCampaign(campaign.id, campaign.name)
                                "
                              >
                                <p>
                                  <span v-if="campaign.stats.activity_total > 0">{{
                                    getPercentage(campaign.stats.activity_total, campaign.stats.emails_sent)
                                  }}</span>
                                  <span
                                    v-else
                                    class="icon-remove"
                                    style="color: tomato"
                                  ></span>
                                </p>
                              </a>
                            </td>
                            <td style="min-width: 150px">
                              <a
                                class="cursor-pointer"
                                @click="
                                  goToCampaign(campaign.id, campaign.name)
                                "
                              >
                                <p>
                                  <span v-if="campaign.stats.email_response_total > 0">{{
                                    getPercentage(campaign.stats.email_response_total, campaign.stats.emails_sent)
                                  }} </span>
                                  <span
                                    v-else
                                    class="icon-remove"
                                    style="color: tomato"
                                  ></span>
                                </p>
                              </a>
                            </td>
                            <td
                              v-if="currentUser.role_id == 1"
                              style="min-width: 150px"
                            >
                              <p>
                                <span>{{ campaign.available_contacts }}</span>
                              </p>
                            </td>
                            <td
                              v-if="currentUser.role_id == 1"
                              style="min-width: 150px"
                            >
                              <p>
                                <span>{{ campaign.total_contacts }}</span>
                              </p>
                            </td>

                            <td style="min-width: 150px">
                              <a
                                class="cursor-pointer"
                                @click="
                                  goToCampaign(campaign.id, campaign.name)
                                "
                              >
                                <div class="">
                                  <p>
                                    <Tooltip
                                      :text="campaign.owner_name"
                                      :width="'auto'"
                                      v-if="user.role_id != 2"
                                    >
                                      <span class="circle-name mr-1"
                                        ><span class="text-uppercase">{{
                                          campaign.owner_name | firstLetters
                                        }}</span></span
                                      >
                                    </Tooltip>
                                    <span v-else class="badge badge-primary">
                                      {{ campaign.owner_name }}
                                    </span>
                                  </p>
                                </div>
                              </a>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <div
                        class="w-100 text-center pt-5"
                        v-if="!showEmptyImage() && this.campaigns.length == 0"
                      >
                        <span
                          class="
                            font-weight-light
                            ft-1-5
                            text-center text-secondary
                          "
                        >
                          {{ $t("lang.label.noresultsfound") }}
                        </span>
                      </div>
                      <div
                        class="w-100 text-center pt-5"
                        v-if="showEmptyImage()"
                      >
                        <img src="@/assets/images/launch.png" class="" />
                        <div class="mt-3 text-center">
                          <span
                            class="
                              font-weight-light
                              ft-1-5
                              text-center text-secondary
                            "
                            >{{
                              $t("lang.label.therearenocampaignsatthemoment")
                            }}</span
                          >
                        </div>
                        <div class="mt-3 text-center">
                          <div class="mr-2 d-inline">
                            <button
                              id="newcampaign"
                              class="
                                btn btn-sm btn-primary
                                themed-button
                                effect-btn
                              "
                              @click="addCampaign"
                              type="submit"
                            >
                              <i class="icon-plus1"></i>
                              {{ $t("lang.button.addnewcampaign") }}
                            </button>
                          </div>
                          <div class="d-inline pt-4">
                             <Tutorial
                              id="GvLrDf3PuAU"
                              :linkText="$t('lang.label.howitworks')"
                              linkClass="small ml-2"
                              :videoUrl="'https://www.youtube.com/embed/' + $t('lang.videos.mycampaign')"
                              playListurl="https://help.oliverlist.com/fr/category/campagnes-bn020l/"
                              />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    class="table-footer row mb-2 mt-2"
                    v-if="totalCampaigns > 0"
                  >
                    <div class="col-12 text-left mb-3">
                      <span class="font-weight-bold"
                        >{{ $t("lang.label.showing") }} {{ firstInPage }}
                        {{ $t("lang.label.to") }} {{ lastInPage }}
                        {{ $t("lang.label.of") }} {{ totalCampaigns }}
                        {{ $t("lang.label.campaigns") }}.</span
                      >
                    </div>
                    <div class="col-md-9 col-8">
                      <button
                        type="button"
                        class="btn btn-primary themed-button btnNavTabla"
                        :disabled="isFirstPage"
                        @click="currentPage--"
                      >
                        <span class="icon-angle-double-left mr-2" />{{
                          $t("lang.button.previous")
                        }}
                      </button>
                      <button
                        type="button"
                        class="btn btn-primary themed-button ml-2 btnNavTabla"
                        :disabled="isLastPage"
                        @click="currentPage++"
                      >
                        {{ $t("lang.button.next") }}
                        <span class="icon-angle-double-right ml-2" />
                      </button>
                    </div>
                    <div class="col-3 dropdown text-right">
                      <button
                        type="button"
                        class="
                          btn btn-secondary
                          dropdown-toggle
                          themed-button
                          btnNavTabla
                        "
                        id="dropdownCantPerPage"
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                        data-offset="10,20"
                      >
                        <span
                          >{{ cantPerPage }}
                          {{ $t("lang.button.perpage") }}</span
                        >
                      </button>
                      <div
                        class="dropdown-menu col-md-3 col-4"
                        aria-labelledby="dropdownCantPerPage"
                      >
                        <a
                          class="dropdown-item cursor-pointer"
                          v-for="(optionCant, index) in cantPerPageOptions"
                          :key="index"
                          @click="cantPerPage = optionCant"
                          >{{ optionCant }} {{ $t("lang.button.perpage") }}</a
                        >
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  </section>
</template>
<script>
import { mapState, mapActions } from "vuex";
import { router } from "@/_helpers";
import { statusPointMixin, billingUtilsMixin } from "@/_mixins/";
import { campaignsService, usersService } from "@/_services";
import Header from "@/components/Header.vue";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import moment from "moment";
import FilterSystem from "@/components/FilterSystem.vue";
import Tooltip from "@/components/Common/Tooltip.vue";
import ContactsAvailable from "@/components/Campaigns/ContactsAvailable.vue";
import Tutorial from "@/components/Tutorial.vue";

export default {
  data() {
    return {
      archived: false,
      lastfilter:false,
      currentPage: 1,
      filterkey:2233,
      cantPerPage: 30,
      cantPerPageOptions: [5, 10, 20, 50, 100],
      searchFilter: {},
      quickSearchFilter: "",
      selected: [],
      allSelected: false,
      campaignIds: [],
      opened: [],
      datePickerConfig: {
        format: "YYYY-MM-DD",
        useCurrent: false,
        minDate: moment().startOf("day"),
      },
      resetFilterSystem: false,
      campaignsColumns: [
        {
          name: this.$t("lang.label.campaignname"),
          name_: "campaign",
          type: "string",
          field: "campaign.name",
        },
        {
          name: this.$t("lang.column.budgetday"),
          name_: "emailsPerDay",
          type: "number",
          field: "campaign.emails_per_day",
        },
        {
          name: this.$t("lang.column.owner"),
          name_: "user",
          type: "string",
          field: 'CONCAT(user.name," ",user.lastname)',
        },
      ],
      sort: "",
      dir: "",
    };
  },

  mixins: [statusPointMixin, billingUtilsMixin],
  
  props: {
    filter: Object,
  },

  components: {
    LoadingSpinner,
    FilterSystem,
    Tooltip,
    ContactsAvailable,
    Tutorial
  },
  mounted() {
    this.udpdateHeader("campaigns");
  },

  watch: {
    currentPage() {
      if (this.resetFilterSystem == true) {
        this.searchCampaigns();
      } else {
        this.refresh();
      }
    },

    cantPerPage() {
      if (this.resetFilterSystem == true) {
        this.searchCampaignsWithPageReset();
      } else {
        this.refresh();
      }
    },
    routePage() {
      if (this.$route.fullPath == "/campaigns") {
        this.changeHeaderTab({ tab: "ALL" });
        this.setCurrentRouteChild({ child: "" });
      } else {
        if (this.$route.path.includes("/campaigns")) {
          this.changeHeaderTab({ tab: "STATS" });
        }
      }
    },
  },

  computed: {
    ...mapState({
      loading: (state) => state.campaigns.loading,
      filters: (state) => state.campaigns.allFilters,
      statusOptions: (state) => state.campaigns.statusOptions,
      campaigns: (state) => state.campaigns.all.data,
      filtersSystem: (state) => state.campaigns.filtersSystem,
      oldQuery: (state) => state.campaigns.oldQuery,
      currentUser: (state) => state.authentication.user,
      headerTab: (state) => state.header.tab,
    }),

    user() {
      return this.$store.state.authentication.user;
    },

    isFirstPage() {
      return this.currentPage === 1;
    },

    isLastPage() {
      return this.currentPage === this.pageCount;
    },

    pageCount() {
      var cantPage = this.totalCampaigns / this.cantPerPage;
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
        this.totalCampaigns >= this.firstInPage &&
        this.totalCampaigns <= this.currentPage * this.cantPerPage
      ) {
        return this.totalCampaigns;
      } else {
        return this.currentPage * this.cantPerPage;
      }
    },

    totalCampaigns() {
      if (this.campaigns !== undefined && this.campaigns.total !== undefined) {
        this.$store.state.campaigns.empty = false;
        return this.campaigns.total;
      } else {
        return 0;
      }
    },
    routePage() {
      if (this.$route.fullPath == "/campaigns") {
        this.changeHeaderTab({ tab: "ALL" });
        this.setCurrentRouteChild({ child: "" });
      } else {
        if (this.$route.path.includes("/campaigns")) {
          this.changeHeaderTab({ tab: "STATS" });
        }
      }
    },
  },

  created() {
    if(this.filter !== undefined){
      this.callApi(this.filter)
    }

    if (screen.width <= 480) {
      this.cantPerPage = 5;
      this.calculateProgress();
    }
    if (
      this.campaigns === undefined ||
      this.$store.state.campaigns.modified == true
    ) {
      if (this.filtersSystem.predicates) {
        this.refresh();
      } else {
        this.getCampaigns();
      }
      this.$store.state.campaigns.modified = false;
    }

    campaignsService.getStatusOptions().then((stateOptions) => {
      let status = {
        name: "Status",
        name_: "status",
        type: "list",
        list: stateOptions,
        field: "campaign_status_history.campaign_status_id",
      };
      this.campaignsColumns.push(status);
    });
  },

  methods: {
    ...mapActions("campaigns", {
      getAllCampaigns: "getAll",
      getAllByFilter: "getAllByFilter",
      setFilterSystem: "setFilterSystem",
      resetFiltersSystem: "resetFilterSystem",
    }),

    ...mapActions("header", {
      changeHeaderTab: "changeTab",
    }),
    ...mapActions("headertopbar", {
      setCurrentRoute: "setRoute",
      setCurrentRouteChild: "setRouteChild",
    }),

    udpdateHeader(route) {
      this.setCurrentRoute({ page: route });
      this.setCurrentRouteChild({ child: "" });
    },
    getClass(step, campaign) {
      var savedSteps;

      savedSteps = campaign.step;

      if (step == 2) {
        if (campaign.total_contacts > 0) {
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
        (savedSteps.indexOf(3) >= 0 || savedSteps.indexOf("3") >= 0) &&
        (savedSteps.indexOf(4) >= 0 || savedSteps.indexOf("4") >= 0) &&
        (savedSteps.indexOf(5) >= 0 || savedSteps.indexOf("5") >= 0)
      ) {
        return "text-success";
      }
      return "text-secondary";
    },

    calculateProgress(cant, campaign) {
      if (
        cant != null &&
        campaign.total_contacts != null &&
        campaign.total_contacts != 0
      ) {
        return (cant / campaign.total_contacts) * 100;
      }
    },

    showEmptyImage() {
      return this.$store.state.campaigns.empty;
    },
    getCampaigns() {
      this.searchCampaigns();
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
    openPopup() {
      this.$swal({
        title: this.$t("lang.button.howtocreateacampaing"),
        html: '<iframe class="w-100"  height="400" src="https://player.vimeo.com/video/470933187" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>',
        width: "800px",
        showCancelButton: true,
        showConfirmButton: false,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33a2c",
        cancelButtonText: this.$t("lang.button.cancel"),
      }).then((result) => {
        if (result.value) {
          this.$router.push("/settings-account");
        }
      });
    },
    convert(team) {
      return team.split(",");
    },
    orderBy(columnName) {
      let column = this.campaignsColumns.filter(
        (c) => c.name_ === columnName
      )[0];
      if (column != undefined) {
        if (this.sort == column.field) {
          if (this.dir == "desc") {
            this.dir = "asc";
          } else {
            this.dir = "desc";
          }
        } else {
          this.dir = "desc";
          this.sort = column.field;
        }
      }
    },

    searchCampaigns() {
      this.refresh();
    },
    searchCampaignsWithPageReset() {
      this.refresh();
    },
    confirmSearch() {
      this.resetFilterSystem = true;
      this.refresh();
    },
    archiveCampaigns() {
      this.archived = true;
      this.getAllByFilter({
        currentPage: this.currentPage,
        cantPerPage: this.cantPerPage,
        searchFilter: {
          archivecampaigns: true,
        },
      }).then((response) => {});
    },

    refresh() {
      this.archived = false;
      this.getAllByFilter({
        currentPage: this.currentPage,
        cantPerPage: this.cantPerPage,
        searchFilter: this.filtersSystem,
      }).then((response) => {});
    },

    goToCampaign(campaign_id, campaign_name) {
      this.changeHeaderTab({ tab: "STATS" });
      router.push({
        name: "campaigns",
        params: { id: campaign_id.toString(), name: campaign_name.toString() },
      });
    },

    goToSettings() {
      router.push({
        name: "settings-account",
        query: {
          synchronisation: "1",
        },
      });
    },

    addCampaign() {
      this.changeHeaderTab({ tab: "SELECTED" });
      router.push({
        name: "campaigns",
      });
    },

    selectAll: function () {
      this.campaignIds = [];
      if (this.allSelected) {
        for (campaign in this.list) {
          this.campaignIds.push(this.list[campaign].id.toString());
        }
      }
    },

    select: function () {
      this.allSelected = false;
    },
    toggle(campaign) {
      if (campaign.newChangeDate == undefined)
        campaign.newChangeDate = moment().format("YYYY-MM-DD");
      const index = this.opened.indexOf(campaign.id);
      if (index > -1) {
        this.opened.splice(index, 1);
      } else {
        this.opened.push(campaign.id);
      }
    },
    stopCampaign(campaign) {
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
            .scheduleStatusChange(campaign.id, 3, campaign.newChangeDate)
            .then((response) => {
              this.$swal({
                type: "success",
                title: this.$t("lang.label.great"),
                text: "stoped campaign",
                showConfirmButton: false,
                timer: 2000,
              });
            })
            .then((result) => {
              this.$set(campaign, "stop_date", campaign.newChangeDate);
              this.toggle(campaign);
            });
        }
      });
    },
    playCampaign(campaign) {
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
            .scheduleStatusChange(campaign.id, 2, campaign.newChangeDate)
            .then((response) => {
              this.$swal({
                type: "success",
                title: this.$t("lang.label.great"),
                text: "started campaign",
                showConfirmButton: false,
                timer: 2000,
              });
            })
            .then((result) => {
              this.$set(campaign, "start_date", campaign.newChangeDate);
              this.toggle(campaign);
            });
        }
      });
    },
    changeCampaignStatus(campaign) {
      if (campaign.campaign_status_id == 2) {
        this.stopCampaign(campaign);
      } else {
        this.playCampaign(campaign);
      }
    },

    callApi(filters) {
      this.lastfilter = filters
      this.setFilterSystem({ filters: filters }).then((result) => {
        this.resetFilterSystem = false;
        this.quickSearchFilter = "";
        this.searchFilter = filters;
        this.getAllByFilter({
          currentPage: this.currentPage,
          cantPerPage: this.cantPerPage,
          searchFilter: this.filtersSystem,
        }).then((result) => (this.currentPage = 1));
      });
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
  },
};
</script>

<style scoped>
.datepicker {
  transform: translate(0, 3.1em);
}
.min-width-table {
  min-width: 1300px;
}
.icon-circle.campaign {
  font-size: 10px;
}
.icon-circle-campaign-red {
  background-color: #ff6584;
  padding: 3px 0px;
  color: white;
  border-radius: 50%;
  text-align: center;
  font-weight: 600;
  width: 18px;
  height: 18px;
}
.icon-circle-campaign-green {
  background-color: #52be80;
  padding: 3px 0px;
  color: white;
  border-radius: 50%;
  text-align: center;
  font-weight: 600;
  width: 18px;
  height: 18px;
}
.camp-icons-notif {
  position: relative;
}
.camp-icons-notif .icon-circle.campaign {
  position: absolute;
  top: 0px;
  right: -4px;
}
.circle-refresh-icon {
  width: 25px;
  height: 25px;
  background: #000;
  position: relative;
  border-radius: 50%;
}
.icon-refresh.listcamp {
  font-size: 15px;
  position: absolute;
  color: #fff;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  -webkit-transform: translate(-50%, -50%);
}

.camp-blur {
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
.camp-blur + div.camp-blur-eff .table.table-hover {
  filter: blur(3px);
  -webkit-filter: blur(3px);
  -moz-filter: blur(3px);
  -o-filter: blur(3px);
  -ms-filter: blur(3px);
}
.campaigns .btn.btn-primary.themed-button.btn-sm {
  font-size: 0.7rem !important;
  padding: 0.375rem 0.75rem !important;
}
.card-contacts .destacated {
  font-weight: 600;
  font-size: 11px;
  color: #8580f2;
}
.card-contacts .small-number {
  font-size: 9px;
  color: #b3b3b3;
}
.card-contacts .progress {
  height: 0.3rem;
}
.card-contacts .content-bar {
  width: 100%;
  padding-top: 2px;
}
.card-contacts .progress-bar {
  background-color: #52be80;
}
</style>