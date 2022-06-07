<template>
  <section class="usages">
    <Header :user="user" />
    <main class="main"  :class="{ 'expand-main' : isMenuCollapse }" >
      <component :is="businessesTabComponent" :selectedContactId="selectedContactId" :selectedBusinessId="selectedBusinessId"></component>
    </main>
  </section>
</template>

<script>
import { mapState, mapActions } from "vuex";
import Router from "vue-router";
import Header from "@/components/Header.vue";
import AllUsages from "@/components/Usages/AllUsages.vue"

export default {
  created() {
    this.changeHeaderTab({ tab: "ALL" });
    if (typeof this.$route.params.id !== "undefined") {   
        this.changeHeaderTab({ tab: "SelectedCompany" });
    }
  },

  components: {
    AllUsages,
  },
  mounted() {
    window.onbeforeunload = null;
     this.udpdateHeader(this.$route.name);
  },

  computed: {
    ...mapState({
      headerTab: (state) => state.header.tab,
      isMenuCollapse: (state) => state.sidebar.isNavOpen,
    }),

    user() {
      return this.$store.state.authentication.user;
    },
   

    businessesTabComponent() {
      if (this.headerTab === "ALL") {
        return "AllUsages";
      } else {
          if (this.headerTab === "SelectedContact") {
            return "SelectedContact";
          }
      }
    },

    selectedContactId() {
      if (this.headerTab === "SelectedContact") {
      return this.$route.params.id;}
      else{
        return this.$route.params.businessId;
      }
    },
    selectedBusinessId() {
       if (this.headerTab === "SelectedContact") {
      return this.$route.params.businessId;
       }else{
          return this.$route.params.id;
       }
    }
  },

  methods: {
    ...mapActions("header", {
      changeHeaderTab: "changeTab",
    }),
    nameRoute(name) {
      if (name.includes("contact")) {
        return true;
      } else {
        return false;
      }
    },
      ...mapActions("headertopbar", {
         setCurrentRoute:"setRoute",
         setCurrentRouteChild:"setRouteChild"
    }),
     udpdateHeader(route){
      this.setCurrentRoute({page:route});
      this.setCurrentRouteChild({child:''});
    },
  },
};
</script>
