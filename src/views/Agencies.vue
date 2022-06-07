<template>
  <section class="company">
    <Header :user="user" />
    <main class="main" :class="{ 'expand-main' : isMenuCollapse }">
      <component :is="companiesTabComponent" :selectedClientId="selectedClientId" :selectedClientName="selectedClientName"></component>
    </main>
  </section>
</template>

<script>
import { mapState, mapActions } from "vuex";
import AllAgencies from "@/components/Agencies/AllAgencies.vue";
import AgencyForm from "@/components/Agencies/AgencyForm.vue";
export default {
  created() {
    if (typeof this.$route.params.id !== "undefined") {
      this.changeHeaderTab({ tab: "STATS" });
      return true;
    }
    this.changeHeaderTab({ tab: "ALL" });
  },

  components: {
    AllAgencies,
    AgencyForm
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
        return "AllAgencies";
      }
      if (this.headerTab === "STATS") {
        return "AgencyForm";
      }
      // SELECTED
      return "AgencyForm";
    },
    selectedClientName(){
      return this.$route.params.name;
    },
    selectedClientId() {
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