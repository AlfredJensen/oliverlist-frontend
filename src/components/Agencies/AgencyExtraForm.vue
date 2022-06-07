<template>
  <main class="contenedor">
    <div class="row">
      <div class="col-md-12">
        <div class="row mt-5">
          <div class="col-sm-12">
            <h5>
              <label>Domains config</label>
            </h5>
          </div>
          <div class="col-sm-10">
            <vue-form-generator
              ref="domainConfigForm"
              :schema="schemaDomainConfig"
              :model="this.currentDomainConfig"
              :options="formOptions"
            ></vue-form-generator>
          </div>
          <div class="col-sm-2 mt-4 ml--25pct">
            <button
              class="btn btn-success btn float-left"
              @click="
                addItem(
                  'model.client.domain_config',
                  'currentDomainConfig',
                  'domain',
                  'domainConfigForm'
                )
              "
            >
              <i class="icon-plus"></i>
            </button>
          </div>
        </div>

        <div
          class="row"
          v-if="
            this.model.client.domain_config != undefined &&
            this.model.client.domain_config.length > 0
          "
        >
          <div class="col-sm-10">
            <div class="row">
              <div class="col-sm-2 font-weight-bold">
                {{ $t("lang.label.domain") }}
              </div>
              <div class="col-sm-1 font-weight-bold">Purchase</div>
              <div class="col-sm-1 font-weight-bold">Config</div>
              <div class="col-sm-1 font-weight-bold">SPF</div>
              <div class="col-sm-1 font-weight-bold">DKIM</div>
              <div class="col-sm-1 font-weight-bold">AUTH DKIM</div>
              <div class="col-sm-1 font-weight-bold">DMARC</div>
            </div>
          </div>
          <div class="col-sm-2 ml--25pct">
            {{ $t("lang.label.actions") }}
          </div>
        </div>

        <div
          class="row"
          v-for="(domain_config, index) in model.client.domain_config"
          :key="'domain_config_'+index"
        >
          <div class="col-sm-10">
            <div class="row">
              <div class="col-sm-2">{{ domain_config.domain }}</div>
              <div class="col-sm-1">
                {{
                  domain_config.purchase == 1
                    ? $t("lang.button.yes")
                    : $t("lang.label.no")
                }}
              </div>
              <div class="col-sm-1">
                {{
                  domain_config.config == 1
                    ? $t("lang.button.yes")
                    : $t("lang.label.no")
                }}
              </div>
              <div class="col-sm-1">
                {{
                  domain_config.spf == 1
                    ? $t("lang.button.yes")
                    : $t("lang.label.no")
                }}
              </div>
              <div class="col-sm-1">
                {{
                  domain_config.dkim == 1
                    ? $t("lang.button.yes")
                    : $t("lang.label.no")
                }}
              </div>
              <div class="col-sm-1">
                {{
                  domain_config.auth_dkim == 1
                    ? $t("lang.button.yes")
                    : $t("lang.label.no")
                }}
              </div>
              <div class="col-sm-1">
                {{
                  domain_config.dmarc == 1
                    ? $t("lang.button.yes")
                    : $t("lang.label.no")
                }}
              </div>
            </div>
          </div>
          <div class="col-sm-2 ml--25pct">
            <i
              class="icon-edit cursor-pointer mr-2"
              @click="
                editItem(
                  'model.client.domain_config',
                  index,
                  'currentDomainConfig'
                )
              "
            ></i>
            <i
              class="icon-trash cursor-pointer"
              @click="removeItem('model.client.domain_config', index)"
            ></i>
          </div>
        </div>

        <div class="row mt-5">
          <div class="col-sm-12">
            <h5>
              <label>Landing config</label>
            </h5>
          </div>
          <div class="col-sm-10">
            <vue-form-generator
              ref="landingConfigForm"
              :schema="schemaLandingConfig"
              :model="this.currentLandingConfig"
              :options="formOptions"
            ></vue-form-generator>
          </div>
          <div class="col-sm-2 mt-4 ml--25pct">
            <button
              class="btn btn-success btn float-left"
              @click="
                addItem(
                  'model.client.landing_config',
                  'currentLandingConfig',
                  'url',
                  'landingConfigForm'
                )
              "
            >
              <i class="icon-plus"></i>
            </button>
          </div>
        </div>

        <div
          class="row"
          v-for="(landing_config, index) in model.client.landing_config"
          :key="'landing_config_'+index"
        >
          <div class="col-sm-10">
            <div class="row">
              <div class="col-sm-3">{{ landing_config.url }}</div>
              <div class="col-sm-3">
                {{
                  landing_config.status == 1
                    ? $t("lang.button.yes")
                    : $t("lang.label.no")
                }}
              </div>
            </div>
          </div>
          <div class="col-sm-2 ml--25pct">
            <i
              class="icon-edit cursor-pointer mr-2"
              @click="
                editItem(
                  'model.client.landing_config',
                  index,
                  'currentLandingConfig'
                )
              "
            ></i>
            <i
              class="icon-trash cursor-pointer"
              @click="removeItem('model.client.landing_config', index)"
            ></i>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import AlertError from "@/components/AlertError.vue";
import { mapState, mapActions } from "vuex";
import VueFormGenerator from "vue-form-generator";
import BillingProfile from "@/components/Billing/BillingProfile.vue";
import LoadingSpinner from "@/components/LoadingSpinner.vue";

import { itemsMixin } from "@/_mixins/";

export default {
  props: {
    model: Object,
  },
  mixins: [itemsMixin],
  components: {
    AlertError,
    BillingProfile,
    LoadingSpinner,
  },
  data() {
    var self = this;
    return {
      schemaClient: {
        fields: [
          {
            type: "input",
            inputType: "text",
            label: this.$t("lang.label.firstname"),
            model: "user.name",
            featured: true,
            readonly: false,
            required: true,
            disabled: false,
            min: 3,
            max: 100,
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
            label: this.$t("lang.label.name"),
            model: "user.lastname",
            featured: true,
            readonly: false,
            required: true,
            disabled: false,
            min: 3,
            max: 100,
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
            label: this.$t("lang.label.language"),
            model: "user.language_id",
            readonly: false,
            featured: true,
            required: true,
            validator: VueFormGenerator.validators.required,
            selectOptions: {},
            values: () => {
              return self.langs;
            },
            styleClasses: "col-md-6",
          },
          {
            type: "input",
            inputType: "text",
            label: this.$t("lang.label.company"),
            model: "client.name",
            featured: true,
            readonly: false,
            required: true,
            disabled: false,
            min: 3,
            max: 100,
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
            label: this.$t("lang.label.email"),
            model: "user.email",
            featured: true,
            readonly: false,
            required: true,
            disabled() {
              return self.currentUser.role_id != 1;
            },
            validator: [
              VueFormGenerator.validators.string.locale({
                fieldIsRequired: this.$t("lang.label.required"),
              }),
              "emailValidator",
            ],
            styleClasses: "col-md-6",
          },
          {
            type: "input",
            inputType: "text",
            label: this.$t("lang.label.phone"),
            model: "user.phone",
            featured: true,
            readonly: false,
            required: true,
            disabled: false,
            min: 5,
            max: 50,
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
            label: this.$t("lang.label.address"),
            model: "client.address",
            featured: true,
            readonly: false,
            required: true,
            disabled: false,
            min: 5,
            max: 100,
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
            label: "SIRET",
            model: "client.siret",
            featured: true,
            readonly: false,
            required: true,
            disabled: false,
            min: 5,
            max: 100,
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
            label: this.$t("lang.label.website"),
            model: "client.website",
            featured: true,
            readonly: false,
            required: true,
            disabled: false,
            min: 3,
            max: 255,
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
            inputType: "password",
            label: this.$t("lang.label.password"),
            model: "user.password",
            featured: true,
            required() {
              return self.selectedClientId === undefined;
            },
            validator(value, field, model) {
              if (
                self.selectedClientId === undefined ||
                (self.selectedClientId !== undefined &&
                  value != undefined &&
                  value != "")
              ) {
                return VueFormGenerator.validators.validatePassword(
                  value,
                  field,
                  model
                );
              }
              return [];
            },
            styleClasses: "col-md-6",
          },
          {
            type: "input",
            inputType: "date",
            label: this.$t("lang.appointments.signatureexpirationdate"),
            model: "client.signature_expiration_date",
            readonly: false,
            featured: true,
            required: true,
            validator: [
              VueFormGenerator.validators.required,
              VueFormGenerator.validators.date,
            ],
            visible() {
              return self.currentUser.role_id == 1;
            },
            format: "YYYY-MM-DD",
            styleClasses: "col-md-6 display-inline",
          },
          {
            type: "input",
            inputType: "datetime",
            label: this.$t("lang.appointments.signedon"),
            model: "client.signed_on",
            readonly: false,
            featured: true,
            required: false,
            validator: [VueFormGenerator.validators.date],
            visible() {
              return (
                self.currentUser.role_id == 1 &&
                (self.model_init.client.signed_on === undefined ||
                  self.model_init.client.signed_on === null)
              );
            },
            format: "YYYY-mm-dd H:i:s",
            hint: this.$t("lang.appointments.signedonhint"),
            styleClasses: "col-md-6 display-inline",
          },
        ],
      },
      schemaDomainConfig: {
        fields: [
          {
            type: "input",
            inputType: "text",
            label: this.$t("lang.label.name"),
            model: "domain",
            featured: true,
            readonly: false,
            required: true,
            disabled: false,
            min: 3,
            max: 50,
            validator: VueFormGenerator.validators.string.locale({
              fieldIsRequired: this.$t("lang.label.required"),
              textTooSmall: this.$t("lang.validation.texttosmall", {
                min: "{1}",
              }),
            }),
            styleClasses: "col-md-2",
          },
          {
            type: "select",
            label: "Purchase",
            model: "purchase",
            featured: true,
            readonly: false,
            required: true,
            disabled: false,
            values: [
              { id: 1, name: this.$t("lang.button.yes") },
              { id: 0, name: this.$t("lang.label.no") },
            ],
            validator: VueFormGenerator.validators.integer,
            styleClasses: "col-md-1",
          },
          {
            type: "select",
            label: "Config",
            model: "config",
            featured: true,
            readonly: false,
            required: true,
            disabled: false,
            values: [
              { id: 1, name: this.$t("lang.button.yes") },
              { id: 0, name: this.$t("lang.label.no") },
            ],
            validator: VueFormGenerator.validators.integer,
            styleClasses: "col-md-1",
          },
          {
            type: "select",
            label: "SPF",
            model: "spf",
            featured: true,
            readonly: false,
            required: true,
            disabled: false,
            values: [
              { id: 1, name: this.$t("lang.button.yes") },
              { id: 0, name: this.$t("lang.label.no") },
            ],
            validator: VueFormGenerator.validators.integer,
            styleClasses: "col-md-1",
          },
          {
            type: "select",
            label: "DKIM",
            model: "dkim",
            featured: true,
            readonly: false,
            required: true,
            disabled: false,
            values: [
              { id: 1, name: this.$t("lang.button.yes") },
              { id: 0, name: this.$t("lang.label.no") },
            ],
            validator: VueFormGenerator.validators.integer,
            styleClasses: "col-md-1",
          },
          {
            type: "select",
            label: "AUTH DKIM",
            model: "auth_dkim",
            featured: true,
            readonly: false,
            required: true,
            disabled: false,
            values: [
              { id: 1, name: this.$t("lang.button.yes") },
              { id: 0, name: this.$t("lang.label.no") },
            ],
            validator: VueFormGenerator.validators.integer,
            styleClasses: "col-md-1",
          },
          {
            type: "select",
            label: "DMARC",
            model: "dmarc",
            featured: true,
            readonly: false,
            required: true,
            disabled: false,
            values: [
              { id: 1, name: this.$t("lang.button.yes") },
              { id: 0, name: this.$t("lang.label.no") },
            ],
            validator: VueFormGenerator.validators.integer,
            styleClasses: "col-md-1",
          },
        ],
      },

      schemaLandingConfig: {
        fields: [
          {
            type: "input",
            inputType: "text",
            label: "URL",
            model: "url",
            featured: true,
            readonly: false,
            required: true,
            disabled: false,
            min: 3,
            max: 125,
            validator: VueFormGenerator.validators.string.locale({
              fieldIsRequired: this.$t("lang.label.required"),
              textTooSmall: this.$t("lang.validation.texttosmall", {
                min: "{1}",
              }),
            }),
            styleClasses: "col-md-3",
          },
          {
            type: "select",
            label: "Status",
            model: "status",
            featured: true,
            readonly: false,
            required: true,
            disabled: false,
            values: [
              { id: 0, name: this.$t("lang.label.no") },
              { id: 1, name: this.$t("lang.button.yes") },
            ],
            validator: VueFormGenerator.validators.integer,
            styleClasses: "col-md-3",
          },
        ],
      },

      formOptions: {
        validateAfterLoad: false,
        validateAfterChanged: true,
      },
      currentDomainConfig: {},
      currentLandingConfig: {},
    };
  },
  computed: {
    ...mapState({
      currentUser: (state) => state.authentication.user,
    }),
    loggingIn() {
      return this.$store.state.authentication.status.loggingIn;
    },
    alert() {
      return this.$store.state.alert;
    },
    agencyFormValidate() {
      this.$refs.clientForm.validate();
      this.$refs.appointmentForm.validate();
      this.$refs.editorPitchV.validate();
      this.$refs.editorExtraInfoV.validate();
      if (
        this.$refs.clientForm.errors.length > 0 ||
        this.$refs.appointmentForm.errors.length > 0 ||
        this.$refs.editorPitchV.errors.length > 0 ||
        this.$refs.editorExtraInfoV.errors.length > 0 ||
        this.model.targets.length == 0 ||
        this.model.salesRep.length == 0
      ) {
        return false;
      }
      return true;
    },
  },
  created() {},
  methods: {},
};
</script>
<style >
.ml--25pct {
  margin-left: -25%;
}
</style>