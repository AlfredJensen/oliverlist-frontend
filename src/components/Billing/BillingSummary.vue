<template>
  <div>
    <LoadingSpinner v-if="loading" />
    <section class="billing-summary" v-if="!loading">
      <div class="transactions animated fadeIn fast">
        <div class="contenedor">
          <div class="p-2">
            <h5 class="font-weight-bold">
              {{ $t("lang.label.summary") }}
            </h5>
              <Tutorial
                id="billing"
                :linkText="$t('lang.label.howitworks')"
                linkClass="small ml-2 mt-2"
                :videoUrl="'https://www.youtube.com/embed/' + $t('lang.videos.billing')"
              />
          </div>

          <div>
            <div class="row">
              <div class="col-md-6 col-sm-12 pr-4" v-if =" user.role_id != 4">
                <div class="card mt-3">
                  <div class="px-4 pb-2 pt-4">
                    <div class="row">
                      <div class="col-12">
                        <h5 class="font-weight-bold">
                          {{ $t("lang.label.subscription") }}
                        </h5> 
                      </div>
                    </div>
                    <div class="body p-4">
                      <div class="" v-if="user.subscription_status_id != 0">
                        <p class="small">
                          License(s) Oliver
                          {{ plans[user.plan_id].name }}
                          ({{ (user.plan_price * 1).toFixed(2) }}€/mois) :
                          {{ activeUsers }}
                          <span
                            class="badge small text-uppercase"
                            :class="
                              user.subscription_status_id == 1
                                ? 'badge-success'
                                : 'badge-danger'
                            "
                            >{{
                              user.subscription_status_id == 1
                                ? "active"
                                : "canceled"
                            }}</span
                          >
                        </p>
                        <div class="d-flex mt-2">
                          <button
                            class="
                              btn btn-primary
                              themed-button
                              btn-sm
                              mt-3
                              mr-2
                            "
                            @click="goUpgrade()"
                            v-if="user.plan_id < 3"
                          >
                            Upgrade
                          </button>
                          <button
                            class="btn btn-primary themed-button btn-sm mt-3"
                            @click="goDowngrade()"
                          >
                            {{ $t("lang.label.deletemyaccount") }}
                          </button>
                          <button
                            type="button"
                            class="btn btn-sm question"
                            data-toggle="tooltip"
                            data-placement="right"
                            title="To unsubscribe you must not have pending payments or positive balance"
                          >
                            <i class="icon-question font-weight-light"></i>
                          </button>
                        </div>
                      </div>
                      <div v-else>
                        <p class="small">License(s) Oliver Plan free</p>
                        <button
                          class="btn btn-primary themed-button btn-sm mt-3 mr-2"
                          @click="goUpgrade()"
                        >
                          Upgrade
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div
                class="col-md-6 col-sm-12 pr-4"
                v-if="this.user.subscription_status_id != 0"
              >
                <div class="card mt-3">
                  <div class="px-4 pb-2 pt-4">
                    <div class="row">
                      <div class="col-12">
                        <h5 class="font-weight-bold">
                          {{ $t("lang.label.howyoupay") }}
                        </h5>
                      </div>
                    </div>
                  </div>
                  <div class="body p-4">
                    <div
                      class="table-responsive table-transactions summary-card"
                    >
                      <table class="table table-hover" v-if="paymentMethod">
                        <tbody>
                          <tr>
                            <td>{{ $t("lang.label.company") }}</td>
                            <td class="text-right font-weight-bold">
                              {{ paymentMethod.companyName }}
                            </td>
                          </tr>
                          <tr>
                            <td>{{ $t("lang.label.paymentpreference") }}</td>
                            <td class="text-right font-weight-bold">
                              {{ paymentMethod.descriptionPayment }}
                            </td>
                          </tr>
                          <tr>
                            <td>{{ $t("lang.label.country") }}</td>
                            <td class="text-right font-weight-bold">
                              {{ paymentMethod.companyCountry }}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <div class="d-flex justify-content-center" v-else>
                        <div class="d-flex align-items-center">
                          <div>
                            <h6 class="d-inline text-center">
                              {{ $t("lang.label.nopaymentmethods") }}
                            </h6>
                            <p class="" v-if="!validProfile">
                              {{
                                $t(
                                  "lang.label.toaddapaymentmethodyoumustfirstcompleteyourbillingprofile"
                                )
                              }}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <button
                        class="
                          ml-4
                          float-right
                          btn btn-sm btn-primary
                          themed-button
                        "
                        type="button"
                        @click="goPayment()"
                        v-if="validProfile"
                      >
                        {{ $t("lang.button.managepaymentmethods") }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="py-2"></div>
          <!--
          <div class="row">
            <div class="col-md-6 col-sm-12 pr-4">
              <div class="card mt-3">
                <div class="px-4 pb-2 pt-4">
                  <div class="row">
                    <div class="col-12">
                      <h5 class="font-weight-bold">
                        {{ $t("lang.label.transactions") }}
                      </h5>
                    </div>
                  </div>
                </div>
                <div class="body p-4 summary-card">
                  <div class="table-responsive table-transactions summary-card">
                    <table class="table table-hover" v-if="listTransactions">
                      <thead>
                        <tr>
                          <th>
                            <span class="font-weight-bold">
                              {{ $t("lang.column.daterange") }}</span
                            >
                          </th>
                          <th scope="col" class="text-right">
                            <span class="font-weight-bold"
                              >{{ $t("lang.column.total") }} ({{
                                currency
                              }})</span
                            >
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(bill, key) in listTransactions" :key="key">
                          <td>{{ bill.date }}</td>
                          <td class="text-right">
                            {{ bill.total }} {{ currency }}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <div class="d-flex justify-content-center" v-else>
                      <div class="d-flex align-items-center">
                        <div>
                          <h6 class="d-inline">
                            {{ $t("lang.label.notransactions") }}
                          </h6>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <button
                      class="ml-4 float-right btn btn-sm btn-primary themed-button"
                      type="button"
                      @click="goTransactions()"
                    >
                      {{ $t("lang.button.viewtransactions") }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        --></div>
        <!--//contenedor-->
      </div>
    </section>
  </div>
</template>
<script>
import Header from "@/components/Header.vue";
import { billingsService } from "@/_services";
import { mapState, mapActions } from "vuex";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import Tutorial from "@/components/Tutorial.vue";
import Vue from "vue";
import jQuery from "jquery";
let $ = jQuery;

export default {
  data() {
    return {
      budget: {},
      percentage: 0,
      lastPayment: {},
      listTransactions: [],
      paymentMethod: {},
      cantDowngrade: true,
      loading: false,
      activeUsers: false,
    };
  },
  props: {
    validProfile: Boolean,
  },
  components: {
    Header,
    LoadingSpinner,
    Tutorial,
  },
  computed: {
    ...mapState({
      headerTab: (state) => state.header.tab,
      plans: (state) => state.plans.all,
      activePlans: (state) => state.plans.allActives,
    }),
    user() {
      return this.$store.state.authentication.user;
    },
    hasDeclinedPayments() {
      return (
        this.$store.state.authentication.toastNotificationData
          .hasDeclinedPayments.length > 0
      );
    },
    hasPendingPayments() {
      return (
        this.$store.state.authentication.toastNotificationData
          .hasPendingPayments.length > 0
      );
    },
  },

  created() {
    this.getData();
    Vue.nextTick(function () {
      $('[data-toggle="tooltip"]').tooltip();
    });
  },
  methods: {
    ...mapActions("plans", {
      getAllPlans: "getAll",
    }),

    getAllPlansActives() {
      this.getAllPlans({});
    },
    getData() {
      this.getSummary();
      this.getCurrency();
      this.getAllPlansActives();
    },
    getSummary() {
      billingsService
        .getSummary()
        .then((result) => {
          this.budget = result.budget;
          this.percentage = result.percentage;
          this.lastPayment = result.lastPayment;
          this.listTransactions = result.transactionsByMonth;
          this.paymentMethod = result.defaultPaymentMethod;
          this.activeUsers = result.activeUsers;
        })
        .then((result) => {
          this.hasPaymentsPending();
          //this.loading = false;
        });
    },
    getCurrency() {
      this.currency = "€";
    },
    goTransactions() {
      this.$emit("changeBillingTab", "TRANSACTIONS");
    },
    goPayment() {
      this.$emit("changeBillingTab", "PAYMENT");
    },
    hasPaymentsPending() {
      billingsService.getPendingPayments().then((response) => {
        if (!response && this.budget <= 0) {
          this.cantDowngrade = false;
        }
      });
    },
    goUpgrade() {
      this.$router.push("/upgrade");
    },
    goDowngrade() {
      const { dispatch } = this.$store;
      dispatch("authentication/getToastNotificationData").then((response) => {
        if (this.budget > 0 || this.hasPendingPayments) {
          this.$swal({
            type: "warning",
            title: this.$t("lang.payment.chargeattempt"),
            html: this.$t("lang.payment.chargeattemptinfo2"),
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            confirmButtonText: this.$t("lang.button.yes"),
            cancelButtonColor: "#d33a2c",
            cancelButtonText: this.$t("lang.button.cancel"),
          }).then((result) => {
            if (result.value) {
              this.loading = true;
              billingsService.chargePendingPayments(1).then((response) => {
                const { dispatch } = this.$store;
                dispatch("authentication/getToastNotificationData").then(
                  (response) => {
                    this.loading = false;
                    if (this.hasDeclinedPayments) {
                      this.$swal({
                        type: "error",
                        title: this.$t("lang.payment.failed"),
                        text: this.$t("lang.payment.failedinfo"),
                        showConfirmButton: true,
                      }).then((result) => {
                        this.$emit("changeBillingTab", "PAYMENT");
                      });
                    } else {
                      this.$swal({
                        type: "success",
                        title: this.$t("lang.payment.successful"),
                        text: this.$t("lang.payment.successfulinfo"),
                        showConfirmButton: true,
                      }).then((result) => {
                        this.$router.push("/downgrade");
                      });
                    }
                  }
                );
              });
            }
          });
        } else {
          this.$router.push("/downgrade");
        }
      });
    },
  },
};
</script>
<style>
.summary-card {
  min-height: 70px !important;
}
.btn.question {
  padding: 1px;
  padding-bottom: 10px;
  margin-left: 5px;
  width: 20px;
  border-radius: 50%;
  font-size: 0.8rem !important;
  height: 20px;
  border: 0.5px solid #9e9e9e;
  color: grey;
}
</style>