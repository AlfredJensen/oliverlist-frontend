<template>
  <section class="invoice">
    <LoadingSpinner
      v-if="loading"
    />
    <div class="table-responsive px-4" v-else>
      <h6>{{$t('lang.label.billingsummary')}}</h6>
      <label v-if="Object.entries(opportunities).length == 0">{{$t('lang.label.nothingplannedatthemoment')}}</label>
      <table clsas="table table-hover card-style min-width-table card-style" width="100%">
      
          <template v-for="(listYear, year) in opportunities">
            <tr
              :key="year"
              v-if="$options.lastYear == undefined || $options.lastYear != year"
            >
              <td colspan="6">
                {{ year }}
              </td>
            </tr>
            <template v-for="(listMonth, month) in listYear">
              <template class="pb-2">
                <tr
                  :key="month"
                  class="accordion"
                  id="accordionlocation"
                  v-if="
                    $options.lastMonth == undefined ||
                    $options.lastMonth != month
                  "
                >
                  <td colspan="6">
                    <div
                      class="p-2 mt-3 bg-light w-100 align-left"
                      type="button"
                      data-toggle="collapse"
                      :data-target="'#collapseLocation' + year + month"
                      aria-expanded="false"
                      :aria-controls="'collapseLocation' + year + month"
                    >
                      <span> {{ getLabelMonth(month) }} </span>

                      <span
                        class="badge badge-warning ml-2"
                        v-if="
                          absent[year] !== undefined &&
                          absent[year][month] !== undefined
                        "
                        >{{ $t("lang.refuse.absentlabel") }}
                        {{ absent[year][month].total }}</span
                      >

                      <span
                        v-if="
                          refused[year] !== undefined &&
                          refused[year][month] !== undefined
                        "
                        class="badge badge-danger ml-2"
                        >{{ $t("lang.refuse.refused") }}
                        {{ refused[year][month].total }}</span
                      >

                      <span
                        v-if="
                          active[year] !== undefined &&
                          active[year][month] !== undefined
                        "
                        class="badge badge-success text-white ml-2"
                        >{{ $t("lang.refuse.valid") }}
                        {{ active[year][month].total }}</span
                      >

                      <strong class="float-right"
                        >Total: {{ getTotal(year, month) }} € TTC</strong
                      >
                    </div>
                    <div class="dropdown-divider"></div>
                  </td>
                </tr>

                <tbody
                wdth="100%"
                  :key="year + month"
                  :id="'collapseLocation' + year + month"
                  class="collapse"
                  :aria-labelledby="'collapseLocation' + year + month"
                  data-parent="#accordionlocation"
                >
                  <tr v-for="(opp, index) in listMonth" :key="year + month + index">
                    <td>
                      <span :class="getClass(opp)" class="mr-3">{{
                        getText(opp)
                      }}</span>
                    </td>
                    <td>
                      <a
                        class="text-primary"
                        target="_blank"
                        :href="'/opportunities/' + opp.link_id"
                        >{{ opp.business_name }}</a
                      >
                    </td>
                    <td>
                      <small class="ml-3">{{
                        opp.real_event_date != null
                          ? opp.real_event_date
                          : opp.event_date
                      }}</small>
                      <small class="ml-3" v-if="opp.real_event_date"
                        >({{ opp.event_date }})</small
                      >
                    </td>
                    <td width="40px"></td>
                    <td class="text-right">
                      <strong class="mr-3">{{ getPrice(opp) }} € H.T</strong>
                    </td>
                    <td class="text-right">
                      <strong>{{ getPriceIva(opp) }} € TTC</strong>
                    </td>
                  </tr>
                  <tr
                    v-if="
                      totalexported[year] != undefined &&
                      totalexported[year][month] != undefined &&
                      totalexported[year][month].total > 0
                    "
                    :key="month + year + index"
                  >
                    <td><span class="text-primary icon-download"></span></td>
                    <td>{{ $t("lang.integrations.senttocrm") }}:</td>
                    <td>
                      <small class="ml-3">{{
                        totalexported[year][month].total
                      }}</small>
                    </td>
                    <td width="40px"></td>
                    <td class="text-right">
                      <strong class="mr-3"
                        >{{
                          getPriceContacts(totalexported[year][month].total)
                        }}
                        € H.T</strong
                      >
                    </td>
                    <td class="text-right">
                      <strong
                        >{{
                          getPriceContactsIva(totalexported[year][month].total)
                        }}
                        € TTC</strong
                      >
                    </td>
                  </tr>
                </tbody>
              </template>
              <template :set="($options.lastMonth = month)"></template>
            </template>
            <template :set="($options.lastYear = year)"></template>
          </template>
      </table>
    </div>
  </section>
</template>
<script>
import { billingsService, clientsService, crmService } from "@/_services";
import { mapState, mapActions } from "vuex";
import LoadingSpinner from "@/components/LoadingSpinner.vue";

export default {
  data() {
    return {
      loading: true,
      opportunities: {},
      total: {},
      active: {},
      refused: {},
      totalexported: {},
      absent: {},
      totalexp: 0,
    };
  },
  components: {
    LoadingSpinner,
  },
  lastYear: undefined,
  lastMonth: undefined,
  created() {
    crmService.getContactSent().then((result) => {
      result.forEach((item) => {
        if (this.totalexported[item.event_year] == undefined) {
          this.totalexported[item.event_year] = {};
        }
        if (
          this.totalexported[item.event_year][item.event_month] == undefined
        ) {
          this.totalexported[item.event_year][item.event_month] = {
            total: item.quantity,
          };
        } else {
          let total =
            this.totalexported[item.event_year][item.event_month] +
            item.quantity;
          this.totalexported[item.event_year][item.event_month] = {
            total: total,
          };
        }
      });
    });

    billingsService
      .getDashboard()
      .then((result) => {
        result.list.forEach((item) => {
          if (this.opportunities[item.event_year] == undefined) {
            this.opportunities[item.event_year] = {};
          }
          if (
            this.opportunities[item.event_year][item.event_month] == undefined
          ) {
            this.opportunities[item.event_year][item.event_month] = [];
          }
          this.opportunities[item.event_year][item.event_month].push(item);

          if (item.link_status_reason_id == 35) {
            if (this.absent[item.event_year] == undefined) {
              this.absent[item.event_year] = {};
            }
            if (this.absent[item.event_year][item.event_month] == undefined) {
              this.absent[item.event_year][item.event_month] = { total: 0 };
            }
            this.absent[item.event_year][item.event_month].total++;
          } else if (item.link_status_reason_id == 34) {
            if (this.refused[item.event_year] == undefined) {
              this.refused[item.event_year] = {};
            }
            if (this.refused[item.event_year][item.event_month] == undefined) {
              this.refused[item.event_year][item.event_month] = { total: 0 };
            }
            this.refused[item.event_year][item.event_month].total++;
          } else {
            if (this.active[item.event_year] == undefined) {
              this.active[item.event_year] = {};
            }
            if (this.active[item.event_year][item.event_month] == undefined) {
              this.active[item.event_year][item.event_month] = {
                total: 0,
                totalAmount: 0,
              };
            }

            this.active[item.event_year][item.event_month].total++;
            this.active[item.event_year][item.event_month].totalAmount =
              this.active[item.event_year][item.event_month].totalAmount +
              parseFloat(item.amount);
          }
        });
      })
      .then((result) => {
        this.loading = false;
        this.$forceUpdate();
      });
  },

  computed: {
    user() {
      return this.$store.state.authentication.user;
    },
  },

  methods: {
    hasData(year, month) {
      return (
        (this.refused !== undefined &&
          this.refused[year] !== undefined &&
          this.refused[year][month] !== undefined) ||
        (this.active !== undefined &&
          this.active[year] !== undefined &&
          this.active[year][month] !== undefined) ||
        (this.absent !== undefined &&
          this.absent[year] !== undefined &&
          this.absent[year][month] !== undefined) ||
        (this.totalexported !== undefined &&
          this.totalexported[year] !== undefined &&
          this.totalexported[year][month] !== undefined)
      );
    },
    getTotal(year, month) {
      let total = 0;
      if (
        this.active[year] !== undefined &&
        this.active[year][month] !== undefined
      ) {
        total = this.active[year][month].totalAmount;
      }
      let totalexp = 0;
      if (
        this.totalexported[year] !== undefined &&
        this.totalexported[year][month] !== undefined
      ) {
        totalexp = totalexp + this.totalexported[year][month].total * 0.05;
      }
      total = (total + totalexp) * 1.2;
      return parseFloat(total).toFixed(2);
    },
    getCurrentMonth() {
      var d = new Date();
      var weekday = new Array(7);
      weekday[0] = this.$t("lang.label.january");
      weekday[1] = this.$t("lang.label.frebruary");
      weekday[2] = this.$t("lang.label.march");
      weekday[3] = this.$t("lang.label.april");
      weekday[4] = this.$t("lang.label.may");
      weekday[5] = this.$t("lang.label.june");
      weekday[6] = this.$t("lang.label.july");
      weekday[7] = this.$t("lang.label.august");
      weekday[8] = this.$t("lang.label.september");
      weekday[9] = this.$t("lang.label.october");
      weekday[10] = this.$t("lang.label.november");
      weekday[11] = this.$t("lang.label.december");
      return weekday[d.getMonth()];
    },
    getYear() {
      var d = new Date();
      return d.getFullYear();
    },
    getLabelMonth(month) {
      var weekday = new Array(7);
      weekday[1] = this.$t("lang.label.january");
      weekday[2] = this.$t("lang.label.frebruary");
      weekday[3] = this.$t("lang.label.march");
      weekday[4] = this.$t("lang.label.april");
      weekday[5] = this.$t("lang.label.may");
      weekday[6] = this.$t("lang.label.june");
      weekday[7] = this.$t("lang.label.july");
      weekday[8] = this.$t("lang.label.august");
      weekday[9] = this.$t("lang.label.september");
      weekday[10] = this.$t("lang.label.october");
      weekday[11] = this.$t("lang.label.november");
      weekday[12] = this.$t("lang.label.december");
      return weekday[month];
    },
    getClass(opportunity) {
      if (opportunity.link_status_reason_id == 35) {
        return "badge badge-warning";
      }
      if (opportunity.link_status_reason_id == 34) {
        return "badge badge-danger";
      }
      if(opportunity.real_event_date != null){
        return "icon-dollar text-success";
      }
      return "icon-checkmark text-success";
    },
    getText(opportunity) {
      if (opportunity.link_status_reason_id == 35) {
        return this.$t("lang.refuse.absentlabel");
      }
      if (opportunity.link_status_reason_id == 34) {
        return this.$t("lang.refuse.refused");
      }
      return "";
    },
    getPrice(opportunity) {
      return parseFloat(opportunity.amount).toFixed(2);
    },
    getPriceIva(opportunity) {
      return parseFloat(opportunity.amount * 1.2).toFixed(2);
    },
    getPriceContacts(amount) {
      return parseFloat(amount * 0.05).toFixed(2);
    },
    getPriceContactsIva(amount) {
      return parseFloat(amount * 0.05 * 1.2).toFixed(2);
    },
  },
};
</script>
