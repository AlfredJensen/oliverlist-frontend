<template>
  <div>
    <LoadingSpinner v-if="loading" />
    <div class="viewBilling" v-if="!loading">
      <div class="bg-light pt-3">
        <div class="row border-bottom border-grey">
          <div class="col-sm-12 col-md-9 col-lg-9 d-flex">
            <div
              class="ml-3 d-inline it-tabs pb-2"
              v-if="isSummaryVisible"
              :class="this.selectedBillingTab === 'SUMMARY' ? 'active' : ''"
            >
              <a
                class="cursor-pointer d-inline"
                @click="changeBillingTab('SUMMARY')"
              >
                {{ $t("lang.label.summary") }}
              </a>
            </div>
            <div
              class="ml-3 d-inline it-tabs pb-2"
              :class="this.selectedBillingTab === 'PAYMENT' ? 'active' : ''"
            >
              <a
                class="cursor-pointer d-inline"
                @click="changeBillingTab('PAYMENT')"
              >
                {{ $t("lang.label.paymentmethods") }}
              </a>
            </div>
            <div
              class="ml-3 d-inline it-tabs pb-2"
              :class="this.selectedBillingTab === 'SETTINGS' ? 'active' : ''"
            >
              <a
                class="cursor-pointer d-inline"
                @click="changeBillingTab('SETTINGS')"
              >
                {{ $t("lang.label.settings") }}
              </a>
            </div>
            <div
              class="ml-3 d-inline it-tabs pb-2"
              :class="this.selectedBillingTab === 'INVOICES' ? 'active' : ''"
            >
              <a
                class="cursor-pointer d-inline"
                @click="changeBillingTab('INVOICES')"
              >
                {{ $t("lang.label.invoices") }}
              </a>
            </div>
          </div>
        </div>
      </div>
      <main class="">
        <component
          :is="billingTabComponent"
          :validProfile="profile"
          @changeBillingTab="changeBillingTab($event)"
          @profileValid="profileValid()"
          :subscriptionData="this.subscriptionData"
        ></component>
      </main>
    </div>
  </div>
</template>
<script>
import Header from "@/components/Header.vue";
import { clientsService, billingsService } from "@/_services";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import BillingSummary from "@/components/Billing/BillingSummary.vue";
import BillingProfile from "@/components/Billing/BillingProfile.vue";
import BillingPaymentMethods from "@/components/Billing/BillingPaymentMethods.vue";
import Transactions from "@/components/Billing/Transactions.vue";
import Invoices from "@/components/Billing/Invoices.vue";

export default {
  props: {
    subscriptionData: Object,
  },
  data() {
    return {
      billing: [],
      loading: false,
      selectedBillingTab: "",
      profile: false,
    };
  },
  components: {
    Header,
    LoadingSpinner,
    BillingSummary,
    BillingProfile,
    BillingPaymentMethods,
    Transactions,
    Invoices,
  },
  computed: {
    user() {
      return this.$store.state.authentication.user;
    },
    billingTabComponent() {
      if (this.selectedBillingTab === "SUMMARY") {
        return "BillingSummary";
      } else if (this.selectedBillingTab === "SETTINGS") {
        return "BillingProfile";
      } else if (this.selectedBillingTab === "PAYMENT") {
        return "BillingPaymentMethods";
      } else if (this.selectedBillingTab === "INVOICES") {
        return "Invoices";
      } else {
        return "Transactions";
      }
    },
    haveProfile() {
      return this.profile;
    },
    isSummaryVisible(){
        return this.user.role_id != 4;
    }
  },
  created() {
    if (this.$route.query.payment) {
      this.changeBillingTab("PAYMENT");
    } else if (this.$route.query.profile) {
      this.changeBillingTab("SETTINGS");
    } else {
      this.changeBillingTab("SUMMARY");
    }
    if(!this.isSummaryVisible){
        this.changeBillingTab("PAYMENT");
    }
    this.profileValid();
  },
  methods: {
    changeBillingTab(selectedBillingTab) {
      this.selectedBillingTab = selectedBillingTab;
    },
    profileValid() {
      billingsService.getBillingProfile().then((result) => {
        if (result) {
          this.profile = true;
        } else {
          this.profile = false;
        }
      });
    },
  },
};
</script>
<style>
.it-tabs.active {
  border-bottom: 3px solid #4a47eb;
  color: #4a47eb;
}
.it-tabs {
  color: #868686;
  border: 0;
}
</style>
