<template>
    <div class="invoices-view">
        <div class="animated fadeIn fast">
            <LoadingSpinner v-if="loading" />
            <div class="viewBilling"  v-if="!loading">
                <main class="contenedor">
                    <div class="p-2">
                        <h5 class="font-weight-bold">{{ $t('lang.label.invoices') }}</h5>
                    </div>
                    <div class="card mt-3 p-4">

                        <div class="mt-3">
                            <table class="table table-striped">
                                <thead class="thead-dark">
                                    <tr>
                                        <th scope="col">{{ $t('lang.column.invoicenumber') }}</th>
                                        <th scope="col">{{ $t('lang.column.date') }}</th>
                                        <th scope="col">{{ $t('lang.column.companyid') }}</th>
                                        <th scope="col">{{ $t('lang.column.companyname') }}</th>
                                        <th scope="col">{{ $t('lang.column.legalrepresentative') }}</th>
                                        <th scope="col">{{ $t('lang.column.idtransaction') }}</th>                                 

                                        <th scope="col">{{ $t('lang.column.cardnb') }}</th>
                                        <th scope="col">{{ $t('lang.column.status') }}</th>
                                        <th scope="col">{{ $t('lang.column.amount') }} H.T</th>
                                        <th scope="col">VAT (20%)</th>
                                        <th scope="col">Total TTC</th>
                                    </tr>
                                </thead>
                                <tbody v-if="invoices.length > 0" >
                                    <tr v-for="(invoice, key) in invoices" :key="key">
                                        <th scope="row">{{ invoice.id | invoiceFormat}}</th>
                                        <td>{{ invoice.date | moment("DD/MM/YYYY")}}</td>
                                        <td>{{ invoice.client_id }} </td>
                                        <td>{{ invoice.profile_name }} </td>
                                        <td>{{ invoice.legal_representative }} </td>
                                        <td>{{ invoice.ingenico_pay_id }} </td>
                                        <td>
                                            {{ invoice.description }}
                                            <button class="align-self-end btn btn-sm btn-theme-bg-transparent ml-2" @click="downloadPDF(invoice)">
                                                <i class="icon-download ml-2"></i>
                                            </button>
                                        </td>
                                        <td>{{ invoice.status }}</td>
                                        <td>{{ ((invoice.amount - invoice.discount_amount - invoice.discount_previous_payment) * 1 ).toFixed(2) }} €</td>
                                        <td>{{ ((invoice.amount_with_vat - invoice.amount - ('-'+invoice.discount_amount)) * 1 ).toFixed(2) }} €</td>
                                        <td>{{ invoice.amount_with_vat }} €</td>
                                    </tr>
                                </tbody>
                                <tbody v-else>
                                    <tr class="no-results-row">
                                      <td colspan="4">
                                        <span
                                        class="font-weight-bold ft-1-5 text-center"
                                        >{{ $t('lang.label.therearenoinvoicesatthemoment') }}</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>


                        <button class="btn cursor-pointer font-weight-bolder btn-sm btn-outline-dark" @click="descargarCsv">{{ $t('lang.button.downloadalldata') }}</button>
                    </div>
                    
                </div>           
            </main>
        </div>
    </div>



</div>
</template>
<script>
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import { billingsService } from "@/_services";
import { pdfInvoiceMixin } from "@/_mixins/";


export default {
   data () {
    return {
        loading:true,
        invoices:[],
        unparsedResults: null,

    }
},
components:{
   LoadingSpinner
},
mixins: [pdfInvoiceMixin],
created() {
 this.getData();   
},
watch: {
    unparsedResults (current) {

}
},
methods:{
    descargarCsv(){
        let datosExportar = []
        for(let i=0; i<this.invoices.length; i++){
            datosExportar.push({
                "Invoice N°":this.invoices[i].id,
                "Date":this.invoices[i].date,
                "Client ID":this.invoices[i].client_id,
                "Profile Name":this.invoices[i].profile_name,
                "Legal representative":this.invoices[i].legal_representative,
                "Id Transaction":this.invoices[i].ingenico_pay_id,
                "Card Number":this.invoices[i].description,
                "Status":this.invoices[i].status,
                "Amount H.T":(this.invoices[i].amount)+' €',
                "VAT (20%)":((this.invoices[i].amount*0.2).toFixed(2))+' €',
                "Total TTC":(this.invoices[i].amount_with_vat)+' €'
            })
        }

        this.unparsedResults = this.$papa.unparse(datosExportar, {
            delimiter: ";"
        })
        this.$papa.download(this.unparsedResults, 'title')



    },
    getData(){
        this.getInvoices();
    },
    getInvoices(){
        billingsService.getInvoices().then(result => {
            this.invoices = result;
        }).then(result => 
        this.loading = false
        ); 
    },
    
}        

}
</script>