<template>
  <section class="customfields">
    <div class="row mt-4 ml-5">
      <div class="col-md-4 card p-4">
      <h6>{{ $t('lang.mycontacts.addcustomfields') }}</h6>

        <Tutorial
          id="addcustomfields"
          :linkText="$t('lang.label.howitworks')"
          linkClass="small ml-2 mb-3"
          :videoUrl="'https://www.youtube.com/embed/' + $t('lang.videos.customcolumns')"
        />
      <form @submit.prevent="onSubmit">
        <vue-form-generator
          ref="stepForm"
          :schema="schemaGeneral"
          :model="modelCustomFields"
          :options="formOptions"
        ></vue-form-generator>

        <button class="btn btn-sm btn-primary">{{ $t('lang.button.save') }}</button>
      </form>
      </div>
      <div class="col-md-8 p-4">
        <h6>{{ $t('lang.mycontacts.mycustomcolumns') }}</h6>
        <div class="card">
          <table class="table table-hover">
            <thead>
              <tr>
                <th>Type</th>
                <th>{{ $t('lang.mycontacts.label') }}</th>
                <th>{{ $t('lang.mycontacts.enabled') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(field, key) in fields">
                <td>{{ field.type }}</td>
                <td>{{ field.label }}</td>
                <td><input type="checkbox" checked disabled></td>
              </tr>
            </tbody>
          </table>
        </div>
        </div>
      </div>
    </div>
  </section>
</template>


<script>
import { businessContactsService } from "@/_services";
import Tutorial from "@/components/Tutorial.vue";

import VueFormGenerator from "vue-form-generator";
import "vue-form-generator/dist/vfg.css";

export default {
  created() {
    this.getMyCustomFields();
  },
  data() {
    return {
      fields: {},
      modelCustomFields: {},
      formOptions: {
        validateAfterLoad: false,
        validateAfterChanged: true,
      },
      schemaGeneral: {
        fields: [
          {
            type: "select",
            label: "Type",
            model: "type",
            featured: true,
            required: true,
            multiSelect: false,
            values: [
              { id: "text", name: "Text" },
              { id: "number", name: "Number" },
              { id: "date", name: "Date" },
            ],
            styleClasses: "col-md-12",
          },
          {
            type: "input",
            inputType: "text",
            label: this.$t("lang.mycontacts.label"),
            model: "label",
            readonly: false,
            featured: true,
            required: true,
            styleClasses: "col-sm-12",
          },
        ],
      },
    };
  },

  components: {
    Tutorial,
  },

  watch: {
    "modelCustomFields.label"() {
      this.modelCustomFields.label = this.$sanitize(
        this.modelCustomFields.label
      );
    },
  },

  methods: {
    getMyCustomFields() {
      businessContactsService.getCustomFields().then((response) => {
        this.fields = response;
      });
    },

    onSubmit($event) {
      this.$swal({
        type: "warning",
        title: this.$t("lang.label.areyousure"),
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33a2c",
        confirmButtonText: this.$t("lang.button.yes"),
        cancelButtonText: this.$t("lang.button.cancel"),
      }).then((result) => {
        if (result.value) {
          businessContactsService
            .insertCustomField(
              this.modelCustomFields.label,
              this.modelCustomFields.type
            )
            .then((response) => {
              this.getMyCustomFields();
            });
        }
      });
    },
  },
};
</script>
