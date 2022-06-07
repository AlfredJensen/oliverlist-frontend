<template>
<div id="app" class="bg-white">
  <div class="ml-2 mr-2">
      <section :class="animation">
        <div class="input-fields">
          <AccountCreationFirst :user="user" @goToStep="goToStep($event)"  v-if="activeStep == 0" :step="activeStep+1"  :total="formSteps.length"/>
          <!-- <WelcomeToOliver :user="user" @goToStep="goToStep($event)" v-if="activeStep == 1" :step="activeStep+1"  :total="formSteps.length"/>
           <AboutYourCompany @goToStep="goToStep($event)" ref="parent" v-if="activeStep == 2" :step="activeStep+1"  :total="formSteps.length"/>
         <AboutYou @goToStep="goToStep($event)" ref="parent" v-if="activeStep == 2" :step="activeStep+1"  :total="formSteps.length"/> 
          <GettingStartOliver @goToStep="goToStep($event)" ref="parent" v-if="activeStep == 3" :step="activeStep+1"  :total="formSteps.length"/>
          <JoinYourTeam @goToStep="goToStep($event)" ref="parent" v-if="activeStep == 4" :step="activeStep+1"  :total="formSteps.length"/>
          <AmazingTeam @goToStep="goToStep($event)" ref="parent" v-if="activeStep == 5" :step="activeStep+1"  :total="formSteps.length"/>-->
          <MyFirstCampaign @goToStep="goToStep($event)" ref="parent" v-if="activeStep == 1" :step="activeStep+1"  :total="formSteps.length"/>
        </div>
      </section>
  </div>
</div>
</template>

<script>
import AccountCreationFirst from "@/components/AccountCreation/Steps/AccountCreationFirst.vue";
import WelcomeToOliver from "@/components/AccountCreation/Steps/WelcomeToOliver.vue";
import AboutYourCompany from "@/components/AccountCreation/Steps/AboutYourCompany.vue";
import AboutYou from "@/components/AccountCreation/Steps/AboutYou.vue";
import GettingStartOliver from "@/components/AccountCreation/Steps/GettingStartOliver.vue";
import JoinYourTeam from "@/components/AccountCreation/Steps/JoinYourTeam.vue";
import AmazingTeam from "@/components/AccountCreation/Steps/AmazingTeam.vue";
import MyFirstCampaign from "@/components/AccountCreation/Steps/MyFirstCampaign.vue";

export default {

  components: {
    AccountCreationFirst,
    WelcomeToOliver,
    AboutYourCompany,
    AboutYou,
    GettingStartOliver,
    JoinYourTeam,
    AmazingTeam,
    MyFirstCampaign
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
