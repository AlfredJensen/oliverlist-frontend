<template>
  <div>
    <LoadingSpinner v-if="loading2" />
    <section class="billing-summary" v-if="!loading2">
      <div class="transactions payment-methods animated fadeIn fast">
        <div class="contenedor">
          <div class="p-2">
            <h5 class="font-weight-bold">
              {{ $t("lang.label.paymentmethods") }}
            </h5>
          </div>
          <div class="row">
            <div
              class="col-md-6 col-sm-12 pr-4"
              v-for="(payment, key) in paymentMethods"
              :key="key"
            >
              <div
                class="card mt-3 cursor-pointer"
                @click="selectPaymentMethod(payment)"
              >
                <div class="pr-2 pt-1">
                  <span
                    class="mt-3 ml-4"
                    v-if="hasDeclinedPayments && payment.isDefault"
                  >
                    {{ $t("lang.payment.lastfailed") }}
                    <span
                      class="btn btn-info btn-sm ml-2"
                      @click.stop="chargePendingPayments()"
                      >{{ $t("lang.payment.fixitnow") }}</span
                    >
                  </span>
                  <button
                    type="button"
                    class="close"
                    data-dismiss="alert"
                    aria-label="Close"
                    @click="deletePaymentMethod(payment)"
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div class="body p-4">
                  <div
                    class="table-responsive table-transactions"
                    :class="payment.isDefault === '1' ? 'title' : ''"
                  >
                    <table class="table table-hover">
                      <tbody>
                        <tr>
                          <td>{{ $t("lang.label.cardnumber") }}</td>
                          <td class="text-right font-weight-bold">
                            {{ payment.descriptionPayment }}
                          </td>
                        </tr>
                        <tr>
                          <td v-if="payment.companyCountry">
                            {{ $t("lang.label.country") }}
                          </td>
                          <td class="text-right font-weight-bold">
                            {{ payment.companyCountry }}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div
                    v-if="payment.isDefault === '1'"
                    class="mt-2 float-right"
                  >
                    <small>PRIMARY</small>
                  </div>
                  <div class="mt-2 float-right">
                    <small
                      v-if="payment.expired === '0'"
                      class="badge btn-success mr-3"
                      >VALID</small
                    >
                    <small
                      v-if="payment.expired === '1'"
                      class="badge btn-warning mr-3"
                      >EXPIRES SOON</small
                    >
                    <small
                      v-if="payment.expired === '2'"
                      class="badge btn-danger mr-3"
                      >EXPIRED</small
                    >
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-6 col-sm-12 pr-4">
              <div class="card mt-3 cursor-pointer" @click="showMethods()">
                <div class="body p-4 d-flex justify-content-center">
                  <div class="d-flex align-items-center">
                    <div>
                      <span class="icon-credit-card"></span>
                      <h6 class="d-inline">
                        {{ $t("lang.label.addpaymentmethod") }}
                      </h6>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <LoadingSpinner v-if="loading" />
            <div
              class="col-md-12 pr-4"
              v-show="addNewMethod && !loading"
              id="payment-methods-forms"
            >
              <h3 v-if="subscriptionData.plan_id" class="mb-1 mt-2">
                <span
                  v-if="plans[subscriptionData.plan_id]"
                  class="badge plan badge-secondary mr-2 px-3"
                  >PLAN
                  {{ plans[subscriptionData.plan_id].name.toUpperCase() }}</span
                >
              </h3>
              <div class="accordion" id="accordionExample">
                <div class="card mt-3">
                  <div class="card-header" id="headingTwo">
                    <button
                      type="button"
                      class="close"
                      data-dismiss="alert"
                      aria-label="Close"
                      @click="closeNewPaymentMethod()"
                    >
                      <span aria-hidden="true">&times;</span>
                    </button>
                    <h2 class="mb-0">
                      <button
                        id="credit-card-button"
                        class="btn btn-link"
                        type="button"
                        data-toggle="collapse"
                        data-target="#collapseTwo"
                        aria-expanded="true"
                        aria-controls="collapseTwo"
                        @click="newPaymentMethod('card')"
                      >
                        <i class="icon-credit-card"> </i> &nbsp;
                        {{ $t("lang.label.addcreditcard") }}
                      </button>
                    </h2>
                  </div>
                  <div class="body">
                    <div
                      id="collapseTwo"
                      class="collapse"
                      :class="isCollapseTwoSelected ? 'show' : ''"
                      aria-labelledby="headingTwo"
                      data-parent="#accordionExample"
                    >
                      <component
                        :is="newPaymentCardMethod"
                        :selectedMethod="method"
                        @refreshPaymentMethods="refreshPaymentMethods($event)"
                        :subscriptionData="this.subscriptionData"
                      ></component>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!--//contenedor-->
      </div>
    </section>
  </div>
</template>
<script>
import Header from "@/components/Header.vue";
import { mapState, mapActions } from "vuex";
import { billingsService, campaignsService } from "@/_services";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import BankAccountForm from "@/components/Billing/BankAccountForm.vue";
import CreditCardForm from "@/components/Billing/CreditCardForm.vue";
import { formattersMixin, campaignUtilsMixin } from "@/_mixins/";
import $ from "jquery";

export default {
  props: {
    subscriptionData: Object,
    validProfile: Boolean,
  },
  data() {
    return {
      alertMethod: false,
      currency: "",
      addNewMethod: false,
      newMethodType: "",
      method: {},
      isCollapseOneSelected: false,
      isCollapseTwoSelected: false,
      loading2: false,
    };
  },
  components: {
    Header,
    LoadingSpinner,
    BankAccountForm,
    CreditCardForm,
  },

  mixins: [formattersMixin],

  created() {
    if (
      this.user.subscription_status_id != 1 &&
      !this.subscriptionData.plan_id &&
      !this.hasDeclinedPayments
    ) {
      this.$router.push("/upgrade");
    }
    this.getData();
    if (this.$route.query.payment) {
      this.addNewMethod = true;
      setTimeout(() => {
        $("#credit-card-button").trigger("click");
      }, 2000);
    }
  },
  computed: {
    ...mapState({
      plans: (state) => state.plans.all,
      activePlans: (state) => state.plans.allActives,
      paymentMethods: (state) => state.billings.all.data,
      loading: (state) => state.billings.loading,
    }),
    newPaymentBankMethod() {
      return "BankAccountForm";
    },
    newPaymentCardMethod() {
      return "CreditCardForm";
    },
    selectedMethod() {
      return this.method;
    },
    user() {
      return this.$store.state.authentication.user;
    },
    hasDeclinedPayments() {
      return (
        this.$store.state.authentication.toastNotificationData
          .hasDeclinedPayments.length > 0
      );
    },
  },
  methods: {
    ...mapActions("billings", {
      startLoading: "startLoading",
      finishLoading: "finishLoading",
      getAllPaymentMethods: "getAll",
    }),
    ...mapActions("plans", {
      getAllPlans: "getAll",
    }),

    getData() {
      this.getAllPaymentMethods();
      this.getCurrency();
    },
    /*getPaymentMethods(){
                billingsService.getPaymentMethods().then(result => {
                     this.paymentMethods = result;
                     this.shAlert( this.paymentMethods);
                }).then(result => 
                    this.loading = false                   
                );     
            },
            shAlert(arr){
                 if( arr.length === 0){
                    this.alertMethod=true
                    } else{ this.alertMethod=false} 
            },*/
    getCurrency() {
      this.currency = "€";
    },
    showMethods() {
      this.addNewMethod = true;
      this.isCollapseOneSelected = false;
      this.isCollapseTwoSelected = false;
    },
    addNewPaymentMethod() {
      if (this.newMethodType == "bank") {
        this.isCollapseOneSelected = true;
        this.isCollapseTwoSelected = false;
        this.method = {
          bank_account_name: "",
          iban: "",
          swift_bic: "",
          signtory_name: "",
          address_line_1: "",
          address_line_2: "",
          postal_code: "",
          city: "",
          default: 1,
        };
      } else {
        this.isCollapseOneSelected = false;
        //   this.isCollapseTwoSelected = true;
        this.isCollapseTwoSelected = false;
        this.method = {
          name_on_card: "",
          card_number: "",
          brand: "",
          expiration_month: "",
          expiration_year: "",
          default: 1,
        };
      }
    },
    newPaymentMethod(method) {
      this.newMethodType = method;
      this.addNewPaymentMethod();
    },
    closeNewPaymentMethod() {
      this.addNewMethod = false;
    },
    refreshPaymentMethods(refreshToken) {
      console.log("eeeeeee", refreshToken);
      this.closeNewPaymentMethod();
      this.getAllPaymentMethods();
      if (refreshToken != undefined) {
        console.log("rrrffffss");
        const { dispatch } = this.$store;
        dispatch("authentication/refreshToken");
         
      }
    },
    selectPaymentMethod(payment) {
      //this.closeNewPaymentMethod();

      this.showMethods();

      billingsService
        .getPaymentMethod(payment.id, payment.payment_type)
        .then((result) => {
          this.method = result;

          if (this.method.card_number != undefined) {
            this.isCollapseOneSelected = false;
            this.isCollapseTwoSelected = true;
          } else {
            this.isCollapseOneSelected = true;
            this.isCollapseTwoSelected = false;
          }
        });
    },
    deletePaymentMethod(payment) {
      this.$swal({
        type: "warning",
        title: this.$t("lang.label.areyousureyouwanttodeletethispaymentmethod"),
        text: "",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        confirmButtonText: this.$t("lang.button.yes"),
        cancelButtonColor: "#d33a2c",
        cancelButtonText: this.$t("lang.button.cancel"),
      }).then((result) => {
        if (result.value) {
          if (this.paymentMethods.length > 1) {
            if (payment.isDefault == 1) {
              this.$swal({
                type: "error",
                title: this.$t("lang.label.error"),
                text: this.$t(
                  "lang.label.youneedtochooseanotherprimarypaymentmethodifyouwanttodeletethispaymentmethod"
                ),
                showConfirmButton: true,
              });
            } else {
              billingsService
                .deletePaymentMethod(payment.id, payment.payment_type)
                .then((response) => {
                  this.$swal({
                    type: "success",
                    title: this.$t("lang.label.great"),
                    text: this.$t(
                      "lang.label.paymentmethoddeletedsuccessfully"
                    ),
                    showConfirmButton: false,
                    timer: 3000,
                  });
                })
                .then((response) => {
                  this.refreshPaymentMethods();
                });
            }
          } else {
            this.$swal({
              type: "error",
              title: this.$t("lang.label.error"),
              text: this.$t(
                "lang.label.youmustaddanewvalidpaymentmethodbeforedeletingthispaymentmethod"
              ),
              showConfirmButton: true,
            });
          }
        }
      });
    }, // deletePaymentMethod

    chargePendingPayments() {
      this.$swal({
        type: "warning",
        title: this.$t("lang.payment.chargeattempt"),
        text: this.$t("lang.payment.chargeattemptinfo"),
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        confirmButtonText: this.$t("lang.button.yes"),
        cancelButtonColor: "#d33a2c",
        cancelButtonText: this.$t("lang.button.cancel"),
      }).then((result) => {
        if (result.value) {
          this.loading2 = true;
          billingsService.chargePendingPayments(0).then(
            (response) => {
              const { dispatch } = this.$store;
              dispatch("authentication/getToastNotificationData").then(
                (response) => {
                  this.loading2 = false;
                  if (this.hasDeclinedPayments) {
                    this.$swal({
                      type: "error",
                      title: this.$t("lang.payment.failed"),
                      text: this.$t("lang.payment.failedinfo"),
                      showConfirmButton: true,
                    });
                  } else {
                    this.$swal({
                      type: "success",
                      title: this.$t("lang.payment.successful"),
                      text: this.$t("lang.payment.successfulinfo"),
                      showConfirmButton: true,
                    });
                  }
                }
              );
            },
            (error) => {
              this.loading2 = false;
              this.$swal({
                type: "error",
                title: this.$t("lang.label.error"),
                text: this.$t("lang.label.error"),
                showConfirmButton: true,
              });
            }
          );
        }
      });
    }, // chargePendingPayments
  },
};
</script>
<style>
.card .body.p-4 {
  min-height: 150px;
}
.accordion > .card:first-of-type {
  border-bottom: 1px solid rgba(0, 0, 0, 0.125) !important;
}
.payment-methods .btn-link {
  color: #212529;
}
.payment-methods .btn-link:hover {
  color: #101113;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.badge.plan {
  background: #5155ea;
}
</style>