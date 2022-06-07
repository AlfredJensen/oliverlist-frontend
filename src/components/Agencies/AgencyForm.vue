<template>
  <main class="contenedor">
    <LoadingSpinner v-if="loadingOptionsList || loading" />
    <div class="row" v-if="!loadingOptionsList && !loading">
      <div class="col-md-12">
        <img
          src="@/assets/images/2.png"
          class="rounded mx-auto d-block"
          width="150px"
        />
        <h2 class="text-lg-center my-4">
          {{ $t("lang.appointments.commercialproposal") }}
        </h2>
        <div v-if="!loading">
          <div
            v-if="alert.message && !submittedSecond"
            :class="`login-alert alert ${alert.type}`"
            v-html="alert.message"
          ></div>
        </div>
        <div>
          <h4>Client Info</h4>
          <vue-form-generator
            ref="clientForm"
            :schema="schemaClient"
            :model="this.model"
            :options="formOptions"
          ></vue-form-generator>
        </div>
        <div>
          <h4 class="mt-5">{{ $t("lang.label.target") }}</h4>

          <table class="w-100">
            <thead>
              <tr>
                <th width="100">
                  {{ $t("lang.label.name") }}
                </th>
                <th>
                  {{ $t("lang.label.industry") }}
                </th>
                <th width="300">
                  {{ $t("lang.label.jobtitle") }}
                </th>
                <th width="300">
                  {{ $t("lang.label.companysize") }}
                </th>
                <th>
                  {{ $t("lang.label.location") }}
                </th>
                <th>
                  {{ $t("lang.label.hierarchicallevel") }}
                </th>
                <th>
                  {{ $t("lang.label.sector") }}
                </th>
                <th>
                  {{ $t("lang.label.country") }}
                </th>
                <th width="60">
                  {{ $t("lang.label.actions") }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr :key="currentTargetKey">
                <td>
                  <div class="mt-3">
                    <vue-form-generator
                      ref="targetForm"
                      :schema="schemaTarget"
                      :model="currentTarget"
                      :options="formOptions"
                    ></vue-form-generator>
                  </div>
                </td>
                <td>
                  <IndustrySearch
                    :option_list="this.hierarchyoptionsGoogleAll"
                    :default_values="currentTarget.data.categories_industry"
                  >
                  </IndustrySearch>
                </td>
                <td>
                  <KeyWordSearch
                    ref="jobtilte"
                    @quantity="updateCant"
                    :default_values="currentTarget.data.categories_jobs"
                  />
                </td>
                <td>
                  <div class="mt-3">
                    <vue-form-generator
                      ref="employeesForm"
                      :schema="schemaEmployees"
                      :model="currentTarget"
                      :options="formOptions"
                    ></vue-form-generator>
                  </div>
                </td>
                <td>
                  <IndustrySearch
                    :option_list="this.hierarchyoptions"
                    :default_values="currentTarget.data.region"
                  >
                  </IndustrySearch>
                </td>
                <td>
                  <IndustrySearch
                    :option_list="this.hierarchyoptionsSearchLevel"
                    :default_values="currentTarget.data.categories_level"
                  >
                  </IndustrySearch>
                </td>
                <td>
                  <IndustrySearch
                    :option_list="this.hierarchyoptionsSearchFunction"
                    :default_values="currentTarget.data.categories_function"
                  >
                  </IndustrySearch>
                </td>
                <td>
                  <div class="">
                    <IndustrySearch
                      :option_list="hierarchyoptionsCountry"
                      :default_values="currentTarget.data.countries"
                    >
                    </IndustrySearch>
                  </div>
                </td>
                <td>
                  <button
                    class="btn btn-success btn float-right"
                    @click="addTarget()"
                  >
                    <i class="icon-plus ml-2"></i>
                  </button>
                </td>
              </tr>
            </tbody>
            <tbody>
              <tr v-for="(target, index) in model.targets" :key="index">
                <td class="text-center">{{ target.name }}</td>
                <td :key="index + '1'">
                  <IndustrySearch
                    :option_list="hierarchyoptionsGoogleAll"
                    :default_values="target.data.categories_industry"
                    :isDisabled="true"
                  >
                  </IndustrySearch>
                </td>
                <td :key="index + '11'">
                  <p class="p-2">
                    <b>{{ $t("lang.search.isanyof") }}: </b>
                    <span
                      v-for="(tag, ti) in target.data.categories_jobs.anyof"
                      :key="ti"
                    >
                      {{ tag.word }},
                    </span>
                  </p>
                  <p class="p-2">
                    <b>{{ $t("lang.search.isnotanyof") }}: </b>
                    <span
                      v-for="(tag, ti) in target.data.categories_jobs.notanyof"
                      :key="ti"
                    >
                      {{ tag.word }},
                    </span>
                  </p>
                </td>
                <td :key="index + '2'" class="text-center">
                  <div
                    v-if="
                      target.data.employees != undefined &&
                      target.data.employees.keywords != undefined
                    "
                  >
                    <span
                      v-if="target.data.employees.keywords.greater != undefined"
                    >
                      {{ $t("lang.label.morethan") }} :
                      {{ target.data.employees.keywords.greater }}</span
                    >
                    |
                    <span
                      v-if="
                        target.data.employees != undefined &&
                        target.data.employees.keywords.less != undefined
                      "
                    >
                      {{ $t("lang.label.lessthan") }} :
                      {{ target.data.employees.keywords.less }}</span
                    >
                  </div>
                </td>
                <td :key="index + '3'">
                  <IndustrySearch
                    :option_list="hierarchyoptions"
                    :default_values="target.data.region"
                    :isDisabled="true"
                  >
                  </IndustrySearch>
                </td>
                <td :key="index + '4'">
                  <IndustrySearch
                    :option_list="hierarchyoptionsSearchLevel"
                    :default_values="target.data.categories_level"
                    :isDisabled="true"
                  >
                  </IndustrySearch>
                </td>
                <td :key="index + '5'">
                  <IndustrySearch
                    :option_list="hierarchyoptionsSearchFunction"
                    :default_values="target.data.categories_function"
                    :isDisabled="true"
                  >
                  </IndustrySearch>
                </td>
                <td :key="index + '6'">
                  <IndustrySearch
                    :option_list="hierarchyoptionsCountry"
                    :default_values="target.data.countries"
                    :isDisabled="true"
                  >
                  </IndustrySearch>
                </td>
                <td>
                  <span class="p-2">
                    <i
                      class="icon-edit cursor-pointer mr-2"
                      @click="editItem('model.targets', index, 'currentTarget')"
                    ></i>
                    <i
                      v-if="target.in_campaign == false"
                      class="icon-trash cursor-pointer"
                      @click="removeItem('model.targets', index)"
                    ></i>
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="row">
          <div class="col-md-6">
            <h4 class="mt-5">Appointment config</h4>
            <vue-form-generator
              ref="appointmentForm"
              :schema="schemaAppointment"
              :model="this.model"
              :options="formOptions"
            ></vue-form-generator>
          </div>
          <div class="col-md-6">
            <h4 class="mt-5">
              <h4 class="mt-5 form-group required">
                <label>Sales Reps</label>
              </h4>
              <span
                class="badge badge-success cursor-pointer"
                @click="openSalesRep(true)"
              >
                <i class="icon-plus" v-if="!currentSalesRepWrapper"></i>
              </span>
            </h4>
            <div class="row" v-if="currentSalesRepWrapper">
              <div class="col-sm-10">
                <vue-form-generator
                  ref="salesRepForm"
                  :schema="schemaSalesRep"
                  :model="this.currentSalesRep"
                  :options="formOptions"
                ></vue-form-generator>
              </div>
              <div class="col-sm-2 mt-5">
                <button
                  class="btn btn-success btn float-left"
                  @click="
                    addItem(
                      'model.salesRep',
                      'currentSalesRep',
                      'email',
                      'salesRepForm'
                    )
                  "
                >
                  <i class="icon-plus"></i>
                </button>
                <button
                  class="btn btn-disabled btn float-left mr-2 small"
                  @click="openSalesRep(false)"
                >
                  {{ $t("lang.button.close") }}
                </button>
              </div>
            </div>
            <div
              class="w-100"
              v-if="
                this.model.salesRep != undefined &&
                this.model.salesRep.length > 0
              "
            >
              <div class="row">
                <div class="col-sm-10">
                  <div class="row">
                    <div class="col-sm-3 font-weight-bold">
                      {{ $t("lang.label.name") }}
                    </div>
                    <div class="col-sm-3 font-weight-bold">
                      {{ $t("lang.label.lastname") }}
                    </div>
                    <div class="col-sm-3 font-weight-bold">
                      {{ $t("lang.label.email") }}
                    </div>
                    <div class="col-sm-3 font-weight-bold">
                      {{ $t("lang.label.phone") }}
                    </div>
                  </div>
                </div>
                <div class="col-sm-2">
                  {{ $t("lang.label.actions") }}
                </div>
              </div>

              <div
                class="row"
                v-for="(person, index) in model.salesRep"
                :key="index"
              >
                <div class="col-sm-10">
                  <div class="row">
                    <div class="col-sm-3">{{ person.first_name }}</div>
                    <div class="col-sm-3">{{ person.last_name }}</div>
                    <div class="col-sm-3">{{ person.email }}</div>
                    <div class="col-sm-3">{{ person.phone }}</div>
                  </div>
                </div>
                <div class="col-sm-2">
                  <i
                    class="icon-edit cursor-pointer mr-2"
                    @click="
                      editItem('model.salesRep', index, 'currentSalesRep')
                    "
                  ></i>
                  <i
                    class="icon-trash cursor-pointer"
                    @click="removeItem('model.salesRep', index)"
                  ></i>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-12">
            <div class="row">
              <div class="col-md-6">
                <div class="field-ckeditor-wrappar">
                  <ValidationProvider
                    ref="editorPitchV"
                    :rules="{
                      required: true,
                      'length-plain-text': [{ max: 750 }],
                    }"
                  >
                    <div slot-scope="{ errors }">
                      <div
                        class="
                          form-group
                          valid
                          featured
                          required
                          field-input field-ckeditor
                        "
                        :class="errors.length > 0 ? 'error' : ''"
                      >
                        <label> {{ $t("lang.appointments.pitch") }}</label>
                        <div class="small">
                          {{ $t("lang.appointments.pitch_info") }}
                        </div>
                        <ckeditor
                          :editor="editorInitial"
                          v-model="editorPitch"
                          :config="editorConfig"
                        ></ckeditor>

                        <div class="errors help-block">
                          <span>{{ errors[0] }}</span>
                        </div>
                      </div>
                    </div>
                  </ValidationProvider>
                </div>
              </div>

              <div class="col-md-6">
                <div class="field-ckeditor-wrappar">
                  <ValidationProvider
                    ref="editorExtraInfoV"
                    :rules="{ 'length-plain-text': [{ max: 750 }] }"
                  >
                    <div slot-scope="{ errors }">
                      <div
                        class="
                          form-group
                          valid
                          featured
                          field-input field-ckeditor
                        "
                        :class="errors.length > 0 ? 'error' : ''"
                      >
                        <label> {{ $t("lang.appointments.extrainfo") }}</label>
                        <div class="small">.</div>
                        <ckeditor
                          :editor="editorInitial"
                          v-model="editorExtraInfo"
                          :config="editorConfig"
                        ></ckeditor>

                        <div class="errors help-block">
                          <span>{{ errors[0] }}</span>
                        </div>
                      </div>
                    </div>
                  </ValidationProvider>
                </div>
              </div>
            </div>

            <AgencyExtraForm
              :model="model"
              v-if="currentUser.role_id == 1 && selectedClientId !== undefined"
            />
            <div class="row">
              <div class="col-md-12">
                <button
                  class="btn btn-success btn float-right"
                  @click.once="setAgency()"
                  :key="setAgencyKey"
                >
                  {{ $t("lang.button.save") }}
                </button>

                <button
                  class="btn btn-disabled btn float-right mr-2"
                  @click="goBack()"
                >
                  {{ $t("lang.button.cancel") }}
                </button>
              </div>
            </div>
            <div
              v-if="currentUser.role_id == 1 && selectedClientId !== undefined"
            >
              <div class="mt-4">
                <h4>Team</h4>
                <ClientTeam :userId="model.user.id" > </ClientTeam>
              </div>
              <div class="mt-4">
                <BillingInfo :userId="model.user.id" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import AlertError from "@/components/AlertError.vue";
import { mapState, mapActions } from "vuex";
import { lenguagesService, clientsService } from "@/_services";
import VueFormGenerator from "vue-form-generator";
import CKEditor from "@ckeditor/ckeditor5-vue";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import IndustrySearch from "@/components/AccountCreation/Steps/Campaign/search/IndustrySearch.vue";
import EmployeeSearch from "@/components/AccountCreation/Steps/Campaign/search/EmployeeSearch.vue";
import PopupItem from "@/components/AccountCreation/Steps/Campaign/search/Popup-item.vue";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import KeyWordSearch from "@/components/AccountCreation/Steps/Campaign/search/KeyWordSearch.vue";
import AgencyExtraForm from "./AgencyExtraForm.vue";
import BillingInfo from "@/components/Users/BillingInfo.vue";
import ClientTeam from "@/components/Account/ClientTeam.vue";
import { itemsMixin } from "@/_mixins/";

export default {
  props: {
    selectedClientId: String,
  },
  mixins: [itemsMixin],
  data() {
    var self = this;
    return {
      loading: false,
      setAgencyKey: 0,
      currentSalesRepWrapper: true,
      keywordscant: 0,
      currentTarget: {
        name: "",
        data: {
          categories_industry: [],
          employees: {},
          categories_level: [],
          categories_function: [],
          categories_jobs: {},
          region: [],
          countries: [],
        },
      },
      currentTargetKey: 0,
      currentTargetInit: {
        name: "",
        data: {
          categories_industry: [],
          employees: {},
          categories_level: [],
          categories_function: [],
          categories_jobs: {},
          region: [],
          countries: [],
        },
      },
      targetsLength: 0,
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
          {
            type: "select",
            inputType: "datetime",
            label: this.$t("lang.label.status"),
            model: "client.client_status_id",
            readonly: false,
            featured: true,
            required: true,
            visible() {
              return (
                self.currentUser.role_id == 1
              );
            },
            validator: VueFormGenerator.validators.required,
            values: [
              { id: 1, name: "Proposal" },
              { id: 2, name: "Outdated" },
              { id: 3, name: "Pending" },
              { id: 4, name: "Active" },
              { id: 5, name: "StandBy" },
              { id: 6, name: "Deleted" },
            ],
            styleClasses: "col-md-6 display-inline",
          },
        ],
      },
      schemaSalesRep: {
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
            label: this.$t("lang.label.name"),
            model: "first_name",
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
            styleClasses: "col-md-3",
          },
          {
            type: "input",
            inputType: "text",
            label: this.$t("lang.label.lastname"),
            model: "last_name",
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
            styleClasses: "col-md-3",
          },
          {
            type: "input",
            inputType: "text",
            label: this.$t("lang.label.email"),
            model: "email",
            featured: true,
            readonly: false,
            required: true,
            disabled: false,
            validator: [
              VueFormGenerator.validators.string.locale({
                fieldIsRequired: this.$t("lang.label.required"),
              }),
              "emailValidator",
            ],
            styleClasses: "col-md-3",
          },
          {
            type: "input",
            inputType: "text",
            label: this.$t("lang.label.phone"),
            model: "phone",
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
            styleClasses: "col-md-3",
          },
        ],
      },
      schemaTarget: {
        fields: [
          {
            type: "input",
            inputType: "text",
            model: "name",
            required: true,
            min: 5,
            max: 30,
            validator: VueFormGenerator.validators.string.locale({
              fieldIsRequired: this.$t("lang.label.required"),
              textTooSmall: this.$t("lang.validation.texttosmall", {
                min: "{1}",
              }),
            }),
          },
        ],
      },
      schemaEmployees: {
        fields: [
          {
            type: "input",
            inputType: "number",
            label: this.$t("lang.label.morethan"),
            model: "data.employees.keywords.greater",
            min: 0,
            max: 100000,
            required: false,
            validator: ["numberBetweenValidator"],
            styleClasses: "col-md-6",
          },
          {
            type: "input",
            inputType: "number",
            label: this.$t("lang.label.lessthan"),
            model: "data.employees.keywords.less",
            min: 0,
            max: 100000,
            required: false,
            validator: ["numberBetweenValidator"],
            styleClasses: "col-md-6",
          },
        ],
      },
      schemaAppointment: {
        fields: [
          {
            type: "input",
            inputType: "number",
            label: this.$t("lang.appointments.quantity"),
            model: "client.appt_quantity",
            featured: true,
            readonly: false,
            required: true,
            disabled: false,
            min: 5,
            max: 10000,
            validator: ["numberBetweenValidator"],
            styleClasses: "col-md-6 display-inline",
          },
          {
            type: "select",
            label: this.$t("lang.appointments.duration"),
            model: "client.appt_duration",
            readonly: false,
            featured: true,
            required: true,
            validator: VueFormGenerator.validators.required,
            values: [
              { id: 15, name: "15 " + this.$t("lang.label.minutes") },
              { id: 30, name: "30 " + this.$t("lang.label.minutes") },
              { id: 45, name: "45 " + this.$t("lang.label.minutes") },
              { id: 60, name: "60 " + this.$t("lang.label.minutes") },
            ],
            styleClasses: "col-md-6 display-inline",
          },
          {
            type: "input",
            inputType: "text",
            label: this.$t("lang.appointments.outreachdomain"),
            model: "client.outreach_domain",
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
            hint: "&lt;your-domain&gt;-pro.com",
            styleClasses: "col-md-6 display-inline",
          },
          {
            type: "input",
            inputType: "date",
            label: this.$t("lang.appointments.startdate"),
            model: "client.appt_start_date",
            readonly: false,
            featured: true,
            required: true,
            validator: [
              VueFormGenerator.validators.required,
              VueFormGenerator.validators.date,
            ],
            // set: function(model, val) {
            //   model.client.appt_start_date = new Date(val).valueOf();
            // },
            format: "YYYY-MM-DD",
            // dateTimePickerOptions: {
            //   format: "YYYY-MM-DD HH:ii:ss",
            // },
            styleClasses: "col-md-6 display-inline",
          },
          {
            type: "select",
            label: this.$t("lang.appointments.synccrm"),
            model: "client.sync_crm",
            featured: true,
            readonly: false,
            required: true,
            disabled: false,
            values: [
              { id: 1, name: this.$t("lang.button.yes") },
              { id: 0, name: this.$t("lang.label.no") },
            ],
            styleClasses: "col-md-6 display-inline",
          },
          {
            type: "input",
            inputType: "number",
            label: this.$t("lang.appointments.meetingprice") + " €",
            model: "client.meeting_price",
            featured: true,
            readonly: false,
            required: true,
            disabled() {
              return self.currentUser.role_id != 1;
            },
            min: 1,
            max: 10000,
            validator: ["numberBetweenValidator"],
            styleClasses: "col-md-6 display-inline",
          },
        ],
      },
      editorInitial: ClassicEditor,
      editorPitch: "",
      editorExtraInfo: "",
      editorConfig: {
        toolbar: ["heading", "|", "bold", "italic", "|", "link"],
      },
      formOptions: {
        validateAfterLoad: false,
        validateAfterChanged: true,
      },
      model_empty: { client: {}, user: {} },
      model: {},
      model_init: {},
      currentSalesRep: {},
    };
  },
  components: {
    AlertError,
    ckeditor: CKEditor.component,
    IndustrySearch,
    EmployeeSearch,
    PopupItem,
    LoadingSpinner,
    KeyWordSearch,
    AgencyExtraForm,
    BillingInfo,
    ClientTeam
  },
  computed: {
    ...mapState({
      currentUser: (state) => state.authentication.user,
      loadingOptionsList: (state) => !state.optionsList.completeLoading,
      langs: (state) => state.optionsList.all["languages"].data,
      hierarchyoptions: (state) => state.optionsList.all["regions"].data,
      hierarchyoptionsSearch: (state) =>
        state.optionsList.all["categories_search_words"].data,
      hierarchyoptionsSearchFunction: (state) =>
        state.optionsList.all["categories_search_function"].data,
      hierarchyoptionsSearchLevel: (state) =>
        state.optionsList.all["categories_search_level"].data,
      hierarchyoptionsGoogle: (state) =>
        state.optionsList.all["categories_google"].data,
      companySizeOptions: (state) => state.optionsList.all["param_5"].data,
      hierarchyoptionsGoogleAll: (state) =>
        state.optionsList.all["categories_google_all"].data,
      hierarchyoptionsCountry: (state) =>
        state.optionsList.all["countries"].data,
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
  created() {
    // if (this.currentUser.role_id > 1 && this.currentUser.agency_signed == 1) {
    if (this.currentUser.role_id > 1) {
      this.$router.push("/settings-account");
    }
    this.getAllOptionsList();
    this.getAgency();
  },
  methods: {
    ...mapActions("optionsList", {
      getAllOptionsList: "getAll",
    }),
    ...mapActions("header", {
      changeHeaderTab: "changeTab",
    }),
    updateCant(cant) {
      this.keywordscant = cant;
    },
    openSalesRep(open) {
      this.currentSalesRepWrapper = open;
    },
    addTarget() {
      this.$refs.targetForm.validate();
      this.$refs.employeesForm.validate();
      // custom validation
      if (
        this.$refs.targetForm.errors.length > 0 ||
        this.$refs.employeesForm.errors.length > 0 ||
        ((this.currentTarget.data.employees === undefined ||
          this.currentTarget.data.employees.keywords === undefined ||
          this.currentTarget.data.employees.keywords.greater === undefined) &&
          (this.currentTarget.data.employees === undefined ||
            this.currentTarget.data.employees.keywords === undefined ||
            this.currentTarget.data.employees.keywords.less === undefined) &&
          (this.currentTarget.data.categories_industry === undefined ||
            this.currentTarget.data.categories_industry.length == 0) &&
          (this.currentTarget.data.region === undefined ||
            this.currentTarget.data.region.length == 0) &&
          (this.currentTarget.data.categories_level === undefined ||
            this.currentTarget.data.categories_level.length == 0) &&
          (this.currentTarget.data.categories_function === undefined ||
            this.currentTarget.data.categories_function.length == 0) &&
          (this.currentTarget.data.countries === undefined ||
            this.currentTarget.data.countries.length == 0))
      ) {
        return;
      }
      this.addItem(
        "model.targets",
        "currentTarget",
        "name",
        "targetForm,employeesForm"
      );
    },
    setAgency() {
      if (!this.agencyFormValidate) {
        this.$swal({
          type: "warning",
          title: this.$t("lang.label.missingdata"),
          showCancelButton: false,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33a2c",
          confirmButtonText: this.$t("lang.button.ok"),
        });
        this.setAgencyKey++;
        return;
      }

      this.loading = true;
      clientsService
        .setAgency(this.model)
        .then((response) => {
          this.selectedClientId = response;
          this.getAgency();
          this.$swal({
            type: "warning",
            title: this.$t("lang.label.datasavedsuccessfully"),
            showCancelButton: false,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33a2c",
            confirmButtonText: this.$t("lang.button.ok"),
          });
          this.loading = false;
          this.goBack();
        })
        .catch((err) => {
          this.$swal({
            type: "error",
            title: this.$t("lang.label.error"),
            showCancelButton: false,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33a2c",
            confirmButtonText: this.$t("lang.button.ok"),
          });
          this.setAgencyKey++;
          this.loading = false;
        });
    },
    getAgency() {
      this.model = this.model_empty;
      this.model_init = this.model;

      if (this.selectedClientId !== undefined) {
        this.loading = true;
        if (this.selectedClientId != undefined) {
          clientsService.getAgency(this.selectedClientId).then((response) => {
            this.model = response;

            if (
              this.model.targets !== undefined &&
              this.model.targets !== null
            ) {
              this.model.targets.forEach((target) => {
                // convert empty array into object
                if (Array.isArray(target.data.employees)) {
                  target.data.employees = {};
                }
                if (
                  target.data.categories_jobs === undefined ||
                  Array.isArray(target.data.categories_jobs)
                ) {
                  target.data.categories_jobs = {};
                }
              });
            }
            if (
              this.model.client.pitch !== undefined &&
              this.model.client.pitch !== null
            ) {
              this.editorPitch = this.model.client.pitch;
            }
            if (
              this.model.client.extra_info !== undefined &&
              this.model.client.extra_info !== null
            ) {
              this.editorExtraInfo = this.model.client.extra_info;
            }
            if (
              this.model.client.signed_on !== undefined &&
              this.model.client.signed_on !== null
            ) {
              this.model.client.signed_on = this.model.client.signed_on
                .replace(" ", "T")
                .substring(0, 16);
            }
            this.model_init = JSON.parse(JSON.stringify(this.model));
            this.loading = false;
          });
        }
      }
    },
    goBack() {
      if (this.currentUser.role_id == 1) {
        this.changeHeaderTab({ tab: "ALL" });
      } else {
        this.$router.push("/contract");
      }
    },
  },
  watch: {
    editorPitch: function () {
      this.model.client.pitch = this.$sanitize(this.editorPitch);
    },
    editorExtraInfo: function () {
      this.model.client.extra_info = this.$sanitize(this.editorExtraInfo);
    },
  },
};
</script>
<style >
.display-inline label,
.display-inline .field-wrap {
  width: 50%;
  float: left;
}

.display-inline label {
  text-align: right;
  padding-right: 10px;
  min-height: 50px;
}

.display-inline .errors,
.display-inline .hint {
  width: 50%;
  float: right;
  padding-left: 2px;
}
</style>