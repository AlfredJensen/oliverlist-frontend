<template>
  <div class="animated fadeIn fast">
    <LoadingSpinner v-if="loading || loadingOptionsList" />
    <div class="viewBilling" v-if="!loading && !loadingOptionsList">
      <main class="contenedor">
        <div class="p-2">
          <h5 class="font-weight-bold">
            {{ $t("lang.label.paymentprofile") }}
          </h5>
        </div>
        <!-- <transition name="fade">
                    <div v-if="alert" class="alert alert-danger" role="alert">
                    <span class="alert-link">{{ $t('lang.label.youneedtofulfillyoubillingaccount') }}</span>
                    </div>
                </transition> -->
        <form id="formBill" @submit.prevent="onSubmit">
          <div class="card mt-3">
            <div class="row">
              <div class="col-sm-4">
                <h6 class="font-weight-bold pb-4">
                  {{ $t("lang.label.contact") }}
                </h6>
                <vue-form-generator
                  ref="vfgContact"
                  :schema="schemaContact"
                  :model="this.billingProfile"
                  :options="formOptions"
                ></vue-form-generator>
              </div>
              <div class="col-sm-8">
                <h6 class="font-weight-bold pb-4">
                  {{ $t("lang.label.businessnameandaddress") }}
                </h6>
                <vue-form-generator
                  ref="vfgData"
                  :schema="schemaData"
                  :model="this.billingProfile"
                  :options="formOptions"
                ></vue-form-generator>
              </div>
            </div>
          </div>
          <div class="my-4 text-right mr-4" v-if="showSaveButton">
            <button class="btn btn-success btn-sm" type="submit">
              {{ $t("lang.button.save") }}
            </button>
          </div>
        </form>
      </main>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import { mapState, mapActions } from "vuex";
import Header from "@/components/Header.vue";
import { billingsService } from "@/_services";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import VueFormGenerator from "vue-form-generator";
import "vue-form-generator/dist/vfg.css";

export default {
  props: {
    showSaveButton: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      alert: false,
      billingProfile: {},
      loading: true,
      schemaContact: {
        fields: [
          {
            type: "input",
            inputType: "text",
            label: this.$t("lang.label.name"),
            model: "contact_name",
            readonly: false,
            required: true,
            disabled: false,
            validator: VueFormGenerator.validators.string.locale({
              fieldIsRequired: this.$t("lang.label.required"),
            }),
            styleClasses: "col-md-12",
          },
          {
            type: "input",
            inputType: "text",
            label: this.$t("lang.label.email"),
            model: "contact_email",
            readonly: false,
            required: true,
            disabled: false,
            min: 5,
            validator: [
              VueFormGenerator.validators.string.locale({
                fieldIsRequired: this.$t("lang.label.required"),
              }),
              "emailValidator",
            ],
            styleClasses: "col-md-12",
          },
        ],
      },
      schemaData: {
        fields: [
          {
            type: "input",
            inputType: "hidden",
            model: "id",
            readonly: true,
            disabled: true,
            styleClasses: "d-none",
          },
          {
            type: "input",
            inputType: "hidden",
            model: "client_id",
            readonly: true,
            disabled: true,
            styleClasses: "d-none",
          },
          {
            type: "input",
            inputType: "text",
            label: this.$t("lang.label.name"),
            model: "name",
            readonly: false,
            required: true,
            disabled: false,
            validator: VueFormGenerator.validators.string.locale({
              fieldIsRequired: this.$t("lang.label.required"),
            }),
            styleClasses: "col-sm-6",
          },
          {
            type: "input",
            inputType: "text",
            label: this.$t("lang.label.legalrepresentative"),
            model: "legal_representative",
            readonly: false,
            featured: true,
            required: true,
            disabled: false,
            min: 5,
            validator: VueFormGenerator.validators.string.locale({
              fieldIsRequired: this.$t("lang.label.required"),
            }),
            styleClasses: "col-sm-6",
          },
          {
            type: "input",
            inputType: "text",
            label: this.$t("lang.label.address"),
            model: "address",
            readonly: false,
            required: true,
            disabled: false,
            min: 5,
            validator: VueFormGenerator.validators.string.locale({
              fieldIsRequired: this.$t("lang.label.required"),
            }),
            styleClasses: "col-sm-6",
          },
          {
            type: "select",
            inputType: "text",
            label: this.$t("lang.label.country"),
            model: "country_id",
            readonly: false,
            required: true,
            disabled: false,
            selectOptions: {},
            values: () => {
              return this.profileCountries;
            },
            validator: VueFormGenerator.validators.string.locale({
              fieldIsRequired: this.$t("lang.label.required"),
            }),
            styleClasses: "col-sm-6",
          },
        ],
      },

      formOptions: {
        validateAfterLoad: true,
        validateAfterChanged: true,
      },
    };
  },
  components: {
    Header,
    LoadingSpinner,
    "vue-form-generator": VueFormGenerator.component,
  },

  watch: {
    "billingProfile.contact_name"() {
      this.billingProfile.contact_name = this.$sanitize(
        this.billingProfile.contact_name
      );
    },
    "billingProfile.contact_email"() {
      this.billingProfile.contact_email = this.$sanitize(
        this.billingProfile.contact_email
      );
    },
    "billingProfile.name"() {
      this.billingProfile.name = this.$sanitize(this.billingProfile.name);
    },
    "billingProfile.legal_representative"() {
      this.billingProfile.legal_representative = this.$sanitize(
        this.billingProfile.legal_representative
      );
    },
    "billingProfile.address"() {
      this.billingProfile.address = this.$sanitize(this.billingProfile.address);
    },
    "billingProfile.country"() {
      this.billingProfile.country = this.$sanitize(this.billingProfile.country);
    },
  },
  computed: {
    ...mapState({
      loadingOptionsList: (state) => !state.optionsList.completeLoading,
      profileCountries: (state) =>
        state.optionsList.all["profile_countries"].data,
    }),
  },
  created() {
    this.getAllOptionsList();
    this.getData();
  },
  methods: {
    ...mapActions("optionsList", {
      getAllOptionsList: "getAll",
    }),
    showAlert() {
      var elements = document.querySelectorAll("#formBill input[type=text]");
      for (var i = 0, element; (element = elements[i++]); ) {
        if (element.value === "") this.alert = true;
      }
    },

    getData() {
      this.getBillingProfile();
      return (this.loading = false);
    },
    getBillingProfile() {
      billingsService.getBillingProfile().then((result) => {
        if (result) {
          this.billingProfile = result;
        } else {
          this.billingProfile = {
            name: "",
            legal_representative: "",
            address: "",
            country: "",
            contact_name: "",
            contact_email: "",
          };
          this.showAlert();
        }
      });
    },

    getModel() {
      this.$refs.vfgData.validate();
      this.$refs.vfgContact.validate();
      if (
        this.$refs.vfgData.errors.length > 0 ||
        this.$refs.vfgContact.errors.length > 0
      ) {
        return false;
      }
      return Object.assign(
        this.$refs.vfgContact.model,
        this.$refs.vfgData.model
      );
    },
    onSubmit($event) {
      if (
        this.$refs.vfgData.errors.length > 0 ||
        this.$refs.vfgContact.errors.length > 0
      ) {
        $event.preventDefault();
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
          text: this.$t(
            "lang.label.youaregoingtochangetheconfigurationofyourbillingsettings"
          ),
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33a2c",
          confirmButtonText: this.$t("lang.button.yesupdate"),
        }).then((result) => {
          if (result.value) {
            this.saveBillingProfile();
          }
        });
      }
    },
    saveBillingProfile() {
      return new Promise((resolve, reject) => {
        billingsService
          .saveBillingProfile(
            Object.assign(this.$refs.vfgContact.model, this.$refs.vfgData.model)
          )
          .then((response) => {
            this.alert = false;
            if (this.showSaveButton) {
              this.$swal({
                type: "success",
                title: this.$t("lang.label.great"),
                text: this.$t("lang.label.billingsettingswereupdated"),
                showConfirmButton: false,
                timer: 3000,
              });
            }
          })
          .then((result) => {
            if (this.showSaveButton) {
              this.$emit("profileValid");
            }
          })
          .then((result) => {
            this.getData();
          })
          .then((result) => {
            resolve("ok");
          })
          .catch((err) => {
            reject("error");
          });
      });
    },
  },
};
</script>
<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
