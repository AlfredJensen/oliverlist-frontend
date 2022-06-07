<template>
    <div>
        <section class="second-step-company">
            <div class="pding-4 psm-0">
                 <div class="container">
                    <div class="row ">
                        <div class="col-sm-12 col-lg-6  mx-auto mt-4">
                            <div class="pding-4 psm-0">

                            <h2 class="text-center mb-4">{{ $t('lang.label.aboutyourcompany') }}</h2>
                                <div v-if="alert.message" :class="`login-alert alert ${alert.type}`">{{alert.message}}</div>
                                <p class="text-center text-uppercase cdarkgray">{{ $t('lang.label.step23') }}</p>

                             <form class="mt-4"  v-on:submit.prevent="handleSubmit">
                               <div class="form-row my-4">
                                    <div class="col">
                                        <label for="CompanyEmail" class="font-weight-bolder pb-2">{{ $t('lang.label.companyname') }}</label>
                                        <div class="col-sm-10 pl-0">
                                            <input type="text" v-model="company" class="form-control" id="CompanyEmail" v-bind:placeholder="$t('lang.label.name')" required="true">
                                        </div>
                                    </div>
                                </div>
                                <div class="form-row my-4">
                                    <div class="col">
                                        <label for="CompanyEmail" class="font-weight-bolder pb-2">{{ $t('lang.label.website') }}</label>
                                        <div class="col-sm-10 pl-0">
                                            <input type="text" class="form-control" v-model="website" id="CompanyEmail" placeholder="https://example.fr/"   required="true">
                                        </div>
                                    </div>
                                </div>
                               
                                <div v-if="alert.message && !submittedSecond" :class="`alert ${alert.type}`">{{alert.message}}</div>
                                <div v-if="submittedSecond && errors.length>0">
                                                    <div class="mt-4">
                                                        <AlertError :msgError="''" />
                                                    </div>
                                                 </div>
                                <div v-if="errors.length" class="alert alert-danger"><li v-for="error in errors">{{ error }}</li></div>
                                <button class=" btn btn-primary themed-button text-right" @click="goToStep(1)">{{ $t('lang.button.back') }}</button>
                                <button class="ml-1 ml-sm-3 btn btn-primary themed-button text-right" >{{ $t('lang.button.createmycompany') }}</button>
                            </form>

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
import AlertError from "@/components/AlertError.vue";

export default {
    components: {
    AlertError,
  },
    computed: {
        ...mapState({
            companyCreated: state => state.clients.status.companyCreated
        }),
        alert() {
          return this.$store.state.alert;
        }
    },
    created() {
        this.$store.dispatch("alert/clear");
        this.disableEnter();
    },
    watch: {
        companyCreated: function(){
            this.goToStep(4);
        }
    },
    data(){
        return {
            errors: [],
            company : "",
            website: "",
            submitted: false,
            submittedSecond:false,
        }
    },
    methods:{
            checkForm: function (e) {

              this.errors = [];

              if(this.company && this.website && this.websiteIsValid()){    
                 return true;
              }

              return false;

            },
            handleSubmit(e) {
                this.submitted ? this.submittedSecond =true : this.submitted=true;
                const { company, website } = this;
                const { dispatch } = this.$store;
                if(this.checkForm()){
                    dispatch("clients/create", { company,website });
                }
            },
            websiteIsValid(){
                var pattern = /^(http|https)?:\/\/[a-zA-Z0-9-\.]+\.[a-z]{2,4}/;
                if(!pattern.test(this.website)){
                    this.errors.push('The website is not valid')
                    return false;
                }

                return true;
            },
            goToStep(step){
                this.$emit("goToStep",step);
            },
            disableEnter(){
                window.addEventListener('keydown',function(e){
                    if(e.keyIdentifier=='U+000A'||e.keyIdentifier=='Enter'||e.keyCode==13){
                        if(e.target.nodeName=='INPUT'&&e.target.type=='text'){
                            e.preventDefault();
                            return false;
                            }}},true);
            }
    }

}
</script>
<style>

.pding-4{
    padding: 1.5rem;
}

@media(max-width: 425px){
    .psm-0{padding: 0px !important;}
}
</style>