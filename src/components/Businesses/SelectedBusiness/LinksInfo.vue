<template>
  <div class="row links-info">
    <div class="col-md-12">
      <div class="wrapperCard mt-5 triangle">
        <div class="row mb-3">
          <div class="col-6 titCard">
            <h4 class="d-inline">Opportunities</h4>
          </div>
          <div class="col-6 text-right" v-if="!opportunityCreation">
            <button
              type="button"
              class="btn btn-sm btn-primary themed-button"
              @click="toogleOpportunityCreation()"
            >
              <span class="icon-plus mr-2"></span>NEW OPPORTUNITY
            </button>
          </div>
        </div>

        <div class="card p-3">
          <div class="table-responsive scrolled-div">
            <table class="table table-hover">
              <thead>
                <tr>
                  <th scope="col">Campaign</th>
                  <th scope="col">Creation date</th>
                  <th scope="col">
                    <span class="icon-fire"></span>
                  </th>
                  <th scope="col">Status</th>
                  <th scope="col"></th>
                  <th scope="col"></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(link, key) in businessLinks" :key="'link-' + key">
                  <td>
                    <span class="mr-2 d-inline" :class="productIcon(link.campaign_name)"></span>
                    <p class="d-inline">{{ link.campaign_name }}</p>
                  </td>
                  <td>
                    <span>{{ link.creation_date }}</span>
                  </td>
                  <td>
                    <span>{{ Math.floor(link.score) }}</span>
                  </td>
                  <td>
                    <div
                      class="badge"
                      :class="statusBadge(link.status)"
                    >{{ statusBadgeName(link.status).toUpperCase() }}</div>
                  </td>
                  <td>
                    <button
                      class="btn btn-sm btn-primary themed-button"
                      @click="openDemo(link.demo_url, business.alias)"
                    >
                      <span class="icon-play_arrow mr-2"></span>DEMO
                    </button>
                  </td>
                  <td>
                    <QualificationButtons
                      :link="link"
                      :status="link.status"
                      @qualifiedOpportunity="qualifiedOpportunity($event)"
                      @lateQualifiedOpportunity="lateQualifiedOpportunity($event)"
                      @busyOpportunity="busyOpportunity($event)"
                      @disqualifiedOpportunity="disqualifiedOpportunity($event)"
                      @convertedOpportunity="convertedOpportunity($event)"
                      @lostOpportunity="lostOpportunity($event)"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { productIconMixin, statusBadgeMixin } from "@/_mixins/";
import QualificationButtonsModal from "@/components/QualificationButtonsModal.vue";
import QualificationButtons from "@/components/Opportunities/SingleOpportunity/QualificationButtons.vue";

export default {
  mixins: [productIconMixin, statusBadgeMixin],

  components: {
    QualificationButtonsModal,
    QualificationButtons
  },

  props: {
    business: Object,
    businessLinks: Array,
    opportunityCreation: Boolean
  },

  methods: {
    openDemo(demoUrl, alias) {
      var demoUrl = demoUrl + alias;
      window.open(demoUrl, "_blank");
    },

    toogleOpportunityCreation() {
      this.$emit("toogleOpportunityCreation");
    },

    qualifiedOpportunity(qualificationOptions) {
      this.$emit("qualifiedOpportunity", qualificationOptions);
    },

    lateQualifiedOpportunity(qualificationOptions) {
      this.$emit("lateQualifiedOpportunity", qualificationOptions);
    },

    busyOpportunity(qualificationOptions) {
      this.$emit("busyOpportunity", qualificationOptions);
    },

    disqualifiedOpportunity(qualificationOptions) {
      this.$emit("disqualifiedOpportunity", qualificationOptions);
    },

    convertedOpportunity(qualificationOptions) {
      this.$emit("convertedOpportunity", qualificationOptions);
    },

    lostOpportunity(qualificationOptions) {
      this.$emit("lostOpportunity", qualificationOptions);
    },
  }
};
</script>