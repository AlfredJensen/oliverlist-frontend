<template>
  <span class="text-secondary" v-if="status != false">
    <small v-if="!['available'].includes(status)"
      ><Tooltip
        :text="$t('lang.campaigns_dashboard.'+status+'info')"
        :width="'auto'"
      >
        <i class="ml-2 icon-user-times"> </i>
        {{ $t('lang.campaigns_dashboard.'+status) }}
      </Tooltip></small
    >
  </span>
</template>
<script>
import { businessContactsService } from "@/_services";
import Tooltip from "@/components/Common/Tooltip.vue";

export default {
  data() {
    return {
      status: false,
    };
  },
  props: {
    campaignid: String,
    bcid: String,
  },
  components: {
    Tooltip,
  },
  created() {
    // if (this.campaignid > 0) {
      businessContactsService
        .getStatus(this.bcid, this.campaignid)
        .then((response) => {
          this.status = response;
        });
    //}
  },
  methods: {},
};
</script>