<template>
  <section class="SettingsAcc">
    <main class="main" :class="{ 'expand-main': isMenuCollapse }">
      <Header :user="user" />
      <component
        :is="SettingsTabComponent"
        ref="childView"
        :subscriptionData="this.subscriptionData"
      ></component>
    </main>
  </section>
</template>
<script>
import { mapState, mapActions } from "vuex";
import Header from "@/components/Header.vue";
import Account from "@/components/Account/Account.vue";
import ViewBilling from "@/components/Billing/ViewBilling.vue";
import AgencyData from "@/components/Agencies/AgencyData.vue";
import EmailSettings from "@/components/Account/EmailSettings.vue";
import ClientTeam from "@/components/Account/ClientTeam.vue";
import { billingsService, usersService, crmService } from "@/_services";
import CustomFields from "@/components/Contacts/CustomFields.vue";
import Integrations from "@/components/Account/Integrations.vue";
import OliverSettings from "@/components/Account/OliverSettings.vue";

export default {
  components: {
    Header,
    Account,
    ViewBilling,
    AgencyData,
    EmailSettings,
    ClientTeam,
    CustomFields,
    Integrations,
    OliverSettings,
  },
  mounted() {
    window.onbeforeunload = null;
    this.udpdateHeader(this.$route.name);
  },

  computed: {
    ...mapState({
      headerTab: (state) => state.header.tab,
      isMenuCollapse: (state) => state.sidebar.isNavOpen,
    }),

    user() {
      return this.$store.state.authentication.user;
    },

    subscriptionData() {
      let recurring_payment_period = 1;
      if (this.$route.query.annual == 1) {
        recurring_payment_period = 12;
      }
      return {
        plan_id: this.$route.query.plan_id,
        recurring_payment_period: recurring_payment_period,
      };
    },

    SettingsTabComponent() {
      if (this.headerTab === "ACCOUNT") {
        return "account";
      } else if (this.headerTab === "AGENCYDATA") {
        return "AgencyData";
      } else if (this.headerTab === "EMAILSETTINGS") {
        return "EmailSettings";
      } else if (this.headerTab === "TEAM") {
        return "ClientTeam";
      } else if (this.headerTab === "CUSTOMFIELDS") {
        return "CustomFields";
      } else if (this.headerTab === "INTEGRATIONS") {
        return "Integrations";
      } else if (this.headerTab === "OLIVERSETTINGS") {
        return "OliverSettings";
      } else {
        return "ViewBilling";
      }
    },
  },
  created() {
    if (
      typeof this.$route.params.section === "undefined" &&
      this.$route.query.code &&
      this.$route.query.state
    ) {
      usersService
        .verificationAuthenticationCode(
          this.$route.query.code,
          this.$route.query.state
        )
        .then((result) => {
          if (this.user.role_id == 1) {
            this.$router.push({
              path: "/users/" + result,
            });
          }

          this.changeHeaderTab({ tab: "EMAILSETTINGS" });
          return true;
        });
    }
    if (this.$route.query.synchronisation) {
      this.changeHeaderTab({ tab: "EMAILSETTINGS" });
      return true;
    }

    if (this.$route.query.mycustomfields) {
      this.changeHeaderTab({ tab: "CUSTOMFIELDS" });
      return true;
    }

    if (this.$route.query.billing || this.$route.query.profile) {
      this.changeHeaderTab({ tab: "PAYMENT" });
      return true;
    }

    if (this.$route.query.integrations) {
      this.changeHeaderTab({ tab: "INTEGRATIONS" });
      return true;
    }

    if (typeof this.$route.params.section !== "undefined") {
      if (this.$route.params.section == "payment") {
        let ingenicoResponse = {
          id: this.$route.params.type,
          ncerror: this.$route.query.NCERROR,
          ingenico_status: this.$route.query.STATUS,
        };
        billingsService
          .confirmPaymentMethod(ingenicoResponse)
          .then((result) => {
            let type = result;
            let title = this.$t("lang.label.great");
            let message = this.$t("lang.paymentmethod." + result);
            if (result == "error") {
              title = this.$t("lang.label.error");
            }
            this.$swal({
              type: type,
              title: title,
              text: message,
              showConfirmButton: false,
              timer: 8000,
            });

            const { dispatch } = this.$store;
            dispatch("authentication/refreshToken").then((result) => {
              this.changeHeaderTab({ tab: "BILLING" }).then((data) =>
                this.$refs.childView.changeBillingTab("PAYMENT")
              );
            });
          });
      } else if (this.$route.params.section == "integrations") {
        if (this.$route.params.type !== undefined) {
          console.log(this.$route.query.code);
          crmService
            .authorize(this.$route.query.code, this.$route.params.type)
            .then(
              (result) => {
                let type = result;
                let title = this.$t("lang.label.great");
                let message = this.$t("lang.integrations." + result);
                this.$swal({
                  type: type,
                  title: title,
                  text: message,
                  showConfirmButton: false,
                  timer: 8000,
                });
                this.changeHeaderTab({ tab: "INTEGRATIONS" });
              },
              (error) => {
                this.$swal({
                  type: "error",
                  title: this.$t("lang.label.error"),
                  text: this.$t("lang.label.error"),
                  showConfirmButton: true,
                });
                this.changeHeaderTab({ tab: "INTEGRATIONS" });
              }
            );
        }
      } else {
        this.changeHeaderTab({});
      }
    } else {
      this.changeHeaderTab({});
    }
  },

  methods: {
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
  },
};
</script>
<style>
.SettingsAcc .header {
  margin-left: 0px;
}
section.SettingsAcc {
  overflow-x: hidden;
}
</style>