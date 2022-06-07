<template>
<div class="row">
  <div class="col-12 mt-2 actionButtonsModal">
      <!-- <div class="dropdown mr-1">
        <button
          type="button"
          class="btn btn-secondary dropdown-toggle dropRed text-center"
          id="dropdownMenuOffset"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
          data-offset="10,20"
        >
          <span>{{ statusOptions.linkStatusReasonSpan }}</span>
        </button>
        <div class="dropdown-menu " aria-labelledby="dropdownMenuOffset">
          <a
            class="dropdown-item cursor-pointer"
            v-for="(linkStatusReason, index) in linkStatusReasons"
            :key="index"
            @click="changeLinkStatusReason(statusOptions ,linkStatusReason)"
          >{{ linkStatusReason.name }}</a>
        </div>
      </div> -->
    </div>
    <div class="col-12 mb-3
    mt-2 text-right">
      <date-picker
        class=""
        v-model="statusOptions.nextCampaignDate"
        :config="datePickerConfig"
        v-bind:placeholder="$t('lang.label.recalldate')"
        required
      ></date-picker>
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
      statusOptions.nextCampaignId = campaign.id;
      statusOptions.nextCampaignIdSpan = campaign.name;
    }
  }
};
</script>
<style>
.top-area-opp .dropdown-menu.show{
    transform: translate3d(-32px, 59px, 0px) !important;
}
.top-area-opp div.bootstrap-datetimepicker-widget{
    top: auto!important; 
    bottom: auto!important; 
    left: 0px!important; 
    right: auto!important;
    width: 95%!important;
}
.ActionButtonModal .form-control.next-campaign-date:valid{
    width: 95% !important;
}

</style>
