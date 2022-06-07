<template>
    <div>
          <section class="start hv-100">
                <div class="d-flex align-items-center justify-content-center h-100">
                <div class="container">
                    <h2 class="text-center mb-4">{{ $t('lang.label.welcometooliver') }}</h2>
                    <h3 class="text-center mb-4">{{ $t('lang.label.letsgetstarted') }}</h3>
                    <p class="text-center text-uppercase cdarkgray">{{ $t('lang.label.step13') }}</p>
                    <div class="d-flex justify-content-center  pt-4">
                    <div class="card cardaccount rounded-2 p-4  cursor-pointer" @click="goToStep(2)">
                        <i class="icon-touch_app icon-lg mb-2"></i>
                        <p class="mt-3 mb-2">{{ $t('lang.label.ifyouarenewtooliver') }}</p>
                        <h2 class="my-2"> {{ $t('lang.label.discover') }} </h2>
                        <i class="icon-long-arrow-right text-right"></i>
                    </div>
                    <!-- <div class="card cardaccount rounded-2 p-4 cursor-pointer" @click="goToStep(5)">
                        <i class="icon-group-outline icon-lg mb-2"></i>
                         <p class="mt-3 mb-2">{{ $t('lang.label.ifyourteamalreadyusesoliver') }}</p>
                        <h2 class="my-2"> {{ $t('lang.label.joinyourteam') }}</h2>
                         <i class="icon-long-arrow-right text-right"></i>
                    </div> -->

                </div>
                <div class="d-flex mt-2 justify-content-center">
                     <router-link to="/login">{{ $t('lang.button.logout') }}</router-link>
                </div>
                <!-- <div class="lettersCircle">
                    <router-link to="/login">
                      <span class="icoCircle sidebar">
                        <span class="letters">{{ (user.name + ' ' + user.lastname) | firstLetters }}</span>
                        <span class="icon-switch d-lg-block"></span>
                      </span>
                   
                </div> -->
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
    props: {
        user: Object
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