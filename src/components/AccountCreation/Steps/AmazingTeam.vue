<template>

        <section class="second-step-about amazingteam">
            <div class="padd">
                 <div class="container">
                    <div class="row ">
                        <div class="col-sm-12 col-lg-6  mx-auto mt-4">
                            <div class="padd">
                            <h2>Here is your amazing team</h2>
                             <form class="mt-4">
                               <div class="form-row my-4">

  

                                </div>
                                
                            </form>
                            </div>
                            <div class="">
                            <button class="ml-3 btn btn-primary themed-button text-right" @click="goToStep(2)">{{ $t('lang.button.back') }}</button>

                            <button class="ml-3 btn btn-primary themed-button text-right mt" @click="goToStep(7)">Join your team on Oliver</button>

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
        }
    },

     created() {
     },
    methods:{
            goToStep(step){
                this.$emit("goToStep",step);
            },
    }

}
</script>
<style>
@media(min-width: 425px){
.amazingteam .padd{padding: 1.5rem!important;}
}
@media(max-width: 349px){
    .amazingteam .mt{margin-top:20px;}
}

</style>