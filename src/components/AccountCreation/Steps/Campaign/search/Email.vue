<template>
   <span>

    <span 

    v-if="showemail && !limit" class="display-block w-100">
    
    <small v-if="status_email != 3 && email != 'notfound'" class="icon-unlock text-primary mr-2"></small>


   
    <Tooltip
      v-if="status_email == '3' && email != 'notfound'"
            :width="'auto'"
            :text="$t('lang.campaign_parameters.risky-email-desc')">
            <small class="icon-unlock text-warning mr-2"></small>
    </Tooltip>

    <small v-if="status == 9 || email == 'notfound'" class="icon-circle-o text-secondary mr-2"></small>

  

    <Tooltip
      v-if="email != 'notfound'" 
      :text="email">
      {{email}}
    </Tooltip>

    <Tooltip
      v-if="status == 9 || email == 'notfound'"
      :text="$t('lang.general.wework')">
      <span >
      {{ $t("lang.label.insearch") }}
    </span>
    </Tooltip>


    
    </span>


    <span v-if="limit && showemail" class="text-danger display-block w-100">
   
    <small class="icon-lock text-danger mr-2"></small>
      {{$t('lang.mycontacts.previewlimit')}}
    </span>

    
          
    <button class="btn btn-sm btn-primary px-1 py-0 "  
    v-if="loadingunlock && !limit" >
       <i>
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="margin:auto;background:transparent;display:block;" width="10px" height="10px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
        <g transform="rotate(0 50 50)">
          <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#ffffff">
            <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.9166666666666666s" repeatCount="indefinite"></animate>
          </rect>
        </g><g transform="rotate(30 50 50)">
          <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#ffffff">
            <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.8333333333333334s" repeatCount="indefinite"></animate>
          </rect>
        </g><g transform="rotate(60 50 50)">
          <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#ffffff">
            <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.75s" repeatCount="indefinite"></animate>
          </rect>
        </g><g transform="rotate(90 50 50)">
          <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#ffffff">
            <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.6666666666666666s" repeatCount="indefinite"></animate>
          </rect>
        </g><g transform="rotate(120 50 50)">
          <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#ffffff">
            <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.5833333333333334s" repeatCount="indefinite"></animate>
          </rect>
        </g><g transform="rotate(150 50 50)">
          <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#ffffff">
            <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.5s" repeatCount="indefinite"></animate>
          </rect>
        </g><g transform="rotate(180 50 50)">
          <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#ffffff">
            <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.4166666666666667s" repeatCount="indefinite"></animate>
          </rect>
        </g><g transform="rotate(210 50 50)">
          <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#ffffff">
            <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.3333333333333333s" repeatCount="indefinite"></animate>
          </rect>
        </g><g transform="rotate(240 50 50)">
          <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#ffffff">
            <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.25s" repeatCount="indefinite"></animate>
          </rect>
        </g><g transform="rotate(270 50 50)">
          <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#ffffff">
            <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.16666666666666666s" repeatCount="indefinite"></animate>
          </rect>
        </g><g transform="rotate(300 50 50)">
          <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#ffffff">
            <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.08333333333333333s" repeatCount="indefinite"></animate>
          </rect>
        </g><g transform="rotate(330 50 50)">
          <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#ffffff">
            <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="0s" repeatCount="indefinite"></animate>
          </rect>
        </g>
        </svg>
        </i>
    
      {{$t('lang.search.loading')}}
    </button>
      <Tooltip
      v-if="!loadingunlock && !showemail"
              :text="$t('lang.notification.lockemail')"
              :width="'auto'" >
              <small class="icon-lock text-primary mr-2"></small>
              </Tooltip>

    <button v-if="!loadingunlock && !showemail"  @click="unlockemail" 
   
    class=" px-1 py-0 btn btn-sm btn-outline-primary"  
    >    
      {{$t('lang.button.save')}}
       
      </button>
    



    
    </span>
</template>
<script>
import { businessContactsService } from "@/_services";
import Tooltip from "@/components/Common/Tooltip.vue";

export default {
  data(){
    return {
     loadingunlock:false,
     limit:false,
     showemail:true,
    }
  },
  components: {
    Tooltip
  },
  props: {
    model:Array,
    rowkey: Number,
    email: String,
    status: String,
    status_email:String,
    id: String
  },
  created(){
    if(this.status == 2){
      this.email = false
      this.showemail = false
    }


    if(this.email == "limitmax"){
      this.limit = true
    }else{
      this.email = this.model[this.rowkey].email
     
      if(!this.email){
        this.getEmail()
      }
    }

  },
  methods: {
    getStatusClass(type){
      switch (type) {
        case "1":
          return "icon-circle mr-1 text-success"
          break;
        case "2":
          return "icon-circle mr-1 text-warning"
          break;
        case "3":
          return "icon-circle mr-1 text-success"
          break;
        case "9":
          return "icon-circle mr-1 text-danger"
          break;
      }
    },
    getStatusText(type){
      switch (type) {
        case "1":
          return "Verified"
          break;
        case "2":
          return "Searching email"
          break;
        case "3":
          return "Verified"
          break;
        case "9":
          return this.$t("lang.label.insearch")
          break;
      }
    },

    getEmail(){
      this.loadingunlock = true
      businessContactsService.getEmail(this.id).then(
        (response) => {
          if(response.email){
            this.showemail = true
            this.email = response.email
            this.status_email = response.status_email
            this.model[this.rowkey].email = response.email
            this.model[this.rowkey].status_email = response.status_email
          }else{
            this.showemail = false
          }
            this.loadingunlock = false
        }
      );
    },
    unlockemail(){
      if(this.email == 'notfound'){
        this.showemail = true
        return false
      }
      this.loadingunlock = true
      businessContactsService.previewEmail(this.id).then(
        (response) => {

 
          setTimeout(function () {
            if(response.email == "limitmax"){
              this.showemail = true
              this.limit = true
            }else{
              if(response.email == "notfound"){
                this.showemail = true
                this.status = 9
              }
              this.limit = false
            }
            if(response.email == false){
              this.showemail = false
            }else{
              this.showemail = true
            }
            this.email = response.email
            this.status_email = response.status_email
            this.model[this.rowkey].email = response.email
            this.model[this.rowkey].status_email = response.status_email
            this.loadingunlock=false
            
          }.bind(this), 500)

        }
      );
    }
  }
}

</script>