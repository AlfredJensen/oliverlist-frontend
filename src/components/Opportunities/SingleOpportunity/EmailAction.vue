<template>
  <div
    class="tab-pane fade"
    id="pill-emails"
    role="tabpanel"
    aria-labelledby="pills-tab-notes"
  >
    <div class="wrapperCard">
      <div class="p-3">
        <!--REPLY CARD-->
        <div id="replyEm"></div>
        <!--//REPLY CARD-->
        <LoadingSpinner v-if="startLoadingSendEmail" />
        <div
          class="card notEffect replyEmail mt-3 p-3"
          v-if="
            !startLoadingSendEmail &&
            this.reply_email.email_selected.response_to
          "
        >
          <div class="row rowborder not-Margin">
            <div class="col-12">
              <div class="">
                <div class="input-group">
                  <div class="input-group-prepend">
                    <span
                      class="input-group-text"
                      id="inputGroup-sizing-default"
                      >To:</span
                    >
                  </div>
                  <input
                    id="input_response"
                    v-model="reply_email.to"
                    type="text"
                    class="form-control input-a"
                    @click="openList()"
                    aria-label="Sizing example input"
                    aria-describedby="inputGroup-sizing-default"
                  />
                </div>
                <div class="w-100 d-block" v-if="showList">
                  <div
                    class="dropdown-menu w-100 d-block"
                    v-if="this.businessContacts.length !== 0"
                  >
                    <button
                      v-for="(b, key) in this.businessContacts"
                      :key="key"
                      class="dropdown-item"
                      type="button"
                      @click="selectTo(b)"
                    >
                      {{ b.name }} ({{ b.email }})
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="row rowborder not-Margin mt-2 mb-1">
            <div class="col-12">
              <div class="">
                <div class="input-group">
                  <div class="input-group-prepend">
                    <span
                      class="input-group-text"
                      id="inputGroup-sizing-default"
                      >Subject:</span
                    >
                  </div>
                  <input
                    id="input_subject"
                    v-model="reply_email.subject"
                    type="text"
                    class="form-control input-b"
                    aria-label="Sizing example input"
                    aria-describedby="inputGroup-sizing-default"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="row not-Margin">
            <div class="col-12">
              <div class="row rowborder not-Margin mt-2 mb-1">
                <div class="col-12">
                  <div class="">
                    <div class="custom-file">
                      <input
                        type="file"
                        class="custom-file-input"
                        id="customFile"
                        @change="selectFile($event)"
                      />
                      <label class="custom-file-label" for="customFile"
                        >Choose file</label
                      >
                    </div>
                    <div v-if="file" class="mt-3">
                      Selected file: {{ file ? file.name : "" }}
                    </div>
                  </div>
                </div>
              </div>
              <div class="">
                <div class="mt-4 mb-4">
                  <ckeditor
                    :editor="editorInitial"
                    v-model="editorData"
                    :config="editorConfig"
                  ></ckeditor>
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
                  <button
                    @click="cleanFields()"
                    class="btn border-success rounded"
                  >
                    <i class="icon-eraser mr-2"></i>
                    <span class="font-weight-bold">{{
                      $t("lang.label.clean")
                    }}</span>
                  </button>
                  
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
    </div>
  </div>
</template>
<script>
import {
  linksService,
  emailsService,
  smtpMailboxesService,
  usersService,
  campaignsService,
} from "@/_services";
import { mapActions } from "vuex";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import CKEditor from "@ckeditor/ckeditor5-vue";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

export default {
  data() {
    return {
      errors: [],
      reply_email: {
        to: "",
        subject: "",
        message: "",
        email_selected: {
          id: null,
          link_id: this.linkId,
          response_to: null,
        },
      },
      file: null,
      startLoadingSendEmail: false,
      showBtn: Boolean,
      showList: false,
      editorInitial: ClassicEditor,
      editorData: "",
      editorConfig: {
        /*plugins: [ Essentials, Heading, Bold, Italic, Link, AutoPlaceholder ],*/
        toolbar: ["heading", "|", "bold", "italic", "|", "link"],
      }
    };
  },

  props: {
    linkId: String,
    campaignId: String,
    businessContacts: Array,
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

  components: {
    LoadingSpinner,
    ckeditor: CKEditor.component,
  },

  computed: {
    user() {
      return this.$store.state.authentication.user;
    },
  },

  created() {
    this.startLoadingSendEmail = true;
    this.getEmail();
  },

  methods: {
    ...mapActions("opportunities", {
      reloadOpportunity: "reloadOpportunity",
    }),
    getEmail() {
      //Look for the email associated with the opportunity campaign
      campaignsService.getEmailCampaignById(this.campaignId).then((result) => {
        this.reply_email.email_selected.response_to = result.email;
        this.reply_email.label_from = result.label_from;
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
    validEmail: function (email) {
      return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,9})+$/.test(email);
    },
    selectTo: function (b) {
      this.reply_email.to = b.name + " (" + b.email + " )";
      this.reply_email.business_contact_id = b.id;
      this.showList = false;
    },
    selectFile(e) {
      var files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;
      this.file = files[0];
    },
    openList() {
      this.showList = true;
    },
    checkForm() {
      this.errors = [];
      if (!this.reply_email.to) {
        this.errors.push("Email is required.");
      }
      if (!this.reply_email.message) {
        this.errors.push("The message field can not be blank.");
        return false;
      }
      if (this.reply_email.message.length < 3) {
        this.errors.push("Enter at least three letters in the message field.");
        return false;
      }

      if (!this.errors.length) {
        return true;
      }
    },

    cleanFields() {
      this.reply_email.to = "";
      this.reply_email.message = "";
      this.reply_email.subject = "";
      this.reply_email.label_from = "";
      this.editorData = "";
      this.file = null;
    },
    sendEmail() {
      if (this.checkForm()) {
        this.$swal({
          type: "warning",
          title: this.$t("lang.label.sendemail"),
          text: "",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33a2c",
          confirmButtonText: this.$t("lang.button.send"),
        }).then((result) => {
          if (result.value) {
            this.startLoadingSendEmail = true;
            if (
              !this.reply_email.to.includes("*") &&
              !this.reply_email.to.includes("(")
            ) {
              delete this.reply_email["business_contact_id"];
              if (!this.validEmail(this.reply_email.to)) {
                this.errors.push("The email field is invalid.");
                this.startLoadingSendEmail = false;
                return false;
              }
            }
            emailsService
              .replyEmail(this.reply_email, this.file)
              .then((res) => {
                let date_ob = new Date();
                // adjust 0 before single digit date
                let date = ("0" + date_ob.getDate()).slice(-2);
                // current month
                let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
                // current year
                let year = date_ob.getFullYear();

                var newEmail = {
                  id: "newEmail",
                  name: this.reply_email.label_from,
                  link: this.reply_email.subject,
                  comment: this.reply_email.message,
                  type: "emailsentopportunity",
                  response_from: this.reply_email.to,
                  creation_date: year + "-" + month + "-" + date,
                };
                this.$emit("addEmail", newEmail);

                if (this.$route.name === "opportunities") {
                  this.startLoadingSendEmail = false;
                  // this.reloadOpportunity({ headerTab: "NOTHING" });
                } else {
                  this.startLoadingSendEmail = false;
                  this.cleanFields();
                }
            });
          }
        });
      }
    },
  },
};
</script>