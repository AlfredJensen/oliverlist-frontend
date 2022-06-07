<template>
  <div>
    <section class="info accordion">
      <div class="px-4">
        <table class="noselect w-100 table table-hover bg-white">
          <template v-for="(stats, client_id) in statsClient">
            <tbody :key="client_id" v-if="false">
              <tr id="accordionlocation">
                <td :colspan="statsDate.length + 2">
                  <div
                    class="p-2 mt-3 bg-light w-100 align-left inline"
                    type="button"
                    data-toggle="collapse"
                    :data-target="'#collapseLocation' + client_id"
                    aria-expanded="false"
                    :aria-controls="'collapseLocation' + client_id"
                  >
                    <b>{{ stats.name }}</b>
                    <div class="text-right inline">
                      <span class="mr-5" v-for="type in statsType" :key="type">
                        <span class="small">({{ stats[type] }})</span>
                        {{ type }} - {{ getPrice(stats[type + "_amount"]) }} €
                      </span>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
            <tbody
              :key="client_id + 2"
              :id="'collapseLocation' + client_id"
              class=""
              :aria-labelledby="'collapseLocation' + client_id"
              data-parent="#accordionlocation"
            >
              <tr :key="client_id + 'header'" class="font-weight-bold" v-if="statsDate.length > 1">
                <td></td>
                <td
                  v-for="date in statsDate"
                  :key="client_id + date.date"
                  class="text-right"
                >
                  <b>{{ date.date }}</b>
                </td>
                <td class="text-right"  v-if="statsDate.length > 1">Total</td>
              </tr>

              <tr v-for="type in statsType" :key="type">
                <td>
                  <b >{{ type }}</b>
                </td>
                
                <td
                  v-for="date in statsDate"
                  :key="client_id + type + date.date"
                  class="text-right"
                >
                  <span
                    v-if="
                      stats[date.date] != undefined &&
                      stats[date.date][type] != undefined
                    "
                  >
                    <span class="small">({{ stats[date.date][type] }})</span>
                    {{ getPrice(stats[date.date][type + "_amount"]) }} €
                  </span>
                  <span v-else>-</span>
                </td>
                <td class="text-right font-weight-bold"  v-if="statsDate.length > 1">
                  <span class="small">({{ stats[type] }})</span>
                  {{ getPrice(stats[type + "_amount"]) }} €
                </td>
              </tr>
              <tr class="font-weight-bold" v-if="statsDate.length > 1">
                <td>Total</td>

                <td
                  v-for="date in statsDate"
                  :key="client_id + type + date.date"
                  class="text-right"
                >
                  <span>
                    <span class="small"
                      >({{ getTotalQty(date.date, stats) }})</span
                    >
                    {{ getTotal(date.date, stats) }} €
                  </span>
                </td>
                <td class="text-right">
                  <span>
                    <span class="small">({{ getFullTotalQty(stats) }})</span>
                    {{ getFullTotal(stats) }} €</span
                  >
                </td>
              </tr>
            </tbody>
          </template>
        </table>
      </div>
    </section>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { statusBadgeMixin, urlMixin, logoMixin } from "@/_mixins/";
import { billingsService, clientsService } from "@/_services";
import LoadingSpinner from "@/components/LoadingSpinner.vue";

export default {
  props: {
    // stats: {
    //   type: Object,
    //   required: true,
    // },
    statsClient: {
      type: Object,
      required: true,
    },
    statsType: {
      type: Array,
      required: true,
    },
    statsDate: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {};
  },

  components: {
    LoadingSpinner,
  },

  computed: {
    created() {},
  },

  methods: {
    getPrice(amount) {
      return parseFloat(amount).toFixed(2);
    },
    getTotal(date, stats) {
      let total = 0;
      this.statsType.forEach((type) => {
        if (stats[date][type + "_amount"] != undefined) {
          total += parseFloat(stats[date][type + "_amount"]);
        }
      });
      return parseFloat(total).toFixed(2);
    },
    getTotalQty(date, stats) {
      let total = 0;
      this.statsType.forEach((type) => {
        if (stats[date][type] != undefined) {
          total += parseFloat(stats[date][type]);
        }
      });
      return parseFloat(total).toFixed(0);
    },
    getFullTotal(stats) {
      let total = 0;
      this.statsType.forEach((type) => {
        if (stats[type + "_amount"] != undefined) {
          total += parseFloat(stats[type + "_amount"]);
        }
      });
      return parseFloat(total).toFixed(2);
    },
    getFullTotalQty(stats) {
      let total = 0;
      this.statsType.forEach((type) => {
        if (stats[type] != undefined) {
          total += parseFloat(stats[type]);
        }
      });
      return parseFloat(total).toFixed(0);
    },
  },
};
</script>
<style>
</style>