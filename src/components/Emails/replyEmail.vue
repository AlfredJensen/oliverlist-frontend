<template>
  <!--REPLY CARD-->
  <div id="replyEm">
    <LoadingSpinner v-if="startLoadingSendEmail" />
    <h6 v-if="emailSent" class="text-success align-center py-3">
      <i class="icon-checkmark"></i>
      {{ this.$t("lang.label.emailwassentsuccessfully") }}
    </h6>
    <div
      class="card notEffect replyEmail mt-3 p-3"
      v-if="!startLoadingSendEmail && !emailSent"
    >
      <div class="row rowborder not-Margin">
        <div class="col-12">
          <div class="d-flex justify-content-end">
            <div class="mr-auto align-self-center" v-if="showBtn === true">
              <button class="btn btn-secondary" @click="close()">
                <i class="icon-close"></i>
                Close
              </button>
            </div>
            <div
              class="btn-group my-2"
              role="group"
              aria-label="Button group with nested dropdown"
            >
              <div class="btn-group" role="group">
                <button
                  @click="response_email()"
                  id="btnGroupDrop1"
                  type="button"
                  class="btn btn-secondary themed-button"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  <i class="icon-reply-all mr-2"></i>
                  {{ $t("lang.button.replythisemail") }}
                </button>
              </div>
            </div>
          </div>
        </div>
    
      </div>

      <div class="row rowborder not-Margin mt-2 mb-1">
        <div class="col-12">
          <div class="">
            <vue-form-generator
              ref="emailForm"
              :schema="schemaEmail"
              :model="reply_email"
              :options="formOptions"
            ></vue-form-generator>
          </div>
        </div>
      </div>


      <div class="row not-Margin">
        <div class="col-12">
          <div class="">
            <div class="mt-4 mb-4">
              <div class="field-ckeditor-wrappar">
                <ValidationProvider
                  ref="editorMessageV"
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
                        v-model="editorData"
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
        </div>
      </div>
      <div class="row not-Margin row-btn-footer">
        <div class="col-12">
          <div class="alert alert-danger w-100 mt-2" v-if="errors.length">
            <ul>
              <li v-for="(error, key) in errors" :key="key">{{ error }}</li>
            </ul>
          </div>
          <div class="d-flex justify-content-between">
            <div class="content-btn-left btn-group" role="group">
              <button @click="cleanFields()" class="btn border-success rounded">
                <i class="icon-eraser mr-2"></i>
                <span class="font-weight-bold">{{
                  $t("lang.label.clean")
                }}</span>
              </button>
              <button
                class="
                  btn btn-primary
                  themed-button
                  btn-sm
                  dropdown-toggle
                  ml-2
                  rounded
                "
                type="button"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
                v-if="templateList.length > 0"
              >
                <i class="icon-write mr-2"></i>
                {{ $t("lang.emailsettings.templates") }}
              </button>
              <div class="dropdown-menu">
                <a
                  v-for="(template, key) in this.templateList"
                  :key="key"
                  v-on:click="addTemplete(template.id)"
                  class="dropdown-item c-pointer hover-bg token"
                >
                  {{ template.title }}
                </a>
              </div>
            </div>
            <div class="content-btn-right btn-group" role="group">
              <button
                @click="sendEmail()"
                class="btn btn btn-sm btn-success rounded"
              >
                <i class="icon-paper-plane mr-2"></i>
                <span class="font-weight-bold">{{
                  $t("lang.label.send")
                }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!--//REPLY CARD-->
</template>
<script>
import { mapActions } from "vuex";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import { emailsService } from "@/_services";
import CKEditor from "@ckeditor/ckeditor5-vue";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import VueFormGenerator from "vue-form-generator";
import "vue-form-generator/dist/vfg.css";

export default {
  data() {
    return {
      errors: [],
      emailSent: false,
      reply_email: {
        response_id: "",
        to: "",
        cc: "",
        subject: "",
        message: "",
        email_selected: {},
      },
      startLoadingSendEmail: false,
      showBtn: Boolean,
      editorInitial: ClassicEditor,
      editorData: "",
      editorConfig: {
        /*plugins: [ Essentials, Heading, Bold, Italic, Link, AutoPlaceholder ],*/
        toolbar: ["heading", "|", "bold", "italic", "|", "link"],
      },
      templateList: [],
      schemaEmail: {
        fields: [
          {
            type: "input",
            inputType: "text",
            label: "To",
            model: "to",
            required: true,
            min: 5,
            max: 255,
            validator: [
              VueFormGenerator.validators.string.locale({
                fieldIsRequired: this.$t("lang.label.required"),
              }),
              "emailValidator",
            ],
            styleClasses: "field-inline",
          },
          {
            type: "input",
            inputType: "text",
            label: "CC",
            model: "cc",
            required: false,
            min: 5,
            max: 255,
            validator: ["emailListValidator"],
            styleClasses: "field-inline",
          },
          {
            type: "input",
            inputType: "text",
            label: "Subject",
            model: "subject",
            required: true,
            min: 5,
            max: 1000,
            validator: [
              VueFormGenerator.validators.string.locale({
                fieldIsRequired: this.$t("lang.label.required"),
              }),
            ],
            styleClasses: "field-inline",
          },
        ],
      },
      formOptions: {
        validateAfterLoad: false,
        validateAfterChanged: true,
      },
    };
  },

  props: {
    selected: {},
    closebtn: Boolean,
  },

  components: {
    LoadingSpinner,
    ckeditor: CKEditor.component,
  },

  watch: {
    // "reply_email.subject"() {
    //   this.reply_email.subject = this.$sanitize(this.reply_email.subject);
    // },
    // "reply_email.message"() {
    //   this.reply_email.message = this.$sanitize(this.reply_email.message);
    // },
    editorData: function () {
      this.reply_email.message = this.$sanitize(this.editorData);
    },
  },

  created() {
    this.reply_email.email_selected = this.selected;
    this.showBtn = this.closebtn;
    this.response_email();
    this.getTemplateList();
  },

  mounted() {
    this.isValidEmailForm();
  },

  methods: {
    close(event) {
      this.$emit("close");
    },
    ...mapActions("opportunities", {
      reloadOpportunity: "reloadOpportunity",
    }),
    isValidEmailForm() {
      this.$refs.emailForm.validate();
      this.$refs.editorMessageV.validate();
      return (
        this.$refs.emailForm.errors.length == 0 &&
        this.$refs.editorMessageV.errors.length == 0
      );
    },
    response_email() {
      this.reply_email.response_id = this.selected.response_id;
      this.reply_email.to = this.selected.response_from;
      this.reply_email.cc = this.selected.response_cc;
      this.reply_email.subject = "RE: " + this.selected.response_subject;
    },
    cleanFields() {
      this.reply_email.to = "";
      this.reply_email.message = "";
      this.reply_email.subject = "";
      this.reply_email.cc = "";
      this.editorData = "";
    },
    getTemplateList() {
      this.startLoadingSendEmail = true
      emailsService
        .getAllTemplates({ link_id: this.linkId })
        .then((result) => {
          this.templateList = result;
        }).finally(() => {
          this.startLoadingSendEmail = false;
        });
    },
    addTemplete(id) {
      this.getTemplate(id);
    },
    getTemplate(id) {
      this.loadingCurrent = true;
      emailsService
        .getTemplate(id)
        .then((result) => {
          this.editorData = result.message;
        })
        .catch((err) => {
          this.$swal({
            type: "warning",
            title: this.$t("lang.label.error"),
            text: this.$t("lang.general.error"),
            showConfirmButton: true,
          });
        })
        .finally(() => {
          this.loadingCurrent = false;
        });
    },
    sendEmail() {
      if (this.isValidEmailForm()) {
        this.emailSent = true;
        emailsService.replyEmail(this.reply_email).then((result) => {
          this.emailSent = false;
        });
      }
    },
  },
};
</script>
<style>
.field-inline {
  display: flex;
  flex-wrap: wrap;
}
.field-inline .field-wrap {
  flex: 1 0 auto;
}
.field-inline > label {
  margin: 0;
  background: grey;
  background-color: #e9ecef;
  padding-right: 10px;
  padding-top: 5px;
  border-radius: 3px 0px 0px 3px;
}
.field-inline label > :first-child {
  padding: 0 10px;
}
.field-inline .errors {
  flex-basis: 100%;
}
</style>