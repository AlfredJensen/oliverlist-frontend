<template>
  <section class="email">
    <Header :user="user" />
    <main class="main"  :class="{ 'expand-main' : isMenuCollapse }">
      <component :is="emailsTabComponent" :selectedEmailId="selectedEmailId" :selectedEmailSubject="selectedEmailSubject"></component>
    </main>
  </section>
</template>

<script>
import { mapState, mapActions } from "vuex";
import Header from "@/components/Header.vue";
import AllEmails from "@/components/Emails/AllEmails.vue";
import EmailView from "@/components/Emails/EmailView.vue";
import EmailThread from "@/components/Emails/EmailThread.vue";

export default {
  created() {
    this.changeHeaderTab({ tab: "ALL" });
    if (typeof this.$route.params.id !== "undefined") {
      this.changeHeaderTab({ tab: "SELECTED" });
    }
  },

  components: {
    
    AllEmails,
    EmailView,
    EmailThread
  },
   mounted(){
    window.onbeforeunload  = null;
    this.udpdateHeader(this.$route.name);
  },

  computed: {
    ...mapState({
      headerTab: state => state.header.tab,
      isMenuCollapse: state => state.sidebar.isNavOpen,
    }),

    user() {
      return this.$store.state.authentication.user;
    },

    emailsTabComponent() {
      if (this.headerTab === "ALL") {
        return "AllEmails";
      } else if (this.headerTab === "THREAD") {
        return "EmailThread";
      } else {
        return "EmailView";
      }
    },
    selectedEmailSubject(){
        return this.$route.params.subject;
    },

    selectedEmailId() {
      return this.$route.params.id;
    }
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
      this.setCurrentRouteChild({child:''});
    }
  }
};
</script>
