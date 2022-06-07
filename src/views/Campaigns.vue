<template>
  <section class="campaign">
    <Header :user="user" />
    <main class="main" :class="{ 'expand-main' : isMenuCollapse }">
      <component :is="campaignsTabComponent" 
      :selectedCampaignId="selectedCampaignId" 
      :selectedCampaignName="selectedCampaignName"
      :filter="filter"
      ></component>
    </main>
  </section>
</template>

<script>
import { mapState, mapActions } from "vuex";
import Header from "@/components/Header.vue";
import AllCampaigns from "@/components/Campaigns/AllCampaigns.vue";
import CampaignEdit from "@/components/AccountCreation/Steps/CampaignEdit.vue";
import CampaignDashboard from "@/components/Campaigns/CampaignDashboard.vue";
import ToastNotifications from "@/components/ToastNotifications.vue";
export default {
  data() {
    return {
      filter: Object,
      }
  },
  
  mounted(){
    this.udpdateHeader('campaigns');
    this.setCurrentRouteChild({child:''});
  },

  created() {

    if (typeof this.$route.params.filter !== "undefined") {
      this.filter = JSON.parse(this.$route.params.filter)
      console.log(this.filter)
      this.changeHeaderTab({ tab: "ALL" });
      return true;
    }

    if (typeof this.$route.params.id !== "undefined") {
      this.changeHeaderTab({ tab: "STATS" });
      return true;
    }
    this.changeHeaderTab({ tab: "ALL" });
  },

  components: {
    AllCampaigns,
    CampaignEdit,
    CampaignDashboard,
    ToastNotifications
  },

  computed: {
    ...mapState({
      headerTab: state => state.header.tab,
      isMenuCollapse: state => state.sidebar.isNavOpen,
      getCurrentRoute: state => state.headertopbar.page,
    }),

    user() {
      return this.$store.state.authentication.user;
    },

    campaignsTabComponent() {
      if (this.headerTab === "ALL") {
        return "AllCampaigns";
      }
      if (this.headerTab === "STATS") {

        if (typeof this.$route.params.filter !== "undefined") {
          return "AllCampaigns";
        }

        return "CampaignDashboard";
      }
      // SELECTED
      return "CampaignEdit";
    },
     selectedCampaignName(){
        return this.$route.params.name;
     },
    selectedCampaignId() {
      return this.$route.params.id;
    },
  },

  methods: {
    ...mapActions("header", {
      changeHeaderTab: "changeTab"
    }),
     ...mapActions("headertopbar", {
         setCurrentRoute:"setRoute",
         setCurrentRouteChild:"setRouteChild"
    }),
     udpdateHeader(route){
      this.setCurrentRoute({page:route});
    },
  }
};
</script>