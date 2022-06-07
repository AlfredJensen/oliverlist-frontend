<template>
  <div class="contentCenter all">
    <LoadingSpinner v-if="loading" />
    <section class="info" v-if="!loading">
      <!-- <ol class="breadcrumb">
        <li class="breadcrumb-item active">Usages</li>
      </ol>  -->
      <div class="contenedor animated fadeIn faster"></div>
    </section>
    <div class="pb-4">
      <UsageStats
        v-if="!loadingStats"
        :statsClient="statsClient"
        :statsType="statsType1"
        :statsDate="statsDate"
      />
    </div>
    <div class="pb-4">
      <UsageStats
        v-if="!loadingStats"
        :statsClient="statsClient"
        :statsType="statsType2"
        :statsDate="statsDate"
      />
    </div>

    <section class="usages-list" v-if="!loading">
      <div class="contenedor animated fadeIn fast">
        <div class="wrappList">
          <div class="table-responsive">
            <table class="table table-hover">
              <thead>
                <tr>
                  <th scope="col" class="datecol">
                    <div class="btn-group">
                      <a
                        class="dropdown-toggle cursor-pointer"
                        data-toggle="dropdown"
                        data-display="static"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        Date
                      </a>
                      <div
                        class="dropdown-menu dropdown-menu-lg-left scrolled-div"
                      >
                        <div class="form-group pl-2">
                          <small for="exampleInputEmail1"
                            ><b>Date Range</b></small
                          >
                          <input
                            v-model="initDateFilter"
                            type="date"
                            class="
                              dropdown-item
                              form-control form-control-sm
                              pl-1
                            "
                            @change="searchUsagesWithPageReset()"
                          />
                          <input
                            v-model="endDateFilter"
                            type="date"
                            class="
                              dropdown-item
                              form-control form-control-sm
                              pl-1
                            "
                            @change="searchUsagesWithPageReset()"
                          />
                          <div
                            @click="cleanDates()"
                            class="
                              badge
                              btn-danger
                              cursor-pointer
                              float-right
                              mr-3
                              mt-2
                            "
                          >
                            Clean
                          </div>
                        </div>
                      </div>
                    </div>
                  </th>

                  <th scope="col">
                    <div class="btn-group">
                      <a
                        class="dropdown-toggle cursor-pointer"
                        data-toggle="dropdown"
                        data-display="static"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        Company name
                      </a>
                      <div
                        class="dropdown-menu dropdown-menu-lg-left scrolled-div"
                      >
                        <a
                          class="dropdown-item cursor-pointer"
                          v-for="(client, index) in clients"
                          :key="index"
                          @click="changeCompanyNameFilter(client)"
                        >
                          <span
                            :class="
                              isFilteredClientName(client)
                                ? 'icon-check-circle-o pr-1'
                                : 'icon-circle-o pr-1'
                            "
                          ></span>
                          {{ client.name }}
                        </a>
                      </div>
                    </div>
                  </th>

                  <th scope="col">
                    <div class="btn-group">
                      <a
                        class="dropdown-toggle cursor-pointer"
                        data-toggle="dropdown"
                        data-display="static"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        Company Id
                      </a>
                      <div
                        class="dropdown-menu dropdown-menu-lg-left scrolled-div"
                      >
                        <a
                          class="dropdown-item cursor-pointer"
                          v-for="(client, index) in clients"
                          :key="index"
                          @click="changeCompanyIdFilter(client)"
                        >
                          <span
                            :class="
                              isFilteredClientId(client)
                                ? 'icon-check-circle-o pr-1'
                                : 'icon-circle-o pr-1'
                            "
                          ></span>
                          {{ client.id }}
                        </a>
                      </div>
                    </div>
                  </th>

                  <th scope="col">
                    <div class="btn-group">
                      <a
                        class="dropdown-toggle cursor-pointer"
                        data-toggle="dropdown"
                        data-display="static"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        Product Type
                      </a>
                      <div
                        class="dropdown-menu dropdown-menu-lg-left scrolled-div"
                      >
                        <a
                          class="dropdown-item cursor-pointer"
                          v-for="(product, index) in products"
                          :key="index"
                          @click="changeProductFilter(product)"
                        >
                          <span
                            :class="
                              isFilteredProduct(product)
                                ? 'icon-check-circle-o pr-1'
                                : 'icon-circle-o pr-1'
                            "
                          ></span>
                          {{ product }}
                        </a>
                      </div>
                    </div>
                  </th>

                  <th scope="col" class="creditcol">
                    <div class="btn-group">
                      <a
                        class=""
                        data-toggle="dropdown"
                        data-display="static"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        Current Credit Card
                      </a>
                    </div>
                  </th>

                  <!-- <th scope="col">
                <div class="btn-group">
                 <a class="dropdown-toggle cursor-pointer" data-toggle="dropdown" data-display="static" aria-haspopup="true" aria-expanded="false">
                   Credit Qty
                 </a>
               </div> 
            </th> -->

                  <th scope="col">
                    <div class="btn-group">
                      <a
                        class=""
                        data-toggle="dropdown"
                        data-display="static"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        Amount H.T
                      </a>
                    </div>
                  </th>

                  <th scope="col">
                    <div class="btn-group">
                      <a
                        class=""
                        data-toggle="dropdown"
                        data-display="static"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        VAT (20%)
                      </a>
                    </div>
                  </th>

                  <th scope="col">
                    <div class="btn-group">
                      <a
                        class=""
                        data-toggle="dropdown"
                        data-display="static"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        Total TTC
                      </a>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody v-if="totalUsages > 0">
                <tr v-for="(usage, key) in usages.list" :key="key">
                  <td class="datecol">{{ usage.date }}</td>
                  <td>{{ usage.clientName }}</td>
                  <td>{{ usage.clientId }}</td>
                  <td>{{ usage.product }}</td>
                  <td class="creditcol">
                    {{ usage.paymentMethod }}
                    <div
                      v-if="
                        usage.paymentMethod != ' ' &&
                        usage.payment_status == 'Valid'
                      "
                      class="badge btn-success"
                    >
                      {{ usage.payment_status }}
                    </div>
                    <div
                      v-if="
                        usage.paymentMethod != ' ' &&
                        usage.payment_status == 'Invalid'
                      "
                      class="badge btn-danger"
                    >
                      {{ usage.payment_status }}
                    </div>
                  </td>
                  <td>{{ usage.total }} €</td>
                  <td>{{ usage.total | VAT }} €</td>
                  <td>{{ usage.total | TTC }} €</td>
                </tr>
              </tbody>
              <tbody v-else>
                <tr class="no-results-row">
                  <td colspan="9">
                    <span class="font-weight-bold ft-1-5 text-center"
                      >The are no usages at the moment</span
                    >
                  </td>
                </tr>
              </tbody>
              <tfoot v-if="totalUsages > 0">
                <tr>
                  <td colspan="6"></td>
                  <td>
                    <b>{{ usages.totalFiltered }} €</b>
                  </td>
                  <td>
                    <b>{{ usages.totalFiltered | VAT }} €</b>
                  </td>
                  <td>
                    <b>{{ usages.totalFiltered | TTC }} €</b>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
          <div class="table-footer row mb-2 mt-2">
            <div class="col-12 text-left mb-3">
              <span class="font-weight-bold"
                >{{ $t("lang.label.showing") }} {{ firstInPage }}
                {{ $t("lang.label.to") }} {{ lastInPage }}
                {{ $t("lang.label.of") }} {{ totalUsages }} usages.</span
              >
            </div>
            <div class="col-9">
              <button
                type="button"
                class="btn btn-primary btn-sm themed-button"
                :disabled="isFirstPage"
                @click="currentPage--"
              >
                <span class="icon-angle-double-left mr-2" />{{
                  $t("lang.button.previous")
                }}
              </button>
              <button
                type="button"
                class="btn btn-primary btn-sm themed-button ml-2"
                :disabled="isLastPage"
                @click="currentPage++"
              >
                {{ $t("lang.button.next") }}
                <span class="icon-angle-double-right ml-2" />
              </button>
            </div>
            <div class="col-3 dropdown text-right">
              <button
                type="button"
                class="btn btn-secondary btn-sm dropdown-toggle themed-button"
                id="dropdownCantPerPage"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
                data-offset="10,20"
              >
                <span>{{ cantPerPage }} {{ $t("lang.button.perpage") }}</span>
              </button>
              <div class="dropdown-menu" aria-labelledby="dropdownCantPerPage">
                <a
                  class="dropdown-item cursor-pointer"
                  v-for="(optionCant, index) in cantPerPageOptions"
                  :key="index"
                  @click="cantPerPage = optionCant"
                  >{{ optionCant }} {{ $t("lang.button.perpage") }}</a
                >
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
import { statusBadgeMixin, urlMixin, logoMixin } from "@/_mixins/";
import { billingsService, clientsService } from "@/_services";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import UsageStats from "@/components/Usages/UsageStats.vue";

export default {
  data() {
    return {
      usages: [],
      currentPage: 1,
      cantPerPage: 50,
      cantPerPageOptions: [5, 10, 20, 50, 100],
      companyNameFilter: [],
      companyIdFilter: [],
      productFilter: [],
      initDateFilter: "",
      endDateFilter: "",
      clients: [],
      products: [],
      searchFilter: "",
      loading: false,
      loadingStats: false,
      stats: {},
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

  mixins: [statusBadgeMixin, urlMixin, logoMixin],

  components: {
    LoadingSpinner,
    UsageStats,
  },

  watch: {
    currentPage() {
      this.searchUsages();
    },

    cantPerPage() {
      this.searchUsagesWithPageReset();
    },
  },

  computed: {
    ...mapState({
      currentUser: (state) => state.authentication.user,
    }),

    isFirstPage() {
      return this.currentPage === 1;
    },

    isLastPage() {
      return this.currentPage === this.pageCount;
    },

    pageCount() {
      var cantPage = this.totalUsages / this.cantPerPage;
      var fixedCantPage = parseInt(cantPage.toFixed());
      if (cantPage > fixedCantPage) {
        return fixedCantPage + 1;
      } else {
        return fixedCantPage;
      }
    },

    firstInPage() {
      return (this.currentPage - 1) * this.cantPerPage + 1;
    },

    lastInPage() {
      if (
        this.totalUsages >= this.firstInPage &&
        this.totalUsages <= this.currentPage * this.cantPerPage
      ) {
        return this.totalUsages;
      } else {
        return this.currentPage * this.cantPerPage;
      }
    },

    totalUsages() {
      if (this.usages !== undefined && this.usages.total !== undefined) {
        return this.usages.total;
      } else {
        return 0;
      }
    },
  },

  created() {
    this.getAllFilters();
    this.searchUsages();
    this.getStats();
  },

  methods: {
    ...mapActions("header", {
      changeHeaderTab: "changeTab",
    }),
    searchUsages() {
      this.loading = true;
      billingsService
        .getUsages(
          this.currentPage,
          this.cantPerPage,
          this.initDateFilter,
          this.endDateFilter,
          this.productFilter,
          this.companyNameFilter,
          this.companyIdFilter
        )
        .then((result) => {
          this.usages = result;
          this.loading = false;
        });
    },

    getStats() {
      this.loadingStats = true;
      billingsService.getStats().then((response) => {
        if (response) {
          response.forEach((item) => {
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
      });
    },

    searchUsagesWithPageReset() {
      this.loading = true;
      billingsService
        .getUsages(
          1,
          this.cantPerPage,
          this.initDateFilter,
          this.endDateFilter,
          this.productFilter,
          this.companyNameFilter,
          this.companyIdFilter
        )
        .then((result) => {
          this.currentPage = 1;
          this.usages = result;
          this.loading = false;
        });
    },

    pageReset() {
      return (this.currentPage = 1);
    },

    isFilteredClientName(client) {
      return (
        this.companyNameFilter !== undefined &&
        this.companyNameFilter === client.name
      );
    },

    isFilteredClientId(client) {
      return (
        this.companyIdFilter !== undefined && this.companyIdFilter === client.id
      );
    },

    isFilteredProduct(product) {
      return this.productFilter !== undefined && this.productFilter === product;
    },

    getAllClients() {
      clientsService.getAll().then((clients) => (this.clients = clients));
    },

    getAllProducts() {
      this.products.push("Campaign credit");
      // this.products.push("Lead");
    },

    changeCompanyNameFilter(client) {
      var clientName = this.isFilteredClientName(client) ? "" : client.name;
      this.companyNameFilter = clientName;
      this.searchUsagesWithPageReset();
    },

    changeCompanyIdFilter(client) {
      var clientId = this.isFilteredClientId(client) ? "" : client.id;
      this.companyIdFilter = clientId;
      this.searchUsagesWithPageReset();
    },

    changeProductFilter(product) {
      var productName = this.isFilteredProduct(product) ? "" : product;
      this.productFilter = productName;
      this.searchUsagesWithPageReset();
    },

    getAllFilters() {
      this.getAllClients();
      this.getAllProducts();
    },

    cleanDates() {
      this.initDateFilter = "";
      this.endDateFilter = "";
      this.searchUsagesWithPageReset();
    },

    resetAllFilters() {
      this.filters.actualQuickFilter = "ALL";
      this.searchFilter = "";
      this.resetAllUsageContactsFilters();
      this.searchUsagesWithPageReset();
    },

    confirmSearch() {
      // this.resetAllUsageContactsFilters();
      // this.getAllUsageContacts({
      //   currentPage: this.currentPage,
      //   cantPerPage: this.cantPerPage,
      //   searchFilter: this.searchFilter
      // }).then(result => (this.currentPage = 1));
    },
  },
};
</script>
<style>
</style>