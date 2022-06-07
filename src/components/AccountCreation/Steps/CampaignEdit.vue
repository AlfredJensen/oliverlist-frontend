<template>
  <div id="app" class="w-100 bg-white">
    <div class="">
      <LoadingSpinner v-if="loadingsp" />
      <div class="" v-if="!loadingsp && !copy">
        <div class="progress-step campaign-edit">
          <div class="pb-2" v-if="copy"></div>
          <div v-if="activeStep != 1 || this.model.campaign.id" class="px-4 border-grey border-bottom">
            <div v-for="(tab, index) in tabs" class="mr-3 d-inline">
              <span
                :class="activeStep == tab.step ? 'active' : ''"
                type="button"
                @click="goToStepDirect(tab.step)"
                class="p-0 it-tabs pb-2"
              >
                {{ tab.title }}
                <span class="color-red" v-if="changed.includes(tab.step)">*</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <section :class="animation">
      <div class="w-100 d-block" v-if="!loadingsp && activeStep == 1">
        <div class="row w-100 pl-4 pr-0">
          <div class="col-md-12">
            <h4 v-if="copy">"{{ model.campaign.name }}" (copy)</h4>
            <div
              class="col-12"
              v-if="activeStep == 1 && !this.model.campaign.id"
            >
              <h2 v-if="activeStep == 1 && !this.model.campaign.id">
                {{ $t("lang.label.createanewcampaign") }}
              </h2>
            </div>
            <div class="col-12 card p-4 mt-4">
              <form @submit.prevent="onSubmit">
                <vue-form-generator
                  ref="campaignForm"
                  :schema="schema"
                  :model="this.model"
                  :options="formOptions"
                ></vue-form-generator>
              </form>
              <strong class="ml-3">
                {{ $t("lang.label.campaignscope") }}</strong
              >
              <div class="ml-3 form-check form-check-inline">
                <input
                  :disabled="model.campaign.id"
                  class="form-check-input"
                  type="radio"
                  id="inlineRadio1"
                  @click="deselectImport()"
                  v-model.lazy="imported"
                  value="false"
                />
                <label class="form-check-label" for="inlineRadio1">{{
                  $t("lang.label.useolivercontactdatabase")
                }}</label>
              </div>
              <div class="ml-3 form-check form-check-inline">
                <input
                  :disabled="model.campaign.id"
                  @click="selectImport()"
                  class="form-check-input"
                  type="radio"
                  v-model.lazy="imported"
                  value="true"
                  id="inlineRadio2"
                />
                <label class="form-check-label" for="inlineRadio2">{{
                  $t("lang.label.useyourimportedcontacts")
                }}</label>
              </div>

              <div class="col-md-12 ml-3 mt-3" v-if="copy">
                <div class="row">
                  <h6>{{ $t("lang.campaigns_dashboard.stepscopy") }}</h6>
                </div>
                <div class="row">
                  <input
                    v-model="copyyouraudience"
                    id="youraudience"
                    class=""
                    type="checkbox"
                  />
                  <label
                    class="ml-2 cursor-pointer form-check-label"
                    for="youraudience"
                  >
                    {{ $t("lang.label.youraudience") }}
                  </label>
                </div>
                <div class="row">
                  <input
                    v-model="copysendingparameters"
                    id="sendingparameters"
                    class=""
                    type="checkbox"
                  />
                  <label
                    class="ml-2 cursor-pointer form-check-label"
                    for="sendingparameters"
                  >
                    {{ $t("lang.label.sendingparameters") }}
                  </label>
                </div>
                <div class="row">
                  <input
                    v-model="copymessage"
                    id="message"
                    class=""
                    type="checkbox"
                  />
                  <label
                    class="ml-2 cursor-pointer form-check-label"
                    for="message"
                  >
                    {{ $t("lang.label.message") }}
                  </label>
                </div>
                <div class="row">
                  <input
                    v-model="copytracking"
                    id="tracking"
                    class=""
                    type="checkbox"
                  />
                  <label
                    class="ml-2 cursor-pointer form-check-label"
                    for="tracking"
                  >
                    {{ $t("lang.label.tracking") }}
                  </label>
                </div>

                <div class="row" v-if="copy">
                  <button
                    :disabled="loadingsp"
                    class="mt-2 btn btn-success btn-sm text-center"
                    @click="copyCampaign()"
                  >
                    {{ $t("lang.button.save") }}
                  </button>
                </div>
              </div>
            </div>
            <div
              v-if="!copy"
              class=" col-12 py-4 mb-4 d-flex justify-content-end"
            >
              <div class="row" v-if="this.model.campaign.id">
                <button
                  class="ml-2 px-5 py-2 btn btn-success btn-sm text-center"
                  @click="goToStepCampaign(true)"
                >
                  {{ $t("lang.button.save") }}
                </button>
              </div>
              <div class="row" v-else>
                <button
                  class="ml-2 btn btn-success btn-sm text-center"
                  @click="goToStepCampaign(true)"
                >
                  {{ $t("lang.label.createanewcampaign") }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="input-fields">
        <keep-alive v-for="tab in tabs" :key="tab.step">
          <component
            :is="tab.component"
            :model="model"
            :model_init="model_init"
            @goToStepCampaign="goToStepCampaign"
            :ref="'step'+tab.step"
            :activeStep="tab.step"
            :total="formSteps.length"
            v-if="activeStep == tab.step"
          />
        </keep-alive>
        
      </div>
    </section>
  </div>
</template>

<script>
import Vue from "vue";
import { formattersMixin, campaignUtilsMixin } from "@/_mixins/";
import LoadingSpinner from "@/components/LoadingSpinner.vue";

import VueFormGenerator from "vue-form-generator";
import "vue-form-generator/dist/vfg.css";

Vue.use(VueFormGenerator, {
  validators: {
    urlValidator: (value, field, model) => {
      let re =
        /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+\/$/;

      if (!re.test(value)) {
        return ["Invalid URL."];
      } else {
        return [];
      }
    },
  },
});

import Multiselect from "vue-multiselect";

// if this component is not defined here, theres an error

Vue.component("multiselect", Multiselect);
import YourAudience from "@/components/AccountCreation/Steps/Campaign/YourAudience.vue";
import YourMessage from "@/components/AccountCreation/Steps/Campaign/YourMessage.vue";
import Budget from "@/components/AccountCreation/Steps/Campaign/Budget.vue";
import Summary from "@/components/AccountCreation/Steps/Campaign/Summary.vue";
import Connection from "@/components/AccountCreation/Steps/Campaign/Connection.vue";
import Tracking from "@/components/AccountCreation/Steps/Campaign/Tracking.vue";
import EmailsPerDay from "@/components/AccountCreation/Steps/Campaign/EmailsPerDay.vue";
import Mailings from "@/components/Campaigns/Mailings.vue";
import CampaignStatistics from "@/components/Campaigns/CampaignStatistics.vue";

import { campaignsService } from "@/_services";
import { mapState, mapActions } from "vuex";

export default {
  components: {
    LoadingSpinner,
    YourAudience,
    YourMessage,
    Budget,
    Summary,
    Connection,
    Tracking,
    EmailsPerDay,
    Mailings,
    CampaignStatistics,
    "vue-form-generator": VueFormGenerator.component,
  },

  data() {
    var self = this;
    return {
      model_init: {},
      changed: [],
      loadingsp: false,
      copy: false,
      copytracking: true,
      copysendingparameters: true,
      copymessage: true,
      copyyouraudience: true,
      newIdCampaign: false,
      activeStep: 1,
      saved: 0,
      imported: false,
      animation: "animate-in",
      formSteps: [],
      consultors: [],
      classes: [],
      savedSteps: [],
      dataByStep: {
        1 : ['campaign.name', 'campaign.id'],
        5 : ['campaign.emails_per_day', 'param_4', 'param_17', 'campaign.timezone_id', 'parameters_tf.2', 'parameters_tf.3', 
        'parameters_tf.13', 'campaign.timezone_id', 'parameters_tf.14', 'parameters_tf.15', 'parameters_tf.16', 
        'campaign.crm_pipeline_id', 'campaign.crm_stage_id', 
        'parameters_tf.18', 'campaign.negative_answer','parameters_tf.19', 'campaign.recall_days',
        'parameters_tf.20', 'campaign.absent_meeting', 'campaign.absent_meeting_subject', 'parameters_tf.21', 'campaign.absent_meeting_recall_days'],
        3 : ['campaign.demo_url', 'campaign_steps', 'campaign.email_signature', 'campaign.tpl_first_step', 'campaign.logo'],
        4 : ['parameters_tf.8', 'campaign.popup_color', 'campaign.popup_message', 'campaign.popup_position'],
      },
      tabs: [
        {
          step: 1,
          ref: "step1",
          title: this.$t("lang.column.campaign"),
        },
        {
          step: 2,
           ref: "step2",
          title: this.$t("lang.label.youraudience"),
          component: "YourAudience"
        },
        {
          step: 5,
           ref: "step5",
          title: this.$t("lang.label.sendingparameters"),
          component: "EmailsPerDay"
        },
        {
          step: 3,
           ref: "step3",
          title: this.$t("lang.label.message"),
          component: "YourMessage"
        },
        {
          step: 4,
           ref: "step4",
          title: this.$t("lang.label.tracking"),
          component: "Tracking"
        },
        {
          step: 7,
           ref: "step7",
          title: this.$t("lang.label.sent"),
          component: "Mailings"
        },
        {
          step: 8,
           ref: "step8",
          title: this.$t("lang.label.statistics"),
          component: "CampaignStatistics"
        },
      ],
      schema: {
        fields: [
          {
            type: "input",
            inputType: "hidden",
            model: "campaign.id",
            readonly: true,
            featured: false,
            disabled: true,
          },
          {
            type: "input",
            inputType: "text",
            label: this.$t("lang.label.campaignname"),
            model: "campaign.name",
            featured: true,
            readonly: false,
            required: true,
            disabled: false,
            min: 5,
            max: 30,
            validator: VueFormGenerator.validators.string.locale({
              fieldIsRequired: this.$t("lang.label.required"),
              textTooSmall: this.$t("lang.validation.texttosmall", {
                min: "{1}",
              }),
            }),
            styleClasses: "col-md-12",
          },
          {
            type: "select",
            label: this.$t("lang.label.consultor"),
            model: "campaign.client_nylas_id",
            readonly: false,
            featured: true,
            required: true,
            disabled(model) {
              return model.campaign_status_id > 1;
            },
            visible(model) {
              return self.consultors.length > 1;
            },
            validator: VueFormGenerator.validators.required,
            selectOptions: {},
            values: [],
            styleClasses: "col-md-12",
          },
        ],
      },
      formOptions: {
        validateAfterLoad: false,
        validateAfterChanged: true,
      },
    };
  },

  mixins: [formattersMixin, campaignUtilsMixin],

  props: {
    selectedCampaignId: String,
    selectedCampaignName: String,
  },
  mounted() {
    this.selectedCampaignId ? undefined : this.alertRefreshPage();
    // some cast shit
    // this.model = JSON.parse(JSON.stringify(this.model));
    // clone the init model
    // console.log(this.model);
    this.model_init = JSON.parse(JSON.stringify(this.model));
    // console.log(this.model_init);
  },
  created() {
    this.loadingsp = false;

    this.getConsultors();

    if (this.$route.params.isCopy) {
      this.copy = true;
    }

    window.addEventListener("beforeunload", () => {
      return null;
    });

    this.scrollToTop();

    this.$store.state.campaigns.modified = true;

    if (this.selectedCampaignId == undefined) {
      this.$router.push({
        name: "campaignStep1",
      });
    } else {
    }

    this.loadModel();

    this.getAllOptionsList();
    this.model.imported = false;

    if (
      this.selectedCampaignId != undefined &&
      this.model.parameters_tf.indexOf("12") != -1
    ) {
      this.model.imported = true;
    }

    this.imported = this.model.imported;

    if (
      this.model.campaign.step !== null &&
      this.model.campaign.step !== undefined
    ) {
      this.savedSteps = this.model.campaign.step.split(",");
    } else {
      this.model.campaign.step = [];
    }

    /* 1 > 2 > 5 > 3 > 4 > 6 */
    this.activeStep = 1;
    this.getClass("1");
    this.getClass("2");
    this.getClass("3");
    this.getClass("4");
    this.getClass("5");
    this.getClass("6");

    this.updateHeader("campaigns");
  },

  watch: {
    loading() {
      this.loadingsp = this.loading;
    },
    model:{
      deep: true,
      handler(){
        // console.log('change-model', this.activeStep);

        let modelHasChanged = this.checkModelChange();
        // console.log({modelHasChanged});

        if(modelHasChanged){
          if(!this.changed.includes(this.activeStep)){
            this.changed.push(this.activeStep);
          }
        }else if(this.changed.includes(this.activeStep)){
          this.removeStepChanged();
        }
      }
    }
  },
  computed: {
    ...mapState({
      loading: (state) => state.campaigns.loading,
      currentUser: (state) => state.authentication.user,
      model: (state) => state.campaigns.selected.data,
      headerTab: (state) => state.header.tab,
      availableTokens: (state) =>
        state.optionsList.all["available_tokens"].data,
    }),
  },

  methods: {
    removeStepChanged(){
      const index = this.changed.indexOf(this.activeStep);
      if (index > -1) {
        this.changed.splice(index, 1);
      }
    },
    checkModelChange(){
      let modelhasChange = false;

      let items = this.dataByStep[this.activeStep];
      // console.log(items);
      if(items !== undefined){
        items.every(fields => {
          // console.log({fields});
          let field = fields.split(".");
          let value_before = this.model_init;
          let value_after = this.model;
          field.forEach(item => {
            // console.log({item});
            if(isNaN(item)){
              value_before = value_before[item];
              value_after = value_after[item];
            }else{
              value_before = value_before.includes(item);
              value_after = value_after.includes(item);
            }
          });
          // console.log({value_before})
          // console.log({value_after})
          // console.log(typeof value_before)
          // console.log(typeof value_after)
          // console.log("xxx:"+["boolean", "object"].includes(typeof value_after))

          if(isNaN(value_before) && isNaN(value_after)){
            value_before =  value_before.toString();
            value_after =  value_after.toString();
          }
          if(!isNaN(value_after) && !["boolean", "object"].includes(typeof value_after) && value_after != null  ){
            // console.log("length:", value_after.length)
            value_after =  value_after.toString();
          }
          // console.log({value_before})
          // console.log({value_after})
          value_before = JSON.stringify(value_before);
          value_after = JSON.stringify(value_after);
          // console.log({value_before})
          // console.log({value_after})
            
          if(value_before !== value_after){
            // console.log('reutn true')
            modelhasChange = true;
            return false; // break
          }
          return true; // continue
        });
      }
      return modelhasChange;
    },
    ...mapActions("campaigns", {
      getCampaignById: "getById",
      getEmptyCampaign: "getEmpty",
    }),
    ...mapActions("headertopbar", {
      setCurrentRoute: "setRoute",
      setCurrentRouteChild: "setRouteChild",
    }),
    ...mapActions("optionsList", {
      getAllOptionsList: "getAll",
    }),
    deselectImport() {
      if (this.model.parameters_tf.indexOf("12") != -1) {
        this.model.parameters_tf.pop("12");
        this.model.imported = false;
      }
    },
    selectImport() {
      if (
        this.model.parameters_tf == undefined ||
        this.model.parameters_tf.indexOf("12") == -1
      ) {
        this.model.parameters_tf.push("12");
        this.model.imported = true;
      }
    },
    scrollToTop() {
      window.scrollTo(0, 0);
    },
    updateHeader(route) {
      this.setCurrentRoute({ page: route });
      this.setCurrentRouteChild({ child: this.model.campaign.name });
    },
    alertRefreshPage() {},
    allStepSaved() {
      return (
        (this.savedSteps.indexOf(1) >= 0 ||
          this.savedSteps.indexOf("1") >= 0) &&
        (this.savedSteps.indexOf(3) >= 0 ||
          this.savedSteps.indexOf("3") >= 0) &&
        (this.savedSteps.indexOf(4) >= 0 ||
          this.savedSteps.indexOf("4") >= 0) &&
        (this.savedSteps.indexOf(5) >= 0 || this.savedSteps.indexOf("5") >= 0)
      );
    },
    getClass(step) {
      if (this.activeStep == step) {
        this.classes[step] = "btn-primary";
        return;
      }

      if (
        this.savedSteps.indexOf(step) >= 0 ||
        this.savedSteps.indexOf(step.toString()) >= 0
      ) {
        this.classes[step] = "btn-success";
        return;
      }

      if (this.allStepSaved()) {
        this.classes[6] = "btn-success";
        return;
      }

      this.classes[step] = "btn-secondary";
    },

    demoUrlDisabled(model) {
      return false;
    },

    campaignStatusDisabled(model) {
      return (
        model &&
        this.currentUser.role_id > 1 &&
        (model.campaign_status_id == 1 || model.campaign_status_id == 4)
      );
    },

    saveCampaign() {
      campaignsService.update(this.model).then((response) => {
        this.$router.push("/campaigns");
      });
    },

    goToStepDirect(active) {
      if (this.copy) return false;

      if(this.changed.includes(this.activeStep)){

        
        this.$swal({
          type: "question",
          title: this.$t("lang.label.saveallchanges"),
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          confirmButtonText: this.$t("lang.button.yes"),
          cancelButtonText: this.$t("lang.label.no"),
        }).then((result) => {
          if (result.value) {
            this.removeStepChanged();

            if(this.activeStep != 1){
              if(this.activeStep == 3){
                this.$refs['step'+this.activeStep][0].goToStepCampaignChild(true);
              }else{
                this.$refs['step'+this.activeStep][0].goToStepCampaign(true);
              }
            }
            this.goToStepCampaign(active);
           
          }else{
            this.goToStepDirectX(active);
          }
        });
      }else{
        this.goToStepDirectX(active);
      }
    },

    goToStepDirectX(active) {
        var stepant = this.activeStep;
        this.activeStep = active;
        this.getClass(active);
        this.getClass(stepant);
        let campaignId = 0;
        if (this.model.campaign.id !== undefined)
          campaignId = this.model.campaign.id;
        else campaignId = this.newIdCampaign;

        this.$router.push({
          name: "editCampaignStep" + active,
          params: { id: campaignId },
        });
    },

    copyCampaign() {
      this.model.step = [];
      if (this.copysendingparameters) {
        this.model.step.push(5);
      }
      if (this.copymessage) {
        this.model.step.push(3);
      }
      if (this.copyyouraudience) {
        this.model.step.push(2);
      }
      if (this.copytracking) {
        this.model.step.push(4);
      }
      this.model.copy = true;
      this.model.campaign_copy = this.selectedCampaignId;
      this.model.campaign.id = undefined;
      this.loadingsp = true;
      campaignsService.update(this.model).then((result) => {
        this.$router.push("/campaigns/" + result);
        this.$router.go("/campaigns/" + result);
      });
    },

    goToStepCampaign(save) {

      /* 1 > 2 > 5 > 3 > 4 > 6 */
      if (save == "back") {
        if (this.activeStep == 1) {
          this.$router.push("/campaigns");
        }

        var active = 1;
        if (this.activeStep == 2) active = 1;
        if (this.activeStep == 5) active = 2;
        if (this.activeStep == 3) active = 5;
        if (this.activeStep == 4) active = 3;
        if (this.activeStep == 6) active = 4;

        this.goToStepDirect(active);
      } else {
        var active = 1;
        if (this.activeStep == 1) active = 2;
        if (this.activeStep == 2) active = 5;
        if (this.activeStep == 5) active = 3;
        if (this.activeStep == 3) active = 4;
        if (this.activeStep == 4) active = 6;

        if (!save) {
          this.goToStepDirect(active);
        } else {
          if (this.activeStep == 1 && active == 2) {
            this.$refs.campaignForm.validate();
            if (this.$refs.campaignForm.errors.length > 0) {
              return false;
            }
          }

          if (this.activeStep == 3 && active == 4) {
            let result = this.createAllSteps();
            if (!result.status) {
              this.$swal({
                type: "warning",
                title: this.$t("lang.label.missingdata"),
                text: result.cause,
                showCancelButton: false,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33a2c",
                confirmButtonText: this.$t("lang.button.ok"),
              });
              return false;
            }
          }

          if (this.activeStep == 5) {
            if (
              isNaN(this.model.campaign.emails_per_day) || this.model.campaign.emails_per_day < 0 ||
              this.model.param_4.length == 0 ||
              (this.model.campaign.timezone_id === undefined || this.model.campaign.timezone_id === null) ||
              (this.isParameterTF("15") > 0 && (this.model.campaign.crm_pipeline_id === null || this.model.campaign.crm_stage_id === null)) ||
              (this.isParameterTF("18") > 0 && (this.model.campaign.negative_answer === null || this.model.campaign.negative_answer === "")) ||
              (this.isParameterTF("19") > 0 && (isNaN(this.model.campaign.recall_days) || this.model.campaign.recall_days <= 0))  ||
              (this.isParameterTF("20") > 0 && (this.model.campaign.absent_meeting === null || this.model.campaign.absent_meeting === "" || this.model.campaign.absent_meeting_subject === null || this.model.campaign.absent_meeting_subject === "")) ||
              (this.isParameterTF("21") > 0 && (isNaN(this.model.campaign.absent_meeting_recall_days) || this.model.campaign.absent_meeting_recall_days <= 0)) 

            ) {
              this.$swal({
                type: "warning",
                title: this.$t("lang.label.missingdata"),
                showCancelButton: false,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33a2c",
                confirmButtonText: this.$t("lang.button.ok"),
              });
              return false;
            }
          }

          if (active != undefined) {
            this.model.step = this.activeStep;
            if (this.savedSteps.indexOf(this.activeStep) === -1) {
              this.savedSteps.push(this.activeStep);
            }
            this.model.campaign.step = this.savedSteps.join(",");

            if (
              this.model.campaign.id == undefined ||
              this.model.campaign.is_tpl_first_step == false
            ) {
              this.model.campaign.tpl_first_step = undefined;
            }

            campaignsService.update(this.model).then((result) => {
              if (this.model.campaign.id == undefined) {
                this.newIdCampaign = result;
                this.getCampaignById({
                  id: result,
                });

                this.$router.push("/campaigns/" + result);
                this.$router.go("/campaigns/" + result);
                return false;
              }
              
            });

            if (this.allStepSaved()) {
              this.$swal({
                type: "success",
                title: this.$t("lang.label.great"),
                text: this.$t("lang.label.endstepscampaign"),
                confirmButtonText: this.$t("lang.label.mycampaign"),
                cancelButtonText: this.$t("lang.button.close"),
                showCancelButton: true,
                showConfirmButton: false,
              }).then((result) => {
                if (result.value == true) {
                  this.$router.push("/campaigns/" + this.model.campaign.id);
                  this.$router.go("/campaigns/" + this.model.campaign.id);
                } else {
                  this.model_init = JSON.parse(JSON.stringify(this.model));
                  this.removeStepChanged();
                  if(save !== true){
                    this.goToStepDirectX(save);
                  }
                  return true;
                }
              });
            } else {
              this.$swal({
                type: "success",
                title: this.$t("lang.label.great"),
                text: this.$t("lang.label.campaignwasupdatedsuccessfully"),
                showConfirmButton: this.activeStep != 4,
                confirmButtonText: this.$t("lang.button.next"),
                cancelButtonText: this.$t("lang.button.close"),
                showCancelButton: true,
                showConfirmButton: false,
              }).then((result) => {
                this.removeStepChanged();
                this.goToStepDirectX(active)
              });
            }
          }
        }
      }
    },

    goToStep(step) {
      this.$emit("goToStep", step);
    },

    createAllSteps() {
      if (this.model.campaign.is_tpl_first_step) {
        let sep = "\n\n";
        for (var [key, value] of Object.entries(
          this.model.campaign.tpl_first_step
        )) {
          if (value == "") {
            return {
              status: false,
              cause:
                this.$t("lang.label.thefield") +
                key +
                this.$t("lang.label.isrequired"),
            };
          }
          if (key == "final_message" && !this.checkAvailableTokens(value)) {
            return {
              status: false,
              cause: this.$t("lang.label.invalidcontentforfinalmessage"),
            };
          }
          if (key == "service" && !this.checkAvailableTokens(value)) {
            return {
              status: false,
              cause: this.$t("lang.label.invalidcontentforservice"),
            };
          }
        }

        let step = this.model.campaign_steps[0];
        if (this.model.campaign_status_id == 1) {
          this.model.campaign_steps = this.model.campaign_steps_default;
        }
        this.model.campaign_steps[0] = step;
        this.model.campaign_steps[0].subject =
          this.model.campaign.tpl_first_step.subject;
        this.model.campaign_steps[0].message =
          this.model.campaign.tpl_first_step.final_message;

        for (let i = 1; i < this.model.campaign_steps.length; i++) {
          this.model.campaign_steps[i].subject =
            this.model.campaign.tpl_first_step.subject;

          if (this.selectedCampaignId != undefined) {
            if (this.model.campaign_status_id != 2) {
              this.model.campaign_steps[i].message =
                this.model.campaign.tpl_first_step.entrance +
                sep +
                this.model.campaign_steps_default[i].message +
                sep +
                this.model.campaign.tpl_first_step.exit;
            } else {
              this.model.campaign_steps[i].message = this.model.campaign_steps[
                i
              ].message
                .replace(
                  this.model.campaign.tpl_first_step_before.entrance,
                  this.model.campaign.tpl_first_step.entrance
                )
                .replace(
                  this.model.campaign.tpl_first_step_before.exit,
                  this.model.campaign.tpl_first_step.exit
                );
            }
          } else {
            this.model.campaign_steps[i].message =
              this.model.campaign.tpl_first_step.entrance +
              sep +
              this.model.campaign_steps_default[i].message +
              sep +
              this.model.campaign.tpl_first_step.exit;
          }
        }
        /*if (!this.model.campaign_steps[0].message.includes("[my_website_url_tracking]")) {
      return {
        status: false,
        cause: this.$t('lang.label.thetokendemourlisrequired')
      }
    }*/
      } else {
        let recall = false;
        for (let i = 0; i < this.model.campaign_steps.length; i++) {
          /*if (!this.model.campaign_steps[i].message.includes("[my_website_url_tracking]")) {
        return {
          status: false,
          cause: this.$t('lang.label.thetokendemourlisrequired')
        }
      }*/
          if (this.model.campaign_steps[i].recall_step == true) {
            recall = true;
          }
        }
        if (!recall) {
          return {
            status: false,
            cause: this.$t("lang.label.dontforgettochose"),
          };
        }
      }

      return {
        status: true,
      };
    },

    loadModel() {
      if (this.selectedCampaignId) {
      } else {
        this.getEmptyCampaign();
      }
    },

    getAudience() {
      if (this.selectedCampaignId) {
        if (this.model.param_5) {
          if (this.model.param_5.length == 0) {
            this.model.param_5 = [{ id: 0, name: "All options" }];
          }
        }
      }
    },

    getCampaignStatus() {
      if (this.model.campaign.id !== undefined) {
        campaignsService
          .getAvailableStatus(this.selectedCampaignId)
          .then((response) => {
            let field = this.schema.fields.find(
              (field) => field.model === "campaign_status_id"
            );
            field.values = response;
          });
      }
    },

    getConsultors() {
      campaignsService
        .getConsultors(this.selectedCampaignId)
        .then((response) => {
          let field = this.schema.fields.find(
            (field) => field.model === "campaign.client_nylas_id"
          );
          field.values = response;
          this.consultors = response;
        });
    },
  },
};
</script>
<style>
.hidden {
  display: none !important;
}
.progress-step .progressbar .vert-text-btn {
  white-space: pre-line;
}
</style>