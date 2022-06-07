<template>
  <section class="campaign">
    <Header :user="user" />
    <main class="main">
     <ViewBilling></ViewBilling>
    </main>
  </section>
</template>
<script>
import { mapState, mapActions } from "vuex";
import Header from "@/components/Header.vue";
import ViewBilling from "@/components/Billing/ViewBilling.vue";


export default {
  created() {
    this.changeHeaderTab({ tab: "BILLING" });
  },

  components: {
    Header,
    ViewBilling
  },

  computed: {
    ...mapState({
      headerTab: state => state.header.tab
    }),

    user() {
      return this.$store.state.authentication.user;
    },
  },

  methods: {
    ...mapActions("header", {
      changeHeaderTab: "changeTab"
    })
  }
};
</script>