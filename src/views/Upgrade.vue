<template>
  <section class="pricing py-2">
    <Header :user="user" />
    <main class="main" :class="{ 'expand-main': isMenuCollapse }">
      <div class="contentCenter all">
        <div class="contenedor pt-3 animated fadeIn fast">
          <div class="row">
            <div class="col-lg-3"></div>
            <div class="col-lg-6">
              <h1 class="dark-blue text-center">
                {{ $t("lang.label.subscription") }}
              </h1>

              <div class="text-center">
                <vue-form-generator
                  ref="annualSubscription"
                  :schema="annual_schema"
                  :model="annual_model"
                  :options="formOptions"
                >
                </vue-form-generator>
              </div>
            </div>
            <div class="col-lg-3"></div>
          </div>
          <div class="row flex-row">
            <div class="col-lg-4 panel" v-for="(plan, index) in activePlans">
              <div class="card shadow my-5">
                <div class="card-body">
                  <img
                    :src="
                      require('@/assets/images/' +
                        plans[plan.plan_id].img +
                        '.png')
                    "
                    class="rounded mx-auto d-block"
                    height="100px"
                  />
                  <h5 class="card-title text-muted text-uppercase text-center">
                    {{ plans[plan.plan_id].name }}
                  </h5>
                  <div class="card-price text-center">
                    <div
                      v-if="getDiscount(plan, 'total') > 0"
                      :class="
                        daysLeft > 0 || annual_model.is_annual == 1
                          ? 'tachar x-small'
                          : ''
                      "
                    >
                      {{ plan.price }} €
                    </div>

                    <div
                      v-if="daysLeft > 0 && annual_model.is_annual == 1"
                      class="x-small text-uppercase"
                    >
                      <div>
                        {{
                          $t("lang.planfeatures.ndiscount", {
                            discount: getDiscount(plan, "trial_period"),
                          })
                        }}
                      </div>

                      <div
                        class="tachar"
                        :class="
                          annual_model.is_annual == 1 ? '' : 'text-primary'
                        "
                      >
                        {{ getPriceDiscount(plan, "trial_period") }} €
                      </div>
                    </div>

                    <div
                      class="text-uppercase"
                      v-if="getDiscount(plan, 'total') > 0"
                      :class="getDiscount(plan, 'total') > 0 ? 'x-small' : ''"
                    >
                      <span v-if="daysLeft > 0 && annual_model.is_annual == 1">
                        Extra &nbsp;</span
                      >

                      <span>{{
                        $t("lang.planfeatures.ndiscount", {
                          discount:
                            annual_model.is_annual == 1
                              ? getDiscount(plan, "annual")
                              : getDiscount(plan, "trial_period"),
                        })
                      }}</span>
                    </div>


                    

                    <div 
                      v-if="annual_model.is_annual != 1">
                    <strong class="text-primary">
                      {{ getPriceDiscount(plan, "total") }} €
                    </strong>
                    <span class="period"
                      >/{{ $t("lang.label.month") }}/{{
                        $t("lang.label.user")
                      }}</span>
                    </div>


                    <div 
                      v-if="annual_model.is_annual == 1">
                        <strong class="text-primary">
                          {{ getAnnualPrice(plan) }} €
                        </strong>
                        <span class="period"
                          >/{{ $t("lang.label.year") }}/{{
                            $t("lang.label.user")
                          }}</span>

                      <div>
                        <small  class="text-primary">
                        ( <small>
                          {{ getPriceDiscount(plan, "total") }} €
                        </small>
                        <small class="period"
                          >/{{ $t("lang.label.month") }}
                          </small> )
                        </small>
                      </div>

                    </div>


                  </div>

                  <div class="small text-center">
                    <span
                      v-if="
                        annual_model.is_annual == 0 ||
                        annual_model.is_annual == undefined
                      "
                    >
                      (Billed monthly)
                    </span>
                    <span v-else> (Billed annualy) </span>
                  </div>
                  <h3 class="text-center mt-5">
                    <img
                      src="@/assets/images/fire-icon.png"
                      v-if="plans[plan.plan_id].contacts == 'unlimitedcontacts'"
                      class="mr-2 mb-2"
                    />
                    <span
                      v-html="
                        $t('lang.planfeatures.' + plans[plan.plan_id].contacts)
                      "
                    ></span>
                  </h3>

                  <hr />

                  <div class="btn-wrapper">
                    <div
                      v-if="plan.plan_id == 2"
                      class="rounded-2 ml-2 most-popular small"
                      :class="planDisabled(plan) ? 'isDisabled' : ''"
                    >
                      {{ $t("lang.planfeatures.mostpopularchoice") }}
                    </div>
                    <a
                      href="javascript:"
                      @click.prevent="goToPlan(plan)"
                      class="
                        btn btn-block btn-primary
                        themed-button
                        text-uppercase
                      "
                      :class="planDisabled(plan) ? 'isDisabled' : ''"
                      >{{ $t("lang.button.upgrade") }}</a
                    >
                  </div>
                  <ul class="fa-ul">
                    <li v-for="(dataP, title) in plans[plan.plan_id].data">
                      <ul>
                        <h5 class="text-primary mb-3 mt-5">
                          {{ $t("lang.planfeatures." + title) }}
                        </h5>
                        <li v-for="(detail, feature) in dataP">
                          <i
                            :class="
                              detail === 'no' ? 'text-muted' : 'text-primary'
                            "
                            class="icon-check1 mr-1"
                          ></i>
                          <span :class="detail === 'no' ? 'text-muted' : ''">{{
                            $t("lang.planfeatures." + feature)
                          }}</span>
                          <span v-if="detail !== 'no' && detail !== 'yes'">
                            : 
                            <b>
                            <span
                              v-if="isNaN(detail) && (typeof detail !== 'object')"
                              >{{ $t("lang.planfeatures." + detail) }}</span
                            >
                            <span
                              v-else-if="
                                isNaN(detail) && typeof detail === 'object'
                              "
                            >
                              {{ detail.qty }} /
                              {{ $t("lang.label." + detail.period) }}</span
                            >
                            <span v-else>{{ detail }}</span>
                            </b>
                          </span>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </section>
</template>

<script>
import Vue from "vue";
import { mapState, mapActions } from "vuex";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import {
  usersService,
  smtpMailboxesService,
  campaignsService,
  subscriptionsService,
} from "@/_services";
import { lenguagesService } from "@/_services";
import i18n from "@/_helpers/i18n";
import VueFormGenerator from "vue-form-generator";
import "vue-form-generator/dist/vfg.css";
import AlertError from "@/components/AlertError.vue";

import Header from "@/components/Header.vue";

export default {
  data() {
    return {
      loading: true,
      annual_model: {
        is_annual: "0",
      },
      annual_schema: {
        fields: [
          {
            type: "switch",
            label: this.$t("lang.label.annualsubscription"),
            model: "is_annual",
            featured: true,
            id: "is_annual",
            textOn: " ",
            textOff: " ",
            valueOn: "1",
            valueOff: "0",
            styleClasses: "col-md-4 switch-center",
          },
        ],
      },
      formOptions: {
        validateAfterLoad: false,
        validateAfterChanged: true,
      },
    };
  },

  components: {
    LoadingSpinner,
    Header,
    AlertError,
    "vue-form-generator": VueFormGenerator.component,
  },

  computed: {
    ...mapState({
      headerTab: (state) => state.header.tab,
      plans: (state) => state.plans.all,
      activePlans: (state) => state.plans.allActives,
    }),
    ...mapState({
      isMenuCollapse: (state) => state.sidebar.isNavOpen,
    }),
    daysLeft() {
      return this.$store.state.authentication.toastNotificationData
        .trialPeriodData.days;
    },
    user() {
      return this.$store.state.authentication.user;
    },
    hasDefaultPaymentMethod() {
      return (
        this.$store.state.authentication.toastNotificationData
          .hasDefaultPaymentMethod.length > 0
      );
    },
  },

  created() {
    this.getAllPlansActives();
  },

  methods: {
    ...mapActions("header", {
      changeHeaderTab: "changeTab",
    }),

    ...mapActions("plans", {
      getAllPlans: "getAll",
    }),

    getAllPlansActives() {
      this.getAllPlans({});
    },
    getAnnualPrice(plan){
      return (this.getPriceDiscount(plan, "total")*12).toFixed(2);
    },
    planDisabled(plan) {
      if (this.user.subscription_status_id != 1) {
        return false;
      }
      if (this.user.plan_id < plan.plan_id) {
        return false;
      }
      return true;
    },
    getDiscount(plan, type) {
      let discount = 0;
      if (type == "trial_period" && this.daysLeft > 0) {
        discount = plan.trial_period_discount;
      } else if (type == "annual" && this.annual_model.is_annual == 1) {
        discount = plan.annual_discount;
      } else if (type == "total") {
        if (this.daysLeft > 0) {
          discount = plan.trial_period_discount;
        }
        if (this.annual_model.is_annual == 1) {
          discount =
            discount * 1 + ((100 - discount) * plan.annual_discount) / 100;
        }
      }
      discount = discount * 1;
      return discount.toFixed(0);
    },
    getPriceDiscount(plan, type) {
      let price = plan.price;
      let discount = this.getDiscount(plan, type);
      price = price - (discount * price) / 100;
      return price.toFixed(2);
    },
    goToPlan(plan) {
      campaignsService.getActiveCampaigns().then((result) => {
        if (result) {
          if (
            (plan.plan_id == 1 && result.total > 1) ||
            (plan.plan_id == 2 && result.total > 3)
          ) {
            this.$swal({
              type: "error",
              title: this.$t("lang.label.error"),
              text: this.$t("lang.label.thenumberofactivecampaignsishigher"),
              showConfirmButton: true,
            });
          } else {
            if (this.hasDefaultPaymentMethod) {
              let recurring_payment_period = 1;
              if (this.annual_model.is_annual == 1) {
                recurring_payment_period = 12;
              }

              subscriptionsService
                .upgrade(plan.plan_id, recurring_payment_period)
                .then((response) => {
                  const { dispatch } = this.$store;
                  dispatch("authentication/refreshToken").then((response) => {
                    this.$swal({
                      type: "success",
                      title: this.$t("lang.label.great"),
                      text: "",
                      showConfirmButton: false,
                      timer: 3000,
                    }).then((response) => {
                      this.$router.push("/settings-account?billing=1");
                    });
                  });
                });
            } else {
              this.$router.push(
                "/settings-account?billing=1&payment=1&plan_id=" +
                  plan.plan_id +
                  "&annual=" +
                  this.annual_model.is_annual
              );
            }
          }
        }
      });
      // if(this.user.subscription_status_id == 0){

      // }
    },
  },
};
</script>

<style>
.pricing .card {
  border: none;
  border-radius: 1rem;
  transition: all 0.2s;
  box-shadow: 0 0.5rem 1rem 0 rgba(0, 0, 0, 0.1);
  height: 100%;
}

.pricing hr {
  margin: 1.5rem 0;
}

.pricing .card-title {
  margin: 0.5rem 0;
  font-size: 0.9rem;
  letter-spacing: 0.1rem;
}

.pricing .card-price {
  font-size: 2rem;
  margin: 0;
}

.pricing .card-price .period {
  font-size: 0.8rem;
}

.pricing ul li {
  margin-bottom: 1rem;
}

.pricing .text-muted {
  opacity: 0.7;
}

.pricing .btn-wrapper {
  position: relative;
}

.pricing .btn-wrapper .most-popular {
  position: absolute;
  top: -26px;
  bottom: 47px;
  line-height: 6px;
  right: inherit;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  color: #5155ea;
  border: 1px solid #5155ea;
  padding: 10px 20px;
  
}

.pricing .btn {
  font-size: 80%;
  border-radius: 5rem;
  letter-spacing: 0.1rem;
  font-weight: bold;
  padding: 1rem;
  opacity: 0.7;
  transition: all 0.2s;
  /* position: absolute; */
  bottom: 0;
  left: 20px;
  right: 20px;
  width: auto;
}

.pricing .card-body {
  position: relative;
  /* padding-bottom: 80px;
  margin-bottom: 30px; */
}

.vue-form-generator .field-switch input:checked ~ .label {
  background: #5156ea !important;
}

/* Hover Effects on Card */

@media (min-width: 992px) {
  .pricing .card:hover {
    margin-top: -0.25rem;
    margin-bottom: 0.25rem;
    box-shadow: 0 0.5rem 1rem 0 rgba(0, 0, 0, 0.3);
  }
  .pricing .card:hover .btn {
    opacity: 1;
  }
}

a.isDisabled {
  cursor: not-allowed;
  opacity: 0.5;
  background-color: grey !important;
  border-color: grey !important;
  text-decoration: none;
}

a.isDisabled:hover,
a.isDisabled:focus,
a.isDisabled:active {
  cursor: not-allowed;
  opacity: 0.5;
  background-color: grey !important;
  border-color: grey !important;
  text-decoration: none;
  box-shadow: none !important;
  outline: none !important;
}
.tachar {
  text-decoration: line-through;
  color: grey;
}

@media only screen and (min-width: 481px) {
  .flex-row {
    display: flex;
    flex-wrap: wrap;
  }
  .flex-row > [class*="col-"] {
    display: flex;
    flex-direction: column;
  }
  .flex-row.row:after,
  .flex-row.row:before {
    display: flex;
  }
}
.x-small {
  font-size: 56%;
}
</style>