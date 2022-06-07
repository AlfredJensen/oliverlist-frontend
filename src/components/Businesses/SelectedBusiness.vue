<template>
  <div class="contentCenter">
    <LoadingSpinner v-if="loading" />
    <section v-else>
      <div class="contenedor animated fadeIn faster">
        <ContactInfo
          v-if="!contactEdition"
          :business="business"
          :businessContacts="businessContacts"
          :status="businessStatus"
          @editContact="contactEdition = true"
          @doNotContactBusiness="doNotContactBusiness()"
          @deleteBusiness="deleteBusiness()"
        />
        <ContactEdition
          v-else
          :business="business"
          :businessContacts="businessContacts"
          @closeEdition="contactEdition = false"
          @saveEdition="saveEdition()"
        />
        <OpportunityCreation
          v-if="opportunityCreation"
          @createOpportunity="createOpportunity($event)"
          @toogleOpportunityCreation="opportunityCreation = !opportunityCreation"
        />
        <LinksInfo
          :businessLinks="businessLinks"
          :business="business"
          :opportunityCreation="opportunityCreation"
          @qualifiedOpportunity="qualifiedOpportunity($event)"
          @lateQualifiedOpportunity="lateQualifiedOpportunity($event)"
          @busyOpportunity="busyOpportunity($event)"
          @disqualifiedOpportunity="disqualifiedOpportunity($event)"
          @convertedOpportunity="convertedOpportunity($event)"
          @lostOpportunity="lostOpportunity($event)"
          @toogleOpportunityCreation="opportunityCreation = !opportunityCreation"
        />
      </div>
    </section>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { businessesService, opportunitiesService } from "@/_services";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import ContactInfo from "@/components/Common/ContactInfo.vue";
import ContactEdition from "@/components/Common/ContactEdition.vue";
import LinksInfo from "@/components/Businesses/SelectedBusiness/LinksInfo.vue";
import OpportunityCreation from "@/components/Businesses/SelectedBusiness/OpportunityCreation.vue";

export default {
  data() {
    return {
      contactEdition: false,
      opportunityCreation: false
    };
  },

  props: {
    selectedBusinessId: String
  },

  components: {
    LinksInfo,
    ContactInfo,
    LoadingSpinner,
    ContactEdition,
    OpportunityCreation
  },

  computed: {
    ...mapState({
      loading: state => state.businesses.loading,
      business: state => state.businesses.selected.data.business,
      businessStatus: state => state.businesses.selected.data.status,
      businessLinks: state => state.businesses.selected.data.links,
      businessContacts: state => state.businesses.selected.data.contacts
    })
  },

  created() {
    this.getBusinessById({ id: this.selectedBusinessId });
  },

  methods: {
    ...mapActions("businesses", {
      getBusinessById: "getById",
      startLoading: "startLoading",
      finishLoading: "finishLoading"
    }),

    saveEdition() {
      this.getBusinessById({ id: this.selectedBusinessId });
      this.contactEdition = false;
    },

    doNotContactBusiness() {
      this.$swal({
        type: "warning",
        title: this.$t('lang.label.areyousure'),
        text: this.$t('lang.label.donotcontactthisbusiness'),
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33a2c",
        confirmButtonText: this.$t('lang.label.yesdonotcontactthem')
      }).then(result => {
        if (result.value) {
          this.startLoading();
          businessesService
            .doNotContactBusiness(this.business.id)
            .then(business => {
              this.getBusinessById({ id: this.selectedBusinessId });
            });
        }
      });
    },

    deleteBusiness() {
      this.$swal({
        type: "warning",
        title: this.$t('lang.label.areyousure'),
        text: "this.$t('lang.label.youaregoingtoclainthisopportunity') ${this.business.name}",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33a2c",
        confirmButtonText: this.$t('lang.label.yesclaimthisopportunity')
      }).then(result => {
        if (result.value) {
          businessesService.deleteBusiness(this.business.id).then(business => {
            this.getBusinessById({ id: this.selectedBusinessId });
          });
        }
      });
    },

    qualifiedOpportunity(qualificationOptions) {
      this.startLoading();
      opportunitiesService
        .qualifiedOpportunity(
          qualificationOptions.linkId,
          qualificationOptions.statusReason
        )
        .then(opportunity => {
          this.getBusinessById({ id: this.selectedBusinessId });
        });
    },

    lateQualifiedOpportunity(qualificationOptions) {
      this.startLoading();
      opportunitiesService
        .lateQualifiedOpportunity(
          qualificationOptions.linkId,
          qualificationOptions.statusReason,
          qualificationOptions.nextCampaignId,
          qualificationOptions.campaignDate
        )
        .then(opportunity => {
          this.getBusinessById({ id: this.selectedBusinessId });
        });
    },

    busyOpportunity(qualificationOptions) {
      this.startLoading();
      opportunitiesService
        .busyOpportunity(
          qualificationOptions.linkId,
          qualificationOptions.statusReason,
          qualificationOptions.nextCampaignId,
          qualificationOptions.campaignDate
        )
        .then(opportunity => {
          this.getBusinessById({ id: this.selectedBusinessId });
        });
    },

    disqualifiedOpportunity(qualificationOptions) {
      this.startLoading();
      opportunitiesService
        .disqualifiedOpportunity(
          qualificationOptions.linkId,
          qualificationOptions.statusReason,
          qualificationOptions.nextCampaignId,
          qualificationOptions.campaignDate
        )
        .then(opportunity => {
          this.getBusinessById({ id: this.selectedBusinessId });
        });
    },

    convertedOpportunity(qualificationOptions) {
      this.startLoading();
      opportunitiesService
        .convertedOpportunity(
          qualificationOptions.linkId,
          qualificationOptions.nextCampaignId,
          qualificationOptions.campaignDate
        )
        .then(opportunity => {
          this.getBusinessById({ id: this.selectedBusinessId });
        });
    },

    lostOpportunity(qualificationOptions) {
      this.startLoading();
      opportunitiesService
        .lostOpportunity(
          qualificationOptions.linkId,
          qualificationOptions.statusReason,
          qualificationOptions.nextCampaignId,
          qualificationOptions.campaignDate
        )
        .then(opportunity => {
          this.getBusinessById({ id: this.selectedBusinessId });
        });
    },

    createOpportunity(selectedCampaign) {
      this.startLoading();
      opportunitiesService
        .createOpportunity(this.selectedBusinessId, selectedCampaign.id)
        .then(
          opportunity => {
            this.$swal({
              type: "success",
              title: this.$t('lang.label.great'),
              text: this.$t('lang.label.linkwascreatedsuccessfully'),
              showConfirmButton: false,
              timer: 3000
            }).then(result => {
              this.getBusinessById({ id: this.selectedBusinessId });
            });
          },
          error => {
            this.$swal({
              type: "error",
              title: this.$t('lang.label.error'),
              text: error,
              showConfirmButton: false,
              timer: 3000
            }).then(result => {
              this.finishLoading();
            });
          }
        );
    }
  }
};
</script>