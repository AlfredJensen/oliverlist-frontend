<template>
  <div>
    <LoadingSpinner v-if="loading" />

    <div class="card mt-3" v-else>
      <div class="body p-4 email-account">
        <div class="mt-3">
          <div class="row">
            <div class="col-md-4">
              <table class="table table-striped">
                <thead class="thead-dark">
                  <tr>
                    <th scope="col">
                      {{ $t("lang.label.template") }}

                      <button
                        class="float-right btn btn-primary"
                        @click="newTemplate"
                        type="submit"
                      >
                        <i class="icon-plus1"></i>
                      </button>
                    </th>
                  </tr>
                </thead>
                <tbody v-if="templateList">
                  <tr v-for="(user, key) in templateList" :key="key">
                    <td
                      @click="getTemplate(user.id)"
                      :class="{
                        'bg-primary text-white': currentTemplate.id == user.id,
                      }"
                      class="cursor-pointer"
                    >
                      {{ user.title }}
                    </td>
                  </tr>
                </tbody>
                <tbody v-else>
                  <tr class="no-results-row">
                    <td>
                      <span class="font-weight-bold ft-1-5 text-center"
                        >There are no data</span
                      >
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="col-md-8">
              <LoadingSpinner v-if="loadingCurrent" />
              <div v-else>
                <vue-form-generator
                  ref="templateForm"
                  :schema="schema"
                  :model="currentTemplate"
                  :options="formOptions"
                ></vue-form-generator>

                <div class="field-ckeditor-wrappar">
                  <ValidationProvider
                    ref="editorDataV"
                    :rules="{
                      required: true,
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
              <button
                class="float-right btn btn-primary mt-3"
                @click="updateTemplate"
                type="submit"
              >
                <i class="icon-plus1"></i> {{ $t("lang.button.save") }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from "vuex";
import { statusPointMixin } from "@/_mixins/";
import { emailsService } from "@/_services";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import VueFormGenerator from "vue-form-generator";
import "vue-form-generator/dist/vfg.css";
import Tutorial from "@/components/Tutorial.vue";
import CKEditor from "@ckeditor/ckeditor5-vue";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

export default {
  data() {
    return {
      loading: true,
      loadingCurrent: false,
      result_invitation: "",
      templateList: [],
      currentTemplate: {},
      request: false,
      dataUser: {},
      editorInitial: ClassicEditor,
      editorData: "",
      editorSubject: "",
      editorMessage: "",
      editorConfig: {
        /*plugins: [ Essentials, Heading, Bold, Italic, Link, AutoPlaceholder ],*/
        toolbar: ["heading", "|", "bold", "italic", "|", "link"],
      },
      schema: {
        fields: [
          {
            type: "input",
            inputType: "text",
            model: "title",
            featured: true,
            required: true,
            placeholder: this.$t("lang.label.title"),
            min: 5,
            max: 50,
            validator: VueFormGenerator.validators.string.locale({
              fieldIsRequired: this.$t("lang.label.required"),
              textTooSmall: this.$t("lang.validation.texttosmall", {
                min: "{1}",
              }),
            }),
            styleClasses: "col-sm-12",
          },
        ],
      },
      formOptions: {
        validateAfterLoad: true,
        validateAfterChanged: true,
      },
    };
  },

  mixins: [statusPointMixin],

  components: {
    LoadingSpinner,
    "vue-form-generator": VueFormGenerator.component,
    Tutorial,
    ckeditor: CKEditor.component,
  },

  watch: {
    currentTemplate: function () {
      if (this.currentTemplate !== undefined) {
        setTimeout(() => {
          this.editorData = this.currentTemplate.message;
        }, 5);
      }
    },
    editorData: function () {
      this.currentTemplate.message = this.$sanitize(this.editorData);
    },
    templateList: function (currentValue, beforeValue) {
      if (
        Object.entries(beforeValue).length == 0 &&
        Object.entries(currentValue).length > 0
      ) {
        this.getTemplate(currentValue[0].id);
      }
    },
  },

  computed: {
    ...mapState({
      user: (state) => state.authentication.user,
    }),
  },

  created() {
    this.getData();
  },

  methods: {
    ...mapActions("header", {
      changeHeaderTab: "changeTab",
    }),
    getData() {
      emailsService
        .getAllTemplates()
        .then((result) => {
          this.templateList = result;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    getTemplate(id) {
      this.loadingCurrent = true;
      emailsService
        .getTemplate(id)
        .then((result) => {
          this.currentTemplate = result;
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
    updateTemplate() {
      if (this.templateFormIsValid()) {
        emailsService
          .updateTemplate(this.currentTemplate)
          .then((result) => {
            if (this.currentTemplate.id == undefined) {
              this.getTemplate(result);
            }
            this.getData();
            this.$swal({
              type: "success",
              title: this.$t("lang.label.great"),
              showConfirmButton: false,
              timer: 1500,
            });
          })
          .catch((err) => {
            this.$swal({
              type: "warning",
              title: this.$t("lang.label.error"),
              text: this.$t("lang.general.error"),
              showConfirmButton: true,
            });
          });
      }
    },
    newTemplate() {
      this.currentTemplate = {};
    },
    templateFormIsValid() {
      this.$refs.templateForm.validate();
      this.$refs.editorDataV.validate();
      return (
        this.$refs.templateForm.errors.length == 0 &&
        this.$refs.editorDataV.errors.length == 0
      );
    },
  },
};
</script>

<style scoped>
.datepicker {
  transform: translate(0, 3.1em);
}
</style>