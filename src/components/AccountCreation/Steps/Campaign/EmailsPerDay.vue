<template>
  <div>
    <LoadingSpinner v-if="loading" />
    <section class="second-step-company" v-else>
      <div class="pl-4 pr-1 pt-3">
        <Tutorial
          id="teemplatemessage"
          :linkText="$t('lang.label.howitworks')"
          linkClass="small ml-2 mt-2"
          videoUrl="https://www.youtube.com/embed/oXm2B-5ubz0"
        />
        <div class="row w-100">
          <div class="col-md-6">
            <div class="card p-3 cursor-pointer my-3">
              <div class="row">
                <div class="col-md-12 mb-3">
                  <h5 class="font-dark-blue mt-3">
                    {{
                      $t(
                        "lang.label.howmanynewcontactswouldyouliketohireperday"
                      )
                    }}
                  </h5>
                </div>
              </div>
              <div>
                <div class="">
                  <vue-form-generator
                    ref="budgetForm"
                    :schema="schemaBudget"
                    :model="this.model"
                    :options="formOptions"
                    @model-updated="hasModified"
                  >
                  </vue-form-generator>
                </div>
              </div>
            </div>

            <div class="card p-3 cursor-pointer my-3">
              <div class="row">
                <div class="col-md-12 mb-3" v-if="!loadingIntegrations">
                  <h5 class="font-dark-blue mt-3">
                    {{ $t("lang.campaign_parameters.integrationsoptional") }}
                  </h5>
                  <div v-if="!crmConfig">
                    <div v-if="currentUser.id == model.campaign.user_id">
                      <router-link
                        class="btn-primary btn-sm px-3 py-2 mr-4 ml-2 badge"
                        to="/settings-account?integrations=1"
                        ><i class="icon icon-link"></i>
                        {{
                          $t("lang.campaign_parameters.connecttoyourcrm")
                        }}</router-link
                      >
                    </div>
                    <div v-else>
                      {{ $t("lang.campaign_parameters.ownermustconnectcrm") }}
                    </div>
                  </div>
                  <div v-else>
                    <p>
                      <b>{{ crmConfig.name }}:</b>
                      {{ $t("lang.integrations.selectapipeline") }}
                    </p>
                    <div class="mt-2">
                      <vue-form-generator
                        ref="integrationCrmForm"
                        :schema="schemaIntegrationCRM"
                        :model="integration_crm_model"
                        :options="formOptions"
                        @model-updated="hasModified"
                      ></vue-form-generator>
                    </div>
                    <div
                      class="mt-2"
                      v-if="integration_crm_model.integration_crm"
                    >
                      <vue-form-generator
                        ref="crmPipelineForm"
                        :schema="schemaCrmPipeline"
                        :model="model"
                        :options="formOptions"
                        @model-updated="hasModified"
                      ></vue-form-generator>
                    </div>
                  </div>
                </div>
                <div class="col-md-12">
                  <div class=""></div>
                </div>
                <div class="col-md-12 mb-3">
                  <h5 class="font-dark-blue mt-3">
                    {{ $t("lang.campaign_parameters.bcclist") }}
                  </h5>
                  <small>{{
                    $t("lang.campaign_parameters.bcclistinfo")
                  }}</small>
                </div>
                <div class="col-md-12">
                  <div class="">
                    <multiselect
                      v-model="bcc_list"
                      v-bind:tag-placeholder="$t('lang.search.add')"
                      v-bind:placeholder="
                        $t('lang.search.addoneorseveralwords')
                      "
                      label="bcc_email"
                      track-by="id"
                      :options="bcc_list"
                      :multiple="true"
                      :taggable="true"
                      :searchable="true"
                      :showLabels="true"
                      :disabled="['1'].includes(this.currentUser.plan_id)"
                      openDirection="below"
                      class="small"
                      @remove="removeTag($event, bcc_list)"
                      @tag="addTag($event, bcc_list)"
                    >
                      <template slot="tag" slot-scope="props">
                        <span class="mr-1 p-1 text-white rounded bg-primary">
                          <span v-text="props.option.bcc_email"></span>
                          <i
                            @click="removeTag(props.option, bcc_list)"
                            class="icon-close pl-1 cursor-pointer"
                          ></i>
                        </span>
                      </template>
                    </multiselect>
                    <div
                      v-if="['2,3'].includes(this.currentUser.plan_id)"
                      class="mt-2"
                    >
                      <small>{{
                        $t("lang.label.upgradetounlockthisfeature")
                      }}</small>
                      <router-link
                        class="btn-primary btn-sm px-3 py-2 mr-4 ml-2 badge"
                        to="/upgrade"
                      >
                        <i class="icon icon-rocket"></i>
                        {{ $t("lang.button.upgrade") }}
                      </router-link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="card p-3 cursor-pointer my-3">
              <div class="row">
                <div class="col-md-12">
                  <vue-form-generator
                    ref="parametersForm"
                    :schema="schemaParameters"
                    :model="model"
                    :options="formOptions"
                    @model-updated="hasModified"
                  ></vue-form-generator>
                </div>
              </div>
            </div>

            <div class="card p-3 cursor-pointer my-3">
              <div class="row">
                <div class="col-md-12 mb-3">
                  <h5 class="font-dark-blue mt-3">
                    {{ $t("lang.campaign_parameters.timezone") }}
                  </h5>
                  <small>{{
                    $t("lang.campaign_parameters.timezoneinfo")
                  }}</small>
                </div>
                <div class="col-md-12">
                  <div
                    class="display-inline"
                    :class="timezoneErrors ? 'input-error' : ''"
                  >
                    <select v-model="defaulOption" class="form-control">
                      <option value="false" v-if="!defaulOption" selected>
                        {{ $t("lang.label.choose") }}
                      </option>
                      <option
                        v-for="(lang, i) in timezones"
                        :key="`Lang${i}`"
                        :value="lang.id"
                      >
                        {{ lang.label }}
                      </option>
                    </select>
                  </div>
                  <div class="form-group error featured required field-input">
                    <div v-if="timezoneErrors" class="errors help-block">
                      <span>{{ $t("lang.label.required") }}</span>
                    </div>
                  </div>
                </div>

                <div class="col-md-12">
                  <vue-form-generator
                    ref="timezonesForm"
                    :schema="schemaTimezones"
                    :model="timezone_model"
                    :options="formOptions"
                    @model-updated="hasModified"
                  ></vue-form-generator>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="card p-3 cursor-pointer my-3">
              <div class="row">
                <div class="col-md-12 mb-3">
                  <h5 class="font-dark-blue mt-3">
                    {{ $t("lang.label.sendingdays") }}
                  </h5>
                  <small>{{
                    $t("lang.campaign_parameters.sendemailsdayspending")
                  }}</small>
                </div>
              </div>
              <div class="row">
                <div class="col-md-12">
                  <div
                    class="display-inline"
                    :class="sendingDaysErrors ? 'input-error' : ''"
                  >
                    <treeselect
                      ref="sendingDaysForm"
                      v-model="param_4"
                      class="mb-2"
                      :multiple="true"
                      :required="true"
                      placeholder="Sélectionnez..."
                      :maxHeight="200"
                      :searchable="false"
                      :append-to-body="true"
                      :openDirection="'bottom'"
                      :options="sendingDaysI8N"
                    >
                    </treeselect>
                    <div class="form-group error featured required field-input">
                      <div v-if="sendingDaysErrors" class="errors help-block">
                        <span>{{ $t("lang.label.required") }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="card p-3 cursor-pointer my-3">
              <div class="row">
                <div class="col-md-12 mb-3">
                  <h5 class="font-dark-blue mt-3">
                    {{ $t("lang.campaign_parameters.disable-notifications") }}
                  </h5>
                </div>
              </div>
              <div class="row">
                <div class="col-md-12">
                  <div class="display-inline">
                    <treeselect
                      ref="disableNotificationsForm"
                      v-model="param_17"
                      class="mb-2"
                      :multiple="true"
                      :required="true"
                      placeholder="Sélectionnez..."
                      :maxHeight="200"
                      :searchable="false"
                      :append-to-body="true"
                      :openDirection="'bottom'"
                      :options="disableNotificationsI8N"
                    >
                    </treeselect>
                  </div>
                </div>
              </div>
            </div>

            <div class="card p-3 cursor-pointer my-3">
              <div class="row">
                <div class="col-md-12 mb-3">
                  <div class="ckeckbox-left">
                    <vue-form-generator
                      ref="negativeAnswersTreatmentForm"
                      :schema="schemaNegativeAnswersTreatment"
                      :model="negativeanswerstreatment_model"
                      :options="formOptions"
                      @model-updated="hasModified"
                    ></vue-form-generator>
                  </div>
                </div>
              </div>
              <div
                class="row"
                v-if="negativeanswerstreatment_model.negativeanswerstreatment"
              >
                <div class="col-md-12">
                  <div class="field-ckeditor-wrappar">
                    <ValidationProvider
                      ref="editorNegativeAnswerV"
                      :rules="{ required: true }"
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
                          <label> {{ $t("lang.label.message") }}</label>

                          <ckeditor
                            :editor="editorInitial"
                            v-model="editorNegativeAnswer"
                            :config="editorConfig"
                            @input="hasModified"
                          ></ckeditor>

                          <div class="errors help-block">
                            <span>{{ errors[0] }}</span>
                          </div>
                        </div>
                      </div>
                    </ValidationProvider>
                  </div>

                  <vue-form-generator
                    ref="autoFollowUpForm"
                    :schema="schemaAutoFollowUp"
                    :model="negativeanswerstreatment_model"
                    :options="formOptions"
                    @model-updated="hasModified"
                  ></vue-form-generator>
                  <div
                    class="d-flex"
                    v-if="negativeanswerstreatment_model.autofollowup"
                  >
                    <span class="pt-2"> {{ $t("lang.label.after") }}</span>
                    <span class="ml-2 mr-2">
                      <vue-form-generator
                        ref="recallDaysForm"
                        :schema="schemaRecallDays"
                        :model="model"
                        :options="formOptions"
                        @model-updated="hasModified"
                      ></vue-form-generator>
                    </span>
                    <span class="pt-2"> {{ $t("lang.label.days") }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="card p-3 cursor-pointer my-3">
              <div class="row">
                <div class="col-md-12 mb-3">
                  <div class="ckeckbox-left">
                    <vue-form-generator
                      ref="absentMeetingTreatmentForm"
                      :schema="schemaAbsentMeetingTreatment"
                      :model="absentmeetingtreatment_model"
                      :options="formOptions"
                      @model-updated="hasModified"
                    ></vue-form-generator>
                  </div>
                </div>
              </div>
              <div
                class="row"
                v-if="absentmeetingtreatment_model.absentmeetingtreatment"
              >
                <div class="col-md-12">
                  <div class="field-ckeditor-wrappar">
                    <ValidationProvider
                      ref="editorAbsentMeetingV"
                      :rules="{ required: true }"
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
                          <label> {{ $t("lang.label.message") }}</label>

                          <ckeditor
                            :editor="editorInitial"
                            v-model="editorAbsentMeeting"
                            :config="editorConfig"
                            @input="hasModified"
                          ></ckeditor>

                          <div class="errors help-block">
                            <span>{{ errors[0] }}</span>
                          </div>
                        </div>
                      </div>
                    </ValidationProvider>
                  </div>

                  <vue-form-generator
                    ref="autoFollowUpForm"
                    :schema="schemaAbsentMeetingAutoFollowUp"
                    :model="absentmeetingtreatment_model"
                    :options="formOptions"
                    @model-updated="hasModified"
                  ></vue-form-generator>
                  <div
                    class="d-flex"
                    v-if="absentmeetingtreatment_model.autofollowup"
                  >
                    <span class="pt-2"> {{ $t("lang.label.after") }}</span>
                    <span class="ml-2 mr-2">
                      <vue-form-generator
                        ref="absentMeetingRecallDaysForm"
                        :schema="schemaAbsentMeetingRecallDays"
                        :model="model"
                        :options="formOptions"
                        @model-updated="hasModified"
                      ></vue-form-generator>
                    </span>
                    <span class="pt-2"> {{ $t("lang.label.days") }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-md-12">
              <button
                :disabled="
                  this.model.campaign.emails_per_day > this.model.sendlimit
                "
                class="btn px-5 py-2 supersave btn-success btn-sm text-center"
                @click="goToStepCampaign(true, 'here')"
              >
                {{ $t("lang.button.save") }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
import Vue from "vue";

import VueFormGenerator from "vue-form-generator";
import "vue-form-generator/dist/vfg.css";

import Multiselect from "vue-multiselect";
Vue.component("multiselect", Multiselect);

import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

import LoadingSpinner from "@/components/LoadingSpinner.vue";
import { mapState, mapActions } from "vuex";
import { crmService } from "@/_services";
import { billingUtilsMixin, campaignUtilsMixin } from "@/_mixins/";
import Tutorial from "@/components/Tutorial.vue";

import CKEditor from "@ckeditor/ckeditor5-vue";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

import { ASYNC_SEARCH } from "@riophae/vue-treeselect";
const simulateAsyncOperation = (fn) => {
  setTimeout(fn, 20);
};

export default {
  props: {
    model: Object,
    model_init: Object,
    activeStep: Number,
  },
  mixins: [billingUtilsMixin, campaignUtilsMixin],
  data() {
    var self = this;
    return {
      bcc_list: [],
      loadingIntegrations: true,
      loadingStages: true,
      crmConfig: false,
      timezonsearch: 222222,
      sendingDaysForm: 1,
      validator: Object,
      loading: false,
      hasPaymentcc: true,
      modified: false,
      dailyBudgetsDefaultFree: 5,
      dailyBudgetsPredefines: [15, 22, 42],
      quantityRole: [],
      messageplan: "",
      priceRole: [],
      tarifMoyen: 0,
      timezone_model: {
        auto_timezone: self.isParameterTF("14"),
      },
      integration_crm_model: {
        integration_crm: self.isParameterTF("15"),
        crm_create_tasks: self.isParameterTF("16"),
      },
      param_4: this.model.param_4, // sending-days
      param_17: this.model.param_17, // disable-notifications
      negativeanswerstreatment_model: {
        negativeanswerstreatment: self.isParameterTF("18"),
        autofollowup: self.isParameterTF("19"),
        recallDays: 0,
      },
      absentmeetingtreatment_model: {
        absentmeetingtreatment: self.isParameterTF("20"),
        autofollowup: self.isParameterTF("21"),
        absent_meeting_subject: self.model.absent_meeting_subject,
        recallDays: 0,
      },
      timezone_id: this.model.campaign.timezone_id,
      sendingDaysI8N: [],
      disableNotificationsI8N: [],
      schemaBudget: {
        fields: [
          {
            type: "input",
            inputType: "number",
            label: this.$t("lang.column.budgetday"),
            model: "campaign.emails_per_day",
            readonly: false,
            featured: true,
            required: true,
            disabled: false,
            min: 0,
            max: 100,
            validator: ["numberBetweenValidator"],
          },
        ],
      },
      defaulOption: false,
      formOptions: {
        validateAfterLoad: false,
        validateAfterChanged: true,
      },
      schemaParameters: {
        fields: [
          {
            type: "checklist",
            label: this.$t("lang.label.parameters"),
            model: "parameters_tf",
            listBox: true,
            featured: true,
            checklistOptions: {
              value: "id",
              name: "name",
            },
            values: [],
          },
        ],
      },
      schemaTimezones: {
        fields: [
          {
            type: "checkbox",
            label: this.$t("lang.campaign_parameters.auto-timezone"),
            model: "auto_timezone",
            listBox: true,
            featured: false,
            checklistOptions: {
              value: "id",
              name: "name",
            },
          },
        ],
      },
      schemaIntegrationCRM: {
        fields: [
          {
            type: "checkbox",
            label: this.$t("lang.campaign_parameters.integration-crm"),
            model: "integration_crm",
            listBox: true,
            featured: false,
            checklistOptions: {
              value: "id",
              name: "name",
            },
          },
          {
            type: "checkbox",
            label: this.$t("lang.campaign_parameters.crm-create-tasks"),
            model: "crm_create_tasks",
            listBox: true,
            featured: false,
            visible(model) {
              return model.integration_crm == 1;
            },
            checklistOptions: {
              value: "id",
              name: "name",
            },
            styleClasses: "checkbox-child",
          },
        ],
      },
      schemaCrmPipeline: {
        fields: [
          {
            type: "select",
            label: "Pipeline",
            model: "campaign.crm_pipeline_id",
            readonly: false,
            featured: true,
            validator: VueFormGenerator.validators.required,
            selectOptions: {},
            values: [],
            required: true,
          },
          {
            type: "select",
            label: "Stage",
            model: "campaign.crm_stage_id",
            readonly: false,
            featured: true,
            disabled(model) {
              return self.loadingStages;
            },
            validator: VueFormGenerator.validators.required,
            selectOptions: {},
            values: [],
            required: true,
          },
        ],
      },
      schemaNegativeAnswersTreatment: {
        fields: [
          {
            type: "checkbox",
            label: this.$t(
              "lang.campaign_parameters.negative-answers-treatment"
            ),
            model: "negativeanswerstreatment",
            listBox: true,
            featured: false,
            checklistOptions: {
              value: "id",
              name: "name",
            },
            styleClasses: "h5-el font-dark-blue",
          },
        ],
      },
      schemaAutoFollowUp: {
        fields: [
          {
            type: "checkbox",
            label: this.$t("lang.campaign_parameters.auto-follow-up"),
            model: "autofollowup",
            listBox: true,
            featured: false,
            checklistOptions: {
              value: "id",
              name: "name",
            },
          },
        ],
      },
      schemaRecallDays: {
        fields: [
          {
            type: "input",
            inputType: "number",
            model: "campaign.recall_days",
            listBox: true,
            featured: false,
            min: 1,
            max: 120,
            validator: ["numberBetweenValidator"],
          },
        ],
      },
      schemaAbsentMeetingTreatment: {
        fields: [
          {
            type: "checkbox",
            label: this.$t("lang.campaign_parameters.absent-meeting-treatment"),
            model: "absentmeetingtreatment",
            listBox: true,
            featured: false,
            checklistOptions: {
              value: "id",
              name: "name",
            },
            styleClasses: "h5-el font-dark-blue",
          },
          {
            type: "input",
            inputType: "text",
            label: this.$t("lang.label.subject"),
            model: "absent_meeting_subject",
            featured: true,
            max: 5,
            required: true,
            visible(value, field, model) {
              return self.absentmeetingtreatment_model.absentmeetingtreatment == 1;
            },
            validator: ["required"],
          },
        ],
      },
      schemaAbsentMeetingAutoFollowUp: {
        fields: [
          {
            type: "checkbox",
            label: this.$t(
              "lang.campaign_parameters.absent-meeting-auto-follow-up"
            ),
            model: "autofollowup",
            listBox: true,
            featured: false,
            checklistOptions: {
              value: "id",
              name: "name",
            },
          },
        ],
      },
      schemaAbsentMeetingRecallDays: {
        fields: [
          {
            type: "input",
            inputType: "number",
            model: "campaign.absent_meeting_recall_days",
            listBox: true,
            featured: false,
            min: 1,
            max: 120,
            validator: ["numberBetweenValidator"],
          },
        ],
      },
      editorInitial: ClassicEditor,
      editorNegativeAnswer: "",
      editorAbsentMeeting: "",
      editorConfig: {
        toolbar: ["heading", "|", "bold", "italic", "|", "link"],
      },
    };
  },

  created() {
    this.getCrmConfig();
    if (
      this.model.campaign.bcc_list != undefined &&
      this.model.campaign.bcc_list !== ""
    ) {
      var values = this.model.campaign.bcc_list.split(",");
      for (var i = 0; i < values.length; i++) {
        this.bcc_list.push({ ["bcc_email"]: values[i] });
      }
    }
    if (this.model.param_4 == undefined || this.model.param_4.length == 0) {
      this.model.param_4 = ["1", "2", "3", "4", "5"];
      this.param_4 = ["1", "2", "3", "4", "5"];
      this.sendingDaysForm = 2;
    }

    if (this.model.campaign.emails_per_day > this.model.sendlimit) {
      this.model.campaign.emails_per_day = this.model.sendlimit;
    }

    if (
      this.model.campaign.timezone_id !== undefined &&
      this.model.campaign.timezone_id !== null
    ) {
      let opt;
      opt = this.timezones.filter(
        (option) => option.id == this.model.campaign.timezone_id
      );
      this.defaulOption = opt[0].id;
    }

    if (this.model.campaign.negative_answer !== undefined) {
      this.editorNegativeAnswer = this.model.campaign.negative_answer;
    }
    if (this.model.campaign.absent_meeting !== undefined) {
      this.editorAbsentMeeting = this.model.campaign.absent_meeting;
    }
    if (this.model.campaign.absent_meeting_subject !== undefined) {
      this.absentmeetingtreatment_model.absent_meeting_subject =
        this.model.campaign.absent_meeting_subject;
    }
    this.messageplan =
      "Max: " +
      this.model.sendlimit +
      " " +
      this.$t("lang.label.perdayinyourcampaign");
    /*this.validator = VueFormGenerator.validators;
    this.validator.resources.numberTooBig = this.messageplan;*/

    this.currentUser.role_id == "2"
      ? this.hasPaymentDefault()
      : (this.hasPaymentcc = true);
  },
  components: {
    LoadingSpinner,
    treeselect: Treeselect,
    Tutorial,
    Multiselect,
    ckeditor: CKEditor.component,
  },

  mounted() {
    this.loadOptions();
  },

  watch: {
    loadingOptionsList: function () {
      this.loadOptions();
    },
    param_4: function () {
      this.hasModified();
    },
    param_14: function () {
      this.hasModified();
    },
    param_17: function () {
      this.hasModified();
    },
    defaulOption: function () {
      this.hasModified();
    },
    "timezone_model.auto_timezone": function (value) {
      this.setParameterTF("14", value);
    },
    "integration_crm_model.integration_crm": function (value) {
      this.setParameterTF("15", value);
    },
    "integration_crm_model.crm_create_tasks": function (value) {
      this.setParameterTF("16", value);
    },
    "integration_crm_model.crm_create_tasks": function (value) {
      this.setParameterTF("17", value);
    },
    "negativeanswerstreatment_model.negativeanswerstreatment": function (
      value
    ) {
      this.setParameterTF("18", value);
      let defaultMessage =
        "<p>Bonjour,</p><p></p><p>Merci d’avoir pris le temps de me faire un retour. C'est bien noté ! </p><p></p><p>Bonne journée et bonne continuation,</p>";

      if (
        value &&
        (this.editorNegativeAnswer === null ||
          this.editorNegativeAnswer === undefined ||
          this.editorNegativeAnswer === "")
      ) {
        this.editorNegativeAnswer = defaultMessage;
      } else if (!value && this.editorNegativeAnswer === defaultMessage) {
        if (this.model_init.campaign.negative_answer === defaultMessage) {
          this.editorNegativeAnswer = "";
        } else {
          this.editorNegativeAnswer = this.model_init.campaign.negative_answer;
        }
      }
    },
    "negativeanswerstreatment_model.autofollowup": function (value) {
      this.setParameterTF("19", value);
      if (
        value &&
        (isNaN(this.model.campaign.recall_days) ||
          this.model.campaign.recall_days <= 0)
      ) {
        this.model.campaign.recall_days = 90;
      } else if (!value) {
        this.model.campaign.recall_days = this.model_init.campaign.recall_days;
      }
    },
    "absentmeetingtreatment_model.absentmeetingtreatment": function (value) {
      this.setParameterTF("20", value);
      let defaultMessage =
        "<p>Bonjour,</p><p></p><p>Merci d’avoir pris le temps de me faire un retour. C'est bien noté ! </p><p></p><p>Bonne journée et bonne continuation,</p>";

      if (
        value &&
        (this.editorAbsentMeeting === null ||
          this.editorAbsentMeeting === undefined ||
          this.editorAbsentMeeting === "")
      ) {
        this.editorNegativeAnswer = defaultMessage;
      } else if (!value && this.editorAbsentMeeting === defaultMessage) {
        if (this.model_init.campaign.negative_answer === defaultMessage) {
          this.editorAbsentMeeting = "";
        } else {
          this.editorAbsentMeeting = this.model_init.campaign.absent_meeting;
        }
      }
    },
    "absentmeetingtreatment_model.absent_meeting_subject": function (value) {
      this.model.campaign.absent_meeting_subject =
        this.absentmeetingtreatment_model.absent_meeting_subject;
    },
    "absentmeetingtreatment_model.autofollowup": function (value) {
      this.setParameterTF("21", value);
      if (
        value &&
        (isNaN(this.model.campaign.absent_meeting_recall_days) ||
          this.model.campaign.absent_meeting_recall_days <= 0)
      ) {
        this.model.campaign.absent_meeting_recall_days = 90;
      } else if (!value) {
        this.model.campaign.absent_meeting_recall_days =
          this.model_init.campaign.absent_meeting_recall_days;
      }
    },
    editorNegativeAnswer: function () {
      this.model.campaign.negative_answer = this.editorNegativeAnswer;
    },
    editorAbsentMeeting: function () {
      this.model.campaign.absent_meeting = this.editorAbsentMeeting;
    },
  },

  computed: {
    user() {
      return this.$store.state.authentication.user;
    },
    ...mapActions("plans", {
      refreshPlanInfo: "getAll",
    }),
    ...mapState({
      plans: (state) => state.plans.all,
      currentUser: (state) => state.authentication.user,
      loadingOptionsList: (state) => !state.optionsList.completeLoading,
      sendingDays: (state) => state.optionsList.all["param_4"].data,
      disableNotifications: (state) => state.optionsList.all["param_17"].data,
      parametersTF: (state) => state.optionsList.all["parameters_tf"].data,
      timezones: (state) => state.optionsList.all["timezones"].data,
    }),
    sendingDaysErrors() {
      return this.param_4.length == 0;
    },
    timezoneErrors() {
      return !this.defaulOption;
    },
  },

  methods: {
    async loadOptions() {
      if (!this.loadingOptionsList) {
        this.sendingDays.forEach((element) => {
          if (element.is_translated === undefined) {
            element.label = this.$t("lang.sending_days." + element.label);
            element.is_translated = true;
          }
        });

        this.sendingDaysI8N = this.sendingDays;

        this.disableNotifications.forEach((element) => {
          if (element.is_translated === undefined) {
            element.label = this.$t(
              "lang.notification." + element.label + "_title"
            );
            element.is_translated = true;
          }
        });

        this.disableNotificationsI8N = this.disableNotifications;

        // load parametersTF
        let field = this.schemaParameters.fields.find(
          (field) => field.model === "parameters_tf"
        );
        this.parametersTF.forEach((element) => {
          if (element.is_translated === undefined) {
            element.name = this.$t("lang.campaign_parameters." + element.name);
            element.is_translated = true;
          }
        });
        field.values = this.parametersTF;
      }
    },
    isPending() {
      return this.model.campaign_status_id == 1;
    },
    getLimit() {
      return "10";
    },
    goToStepCampaign(save, where) {
      if (this.defaulOption) {
        this.model.campaign.timezone_id = this.defaulOption;
      }
      // console.log('save paso 5')
      if (save && save != "back" && this.modified) {
        this.$refs.budgetForm.validate();
        if (this.$refs.editorNegativeAnswerV !== undefined) {
          this.$refs.editorNegativeAnswerV.validate();
        }
        if (this.$refs.recallDaysForm !== undefined) {
          this.$refs.recallDaysForm.validate();
        }

        if (this.$refs.editorAbsentMeetingV !== undefined) {
          this.$refs.editorAbsentMeetingV.validate();
        }
        if (this.$refs.absentMeetingRecallDaysForm !== undefined) {
          this.$refs.absentMeetingRecallDaysForm.validate();
        }

        this.modified = false;
        this.model.param_4 = this.param_4;
        this.model.param_17 = this.param_17;
        if (where === "here") {
          this.$emit("goToStepCampaign", save);
        }
        return true;
      } else {
        if (this.modified) {
          this.$swal({
            type: "warning",
            title: this.$t("lang.label.areyousure"),
            text: this.$t("lang.label.leavewithoutsaving"),
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33a2c",
            confirmButtonText: this.$t("lang.button.yes"),
          }).then((result) => {
            if (result.value) {
              this.$forceUpdate();
              this.$emit("goToStepCampaign", save);
            }
          });
        } else {
          this.$emit("goToStepCampaign", save);
        }
      }
    },
    hasModified() {
      this.modified = true;
      this.model.param_4 = this.param_4;
      this.model.param_17 = this.param_17;
      this.model.campaign.timezone_id = this.defaulOption;
    },
    trialPeriod() {
      return (
        this.currentUser.role_id == "2" &&
        this.currentUser.subscription_status_id == 0 &&
        this.$store.state.authentication.toastNotificationData
          .dontChargePayments != 1
      );
    },
    hasPaymentDefault() {
      this.hasPaymentcc = this.hasPaymentMethodCC();
    },
    getQuantities(role) {
      var total = 0;
      if (this.model.contacts !== undefined) {
        if (role == "mycontacts" && this.model.contacts[99999] !== undefined) {
          return this.model.contacts[99999];
        }

        if (role == "dgeneral" && this.model.contacts[12012] !== undefined)
          return this.model.contacts[12012];

        if (role == "direction") {
          if (this.model.contacts[38] !== undefined)
            total += parseInt(this.model.contacts[38]);
          if (this.model.contacts[39] !== undefined)
            total += parseInt(this.model.contacts[39]);
          if (this.model.contacts[40] !== undefined)
            total += parseInt(this.model.contacts[40]);
          if (this.model.contacts[41] !== undefined)
            total += parseInt(this.model.contacts[41]);
          return total;
        }

        if (role == "contact" && this.model.contacts[12013] !== undefined)
          return this.model.contacts[12013];

        if (role == "autres") {
          if (this.model.contacts[43] !== undefined)
            total += parseInt(this.model.contacts[43]);
          if (this.model.contacts[42] !== undefined)
            total += parseInt(this.model.contacts[42]);
          return total;
        }
      }
      return 0;
    },
    getTarifMoyen() {
      var total = parseInt(0);
      total = total + parseFloat(this.priceRole["direction"]);
      total = total + parseFloat(this.priceRole["dgeneral"]);
      total = total + parseFloat(this.priceRole["autres"]);
      total = total + parseFloat(this.priceRole["contact"]);
      var total2 = (total / parseInt(this.model.totalcontacts)).toFixed(2);
      if (isNaN(total2)) return 0;
      return total2;
    },

    getPrice(role) {
      if (this.model.contacts !== undefined) {
        var total = parseInt(0);

        if (role == "dgeneral" && this.model.contacts[12012] !== undefined)
          return (
            parseInt(this.model.contacts[12012]) * parseFloat(0.5)
          ).toFixed(2);

        if (role == "direction") {
          if (this.model.contacts[38] !== undefined)
            total += parseInt(this.model.contacts[38]);
          if (this.model.contacts[39] !== undefined)
            total += parseInt(this.model.contacts[39]);
          if (this.model.contacts[40] !== undefined)
            total += parseInt(this.model.contacts[40]);
          if (this.model.contacts[41] !== undefined)
            total += parseInt(this.model.contacts[41]);
          return (total * 0.4).toFixed(2);
        }

        if (role == "contact" && this.model.contacts[12013] !== undefined)
          return (
            parseInt(this.model.contacts[12013]) * parseFloat(0.05)
          ).toFixed(2);

        if (role == "autres") {
          if (this.model.contacts[43] !== undefined)
            total += parseInt(this.model.contacts[43]);
          if (this.model.contacts[42] !== undefined)
            total += parseInt(this.model.contacts[42]);
          return (total * parseFloat(0.2)).toFixed(2);
        }
      }
      return 0;
    },
    addTag(newTag, tagsany) {
      newTag = this.$sanitize(newTag);
      let field = { label: "BCC" };
      let emailError = VueFormGenerator.validators.emailValidator(
        newTag,
        field
      );

      if (emailError.length > 0) {
        this.$swal({
          type: "error",
          text: emailError[0],
          showCancelButton: false,
          confirmButtonColor: "#3085d6",
          confirmButtonText: this.$t("lang.button.ok"),
          cancelButtonColor: "#d33a2c",
        });
        return false;
      }

      const tag = {
        bcc_email: newTag,
      };

      tagsany.push(tag);

      if (tagsany != undefined && tagsany.length > 0) {
        tagsany = tagsany.filter((t) => t.bcc_email != tag.bcc_email);
        this.bcc_list = tagsany;
      }
      this.bcc_list.push(tag);
      this.model.campaign.bcc_list = this.getBccList(this.bcc_list);
      this.hasModified();
    },

    removeTag(tag, tagsany) {
      if (tagsany != undefined && tagsany.length > 0) {
        tagsany = tagsany.filter((t) => t.bcc_email != tag.bcc_email);
        this.bcc_list = tagsany;
      }
      this.bcc_list = tagsany;
      this.model.campaign.bcc_list = this.getBccList(this.bcc_list);
      this.hasModified();
    },

    getBccList(arrayObjects) {
      return Array.prototype.map
        .call(arrayObjects, function (item) {
          return item.bcc_email;
        })
        .join(",");
    },
    getCrmConfig() {
      this.loadingIntegrations = true;
      crmService
        .getConfig(this.model.campaign.id)
        .then((result) => {
          if (result) {
            this.crmConfig = result;
            crmService.getPipelines(this.model.campaign.id).then((result) => {
              if (result) {
                let field = this.schemaCrmPipeline.fields.find(
                  (field) => field.model === "campaign.crm_pipeline_id"
                );
                field.values = result;

                if (this.model.campaign.crm_pipeline_id) {
                  this.getCrmStages(this.model.campaign.crm_pipeline_id);
                }
                this.loadingIntegrations = false;
              }
            });
          }
        })
        .then((error) => {
          this.loadingIntegrations = false;
        });
    },
    getCrmStages(pipeline_id) {
      this.loadingStages = true;

      crmService
        .getStages(this.model.campaign.id, pipeline_id)
        .then((result) => {
          if (result) {
            let field = this.schemaCrmPipeline.fields.find(
              (field) => field.model === "campaign.crm_stage_id"
            );
            field.values = result;
            this.loadingStages = false;
          }
        })
        .then((error) => {
          this.loadingStages = false;
        });
    },
  },
};
</script>
<style>
.h5-el label {
  font-size: 1.25rem;
  font-weight: 500;
}
.done {
  text-decoration: line-through;
}
ul.createaccountfreetrial.budget-options .card:hover.disabled {
  border: 1px solid rgba(0, 0, 0, 0.125);
  background-color: #e2e3e9;
}
ul.createaccountfreetrial.budget-options .card.disabled {
  background-color: #e2e3e9;
  color: #b0b0bd;
}
.olivercolor {
  color: #443cec;
}
.input-error .vue-treeselect__control {
  border: 1px solid red;
  background-color: rgba(255, 0, 0, 0.15);
}
</style>
