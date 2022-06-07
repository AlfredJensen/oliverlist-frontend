<template>
  <div class="card desqualifier p-4 mt-2">
    <div class="d-flex align-items-center mt-3" v-if="linkStatusReasons.length > 0">
      <p>State of mind</p>
      <div class="dropdown mr-1">
        <button
          type="button"
          class="btn btn-secondary dropdown-toggle dropRed"
          id="dropdownMenuOffset"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
          data-offset="10,20"
        >
          <span>{{ statusOptions.linkStatusReasonSpan }}</span>
        </button>
        <div class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuOffset">
          <a
            class="dropdown-item cursor-pointer"
            v-for="(linkStatusReason, index) in linkStatusReasons"
            :key="index"
            @click="changeLinkStatusReason(statusOptions ,linkStatusReason)"
          >{{ linkStatusReason.name }}</a>
        </div>
      </div>
    </div>
    <div class="d-flex align-items-center mt-3" v-if="campaigns.length > 0">
      <p>Add to the campaign</p>
      <div class="dropdown mr-1">
        <button
          type="button"
          class="btn btn-secondary dropdown-toggle dropBlue"
          id="dropdownMenuOffset"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
          data-offset="10,20"
        >
          <span>{{ statusOptions.nextCampaignIdSpan }}</span>
        </button>
        <div class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuOffset">
          <a
            class="dropdown-item cursor-pointer"
            v-for="(campaign, index) in campaigns"
            :key="index"
            @click="changeNextCampaignId(statusOptions, campaign)"
          >{{ campaign.title }}</a>
        </div>
      </div>
    </div>
    <div class="d-flex align-items-center mt-3" v-if="campaigns.length > 0">
      <p>{{ $t('lang.label.recalldate') }}</p>
      <date-picker
        class="next-campaign-date"
        v-model="statusOptions.nextCampaignDate"
        :config="datePickerConfig"
        placeholder="date"
        required
      ></date-picker>
      <span class="icon-arrow_drop_down date-dropdown-icon"></span>
    </div>
  </div>
</template>

<script>
import moment from "moment";

export default {
  data() {
    return {
      datePickerConfig: {
        format: "DD-MM-YYYY",
        useCurrent: false,
        minDate: moment().startOf("day")
      }
    };
  },

  props: {
    statusOptions: Object,
    linkStatusReasons: Array,
    campaigns: Array
  },

  methods: {
    changeLinkStatusReason(statusOptions, linkStatusReason) {
      statusOptions.linkStatusReason = linkStatusReason.id;
      statusOptions.linkStatusReasonSpan = linkStatusReason.name;
    },

    changeNextCampaignId(statusOptions, campaign) {
      statusOptions.nextCampaignId = campaign.nid;
      statusOptions.nextCampaignIdSpan = campaign.title;
    }
  }
};
</script>

