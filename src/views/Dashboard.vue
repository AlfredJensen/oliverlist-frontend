<template>
  <section class="campaign">
    <Header :user="user" />
    <main class="main  animated fadeIn faster" :class="{ 'expand-main' : isMenuCollapse }">
      <ViewDashboard v-if="user.role_id != 1"></ViewDashboard>
      <DashboardAdmin v-if="user.role_id == 1"></DashboardAdmin>
    </main>
  </section>
</template>
<script>
import { mapState, mapActions } from "vuex";
import Header from "@/components/Header.vue";
import ViewDashboard from "@/components/Dashboard/ViewDashboard.vue";
import DashboardAdmin from "@/components/Dashboard/DashboardAdmin.vue";
import ToastNotifications from "@/components/ToastNotifications.vue";


export default {

  data(){
    return{
        pmethods:[],
        loading:true
    }
  },
   mounted(){
    //window.onbeforeunload  = null;
    this.udpdateHeader(this.$route.name);
    this.setCurrentRouteChild({child:''});
  },

  created() {
    this.changeHeaderTab({ tab: "ALL" });
    if (typeof this.$route.params.id !== "undefined") {
      this.changeHeaderTab({ tab: "SELECTED" });
    }
  },

  components: {
    ToastNotifications,
    ViewDashboard,
    DashboardAdmin
  },

  computed: {
    ...mapState({
      headerTab: state => state.header.tab,
      isMenuCollapse: state => state.sidebar.isNavOpen,

      paymentMethods: state => state.billings.all
    }),

    user() {
      return this.$store.state.authentication.user;
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
