<template>
  <section class="company">
    <Header :user="user" />
    <main class="main" :class="{ 'expand-main' : isMenuCollapse }">
      <ToastNotifications/>
      <component :is="companiesTabComponent" :selectedCompanyId="selectedCompanyId" :selectedCompanyName="selectedCompanyName"></component>
    </main>
  </section>
</template>

<script>
import { mapState, mapActions } from "vuex";
import Header from "@/components/Header.vue";
import AllCompanies from "@/components/Companies/AllCompanies.vue";
import ToastNotifications from "@/components/ToastNotifications.vue";
export default {
  created() {
    if (typeof this.$route.params.id !== "undefined") {
      this.changeHeaderTab({ tab: "STATS" });
      return true;
    }
    this.changeHeaderTab({ tab: "ALL" });
  },

  components: {
    AllCompanies,
    ToastNotifications
  },

  computed: {
    ...mapState({
      headerTab: state => state.header.tab,
      isMenuCollapse: state => state.sidebar.isNavOpen,
    }),

    user() {
      return this.$store.state.authentication.user;
    },

    companiesTabComponent() {
      if (this.headerTab === "ALL") {
        return "AllCompanies";
      }
      if (this.headerTab === "STATS") {
        return "CampaignDashboard";
      }
      // SELECTED
      return "CampaignEdit";
    },
     selectedCompanyName(){
        return this.$route.params.name;
     },
    selectedCompanyId() {
      return this.$route.params.id;
    }
  },

  methods: {
    ...mapActions("header", {
      changeHeaderTab: "changeTab"
    })
  }
};
</script>