<template>
  <section class="campaign">
    <main class="main  animated fadeIn faster" :class="{ 'expand-main' : isMenuCollapse }">
      <LoadingSpinner v-if="loading" />
      <ol class="breadcrumb">
        <li class="breadcrumb-item active">{{ $t('lang.menu.tutorials') }}</li>
      </ol>
    <div class="contenedor animated fadeIn faster">
      <section class="five-step-company">
          <div class="contenedor">
            <div class="row ">
              <h2 class="mb-0">{{ $t('lang.label.howtochangethelanguageonoliver') }}</h2>
                <div class="col-10 mx-auto mt-4">
                  <div class="embed-responsive embed-responsive-16by9">
                    <iframe class="embed-responsive-item" src="https://player.vimeo.com/video/416293401" allowfullscreen></iframe>
                  </div>
                </div>
            </div>
          </div>
          <div class="contenedor">
            <div class="row ">
              <h2 class="mb-0">{{ $t('lang.label.howdoichangemypassword') }}</h2>
                <div class="col-10 mx-auto mt-4">
                  <div class="embed-responsive embed-responsive-16by9">
                    <iframe class="embed-responsive-item" src="https://player.vimeo.com/video/416295945" allowfullscreen></iframe>
                  </div>
                </div>
            </div>
          </div>
          <div class="contenedor">
            <div class="row ">
              <h2 class="mb-0">{{ $t('lang.label.howdoichangemypaymentmethod') }}</h2>
                <div class="col-10 mx-auto mt-4">
                  <div class="embed-responsive embed-responsive-16by9">
                    <iframe class="embed-responsive-item" src="https://player.vimeo.com/video/416296184" allowfullscreen></iframe>
                  </div>
                </div>
            </div>
          </div>
          <div class="contenedor">
            <div class="row ">
              <h2 class="mb-0">{{ $t('lang.label.howdoyouchangeyourbudget') }}</h2>
                <div class="col-10 mx-auto mt-4">
                  <div class="embed-responsive embed-responsive-16by9">
                    <iframe class="embed-responsive-item" src="https://player.vimeo.com/video/416296373" allowfullscreen></iframe>
                  </div>
                </div>
            </div>
          </div>
          <div class="contenedor">
            <div class="row ">
              <h2 class="mb-0">{{ $t('lang.label.howtochangeyourtarget') }}</h2>
                <div class="col-10 mx-auto mt-4">
                  <div class="embed-responsive embed-responsive-16by9">
                    <iframe class="embed-responsive-item" src="https://player.vimeo.com/video/416296600" allowfullscreen></iframe>
                  </div>
                </div>
            </div>
          </div>
          <div class="contenedor">
            <div class="row ">
              <h2 class="mb-0">{{ $t('lang.label.howdoistopthecontact') }}</h2>
                <div class="col-10 mx-auto mt-4">
                  <div class="embed-responsive embed-responsive-16by9">
                    <iframe class="embed-responsive-item" src="https://player.vimeo.com/video/416296654" allowfullscreen></iframe>
                  </div>
                </div>
            </div>
          </div>
      </section>
    </div>
  </main>
</section>
</template>
<script>
import { mapState, mapActions } from "vuex";


export default {
  created() {
    this.changeHeaderTab({ tab: "ALL" });
    if (typeof this.$route.params.id !== "undefined") {
      this.changeHeaderTab({ tab: "SELECTED" });
    }
  },

  components: {
    
  },

  computed: {
    ...mapState({
      headerTab: state => state.header.tab,
       isMenuCollapse: state => state.sidebar.isNavOpen,
    }),

    user() {
      return this.$store.state.authentication.user;
    },

    // campaignsTabComponent() {
    //   if (this.headerTab === "ALL") {
    //     return "AllCampaigns";
    //   }
    //   return "CampaignDetail";
    // },

    // selectedCampaignId() {
    //   return this.$route.params.id;
    // }
  },

  methods: {
    ...mapActions("header", {
      changeHeaderTab: "changeTab"
    })
  }
};
</script>