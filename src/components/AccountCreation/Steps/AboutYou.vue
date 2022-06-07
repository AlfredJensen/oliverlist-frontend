
<template>
    <div>
        <section class="second-step-about">
            <div class="pding-4 ptb">
                 <div class="container">
                    <div class="row ">
                        <div class="col-sm-12 col-lg-6  mx-auto mt-4">
                            <div class="pding-4 ptb">
                            <h2 class="text-center">About You</h2>
                             <p class="text-center text-uppercase cdarkgray">{{ $t('lang.label.step23') }}</p>
                             <form class="mt-4" v-on:submit.prevent="">
                               <div class="form-row my-4">
                                    <div class="col">
                                        <label for="firstname" class="font-weight-bolder pb-4">{{ $t('lang.label.firstname') }}</label>
                                        <div class="col-sm-10 pl-0">
                                            <input type="text" class="form-control" id="firstname" v-model="firstname" v-bind:placeholder="$t('lang.label.firstname')" required="true">
                                        </div>
                                    </div>
                                </div>
                                <div class="form-row my-4">
                                    <div class="col">
                                        <label for="YourName" class="font-weight-bolder pb-4">{{ $t('lang.label.name') }}</label>
                                        <div class="col-sm-10 pl-0">
                                            <input type="text" class="form-control" id="lastname" v-bind:placeholder="$t('lang.label.lastname')" v-model="lastname" required="true">
                                        </div>
                                    </div>
                                </div>
                                <div class="form-row my-4">
                                     <div class="col-sm-10 pl-0">
                                    <label for="Alias" class="font-weight-bolder pb-4">Alias</label>
                                     </div>
                                         <div class="col-sm-4 pl-0">
                                            <input type="text" class="form-control"  v-model="alias" id="alias" placeholder="prenom.nom" required="true">
                                        </div>
                                    <div class="col-sm-1 pl-0 col-flex-sm">
                                        <span class="input-group-text" id="validationTooltipUsernamePrepend">@</span>
                                    </div>
                                    <div class="col-sm-5 pl-0">
                                            <input type="text" class="form-control" id="validationTooltipUsername" aria-describedby="validationTooltipUsernamePrepend" placeholder="oliverlist-mail.com" v-model="domain" required="true">
                                    </div>
                                </div>
                                <button class="ml-3 btn btn-primary themed-button text-right" @click="goToStep(1)">{{ $t('lang.button.back') }}</button>
                                <button class="ml-3 btn btn-primary themed-button text-right" @click="goToStep(3)">{{ $t('lang.button.next') }}</button>
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


export default {
    data(){
        return {
            errors: [],
            firstname:'',
            lastname:'',
            alias:'',
            domain:''
        }
    },

     created() {
     },
    methods:{
            checkForm: function (e) {

              this.errors = [];

              if(this.firstname && this.lastname && this.alias && this.domain){
                 return true;
              }

              return false;

            },
            goToStep(step){
                if(step == 1){
                    this.$emit("goToStep",step);
                }
                if(this.checkForm()){
                    this.$emit("goToStep",step);
                }

            },
    }

}
</script>
<style>
.pding-4{
    padding: 1.5rem;
}

@media(max-width: 425px){
    .ptb{padding-right: 0px !important;padding-left:0px !important;padding-top: 2em;padding-bottom:2em;}
    .col-flex-sm{display: flex;}
}
</style>