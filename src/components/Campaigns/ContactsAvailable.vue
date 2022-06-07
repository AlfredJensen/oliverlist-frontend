<template>
  <div class="col-12 card-contacts">
    <div>

      <small class="d-block" v-if="!loading">

        <Tooltip
          :text="$t('lang.campaigns_dashboard.availableinfo')"
          :width="'auto'"
        >
          <i class="icon icon-circle text-success"></i>

          <span class="ml-1" :class="campaign.available_contacts < 10 ? 'text-secondary' : ''">
          {{ campaign.available_contacts }}
          </span>
          {{ $t("lang.campaigns_dashboard.available") }}
         
        </Tooltip> 

  
         <span
          class="ml-2"
          v-if="verified"
        >
          (<span>
          {{verified}} verified
          </span>)
        </span> 

        <small class="bg-primary ml-1 p-1 text-white rounded d-inline" 
        v-if="buttons && campaign.available_contacts < 10 && (this.$route.fullPath == '/dashboard' || this.$route.fullPath == '/dashboardfirst')">
          <router-link to="/mysearchs"
                              >
                             <i class="icon-plus"></i>
                              </router-link></small>
      </small>
        <small class="bg-primary ml-1 p-1 text-white rounded" 
        v-if="buttons && campaign.available_contacts < 10 && this.$route.fullPath != '/dashboard'">
          <router-link
                              
                              to="/mysearchs"
                              >
                              <i class="icon-plus"></i>
                              {{$t('lang.label.addcontacts')}}
                              </router-link></small>
      </small>

   

                          
      <span
        v-if="loading"
        style="width: 5px; height: 5px"
        class="float-left d-flex p-2 spinner-border loading-spinner mx-auto"
        role="status"
      >
      </span>

      <small class="d-block" v-if="campaign.active_contacts > 0">
        <Tooltip
          :text="$t('lang.campaigns_dashboard.activesinfo')"
          :width="'auto'"
        >
          <i class="icon icon-circle text-warning"></i>

          {{ campaign.active_contacts }}
          {{ $t("lang.campaigns_dashboard.actives") }}
        </Tooltip>
      </small>

      <small class="d-block" v-if="campaign.inactive_contacts > 0">
        <Tooltip
          :text="$t('lang.campaigns_dashboard.inactivesinfo')"
          :width="'auto'"
        >
          <i class="icon icon-circle text-muted"></i>
          {{ campaign.inactive_contacts }}
          {{ $t("lang.campaigns_dashboard.inactives") }}
        </Tooltip>
      </small>

     
    </div>
  </div>
</template>
<script>
import { campaignsService } from "@/_services";
import Tooltip from "@/components/Common/Tooltip.vue";

export default {
  data() {
    return {
      loading: true,
      campaign: Object,
    };
  },
  components: {
    Tooltip,
  },
  props: {
    verified:false,
    id: String,
    buttons:true
  },
  created() {
    campaignsService.getContactInfo(this.id).then((response) => {
      this.campaign = response;
      this.loading = false;
    });
  },
  methods: {},
};
</script>
