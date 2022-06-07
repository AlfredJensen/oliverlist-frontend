<template>
  <div>
    <LoadingSpinner v-if="loadingOptionsList || loading" />
    <div v-if="!loadingOptionsList && !loading">
      <main>
        <div class="row mt-4">
          <div class="col-md-12">
            <h4 class="mt-4">Billing Info</h4>
            <h5 class="mt-4">
              {{ $t("lang.label.paymentprofile") }}
            </h5>
            <div class="mt-4">
              <div
                class="card collegues p-4"
                v-if="selected.paymentProfile !== null"
              >
                <div>
                  <b>{{ $t("lang.label.name") }}</b
                  >:
                  {{ selected.paymentProfile.name }}
                </div>

                <div>
                  <b>{{ $t("lang.label.legalrepresentative") }}</b
                  >:
                  {{ selected.paymentProfile.legal_representative }}
                </div>
                <div>
                  <b>{{ $t("lang.label.address") }}</b
                  >:
                  {{ selected.paymentProfile.address }}
                </div>
                <div>
                  <b>{{ $t("lang.label.country") }}</b
                  >:
                  {{ getCountry() }}
                </div>
                <div>
                  <b>{{ $t("lang.label.email") }}</b
                  >:
                  {{ selected.paymentProfile.contact_email }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row mt-4">
          <div class="col-md-12">
            <h5>
              {{ $t("lang.label.paymentmethods") }}
            </h5>
            <div class="collegues mt-4">
              <div class="">
                <div class="row">
                  <div
                    v-for="(paymentmethod, key) in selected.paymentmethod"
                    :key="key"
                    class="col-sm-6 col-md-3 p-2"
                  >
                    <div class="card p-4">
                      <div>
                        <div class="d-flex align-items-center">
                          <div class="collegues-img mr-3">
                            <i
                              class="icon-credit-card mr-3"
                              style="font-size: 40px"
                            ></i>
                          </div>
                          <div>
                            <strong>{{
                              paymentmethod.descriptionPayment
                            }}</strong>
                            <span class="badge badge-info ml-2">{{
                              paymentmethod.valid
                            }}</span>
                            <div>
                              <small>{{ paymentmethod.name }}</small>
                            </div>
                            <div>
                              <small>{{ paymentmethod.isDefault }}</small>
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
        </div>

        <div class="row mt-4">
          <div class="col-md-12">
            <h5>
              {{ $t("lang.label.invoices") }}
            </h5>
            <div class="collegues mt-4">
              <div class="">
                <div class="row">
                  <div
                    v-for="(invoice, key) in selected.invoice"
                    :key="key"
                    class="col-sm-6 col-md-3 p-2"
                  >
                    <div class="card p-4">
                      <div>
                        <div class="d-flex align-items-center">
                          <div>
                            <span class="badge badge-success mr-2">{{
                              invoice.payment_type_name
                            }}</span>
                            <span
                              >{{ invoice.date }} - {{ invoice.amount }} €</span
                            >
                            <span class="badge badge-success ml-2">{{
                              invoice.status
                            }}</span>
                            <i
                              @click="downloadPDF(invoice)"
                              class="icon-arrow-down ml-3 cursor-pointer"
                            ></i>
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

        <div class="row mt-4">
          <div class="col-md-4">
            <h5>
              {{ $t("lang.label.expenses") }}
            </h5>
            <div class="card mt-4">
              <div class="pt-4" v-if="!loadingStats">
                <UsageStats
                  :statsClient="statsClient"
                  :statsType="statsType1"
                  :statsDate="statsDate"
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from "vuex";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import UsageStats from "@/components/Usages/UsageStats.vue";
import {
  statusBadgeMixin,
  statusPointMixin,
  pdfInvoiceMixin,
} from "@/_mixins/";

export default {
  props: {
    userId: {
      type: String,
      default: "0",
    },
  },
  mixins: [pdfInvoiceMixin],
  components: {
    LoadingSpinner,
    UsageStats,
  },
  data() {
    return {
      loadingStats: true,
      statsClient: {},
      statsDate: [],
      statsType: [
        "charged",
        "uncharged",
        "declined",
        "planned",
        "absent",
        "canceled",
      ],
      statsType1: ["charged", "uncharged", "declined", "planned"],
      statsType2: ["absent", "canceled"],
    };
  },
  computed: {
    ...mapState({
      loading: (state) => state.users.loading,
      selected: (state) => state.users.selected.data,
      loadingOptionsList: (state) => !state.optionsList.completeLoading,
      profileCountries: (state) =>
        state.optionsList.all["profile_countries"].data,
    }),
  },
  created() {
    this.getAllOptionsList();
    if (this.selected === undefined) {
      this.getUserById({
        id: this.userId,
      });
    } else {
      this.formatCientStats();
    }
  },
  watch: {
    selected: {
      deep: true,
      handler() {
        this.formatCientStats();
      },
    },
  },
  methods: {
    ...mapActions("optionsList", {
      getAllOptionsList: "getAll",
    }),
    ...mapActions("users", {
      getUserById: "getUserById",
    }),
    getCountry() {
      let profileCountry = this.profileCountries.filter(
        (item) => item.id == this.selected.paymentProfile.country_id
      );

      return profileCountry[0].name;
    },
    formatCientStats() {
      if (this.selected.cboStats.length > 0 && this.selected.cboStats !== null && this.selected.cboStats[0].fdate != null) {
        this.selected.cboStats.forEach((item) => {
          const client_id = item.client_id;
          const client_name = item.client_name;
          const fdate = item.fdate;

          if (!this.statsDate.find((field) => field.date == fdate)) {
            this.statsDate.push({ date: fdate });
          }
          if (this.statsClient[client_id] == undefined) {
            this.statsClient[client_id] = {};
            this.statsClient[client_id]["name"] = client_name;
          }
          if (this.statsClient[client_id][fdate] == undefined) {
            this.statsClient[client_id][fdate] = item;

            this.statsType.forEach((type) => {
              if (this.statsClient[client_id][type] == undefined) {
                this.statsClient[client_id][type] = 0;
                this.statsClient[client_id][type + "_amount"] = 0;
              }
              this.statsClient[client_id][type] += parseFloat(item[type]);
              this.statsClient[client_id][type + "_amount"] += parseFloat(
                item[type + "_amount"]
              );
            });
          }
        });

        this.loadingStats = false;
      }
    },
  },
};
</script>

