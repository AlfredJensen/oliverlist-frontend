<template>
  <section class="opportunity">
    <Header :user="user" />
    <main class="main"  :class="{ 'expand-main' : isMenuCollapse }">
      <allopps></allopps>
    </main>
  </section>
</template>

<script>
import { mapState, mapActions } from "vuex";
import Header from "@/components/Header.vue";
import PriorityOpportunity from "@/components/Opportunities/PriorityOpportunity.vue";
import ToastNotifications from "@/components/ToastNotifications.vue";

export default {
  created() {  
   
  },
   mounted(){
    window.onbeforeunload  = null;
    this.udpdateHeader('opportunities');
  },
  components: {
    ToastNotifications
  },
 

  computed: {
    ...mapState({
       isMenuCollapse: state => state.sidebar.isNavOpen,  
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
    }),
     udpdateHeader(route){
      this.setCurrentRoute({page:route});
    },
    Page(){
          if(this.$route.fullPath == '/opportunities'){this.changeHeaderTab({ tab: "ALL" });}
          return 
        },
  }
};
</script>
