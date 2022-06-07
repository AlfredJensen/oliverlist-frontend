<template>
  <section class="companies">
    <ol class="breadcrumb" v-if="currentUser.role_id != 1">
      <li class="breadcrumb-item active">{{ $t("lang.label.clientteam") }}</li>
    </ol>

    <main class="contenedor">
      <LoadingSpinner v-if="loading" />
      <div class="row" v-if="!loading">
        <div class="col-sm-12">
          <div class="card mt-3 p-4">
            <section class="">
              <div class="row float-right">
                <div v-if="!hasDeclinedPayments">
                  <button
                    class="float-right btn btn-primary"
                    @click="addUserTeam"
                    type="submit"
                  >
                    <i class="icon-plus1"></i> {{ $t("lang.user.new") }}
                  </button>
                </div>
              </div>
            </section>
            <div class="mt-3">
              <table class="table table-striped">
                <thead class="thead-dark">
                  <tr>
                    <th scope="col">{{ $t("lang.column.name") }}</th>
                    <th scope="col">{{ $t("lang.column.email") }}</th>
                    <th scope="col">Email Sync</th>
                    <template v-if="currentUser.role_id == 1">
                      <th scope="col">Group</th>
                      <th scope="col">Calendly</th>
                      <th scope="col">Calendly Link</th>
                      <th scope="col">Landing Link</th>
                      <th scope="col">Warm up date</th>
                    </template>
                    <th scope="col">{{ $t("lang.column.status") }}</th>
                  </tr>
                </thead>
                <tbody v-if="dataUsers">
                  <tr v-for="(user, key) in dataUsers" :key="key">
                    <td>
                      {{ user.name }} {{ user.lastname }}
                      <br />
                      <small>{{ user.role_name }}</small>
                    </td>
                    <td>
                      <span
                        v-if="currentUser.role_id == 1"
                        class="text-primary"
                      >
                        <a :href="'/users/' + user.id" target="_blank">
                          {{ user.email }}
                        </a>
                      </span>
                      <span v-else>
                        {{ user.email }}
                      </span>
                    </td>
                    <td>
                      <span v-if="user.nylas_email_sync" class="mr-2">{{
                        user.nylas_email_sync
                      }}</span>
                      <i
                        v-else-if="showWarning(user.role_id)"
                        class="icon-warning text-warning"
                      ></i>
                      <div
                        v-if="
                          user.nylas_email_sync != '' &&
                          user.nylas_email_sync_status == 1
                        "
                        class="badge btn-success"
                      >
                        Active
                      </div>
                      <div
                        v-if="
                          user.nylas_email_sync != '' &&
                          user.nylas_email_sync_status == 0
                        "
                        class="badge btn-danger"
                      >
                        Disconnected
                      </div>
                      {{ user.smtp_email_sync }}
                      <div
                        v-if="
                          user.smtp_email_sync != '' &&
                          user.smtp_email_sync_status == 1
                        "
                        class="badge btn-success"
                      >
                        Active
                      </div>
                      <div
                        v-if="
                          user.smtp_email_sync != '' &&
                          user.smtp_email_sync_status == 0
                        "
                        class="badge btn-danger"
                      >
                        Disconnected
                      </div>
                    </td>
                    <template v-if="currentUser.role_id == 1">
                      <td>
                        <div
                          :inner-html.prop="user.team_name | breakLines"
                          v-if="user.team_name"
                        >
                        </div>
                        <i v-else
                          class="icon-warning text-warning"
                        ></i>
                      </td>
                      <td>
                        <div v-if="showWarning(user.role_id)">
                          <small v-if="user.calendly == 0" class="text-danger">
                            <i class="icon-calendar mr-1"></i>
                          </small>
                          <small v-else class="text-success">
                            {{ user.calendly }}
                          </small>
                        </div>
                      </td>
                      <td>
                        <a
                          v-if="user.calendar_link"
                          :href="user.calendly"
                          target="_blank"
                          class="text-primary"
                          >{{ user.calendar_link }}</a
                        >
                        <i
                          v-else-if="showWarning(user.role_id)"
                          class="icon-warning text-warning"
                        ></i>
                      </td>
                      <td>
                        <a
                          v-if="user.calendar_link"
                          :href="user.landing_link"
                          target="_blank"
                          class="text-primary"
                          >{{ user.landing_link }}</a
                        >
                        <i
                          v-else-if="showWarning(user.role_id)"
                          class="icon-warning text-warning"
                        ></i>
                      </td>
                      <td>
                        <div v-if="user.warm_update">
                          {{ user.warm_update }} ({{
                            warmupDays(user.warm_update)
                          }})
                        </div>
                        <i
                          v-else-if="showWarning(user.role_id)"
                          class="icon-warning text-warning"
                        ></i>
                      </td>
                    </template>
                    <td>{{ user.user_status_name }}</td>
                  </tr>
                </tbody>
                <tbody v-else>
                  <tr class="no-results-row">
                    <td colspan="4">
                      <span class="font-weight-bold ft-1-5 text-center"
                        >There are no data</span
                      >
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <modal
        name="example"
        :clickToClose="false"
        :resizable="true"
        height="auto"
        width="80%"
      >
        <div class="p-4">
          <label>
            <h4>{{ $t("lang.user.add") }}</h4>
          </label>
          <div>
            <form v-on:submit.prevent class="px-4 py-3">
              <vue-form-generator
                ref="teamUserForm"
                :schema="schema"
                :model="this.dataUser"
                :options="formOptions"
              ></vue-form-generator>
            </form>
            <div class="mt-4" v-if="alert.message">
              <AlertError :msgError="alert.message" />
            </div>
          </div>
        </div>
        <div class="px-4 pb-4 text-center">
          <button
            class="
              btn
              large
              cursor-pointer
              font-weight-bolder
              btn-sm btn-success
              mx-1
              px-4
            "
            :disabled="request == true"
            @click="addNewUser"
          >
            {{ $t("lang.button.send") }}
          </button>

          <button
            class="
              btn
              large
              cursor-pointer
              font-weight-bolder
              btn-sm btn-outline-dark
              mx-1
              px-4
            "
            @click="cerrar"
          >
            {{ $t("lang.button.back") }}
          </button>
        </div>
      </modal>
    </main>
  </section>
</template>
<script>
import { mapState, mapActions } from "vuex";
import { statusPointMixin } from "@/_mixins/";
import { clientsService } from "@/_services";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import AlertError from "@/components/AlertError.vue";
import VueFormGenerator from "vue-form-generator";
import "vue-form-generator/dist/vfg.css";
import Tutorial from "@/components/Tutorial.vue";

export default {
  props: {
    userId: {
      type: String,
      default: "0",
    },
  },
  data() {
    return {
      result_invitation: "",
      dataUsers: [],
      request: false,
      dataUser: {},
      schema: {
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
            inputType: "hidden",
            model: "team_user_id",
            readonly: true,
            featured: false,
            disabled: true,
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
            min: 5,
            max: 255,
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
            label: this.$t("lang.label.title"),
            model: "title",
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
            styleClasses: "col-md-6",
          },
          {
            type: "input",
            inputType: "text",
            label: this.$t("lang.label.firstname"),
            model: "name",
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
            styleClasses: "col-md-6",
          },
          {
            type: "input",
            inputType: "text",
            label: this.$t("lang.label.lastname"),
            model: "lastname",
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
            styleClasses: "col-md-6",
          },
          {
            type: "input",
            inputType: "password",
            label: this.$t("lang.label.password"),
            model: "password",
            featured: true,
            readonly: false,
            required: true,
            disabled: false,
            validator: [
              VueFormGenerator.validators.string.locale({
                fieldIsRequired: this.$t("lang.label.required"),
              }),
              "validatePassword",
            ],
            styleClasses: "col-md-6",
          },
          {
            type: "input",
            inputType: "password",
            label: this.$t("lang.label.confirmpassword"),
            model: "confirm_password",
            featured: true,
            readonly: false,
            required: true,
            disabled: false,
            validator: [
              VueFormGenerator.validators.string.locale({
                fieldIsRequired: this.$t("lang.label.required"),
              }),
              "confirmPasswordValidator",
            ],
            styleClasses: "col-md-6",
          },
          {
            type: "select",
            label: this.$t("lang.label.role"),
            model: "role_id",
            readonly: false,
            featured: true,
            required: true,
            validator: VueFormGenerator.validators.required,
            selectOptions: {},
            values: function () {
              return [
                { id: "2", name: "Admin" },
                { id: "3", name: "Non-admin" },
                { id: "4", name: "Billing" },
              ];
            },
            validator: VueFormGenerator.validators.string.locale({
              fieldIsRequired: this.$t("lang.label.required"),
            }),
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

  mixins: [statusPointMixin],

  components: {
    LoadingSpinner,
    "vue-form-generator": VueFormGenerator.component,
    AlertError,
    Tutorial,
  },

  watch: {},

  computed: {
    ...mapState({
      loading: (state) => state.companies.loading,
      alert: (state) => state.alert,
      currentUser: (state) => state.authentication.user,
      plans: (state) => state.plans.all,
      hasDeclinedPayments: (state) =>
        state.authentication.toastNotificationData.hasDeclinedPayments.length >
        0,
    }),
  },

  created() {
    this.getData();
  },

  methods: {
    ...mapActions("users", {
      getAllUserTeam: "getAllUserTeam",
    }),

    ...mapActions("header", {
      changeHeaderTab: "changeTab",
    }),
    getData() {
      clientsService.getUserTeam(this.userId).then((result) => {
        this.dataUsers = result;
      });
    },
    addUserTeam() {
      this.$store.dispatch("alert/clear");
      this.dataUser = { team_user_id: this.userId };
      this.$modal.show("example");
    },

    cerrar() {
      this.$modal.hide("example");
      this.request = false;
    },

    addNewUser() {
      this.$refs.teamUserForm.validate();
      if (this.$refs.teamUserForm.errors.length > 0) {
        return;
      }

      const price = this.currentUser.plan_price;
      const price1 = (
        this.currentUser.plan_price * this.currentUser.recurring_payment_period
      ).toFixed(2);

      let price2;

      const rightNow = new Date();

      const nextPaymentDate = new Date(this.currentUser.next_payment_date); //2021-11-17 15:25:09

      let timeLeft = nextPaymentDate.getTime() - rightNow.getTime();

      timeLeft = Math.round(timeLeft / (1000 * 60 * 60 * 24));

      if (this.currentUser.recurring_payment_period == 12) {
        timeLeft = Math.ceil(timeLeft / 30);
        price2 = (price * timeLeft).toFixed(2);
      } else {
        price2 = ((price / 30) * timeLeft).toFixed(2);
      }

      this.cerrar();
      this.$swal({
        type: "warning",
        title: this.$t("lang.user.messagepayment"),
        html: this.$t("lang.user.messagepaymentinfo", {
          price: price1 + " €",
          price2: price2 + " €",
        }),
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        confirmButtonText: this.$t("lang.button.yes"),
        cancelButtonColor: "#d33a2c",
        cancelButtonText: this.$t("lang.button.cancel"),
      }).then((result) => {
        if (result.value) {
          this.request = true;
          const { dataUser } = this;
          const { dispatch } = this.$store;
          dispatch("authentication/addNewUser", { dataUser }).then(
            (reponse) => {
              this.getData();
              this.cerrar();
              this.request = false;
              this.$swal.fire("", this.$t("lang.user.usercreated"), "success");
            },
            (error) => {
              this.request = false;
              this.$swal.fire("", this.$t("lang.user.usernotcreated"), "error");
            }
          );
        }
      });
    },

    showWarning(role_id) {
      return role_id == 2;
    },
    warmupDays(date) {
      var date1 = new Date(date);
      var date2 = new Date();

      // To calculate the time difference of two dates
      var days = parseInt(
        (date2.getTime() - date1.getTime()) / (1000 * 3600 * 24)
      );
      return days;
    },
  },
};
</script>

<style scoped>
.datepicker {
  transform: translate(0, 3.1em);
}
</style>