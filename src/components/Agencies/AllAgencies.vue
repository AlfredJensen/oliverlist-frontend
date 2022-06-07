<template>
  <section class="campaigns">
    <main class="mt-3">
      <div>
        <div class="row">
          <div class="col-sm-12">
            <div class="px-4 d-inline">
              <div
                class="ml-0 d-inline pl-2"
                v-for="(tab, key) in tabs"
                :key="key"
              >
                <span
                  type="button"
                  class="p-0 it-tabs pb-2"
                  :class="tab.id == tabSelected ? 'active border-primary' : ''"
                  @click="filterByClientStatusId(tab.id, tab.clientStatusId)"
                >
                  {{ tab.name }}
                </span>
              </div>
            </div>
            <section class="">
              <div class="row">
                <div class="col-12 bg-light pb-2">
                  <div class="px-4">
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
                        @click="addAgency"
                        type="submit"
                      >
                        <i class="icon-plus1"></i>
                        {{ $t("lang.button.addnewagency") }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <div
              id="actionsSearch"
              class="pt-2 pl-4 d-flex justify-content-between bd-highlight mb-3"
              v-if="!loading && agencies.list.length > 0"
            >
              <div class="bd-highlight">
                {{ $t("lang.label.results") }}:
                <small v-if="!total" class="ml-1 text-primary"
                  >{{ $t("lang.search.calculating") }}...</small
                >
                <strong v-else>{{ total }}</strong>
              </div>
              <div>
                <Pagination
                  v-if="!loading"
                  :total="total"
                  :totalpage="agencies.list.length"
                  :model="model"
                  color="primary"
                  :limit="true"
                  @changePage="changePage"
                  :key="paginationkey"
                ></Pagination>
              </div>
              <div>.</div>
            </div>

            <div class="px-4" style="overflow-x: scroll">
              <LoadingSpinner v-if="loading" />
              <Table
                v-if="!loading && agencies.list.length > 0"
                :key="keyresult"
                :headers="headers"
                :cols="cols"
                :data="agencies.list"
                :checkbox="false"
                :notselect="true"
                :model="model"
                @goToAgency="goToAgency"
              >
              </Table>
              <div v-if="!loading && agencies.list.length == 0">
                <div class="text-center w-100 mt-4">
                  <div class="alert alert-warning" role="alert">
                    {{ $t("lang.label.noresults") }}
                  </div>
                </div>
                <div class="text-center w-100 mt-4">
                  <img
                    src="@/assets/images/search-oliver3.png"
                    class="rounded mx-auto d-block"
                    width="200px"
                  />
                </div>
              </div>
            </div>
            <section></section>
          </div>
        </div>
      </div>
    </main>
  </section>
</template>
<script>
import { mapState, mapActions } from "vuex";
import Table from "@/components/Common/Table.vue";
import Pagination from "@/components/Common/Pagination.vue";
import { router } from "@/_helpers";
import { statusPointMixin, billingUtilsMixin } from "@/_mixins/";
import { clientsService } from "@/_services";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import moment from "moment";
import FilterSystem from "@/components/FilterSystem.vue";
import Tooltip from "@/components/Common/Tooltip.vue";

export default {
  data() {
    return {
      tabs: [
        {
          id: 1,
          name: this.$t("lang.button.all"),
          clientStatusId: 0,
        },
        {
          id: 2,
          name: this.$t("lang.appointments.proposal"),
          clientStatusId: 1,
        },
        {
          id: 3,
          name: this.$t("lang.appointments.outdated"),
          clientStatusId: 2,
        },
        {
          id: 4,
          name: this.$t("lang.appointments.pending"),
          clientStatusId: 3,
        },
        {
          id: 5,
          name: this.$t("lang.appointments.active"),
          clientStatusId: 4,
        },
        {
          id: 6,
          name: this.$t("lang.appointments.standby"),
          clientStatusId: 5,
        },
      ],
      tabSelected: 1,
      total: 0,
      keyresult: 0,
      paginationkey: 0,
      model: {},
      loading: false,
      lastfilter: false,
      currentPage: 1,
      filterkey: 2233,
      cantPerPage: 100,
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
      agencies: {},
      sort: "",
      dir: "",
      headers: [
        {
          label: this.$t("lang.column.status"),
          class: "overflowhide",
        },
        {
          label: this.$t("lang.column.client"),
          class: "overflowhide",
        },
        {
          label: this.$t("lang.column.name"),
          class: "overflowhide",
        },
        {
          label: this.$t("lang.column.lastname"),
          class: "overflowhide",
        },
        {
          label: this.$t("lang.column.email"),
          class: "overflowhide",
        },
        {
          label: this.$t("lang.column.phone"),
          class: "overflowhide",
        },
        {
          label: this.$t("lang.appointments.meetingprice"),
          class: "overflowhide",
        },
        {
          label: this.$t("lang.appointments.signatureexpirationdate"),
          class: "overflowhide",
        },
        {
          label: this.$t("lang.appointments.signedon"),
          class: "overflowhide",
        },
        {
          label: this.$t("lang.appointments.proposallink"),
          class: "overflowhide",
        },
        {
          label: "Domain Config",
          class: "overflowhide",
        },
        {
          label: "Landing Config",
          class: "overflowhide",
        },
        {
          label: this.$t("lang.label.team"),
          class: "overflowhide",
        },
        {
          label: this.$t("lang.label.billing"),
          class: "overflowhide",
        },
        {
          label: "Alert",
          class: "overflowhide",
        },
        {
          label: "Warmup Days",
          class: "overflowhide",
        },
      ],
      cols: [
        [
          {
            value: "client_status",
            class: "text-primary",
          },
        ],
        [
          {
            valua_label: "client_name",
            value_emit: "id",
            class: "text-primary",
            type: "emit",
            emit: "goToAgency",
          },
        ],
        [
          {
            value: "name",
            class: "text-primary",
          },
        ],
        [
          {
            value: "lastname",
            class: "text-primary",
          },
        ],
        [
          {
            value: "email",
            class: "text-primary",
          },
        ],
        [
          {
            value: "phone",
            class: "text-primary",
          },
        ],
        [
          {
            value: "meeting_price",
            class: "text-primary",
          },
        ],
        [
          {
            value: "signature_expiration_date",
            class: "text-primary",
            filter: "formatDate",
          },
        ],
        [
          {
            value: "signed_on",
            class: "text-primary",
            filter: "formatDate",
          },
        ],
        [
          {
            value_label: this.$t("lang.appointments.proposallink"),
            link: "proposal_link",
            type: "link",
            class: "cursor-pointer",
          },
        ],
        [
          {
            icons: [
              {
                icon_if: "domain_config_ready",
                icon_if_value: "1",
                icon_true: "icon-checkmark text-success",
                icon_false: "icon-warning text-warning",
              },
            ],
          },
        ],
        [
          {
            icons: [
              {
                icon_if: "landing_config_ready",
                icon_if_value: "1",
                icon_true: "icon-checkmark text-success",
                icon_false: "icon-warning text-warning",
              },
            ],
          },
        ],
        [
          {
            icons: [
              {
                icon_if: "team_config",
                icon_if_value: "1",
                icon_true: "icon-checkmark text-success",
                icon_false: "icon-warning text-warning",
                tooltip_false_value: "team_config_data",
              },
            ],
          },
        ],
        [
          {
            icons: [
              {
                icon_if: "billing_config",
                icon_if_value: "1",
                icon_true: "icon-checkmark text-success",
                icon_false: "icon-warning text-warning",
                tooltip_false_value: "billing_config_data",
              },
            ],
          },
        ],
        [
          { 
            icons: [
              {
                icon_if: "days_after_signed_on",
                icon_if_value: "1",
                icon_false: "icon-warning text-danger",
                tooltip_false_value: "days_after_signed_on_info",
              },
            ],
          },
        ],
         [
          {
            value: "warmup_days",
            class: "text-primary",
          },
        ],
      ],
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
    Table,
    Pagination,
  },
  mounted() {
    this.udpdateHeader("agencies");
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
  },

  created() {
    if (this.model.cantPerPage == undefined) {
      this.model.currentPage = 1;
      this.model.cantPerPage = this.cantPerPage;
    }

    this.search();
  },

  methods: {
    ...mapActions("header", {
      changeHeaderTab: "changeTab",
    }),
    ...mapActions("headertopbar", {
      setCurrentRoute: "setRoute",
      setCurrentRouteChild: "setRouteChild",
    }),
    changePage() {
      this.loading = true;
      clientsService.searchAgencies(this.model).then((response) => {
        response.list.forEach((item) => {
          // set domain_config_ready
          item.domain_config_ready = this.getConfigIsReady(item.domain_config);
          item.landing_config_ready = this.getConfigIsReady(
            item.landing_config
          );
        });
        this.agencies = response;
        this.loading = false;
        this.keyresult++;
      });
    },
    getConfigIsReady(configs) {
      if (configs == null) {
        return 0;
      }
      let isReady = 1;
      let config = JSON.parse(configs);
      config.forEach((item) => {
        Object.values(item).forEach((val) => {
          if (val == 0) {
            isReady = 0;
          }
        });
      });
      return isReady;
    },
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

    showEmptyImage() {
      return this.agencies.list.length == 0;
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

    refresh() {
      this.getAllByFilter({
        currentPage: this.currentPage,
        cantPerPage: this.cantPerPage,
        searchFilter: this.filtersSystem,
      }).then((response) => {});
    },

    filterByClientStatusId(tabId, clientStatusId) {
      this.tabSelected = tabId;
      this.model.clientStatusId = clientStatusId;
      this.search();
    },

    goToAgency(client_id, client_name) {
      // this.changeHeaderTab({ tab: "STATS" });
      // let agency = this.agencies.list.find((item) => item.id === client_id);
      // client_name = agency.client_name;
      // router.push({
      //   name: "agencies",
      //   params: { id: client_id.toString(), name: client_name.toString() },
      // });
      let url = "/agencies/" + client_id;
      window.open(url, "_blank");
    },

    addAgency() {
      this.changeHeaderTab({ tab: "SELECTED" });
      router.push({
        name: "agencies",
      });
    },

    search() {
      this.changePage();
      clientsService.searchAgenciesTotal(this.model).then((response) => {
        if (response !== undefined) {
          this.total = parseInt(response.total);
        }
      });
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
  },
};
</script>
