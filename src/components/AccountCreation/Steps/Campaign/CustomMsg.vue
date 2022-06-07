<template>
  <div>
    <div class="template-msg">
      <div class="row">
                <div class="ml-4 mt-3 mb-3">
                  <Tutorial
                    id="campaignsteps"
                    :linkText="$t('lang.label.howitworks')"
                    linkClass="small ml-2 mt-2"
                    :videoUrl="'https://www.youtube.com/embed/' + $t('lang.videos.sequence')"
                  />
                </div>
        <div class="col-sm-12 col-lg-12 p-0">
          <div class="pl-4 pr-4">
            <div class="row pt-3 pb-3">
              <div class="col-md-4">
                <h6 class="title-template mb-3">
                  {{ $t("lang.label.campaignsteps") }}
                </h6>
                <ul class="list-group">
                  <li
                    v-for="(step, key) in this.model.campaign_steps"
                    :key="key"
                    class="list-group-item"
                    :class="{ 'bg-primary text-white': selectedStep === key }"
                  >
                    <i
                      class="icon icon-circle text-primary mr-1 c-pointer"
                      :class="step.recall_step == 1 ? 'text-success' : ''"
                    ></i>
                    <div class="float-right">
                      <button
                        class="badge rounded-50 px-3 btn-themed c-pointer"
                        v-if="key !== 0 && isPending()"
                        @click="deleteStep(step, key)"
                      >
                        {{ $t("lang.label.remove") }}
                      </button>
                      <button
                        class="ml-3 badge rounded-25 px-3 btn-success c-pointer"
                        @click="selectStep(step, key)"
                      >
                        {{ $t("lang.label.edit") }}
                      </button>
                    </div>
                    <strong
                      >{{ $t("lang.label.step") }} {{ step.step }}.</strong
                    >
                    <br />
                    <span v-html="step.subject"></span>
                  </li>
                </ul>
                <div class="w-100 d-flex justify-content-center my-3">
                  <button
                    v-if="isPending()"
                    class="btn btn-primary themed-button btn-sm mr-2"
                    type="button"
                    @click="addNewStep()"
                  >
                    {{ $t("lang.label.addastep") }}
                  </button>
                </div>
                <div class="my-3">
                  <strong>{{ $t("lang.label.signature") }}</strong>
                </div>

                <div class="field-ckeditor-wrappar">
                  <ValidationProvider
                    ref="editorDataV"
                    :rules="{ 'token-validation': [availableTokens] }"
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
                          v-model="editorData"
                          :config="editorConfig"
                          @input="hasModified"
                        ></ckeditor>
                        
                        <div v-if="editorData === ''" class="small">
                          {{ $t("lang.label.emailsignatureinfo")}}
                        </div>
                        <div class="errors help-block">
                          <span>{{ errors[0] }}</span>
                        </div>
                        
                      </div>
                    </div>
                  </ValidationProvider>
                </div>
                <div class="col-12">
                  <div class="my-3">
                    <div class="my-3"><strong>Logo</strong></div>
                    <img
                      :src="this.model.campaign.logo"
                      alt=""
                      class="rounded border-color"
                      width="100px"
                    />
                   <div class="float-left mr-2">
                    <div>
                      <a
                        class="
                          btn btn-sm
                          cursor-pointer
                          font-weight-bolder
                          btn-outline-secondary
                        "
                        @click="toggleShow"
                        >{{ $t("lang.button.setimage") }}</a
                      >
                    </div>
                    <div class="mt-2">
                      <a
                        class="
                          btn btn-sm 
                          cursor-pointer
                          font-weight-bolder
                          btn-outline-secondary
                        "
                        v-if="model.campaign.logo !== null"
                        @click="deleteImage"
                        >{{ $t("lang.button.deleteimage") }}</a
                      >
                    </div>
                  </div>
                    <uploadImage
                      field="img"
                      @crop-success="cropSuccess"
                      @crop-upload-success="cropUploadSuccess"
                      @crop-upload-fail="cropUploadFail"
                      v-model="show"
                      :width="100"
                      :height="100"
                      :params="params"
                      :headers="headers"
                      lang-type="en"
                      img-format="png"
                    >
                    </uploadImage>
                  </div>
                </div>
              </div>
              <div class="col-md-8 mt-5 form-step-wrapper">
                <div class="float-right">
                  <button
                    id="btn-preview"
                    class="btn btn-primary themed-button btn-sm "
                    type="button"
                    @click="openModal('preview')"
                  >
                    {{ $t("lang.button.preview") }}
                  </button>
                  <button
                    :class="sendingTestEmail ? 'btn-secondary btn-loading' : 'btn-outline-primary'"
                    class = "rounded ml-2 btn  btn-sm" @click="sendTestEmail()" >
                    <i class="icon-email"></i>
                    {{ $t("lang.campaigns_dashboard.sendtestemail") }}
                  </button>
                </div>
                <form @submit.prevent="onSubmit" v-if="model !== undefined">
                  <vue-form-generator
                    ref="stepForm"
                    :schema="schema"
                    :model="modelStep"
                    :options="formOptions"
                  ></vue-form-generator>
                </form>

                <div class="field-ckeditor-wrappar">
                  <ValidationProvider
                    ref="editorSubjectV"
                    :rules="{
                      required: true,
                      'token-validation': [availableTokens],
                      'length-plain-text': [{ max: 160 }],
                    }"
                  >
                    <div slot-scope="{ errors }">
                      <div
                        class="
                          form-group
                          valid
                          featured
                          required
                          col-sm-12
                          field-input field-ckeditor
                        "
                        :class="errors.length > 0 ? 'error' : ''"
                      >
                        <label> {{ $t("lang.label.subject") }}</label>

                        <ckeditor
                          :editor="editorInitial"
                          v-model="editorSubject"
                          :config="editorConfigMinimum"
                          
                        ></ckeditor>

                        <div class="errors help-block">
                          <span>{{ errors[0] }}</span>
                        </div>
                      </div>
                    </div>
                  </ValidationProvider>
                </div>

                <div class="field-ckeditor-wrappar">
                  <ValidationProvider
                    ref="editorMessageV"
                    :rules="{
                      required: true,
                      'token-validation': [availableTokens],
                    }"
                  >
                    <div slot-scope="{ errors }">
                      <div
                        class="
                          form-group
                          valid
                          featured
                          required
                          col-sm-12
                          field-input field-ckeditor
                        "
                        :class="errors.length > 0 ? 'error' : ''"
                      >
                        <label> {{ $t("lang.label.message") }}</label>

                        <ckeditor
                          :editor="editorInitial"
                          v-model="editorMessage"
                          :config="editorConfig"
                        ></ckeditor>

                        <div class="errors help-block">
                          <span>{{ errors[0] }}</span>
                        </div>
                      </div>
                    </div>
                  </ValidationProvider>
                </div>
                <div class="form-group valid">
                  <div class="field-wrap">
                    <div class="text-right">
                      <div class="btn-group-2">
                        <div
                          v-if="
                            modelStep.step > 1 && model.campaign_status_id == 1
                          "
                        >
                          <label
                            v-if="
                              this.model.campaign_steps[modelStep.step - 1] &&
                              (modelStep.recall_step == undefined ||
                                modelStep.recall_step == 0)
                            "
                            @click="selectRecall(modelStep.step - 1)"
                            class="c-pointer btn mr-2 btn-sm btn-success"
                            >{{ $t("lang.label.selectasrecall") }}</label
                          >
                          <label
                            v-if="modelStep.recall_step == 1"
                            @click="stopRecall(modelStep.step - 1)"
                            class="c-pointer btn mr-2 btn-sm btn-secondary"
                            >{{ $t("lang.label.removerecall") }}</label
                          >
                        </div>
                        <div
                          id="message-notification"
                          class="message-notification mr-2"
                        >
                          <span class="circle-check mr-3">
                            <i class="icon-check"></i>
                          </span>
                          <span>{{
                            $t("lang.label.messagesavedsuccessfully")
                          }}</span>
                        </div>
                        <button
                          id="btn-new"
                          class="btn supersave px-5 py-2 btn-primary themed-button mr-2"
                          type="button"
                          @click="saveStep()"
                          v-if="this.selectedStep == 'draf'"
                        >
                          {{ $t("lang.button.save") }}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <modal
      name="preview"
      :clickToClose="true"
      class="modal-preview"
      :resizable="true"
      height="auto"
      width="70%"
      :max-width="800"
    >
      <div class="pr-2 pt-1">
        <button
          type="button"
          class="close"
          data-dismiss="alert"
          aria-label="Close"
          @click="closeModal('preview')"
        >
          <span aria-hidden="true">&times;</span>
        </button>
      </div>

      <EmailsPreview :model="model" />
    </modal>

    <div class="py-4 mb-4 d-flex justify-content-end">
      <button
        class="ml-3 btn px-5 py-2 supersave btn-success btn-sm text-right"
        @click="goToStepCampaign(true)"
      >
        {{ $t("lang.button.save") }}
      </button>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import { formattersMixin, campaignUtilsMixin } from "@/_mixins/";
import CKEditor from "@ckeditor/ckeditor5-vue";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

import VueFormGenerator from "vue-form-generator";
import "vue-form-generator/dist/vfg.css";
import { campaignsService, emailsService } from "@/_services";
import uploadImage from "vue-image-crop-upload";
import { mapState } from "vuex";
import { lenguagesService } from "@/_services";
import EmailsPreview from "@/components/AccountCreation/Steps/Campaign/EmailsPreview.vue";
import Tutorial from "@/components/Tutorial.vue";

Vue.directive("visible", function (el, binding) {
  el.style.visibility = !!binding.value ? "visible" : "hidden";
});



export default {
  props: {
    model: Object,
    availableTokens: Array,
  },

  components: {
    "vue-form-generator": VueFormGenerator.component,
    ckeditor: CKEditor.component,
    uploadImage,
    EmailsPreview,
    Tutorial,
  },

  data() {
    var self = this;
    return {
      modified: false,
      sendingTestEmail: false,
      editorInitial: ClassicEditor,
      editorData: "",
      editorSubject: "",
      editorMessage: "",
      editorConfig: {
        /*plugins: [ Essentials, Heading, Bold, Italic, Link, AutoPlaceholder ],*/
        toolbar: [
          "heading",
          "|",
          "bold",
          "italic",
          "|",
          "link",
          "|",
          "autoplaceholder",
        ],
        autoplaceholder: {
          tokenList: this.availableTokens.filter(
            (token) => token.token != "[my_website_url_tracking]"
          ),
          label: this.$t("lang.button.variables"),
          textos: {
            label: this.$t("lang.button.setadefaultvalue"),
            save: this.$t("lang.button.save"),
            cancel: this.$t("lang.button.cancel"),
          },
        },
      },

      editorConfigMinimum: {
        /*plugins: [ Essentials, Heading, Bold, Italic, Link, AutoPlaceholder ],*/
        toolbar: ["autoplaceholder"],
        autoplaceholder: {
          tokenList: this.availableTokens.filter(
            (token) => token.token != "[my_website_url_tracking]"
          ),
          label: this.$t("lang.button.variables"),
          textos: {
            label: this.$t("lang.button.setadefaultvalue"),
            save: this.$t("lang.button.save"),
            cancel: this.$t("lang.button.cancel"),
          },
        },
      },
      show: false,
      params: {
        token: "123456798",
        name: "avatar",
      },
      headers: {
        smail: "*_~",
      },
      stepArray: [],
      modelStep: {},
      modelCampaign: {},
      langs: [],
      selectedStep: null,
      stepNewSaved: false,
      schema: {
        fields: [
          {
            type: "checkbox",
            label: "Recall",
            model: "recall_step",
            readonly: false,
            featured: true,
            required: true,
            disabled: false,
            default: "0",
            styleClasses: "hidden",
          },
          {
            type: "input",
            inputType: "text",
            label: this.$t("lang.label.step"),
            model: "step",
            readonly: false,
            featured: true,
            required: true,
            disabled: true,
            default: "1",
            styleClasses: "col-sm-3",
          },
          {
            type: "input",
            inputType: "text",
            label: this.$t("lang.label.delay"),
            model: "delay",
            readonly: false,
            featured: true,
            required: true,
            disabled() {
              return self.model.campaign_status_id != 1;
            },
            hint: this.$t("lang.campaign_edit.helpdelaydays"),
            min: 1,
            max: 100,
            visible(model) {
              return model && model.step != "1";
            },
            validator: ["string", "numberBetweenValidator"],
            styleClasses: "col-lg-6",
          },
          /* {
            type: "input",
            inputType: "text",
            label: this.$t("lang.label.subject"),
            id: "subject",
            model: "subject",
            readonly: false,
            featured: true,
            required: true,
            disabled: false,
            default: "11",
            validator: [
              VueFormGenerator.validators.string.locale({
                fieldIsRequired: this.$t("lang.label.required"),
                textTooSmall: this.$t("lang.validation.texttosmall", {min: "{1}"}),
              }),
              VueFormGenerator.validators.availableTokens,
            ],
            styleClasses: "col-sm-12",
          },
          {
            type: "textArea",
            label: this.$t("lang.label.message"),
            id: "message",
            model: "message",
            readonly: false,
            featured: true,
            required: true,
            disabled: false,
            rows: 10,
            default: "",
            validator: [
              VueFormGenerator.validators.string.locale({
                fieldIsRequired: this.$t("lang.label.required"),
                textTooSmall: this.$t("lang.validation.texttosmall", {min: "{1}"}),
              }),
              VueFormGenerator.validators.availableTokens,
            ],
            styleClasses: "col-sm-12",
          },*/
        ],
      },
      schemaGeneral: {
        fields: [
          {
            type: "input",
            inputType: "text",
            label: this.$t("lang.label.demourl"),
            model: "campaign.demo_url",
            readonly: false,
            featured: true,
            required: true,
            hint: this.$t("lang.label.inoliverprospectingcampaigns"),
            min: 5,
            styleClasses: "col-md-12",
            validator: VueFormGenerator.validators.string.locale({
              fieldIsRequired: this.$t("lang.label.required"),
            }),
          },
        ],
      },
      formOptions: {
        validateAfterLoad: false,
        validateAfterChanged: true,
      },
      lastFocusedElement: undefined,
      lastFocusedElementPosition: undefined,
    };
  },

  mixins: [formattersMixin, campaignUtilsMixin],

  watch: {
    editorData: function () {
      this.model.campaign.email_signature = this.editorData;
    },
    "modelStep.subject"() {
      //this.modelStep.subject = this.$sanitize(this.modelStep.subject);
    },
    "modelStep.message"() {
      //this.modelStep.message = this.$sanitize(this.modelStep.message);
    },
    editorSubject: function () {
      this.modelStep.subject = this.editorSubject;
    },
    editorMessage: function () {
      this.modelStep.message = this.editorMessage;
    },
    modelStep: function () {
      if (this.modelStep !== undefined) {
        setTimeout(() => {
          this.editorSubject = this.modelStep.subject;
          this.editorMessage = this.modelStep.message;
        }, 5);
      }
    },
  },

  computed: {
    ...mapState({
      loadingOptionsList: (state) => state.optionsList.loading,
      currentUser: (state) => state.authentication.user,
    }),
    isDisabled: function () {
      return this.stepNewSaved;
    },
  },

  created() {
    if (this.model.campaign.demo_url == "undefined") {
      this.model.campaign.demo_url = "";
    }
    this.getLanguages();
    this.modelStep.step = this.model.campaign_steps.length + 1;
    document.addEventListener("click", this.clickEvent);
    document.addEventListener("change", this.clickEvent);
    //this.selectStep(this.model.campaign_steps[0], 0);
    if (this.model.campaign.id !== undefined) {
      this.editorData = this.model.campaign.email_signature;
    }
    this.modelCampaign = this.model.campaign;
  },
  mounted() {
    //console.log('--',this.model.campaign_steps[0]);
    let myProposition =
      this.model.campaign.my_proposition == ""
        ? "des services"
        : this.model.campaign.my_proposition;
    let myWebsiteLink =
      this.model.campaign.demo_url == ""
        ? "your website link"
        : '<a href="' +
          this.model.campaign.demo_url +
          '">' +
          this.model.campaign.demo_url +
          "</a>";
    this.model.campaign_steps.forEach(function (dato) {
      dato.message = dato.message.replace("[my_proposition]", myProposition);
      dato.message = dato.message.replace(
        "[my_website_url_tracking]",
        myWebsiteLink
      );
      dato.message = campaignUtilsMixin.methods.formatForCKEditor(dato.message);
      dato.subject = campaignUtilsMixin.methods.formatForCKEditor(dato.subject);
    });
    this.selectStep(this.model.campaign_steps[0], 0);
  },
  methods: {
    hasModified() {
      this.modified = true;
    },
    isPending() {
      return this.model.campaign_status_id == 1;
    },
    showNotification() {
      var x = document.getElementById("message-notification");
      x.className = x.className + " show";
      setTimeout(function () {
        x.className = x.className.replace("show", "");
      }, 3000);
    },
    isSaved() {
      var savedSteps;
      if (this.model.campaign.step !== null) {
        savedSteps = this.model.campaign.step.split(",");

        if (savedSteps.indexOf(3) >= 0 || savedSteps.indexOf("3") >= 0) {
          return true;
        }
      }
      return false;
    },
    onLogoInputChange(e) {
      var files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;
    },
    stepFormIsValid() {
      this.$refs.stepForm.validate();
      this.$refs.editorSubjectV.validate();
      this.$refs.editorMessageV.validate();
      return (
        this.$refs.stepForm.errors.length == 0 &&
        this.$refs.editorSubjectV.errors.length == 0 &&
        this.$refs.editorMessageV.errors.length == 0
      );
    },
    signatureFormIsValid() {
      this.$refs.editorDataV.validate();
      return this.$refs.editorDataV.errors.length == 0;
      return true;
    },
    addNewStep() {
      if (!this.stepFormIsValid()) {
        this.$swal({
          type: "error",
          title: this.$t("lang.label.error"),
          text: this.$t("lang.label.checkdeerrormessagesintheformandtryagain"),
          showConfirmButton: true,
        });
        return;
      }

      this.stepNewSaved = true;
      this.modifyStep();
      this.model.campaign_steps.push(this.modelStep);
      let draf = this.model.campaign_steps.length - 1;
      this.modelStep = {
        step: this.model.campaign_steps.length + 1,
        subject: "",
        message: "",
      };
      this.selectStep(this.model.campaign_steps[draf], draf);
      this.selectedStep = "draf";
    },
    saveStep(step) {
      if (!this.stepFormIsValid()) {
        this.$swal({
          type: "error",
          title: this.$t("lang.label.error"),
          text: this.$t("lang.label.checkdeerrormessagesintheformandtryagain"),
          showConfirmButton: true,
        });
        return;
      } else {
        this.showNotification();
        if ((this.selectedStep = "draf")) {
          this.selectedStep = null;
          this.stepNewSaved = false;
        }
      }
    },
    getLanguages() {
      lenguagesService.getAll().then((result) => {
        this.langs = result;
      });
    },
    isLanguageDisabled() {
      return true; //por ahora siempre disaled porque igualmente no funcinoa lo otro
      if (this.isSaved()) return true;
      else return false;
    },

    updateCampaignSteps(steps) {
      this.$emit("updateCampaignSteps", steps);
      this.model.campaign_steps = steps;
    },

    goToStepCampaign(save) {
      if (!this.stepFormIsValid() || !this.signatureFormIsValid()) {
        this.$swal({
          type: "warning",
          title: this.$t("lang.label.error"),
          text: this.$t("lang.label.checkdeerrormessagesintheformandtryagain"),
          showConfirmButton: true,
        });
        return;
      } else if (!save || save == "back") {
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
            this.$emit("goToStepCampaign", save);
          }
        });
      } else {
        this.$emit("goToStepCampaign", save);
      }
    },

    selectStep(step, key) {
      /*if (!this.stepFormIsValid()) {
        this.$swal({
          type: "error",
          title: this.$t("lang.label.error"),
          text: this.$t("lang.label.checkdeerrormessagesintheformandtryagain"),
          showConfirmButton: true,
        });
        return;
      }*/

      this.modelStep = step;
      this.selectedStep = key;
    },

    selectRecall(step) {
      this.model.campaign_steps.push("");
      this.model.campaign_steps.pop();

      this.model.campaign_steps.forEach(function (part, index) {
        this[index].recall_step = false;
      }, this.model.campaign_steps);

      this.model.campaign_steps[step].recall_step = true;
    },

    stopRecall(step) {
      /*this.model.campaign_steps.push("");
      this.model.campaign_steps.pop();
      this.model.campaign_steps[step].recall_step = false;*/
    },

    modifyStep() {
      this.modelStep = {
        step: this.model.campaign_steps.length + 1,
        subject: "",
        message: "",
      };
      // this.selectedStep = null;
    },

    deleteStep(step, key) {
      if (this.model.campaign_steps.length <= 2) {
        this.$swal({
          type: "warning",
          title: this.$t("lang.label.error"),
          text: this.$t("lang.validation.atleasttwosteps"),
          confirmButtonText: this.$t("lang.button.continue"),
          showCancelButton: false,
          showConfirmButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33a2c",
        });
        return;
      }
      this.$swal({
        type: "warning",
        title: this.$t("lang.label.areyousure"),
        text: this.$t("lang.label.thisactioncannotbeundone"),
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33a2c",
        confirmButtonText: this.$t("lang.button.yes"),
        cancelButtonText: this.$t("lang.button.cancel"),
      }).then((result) => {
        if (result.dismiss != "cancel") {
          var i;
          var res = this.model.campaign_steps;
          delete res[key];
          var resaux = [];
          var index = 1;
          for (i = 0; i < res.length; i++) {
            if (res[i] != undefined) {
              res[i].step = index;
              index++;
              resaux.push(res[i]);
            }
          }
          this.updateCampaignSteps(resaux);
          this.modelStep = {
            step: resaux.length + 1,
            subject: "",
            message: "",
          };

          this.selectStep(this.model.campaign_steps[0], 0);
          this.selectedStep = 0;
          this.stepNewSaved = false;
        }
      });
    },

    newStep(step) {
      if (!this.stepFormIsValid()) {
        this.$swal({
          type: "error",
          title: this.$t("lang.label.error"),
          text: this.$t("lang.label.checkdeerrormessagesintheformandtryagain"),
          showConfirmButton: true,
        });
        return;
      }

      this.model.campaign_steps.push(this.modelStep);

      this.modelStep = {
        step: this.model.campaign_steps.length + 1,
        subject: "",
        message: "",
      };
    },

    resetSelectedStep() {},

    addToken(event) {
      let token = event.target.getAttribute("data-token");
      if (this.lastFocusedElement !== undefined) {
        if (this.lastFocusedElement.value.length == 0) {
          this.lastFocusedElement.value = token;
        } else {
          var input_val_pre = this.lastFocusedElement.value.substring(
            0,
            this.lastFocusedElementPosition
          );
          var input_val_post = this.lastFocusedElement.value.substring(
            this.lastFocusedElementPosition
          );
          var input_val = input_val_pre + " " + token + " " + input_val_post;
          while (input_val.indexOf("  ") > -1) {
            input_val = input_val.replace("  ", " ");
          }
          this.lastFocusedElement.value = input_val.trim();
          this.lastFocusedElement.dispatchEvent(new Event("input"));
          this.lastFocusedElement.dispatchEvent(new Event("change"));
        }
      }
    },

    clickEvent(event) {
      const el = event.target;
      if (el.id == "subject" || el.id == "message") {
        this.lastFocusedElement = el;
        if (el.selectionStart != null && el.selectionStart != undefined) {
          this.lastFocusedElementPosition = el.selectionStart;
        } else {
          this.lastFocusedElementPosition = el.selectionStart;
        }
      }
    },

    toggleShow() {
      this.show = !this.show;
    },
    deleteImage(){
      this.model.campaign.logo = null;
    },
    cropSuccess(imgDataUrl, field) {
      this.model.campaign.logo = imgDataUrl;
    },
    cropUploadSuccess(jsonData, field) {},
    cropUploadFail(status, field) {},
    dataURLtoFile(dataurl, filename) {
      var arr = dataurl.split(","),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);

      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }

      return new File([u8arr], filename, { type: mime });
    },
    openModal(name) {
      this.$modal.show(name);
    },
    closeModal(name) {
      this.$modal.hide(name);
    },
  },
};
</script> 
<style>
.supersave{
  position:fixed;
  right:100px;
  bottom:15px;
}
#message-notification {
  visibility: hidden;
}
#message-notification.show {
  visibility: visible;
  -webkit-animation: fadein 0.5s, fadeout 0.5s 2.5s;
  animation: fadein 0.5s, fadeout 0.5s 2.5s;
}

@-webkit-keyframes fadein {
  from {
    bottom: 0;
    opacity: 0;
  }
  to {
    bottom: 30px;
    opacity: 1;
  }
}

@keyframes fadein {
  from {
    bottom: 0;
    opacity: 0;
  }
  to {
    bottom: 30px;
    opacity: 1;
  }
}

@-webkit-keyframes fadeout {
  from {
    bottom: 30px;
    opacity: 1;
  }
  to {
    bottom: 0;
    opacity: 0;
  }
}

@keyframes fadeout {
  from {
    bottom: 30px;
    opacity: 1;
  }
  to {
    bottom: 0;
    opacity: 0;
  }
}
.btn-group-2 {
  position: relative;
  display: -ms-inline-flexbox;
  display: -webkit-inline-box;
  display: inline-flex;
  vertical-align: middle;
  padding-right: 6px;
}
#message-notification {
  position: relative;
  align-items: center;
  justify-content: center;
  border: 1px solid;
  padding-left: 12px;
  padding-right: 12px;
  padding-top: 10px;
  padding-bottom: 10px;
  border-radius: 5px;
  color: #443cec;
  background-color: #fff;
  padding-left: 50px;
}
.circle-check {
  border-radius: 50%;
  border: 1px solid #443cec;
  position: absolute;
  height: 27px;
  width: 27px;
  left: 10px;
  top: 7px;
}
i.icon-check {
  color: #443cec;
  position: absolute;
  top: 5px;
  left: 5px;
}
.templates {
  display: grid;
}
.title-template {
  font-weight: 500;
}
.template {
  background: #f5f6fa;
  border-radius: 3 px;
  padding: 10 px;
}
button.btn.btn-primary.themed-button.btn-sm.dropdown-toggle.tokens {
  position: absolute;
  top: 153px;
  right: 31px;
}
/*button.btn.btn-primary.themed-button.btn-sm#btn-preview {
  position: absolute;
  top: 0px;
  right: 31px;
}*/
·modal-preview {
  max-width: 800px;
}
#btn-new {
  position: relative;
  left: 250px;
}
label.c-pointer.btn.mr-2.btn-sm.btn-success.float-right {
  position: relative;
  right: -124px;
}
label.c-pointer.btn.mr-2.btn-sm.btn-secondary.float-right {
  position: relative;
  right: -124px;
}
.form-step-wrapper {
  position: relative;
}
.autoplaceholder {
  background: #e0e0e0;
  padding: 0px 4px;
  color: #8580f2;
}
.ck .autoplaceholder.ck-widget:hover {
  outline-color: #5155ea;
}
.list-group .autoplaceholder,
.activityLine .autoplaceholder {
  background: transparent;
}
.list-group .text-white .autoplaceholder {
  color: #ffffff;
}
.field-ckeditor-wrappar > span {
  width: 100%;
}
.field-ckeditor.error .ck-content {
  background: rgba(255, 0, 0, 0.15);
}
.field-ckeditor.error .ck-editor {
  border: 1px solid red;
}
.field-ckeditor a {
  color: blue;
}
</style>