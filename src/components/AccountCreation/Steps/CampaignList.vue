<template>
  <div>
    <div class="btn-group" :class="direction">
      <!-- ADD INTO CAMPAIGN BUTTON -->
      <button
        ref="buttondropdown"
        class="ml-2 rounded btn btn-sm btn-outline-primary effect-btn"
        data-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false"
      >
        <i class="icon icon-bullhorn"></i>
        {{ $t("lang.search.addselectiontothecampaign") }}
      </button>
      <div class="dropdown-menu">
        <div class="px-3 pt-4 pb-2 card">
          <strong>
            {{ $t("lang.campaigns_dashboard.choosecampaigne") }}
          </strong>
        </div>
        <div class="fix-height">
          <a
            :key="key + 'add'"
            v-if="!item.imported && !model.imported"
            :class="
              key == 0 && model.refreshlist ? 'text-primary' : 'text-secondary'
            "
            v-for="(item, key) in mycampaigns"
            @click="addSelected(item)"
            class="dropdown-item"
            href="#"
          >
            <i
              class="icon-circle"
              :class="getColorCampaign(item.campaign_status)"
            ></i>
            {{ item.name }}</a
          >

          <span class="px-3" v-if="!hasList">
            {{ $t("lang.campaigns_dashboard.nocampaign") }}
          </span>

          <a
            :key="key + 'add2'"
            v-if="item.imported && model.imported"
            :class="
              key == 0 && model.refreshlist ? 'text-primary' : 'text-secondary'
            "
            v-for="(item, key) in mycampaigns"
            @click="addSelected(item)"
            class="dropdown-item"
            href="#"
          >
            <i
              class="icon-circle"
              :class="getColorCampaign(item.campaign_status)"
            ></i>
            {{ item.name }}</a
          >
        </div>

        <div class="px-3 pt-4 pb-2 card">
          <strong>
            {{ $t("lang.campaigns_dashboard.orcreatecampagne") }}
          </strong>

          <AddCampaign
            @campaignCreated="refreshList()"
            :selectImport="model.imported"
          />
        </div>
      </div>
    </div>

     <!-- DELETE FROM CAMPAIGN BUTTON -->
    <div class="btn-group" :class="direction">
     
      <button
        ref="buttondropdown-delete"
        class="ml-2 rounded btn btn-sm btn-outline-primary effect-btn"
        data-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false"
      >
        <i class="icon icon-bullhorn"></i>
        {{ $t("lang.search.deleteselectionfromcampaign") }}
      </button>
      <div class="dropdown-menu" >
        <div class="px-3 pt-4 pb-2 card">
          <strong>
            {{ $t("lang.campaigns_dashboard.choosecampaigne") }}
          </strong>
        </div>
        <div class="fix-height">
          <a
            :key="key + 'del'"
            v-if="!item.imported && !model.imported"
            :class="
              key == 0 && model.refreshlist ? 'text-primary' : 'text-secondary'
            "
            v-for="(item, key) in mycampaigns"
            @click="deleteSelected(item)"
            class="dropdown-item"
            href="#"
          >
            <i
              class="icon-circle"
              :class="getColorCampaign(item.campaign_status)"
            ></i>
            {{ item.name }}</a
          >

          <span class="px-3" v-if="!hasList">
            {{ $t("lang.campaigns_dashboard.nocampaign") }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { formattersMixin, campaignUtilsMixin } from "@/_mixins/";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import AddCampaign from "@/components/AccountCreation/Steps/AddCampaign.vue";
import { campaignsService } from "@/_services";

import { mapState, mapActions } from "vuex";

export default {
  components: {
    LoadingSpinner,
    AddCampaign,
  },
  data() {
    return {
      mycampaigns: Array,
      hasList: false,
    };
  },

  methods: {
    refreshList() {
      this.$emit("refresh");
    },
    addSelected(item) {
      this.$emit("addSelected", item);
    },
    deleteSelected(item) {
      this.$emit("deleteSelected", item);
    },

    getColorCampaign(status) {
      switch (status) {
        case "Stopped":
          return "text-danger";
          break;
        case "Active":
          return "text-success";
          break;
        case "Pending":
          return "text-secondary";
          break;
      }
    },
  },
  props: {
    model: Object,
    direction: {
      type: String,
      required: false,
      default: "dropleft",
    },
  },
  created() {
    campaignsService.getAllByClientId().then((response) => {
      if (response) {
        this.mycampaigns = response;
        response.forEach((item) => {
          if (this.model.imported && item.imported) {
            this.hasList = true;
            return;
          }
          if (!this.model.imported && !item.imported) {
            this.hasList = true;
            return;
          }
          if (this.model.refreshlist) {
            this.$refs.buttondropdown.click();
          }
        });

        if (
          this.model.selectfirst !== undefined &&
          this.model.selectfirst &&
          this.mycampaigns.length > 0
        ) {
          this.$emit("addSelected", this.mycampaigns[0]);
        }
      }
    });
  },
};
</script>
<style scoped>
.fix-height {
  max-height: 243px;
  overflow-y: scroll;
}
</style>