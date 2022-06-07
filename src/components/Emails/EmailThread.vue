<template>
    <section class="emailView">
         <LoadingSpinner v-if="loading" />
         <div  v-if="!loading">
        <ol class="breadcrumb">
            <li  v-if=" this.$route.fullPath == '/emails/:id'" class="breadcrumb-item cursor-pointer" @click="changeTab('ALL')">{{ $t('lang.label.allemails') }}</li>
            <li class="breadcrumb-item active">{{ subject}}</li>
        </ol>
        <main class="contenedor">
                <div class="contentCenter all">
                    <div class="row">
                        <div class="col-sm-12 col-md-11">
                                <div class="card notEffect p-3 mb-2">
                                            <div class="d-flex flex-row justify-content-between align-items-center">
                                                <h4>{{ $t('lang.label.emailthread') }}</h4>
                                            </div>
                                            <h6>{{ $t('lang.label.toseeacompleteemailclickonit') }}</h6>
                                </div>
                                <div>
                                    <!--cadena de emails-->
                                <ul v-for="(chain ,key) in thread.chain" :key="key" >
                                  <li>

                                            <div @click="openmail(chain.id)" class="bg-white card notEffect p-3 mb-2">
                                                    <div class="row pt-2">
                                                        <div class="col-1"></div>
                                                        <div class="col-11">
                                                            <div class="d-flex justify-content-between align-items-center">
                                                                <div class="d-flex align-items-center">
                                                                    <h5>{{ chain.response_subject }}</h5>
                                                                    <span class="ml-2 mb-1 badge"
                                                        :class="statusBadge(chain.status)" >{{ chain.status }}</span>
                                                                </div>
                                                                <div class="">
                                                                    <span class="email-info-right">{{ chain.response_date | formatDatePretty }}</span>
                                                    
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="row pt-3 pb-4">
                                                        
                                                        <div class="col-1">
                                                             <div class=" position-relative">
                                                                <div class="position-absolute">
                                                                    <span class="icoCircle mail"><span> {{ chain.response_from | firstLetter }}</span></span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="col-11">
                                                            <div class="d-flex justify-content-between">
                                                                <div class="">
                                                                        <span class="nameClient mb-1 d-inline font-weight-bold">Label</span>
                                                                        <p class="nameClient mb-1 ml-2 d-inline">{{ chain.response_from }}</p>
                                                                </div>
                                                            </div>
                                                            <p class=""><small> To: {{  chain.response_to }}</small></p>
                                                            <div class=" mt-4"  v-if="thread.idSelectedEmail === chain.id ">
                                                                    <div class="">
                                                                           <p v-html="quoted_printable_decode(thread.emailSelectedMessage)" class="email-body"></p>

                                                                    </div>
                                                            </div>
                                                        </div>
                                                </div> 
                                            </div>
                                  
                                </li>
                            </ul>
                          
                            </div>
                            
                        </div>
                    
                        
                        
                            
                        
                    </div>
                </div>
        </main>
        </div>
    </section>
</template>
<script>
import { mapState, mapActions } from "vuex";
import { router } from "@/_helpers";
import Header from "@/components/Header.vue";
import replyEmail from "@/components/Emails/replyEmail.vue";
import { statusBadgeMixin, linksMixin } from "@/_mixins/";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
const sleep = d => new Promise(r => setTimeout(r, d));

export default {
     data() {
        return {
            subject:'Email Subject',
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
        LoadingSpinner
    },

  computed: {
    ...mapState({
        loading: state => state.emails.loading,
        thread: state => state.emails.thread.data,
        currentUser: state => state.authentication.user
    }),  
    ...mapState({
        headerTab: state => state.header.tab
    })},
    
    user() {
      return this.$store.state.authentication.user;
    },

    created() {
        this.getThread();
       this.subject =this.selectedEmailSubject;
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
            getThreadById: "getThread"
        }),
        openmail(mailid){
          window.open("/emails/"+mailid, "_blank");    
        },
        getThread() {
            this.getThreadById({
                id: this.selectedEmailId 
            })
              
        },
        
        quoted_printable_decode (str) { // eslint-disable-line camelcase
        
                 
         if(str.indexOf('ICAgI')){
         }



         if(str.indexOf('=E9') && !str.indexOf('http')) {


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

        changeTab(selectedTab) {
            this.changeHeaderTab({ tab: selectedTab });
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
        sendEmail(){
            this.$swal({
                    type: 'warning',
                    title: this.$t('lang.label.sendemail'),
                    text: "",
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33a2c',
                    confirmButtonText: this.$t('lang.label.send')
                }).then((result) => {
                    if (result.value) {
                                this.$swal({
                                    type: 'success',
                                    title: this.$t('lang.label.sent'),
                                    text: this.$t('lang.label.emailhasbeensent'),
                                    showConfirmButton: false,
                                    timer: 1500
                                 })
                    }
                })
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
        goToEmail(email_id) {
       
        
            router.push({
                name: "emails",
                params: { id: email_id.toString() }
            });      
        },
        
   
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
</style>