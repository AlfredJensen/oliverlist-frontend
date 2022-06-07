 <template>
  <div class="template-msg">
    <div class="row">
      <div class="col-sm-12 my-3 ml-2">
        <Tutorial
          id="teempatemessage"
          :linkText="$t('lang.label.howitworks')"
          linkClass="ml-2 mb-2"
          :videoUrl="'https://www.youtube.com/embed/' + $t('lang.video.sequence')"
        />
        <div class="float-right">
          <button 
            :class="sendingTestEmail ? 'btn-secondary btn-loading' : 'btn-outline-primary'"
            class = "rounded ml-2 btn  btn-sm" @click="sendTestEmail()" >
            <i class="icon-email"></i>
            {{ $t("lang.campaigns_dashboard.sendtestemail") }}
          </button>
        </div>
      </div>
    </div>
          <div class="row">
            <div class="col-12 col-md-4">
              <form @submit.prevent="onSubmit">
                <vue-form-generator
                  ref="tplFirstStepForm"
                  :schema="schema"
                  :model="model"
                  :options="formOptions"
                  @model-updated="createFinalMessage"
                ></vue-form-generator>
              </form>
              <div class="col-12">
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
                        <label> {{ $t("lang.label.signature") }}</label>

                        <ckeditor
                          :editor="editorInitial"
                          v-model="editorData"
                          :config="editorConfig"
                          @namespaceloaded="onNamespaceLoaded"
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
              </div>
              <div class="col-12">
                <div class="my-3">
                  <div class="my-3"><strong>Logo</strong></div>
                  <img
                    :src="this.model.campaign.logo"
                    alt=""
                    class="rounded border-color mr-4"
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
            <div class="col-12 col-md-8 card rounded">
              <div class="pt-1 mt-4">
                <div class="w-100 bg-lg px-2 py-2" style="min-height: 40px">
                  <span
                    v-if="model"
                    v-html="
                      $sanitize(
                        formatTokens(
                          convertNLtoBR(
                            this.model.campaign.tpl_first_step.subject
                          )
                        )
                      )
                    "
                  ></span>
                </div>
              </div>
              <div class="py-2 px-2 my-4 bg-lg" style="min-height: 450px">
                <div class="w-100 px-2 py-2" style="height: inherit">
                  <span
                    class="msgCamp"
                    v-if="model"
                    v-html="
                      $sanitize(
                        formatTokens(
                          convertNLtoBR(this.messageWithMyProposition)
                        )
                      )
                    "
                  ></span>
                  <br /><br />
                  ---
                  <br />
                  <span
                    class=""
                    v-if="model.campaign.email_signature"
                    v-html="
                      $sanitize(
                        formatTokens(
                          convertNLtoBR(model.campaign.email_signature)
                        )
                      )
                    "
                  ></span>
                  <br /><br />
                  <img
                    :src="this.model.campaign.logo"
                    alt=""
                    class="rounded border-color mr-4"
                    width="100px"
                  />
                </div>
              </div>
              <div class="d-flex justify-content-center align-items-center">
                <div class="text-center">
                  <small>{{
                    $t("lang.label.testwithdifferentprospects")
                  }}</small>
                  <div class="my-2">
                    <button
                      class="
                        ml-3
                        btn btn-primary
                        themed-button
                        btn-sm
                        text-right
                      "
                      @click="changeBusinessContactSelected(-1)"
                    >
                      <i class="icon-navigate_before"></i>
                    </button>
                    <span class="mx-2 minw-150">{{
                      this.testBusinessContact[
                        this.testBusinessContactSelected
                      ]["[prospect_company_name]"]
                    }}</span>
                    <button
                      class="
                        ml-3
                        btn btn-primary
                        themed-button
                        btn-sm
                        text-right
                      "
                      @click="changeBusinessContactSelected(1)"
                    >
                      <i class="icon-navigate_next"></i>
                    </button>
                  </div>
                </div>
              </div>
          </div>
        </div>
        <div class="py-4 mr-4 d-flex justify-content-end float-right">
          <div class="row">
            <button
              class="ml-2 btn px-5 py-2 supersave btn-success btn-sm text-center"
              @click="goToStepCampaign(true)"
            >
              {{ $t("lang.button.save") }}
            </button>
          </div>
        </div>
  </div>
</template>
<script>
import Vue from "vue";
import { formattersMixin, campaignUtilsMixin } from "@/_mixins/";

import CKEditor from "@ckeditor/ckeditor5-vue";

import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

/* import ClassicEditor from "@ckeditor/ckeditor5-editor-classic/src/classiceditor";
  import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
  import Heading from '@ckeditor/ckeditor5-heading/src/heading';
  import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
  import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
  import Link from '@ckeditor/ckeditor5-link/src/link';
  import AutoPlaceholder from 'autoplaceholder/autoplaceholder';*/

import VueFormGenerator from "vue-form-generator";
import "vue-form-generator/dist/vfg.css";
import Multiselect from "vue-multiselect";
import uploadImage from "vue-image-crop-upload";
import { mapState, mapActions } from "vuex";
import { lenguagesService } from "@/_services";
import Tutorial from "@/components/Tutorial.vue";

// if this component is not defined here, theres an error
Vue.component("multiselect", Multiselect);

export default {
  components: {
    "vue-form-generator": VueFormGenerator.component,
    ckeditor: CKEditor.component,
    uploadImage,
    Tutorial,
  },

  props: {
    model: Object,
    availableTokens: Array,
    activeStep: Number,
  },

  computed: {
    ...mapState({
      loadingOptionsList: (state) => state.optionsList.loading,
      currentUser: (state) => state.authentication.user,
    }),

    messageWithMyProposition() {
      let sep = "\n\n";
      return (
        this.model.campaign.tpl_first_step.entrance +
        sep +
        this.model.campaign.tpl_first_step.hook +
        sep +
        this.model.campaign.tpl_first_step.personalized_hook +
        sep +
        this.model.campaign.tpl_first_step.presentation +
        sep +
        this.model.campaign.tpl_first_step.politeness +
        sep +
        this.model.campaign.tpl_first_step.exit
      );
    },
  },

  mixins: [formattersMixin, campaignUtilsMixin],

  data() {
    return {
      modified: false,
      editorInitial: ClassicEditor,
      editorData: "",
      editorConfig: {
        /*plugins: [ Essentials, Heading, Bold, Italic, Link ],*/
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
      show: false,
      sendingTestEmail: false,
      langs: [],
      subjects: [],
      entrances: [],
      hooks: [],
      personalized_hooks: [],
      presentations: [],
      politeness: [],
      exits: [],
      params: {
        token: "123456798",
        name: "avatar",
      },
      headers: {
        smail: "*_~",
      },
      schema: {
        fields: [
          {
            type: "select",
            label: this.$t("lang.label.language"),
            model: "campaign.language_id",
            featured: true,
            required: true,
            multiSelect: false,
            values: () => {
              return this.langs;
            },
            disabled: (campaign) => {
              if (this.isSaved()) {
                return true;
              }
            },
            onChanged: this.onChangeLanguageEventHandler,
            styleClasses: "col-md-12",
          },
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
          {
            type: "select",
            label: this.$t("lang.label.subject"),
            model: "campaign.tpl_first_step.subject",
            multi: true,
            required: true,
            featured: true,
            multiSelect: true,
            values: () => {
              return this.subjects;
            },
            styleClasses: "col-md-12 not-ajust",
            validator: VueFormGenerator.validators.string.locale({
              fieldIsRequired: this.$t("lang.label.required"),
            }),
          },
          {
            type: "select",
            label: this.$t("lang.label.entrance"),
            model: "campaign.tpl_first_step.entrance",
            featured: true,
            required: true,
            multiSelect: true,
            values: () => {
              return this.entrances;
            },
            styleClasses: "col-md-12",
            validator: VueFormGenerator.validators.string.locale({
              fieldIsRequired: this.$t("lang.label.required"),
            }),
          },
          {
            type: "select",
            label: this.$t("lang.label.hook"),
            model: "campaign.tpl_first_step.hook",
            featured: true,
            required: true,
            multiSelect: true,
            values: () => {
              return this.hooks;
            },
            styleClasses: "col-md-12",
            validator: VueFormGenerator.validators.string.locale({
              fieldIsRequired: this.$t("lang.label.required"),
            }),
          },
          {
            type: "select",
            label: this.$t("lang.label.personalizedhook"),
            model: "campaign.tpl_first_step.personalized_hook",
            featured: true,
            required: true,
            multiSelect: true,
            values: () => {
              return this.personalized_hooks;
            },
            styleClasses: "col-md-12",
            validator: VueFormGenerator.validators.string.locale({
              fieldIsRequired: this.$t("lang.label.required"),
            }),
          },
          {
            type: "textArea",
            label: this.$t("lang.label.service"),
            model: "campaign.tpl_first_step.service",
            featured: true,
            required: true,
            hint: this.$t("lang.label.max500characters"),
            max: 500,
            placeholder: "ex : L’aide à la gestion financière d’entreprise",
            rows: 4,
            // validator: validators.string,
            styleClasses: "col-md-12",
            validator: VueFormGenerator.validators.string.locale({
              fieldIsRequired: this.$t("lang.label.required"),
            }),
          },
          {
            type: "select",
            label: this.$t("lang.label.presentation"),
            model: "campaign.tpl_first_step.presentation",
            featured: true,
            required: true,
            multiSelect: true,
            values: () => {
              return this.presentations;
            },
            styleClasses: "col-md-12",
            validator: VueFormGenerator.validators.string.locale({
              fieldIsRequired: this.$t("lang.label.required"),
            }),
          },
          {
            type: "select",
            label: this.$t("lang.label.politeness"),
            model: "campaign.tpl_first_step.politeness",
            featured: true,
            required: true,
            multiSelect: true,
            values: () => {
              return this.politeness;
            },
            styleClasses: "col-md-12",
            validator: VueFormGenerator.validators.string.locale({
              fieldIsRequired: this.$t("lang.label.required"),
            }),
          },
          {
            type: "select",
            label: this.$t("lang.label.exit"),
            model: "campaign.tpl_first_step.exit",
            featured: true,
            required: true,
            multiSelect: true,
            values: () => {
              return this.exits;
            },
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
    };
  },
  watch: {
    editorData: function () {
      this.model.campaign.email_signature = this.editorData;
    },
    "model.campaign.tpl_first_step.service"() {
      this.model.campaign.tpl_first_step.service = this.$sanitize(
        this.model.campaign.tpl_first_step.service
      );
    },
  },
  created() {
    if (this.model.campaign.demo_url == "undefined") {
      this.model.campaign.demo_url = "";
    }

    if (!this.model.campaign.tpl_first_step) {
      this.model.campaign.tpl_first_step = {
        subject: "",
        entrance: "",
        hook: "",
        personalized_hook: "",
        final_hook: "",
        service: "",
        presentation: "",
        politeness: "",
        exit: "",
        final_message: "",
      };
    }
    this.scrollToTop();
    if (this.model.campaign.email_signature !== undefined) {
      this.editorData = this.model.campaign.email_signature;
    }
    this.getLanguages();
    this.getOptionsMessage({
      language_id:
        this.model.campaign.language_id !== ""
          ? this.model.campaign.language_id
          : this.currentUser.language_id,
    }).then((result) => {
      this.subjects = result.subjects;
      this.entrances = result.entrances;
      this.hooks = result.hooks;
      this.personalized_hooks = result.personalized_hooks;
      this.presentations = result.presentations;
      this.politeness = result.politeness;
      this.exits = result.exits;
    });
  },
  methods: {
    ...mapActions("campaigns", {
      generateDefaultsSteps: "generateDefaultsSteps",
      getOptionsMessage: "getOptionsMessage",
    }),

    scrollToTop() {
      window.scrollTo(0, 0);
    },

    hasModified() {
      this.modified = true;
    },

    templateFormIsValid() {
      //setTimeout(() => {
      /*console.log(
        this.$refs.tplFirstStepForm.validate(),
        this.$refs.editorDataV.validate()
      );*/
      this.$refs.tplFirstStepForm.validate();
      this.$refs.editorDataV.validate();
      /*console.log(
        this.$refs.tplFirstStepForm.errors.length,
        this.$refs.editorDataV.errors.length
      );*/
      return (
        this.$refs.tplFirstStepForm.errors.length == 0 &&
        this.$refs.editorDataV.errors.length == 0
      );
      //}, 5);
    },
    onChangeLanguageEventHandler(model, newVal, oldVal, field) {
      this.$swal({
        type: "warning",
        title: this.$t("lang.label.areyousureyouwanttochangethelanguage"),
        text: this.$t("lang.label.youwilllosethecurrentmessageconfiguration"),
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33a2c",
        confirmButtonText: this.$t("lang.button.yes"),
      }).then((result) => {
        if (result.value) {
          this.generateDefaultsSteps({
            language_id: newVal,
          });
          this.getOptionsMessage({
            language_id: newVal,
          }).then((result) => {
            this.subjects = result.subjects;
            this.entrances = result.entrances;
            this.hooks = result.hooks;
            this.personalized_hooks = result.personalized_hooks;
            this.presentations = result.presentations;
            this.politeness = result.politeness;
            this.exits = result.exits;
          });
        } else {
          model.campaign.language_id = oldVal;
        }
      });
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
    getLanguages() {
      lenguagesService.getAll().then((result) => {
        this.langs = result;
      });
    },
    createFinalMessage(newVal, schema) {
      console.log('createFinalMessage')
      this.hasModified();
      if (
        schema == "campaign.tpl_first_step.personalized_hook" ||
        schema == "campaign.tpl_first_step.service"
      ) {
        let msg = this.model.campaign.tpl_first_step.personalized_hook;
        if (this.model.campaign.tpl_first_step.service !== undefined) {
          if (
            this.model.campaign.tpl_first_step.service !== undefined &&
            this.model.campaign.tpl_first_step.service !== ""
          ) {
            this.model.campaign.my_proposition =
              this.model.campaign.tpl_first_step.service;
          }
        }
        this.model.campaign.tpl_first_step.final_hook = msg;
      }
      let sep = "\n\n";
      this.model.campaign.tpl_first_step.final_message =
        this.model.campaign.tpl_first_step.entrance +
        sep +
        this.model.campaign.tpl_first_step.hook +
        sep +
        this.model.campaign.tpl_first_step.final_hook +
        sep +
        this.model.campaign.tpl_first_step.presentation +
        sep +
        this.model.campaign.tpl_first_step.politeness +
        sep +
        this.model.campaign.tpl_first_step.exit;
    },
    goToStepCampaign(save) {
      if (save && save !== "back") {
        let tpl_first_step;
        tpl_first_step = this.model.campaign.tpl_first_step;
        this.generateDefaultsSteps({
          language_id: 1,
        });
        this.model.campaign.tpl_first_step = tpl_first_step;
        if (!this.templateFormIsValid()) {
          this.$swal({
            type: "error",
            title: this.$t("lang.label.error"),
            text: this.$t(
              "lang.label.checkdeerrormessagesintheformandtryagain"
            ),
            showConfirmButton: true,
          });
          return;
        }
        this.$emit("goToStepCampaign", save);
      } else {
        this.$refs.tplFirstStepForm.validate();
        if (this.$refs.tplFirstStepForm.errors.length < 8) {
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
    onNamespaceLoaded(CKEDITOR) {
      /*// Add external `placeholder` plugin which will be available for each
      // editor instance on the page.
      alert('addExternal')
      CKEDITOR.build();
      console.log( CKEDITOR.plugins.addExternal( "autoplaceholder", "C:/xampp/htdocs/oliverlist-frontend/node_modules/node_modules/autoplaceholder/autoplaceholder.js" ) );
      alert('extraPlugins')
      console.log( CKEDITOR.config.extraPlugins = "autoplaceholder" );
      alert('toolbar')
      console.log( CKEDITOR.config.toolbar = [[ "autoplaceholder" ]] );
      alert('plugins')
      console.log( CKEDITOR.plugins );
      alert('plugins')*/
    },
  }
};
</script>