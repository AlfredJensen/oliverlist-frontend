<template>
  <span v-if="this.opportunities">
    <span v-for="opportunity in this.opportunities">
      <router-link :to="'/opportunities/' + opportunity.id" target="_blank">
        <div
          class="badge"
          :class="statusBadgeOliver(opportunity.link_status_name)"
        >
          {{ opportunity.campaign_name.toUpperCase() }}
        </div>
      </router-link>
    </span>
  </span>
  <span v-else>
    <Tooltip 
      :text="$t('lang.campaigns_dashboard.noopportunities')"
      :width="'130px'"
    >
      <span class="ellipsis">-</span>
    </Tooltip>
  </span>
</template>
<script>
import { businessContactsService } from "@/_services";
import Tooltip from "@/components/Common/Tooltip.vue";
import { statusBadgeMixin } from "@/_mixins/";
export default {
  data() {
    return {
      opportunities: false,
    };
  },
  props: {
    campaignid: String,
    bcid: String,
  },
  mixins: [statusBadgeMixin],
  components: {
    Tooltip,
  },
  created() {
    businessContactsService
      .getOpportunities(this.bcid, this.campaignid)
      .then((response) => {
        this.opportunities = response;
      });
  },
  methods: {},
};
</script>