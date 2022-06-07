<template> 
<div class="actionButtons">
    <div class="card p-4 mt-2">
        <!-- set status opportunity -->
        <div class="mt-2">
            <p class="mb-2">{{ $t('lang.label.olivercouldnotsettheprospectstatus') }}</p>
             <div class="disqualified" v-if="status !== 'Negative'">
              <button  
              class="btnSet negative d-block mb-2 text-center w-100 btn btn-sm btn-danger pr-4 pl-4"
              @click="openModal('DISQUALIFIED')"
              >
              <span>{{ $t('lang.button.setasnegative') }}</span>
              </button>
              <div class="disqualifier-card " v-if="openedModal === 'DISQUALIFIED'">
                <ActionButtonsModal
                  :statusOptions="disqualifiedOptions"
                  :linkStatusReasons="linkDisqualifiedStatusReasons"
                  :campaigns="campaigns"
                />
                <button
                  class="mb-3 btn btn-sm btn-primary"
                  :disabled="!canSaveDisqualified"
                  @click.once="disqualifiedOpportunity()"
                >{{ $t('lang.button.save') }}</button>
              </div>
             </div> 
            <button  class="btnSet notcontact d-block mb-2 text-center w-100 btn btn-sm btn-primary do-not-contact-button "
             @click="doNotContactBusiness()">
            <span>{{ $t('lang.button.setasdonotcontact') }}</span>
            </button>
        </div>
        <!-- -->
    </div> <!--//card -->
</div>
</template>
<script>
import {
  opportunitiesService,
  linkStatusReasonsService,
  businessesService,campaignsService
} from "@/_services";

import ActionButtonsModal from "@/components/Emails/ActionButtonsModal.vue";

export default {
    data() {
    return {
      openedModal: "",
      convertionStatus: ["Positive", "Converted", "Lost"],
      qualifiedOptions: {
        linkStatusReason: "",
        linkStatusReasonSpan: "chose"
      },
      disqualifiedOptions: {
        linkStatusReason: "",
        linkStatusReasonSpan: "chose",
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
    canSaveQualified() {
      return this.qualifiedOptions.linkStatusReason != "";
    },
     canSaveDisqualified() {
      return (
        // this.disqualifiedOptions.linkStatusReason != "" &&
        this.disqualifiedOptions.nextCampaignDate != ""
      );
     }
  },
  methods:{
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
    
    disqualifiedOpportunity() {
      const formattedCampaignDate = this.formatCampaignDate(
        this.disqualifiedOptions.nextCampaignDate
      );
      this.$emit("disqualifiedOpportunity", {
        linkId: this.link.id,
        statusReason: this.disqualifiedOptions.linkStatusReason,
        nextCampaignId: this.disqualifiedOptions.nextCampaignId,
        campaignDate: formattedCampaignDate
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
