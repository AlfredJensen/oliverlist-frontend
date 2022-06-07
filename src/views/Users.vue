<template>
  <section class="businesses">
    <Header :user="user" />
    <main class="main"  :class="{ 'expand-main' : isMenuCollapse }" >
      <component :is="businessesTabComponent" :selectedUserId="selectedUserId"></component>
    </main>
  </section>
</template>

<script>
import { mapState, mapActions } from "vuex";
import Header from "@/components/Header.vue";
import AllUsers from "@/components/Users/AllUsers.vue";
import SelectedUser from "@/components/Users/SelectedUser.vue";

export default {
  created() {
    this.changeHeaderTab({ tab: "ALL" });
    if (typeof this.$route.params.id !== "undefined") {
      this.changeHeaderTab({ tab: "SELECTED" });
    }
  },

  components: {
    AllUsers,
    SelectedUser
  },
    mounted(){
    window.onbeforeunload  = null;
     this.udpdateHeader('users');
  },

  computed: {
    ...mapState({
      headerTab: state => state.header.tab,
      isMenuCollapse: state => state.sidebar.isNavOpen,
    }),

    user() {
      return this.$store.state.authentication.user;
    },

    businessesTabComponent() {
      if (this.headerTab === "ALL") {
        return "AllUsers";
      } else {
        return "SelectedUser";
      }
    },

    selectedUserId() {
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
    },
  }
};
</script>