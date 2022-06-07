<template>
<section class="ml-0 pl-0 info w-100 col-sm-12">
  <main  
  :class="fullView ? 'main' : 'col-12'">
  
  <LoadingSpinner v-if="loading" />
  <div 
  :class="fullView ? 'pt-5' : ''" v-else>

      <div v-if="(adminTeam() || !permissionFront()) && opportunity.link.link_status_id == 8 && opportunity.link.link_status_reason_id == 34"
      class="p-2 m-3 rounded  bg-danger" >
        <small class="text-white">{{$t('lang.refuse.refusewarning')}}
            </small>
    </div> 
      <div v-if="(adminTeam() || !permissionFront()) && opportunity.link.link_status_id == 8 && opportunity.link.link_status_reason_id == 35"
      class="p-2 m-3 rounded  bg-warning" >
        <small class="text-white">{{$t('lang.refuse.absent')}}
            </small>
    </div> 

  <RefuseOpportunity 
  v-if="refuse && opportunity.link.link_status_reason_id != 35 && opportunity.link.link_status_reason_id != 34"
  @cancel="closeRefuse()"
  @refused="refused()"
  ></RefuseOpportunity>

  <div class="contentCenter" >

      <div  v-if="!refuse"
      class="row animated fadeIn fast mx-0">
       
       
      <div 
          class="col-md-4">



      <OportunityTopArea
         v-if="permissionFront()"
        :business="opportunity.business"
        :businessContacts="opportunity.business_contacts"
        :status="opportunity.status"
        :link="opportunity.link"
        :unlocked="opportunity.unlocked"
        @doNotContactBusiness="doNotContactBusiness($event)"
        @unsuscribeBusiness="unsuscribeBusiness($event)"
        @deleteBusiness="deleteBusiness($event)"
        @positiveBusiness="positiveBusiness($event)"
        @negativeBusiness="negativeBusiness($event)"
        @unlockContacts="unlockContacts($event)"
        @reloadOp="reloadOp($event)"
      />

           <div class="mt-4 card p-2 rounded " v-if="permissionFront()">
              <h6 class="mb-1">{{$t('lang.column.owner')}} OliverList</h6>
              <small>{{ opportunity.link.owner_name }} ({{ opportunity.link.cn_email }})</small>

              <div class="my-1" v-if="opportunity.link.calendar_link">
                <small><a target="_blank" :href="opportunity.link.calendar_link" class="text-primary cursor-pointer">
                <i class="icon-calendar mr-1"></i>Calendar</a>
                </small>
              </div>
              <div class="my-1" v-if="opportunity.link.landing_link">
                <small><a target="_blank" :href="opportunity.link.landing_link" class="text-primary cursor-pointer">
                <i class="icon-chrome mr-1"></i>Landing page</a>
                </small>
              </div>

              <h6 class="mb-1 mt-3">{{$t('lang.column.campaign')}}</h6>
              <small>{{ opportunity.link.campaign_name }}</small>
            </div>

          <Tasks
          v-if="permissionFront()"
          :link="opportunity"
          @pendingTasks="pendingTasks($event)"
          />


          <OpportunityContact
            :business="opportunity.business"
            :businessContacts="opportunity.business_contacts"
            :link="opportunity.link"
            :status="opportunity.status"
            :unlocked="opportunity.unlocked"
            @unlockContacts="unlockContacts($event)"
            @changeBusinessContactStatusByLinkId="changeBusinessContactStatusByLinkId($event)"
            @unsubscribeContact="unsubscribeContact($event)"
          />


    <button class="mt-4 btn btn-outline-primary w-100" 
    :disabled="opportunity.link.activerefuse == '1'"
    v-if="(adminTeam() || !permissionFront()) && 
      !(opportunity.link.link_status_reason_id == 34 || 
      opportunity.link.link_status_reason_id == 35) "
    @click="refuse=true">{{$t('lang.refuse.button')}}</button>

    <button class="mt-4 btn btn-outline-primary w-100" 
    :disabled="opportunity.link.activeabsent == '1'"
    v-if="(adminTeam() || !permissionFront()) &&
      !(opportunity.link.link_status_reason_id == 34 || 
      opportunity.link.link_status_reason_id == 35) "
    @click="absentContact()">{{$t('lang.refuse.absent')}}</button>

    <button class="mt-4 btn btn-outline-primary w-100" 
    v-if="(adminTeam() || !permissionFront()) && (opportunity.link.link_status_reason_id == 34
      ||  opportunity.link.link_status_reason_id == 35)"
    @click="valide()">{{$t('lang.label.setasvalidopportunity')}}</button>

          </div>
          <div 
          class="col-md-8" >
            <div class="card comments-activity-card" v-if="permissionFront()">
              <CommentsActivityTabs   />
              <div class="tab-content itemsOliver activity" id="pills-tabContent">
                <CommentsAction
                  :linkId="opportunity.link.id"
                  @createComment="opportunity.timelinePassed.unshift($event)"
                />
                <EmailAction
                  :businessContacts="opportunity.business_contacts"
                  :linkId="opportunity.link.id"
                  :campaignId="opportunity.link.campaign_id"
                  @addEmail="opportunity.timelinePassed.unshift($event)"
                />
                <ActivityAction :linkId="opportunity.link.id" />
               

                
              </div>
            </div>
            

            <TimelineInfo
              :timelineComming="opportunity.timelineComming"
              :timelinePassed="opportunity.timelinePassed"
              :timelineRecent="opportunity.timelineRecent"
              :emails="opportunity.emails"
              :status="opportunity.status"
              :id="opportunity.timelinePassed.length"
            />

            <span class="w-100 text-center mt-3 bg-secondary p-2  text-white" v-if="opportunity.timelinePassed.length == 0">
            {{ $t('lang.refuse.noactivity') }}
            </span>
          </div>
        
      </div>
       
      </div>
      </div>
      </main>
  </section>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { businessesService, opportunitiesService, businessContactsService } from "@/_services";
import OportunityTopArea from "@/components/Common/OportunityTopArea.vue";
import RefuseOpportunity from "@/components/Opportunities/RefuseOpportunity.vue";

import ContactEdition from "@/components/Common/ContactEdition.vue";
import ActivityDemoLinksTabs from "@/components/Opportunities/SingleOpportunity/ActivityDemoLinksTabs.vue";
import ActivityInfo from "@/components/Opportunities/SingleOpportunity/ActivityInfo.vue";
import DemoLinksInfo from "@/components/Opportunities/SingleOpportunity/DemoLinksInfo.vue";
import ProductsInfo from "@/components/Opportunities/SingleOpportunity/ProductsInfo.vue";
import TimelineInfo from "@/components/Opportunities/SingleOpportunity/TimelineInfo.vue";
import Tasks from "@/components/Opportunities/SingleOpportunity/Tasks.vue";
import CommentsActivityTabs from "@/components/Opportunities/SingleOpportunity/CommentsActivityTabs.vue";
import ActivityAction from "@/components/Opportunities/SingleOpportunity/ActivityAction.vue";
import CommentsAction from "@/components/Opportunities/SingleOpportunity/CommentsAction.vue";
import EmailAction from "@/components/Opportunities/SingleOpportunity/EmailAction.vue";
import OpportunityContact from "@/components/Common/OpportunityContact.vue";
import QualificationButtons from "@/components/Opportunities/SingleOpportunity/QualificationButtons.vue";
import LoadingSpinner from "@/components/LoadingSpinner.vue";


export default {
  data() {
    return {
      contactEdition: false,
      fullView: false,
      myteam:[],
      refuse:false
    };
  },
  
  components: {
    OportunityTopArea,
    ContactEdition,
    LoadingSpinner,
    OpportunityContact,
    ActivityDemoLinksTabs,
    ActivityInfo,
    DemoLinksInfo,
    ProductsInfo,
    TimelineInfo,
    CommentsActivityTabs,
    ActivityAction,
    CommentsAction,
    QualificationButtons,
    EmailAction,
    RefuseOpportunity,
    Tasks
  },

  props: {
    emails: Object,
    opportunity_id: Number
  },

  computed: {
    ...mapState({
      isMenuCollapse: state => state.sidebar.isNavOpen, 
      loading: state => state.opportunities.loadingOpportunity,
      opportunity: state => state.opportunities.selected.data,
      opportunities: state => state.opportunities.all.data,
      currentUser: (state) => state.authentication.user,
    })
  },

  created(){
    let opid;
    opid = this.opportunity_id
    this.fullView = false
    this.getOpportunityById({ id: opid });
    this.disabledEsc();
  },
 
  methods: {

   
    ...mapActions("opportunities", {
      getAll: "getAll",
      getOpportunityById: "getOpportunityById",
      reloadOpportunity: "reloadOpportunity",
      getPriorityOpportunity: "getPriority",
      resetPriorityOpportunity: "resetPriority",
      startLoading: "startLoading",
      finishLoading: "finishLoading",
      changeOpportunityStatus: "changeOpportunityStatus",
      setTasks: "setTasks"
    }),

    ...mapActions("headertopbar", {
        setCurrentRoute:"setRoute",
        setCurrentRouteChild:"setRouteChild"         
    }),

    permissionFront(){
      return (this.currentUser.team_role_id == undefined || this.currentUser.team_role_id != 3)
    },
    adminTeam(){
      return (this.currentUser.team_role_id != undefined && this.currentUser.team_role_id == 2)
    },
    reloadOp(){
      this.reloadOpportunity({ headerTab: "NOTHING", link_id: this.opportunity_id });
    },
    absentContact(){
      this.$swal({
        type: "warning",
        title: this.$t('lang.label.areyousure'),
        text: this.$t('lang.refuse.dontworry'),
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33a2c",
        confirmButtonText: this.$t('lang.button.ok'),
        cancelButtonText: this.$t('lang.button.cancel')
      }).then(result => {
        if(result.value){
         this.startLoading();
         opportunitiesService
            .changeStatus(8,this.opportunity.link.id,35)
            .then(opportunity => {
              this.opportunity.link.link_status_id = 8
              this.opportunity.link.link_status_reason_id = 35
              this.finishLoading();
              this.$forceUpdate();
            });
        }
      });
    },
    closeRefuse(){
      this.refuse=false
    },
    openRefuse(){
      this.refuse=true
    },
    refused(){
              this.opportunity.link.link_status_id = 8
              this.opportunity.link.link_status_reason_id = 34
              this.closeRefuse()
    },

    disabledEsc(){
      document.addEventListener('keydown', function(e){
            if((e.key=='Escape'||e.key=='Esc'||e.keyCode==27) && (e.target.nodeName=='BODY')){
                e.preventDefault();
               e.stopPropagation();
                return false;
            }
        });
        document.onkeydown = function(e){
          if(e.keyCode === 27){ 
              e.preventDefault();
               e.stopPropagation();
              return false;
          }
      };
    },

    doNotContactBusiness(qualificationOptions) {
      this.$swal({
        type: "warning",
        title: this.$t('lang.label.areyousure'),
        text: this.$t('lang.label.donotcontactthisbusiness'),
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33a2c",
        confirmButtonText: this.$t('lang.label.yesdonotcontactthem'),
        cancelButtonText: this.$t('lang.button.cancel')
      }).then(result => {
    
      });
    },


    deleteBusiness(qualificationOptions) {
      this.$swal({
        type: "warning",
        title: this.$t('lang.label.areyousure'),
        text: this.$t('lang.label.youaregoingtoclaimthisopportunity'),
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33a2c",
        confirmButtonText: this.$t('lang.label.yesclaimthisopportunity'),
        cancelButtonText: this.$t('lang.button.cancel')
      }).then(result => {
        if (result.value) {
          this.startLoading();
          opportunitiesService
            .changeStatus(11,qualificationOptions.linkId)
            .then(opportunity => {
              this.getAll({currentPage:"1", cantPerPage: "10", searchFilter: ""});
              this.$forceUpdate();
            });
        }
      });
    },

    valide() {
      this.$swal({
        type: "success",
        title: this.$t('lang.label.areyousure'),
        text: this.$t('lang.label.setasvalidopportunity'),
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33a2c",
        confirmButtonText: this.$t('lang.button.yes'),
        cancelButtonText: this.$t('lang.button.cancel')
      }).then(result => {
          if(result.value){
          //this.startLoading();
          opportunitiesService
          .changeStatus(
            8,
            this.opportunity_id
          )
          .then(opportunity => {
             // this.finishLoading();
            this.reloadOpportunity({ headerTab: "NOTHING", link_id: this.opportunity_id });
          });
        }
      });
    },

    positiveBusiness(qualificationOptions) {
      this.$swal({
        type: "success",
        title: this.$t('lang.label.areyousure'),
        text: this.$t('lang.label.companytakecontrol'),
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33a2c",
        confirmButtonText: this.$t('lang.button.yes'),
        cancelButtonText: this.$t('lang.button.cancel')
      }).then(result => {
          if(result.value){
          //this.startLoading();
          this.changeOpportunityStatus({link_id : qualificationOptions.linkId, link_status_name : "Positive"});
          opportunitiesService
          .changeStatus(
            8,
            qualificationOptions.linkId,
            qualificationOptions.statusReason
          )
          .then(opportunity => {
             // this.finishLoading();
            this.reloadOpportunity({ headerTab: "NOTHING", link_id: this.opportunity_id });
          });
        }
      });
    },

    negativeBusiness(qualificationOptions) {
      this.$swal({
        type: "warning",
        title: this.$t('lang.label.letolivertakecontrol'),
        text: this.$t('lang.label.olivertakecontrol'),
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33a2c",
        confirmButtonText: this.$t('lang.button.yes'),
        cancelButtonText: this.$t('lang.button.cancel')
      }).then(result => {
       if(result.dismiss != 'cancel'){
          opportunitiesService
          .changeStatus(
            5,
            qualificationOptions.linkId,
            qualificationOptions.statusReason,
            qualificationOptions.nextCampaignId,
            qualificationOptions.campaignDate
          )
          .then(opportunity => {
            this.getAll({currentPage:"1", cantPerPage: "10", searchFilter: ""});
            this.$forceUpdate();
          });
        }
      });
    },
    unlockContacts(qualificationOptions) {
      this.$swal({
        type: "warning",
        title: this.$t('lang.label.unlockcontactsfor'),
        text: this.$t('lang.label.byunlockingcontacts'),
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33a2c",
        confirmButtonText: this.$t('lang.button.yes'),
        cancelButtonText: this.$t('lang.button.cancel')
      }).then(result => {
       if(result.dismiss != 'cancel'){
          opportunitiesService
          .unlockContactsOpportunity(
            qualificationOptions.linkId
          )
          .then(opportunity => {
          this.$forceUpdate();
          });
        }
      });
    },
    pendingTasks(cant){

      this.setTasks({link_id: this.opportunity_id, tasks: cant});
      return true;
      this.opportunities.list.forEach((opp,key) => {
         if(opp.link_id == this.opportunity_id){
            this.opportunities.list[key].tasks = cant
            return true
         }
      });
    },
    changeBusinessContactStatusByLinkId(options){ 
      this.$swal({
        type: "warning",
        title: this.$t('lang.label.areyousure'),
        text: this.$t('lang.label.thiscontactwillbeunsubscribedfromthiscampaignand'),
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33a2c",
        confirmButtonText: this.$t('lang.button.yes'),
        cancelButtonText: this.$t('lang.button.cancel')
      }).then(result => {
       if(result.dismiss != 'cancel'){
          businessContactsService
          .changeStatusByLinkId(options.businessContactId, options.linkId, 7)
          .then(opportunity => {
            this.reloadOpportunity({ headerTab: "NOTHING", link_id: this.opportunity_id });
          });
        }
      });
    },
    unsuscribeBusiness(options){
      // console.log(options)
      this.$swal({
        type: "warning",
        title: this.$t('lang.label.areyousure'),
        text: this.$t('lang.label.allcontactspresentinthisopportunitywillbeunsubscribedfromthiscampaign'),
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33a2c",
        confirmButtonText: this.$t('lang.button.yes'),
        cancelButtonText: this.$t('lang.button.cancel')
      }).then(result => {
        if (result.value) {
         //connect to service
          this.startLoading();
          opportunitiesService
            .changeStatus(13,options.linkId)
            .then(opportunity => {
              this.getAll({currentPage:"1", cantPerPage: "10", searchFilter: ""});
              this.$forceUpdate();
            });
        }
      });
    },

    unsubscribeContact(options){
     this.$swal({
        type: "warning",
        title: this.$t('lang.label.areyousure'),
        text: this.$t('lang.label.thiscontactwillbeunsubscribedfromthiscampaign'),
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33a2c",
        confirmButtonText: this.$t('lang.button.yes'),
        cancelButtonText: this.$t('lang.button.cancel')
      }).then(result => {
        if (result.value) {
          //connect to service
           businessContactsService
          .changeStatusContactUnsubscribe(options.businessContactId, options.linkId)
          .then(opportunity => {

            this.reloadOpportunity({ headerTab: "NOTHING", link_id: this.opportunity_id });
          });
        }
      });
    },

    lateQualifiedOpportunity(qualificationOptions) {
      this.startLoading();
      opportunitiesService
        .changeStatus(
          7,
          qualificationOptions.linkId,
          qualificationOptions.statusReason,
          qualificationOptions.nextCampaignId,
          qualificationOptions.campaignDate
        )
        .then(opportunity => {
              this.getAll({currentPage:"1", cantPerPage: "10", searchFilter: ""});
              this.reloadOpportunity({ headerTab: "NOTHING", link_id: this.opportunity_id });
        });
    },

    busyOpportunity(qualificationOptions) {
      this.startLoading();
      opportunitiesService
        .changeStatus(
          6,
          qualificationOptions.linkId,
          qualificationOptions.statusReason,
          qualificationOptions.nextCampaignId,
          qualificationOptions.campaignDate
        )
        .then(opportunity => {
          this.resetPriorityOpportunity();
          this.getPriorityOpportunity();
          this.reloadOpportunity({ headerTab: "NOTHING", link_id: this.opportunity_id });
        });
    },

    convertedOpportunity(qualificationOptions) {
      this.startLoading();
      opportunitiesService
        .changeStatus(
          9,
          qualificationOptions.linkId,
          qualificationOptions.nextCampaignId,
          qualificationOptions.campaignDate
        )
        .then(opportunity => {
              this.getAll({currentPage:"1", cantPerPage: "10", searchFilter: ""});
              this.reloadOpportunity({ headerTab: "NOTHING", link_id: this.opportunity_id });
        });
    },

    lostOpportunity(qualificationOptions) {
      this.startLoading();
      opportunitiesService
        .changeStatus(
          12,
          qualificationOptions.linkId,
          qualificationOptions.statusReason,
          qualificationOptions.nextCampaignId,
          qualificationOptions.campaignDate
        )
        .then(opportunity => {
              this.getAll({currentPage:"1", cantPerPage: "10", searchFilter: ""});
              this.reloadOpportunity({ headerTab: "NOTHING", link_id: this.opportunity_id });
        });
    }
  }
};
</script>