<template>
  <!-- IntegrationsCustomFields.vue -->
  <div>
    <LoadingSpinner v-if="Object.keys(customFieldsOptions).length === 0" />
    <section class="account" v-else>
      <div class="contenedor">
        <div class="card mt-3">
          <div class="body p-4 email-account">
            <div class="col-sm-12 pb-3">
              <h5 class="bold mb-4">
                {{ $t("lang.integrations.title") }}
              </h5>
              <h6 class="bold mb-4">
                {{ $t("lang.integrations.configcustomfields") }}
              </h6>

              <div class="table-responsive table-transactions pt-4">
                <table class="table">
                  <thead class>
                    <tr>
                      <th>Entity type</th>
                      <th>Oliver's value</th>
                      <th>Pipedrive's field</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(option, index) in customFields" :key="index">
                      <td>{{ option.type }}</td>
                      <td>{{ option.label }}</td>
                      <td>
                        <select
                          class="form-control"
                          v-model="customFieldsValues[option.id]"
                          v-if="option.default_value == null"
                        >
                          <option
                            key="-1"
                            :value="getFullKey(option.type, null)"
                          >
                            {{ $t("lang.label.choose") }}
                          </option>
                          <option
                            v-for="(option2, index2) in customFieldsOptions[
                              option.type
                            ]"
                            :key="index2"
                            :value="getFullKey(option.type, option2.key)"
                            :disabled="
                              isOptionDisabled(
                                option.id,
                                getFullKey(option.type, option2.key)
                              )
                            "
                          >
                            {{ option2.name }}
                          </option>
                        </select>
                        <div>{{ option.default_value }}</div>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div class="text-right">
                  <button
                    class="btn btn-sm btn-primary mr-2"
                    @click="hideCustomFields"
                  >
                    {{ $t("lang.button.back") }}
                  </button>
                  <button
                    class="btn btn-sm btn-primary"
                    @click="setCustomFields"
                  >
                    {{ $t("lang.button.save") }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
import { mapState, mapActions } from "vuex";
import Header from "@/components/Header.vue";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import Tutorial from "@/components/Tutorial.vue";
import { crmService } from "@/_services";

export default {
  data() {
    return {
      customFields: {},
      customFieldsOptions: {},
      customFieldsValues: [],
    };
  },

  components: {
    Header,
    LoadingSpinner,
    Tutorial,
  },

  computed: {
    ...mapState({
      headerTab: (state) => state.header.tab,
    }),

    user() {
      return this.$store.state.authentication.user;
    },
  },

  created() {
    this.getCrmSettings();
  },

  methods: {
    getFullKey(type, key) {
      return type + "---" + key;
    },
    isOptionDisabled(index, key) {
      if (this.customFieldsValues[index] === key) {
        return false;
      } else {
        return this.customFieldsValues.includes(key);
      }
    },
    ...mapActions("header", {
      changeHeaderTab: "changeTab",
    }),
    getCrmSettings() {
      crmService
        .getCustomFields()
        .then((result) => {
          if (result) {
            this.customFields = result;
            this.customFields.forEach((item, key) => {
              this.customFieldsValues[item.id] = this.getFullKey(
                item.type,
                item.crm_custom_field_key
              );
            });
            crmService
              .getCustomFieldsValues()
              .then((result) => {
                if (result) {
                  this.customFieldsOptions = result;
                  this.customFieldsOptions[-1] = "";
                }
              })
              .then((error) => {});
          }
        })
        .then((error) => {});
    },
    setCustomFields() {
      crmService
        .setCustomFields(this.customFieldsValues)
        .then((result) => {
          if (result) {
            this.$swal({
              type: "success",
              text: this.$t("lang.label.great"),
              showCancelButton: false,
              confirmButtonColor: "#3085d6",
              confirmButtonText: this.$t("lang.button.ok"),
              cancelButtonColor: "#d33a2c",
            });
          }
        })
        .then((error) => {
          this.loading = false;
        });
    },
    hideCustomFields() {
      this.$emit("hideCustomFields");
    },
  },
};
</script>