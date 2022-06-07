<template>
  <section class="businesses">
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
import AllBusinesses from "@/components/Businesses/AllBusinesses.vue";
import AllCompanies from "@/components/Companies/AllCompanies.vue";
import MyContacts from "@/components/Contacts/MyContacts.vue";
import ImportLinkedinContacts from "@/components/Contacts/ImportLinkedinContacts.vue";
import SelectedBusiness from "@/components/Businesses/SelectedBusiness.vue";
import SelectedContact from "@/components/Businesses/SelectedContact.vue";
import SelectedCompany from "@/components/Businesses/SelectedCompany.vue";
import ToastNotifications from "@/components/ToastNotifications.vue";

export default {
data() {
    return {
      route:'',
    }
    
},

  created() {
    this.changeRoute();
    this.udpdateHeader('contacts');
  },

  components: {
    AllBusinesses,
    SelectedContact,
    SelectedCompany,
    ToastNotifications,
    ImportLinkedinContacts,
    AllCompanies,
    MyContacts
  },
  mounted() {
    window.onbeforeunload = null;
   
  },

  computed: {
    ...mapState({
      headerTab: (state) => state.header.tab,
      isMenuCollapse: (state) => state.sidebar.isNavOpen,
    }),
    Page(){
      this.route = this.$route.path;
      if(this.route.includes('/businesses')){this.changeHeaderTab({ tab: "ALL" });}
      return this.route = this.$route.path;
    },

    user() {
      return this.$store.state.authentication.user;
    },


    businessesTabComponent() {

      if (this.headerTab === "ALL") {
        return "AllBusinesses";
      } else {

        if (this.headerTab === "AllCompanies") {
          return "AllCompanies";
        }else{

          if (this.headerTab === "SelectedCompany") {
            return "SelectedCompany";
          } else if (this.headerTab === "SelectedContact") {
              return "SelectedContact";
            }else if (this.headerTab === "MyContacts") {
              return "MyContacts";
            }
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
    changeTab(){
      this.changeHeaderTab({ tab: "ALL" });
    },
   
    changeRoute(){
        this.changeHeaderTab({ tab: "ALL" });
        if (typeof this.$route.params.id !== "undefined") {
          if (this.nameRoute(this.$route.fullPath)) {
            this.changeHeaderTab({ tab: "SelectedContact" });
          } else {
            this.changeHeaderTab({ tab: "SelectedCompany" });
          }
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
