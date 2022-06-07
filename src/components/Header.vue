<template>
  <header class="py-2 border-bottom border-grey">
    <div>
      <div class="row ml-1">
        <div class="col-sm-12 col-md-9 col-lg-9 d-flex">
          <div
            class="ml-3 d-inline it-tabs pb-2"
            :class="isPriorityTabActive ? 'active text-primary' : ''"
            v-if="isOpportunitiesRoute"
          ></div>
          <div
            class="ml-3 d-inline it-tabs pb-2"
            :class="
              isPriorityTabActive || isSelectedTabActive
                ? 'active text-primary'
                : ''
            "
            v-if="showAll"
          >
            <a
              class="cursor-pointer text-primary d-inline"
              @click="changeTab('ALL')"
            >
              <strong class="d-inline">{{ $t(getLabel) }}</strong>
            </a>
          </div>
          <div
            class="ml-3 d-inline it-tabs pb-2"
            :class="isCampaignTabActive ? ' text-primary' : ''"
            v-if="isCampaignsRoute"
          >
            <a class="cursor-pointer d-inline" @click="changeTab('ALL')">
              <strong class="d-inline">{{ $t(getLabel) }}</strong>
            </a>
          </div>

          <div
            v-if="showSelectedOpportunityName"
            class="ml-2 selected-tab d-inline"
          >
            <span class="icon-chevron-right d-inline"></span>
            <p class="mb-0 ml-2 d-inline">
              {{ selectedOpportunity.business.name }}
            </p>
          </div>
          <div
            v-if="showSelectedBusinessName"
            class="ml-2 selected-tab d-inline"
          >
            <span class="icon-chevron-right d-inline"></span>
            <p class="mb-0 ml-2 d-inline">
              {{ selectedBusiness.business.name }}
            </p>
          </div>
          <div v-if="showSelectedEmailName" class="ml-2 selected-tab d-inline">
            <span class="icon-chevron-right d-inline"></span>
            <p class="mb-0 ml-2 d-inline">Emails</p>
          </div>
          <div v-if="showCustomFields" class="ml-2 selected-tab d-inline">
            <span class="icon-chevron-right d-inline"></span>
            <p class="mb-0 ml-2 d-inline">Emails</p>
          </div>
        </div>
        <div class="col-sm-12 col-md-3 col-lg-3 text-right">
          <div
            class="wrapperMain"
            v-if="isOpportunitiesRoute && isPriorityTabActive"
          >
            <div class="dropdownHome">
              <div class="btn-group">
                <button
                  type="button"
                  class="btn btn-secondary dropdown-toggle"
                  :class="
                    isPriorityProductFilterSelected ? 'themed-button' : ''
                  "
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  <span class="mr-2" :class="productIconClass"></span>
                  <span
                    class="text-uppercase"
                    v-if="isPriorityProductFilterSelected"
                    >{{ priorityProductFilter.name }} opportunities</span
                  >
                  <span class="text-uppercase" v-else>SELECT CAMPAIGN</span>
                </button>
                <div class="dropdown-menu dropdown-menu scrolled-div">
                  <button
                    class="dropdown-item"
                    type="button"
                    v-for="(product, index) in products"
                    :key="index"
                    @click="setSelectedPriorityProductFilter(product)"
                  >
                    <span class="icon-cog1 mr-2"></span>
                    {{ product.name }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          class="ml-3 d-inline it-tabs"
          :class="isCampaignTabActive ? ' text-primary' : ''"
          v-if="isCampaignsRoute"
        >
          <a class="cursor-pointer d-inline" @click="changeTab('ALL')">
            <strong class="d-inline">{{ $t(getLabel) }}</strong>
          </a>
        </div>

        <div class="row ml-1">
          <div v-for="(tab, index) in tabs">
            <div
              v-if="testTab(index)"
              class="ml-3 d-inline it-tabs pb-2"
              :class="
                tabSelected === tab.referencia ? 'active text-primary' : ''
              "
            >
              <a class="cursor-pointer d-inline" @click="changeTab(index)">
                <strong class="d-inline">{{ tab.nombre }}</strong>
              </a>
            </div>
          </div>
        </div>
        <!-- v-if="isSettingAccountRoute && testTab(index)" -->
        <div
          v-if="showSelectedOpportunityName"
          class="ml-2 selected-tab d-inline"
        >
          <span class="icon-chevron-right d-inline"></span>
          <p class="mb-0 ml-2 d-inline">
            {{ selectedOpportunity.business.name }}
          </p>
        </div>
        <div v-if="showSelectedBusinessName" class="ml-2 selected-tab d-inline">
          <span class="icon-chevron-right d-inline"></span>
          <p class="mb-0 ml-2 d-inline">{{ selectedBusiness.business.name }}</p>
        </div>
        <div v-if="showSelectedEmailName" class="ml-2 selected-tab d-inline">
          <span class="icon-chevron-right d-inline"></span>
          <p class="mb-0 ml-2 d-inline">Emails</p>
        </div>
        <div v-if="showCustomFields" class="ml-2 selected-tab d-inline">
          <span class="icon-chevron-right d-inline"></span>
          <p class="mb-0 ml-2 d-inline">Emails</p>
        </div>
      </div>
      <div class="col-sm-12 col-md-3 col-lg-3 text-right">
        <div
          class="wrapperMain"
          v-if="isOpportunitiesRoute && isPriorityTabActive"
        >
          <div class="dropdownHome">
            <div class="btn-group">
              <button
                type="button"
                class="btn btn-secondary dropdown-toggle"
                :class="isPriorityProductFilterSelected ? 'themed-button' : ''"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <span class="mr-2" :class="productIconClass"></span>
                <span
                  class="text-uppercase"
                  v-if="isPriorityProductFilterSelected"
                  >{{ priorityProductFilter.name }} opportunities</span
                >
                <span class="text-uppercase" v-else>SELECT CAMPAIGN</span>
              </button>
              <div class="dropdown-menu dropdown-menu scrolled-div">
                <button
                  class="dropdown-item"
                  type="button"
                  v-for="(product, index) in products"
                  :key="index"
                  @click="setSelectedPriorityProductFilter(product)"
                >
                  <span class="icon-cog1 mr-2"></span>
                  {{ product.name }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import { mapState, mapActions } from "vuex";
import {
  categoriesService,
  campaignsService,
  smtpMailboxesService,
} from "@/_services";
import jQuery from "jquery";
let $ = jQuery;

export default {
  data() {
    return {
      image: "src/assets/images/oliver.png",
      categories: [],
      products: [],
      smtpServer: false,
    };
  },

  props: {
    user: Object,
  },

  computed: {
    ...mapState({
      opportunitiesTab: (state) => state.header.tab,
      campaignsTab: (state) => state.header.tab,
      tabSelected: (state) => state.header.tab,
      settingsTab: (state) => state.header.tab,
      selectedOpportunity: (state) => state.opportunities.selected.data,
      selectedBusiness: (state) => state.businesses.selected.data,
      selectedEmail: (state) => state.emails.selected.data,
      customfields: (state) => state.customfields.selected.data,
      currentUser: (state) => state.authentication.user,
      selectedCampaigns: (state) => state.campaigns.selected.data,
      priorityCategoryFilter: (state) =>
        state.opportunities.priorityFilters.categoryFilter,
      priorityProductFilter: (state) =>
        state.opportunities.priorityFilters.productFilter,
    }),
    tabs() {
      if (this.$store.state.header.tabs[this.$route.name] !== undefined) {
        return this.$store.state.header.tabs[this.$route.name];
      }
    },
    isPriorityTabActive() {
      return this.opportunitiesTab === "PRIORITY";
    },
    isAllTabActive() {
      return this.opportunitiesTab === "ALL";
    },
    isAccountTabActive() {
      return this.settingsTab === "ACCOUNT";
    },
    isEmailSettingsTabActive() {
      return this.settingsTab === "EMAILSETTINGS";
    },
    isBillingTabActive() {
      return this.settingsTab === "BILLING";
    },
    isTeamTabActive() {
      return this.settingsTab === "TEAM";
    },
    isCampaignTabActive() {
      return this.campaignsTab === "ALL";
    },
    isSelectedTabActive() {
      return this.opportunitiesTab === "SELECTED";
    },
    isSelectedCampaignTabActive() {
      return this.campaignsTab === "SELECTED";
    },
    isPriorityCategoryFilterSelected() {
      return this.priorityCategoryFilter.name !== undefined;
    },

    isPriorityProductFilterSelected() {
      return this.priorityProductFilter.name !== undefined;
    },

    productIconClass() {
      if (this.isPriorityProductFilterSelected) {
        switch (this.priorityProductFilter.name) {
          case "Video":
            return "icon-video-camera";
            break;
          case "Website":
            return "icon-desktop1";
            break;
          case "Marketing":
            return "icon-line-chart";
            break;
          case "Optimum":
            return "icon-battery-empty";
            break;
          default:
            return "icon-cube";
        }
      } else {
        return "icon-cube";
      }
    },

    isOpportunitiesRoute() {
      return this.$route.name === "opportunities";
    },

    isBusinessesRoute() {
      return this.$route.name === "businesses";
    },

    isEmailsRoute() {
      return this.$route.name === "emails";
    },
    isCampaignsRoute() {
      return this.$route.name === "campaigns";
    },

    isSettingAccountRoute() {
      return (
        this.$route.name === "settings-account" ||
        this.$route.name === "upgrade"
      );
    },

    isRoute(url) {
      return this.$route.name === url;
    },

    getLabel() {
      if (this.$route.name !== "settings-account") {
        return "All";
      }
      if (this.$route.name === "dashboard") {
        return "Dashboard";
      }
      return false;
    },

    showAll() {
      return this.$route.name === "opportunities";
    },

    showSelectedOpportunityName() {
      return (
        this.isSelectedTabActive &&
        this.isOpportunitiesRoute &&
        this.selectedOpportunity
      );
    },

    showSelectedBusinessName() {
      return (
        this.isSelectedTabActive &&
        this.isBusinessesRoute &&
        this.selectedBusiness
      );
    },

    showSelectedEmailName() {
      return (
        this.isEmailTabActive && this.isRoute("emails") && this.selectedEmail
      );
    },

    showCustomFields() {
      return (
        this.isEmailTabActive &&
        this.isRoute("mycustomfields") &&
        this.customfields
      );
    },

    showSelectedCampaignsName() {
      return (
        this.isCampaignTabActive &&
        this.isRoute("campaigns") &&
        this.selectedCampaign
      );
    },
    ourServer() {
      return this.smtpServer;
    },
  },

  filters: {
    upperCase(text) {
      return text.toUpperCase();
    },
  },

  created() {
    this.getAllCategories();
    this.getAllProducts();
    this.hasOurServer();
  },

  methods: {
    ...mapActions("header", {
      changeHeaderTab: "changeTab",
    }),

    ...mapActions("opportunities", {
      setPriorityCategoryFilter: "setPriorityCategoryFilter",
      setPriorityProductFilter: "setPriorityProductFilter",
    }),

    testTab(item) {
      // console.log(this.user.role_id);
      if (
        this.tabs[item].referencia == "TEAM" &&
        this.user.subscription_status_id != 1
      ) {
        return false;
      }
      if (this.tabs[item].referencia == "AGENCYDATA" && (this.user.role_id == 4 && this.agency_signed == 0 )) {
        return false;
      }
      if (this.tabs[item].referencia == "BILLING" && this.isBillingTabActive) {
        return true;
      }
      if (this.tabs[item].referencia == "EMAILSETTINGS" && (this.user.team_role_id != undefined && this.user.team_role_id == 3)) {
        return false;
      }
      if (this.tabs[item].referencia == "CUSTOMFIELDS" && (this.user.team_role_id != undefined && this.user.team_role_id == 3)) {
        return false;
      }
      if (this.tabs[item].referencia == "TEAM" && (this.user.team_role_id != undefined && this.user.team_role_id == 3)) {
        return false;
      }
      if (
        $.inArray(parseInt(this.user.role_id), this.tabs[item]["roles"]) == -1
      ) {
        return false;
      }
      // console.log(this.user)
      if(this.tabs[item].referencia == "TEAM" && this.user.dont_charge_payments == 2){
        return true;
      }
      if ( this.tabs[item]["planIdAccess"] != undefined &&
        $.inArray(parseInt(this.user.plan_id), this.tabs[item]["planIdAccess"]) == -1
      ) {
        return false;
      } else {
        return true;
      }
    },

    getAllCategories() {
      categoriesService
        .getAll()
        .then((categories) => (this.categories = categories));
    },

    hasOurServer() {
      smtpMailboxesService
        .hasOurServer()
        .then((result) => (this.smtpServer = result));
    },

    getAllProducts() {
      campaignsService
        .getAllByClientId()
        .then((campaignsData) => (this.products = campaignsData));
    },

    changeTab(index) {
      this.changeHeaderTab({ tab: this.tabs[index]["referencia"] });
    },

    setSelectedPriorityCategoryFilter(selectedCategory) {
      this.setPriorityCategoryFilter({ category: selectedCategory });
    },

    setSelectedPriorityProductFilter(selectedProduct) {
      this.setPriorityProductFilter({ product: selectedProduct });
    },
  },
};
</script>