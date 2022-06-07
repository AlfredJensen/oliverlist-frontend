<template>
        <div class="transactions animated fadeIn fast" >
             <LoadingSpinner v-if="loading" />
            <div class="contenedor"  v-if="!loading">
                <div class="p-2">
                    <h5 class="font-weight-bold">{{ $t('lang.label.transactions') }}</h5>
                </div>
                <div v-if="billings.length == 0">
                    <div class="card mt-3 p-4">
                            <h5 class="text-center p-4">{{ $t('lang.label.therearenotransactionsatthemoment') }}</h5>
                    </div>
                </div>
                <div v-else>
                    <div class="card mt-3" v-for="(billing, key) in billings" :key="key" v-if="!detail">
                        <div class="title px-4 pb-2 pt-4">
                            <div class="d-flex flex-column">
                                <div>
                                    <h6 class="font-weight-bold">{{ billing.date }}</h6>
                                    <p class="small">({{ billing.start_date }}) - ({{ billing.end_date }})</p>
                                </div>
                            </div>
                        </div>
                    <div class="body p-4">
                        <p class="font-weight-bold text-right">{{ $t('lang.label.endingbalance') }} : {{ billing.end_balance }} {{currency}}</p>
                        <div class="table-responsive table-transactions pt-4">
                                            <table class="table table-hover">
                                                <thead>
                                                    <tr>
                                                        <th>
                                                            <span class="font-weight-bold"> {{ $t('lang.column.date') }}</span>
                                                        </th>
                                                        <th scope="col">
                                                            <span class="font-weight-bold"> {{ $t('lang.column.description') }}</span>
                                                        </th>
                                                        <th scope="col" class="text-right">
                                                            <span class="font-weight-bold">{{ $t('lang.column.amount') }} ({{currency}})</span>
                                                        </th>
                                                    </tr>
                                                </thead>
                                                 
                                                <tbody >
                                                    <!-- <tr v-for="(bill, key) in billing.list" :key="key" @click="viewDetail(billing.date, bill.type)" :class="(bill.type !== 'payment') ? 'cursor-pointer' : ''"> -->
                                                    <tr v-for="(bill, key) in billing.list" :key="key">
                                                    
                                                            <td>{{bill.date | formatDatePretty}}</td>
                                                            <td v-if="bill.type === 'payment' "> 
                                                                {{bill.description}} - <span class="badge" :class="statusPayment(bill.payment_status_id)">{{bill.payment_status}}</span>
                                                                <button class="align-self-end btn btn-sm btn-theme-bg-transparent ml-2" @click="downloadPDF(bill)">
                                                                    {{ $t('lang.button.downloadinvoice') }}
                                                                    <i class="icon-arrow-down ml-2"></i>
                                                                </button>
                                                            </td>
                                                            <td v-else-if="bill.type === 'in' "> 
                                                                {{bill.quantity}} Credit {{bill.description}}
                                                            </td>
                                                            <td v-else>
                                                                {{bill.quantity}} Actions - Campaign {{bill.description}}
                                                            </td>
                                                            <td class="text-right" >{{bill.amount}}  {{currency}}</td>
                                                        
                                                                <!-- <td>{{bill.date | formatDatePretty}}</td>
                                                                <td v-if="bill.type === 'payment' "> 
                                                                    {{bill.description}} - <span class="badge" :class="statusPayment(bill.payment_status_id)">{{bill.payment_status}}</span>
                                                                    <button class="align-self-end btn btn-sm btn-theme-bg-transparent ml-2" @click="downloadPDF(billing, bill)">
                                                                        Download Invoice 
                                                                        <i class="icon-arrow-down ml-2"></i>
                                                                    </button>
                                                                </td>
                                                                <td v-else-if="bill.type === 'in' "> 
                                                                    {{bill.quantity}} Credit {{bill.description}}
                                                                </td>
                                                                <td v-else>
                                                                    {{bill.quantity}} Actions - Campaign {{bill.description}}
                                                                </td>
                                                                <td class="text-right" >{{bill.amount}}  {{currency}}</td> -->
                                                            
                                                        </tr>
                                                    </tbody>
                                                </table>
                        </div>
                        <p class="font-weight-bold text-right">{{ $t('lang.label.startingbalance') }} : {{ billing.start_balance }} {{currency}}</p>
                    </div>
                </div>
               
                

                <div class="py-2"></div>
                <TransactionsDetail
                v-if="detail"
                :date="detailDate"
                :type="detailType"
                @hideDetail="hideDetail($event)"
                />
            
            </div><!--//v-else-->
            </div><!--//contenedor-->
        </div>
</template>
<script>
import Header from "@/components/Header.vue";
import { billingsService } from "@/_services";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import TransactionsDetail from "@/components/Billing/TransactionsDetail.vue";
import { statusBadgeMixin, pdfInvoiceMixin } from "@/_mixins/";


export default {
    data(){
        return {
             billings:[],
             loading:true,
             currency: "",
             detail:false,
             detailDate: "",
             detailType: "",
        }
    },
    components:{
        Header,
        LoadingSpinner,
        TransactionsDetail
    },
    mixins: [statusBadgeMixin, pdfInvoiceMixin],
    created() {
       this.getData();   
    },
    methods:{
            getData(){
                this.getTransactions();
                this.getCurrency();
            },
            getTransactions(){
                billingsService.getTransactions().then(result => {
                    this.billings = result;
                }).then(result => 
                    this.loading = false
                ); 
            },
            getCurrency(){
                this.currency = "€";
            },
            viewDetail(date, type){
                if(type !== 'payment'){
                    this.detailDate = date;
                    this.detailType = type;
                    this.detail=true;
                }   
            },
            hideDetail(date, type){
                this.detailDate = "";
                this.detailType = "";
                this.detail=false;
            },
    }

}
</script>
<style>
    .transactions .table-transactions .table-hover tbody tr:hover {
        background-color: rgba(0, 0, 0, 0.05)!important
    }
</style>