<template>
  <div>
    <section class="third-step-company">
      <div class=" pt-0">
        <div class="row">
          <div class="col-12 mt-4">
            <div class="card p-4">
              <div class="row">
                <YourMessage :model="model" class="w-100" @goToStepCampaign="goToStepCampaign" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
<script>

import Vue from 'vue';
import { formattersMixin } from "@/_mixins/";
import VueFormGenerator from 'vue-form-generator';
import 'vue-form-generator/dist/vfg.css'
import { campaignsService } from "@/_services";
import YourMessage from "@/components/AccountCreation/Steps/Campaign/YourMessage.vue";

VueFormGenerator.validators.availableTokens = function(value, field, model) {
  let tokens = document.getElementsByClassName("token");
  let message = value;
  let i = 0;
  
  for (i = 0; i < tokens.length; i++) {
    let tokenData = tokens[i].getAttribute("data-token");
    
    tokenData = tokenData.replace('[', '\\[').replace(']', '\\]');
    const regexp = new RegExp(`${tokenData}`, 'g')
    message = message.replace(regexp, "");
  }

  if (message.includes("[") || message.includes("]")) {
    return ["Possibly they are using tokens that are not available"];
  }

  return [];
}

export default {
  props: {
    model: Object,
  },
  components: {
    "vue-form-generator": VueFormGenerator.component,
    YourMessage
  },
  data() {
    return {
    }
  },

  mixins: [formattersMixin],

  methods: {
    showNotification(){
      var x = document.getElementById("message-notification");
      x.className = "show";
      setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
    },
    goToStepCampaign(step) {
      this.$emit("goToStepCampaign", step);
    },
  }
} 

</script> 
<style>
#message-notification{
  visibility: hidden;
}
#message-notification.show {
  visibility: visible;
  -webkit-animation: fadein 0.5s, fadeout 0.5s 2.5s;
  animation: fadein 0.5s, fadeout 0.5s 2.5s;
}

@-webkit-keyframes fadein {
  from {bottom: 0; opacity: 0;} 
  to {bottom: 30px; opacity: 1;}
}

@keyframes fadein {
  from {bottom: 0; opacity: 0;}
  to {bottom: 30px; opacity: 1;}
}

@-webkit-keyframes fadeout {
  from {bottom: 30px; opacity: 1;} 
  to {bottom: 0; opacity: 0;}
}

@keyframes fadeout {
  from {bottom: 30px; opacity: 1;}
  to {bottom: 0; opacity: 0;}
}
#message-notification{
  position: relative;
    left: 124px;
    top:0px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid;
    padding-left: 12px;
    padding-right: 12px;
    padding-top: 5px;
    padding-bottom: 5px;
    border-radius: 5px;
    color:#443CEC;
    background-color: #fff;
}
.circle-check{
  border-radius: 50%;
    border: 1px solid #443CEC;
    position: relative;
    height: 30px;
    width: 30px;
    
}
i.icon-check{
  color: #443CEC;
  position: absolute;
    top: 7px;
    left: 7px;
}
  .templates {
    display: grid;
  }
  .title-template {
    font-weight: 500;
  }
  .template {
    background: #F5F6FA;
    border-radius: 3 px;
    padding: 10 px
  }
  button.btn.btn-primary.themed-button.btn-sm.dropdown-toggle.tokens{
      position: inherit;
      top: -271px;
      left: -16px;
  }
  #btn-modif{
    position: relative;
      left: 140px;
  }
  #btn-new{
    position: relative;
      left: 140px;
  }
  label.c-pointer.btn.mr-2.btn-sm.btn-success.float-right{
    position: relative;
    right: -124px;
  }
    label.c-pointer.btn.mr-2.btn-sm.btn-secondary.float-right{
    position: relative;
    right: -124px;
  }
</style>