<template>
  <div class="contentCenter">
    <div v-if="hasSelectedPriorityFilters">
      <div v-if="notEmptyOpportunity">
        <LoadingSpinner v-if="loading" />
        <SingleOpportunity v-else :opportunity="opportunity" />
      </div>
      <OpportunityErrorInformation v-else :message="noOpportunityErrorMessage" />
    </div>
    <div v-else>
      <OpportunityErrorInformation :message="categoryProductErrorMessage" />
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import SingleOpportunity from "@/components/Opportunities/Opportunity.vue";
import OpportunityErrorInformation from "@/components/Opportunities/SingleOpportunity/OpportunityErrorInformation.vue";

export default {
  data() {
    return {
      categoryProductErrorMessage:
        "You must select a category and a product before starting.",
      noOpportunityErrorMessage:
        "There is no opportunity for this campaign."
    };
  },

  components: {
    LoadingSpinner,
    SingleOpportunity,
    OpportunityErrorInformation
  },

  computed: {
    ...mapState({
      loading: state => state.opportunities.loading,
      opportunity: state => state.opportunities.priority.data,
      priorityCategoryFilter: state =>
        state.opportunities.priorityFilters.categoryFilter,
      priorityProductFilter: state =>
        state.opportunities.priorityFilters.productFilter
    }),

    hasSelectedPriorityFilters() {
      // Agusdeluca96: return this.priorityCategoryFilter.name !== undefined && this.priorityProductFilter.name !== undefined;
      return this.priorityProductFilter.name !== undefined;
    },

    notEmptyOpportunity() {
      return (
        this.opportunity !== {} &&
        this.opportunity !== "" &&
        this.opportunity !== null
      );
    }
  },

  created() { 
    this.getPriorityOpportunity();
  },

  watch: {
    priorityCategoryFilter() {
      this.$store.dispatch("opportunities/resetPriority");
      this.getPriorityOpportunity();
    },

    priorityProductFilter() {
      this.$store.dispatch("opportunities/resetPriority");
      this.getPriorityOpportunity();
    }
  },

  methods: {
    getPriorityOpportunity() {
      if (this.hasSelectedPriorityFilters) {
        this.$store.dispatch("opportunities/getPriority");
      }
    }
  }
};
</script>
<style>
.contentCenter{
  overflow-x: hidden;
}
</style>