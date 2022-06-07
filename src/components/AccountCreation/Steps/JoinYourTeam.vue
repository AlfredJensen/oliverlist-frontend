<template>

        <section class="second-step-about">
            <div class="p-4">
                 <div class="container">
                    <div class="row ">
                        <div class="col-sm-12 col-lg-6  mx-auto mt-4">
                            <div class="p-4">
                            <h2>Let's connect you to your team</h2>
                             <form class="mt-4">
                               <div class="form-row my-4">

  
                              <!-- Another variation with a button -->
                              <div class="input-group">
                                <input type="text" class="form-control" placeholder="Enter Team ID or name to connect">
                                <div class="input-group-append">
                                  <button class="btn btn-secondary" @click="goToStep(5)" type="button">
                                    <i class="icon-search"></i>
                                  </button>
                                </div>
                              </div>
                              

                                </div>
                                
                            </form>
                            </div>
                            <div class="">
                            <button class="ml-3 btn btn-primary themed-button text-right" @click="goToStep(1)">{{ $t('lang.button.back') }}</button>
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