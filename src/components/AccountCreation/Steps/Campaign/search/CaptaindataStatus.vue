<template>
  <small>
    <span class="mr-2 float-left" :class="importdata.status == 'stopped' ? 'text-secondary' : ''">

  
    <span class="mr-2 text-primary">
    
    <a :href="importdata.url_search"   target='_blank' >
      <i class="icon-linkedin text-primary"></i> 
      {{importdata.name}} 
    </a>
    </span> 

    <small v-if="!notification">
    {{importdata.created}}
    </small>
    </span>
    <div class="float-left w-100 mb-1" v-if="importdata.status == 'pending'">
      
    <div class="float-left w-100 my-2">
      <span class="text-primary">
       {{ $t('lang.linkedin.etape1desc') }}
      </span>
    </div>
      <span 
     v-if="importdata.status == 'pending'"
        class="loadingres mr-2 ml-2 spinner-border loading-spinner" 
      ></span>
      <span>
        {{ $t('lang.linkedin.etape1') }}
      </span>
     
    </div>      

       <ul 
          v-if="importdata.data != null && importdata.data.length > 0"
          class="bg-light p-2 my-3"
      id="previewlist" >
      <li

      v-for="(item, index) in importdata.data">
       <a :href="item.linkedin_url"  target='_blank'><i class="icon-linkedin text-primary"></i></a> {{item.full_name}} - {{item.job_title}} -  <strong>{{item.company_name}}</strong>
        </li>
        <li class="text-primary" v-if="importdata.more">{{$t('lang.ondemand.andmore',{cant:importdata.more})}}</li>
      </ul> 

    <div class="float-left w-100 mb-2 mt-2"  v-if="importdata.status == 'pending'">
      <span class="text-secondary">
        {{$t('lang.linkedin.etape2')}}
      </span>
    </div>

    <div class="float-left w-100 mb-1"
    v-if="importing 
    || importdata.status == 'importing' 
    || importdata.status == 'auto-paused'
    || importdata.status == 'paused'
    || importdata.status == 'error'">
      <span class="text-secondary">
        {{ $t('lang.linkedin.etape1') }}
      </span>

      <small>
       ( {{ $t('lang.linkedin.etape1desc') }} )
      </small>
    </div>   
     

    <div class="float-left w-100 mb-2"
    v-if="importing 
    || importdata.status == 'importing' 
    || importdata.status == 'auto-paused'
    || importdata.status == 'paused'
    || importdata.status == 'error'">

      <span  v-if="importing 
    || importdata.status == 'importing' 
    || importdata.status == 'auto-paused'
    || importdata.status == 'error'"
        class="loadingres mr-2 ml-2 spinner-border loading-spinner" 
      ></span>
      <span>
        {{ $t('lang.linkedin.etape2') }}
      </span>

     
    </div>

  

  <span class="text-danger"  v-if="importdata.status == 'stopped'">
  <i class="icon-close"></i>
  stopped</span>

      <span class="text-success"  v-if="importdata.status == 'imported'">
       <i class="icon-checkmark"></i>
      </span>



  <button 
      @click="stop(importdata.id)"
      v-if="importdata.status == 'pending'" 
      class="p-0 px-1 mt-2 mr-2 btn btn-sm btn-outline-danger float-left">
      <small>
      <i class="icon-stop"></i> 
      {{$t('lang.button.cancel')}}
      </small>
      </button>

    
      <div class="mt-3">
        <strong  class="" v-if="importdata.imported > 0">
        {{ $t('lang.linkedin.exportable') }}: {{importdata.result}}
        </strong>
        <Tooltip v-if="importdata.imported > 0"
            :text="$t('lang.linkedin.profilenotexport')"
            :width="'auto'"
          >  
          <i class="icon-question-circle text-primary cursor-pointer"></i>
          </Tooltip> 

      </div>

     <div>
        <span class="mt-1 mb-1" v-if="importdata.status != 'pending' && importdata.imported > 0">
        {{$t('lang.linkedin.exportedcontacts')}}: {{importdata.imported}} 
            <span class="text-primary"  v-if="importdata.status == 'finished'">
             <i class="icon-checkmark"></i> finished
            </span>  
        </span>

        <Tooltip class="ml-1" v-if="importdata.imported > 0"
            :text="$t('lang.linkedin.profilssearch')"
            :width="'auto'"
          >  
          <i class="icon-question-circle text-primary cursor-pointer"></i>
          </Tooltip> 
      </div>


      <div class="mb-2 mt-2 w-100 float-left">
       

        <button 
        v-if="!notification && importdata.status != 'pending' && this.importdata.imported > 0" 
        class="p-0 px-1 btn btn-sm text-primary ml-1">
        <router-link
              :to="'/businesses/'+importdata.id">
          <small>
          <i class="icon-eye"></i> 
          {{$t('lang.column.results')}}
          </small>
        </router-link>

        </button>

          <span class="cursor-pointer ml-2 text-danger" 
          @click="deleteImport(importdata.id)"
          v-if="history">
          <i class="icon-trash"></i> 
          {{$t('lang.general.delete')}}
          </span>


      <span class="text-primary" v-if="this.importdata !== undefined 
            && this.importdata.status != 'stopped'
            && this.importdata.status != 'imported'
            && this.importdata.status != 'error' && importdata.campaign_name">
      {{$t('lang.ondemand.linkresult')}}:
      <i class="icon-bullhorn mr-1"></i> <strong>{{importdata.campaign_name}}</strong>
      </span>

        <button 
        @click="stop(importdata.id)"
        v-if="!notification && ( importing 
        || importdata.status == 'importing' 
        || importdata.status == 'auto-paused' 
        || importdata.status == 'paused' 
        || importdata.status == 'error')" 
        class="p-0 px-1 btn mr-1 btn-sm btn-outline-danger float-left">
        <small>
        <i class="icon-stop"></i> 
        {{$t('lang.button.cancel')}}
        </small>
        </button>
        <button 
        @click="retry(importdata.id)"
        v-if="!notification && (importdata.status == 'error')" 
        class="p-0 px-1 btn mr-1 btn-sm btn-outline-primary float-left">
        <small>
        <i class="icon-refresh"></i> 
        {{$t('lang.ondemand.retry')}}
        </small>
        </button>

        <button 
        @click="importResult(importdata.id)"
        v-if="!notification && importdata.status == 'paused' && !importing" 
        class="p-0 px-1 btn btn-sm btn-outline-primary float-left">
        <small>
        <i class="icon-play"></i> 
        {{$t('lang.linkedin.continueexport')}}
        </small>
        </button>


     

      <div v-if="lastupdate && importing" 
      class="float-right" id="lastupdate"
      :class="toggleclass ? 'change' : ''">
            <small class="text-secondary"> {{lastupdate}} </small>
      </div>



      </div>
      <div class="float-left text-danger" v-if="importdata.status == 'error'">
      <i class="icon-warning"></i> {{importdata.message}}
      </div>
  </small>

  
</template>
<script>

import Vue from 'vue';
import { captainDataService } from "@/_services";
import Tooltip from "@/components/Common/Tooltip.vue";

  export default {
    props: {
      id: String,
      notification:Boolean,
      search:Object,
      history:Boolean,
    },

    components: {
      Tooltip
    },  

    data() {
     return {
      importdata:[],
      timer:null,
      importing:false,
      lastupdate:false,
      toggleclass: false,
      getdataplease:true,
      datalist:false
     }
    },

    created() {

      this.importdata = this.search

    
      if(
          this.importdata.status === undefined
        || this.importdata.status == 'stop'
        || this.importdata.status == 'stopped'
        || this.importdata.status == 'imported' ){

        this.$emit("hasSearchActive",false)
      }else{
          this.$emit("hasSearchActive",true)
      }

      this.delaynow()
      
    },
 
    methods: {
     
      getData(){

        if(this.importdata !== undefined && this.importdata.status == 'imported'){
          return
        }

        this.toggleclass = true
        if(this.importada == undefined || this.importdata.data.length == 0){
          this.getdataplease = true
        }else{
          this.datalist = this.importdata.data
        }
        
        this.getdataplease = false
      
        if(this.id !== undefined && this.id !== ''){
          captainDataService.getImporting(this.id,this.getdataplease).then((response) => {
            
            this.importdata = response.result


            if(!this.importdata.imported){
              this.importdata.imported = 0
            }
    

            if(this.importdata !== undefined 
              && this.importdata.status != 'stopped'
              && this.importdata.status != 'imported'
              && this.importdata.status != 'error'){
                this.importing = false
              
            }else{
              if( this.importdata == undefined 
              || this.importdata.status == 'importing' 
              || this.importdata.status == 'auto-paused'
              || this.importdata.status == 'error'){
                this.importing = true
              }
            }

            if(this.datalist){
              this.importdata.data = this.datalist
            }


            let lastupdate = new Date()
            this.lastupdate = lastupdate.toTimeString();
            this.toggleclass = false

              if(
                this.importdata.status === undefined
              || this.importdata.status == 'stop'
              || this.importdata.status == 'stopped'
              || this.importdata.status == 'imported'
              || this.importdata.status == 'error' ){

              this.$emit("hasSearchActive",false)

            }else{
                this.$emit("hasSearchActive",true)
            }


          }).catch((err) => {
                 
          });
        }


      },


      importResult(id){
        this.importing = true
        this.importdata.status = 'importing'
        captainDataService.importResult(id)
        this.$emit("hasSearchActive",true)
        this.getData()

      },

      deleteImport(id){
        captainDataService.deleteSearch(id)
        this.$emit("refresh",true)
      },

      stop(id){
        captainDataService.stopSearch(id)
        this.importdata.status = 'stopped'
        this.importing = false
        this.$emit("hasSearchActive",false)
      },

      pause(id){
        captainDataService.pauseSearch(id)
        this.importdata.status = 'paused'
        this.importing = false
      },

      play(id){
        captainDataService.changeStatus(id,'auto-paused')
        this.importdata.status = 'auto-paused'
        this.importing = true
      },

      retry(id){
        captainDataService.changeStatus(id,'pending')
        this.importdata.status = 'pending'
      },

      refreshItem: function (notification) {
        clearTimeout(this.timer)
        this.getData()
        this.delaynow()
        this.$forceUpdate()
      },

      delaynow(){
        this.timer = setTimeout(function () {
          if(this.importdata.status != 'stopped' 
          && this.importdata.status != 'error'
           && this.importdata.status != 'finished'
           || this.importdata == undefined){
            this.refreshItem()
          }
        }.bind(this), 15000)
      },

    },
  };
</script>


<style scoped>

.change small{
  color:#5155ea !important;
}
#previewlist {
  max-height: 30vh;
  overflow: scroll !important;
  width: 100% !important;
}
</style>