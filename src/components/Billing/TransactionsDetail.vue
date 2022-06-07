<template>
    <div>
        <LoadingSpinner v-if="loading" />
        <main class="contenedor">
            <div class="contentCenter all">
                <button class="btn btn-sm btn-primary btnIndex do-not-contact-button" @click="goBack()">
                    <span class="icon-chevron-left pr-2"></span>
                    {{ $t('lang.button.back') }}
                </button>
                <div class="row">
                    <div class="col-12">
                        <div class="card mt-3">
                            <div class="body p-4">
                                <div class="table-responsive table-transactions pt-4">
                                    <table class="table table-hover">
                                        <thead>
                                            <tr>
                                                <th>
                                                    <span class="font-weight-bold"> Date</span>
                                                </th>
                                                <th scope="col">
                                                    <span class="font-weight-bold"> Description</span>
                                                </th>
                                                <th scope="col" class="text-right">
                                                    <span class="font-weight-bold">Amount</span>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody >
                                            <tr v-for="(bill, key) in billing.list" :key="key">
                                                <td>{{bill.date}}</td>
                                                <td>{{bill.description}}</td>
                                                <td class="text-right">{{bill.amount}} {{currency}}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <p class="font-weight-bold text-right">Total : {{ billing.total }} {{currency}}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <button class="btn cursor-pointer font-weight-bolder btn-sm btn-outline-dark" @click="downloadPDF()">{{ $t('lang.button.downloadpdf') }}</button>
                        <download-csv class= "btn cursor-pointer font-weight-bolder btn-sm btn-outline-dark" :data="json_data " name= "TransactionsDetails.csv" @click= "procesarCSV()">
                            {{ $t('lang.button.downloadalldata') }}
                        </download-csv>
                </div>

            </div>
        </main>
    </div>
</div>
</template>
<script>
import Header from "@/components/Header.vue";
import { clientsService } from "@/_services";
import LoadingSpinner from "@/components/LoadingSpinner.vue";

import { pdfInvoiceMixin } from "@/_mixins/";

import JsonCSV from "vue-json-csv";

export default {
  data() {
    return {
      billing: [],
      loading: false,
      currency: "",
    };
  },
  components: {
    Header,
    LoadingSpinner,
  },
  props: {
    date: String,
    type: String,
    json_data: { required: false, type: Object },
  },
  created() {
    this.getData();
  },

  mixins: [pdfInvoiceMixin],

  mounted() {
    // this.prepararCSV()
  },
  methods: {
    prepararCSV() {
      let transactionDetails = [];
      let total = 0;
      for (let i = 0; i < this.billing.list.length; i++) {
        transactionDetails.push({
          date: this.billing.list[i]["date"],
          description: this.billing.list[i]["description"],
          amount: this.billing.list[i]["amount"] + " " + this.currency,
        });
        total += parseFloat(this.billing.list[i].amount);
      }

      transactionDetails.push({
        date: "",
        description: "",
        amount: "TOTAL: " + total + " " + this.currency,
      });
      this.json_data = transactionDetails;
    },
    getData() {
      this.getBillingData();
      this.getCurrency();
    },
    getBillingData() {
      clientsService.getBilling(this.date, this.type).then((result) => {
        this.billing = result;
        this.prepararCSV();
      });
    },
    getCurrency() {
      this.currency = "€";
    },
    goBack() {
      this.$emit("hideDetail");
    },
  },
};
</script>
