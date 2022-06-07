<template>
  <div class="row opportunity-creation">
    <div class="col-md-12">
      <div class="wrapperCard mt-5 triangle">
        <div class="row mb-3">
          <div class="col-6 titCard">
            <h4 class="d-inline">Create opportunity</h4>
          </div>
        </div>
        <div class="card p-3">
          <div class="row">
            <div class="col-md-10">
              <vue-multiselect
                v-model="selectedCampaign"
                :options="campaigns"
                label="name"
                track-by="id"
                placeholder="Select campaign from opportunity"
              >
                <span slot="noResult">Oops! No elements found.</span>
              </vue-multiselect>
            </div>
            <div class="col-md-2 text-center">
              <button class="btn btn-secondary" @click.once="toogleOpportunityCreation()">{{ $t('lang.button.cancel') }}</button>
              <button
                class="btn btn-primary themed-button ml-2"
                @click.once="createOpportunity()"
              >{{ $t('lang.button.save') }}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { campaignsService } from "@/_services";
import QualificationButtonsModal from "@/components/QualificationButtonsModal.vue";
import QualificationButtons from "@/components/Opportunities/SingleOpportunity/QualificationButtons.vue";

export default {
  data() {
    return {
      selectedCampaign: "",
      campaigns: []
    };
  },

  created() {
    this.getAllCampaigns();
  },

  methods: {
    getAllCampaigns() {
      campaignsService.getAll().then(campaigns => (this.campaigns = campaigns));
    },

    toogleOpportunityCreation() {
      this.$emit("toogleOpportunityCreation");
    },

    createOpportunity() {
      this.$emit("createOpportunity", this.selectedCampaign);
    }
  }
};
</script>