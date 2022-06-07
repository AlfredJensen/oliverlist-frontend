<template>
  <section>
    <div class="qualifier text-center">
      <div class="d-flex justify-content-center">
        <div
          v-if="!showConvertionOptions"
          class="d-flex justify-content-center position-relative"
          :class="(openedModal !== '') ? 'disqualify-modal-opened' : ''"
        >
          <div class="disqualified" v-if="status !== 'Negative'">
            <button
              type="button"
              class="btn btn-sm btn-danger pr-4 pl-4"
              @click="openModal('DISQUALIFIED')"
            >
              <span class="img-btn mr-2">
                <img src="@/assets/images/hand.png" alt />
              </span>
              <span class="font-weight-bold pl-1">DISQUALIFIED</span>
            </button>
            <div class="disqualifier-card position-absolute" v-if="openedModal === 'DISQUALIFIED'">
              <QualificationButtonsModal
                :statusOptions="disqualifiedOptions"
                :linkStatusReasons="linkDisqualifiedStatusReasons"
                :campaigns="campaigns"
              />
              <div class="float-right mt-2">
                <button
                  class="btn btn-sm btn-primary"
                  :disabled="!canSaveDisqualified"
                  @click.once="disqualifiedOpportunity()"
                >{{ $t('lang.button.save') }}</button>
              </div>
            </div>
          </div>
          <div class="busy ml-2" v-if="status !== 'Busy'">
            <button
              type="button"
              class="btn btn-sm btn-primary busy-button pr-4 pl-4"
              @click="openModal('BUSY')"
            >
              <span class="img-btn mr-2">
                <img src="@/assets/images/busy.png" alt />
              </span>
              <span class="font-weight-bold pl-1">BUSY</span>
            </button>
            <div class="disqualifier-card position-absolute" v-if="openedModal === 'BUSY'">
              <QualificationButtonsModal
                :statusOptions="busyOptions"
                :linkStatusReasons="linkBusyStatusReasons"
                :campaigns="campaigns"
              />
              <div class="float-right mt-2">
                <button
                  class="btn btn-sm btn-primary"
                  :disabled="!canSaveBusy"
                  @click.once="busyOpportunity()"
                >{{ $t('lang.button.save') }}</button>
              </div>
            </div>
          </div>
          <div class="late-qualified ml-2" v-if="status !== 'Late qualified'">
            <button
              type="button"
              class="btn btn-sm btn-info pr-4 pl-4"
              @click="openModal('LATE QUALIFIED')"
            >
              <span class="img-btn mr-2">
                <img src="@/assets/images/late-qualified.png" alt />
              </span>
              <span class="font-weight-bold pl-1">LATE QUALIFIED</span>
            </button>
            <div
              class="disqualifier-card position-absolute"
              v-if="openedModal === 'LATE QUALIFIED'"
            >
              <QualificationButtonsModal
                :statusOptions="lateQualifiedOptions"
                :linkStatusReasons="linkLateQualifiedStatusReasons"
                :campaigns="campaigns"
              />
              <div class="float-right mt-2">
                <button
                  class="btn btn-sm btn-primary"
                  :disabled="!canSaveLateQualified"
                  @click.once="lateQualifiedOpportunity()"
                >{{ $t('lang.button.save') }}</button>
              </div>
            </div>
          </div>
          <div class="qualified ml-2" v-if="status !== 'Positive'">
            <button
              type="button"
              class="btn btn-sm btn-success pr-4 pl-4"
              @click="openModal('QUALIFIED')"
            >
              <span class="img-btn">
                <img src="@/assets/images/icono-wp.png" alt />
              </span>
              <span class="font-weight-bold pl-2">QUALIFIED</span>
            </button>
            <div class="disqualifier-card position-absolute" v-if="openedModal === 'QUALIFIED'">
              <QualificationButtonsModal
                :statusOptions="qualifiedOptions"
                :linkStatusReasons="linkQualifiedStatusReasons"
                :campaigns="[]"
              />
              <div class="float-right mt-2">
                <button
                  class="btn btn-sm btn-primary"
                  :disabled="!canSaveQualified"
                  @click.once="qualifiedOpportunity()"
                >{{ $t('lang.button.save') }}</button>
              </div>
            </div>
          </div>
        </div>
        <div
          v-else
          class="d-flex justify-content-center position-relative"
          :class="(openedModal !== '') ? 'disqualify-modal-opened' : ''"
        >
          <div class="lost" v-if="status !== 'Lost'">
            <button
              type="button"
              class="btn btn-sm btn-danger pr-4 pl-4"
              @click="openModal('LOST')"
            >
              <span class="img-btn mr-2">
                <img src="@/assets/images/lost.png" alt />
              </span>
              <span class="font-weight-bold pl-1">LOST</span>
            </button>
            <div class="disqualifier-card position-absolute" v-if="openedModal === 'LOST'">
              <QualificationButtonsModal
                :statusOptions="lostOptions"
                :linkStatusReasons="linkLostStatusReasons"
                :campaigns="campaigns"
              />
              <div class="float-right mt-2">
                <button
                  class="btn btn-sm btn-primary"
                  :disabled="!canSaveLost"
                  @click.once="lostOpportunity()"
                >{{ $t('lang.button.save') }}</button>
              </div>
            </div>
          </div>
          <div class="converted ml-2" v-if="status !== 'Converted'">
            <button
              type="button"
              class="btn btn-sm btn-success pr-4 pl-4"
              @click="openModal('CONVERTED')"
            >
              <span class="img-btn">
                <img src="@/assets/images/converted.png" alt />
              </span>
              <span class="font-weight-bold pl-2">CONVERTED</span>
            </button>
            <div class="disqualifier-card position-absolute" v-if="openedModal === 'CONVERTED'">
              <QualificationButtonsModal
                :statusOptions="convertedOptions"
                :linkStatusReasons="linkConvertedStatusReasons"
                :campaigns="campaigns"
              />
              <div class="float-right mt-2">
                <button
                  class="btn btn-sm btn-primary"
                  :disabled="!canSaveConverted"
                  @click.once="convertedOpportunity()"
                >{{ $t('lang.button.save') }}</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import {
  opportunitiesService,
  linkStatusReasonsService,
  businessesService
} from "@/_services";
import QualificationButtonsModal from "@/components/QualificationButtonsModal.vue";

export default {
  components: {
    QualificationButtonsModal
  },

  data() {
    return {
      openedModal: "",
      convertionStatus: ["Positive", "Converted", "Lost"],
      qualifiedOptions: {
        linkStatusReason: "",
        linkStatusReasonSpan: "chose"
      },
      lateQualifiedOptions: {
        linkStatusReason: "",
        linkStatusReasonSpan: "chose",
        nextCampaignId: "",
        nextCampaignIdSpan: "product",
        nextCampaignDate: "",
        nextCampaignDateSpan: "date"
      },
      busyOptions: {
        linkStatusReason: "",
        linkStatusReasonSpan: "chose",
        nextCampaignId: "",
        nextCampaignIdSpan: "product",
        nextCampaignDate: "",
        nextCampaignDateSpan: "date"
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
      lostOptions: {
        linkStatusReason: "",
        linkStatusReasonSpan: "chose",
        nextCampaignId: "",
        nextCampaignIdSpan: "product",
        nextCampaignDate: "",
        nextCampaignDateSpan: "date"
      },
      campaigns: [],
      linkQualifiedStatusReasons: [],
      linkLateQualifiedStatusReasons: [],
      linkBusyStatusReasons: [],
      linkDisqualifiedStatusReasons: [],
      linkConvertedStatusReasons: [],
      linkLostStatusReasons: []
    };
  },

  props: {
    link: Object,
    status: String
  },

  created() {
    this.getAvailableCampaigns();
    this.getQualifiedStatusReasons();
    this.getLateQualifiedStatusReasons();
    this.getBusyStatusReasons();
    this.getDisqualifiedStatusReasons();
    this.getConvertedStatusReasons();
    this.getLostStatusReasons();
  },

  computed: {
    showConvertionOptions() {
      return this.convertionStatus.indexOf(this.status) > -1;
    },

    canSaveQualified() {
      return this.qualifiedOptions.linkStatusReason != "";
    },

    canSaveLateQualified() {
      return (
        this.lateQualifiedOptions.linkStatusReason != "" &&
        this.lateQualifiedOptions.nextCampaignId != "" &&
        this.lateQualifiedOptions.nextCampaignDate != ""
      );
    },

    canSaveBusy() {
      return (
        this.busyOptions.linkStatusReason != "" &&
        this.busyOptions.nextCampaignId != "" &&
        this.busyOptions.nextCampaignDate != ""
      );
    },

    canSaveDisqualified() {
      return (
        this.disqualifiedOptions.linkStatusReason != "" &&
        this.disqualifiedOptions.nextCampaignId != "" &&
        this.disqualifiedOptions.nextCampaignDate != ""
      );
    },

    canSaveConverted() {
      return (
        this.convertedOptions.nextCampaignId != "" &&
        this.convertedOptions.nextCampaignDate != ""
      );
    },

    canSaveLost() {
      return (
        this.lostOptions.linkStatusReason != "" &&
        this.lostOptions.nextCampaignId != "" &&
        this.lostOptions.nextCampaignDate != ""
      );
    }
  },

  methods: {
    getQualifiedStatusReasons() {
      linkStatusReasonsService
        .getQualifiedStatusReasons()
        .then(
          linkQualifiedStatusReasons =>
            (this.linkQualifiedStatusReasons = linkQualifiedStatusReasons)
        );
    },

    getLateQualifiedStatusReasons() {
      linkStatusReasonsService
        .getLateQualifiedStatusReasons()
        .then(
          linkLateQualifiedStatusReasons =>
            (this.linkLateQualifiedStatusReasons = linkLateQualifiedStatusReasons)
        );
    },

    getBusyStatusReasons() {
      linkStatusReasonsService
        .getBusyStatusReasons()
        .then(
          linkBusyStatusReasons =>
            (this.linkBusyStatusReasons = linkBusyStatusReasons)
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

    getConvertedStatusReasons() {
      linkStatusReasonsService
        .getConvertedStatusReasons()
        .then(
          linkConvertedStatusReasons =>
            (this.linkConvertedStatusReasons = linkConvertedStatusReasons)
        );
    },

    getLostStatusReasons() {
      linkStatusReasonsService
        .getLostStatusReasons()
        .then(
          linkLostStatusReasons =>
            (this.linkLostStatusReasons = linkLostStatusReasons)
        );
    },

    getAvailableCampaigns() {
      businessesService
        .getAvailableCampaigns(this.link.business_id)
        .then(campaigns => (this.campaigns = campaigns));
    },

    openModal(modalName) {
      if (this.openedModal === modalName) {
        this.openedModal = "";
      } else {
        this.openedModal = modalName;
      }
      setTimeout(function() {
        window.scrollTo(0, document.body.scrollHeight);
      }, 10);
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

    lateQualifiedOpportunity() {
      const formattedCampaignDate = this.formatCampaignDate(
        this.lateQualifiedOptions.nextCampaignDate
      );
      this.$emit("lateQualifiedOpportunity", {
        linkId: this.link.id,
        statusReason: this.lateQualifiedOptions.linkStatusReason,
        nextCampaignId: this.lateQualifiedOptions.nextCampaignId,
        campaignDate: formattedCampaignDate
      });
    },

    busyOpportunity() {
      const formattedCampaignDate = this.formatCampaignDate(
        this.busyOptions.nextCampaignDate
      );
      this.$emit("busyOpportunity", {
        linkId: this.link.id,
        statusReason: this.busyOptions.linkStatusReason,
        nextCampaignId: this.busyOptions.nextCampaignId,
        campaignDate: formattedCampaignDate
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

    convertedOpportunity() {
      const formattedCampaignDate = this.formatCampaignDate(
        this.convertedOptions.nextCampaignDate
      );
      this.$emit("convertedOpportunity", {
        linkId: this.link.id,
        nextCampaignId: this.convertedOptions.nextCampaignId,
        campaignDate: formattedCampaignDate
      });
    },

    lostOpportunity() {
      const formattedCampaignDate = this.formatCampaignDate(
        this.lostOptions.nextCampaignDate
      );
      this.$emit("lostOpportunity", {
        linkId: this.link.id,
        statusReason: this.lostOptions.linkStatusReason,
        nextCampaignId: this.lostOptions.nextCampaignId,
        campaignDate: formattedCampaignDate
      });
    }
  }
};
</script>

