<template> 
<div>

<!-- effect-btn -->
<button
      class="w-100 btn btn-sm  btn-primary mt-1 mb-3"
      @click.once="disqualifiedOpportunity(90)"
      >{{ $t('lang.opportunities.relance') }} 90 {{ $t('lang.label.days') }}
      </button>

  <button  
  v-if="openedModal !== 'DISQUALIFIED' && !hasDeclinedPayments"
  class="w-100 btn btn-sm  btn-primary"
  @click="openModal('DISQUALIFIED')"
  >
  <span>{{ $t('lang.opportunities.relance') }}</span>
  </button>
  <div v-if="openedModal === 'DISQUALIFIED'">

  <div v-if="loading" class="spinner-border loading-spinner mx-auto" role="status">
    <span class="sr-only">Loading...</span>
  </div>
  <div v-else>
    <div class="py-3">
      <button @click="openModal('DISQUALIFIED')" type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true">×</span>
    </button>
    </div>  
    <p class="mt-3">{{ $t('lang.label.whendoyouwanttoactivateoliveragain') }}</p>
      <ActionButtonsModal
      :statusOptions="disqualifiedOptions"
      :linkStatusReasons="linkDisqualifiedStatusReasons"
      :campaigns="campaigns"
      /> 
      <button
      class="btn  btn-primary"
      :disabled="!canSaveDisqualified"
      @click.once="disqualifiedOpportunity()"
      >{{ $t('lang.button.save') }}
      </button>
    </div>
  </div>
</div>

</template>
<script>
import {
  opportunitiesService,
  linkStatusReasonsService,
  businessesService,campaignsService
} from "@/_services";

import { mapState, mapActions } from "vuex";
import ActionButtonsModal from "@/components/Emails/ActionButtonsModal.vue";

export default {
    data() {
    return {
      openedModal: "",
      loading: "",
      convertionStatus: ["Positive", "Converted", "Lost"],
      qualifiedOptions: {
        linkStatusReason: "",
        linkStatusReasonSpan: "chose"
      },
      disqualifiedOptions: {
        linkStatusReason: "",
        linkStatusReasonSpan: "Raison ?",
        nextCampaignId: "",
        nextCampaignIdSpan: "product",
        nextCampaignDate: "",
        nextCampaignDateSpan: "date"
      },
        convertedOptions: {
        nextCampaignId: "",
        nextCampaignIdSpan: "product",
        nextCampaignDate: "",
        nextCampaignDateSpan: "date"
      },
      campaigns: [],
      linkQualifiedStatusReasons: [],
      linkLateQualifiedStatusReasons: [],
      linkDisqualifiedStatusReasons: [],
      
    };
  },
    
props: {
    link: Object,
    status: String
  },
 
 components: {
    ActionButtonsModal
  },
   created() {
    this.getQualifiedStatusReasons();
    this.getDisqualifiedStatusReasons();
    this.getCampaigns();
  },
  computed:{
    ...mapState({
      opportunities: state => state.opportunities.all.data,
    }),
    canSaveQualified() {
      return this.qualifiedOptions.linkStatusReason != "";
    },
    canSaveDisqualified() {
      return (
        // this.disqualifiedOptions.linkStatusReason != "" &&
        this.disqualifiedOptions.nextCampaignDate != ""
      );
    },
    hasDeclinedPayments() {
      return this.$store.state.authentication.toastNotificationData.hasDeclinedPayments.length > 0;
    },
  },

  methods:{

    ...mapActions("opportunities", {
      getAll: "getAll",
      reloadOpportunity: "reloadOpportunity",
      getPriorityOpportunity: "getPriority",
      resetPriorityOpportunity: "resetPriority",
      startLoadingOpportunity: "startLoadingOpportunity",
      finishLoadingOpportunity: "finishLoadingOpportunity",
      getOpportunityById: "getOpportunityById",
      changeOpportunityStatus: "changeOpportunityStatus"
    }),
    ...mapActions("header", {
      changeHeaderTab: "changeTab"
    }),
    
      getCampaigns(){
       campaignsService.getAllByClientId().then(campaignsData => this.campaigns = campaignsData )
      },
       getQualifiedStatusReasons() {
      linkStatusReasonsService
        .getQualifiedStatusReasons()
        .then(
          linkQualifiedStatusReasons =>
            (this.linkQualifiedStatusReasons = linkQualifiedStatusReasons)
        );
    },
     getDisqualifiedStatusReasons() {
      linkStatusReasonsService
        .getDisqualifiedStatusReasons()
        .then(
          linkDisqualifiedStatusReasons =>
            (this.linkDisqualifiedStatusReasons = linkDisqualifiedStatusReasons)
        );
    },
      formatCampaignDate(date) {
      var dayArray = date.split(/-|\s|:/);
      return `${dayArray[2]}-${dayArray[1]}-${dayArray[0]} 07:00:00`;
    },

    qualifiedOpportunity() {
      this.$emit("qualifiedOpportunity", {
        linkId: this.link.id,
        statusReason: this.qualifiedOptions.linkStatusReason
      });
    },
    
    disqualifiedOpportunity(initDelay) {
      // this.startLoadingOpportunity();
      const formattedCampaignDate = initDelay === undefined ? this.formatCampaignDate(
        this.disqualifiedOptions.nextCampaignDate
      ) : null;
      this.changeOpportunityStatus({link_id : this.link.id, link_status_name : "Negative"});
      opportunitiesService.changeStatus(
        5,
        this.link.id,
        this.disqualifiedOptions.linkStatusReason,
        null,
        formattedCampaignDate,
        initDelay
      ).then(opportunity => {
            this.reloadOpportunity({ headerTab: "NOTHING", link_id: this.link.id });
          });

    },
        openModal(modalName) {
            
          if (this.openedModal === modalName) {
              this.openedModal = "";
          } else {
              this.openedModal = modalName;
          }
        },
        doNotContactBusiness() {
          this.$emit("doNotContactBusiness", {
            linkId: this.link.id,
            statusReason: "24"
          });
        },
        deleteBusiness(){
          this.$emit("deleteBusiness", {
            linkId: this.link.id
          });
        }
    }
}
</script>

<style>

.top-area-opp .effect-btn{
    line-height: 16px !important;
    display: inline-block;
    text-align: center;
    background: #007bff;
    position: relative;
    z-index: 1;
    margin-right: 15px;
    transition: background-color .3s;
}
 .top-area-opp .effect-btn::before {
    content: '';
    display: block;
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-color: inherit;
    border-radius: inherit;
    -webkit-transition: opacity .3s, -webkit-transform .3s;
    transition: opacity .3s, -webkit-transform .3s;
    transition: opacity .3s, transform .3s;
    transition: opacity .3s, transform .3s, -webkit-transform .3s;
    -webkit-animation: ripple-1 1s cubic-bezier(0.24, 0, 0.38, 1) infinite;
    animation: ripple-1 1.2s cubic-bezier(0.24, 0, 0.38, 1) infinite;
    z-index: -1;
}

@keyframes ripple-1 {
    0% {
        transform: scale(1);
        opacity: 1;
    }

    100% {
        transform: scale(1.2);
        opacity: 0;
    }
}

@keyframes ripple-2 {
    0% {
        transform: scale(1);
        opacity: 1;
    }

    100% {
        transform: scale(1.3);
        opacity: 0;
    }
} 



</style>
