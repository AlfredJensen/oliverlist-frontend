<template>
    <section class="emailView">
        <ol class="breadcrumb">
            
            <li  v-if=" this.$route.fullPath == '/emails/:id'" class="breadcrumb-item cursor-pointer" @click="changeTab('ALL')">{{ $t('lang.label.allemails') }}</li>
            <li class="breadcrumb-item active">{{ selected.response_subject }}</li>
        </ol>
        <main class="contenedor">
                <LoadingSpinner v-if="loading" />
                <div class="contentCenter all" v-if="!loading">
                    
                    <div class="row">
                        <div class="col-sm-12 mb-5" v-if="this.selected.business_contact_id">
                        </div>
                    <div class="col-sm-3 col-md-3 mb-5">
                                <div v-if="this.selected.link_id !== null">
                                    <p class="p-3 font-weight-bold">{{ $t('lang.label.thisemailislinkedto') }}</p>
                                    <div class="card p-4">
                                        <div>
                                            <div class="">
                                                <h4 class="info font-weight-bold">{{this.selected.business_name}}</h4>
                                                <p class="mt-2" v-if="this.selected.business_contact_email">{{this.selected.business_contact_email}}</p><!--contact-->
                                                <p class="mt-2" v-else>{{ $t('lang.label.thereisnocontactassociatedwiththisemail') }}</p>
                                                <div class=" mt-2">
                                                    <span class="badge mr-1" :class="statusBadge(this.selected.campaign_name)">{{this.selected.campaign_name}}</span>
                                                    <span class="badge mr-1" :class="statusBadge(this.selected.link_status_name)">{{this.selected.link_status_name}}</span>
                                                </div>
                                                <div>
                                                    <button type="button" class="btn btn-sm btn-danger mt-2" @click="changeStatusBusinessContactAction(7)">
                                                        <span class="">{{ $t('lang.button.donotcontact') }}</span>
                                                    </button>
                                                </div>
                                            </div>
                                            <div class="line"></div>
                                             <div class="mt-2" v-if="!this.selected.business_contact_email">
                                                        <div class="d-flex justify-content-between align-items-center">
                                                        <p class="mb-2 font-weight-bold">{{ $t('lang.label.associatetoacontact') }}</p>
                                                        <button class="c-pointer btn btn-success ml-2 my-2" @click="getContacts()"> <i class="icon-user-plus"></i></button>
                                                        </div>
                                                        <div class="content-search-opp">                                                    
                                                                <ul class="" >
            
                                                                    <li v-for="(contact, key) in oppContacts" :key="key"  @click="contactSelect(contact)">
                                                                        <div class="pt-2 pb-2 c-pointer">
                                                                        <div class="row">
                                                                            
                                                                            <div class="col-md-5 col-lg-3 col-xl-2 d-flex  align-items-center">
                                                                                <div class=" position-relative pt-1">
                                                                                    <div class="">
                                                                                        <span class="icoCircle mail list text-uppercase"><span>
                                                                                        <small>{{contact.email | firstLetters}}  </small>
                                                                                        </span></span>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div class="col-md-7 col-lg-9 col-xl-10 d-flex  align-items-center">
                                                                                <span class="d-block ml-2"><small class="font-weight-bold ">{{contact.email}} </small></span> 
                                                                            </div>
                                                                            </div>
                                                                        </div>
                                                                    </li>
                                                                    <li class="divider"></li>
                                                                </ul>
                                                        </div>
                                                        <div class="mt-2">
                                                                <div class="pt-2 pb-3"  v-if="contactSelected">
                                                                    <div class="w-100 d-flex justify-content-between align-items-center">
                                                                        <span class="text-left font-weight-bold">{{this.contactSelected.email}} </span>
                                                                        <i  @click="resetContactSelected" class="icon-minus-square-o c-pointer"></i>
                                                                    </div>
                                                                </div>
                                                                <button  @click="associateBusinessContact" class="btnSet positive d-block mb-2 text-center w-100 btn btn-sm btn-primary themed-button">
                                                                    <span>Link contact</span>
                                                                </button>
                                                        </div>  
                                            </div>  
                                        </div>
                                    </div>
                                    <ActionButtons  
                                        v-if="this.selected.business_contact_email !== null"
                                        :link="{'id': this.selected.link_id}"
                                        :status="'define status'"
                                        @qualifiedOpportunity="qualifiedOpportunity($event)"
                                        @disqualifiedOpportunity="disqualifiedOpportunity($event)"
                                        @doNotContactBusiness="doNotContactBusiness($event)"
                                        @deleteBusiness="deleteBusiness($event)"
                                        />
                                  
                                </div> <!--//if-->
                                <div v-else>
                                   
                                    <p class="p-3 font-weight-bold">{{ $t('lang.label.thisemailhasnotbeenlinkedtoanyopportunityyet') }}</p>
                                    <div class="card p-4">
                                        <div>
                                            <div class="">
                                                <form class="form-inline form-search">
                                                    <div class="input-group w-100">
                                                    <input
                                                    class="form-control d-block"
                                                    type="search"
                                                    aria-label="Search"
                                                    v-model="searchOpportunities"
                                                    /><button  @click="confirmSearch"
                                                            class="btnSet ml-2 positive d-block mb-2 text-center btn btn-sm btn-primary themed-button"
                                                            type="button">
                                                            <span class="icon-search"></span>
                                                        </button>
                                                        <button  v-on:click.prevent="associateOpportunity" :disabled="isDisabled" class="btnSet ml-2 positive d-block mb-2 text-center btn btn-sm btn-primary themed-button">
                                                        <span><span class="icon-check"></span></span>
                                                        </button>
                                                    </div>
                                                    <p class="alert alert-danger w-100 mt-2" v-if="errors.length">
                                                        <ul >
                                                        <li v-for="(error, key) in errors" :key="key">{{ error }}</li>
                                                        </ul>
                                                    </p>
                                                    
                                                </form>                                                
                                            </div>
                                            <div class="content-search-opp">                                                    
                                                    <ul class="list-result-opp" >
                                                        <LoadingSpinner v-if="loadingOpportunities" />
                                                        <li class="text-right" v-if="opportunities.length > 0">
                                                            <span  @click="resetSearch"><i class="icon-times-circle"></i></span>
                                                        </li>
                                                        <li v-for="(opportunity, key) in opportunities" :key="key"  @click="opportunitySelected(opportunity)">
                                                           {{opportunity.business_name}} - {{opportunity.campaign_name}}
                                                        </li>
                                                    </ul>

                                            </div>
                                            <div class="mt-2">
                                                    <div class="pt-2 pb-3"  v-if="oppSelected">
                                                        <div class="w-100 d-flex justify-content-between align-items-center">
                                                            <span class="text-left font-weight-bold">{{oppSelected.business_name}} - {{oppSelected.campaign_name}}</span>
                                                            <i  @click="resetOppSelected" class="icon-minus-square-o c-pointer"></i>
                                                        </div>
                                                    </div>
                                                    
                                            </div>
                                            
                                        </div>
                                    </div>

                                </div>

                                <div v-if="this.selected.business_contact_email !== null">
                                    <!-- Calificar un email -->
                                    <!-- <div class="mt-2" v-if=" selected.status !== 'positive' ">                         
                                        <button  @click="setAsValidEmail(2)" class="btnSet positive d-block mb-2 text-center w-100 btn btn-sm btn-success pr-4 pl-4">
                                            <span>{{ $t('lang.button.engagement') }}</span>
                                        </button>
                                    </div>  -->
                                    <div class="mt-2" v-if=" selected.status !== 'negative' ">                         
                                        <button  @click="setAsValidEmail(3)" class="btnSet positive d-block mb-2 text-center w-100 btn btn-sm btn-danger pr-4 pl-4">
                                            <span>{{ $t('lang.button.removeemail') }}</span>
                                        </button>
                                    </div>
                                    <div class="mt-2" v-if=" selected.status !== 'valid' ">                         
                                        <button  @click="setAsValidEmail(4)" class="btnSet positive d-block mb-2 text-center w-100 btn btn-sm btn-success pr-4 pl-4">
                                            <span>{{ $t('lang.button.showemail') }}</span>
                                        </button>
                                    </div> 
                                </div>

                            </div>
                            <!--<div class="col-md-6">
                                <p class="p-3 font-weight-bold">{{ $t('lang.label.createopportunity') }}</p>
                                <div class="card p-4">
                                    <div>
                                        <div class="mt-2">
                                            <button  @click="createOpportunity" :disabled="isDisabledCO" class="btnSet positive d-block mb-2 text-center w-100 btn btn-sm btn-primary themed-button">
                                                <span>{{ $t('lang.label.createopportunity') }}</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>-->
                        <div class="col-sm-12 col-md-12">
                                <div>
                              <div style='min-height:180px;' class="card notEffect p-3 mb-2">
                                            <div class="">
                                                    <div class="row pt-2">
                                                        <div class="col-1"></div>
                                                        <div class="col-11">
                                                            <div class="d-flex justify-content-between align-items-center">
                                                                <div class="d-flex align-items-center">
                                                                    <h5>{{ selected.response_subject }}</h5>
                                                                    <span class="ml-2 mb-1 badge " :class="statusBadge(selected.status)">{{  selected.status }}</span>
                                                                </div>
                                                                <div class="">
                                                                    <span class="email-info-right">{{  selected.response_date | formatDatePretty  }}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="row pt-3 pb-4">
                                                        
                                                        <div class="col-1">
                                                             <div class=" position-relative">
                                                                <div class="position-absolute">
                                                                    <span class="icoCircle mail"><span>
                                                                        {{ selected.response_from | firstLetter }}
                                                                       </span></span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="col-11">
                                                            <div class="d-flex justify-content-between">
                                                                <div class="">
                                                                        <span class="nameClient mb-1 d-inline font-weight-bold">{{  selected.response_from }}</span>
                                                                        <p class="nameClient mb-1 ml-2 d-inline">{{  selected.response_from }}</p>
                                                                </div>
                                                            </div>
                                                            <p class=""><small> To: {{  selected.response_from }}</small></p>
                                                            <div class=" mt-4" >
                                                                    <div>

                                                                        <p v-html="quoted_printable_decode(selected.response_message)" class="email-body">{{  selected.response_message }}</p>
                                                                    </div>
                                                            </div>
                                                        </div>
                                                </div> 
                                            </div>
                                    </div>                            
                            </div>
                             <!--REPLY CARD-->
                            <replyEmail :selected="selected" :close="false"></replyEmail>
                            <!--//REPLY CARD-->
                            
                        </div>
                       
                            
                        
                        
                            
                        
                    </div>
                </div>
        </main>
    </section>
</template>
<script>


import { mapState, mapActions } from "vuex";
import { router } from "@/_helpers";
import Header from "@/components/Header.vue";
import replyEmail from "@/components/Emails/replyEmail.vue";
import { statusBadgeMixin, linksMixin } from "@/_mixins/";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import { emailsService, businessesService, opportunitiesService, campaignsService, businessContactsService } from "@/_services";
import  ActionButtons  from "@/components/Emails/ActionButtons.vue";
const sleep = d => new Promise(r => setTimeout(r, d));


export default {
     data() {
        return {
            errors: [],
            opportunities: [],
            oppSelected:null,
            loadingOpportunities: false,
            oppContacts: [],
            contactSelected:null,
            loadingContacts: false,
            searchOpportunities: "",
            selectedCampaign: "",
            campaigns: [],
            opp: false,
            createOpp: false,
        }
    },
    props: {
        selectedEmailId: String,
        selectedEmailSubject:String
    },

    mixins: [statusBadgeMixin, linksMixin],

    components: {
        Header,
        replyEmail,
        ActionButtons,
        LoadingSpinner,    
    },

  computed: {
    ...mapState({
        loading: state => state.emails.loading,
        selected: state => state.emails.selected.data,
        currentUser: state => state.authentication.user
    }),  
    ...mapState({
        headerTab: state => state.header.tab
    })},
    
    isDisabled() {
        return this.opp;
    },

    isDisabledCO() {
        return this.createOpp;
    },

    user() {
      return this.$store.state.authentication.user;
    },

    created() {
        this.getEmail();
    },

    watch: {
        loading: function() {
            this.setTargetBlank(this.loading, "email-body", sleep);
        },
    },
    
    methods: {
        ...mapActions("header", {
            changeHeaderTab: "changeTab"
        }),
         ...mapActions("emails", {
            getEmailById: "getById",
             getPriorityOpportunity: "getPriority",
            resetPriorityOpportunity: "resetPriority",
            startLoading: "startLoading",
            finishLoading: "finishLoading",
            startLoadingOpportunities: "startLoadingOpportunities",
            finishLoadingOpportunities: "finishLoadingOpportunities"
        }),
        
        checkForm(e) {
            this.errors = [];
            if (!this.searchOpportunities) {
                this.errors.push("This field can not be blank.");
                return false;
            }
            if(this.searchOpportunities.length < 3){
                this.errors.push("Enter at least three letters.");
                return false;
            }
            if (!this.errors.length) {
                return true;
            }
            e.preventDefault();
            
        }, 
        quoted_printable_decode (str) { // eslint-disable-line camelcase
        
      

         if(str.indexOf('=E9') && !str.indexOf('http'))  {


         var RFC2045Decode1 = /=\r\n/gm
          // the RFC states against decoding lower case encodings, but following apparent PHP behavior
          var RFC2045Decode2IN = /=([0-9A-F]{2})/gim
          var RFC2045Decode2OUT = function (sMatch, sHex) {
            return String.fromCharCode(parseInt(sHex, 16))
          }

          return str.replace(RFC2045Decode1, '')
            .replace(RFC2045Decode2IN, RFC2045Decode2OUT)

         }
        
        return str;



        },    
        getEmail() {
                this.searchEmail();
        },
        searchEmail() {
            this.getEmailById({
                id: this.selectedEmailId 
            });
        },
        searchContacts(){
            this.loadingContacts = true;
            opportunitiesService.getContacts(this.selected.link_id)
            .then(result => {
                this.oppContacts = result;
            }).then(result=> {
                this.loadingContacts = false;
            });
        },
        deleteEmail() {
                this.$swal({
                    type: 'warning',
                    title: this.$t('lang.label.areyousure'),
                    text: this.$t('lang.label.youwontbeabletorevertthis'),
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33a2c',
                    confirmButtonText: this.$t('lang.label.yesdeletethem')
                }).then((result) => {
                    if (result.value) {
                                this.$swal({
                                    type: 'success',
                                    title: this.$t('lang.label.deleted'),
                                    text: this.$t('lang.label.emailhasbeendeleted'),
                                    showConfirmButton: false,
                                    timer: 1500
                                })
                    }
                })
        },
        
       
    qualifiedOpportunity(qualificationOptions) {
      this.startLoading();
      opportunitiesService
        .changeStatus(
          8,
          qualificationOptions.linkId,
          qualificationOptions.statusReason
        )
        .then(data => {
          this.searchEmail();
        });
    },
     disqualifiedOpportunity(qualificationOptions) {
      this.startLoading();
      opportunitiesService
        .changeStatus(
          5,
          qualificationOptions.linkId,
          qualificationOptions.statusReason,
          qualificationOptions.nextCampaignId,
          qualificationOptions.campaignDate
        )
        .then(data => {
          this.searchEmail();
        });
    },
         doNotContactBusiness(qualificationOptions) {
            this.$swal({
                type: "warning",
                title: this.$t('lang.label.areyousure'),
                text: this.$t('lang.label.donotcontactthisbusiness'),
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33a2c",
                confirmButtonText: this.$t('lang.label.yesdonotcontactthem')
            }).then(result => {
                if (result.value) {
                this.startLoading();
                opportunitiesService
                    .changeStatus(
                    10,
                    qualificationOptions.linkId)
                    .then(data => {
                    this.searchEmail();
                    });
                }
            });
            },
            deleteBusiness(qualificationOptions) {
                this.$swal({
                    type: "warning",
                    title: this.$t('lang.label.areyousure'),
                    text: "this.$t('lang.label.youaregoingtodelete') ${this.selected.business_name}",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33a2c",
                    confirmButtonText: this.$t('lang.label.yesdeletethem')
                }).then(result => {
                    if (result.value) {
                    this.startLoading();
                    opportunitiesService
                    .changeStatus(
                    11,
                    qualificationOptions.linkId)
                    .then(data => {
                    this.searchEmail();
                    });
                }
                });
            },

        changeTab(selectedTab) {
            this.changeHeaderTab({ tab: selectedTab });
        },
        setAsValidOpportunity(event){
            this.$swal({
                    type: 'warning',
                    title: this.$t('lang.label.setasvalidopportunity'),
                    text: "",
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33a2c',
                    confirmButtonText: 'ok'
                }).then((result) => {
                    if (result.value) {
                                this.$swal({
                                    type: 'success',
                                    title: this.$t('lang.label.great'),
                                    text: "",
                                    showConfirmButton: false,
                                    timer: 1500
                                })
                    }
                })
        },
        getOpportunities(){
             this.loadingOpportunities = true;
            opportunitiesService.getListOpportunities(this.searchOpportunities)
            .then(result => {
                this.opportunities = result;
            }).then(result=> {
                this.loadingOpportunities = false;
            });
            
        },
        getContacts(){
           
            opportunitiesService.getContacts(this.selected.link_id)
            .then(result => {
                this.oppContacts = result;
            }).then(result=> {
               
            });
            
        },
        confirmSearch() {
            if(this.checkForm()){
                this.getOpportunities();
            }
        },
        resetSearch() {
            this.searchOpportunities = "";
            this.opportunities = [];
        },
        opportunitySelected(opportunity){
            this.resetSearch();
            this.oppSelected=opportunity;
        },
        resetOppSelected() {
            this.oppSelected = null;
        },
        contactSelect(contact){
            this.contactSelected=contact;
        },
        resetContactSelected() {
            this.contactSelected = null;
        },
        associateOpportunity(){
            this.$swal({
                    type: 'warning',
                    title: this.$t('lang.label.setopportunity'),
                    text: "",
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33a2c',
                    confirmButtonText: 'Ok'
                }).then((result) => {
                 if (result.value) {
                    this.opp = true;
                    this.startLoading();
                    emailsService.associateOpportunity( this.selectedEmailId ,this.oppSelected)
                    .then(emails => {
                        this.$swal({
                        type: "success",
                        title: this.$t('lang.label.great'),
                        text: this.$t('lang.label.emailassociatedsuccessfully'),
                        showConfirmButton: false,
                        timer: 1500
                        }).then(result => {
                        this.$emit("associateOpportunity");
                        });
                    }).then(result=> {
                        this.searchEmail();
                    });
                 }    
             });
        },
        createOpportunity(){
            this.$swal({
                    type: 'warning',
                    title: this.$t('lang.label.setopportunity'),
                    text: "",
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33a2c',
                    confirmButtonText: 'Ok'
                }).then((result) => {
                 if (result.value) {
                    this.createOpp = true;
                    this.startLoading();
                    emailsService.createOpportunity(this.selectedEmailId)
                    .then(emails => {
                        this.$swal({
                        type: "success",
                        title: this.$t('lang.label.great'),
                        text: this.$t('lang.label.emailassociatedsuccessfully'),
                        showConfirmButton: false,
                        timer: 1500
                        }).then(result => {
                        this.$emit("associateOpportunity");
                        });
                    }).then(result=> {
                        this.searchEmail();
                    });
                 }    
             });
        },
        associateBusinessContact(){
            this.$swal({
                    type: 'warning',
                    title: this.$t('lang.label.setcontact'),
                    text: "",
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33a2c',
                    confirmButtonText: 'Ok'
                }).then((result) => {
                 if (result.value) {
                    this.startLoading();
                    emailsService.associateBusinessContact( this.selectedEmailId ,this.contactSelected)
                    .then(emails => {
                        this.$swal({
                        type: "success",
                        title: this.$t('lang.label.great'),
                        text: this.$t('lang.label.emailassociatedsuccessfully'),
                        showConfirmButton: false,
                        timer: 1500
                        }).then(result => {
                        this.$emit("associateBusinessContact");
                        });
                    }).then(result=> {
                        this.searchEmail();
                    });
                 }    
             });    

        },

        setAsValidEmail(status_id){
            this.$swal({
                    type: 'warning',
                    title: this.$t('lang.label.areyousure'),
                    text: "",
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33a2c',
                    confirmButtonText: 'Ok'
                }).then((result) => {
                 if (result.value) {
                    this.startLoading();
                    emailsService.setValidStatus( this.selectedEmailId ,status_id, this.selected.response_message)
                    .then(emails => {
                        this.$swal({
                        type: "success",
                        title: this.$t('lang.label.great'),
                        text: this.$t('lang.label.emailsetasvalidsuccessfully'),
                        showConfirmButton: false,
                        timer: 1500
                        }).then(result => {
                        this.$emit("setAsValidEmail");
                        });
                    }).then(result=> {
                        this.searchEmail();
                    });
                 }    
             });    

        },

        changeStatusBusinessContactAction(statusId){
            this.$swal({
                    type: 'warning',
                    title: this.$t('lang.label.areyousure'),
                    text: "",
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33a2c',
                    confirmButtonText: 'Ok'
                }).then((result) => {
                 if (result.value) {
                    this.startLoading();
                    businessContactsService.changeStatus(this.selected.business_contact_id, statusId)
                    .then(emails => {
                        this.$swal({
                        type: "success",
                        title: this.$t('lang.label.great'),
                        text: this.$t('lang.label.emailsetasvalidsuccessfully'),
                        showConfirmButton: false,
                        timer: 1500
                        }).then(result => {
                        this.$emit("setAsValidEmail");
                        });
                    }).then(result=> {
                        this.changeTab('ALL');
                    });
                 }    
             });
        }
   
   
    }

}

</script>
<style>
.email-body {
    white-space: pre-wrap;
}

.email-body * {
    white-space: initial;
}
.md-chip{
    height: 32px;
    padding: 0 12px;
    display: inline-block;
    cursor: default;
    border-radius: 32px;
    transition: .3s cubic-bezier(.25,.8,.25,1);
    transition-property: background-color,color,opacity,transform,box-shadow;
    will-change: background-color,color,opacity,transform,box-shadow;
    font-size: 13px;
    line-height: 32px;
    vertical-align: middle;
    white-space: nowrap;
    cursor: pointer;
}
.md-default{
    background-color:rgb(162, 158, 158);
    color:white;
}
.content-search-opp{
    position: relative;
}
.list-result-opp{
    position: absolute;
    background-color: white;
    top: 5px;
    width: 100%;
}
.list-result-opp li{
    padding: 5px;
    font-size: 13px;
    font-weight: 600;
}
.list-result-opp li:hover{
    background-color:rgb(217, 212, 212);
    cursor: pointer;
    
}
.list-result-opp li:first-child{
    padding-top: 0;
    padding-bottom: 0;
    font-size: 14px;
    max-height: 8px;
}
.list-result-opp li:first-child:hover{
    background-color: transparent;
}
.c-pointer{
    cursor: pointer;
}
.divider{
    background-color: rgba(0,0,0,.12);
    margin-top: -1px;
    height: 1px;
    margin: 0;
    padding: 0;
    display: block;
    border: 0;
    transition: margin-left .3s cubic-bezier(.4,0,.2,1);
    will-change: margin-left;
}
.list{
    padding: 1.2em !important;
}

.content-search-opp .loading-spinner {
    width: 3rem;
    height: 3rem;
}

.content-search-opp .spinner-container {
    height: auto;
}

</style>