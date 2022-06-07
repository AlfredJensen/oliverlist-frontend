<template>
<div id="app" class="bg-white">
  <div class="ml-2 mr-2">
      <section :class="animation">
        <div class="input-fields">
          <SignUpFirst :user="user" @goToStep="goToStep($event)"  v-if="activeStep == 0" :step="activeStep+1"  :total="formSteps.length"/>
        </div>
      </section>
  </div>
</div>
</template>

<script>
import SignUpFirst from "@/components/SignUp/Steps/SignUpFirst.vue";


export default {

  components: {
    SignUpFirst
  },

  props: {
    user: Object
  },

  data () {
      var active = 0
      if(this.user && this.user.verificationcode != null){
        active = 0
      }else{
        if(this.user && this.user.client_id == null){
          active = 1
        }else{
           if(this.user && this.user.client_id != null){
            active = 1
          }
        }
      }
    	return{
  	    activeStep: active,
  	    animation: 'animate-in',
  	    formSteps: []
  	}
  },
  methods: {
    goToStep(active){
      this.animation = 'animate-out';
      setTimeout(() => {
        this.animation = 'animate-in';
        this.activeStep = active;
      }, 60);
    },
  }
  }
</script>
