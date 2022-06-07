<template>
  <div :class="isExpandedList ? 'mailDetail col-md-9' : ''">
        <div class="wrapper-notifications" :class="isMenuCollapse ? 'ml-5 pl-2': 'expandedmenu'" >
             <div class="p-3 m-3 bg-light" v-if="showTrialPeriodEndedAlert">
                    <strong v-if="!currentUser.user.codepromo_id">{{$t('lang.label.yourtrialendsin')}} {{endDateString}}</strong>
                    <strong v-if="currentUser.user.codepromo_id">{{$t('lang.label.yourtrialpromoends',{discount:40})}} {{endDateString}}</strong>
                    <router-link class="btn btn-primary themed-button  btn-sm mx-2 ml-2"  to="/upgrade">
                        <i class="icon icon-rocket"></i>
                         {{ $t("lang.button.upgrade") }}
                       </router-link>
                    <strong :class="daysLeft < 2 ? 'text-danger':''">{{counterdate}}</strong>
            </div> 

            

            <div class="p-2 m-3 rounded bg-secondary text-white" 
            v-if="toastNotificationData.credits.left <= 0 && this.user.role_id > 1"
            >
                    <small class="text-black">
                    <i class="icon icon-circle"></i>
                    {{ $t('lang.problem.credits',
                    { date: toastNotificationData.credits.to }) }}.
                    </small>
            </div> 


            <div class="p-2 m-3 rounded bg-danger" v-if="hasDeclinedPayments && this.user.role_id > 1">
                    <small class="text-white">{{ $t('lang.problem.payment') }} <a  class=" ml-2 btn btn-primary themed-button btn-sm" href="/settings-account?billing=1&payment=1">{{ $t('lang.button.parameters') }}</a>
                    </small>
            </div> 
            <div class="p-2 m-3 rounded  bg-danger" v-if="showRegisterPaymentMethodAlert">
                    <small class="text-white">{{ $t('lang.label.youneedtoregisteryourpaymentmethod') }} <a  class=" ml-2 btn btn-primary themed-button btn-sm" href="/settings-account?billing=1&payment=1">{{ $t('lang.button.parameters') }}</a>
                    </small>
            </div> 
            <div class="p-2 m-3 rounded  bg-primary" v-if="showCampaignsAlert" >
                <div v-for="(campaign, key) in campaignsWithNoEmailsSent" :key="key" >
                        <small class="text-white" v-html="$t('lang.label.camapignnextscheduleddate', {'campaign_name': campaign.name, 'next_scheduled_date': campaign.next_scheduled_date})">
                        </small>
                        <i class="icon-close text-white float-right cursor-pointer" v-if="false"></i>
                </div>
            </div> 

            <div v-if="
                notifs.length > 0" class="notification" :class="min ? 'minimized':''">
          

        

            <div
                class="p-2 my-2 w-100 float-left" v-if="
                notifs.length > 0"
                >
                <button   v-if="min == false"
                @click="toggleMin()"
                class="float-right btn btn-sm btn-secondary">
                <i class="icon-minus mr-1"></i>{{ $t('lang.notification.hide') }}
                </button>
                <button v-if="min == true"
                @click="toggleMin()"
                class="float-right btn btn-sm bg-primary text-white">
                <i class="icon-bell mr-1"></i>

                ({{ notifs.length }})
                </button>
             </div>

            <div
                class="pr-2 my-2 w-100 float-left"
                 v-if="notifs.length > 0">
                <button 
                @click="removeNotifs()"
                class="float-right btn btn-sm btn-secondary">
                <i class="icon-close mr-1"></i>{{ $t('lang.notification.delete') }}
                </button>
                </div>

               <transition name="fade"
                v-for="(notification, k2) in notificationsPopup"
                    :key="k2">

                    <div v-if="notification !== undefined">


                <div 
                v-if="!isDeleted(notification.id)"
                class="card shadow rounded-2 p-3 bg-white m-2 notif-body"
                 >
                    <div>
                    <div>
                    <small><strong>{{ getTranslation(notification.title) }}</strong></small>
                    <i class="icon-close float-right cursor-pointer"
                    @click="close(notification.id)"></i>
                    </div>
                    </div>
                    <small>{{ getTranslation(notification.message) }}</small>  
                    <small 
                    class="text-primary cursor-pointer font-weight-bold"
                    v-if="notification.entity_type == 'link'" @click="goToOpportunity(notification.ref_id)">{{ $t('lang.notification.seemore') }}</small>
                    <small class="text-ligth">{{ notification.created }}</small> 
                </div>
                </div>
                </transition>
            </div>
            
        </div>
    </div>
</template>
<script>
import { usersService,notificationService, smtpMailboxesService, billingsService } from "@/_services";
import { billingUtilsMixin, formattersMixin } from "@/_mixins/";
import { mapState, mapMutations, mapActions } from "vuex";

import Vue from 'vue'
import VueNativeNotification from 'vue-native-notification'
Vue.use(VueNativeNotification, {
  requestOnNotify: true
});
export default {
     data () {
        return { 
            timer: null,
              notifs:[],
              hasactiveimport:false,
              notifdeleted: '',
              min:false,
              notifsIds:[],
              counterdate: '',
              isWaitingForRefreshToken: false
        }
    },
    created() {
        this.isWaitingForRefreshToken = false;
        this.loadNotifs();
        this.isTrialPeriodEnded();
        this.interval = setInterval(() => this.isTrialPeriodEnded(), 20000);
        this.interval2 = setInterval(() => this.checkTokenExpired(), 1000);
        this.countdown = setInterval(() => this.countDown(), 1000);
    },
    mixins: [billingUtilsMixin, formattersMixin],
    props: {
        notification: [],
    },
    computed: {
        user() {
          return this.$store.state.authentication.user;
        },
        toastNotificationData() {
            return this.$store.state.authentication.toastNotificationData;
        },
        daysLeft() {
          return this.$store.state.authentication.toastNotificationData.trialPeriodData.days;
        },
        endDate() {
          return this.$store.state.authentication.toastNotificationData.trialPeriodData.end_date;
        },
        endDateString() {
          return this.$store.state.authentication.toastNotificationData.trialPeriodData.end_date_string;
        },
        contactsLeft() {
          return this.$store.state.authentication.toastNotificationData.trialPeriodData.contacts_left;
        },
        showEmailAlert(){
            return this.user.role_id == '2' && !this.$store.state.authentication.isEmailSync;
        },
        showTrialPeriodEndedAlert(){
            return this.user.subscription_status_id != 1 && this.$store.state.authentication.toastNotificationData.dontChargePayments != 1 && this.daysLeft > 0;
        },
        hasDeclinedPayments() {
          return this.$store.state.authentication.toastNotificationData.hasDeclinedPayments.length > 0;
        },
        ...mapState({
            isMenuCollapse: state => state.sidebar.isNavOpen,
            isExpandedList: state => state.sidebar.isExpandedList,
            currentUser: state => state.authentication
        }),
        showRegisterPaymentMethodAlert(){
            return (['2'].includes(this.user.role_id) && !this.hasPaymentMethodCCTrialPeriodEnded()) || (['4'].includes(this.user.role_id) && !this.hasPaymentMethodCCReal() && this.user.agency_signed == 1);
        },
        campaignsWithNoEmailsSent() {
          return this.$store.state.authentication.toastNotificationData.campaignsWithNoEmailsSent;
        },
        showCampaignsAlert(){
            return this.$store.state.authentication.isAppAvailable && this.campaignsWithNoEmailsSent.length > 0;
        },
        notificationsPopup() {
            if(this.currentUser.notificationspopup !== undefined){
                this.currentUser.notificationspopup.forEach((notif,key) => {
                    if(notif.id !== undefined){
                        let notfarr 
                        notfarr = []
                        if(notif.title !== undefined){
                            if(!this.notifExists(notif)){
                                this.min = false
                                notfarr.push(notif)
                                this.notifsIds[notif.id] = true
                                this.notify(notif.title,notif.message)
                            }
                        }
                        this.notifs = notfarr.concat(this.notifs)
                    }
                });
                this.currentUser.notificationspopup = []
            }
            return this.notifs
        },
    },
    ready: function () {
        let timeout = this.notification.hasOwnProperty('timeout') ? this.notification.timeout : true
        if (timeout) {
            let delay = this.notification.delay || 2000
            this.timer = setTimeout(function () {
                this.triggerClose(this.notification)
            }.bind(this), delay)
            }
    },
    methods: {
        countDown() {
          let countDownDate = new Date(this.endDate).getTime() + '000';
          // Get today's date and time
          let now = new Date().getTime();
          // Find the distance between now and the count down date
          let distance = countDownDate - now;
          // Time calculations for days, hours, minutes and seconds
          let days = Math.floor(distance / (1000 * 60 * 60 * 24));
          let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          let seconds = Math.floor((distance % (1000 * 60)) / 1000);
          // Display the result in the element with id="demo"
          this.counterdate = days + "d " + hours + "h "
          + minutes + "m " + seconds + "s ";
          // If the count down is finished, write some text
          if (distance < 0) {
            this.counterdate = "EXPIRED";
          }
        },
        toggleMin(){
            this.min = !this.min  
        },
        triggerClose: function (notification) {
            clearTimeout(this.timer)
        },
        orderByAscNotifications(arr) {
          arr.sort(function (x, y) {
            var dateA = new Date(x.created),
              dateB = new Date(y.created);
            return dateB - dateA;
          });
          return arr;
        },
        isDeleted(notid){
            let arr = this.notifdeleted.split(',')
            return (arr.indexOf(notid) != -1)
        },
        isTrialPeriodEnded(){
            const { dispatch } = this.$store;
            dispatch("authentication/getToastNotificationData");
        },
        goToOpportunity(opid){

            if(!this.toastNotificationData.subscriptionActive){
                    this.$router.push('/upgrade');
            }else{
                if(this.$route.params.id != opid)
                    this.$router.push('/opportunities/'+opid);     
            }

        },
        notify (title,mybody) {
          this.$notification.show(this.getTranslation(title), {
            body: this.getTranslation(mybody)
          }, {})
        },
        close(notid){
            let arr = this.notifdeleted.split(',');
            arr.push(notid);
            this.notifdeleted = arr.join()
            notificationService.removeNotification(notid)
        },
        loadNotifs(){
            usersService.getNotifications().then((result) => {
                this.notifs = []
                if(result.length > 0){
                    let re = this.orderByAscNotifications(result);
                    re.forEach((item) => {
                        if(!this.notifExists(item) &&  item.type == 'event'){
                            this.notifs.push(item)
                            this.notifsIds[item.id] = true
                        }
                    });
                }
            });
        },
        removeNotifs(){
            this.notifs.forEach((item) => {
                this.close(item.id)
            })
            this.notifs=[]
            this.loadNotifs()
        },
        removeNotif(newitem){
            let notifarr
            notifarr = []
            this.notificationsPopup.forEach((item,key) => {
               if(item.id != newitem.id){
                    notifarr.push(item)
                }
            })
            this.notifs = notifarr
        },
        notifExists(newitem){
            return this.notifsIds[newitem.id]
        },
        getIsEmailSync(){
            const { dispatch } = this.$store;
            dispatch("authentication/getIsEmailSync");
        },
        checkTokenExpired(){
            if (this.user && this.user.token) {
                const token = this.user.token;
                var base64Url = token.split('.')[1];
                var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                var jsonPayload = JSON.parse(decodeURIComponent(atob(base64).split('').map(function(c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                }).join('')));
        
                var expirationTime = jsonPayload.exp - 60; // one minute before
        
                const rightNow = (new Date().getTime() / 1000).toFixed(0);
        
                // console.log('expirationTime', expirationTime);
                // console.log('now', rightNow);
                // console.log('ip', jsonPayload.ip);
                
                if(rightNow >= expirationTime && !this.isWaitingForRefreshToken){
                    this.isWaitingForRefreshToken = true;
                    const { dispatch } = this.$store;
                    dispatch('authentication/refreshToken').then(
                          (response) => {
                            this.isWaitingForRefreshToken = false
                          }  
                        )
                }
            }
        }
    }
}
</script>
<style scoped lang="scss" >
.notification{
    top:53px;
    position: fixed;
    right: 0;
    z-index: 99;
    width:300px;
    opacity:0.9;
    max-height:500px;
    max-height: 100%;
    overflow-y: scroll;
}
.notif-body{ 
    border-radius: 5px;
}
.minimized{
    top: 50px;
    right:0px;
    position:absolute;
    height: 50px;
    overflow-y: hidden;
}
.notif-body:hover{ 
    border: 1px solid #333;
}
.notif-body p,
.notif-body label{
    opacity:1;
}
.expandedmenu{
    margin-left: 150px;
}
.toast-notifications {
    position: relative;
  }
  .toast-notification p strong {
    font-size: 14px;
  }
  .toast-notifications .close.paymentmethod{
    position: relative;
  }
  .toast-notifications span{
      white-space: initial;
  }
</style>