<template>
    <div>
          <section class="start hvmd-100 margin-sm">
                <div class="d-flex align-items-center justify-content-center h-100">
                <div class="container">
                    <h2 class="text-center mb-4">{{ $t('lang.label.letsgetstarted') }}</h2>
                    <p class="text-center text-uppercase cdarkgray">{{ $t('lang.label.step33') }}</p>
                   
                        <div class="d-flex justify-content-center  pt-4">
                             <div class="row">
                                 <div class="col-sm-12 col-md-12 col-lg-6">
                                <div class="card cardaccount rounded-2 p-4 cursor-pointer ht" @click="goToStep(6)">
                                    <i class="icon-star icon-lg mb-2"></i>
                                    <p class="mt-3 mb-2">{{ $t('lang.label.recommended') }}</p>
                                    <h2 class="my-2"> {{ $t('lang.label.createmy') }} <br> {{ $t('lang.label.firstcampaign') }} </h2>
                                    <i class="icon-long-arrow-right text-right"></i>
                                </div>
                                </div>
                                <div class="col-sm-12 col-md-12 col-lg-6">
                                <div class="card cardaccount rounded-2 p-4 mtmd-4 cursor-pointer ht" @click="goToPage('/dashboard')">
                                    <i class="icon-forward icon-lg mb-2"></i>
                                    <p class="mt-3 mb-2">{{ $t('lang.label.skip') }} </p>
                                    <h2 class="my-2 "> {{ $t('lang.label.startusingoliver') }} </h2>
                                    <i class="icon-long-arrow-right text-right"></i>
                                </div>
                                </div>

                            </div>
                        </div>
                </div>
                </div>
                
        </section>
    </div>
</template>
<script>
import { router } from "@/_helpers";

export default {
    data(){
        return {
        }
    },
    created() {
        
    },
    methods:{
            goToStep(step){
                this.$emit("goToStep",step);
            },
            goToPage(url){
                this.$router.push(url)
            }
    }

}
</script>
<style>
@media(min-width:992px){
  .hvmd-100{  
 height: 100vh;}
 .mrmd-4{
     margin-right: 3em;
 }
}
@media(max-width:991px){
    .margin-sm{
        margin-top:4em;
        margin-bottom:4em;
    }
    .mtmd-4{
        margin-top:2em;
    }
}
.start h2.wd{max-width: 230px;}
.ht{
    min-height: 260px;
}
</style>