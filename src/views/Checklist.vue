<template> 
  <section class="checklist">
    <Header :user="user" />
     <main class="main p-4"  :class="{ 'expand-main' : isMenuCollapse }">
    <div class="row mb-4" v-if="false">
      <div class="col-12 ml-1">
        <h5>{{$t('lang.checklist.title')}}</h5>
        <p class="mb-2">{{$t('lang.checklist.desc')}}</p>   
        <Tutorial
          id="3B1w3jza9rc"
          key="tutorialvideo"
          :videoTitle="$t('lang.label.welcomeback')"
          linkClass="small mr-3 mb-3"
          :autoplay="openvideo"
          :videoUrl="'https://www.youtube.com/embed/3B1w3jza9rc'"
                />
      </div>
    </div>
    <div class="row border ml-1 mr-1 pt-2">
      <div class="col-md-4">
        <ul class="">
          <li class=" p-3 w-100">
            <span class="circle rounded-circle bg-success text-white">
            <i class="icon-checkmark p-3 "></i>
            </span>
            <strong class="ml-2 text-success">Create your account</strong>
          </li>
          <router-link 
            to="/settings-account?synchronisation=1"
            class="float-left p-3 cursor-pointer"
            >
            <span class="circle rounded-circle"
            :class="getIsEmailSync() ? 'bg-success text-white':'border-secondary border  text-secondary bg-white'">
            <i class="icon-checkmark p-3 "></i>
            </span>
            <strong class="ml-2" :class="getIsEmailSync() ? 'text-success':'text-secondary'">{{$t('lang.dashboard.connectemail')}}</strong>
          </router-link>
          <a class="float-left p-3 cursor-pointer  w-100"
          href="https://chrome.google.com/webstore/detail/oliverlistcom/cnokccdjefelbfmadgbekghhaefmdofm"
          target="_blank"
          >


            <span class="circle rounded-circle"
            :class="getExtension() ? 'bg-success text-white':'border-secondary border  text-secondary bg-white'">
            <i class="icon-checkmark p-3 "></i>
            </span>
            <strong class="ml-2" :class="getExtension() ? 'text-success':'text-secondary'">{{$t('lang.linkedin.downloadextension')}}</strong>
          </a>
          <router-link 
            to="/mysearchs"
            class="float-left p-3 cursor-pointer  w-100">
            <span class="circle rounded-circle"
            :class="getSearchContacts() ? 'bg-success text-white':'border-secondary border  text-secondary bg-white'">
            <i class="icon-checkmark p-3 "></i>
            </span>
            <strong class="ml-2" :class="getSearchContacts() ? 'text-success':'text-secondary'">{{$t('lang.ondemand.searchcontacts')}}</strong>
          </router-link>
          <router-link
            to="/campaigns"
            class="float-left p-3 cursor-pointer  w-100">
            <span class="circle rounded-circle"
            :class="getCampaignId() ? 'bg-success text-white':'border-secondary border  text-secondary bg-white'">
            <i class="icon-checkmark p-3 "></i>
            </span>
            <strong class="ml-2" :class="getCampaignId() ? 'text-success':'text-secondary'">{{$t('lang.dashboard.createfirstcampaign')}}</strong>
          </router-link>
        </ul>
      </div>
      <div class="col-md-8  ">
      <div class="cont-video">
       <iframe  
       :src="'https://www.youtube.com/embed/' + $t('lang.videos.checklist')" 
       frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

      </div>
      </div>
    </div>
    </main>
  </section>
</template>
<script>
import { mapState, mapActions } from "vuex";
import Header from "@/components/Header.vue";
import Tutorial from "@/components/Tutorial.vue";
import {
  opportunitiesService
} from "@/_services";

export default {
  data(){
    return {
      dashboardTotals: {},
    }
  },

  components: {
    Header,
    Tutorial
  },

  computed: {
    ...mapState({
      headerTab: state => state.header.tab,
      iswatchVideo: (state) => state.authentication.watchvideo,
      isMenuCollapse: state => state.sidebar.isNavOpen,
    }),
    user() {
      return this.$store.state.authentication.user;
    },
  },
  created() {

    if(this.iswatchVideo == undefined){
      this.openvideo=true
      this.tutorialvideo++
      const { dispatch } = this.$store;
      dispatch("authentication/watchVideo", true);
    }else{
      this.openvideo = false
    }

   this.udpdateHeader('mychecklist');
    this.getDashboardData()
  },
  methods: {
      ...mapActions("headertopbar", {
        setCurrentRoute: "setRoute",
        setCurrentRouteChild: "setRouteChild",
      }),
    udpdateHeader(route) {
      this.setCurrentRoute({ page: route });
      this.setCurrentRouteChild({ child: "" });
    },
    getSearchContacts(){
      return this.dashboardTotals.search_contacts
    },
    getExtension(){
      return this.dashboardTotals.extension
    },
    getIsEmailSync(){
      return this.dashboardTotals.email_sync
    },
    getDashboardData() {
      opportunitiesService.getDashboardTotals().then((result) => {
        this.dashboardTotals = result;
        this.loadingDashboard = false;
        this.$store.state.authentication.checklist = this.dashboardTotals.cant;
      });
    },
    getCampaignId(){
      if(this.dashboardTotals.allcampaigns && this.dashboardTotals.allcampaigns[0] !== undefined){
        return this.dashboardTotals.allcampaigns[0].id
      }
    },
  }
}; 
</script>
<style>
.cont-video {
    height: calc(100vh - 200px);
    width: 100%;
  vertical-align:top;
}

iframe {
  vertical-align:top;
    width: 100%;
    height: 100%;
}
</style>