<template>
   <section id="header-top-bar" class="header-top-bar">
            <div class="wrapper-header " :class="{ 'expand' : isMenuCollapse }">
                <div class="row">
                    <div v-if="!routeSteps" class="col-sm-12 col-md-4 align-items-center route">
                        <button class="btnheader"  @click="back()"  ><i class="icon-navigate_before nav " ></i></button>
                        <button class="btnheader"  @click="forward()" ><i class="icon-navigate_next nav"></i></button>
                        <h6 v-if="getCurrentRoute" class="ml-1 d-inline">{{$t('lang.label.'+`${getCurrentRoute}`)}}</h6>
                        <h6 v-if="getChild" class="ml-2  d-inline">/ {{getChild}}</h6>
                    </div>
                    <div v-else class="col-sm-12 col-md-4 d-flex align-items-center route">
                    <router-link to="/campaigns" @mousedown.native="mousedown('/campaigns')">
                        <button class="btnheader"><i class="icon-navigate_before nav " ></i></button>
                        <span class="ml-2">{{$t('lang.label.backtoallcampaigns')}}</span>
                     </router-link>
                    </div>


                    <div id="usermenu" 
                    class="col-sm-12 col-md-8 d-flex justify-content-end align-items-center ">

                          <div class="mr-2" v-if="cookie && permissionFront()">
                            <img width="60px" src='@/assets/images/linkedin-logo.png' />
                            <span
                                v-if="syncronizing"
                                class="loadingres mr-1 ml-1 spinner-border loading-spinner text-primary" 
                              ></span>
                           
                   
                            <small v-if="!syncronizing && !hasError() 
                            && currentUser.synUser.is_valid" 
                            class="ml-1  badge"
                            :class="hasLimit(currentUser.synUser.limits) ? 'badge-danger' : 'badge-primary'"> 

                            <router-link to="/mysearchs">
                                <small> 
                                 <i class="icon-link ml-1 text-white mr-1"></i>
                                {{currentUser.synUser.name}}
                                <i class="icon-checkmark text-white mr-1"></i>
                                </small> 
                            </router-link>
                            </small>
                            <select 
                                v-if="currentUser.role_id == 1" 
                                class="ml-1  badge" 
                                @change="switchCaptaindata()"
                                v-model="current_captaindata_uid"> 
                                  <option value="">
                                  - Unsync -
                                  </option>
                                  <option v-for="captaindatauser in mycaptainusers"
                                  :value="captaindatauser.captaindata_uid" 
                                  >
                                    {{captaindatauser.name}}
                                  </option>
                            </select>

                             <Tooltip 
                             v-if="errormessage && hasError()"
                                  class="ml-1 cursor-pointer badge-danger badge "
                                  :text="errormessage"
                                  :width="'auto'" >
                                <small> 
                                 <i class="icon-unlink ml-1 text-white mr-1"></i>
                                {{$t('lang.integrations.notsyncronized')}}
                                <i class="icon-question-circle cursor-pointer"></i></small>         
                            </Tooltip>
                             
                              <a v-if="!hasError() && currentUser.synUser === undefined" href="https://chrome.google.com/webstore/detail/oliverlistcom/cnokccdjefelbfmadgbekghhaefmdofm"
                                  target="_blank" 
                                  class="btn border-primary border ml-2 btn-sm bg-white text-primary"> <i class="icon-chrome"></i> {{ $t('lang.linkedin.downloadextension') }}
                                  </a>



                          </div>

                                <router-link v-if="toastNotificationData.credits.left < 50 && permissionFront()" class="px-3 py-2 ml-2 mr-2 badge"

                                :class="toastNotificationData.credits.left == 0 ? 'badge-secondary' : 'badge-primary'"

                                 to="/settings-account">{{toastNotificationData.credits.left}} Credits
                                 </router-link>


                                <router-link class="btn-primary btn-sm px-3 py-2 mr-4 badge" v-if="currentUser.role_id == 2 && permissionFront()"
                                 to="/upgrade"><i class="icon icon-rocket"></i> {{$t('lang.button.upgrade')}}
                                 </router-link>
                           

                            <ul class="d-flex d-flex justify-content-end" >
                            <li>
                                <div class="d-flex justify-content-end align-items-center cursor-pointer" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" >
                                    <span v-if="currentUser.avatar==null ||currentUser.avatar==''|| currentUser.avatar == undefined" >
                                        <img  src="@/assets/images/emptyperson.png" class="rounded-circle border-color img-user" width="">
                                    </span>
                                    <span v-else><img :src="currentUser.avatar" class="rounded-circle border-color img-user" width=""></span>
                                    <span class="nameuser ml-2">{{ currentUser.name }}</span>
                                    <i class="icon-expand_more ml-2 " v-if="permissionFront()"></i>
                                </div>
    

                                <div class="dropdown-menu" v-if="permissionFront()">
                                    
                                    <div class="p-2 btn-sm">
                                        <router-link to="/settings-account" @mousedown.native="mousedown('/settings-account')">
                                        <i class="icon-gear"></i>
                                        <strong class="ml-2">{{$t('lang.button.settings')}}</strong>
                                        </router-link>
                                    </div>
                                    <div class="p-2 btn-sm">
                                        <a class="" :href="'https://help.oliverlist.com/'+$t('lang.language.code')"><i class="icon-question"></i><strong class=" ml-2">{{$t('lang.button.help')}}</strong></a>
                                    </div>
                                    <div class="p-2 btn-sm">
                                        <a class="" href="/login"><i class="icon-sign-out"></i><strong class=" ml-2">{{$t('lang.button.logout')}}</strong></a>
                                    </div>
                                </div>
                            </li>
                        </ul>
                     </div>
                </div>
            </div>
   </section>
</template>
<script>
import { mapState, mapMutations, mapActions } from "vuex";
import { router } from '@/_helpers';
import { usersService,captainDataService } from '@/_services';
import Tooltip from "@/components/Common/Tooltip.vue";

export default {
    data() {
        return {
          pageToForward:0,
          current_captaindata_uid:false,
          isRouteSteps:false,
          contactsLeft: 0,
          daysLeft:0,
          errormessage:false,
          syncronizing:true,
          cookie:false,
          mycaptainusers:[]
        };
    },
    components: {
      Tooltip
    },
    computed: {
        ...mapState({
            isMenuCollapse: state => state.sidebar.isNavOpen,
            stack: state => state.headertopbar.stackPages,
            pagestofwd: state => state.headertopbar.nextPages,
            getCurrentRoute: state => state.headertopbar.page,
            getChild: state => state.headertopbar.child,
            myCampaigns: state => state.campaigns.all.data,
            currentUser: (state) => state.authentication.user
        }),
        isDisableBack(){
            return this.stack > 2 ? false : true;
        },
        isDisableForward(){           
            return this.pagestofwd > 0 ? false : true;
        },
        routeSteps(){
           return (this.$route.path.includes('/campaigns/') && this.$route.path.includes('/step') ) ? true : false;
        },
        toastNotificationData() {
            return this.$store.state.authentication.toastNotificationData;
        },
    },

   

    mounted(){
      this.$root.$on('removecaptain', arg => {
         this.current_captaindata_uid = false
         this.currentUser.synUser.is_valid = false
      })
    },

    created(){
        this.sp();
        this.getAllOptionsList;
        if(this.permissionFront()){
            this.syncronize();
            this.getCaptainDataUsers();
        }
    },

    methods:{
        ...mapActions("header", {
            changeHeaderTab: "changeTab",
            }),
        ...mapActions("headertopbar", {
            setStack:'setStackPages',
            pagesFwdInc: "increment",
            pagesFwdDec: "decrement",
            setCurrentRoute:"setRoute",
            currentRoute: "changePage",
            },
            "optionsList", {
              getAllOptionsList: "getAll",
            }
        ),
        hasLimit(limits){
            if(limits[0].item_scraped == limits[0].limit_value){
                return true;
            }
            if(limits[3].item_scraped == limits[3].limit_value){
                return true;
            }
            return false;
        },
        getCaptainDataUsers(){
            captainDataService.getUsers().then(result => {
                this.mycaptainusers = result.result
            })
        },
        permissionFront(){
          return (this.currentUser.team_role_id == undefined || this.currentUser.team_role_id != 3)
        },
        hasError(){
            if 
            (
            (this.currentUser.synUser !== undefined && this.currentUser.synUser && !this.currentUser.synUser.is_valid) || 
            (this.errormessage && this.currentUser.synUser === undefined) 
            ){
                return true;

            }else{
                return false;
            }
        },
        switchCaptaindata(){
            if(this.current_captaindata_uid){
                captainDataService.getUserByCaptainUid(this.current_captaindata_uid).then((response) => {
                    if(response.result.name !== undefined){
                      this.currentUser.synUser = response.result
                      this.current_captaindata_uid = this.currentUser.synUser.uid
                      this.errormessage = false
                      if(this.currentUser.synUser !== undefined && this.currentUser.synUser.is_valid == false){
                        this.errormessage = this.$t('lang.ondemand.errormes')
                      }
                      this.$root.$emit('switchcaptaindata')
                    }else{
                        this.errormessage = this.$t('lang.ondemand.errormes')
                      
                    }
                    this.syncronizing=false
                    this.cookie = true
                })
            }
        },
        syncronize(){

            let cookie = captainDataService.getLinkedinCookie();
                captainDataService.getUser(cookie).then((response) => {
                    if(response.result !== null && response.result.name !== undefined){
                      this.currentUser.synUser = response.result
                      this.current_captaindata_uid = this.currentUser.synUser.uid
                      this.errormessage = false
                      if(this.currentUser.synUser.is_valid == false){
                        this.errormessage = this.$t('lang.ondemand.errormes')
                      }
                    }else{
                        this.errormessage = this.$t('lang.ondemand.errormes')
                      
                    }
                    this.syncronizing=false
                    this.cookie = true
                })
            
        },
        getClassTrial(){
            if(this.myCampaigns !== undefined){
                var total = this.contactsLeft
                if(total < 10)
                    return "bg-danger"
                if(total < 50)
                    return "bg-warning"
            }
           return "bg-success"

        },
        ...mapMutations('sidebar',{
            NavigationClicked: 'navigationClicked'
        }),
        initSetRoute(){
            this.$route.fullPath == '/businesses' ? this.setCurrentRoute({page:'contacts'}) : this.setCurrentRoute({page:this.$route.name})
        },
        sp(){
            this.setStack({ cantPages: window.history.length});
        },
        back(){
            this.changeHeaderTab({ tab: "ALL" });
            this.pagesFwdInc();
            return router.go(-1);
        },
        forward(){
            this.pagesFwdDec();
            return router.go(1);
        },
        forwardTwo(){
            this.pagesFwdDec();
            return router.go(2);
        },
        resetForward(){
            this.pageToForward = 0;
        },
        backAllCamp(){
            
        },

        mousedown(routeTo) {

        if(screen.width <=  480){
            this.$refs.toggleMenu.click();
        }

        if(this.$route.path.includes(routeTo)) {
            this.NavigationClicked();
            this.$router.push({
            path: routeTo,
            });
            }
        },


    }
}
</script>
<style scoped lang="scss" >

#header-top-bar{
    background-color: #FFFFFF;
    padding-top: .8em;
    padding-bottom: .8em;
    padding-right: 1em;
    padding-left: 1em;
    .img-user{
        width: 35px;
        height: 35px;
    }

    .vl {
        border-left: 1px solid grey;
        height: 50px;
        }
    .items{
        width: 300px;
        [class^="icon-"], [class*=" icon-"]{
            font-size:20px;
        }
    }
    .nav{
        color: #000000;
        &.active{
            color: #000000;
        }
    }
    .btncontacts{
        border-radius: 5px;
        border: 1px solid;
        border-color: #c5c5f8;
        }
    
    .btnheader{
        border:none;
        outline: none;
        background: transparent;
        &.disabled{
           .nav{
               color: #c7c4c4;
           } 
        }
    }
    .nameuser{
        font-weight: 600;
    }
    .wrapper-header{
        margin-left: 140px;
        &.expand{
         margin-left: 60px;
        }
    }
}
@media(max-width:992px){
     #header-top-bar{
        .wrapper-header{
           
            margin-left: 0px !important;
        }
        .items{
            width: 100%;
        }
    }
    #usermenu{
        position:absolute;
        top: 11px;
        right: 10px;
        color: white;
        max-width:200px;
        z-index: 99999;
    }
}
@media(max-width:480px){
    #header-top-bar{
        padding-top:80px;
    }
}


</style>