<template>
  <main class="contenedor">
    <form @submit.prevent="onSubmit" class="cc-form">
      <vue-form-generator
        ref="vfg"
        :schema="schema"
        :model="this.model"
        :options="formOptions"
      ></vue-form-generator>
      <div class="vue-form-generator" v-if="showSaveButton">
        <div class="form-group valid field-submit col-sm-12">
          <div class="field-wrap float-right">
            <input id="" type="submit" value="Save" />
          </div>
        </div>
      </div>
      <div class="cc-logo-wrapper">
        <img width="30px" class="mr-2" src="@/assets/images/visa-logo.png" />
        <img width="30px" class="mr-2" src="@/assets/images/mc-logo.png" />
        <img width="30px" class="mr-2" src="@/assets/images/cb-logo.png" />
      </div>
    </form>
  </main>
</template>
<script>
import Vue from "vue";

import VueFormGenerator from "vue-form-generator";
import "vue-form-generator/dist/vfg.css";
import Header from "@/components/Header.vue";
import {
  billingsService,
  usersService,
  campaignsService,
  plansService,
} from "@/_services";
import { mapState, mapActions } from "vuex";

export default {
  props: {
    selectedMethod: {
      type: Object,
      default() {
        return {};
      },
    },
    subscriptionData: {
      type: Object,
      default() {
        return {};
      },
    },
    showSaveButton: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      schema: {
        fields: [
          {
            type: "input",
            inputType: "hidden",
            model: "id",
            readonly: true,
            featured: false,
            disabled: true,
          },
          {
            type: "input",
            inputType: "text",
            label: this.$t("lang.label.nameoncard"),
            model: "name_on_card",
            readonly: false,
            required: true,
            disabled: (model) => {
              if (this.checkExpiration(model)) {
                return true;
              }
              return false;
            },
            min: 5,
            validator: VueFormGenerator.validators.string.locale({
              fieldIsRequired: this.$t("lang.label.required"),
              textTooSmall: this.$t("lang.validation.texttosmall", {
                min: "{1}",
              }),
            }),
            styleClasses: "col-md-6",
          },
          {
            type: "input",
            inputType: "text",
            label: this.$t("lang.label.cardnumber"),
            model: "card_number",
            readonly: false,
            required: true,
            disabled: (model) => {
              if (this.checkExpiration(model)) {
                return true;
              }
              return false;
            },
            min: 15,
            max: 19,
            validator: VueFormGenerator.validators.string.locale({
              fieldIsRequired: this.$t("lang.label.required"),
              textTooSmall: this.$t("lang.validation.texttosmall", {
                min: "{1}",
              }),
            }),
            styleClasses: "col-md-6",
          },
          {
            type: "select",
            label: this.$t("lang.label.expirationmonth"),
            model: "expiration_month",
            readonly: false,
            required: true,
            disabled: (model) => {
              if (this.checkExpiration(model)) {
                return true;
              }
              return false;
            },
            styleClasses: "col-md-3",
            selectOptions: {},
            values: [],
            validator: VueFormGenerator.validators.number.locale({
              fieldIsRequired: this.$t("lang.label.required"),
            }),
          },
          {
            type: "select",
            label: this.$t("lang.label.expirationyear"),
            model: "expiration_year",
            readonly: false,
            required: true,
            disabled: (model) => {
              if (this.checkExpiration(model)) {
                return true;
              }
              return false;
            },
            styleClasses: "col-md-3",
            selectOptions: {},
            values: [],
            validator: VueFormGenerator.validators.number.locale({
              fieldIsRequired: this.$t("lang.label.required"),
            }),
          },
          {
            type: "input",
            inputType: "text",
            label: this.$t("lang.label.cvc"),
            model: "cvc",
            readonly: false,
            required: true,
            styleClasses: "col-md-3",
            min: 3,
            max: 4,
            validator: VueFormGenerator.validators.string.locale({
              fieldIsRequired: this.$t("lang.label.required"),
              textTooSmall: this.$t("lang.validation.texttosmall", {
                min: "{1}",
              }),
            }),
          },
          {
            type: "switch",
            label: this.$t("lang.label.markasprincipal"),
            model: "default",
            multi: true,
            default: 1,
            textOn: this.$t("lang.label.principal"),
            textOff: this.$t("lang.label.no"),
            valueOn: "1",
            valueOff: "0",
            styleClasses: "col-md-3",
          },
        ],
      },
      formOptions: {
        validateAfterLoad: true,
        validateAfterChanged: true,
      },
    };
  },

  watch: {
    "model.name_on_card"() {
      this.model.name_on_card = this.$sanitize(this.model.name_on_card);
    },
    "model.card_number"() {
      this.model.card_number = this.$sanitize(this.model.card_number);
    },
    "model.cvc"() {
      this.model.cvc = this.$sanitize(this.model.cvc);
    },
  },

  components: {
    Header,
    "vue-form-generator": VueFormGenerator.component,
  },
  created() {
    this.getMonths();
    this.getYears();
    this.checkPlan();
  },
  computed: {
    model() {
      return this.selectedMethod;
    },
    ...mapState({
      headerTab: (state) => state.header.tab,
      plans: (state) => state.plans.all,
      activePlans: (state) => state.plans.allActives,
    }),
  },
  methods: {
    ...mapActions("billings", {
      startLoading: "startLoading",
      finishLoading: "finishLoading",
    }),
    ...mapActions("plans", {
      getAllPlans: "getAll",
    }),
    getModel() {
      this.$refs.vfg.validate();
      if (this.$refs.vfg.errors.length > 0) {
        return false;
      }
      return this.$refs.vfg.model;
    },
    checkPlan() {
      plansService.getAll().then((plans) => {
        if (this.subscriptionData.plan_id) {
          const plan = plans.find((plan) => {
            return plan.plan_id == this.subscriptionData.plan_id;
          });
          if (plan) {
            campaignsService.getActiveCampaigns().then((result) => {
              if (result) {
                if (
                  (plan.plan_id == 1 && result.total > 1) ||
                  (plan.plan_id == 2 && result.total > 3)
                ) {
                  this.$swal({
                    type: "error",
                    title: this.$t("lang.label.error"),
                    text: this.$t(
                      "lang.label.thenumberofactivecampaignsishigher"
                    ),
                    showConfirmButton: true,
                  });
                  this.$router.push("/upgrade");
                }
              }
            });
          } else {
            this.$swal({
              type: "error",
              title: this.$t("lang.label.error"),
              text: this.$t("lang.label.theplandoesntexists"),
              showConfirmButton: true,
            });
            this.$router.push("/upgrade");
          }
        }
      });
    },
    getMonths() {
      let field = this.schema.fields.find(
        (field) => field.model === "expiration_month"
      );
      let months = [];
      let i;
      for (i = 1; i <= 12; i++) {
        months[i] = i;
      }
      field.values = months;
    },
    getYears() {
      let field = this.schema.fields.find(
        (field) => field.model === "expiration_year"
      );
      let year = new Date().getFullYear();
      let years = [];
      let i;
      for (i = 0; i < 10; i++) {
        years[i + year] = i + year;
      }
      field.values = years;
    },
    checkExpiration(model) {
      if (this.selectedMethod.id) {
        if (model.expiration_year != "" && model.expiration_month != "") {
          var today = new Date();
          var lastDayOfMonth = new Date(
            today.getFullYear(),
            today.getMonth() + 1,
            0
          );
          var expirationDate = new Date(
            "20" + model.expiration_year,
            model.expiration_month,
            0
          );
          if (lastDayOfMonth.getTime() < expirationDate.getTime()) {
            return true;
          }
        }
      }
      return false;
    },
    onSubmit() {
      let self = this;
      if (this.$refs.vfg.errors.length > 0) {
        this.$swal({
          type: "error",
          title: this.$t("lang.label.error"),
          text: this.$t("lang.label.checkdeerrormessagesintheformandtryagain"),
          showConfirmButton: true,
        });
      } else {
        this.$swal({
          type: "warning",
          title: this.$t("lang.label.areyousure"),
          text: this.$t("lang.label.youaregoingtoaddanewpaymentmethod"),
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33a2c",
          confirmButtonText: this.$t("lang.button.yes"),
        }).then((result) => {
          if (result.value) {
            this.saveSepaPaymentMethod();
          }
        });
      }
    },

    saveSepaPaymentMethod(termsModel) {
      // JavaEnabled,ColorDepth,ScreenHeight,ScreenWidth,TimeZone,AcceptHeader,UserAgent
      if(termsModel === undefined){
        termsModel = {};
      }
      let browserInfo = {
        browserColorDepth: screen.colorDepth,
        browserJavaEnabled: navigator.javaEnabled(),
        browserLanguage: navigator.language,
        browserScreenHeight: screen.height,
        browserScreenWidth: screen.width,
        browserTimeZone: new Date().getTimezoneOffset(),
      };

      this.startLoading();
      let data = Object.assign(
        this.$refs.vfg.model,
        this.subscriptionData,
        termsModel,
        browserInfo
      );
      
      billingsService.saveSepaPaymentMethod(data).then((response) => {
        return new Promise((resolve, reject) => {
          this.finishLoading();
          if (response.ingenico !== undefined) {
            this.$swal({
              type: "success",
              title: this.$root.$t("lang.label.great"),
              html: response.ingenico,
              showConfirmButton: false,
              allowOutsideClick: false,
            });
          } else if (response == "success") {
            this.refreshPaymentMethods();
            this.$swal({
              type: "success",
              title: this.$t("lang.label.great"),
              showConfirmButton: false,
              timer: 1500,
            });
            resolve("ok");
          } else {
            this.$swal({
              type: "error",
              title: this.$t("lang.label.error"),
              text: this.$t("lang.label.yourcreditcardhasnotbeenauthorized"),
              showConfirmButton: false,
              timer: 3000,
            });
            reject("error");
          }
        });
      });
    },
    refreshPaymentMethods() {
      this.$emit("refreshPaymentMethods", true);
    },
  },
};
</script>