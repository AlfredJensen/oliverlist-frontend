<template>
        <main class="contenedor">
          
                    <form @submit.prevent="onSubmit">
                        <vue-form-generator ref="vfg" :schema="schema" :model="this.model" :options="formOptions"></vue-form-generator>
                        <div class="vue-form-generator">
                          <div class="form-group valid field-submit col-sm-12">
                            <div class="field-wrap float-right">
                              <input id="" type="submit" value=Save>
                            </div>
                          </div>
                      </div>
                      </form> 
            
            </main>
</template>
<script>

import Vue from 'vue';

import VueFormGenerator from 'vue-form-generator';
import 'vue-form-generator/dist/vfg.css'   
import Header from "@/components/Header.vue";
import { billingsService } from "@/_services";


export default {
    props: {
        selectedMethod: Object
    },
    data () {
        return {
            schema: {
                fields: [
                {
                type: "input",
                inputType: "hidden",
                model: "id",
                readonly: true,
                featured: false,
                disabled: true,
                },{
                type: "input",
                inputType: "text",
                label: this.$t('lang.label.nameonbankaccount'),
                model: "bank_account_name",
                readonly: false,
                required: true,
                disabled: false,
                min: 5,
                validator: VueFormGenerator.validators.string.locale({
                    fieldIsRequired: this.$t('lang.label.required'),
                    textTooSmall: this.$t("lang.validation.texttosmall", {min: "{1}"}),
                }),
                styleClasses:'col-md-6',
                }, {
                type: "input",
                inputType: "text",
                label: this.$t('lang.label.iban'),
                model: "iban",
                readonly: false,
                required: true,
                disabled: false,
                min: 5,
                validator: VueFormGenerator.validators.string.locale({
                    fieldIsRequired: this.$t('lang.label.required'),
                    textTooSmall: this.$t("lang.validation.texttosmall", {min: "{1}"}),
                }),
                styleClasses:'col-md-6',
                }, {
                type: "input",
                inputType: "text",
                label: this.$t('lang.label.swiftbic'),
                model: "swift_bic",
                readonly: false,
                required: true,
                disabled: false,
                min: 5,
                validator: VueFormGenerator.validators.string.locale({
                    fieldIsRequired: this.$t('lang.label.required'),
                    textTooSmall: this.$t("lang.validation.texttosmall", {min: "{1}"}),
                }),
                styleClasses:'col-md-6',
                }, {
                type: "input",
                inputType: "text",
                label: this.$t('lang.label.signatoryname'),
                model: "signtory_name",
                readonly: false,
                disabled: false,
                styleClasses:'col-md-6',
                }, {
                type: "input",
                inputType: "text",
                label: this.$t('lang.label.addressline1'),
                model: "address_line_1",
                readonly: false,
                required: true,
                disabled: false,
                min: 5,
                validator: VueFormGenerator.validators.string.locale({
                    fieldIsRequired: this.$t('lang.label.required'),
                    textTooSmall: this.$t("lang.validation.texttosmall", {min: "{1}"}),
                }),
                styleClasses:'col-md-6',
                },{
                type: "input",
                inputType: "text",
                label: this.$t('lang.label.addressline2'),
                model: "address_line_2",
                readonly: false,
                required: false,
                disabled: false,
                min: 5,
                validator: VueFormGenerator.validators.string.locale({
                    fieldIsRequired: this.$t('lang.label.required'),
                    textTooSmall: this.$t("lang.validation.texttosmall", {min: "{1}"}),
                }),
                styleClasses:'col-md-6',
                },{
                type: "input",
                inputType: "text",
                label: this.$t('lang.label.postalcode'),
                model: "postal_code",
                readonly: false,
                required: true,
                disabled: false,
                min: 4,
                validator: VueFormGenerator.validators.string.locale({
                    fieldIsRequired: this.$t('lang.label.required'),
                    textTooSmall: this.$t("lang.validation.texttosmall", {min: "{1}"}),
                }),
                styleClasses:'col-md-6',
                },
                {
                type: "input",
                inputType: "text",
                label: this.$t('lang.label.city'),
                model: "city",
                readonly: false,
                required: true,
                disabled: false,
                min: 4,
                validator: VueFormGenerator.validators.string.locale({
                    fieldIsRequired: this.$t('lang.label.required'),
                    textTooSmall: this.$t("lang.validation.texttosmall", {min: "{1}"}),
                }),
                styleClasses:'col-md-6',
                },{
                    type: "switch",
                    label: this.$t('lang.label.markasprincipal'),
                    model: "default",
                    multi: true,
                    default: 1,
                    textOn: this.$t('lang.label.principal'),
                    textOff: this.$t('lang.label.no'),
                    valueOn: '1',
                    valueOff: '0',
                    styleClasses:'col-md-3',
                }
            ]},

            formOptions: {
                validateAfterLoad: true,
                validateAfterChanged: true
            }
        }
    },
    components:{
        Header,
        "vue-form-generator": VueFormGenerator.component,
    },
    created() {
    },
    computed: {
        model(){
            return this.selectedMethod;
        }
    },
    methods:{
            onSubmit(){
                if(this.$refs.vfg.errors.length > 0) {
                    $event.preventDefault();
                    this.$swal({
                    type: "error",
                    title: this.$t('lang.label.error'),
                    text: this.$t('lang.label.checkdeerrormessagesintheformandtryagain'),
                    showConfirmButton: true
                    });
                } else {
                    this.$swal({
                    type: "warning",
                    title: this.$t('lang.label.areyousure'),
                    text: this.$t('lang.label.youaregoingtoaddanewpaymentmethod'),
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33a2c",
                    confirmButtonText: this.$t('lang.button.yes'),
                    cancelButtonText: this.$t('lang.button.cancel')
                    }).then(result => {
                    if (result.value) {
    
                        billingsService
                        .saveSepaPaymentMethod(this.$refs.vfg.model)
                        .then(
                            (response) => {
                            this.$swal({
                                type: "success",
                                title: this.$t('lang.label.great'),
                                text: this.$t('lang.label.paymentmethodaddedsuccesfully'),
                                showConfirmButton: false,
                                timer: 3000
                            });
                            }
                        ).then(
                            (response) => {
                                this.$emit("refreshPaymentMethods");
                            }  
                        )
                    }
                    });
                }
            }
    }

}
</script>

