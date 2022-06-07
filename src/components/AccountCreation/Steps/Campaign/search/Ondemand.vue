<template>
  <div class="">    
    
    <div class="row mb-4" v-if="!this.done">
      <div class="col-md-3 text-left">
       <label class="">{{$t('lang.linkedin.listname')}}:</label>
       <input v-model="name" class="form-control" type="text"
        >
      </div>
    </div>
    <div class="row" v-if="!this.done">
      <div class="col-12" >
        <div class="">
         <label class="">{{$t('lang.ondemand.industry')}} {{$t('lang.ondemand.industryex')}}:</label>
         <input v-model="inputindustry" class="form-control" type="text"
          >
         <small class="d-block text-secondary">{{$t('lang.ondemand.industrydesc')}}</small>
        </div>
        <div v-if="inputindustry" class="mt-2" >
        <span class="mr-1 pt-1" >{{$t('lang.ondemand.possibleresults')}}:</span>
        <small class="text-primary" >
          <a target="_blank" :href="'https://www.google.com.ar/maps/search/'+inputindustry+'/@'+actualcenter+','+actualzoom+'z/'">
          <i class="icon-map d-inline"></i> https://www.google.com.ar/maps/search/ {{inputindustry}}/@{{actualcenter}},{{actualzoom}}z
          </a>
        </small>
        </div>
      </div>
       <div class="col-12 mt-3">
        <input  v-model="searchlinkedin" value="true" class="mr-1" type="checkbox" id="flexSwitchCheckDefault">
        <small class="form-check-label" for="flexSwitchCheckDefault">{{$t('lang.linkedin.searchprofiles')}}</small>
        <small class="d-block text-secondary">{{$t('lang.linkedin.searchprofilesdelay')}}</small>
      </div>

    </div>

    <div>
    </div>
    <div class="row" v-if="!this.done">
      <div class="col-12">

       <Gmaps
       :modify=true
       :coordinates="this.coordinates"
       :limitzoom=12
       :limited="!this.toastNotificationData.subscriptionActive"
       @centerpos="setCenter($event)"
       @zoom="setZoom($event)"
       @setCoordinates="setCoordinates($event)"/>
      
       <button 
       v-if="!startingsearch"
       :disabled="(name && inputindustry) ? false : true" class="mt-4 btn btn-primary"
       @click="startSearch()">{{$t('lang.label.letsgetstarted')}}</button>
       <small v-if="!name" class="text-danger d-block">*{{$t('lang.ondemand.requiredname')}}</small>
       <small v-if="!inputindustry" class="text-danger d-block">*{{$t('lang.ondemand.requiredindustry')}}</small>
       <small v-if="!coordinates.length>0" class="text-danger d-block">*{{$t('lang.ondemand.requiredmap')}}</small>
       <span 
        v-if="startingsearch"
          class="loadingres mr-2 ml-2 spinner-border loading-spinner" 
        ></span>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from "vue";

import IndustrySearch from "@/components/AccountCreation/Steps/Campaign/search/IndustrySearch.vue";
import Gmaps from "@/components/Gmaps.vue";
import KeyWordSearch from "@/components/AccountCreation/Steps/Campaign/search/KeyWordSearch.vue";

import { mapState, mapActions } from "vuex";

import { onDemandService } from "@/_services";


export default {
  data(){
    return {
      keysearchA:100,
      keysearchB:200,
      keysearchC:300,
      actualcenter:Text,
      actualzoom:13,
      inputjob:'',
      searchlinkedin:false,
      name:'',
      inputindustry:'',
      selectedInd: [],
      selectedLoc: [],
      selectedFun: [],
      coordinates: [],
      startingsearch:false,
      done:false,
    }
  },
  created(){
    this.coordinates = []
  },
  computed: {
    toastNotificationData() {
      return this.$store.state.authentication.toastNotificationData;
    },
    ...mapState({
      loadingOptionsList: (state) => !state.optionsList.completeLoading,
      hierarchyoptions: (state) => state.optionsList.all["regions"].data,
      hierarchyoptionsCountry: (state) =>
        state.optionsList.all["countries"].data,
      hierarchyoptionsSearch: (state) =>
        state.optionsList.all["categories_search_words"].data,
      hierarchyoptionsSearchFunction: (state) =>
        state.optionsList.all["categories_search_function"].data,
      hierarchyoptionsSearchLevel: (state) =>
        state.optionsList.all["categories_search_level"].data,
      hierarchyoptionsGoogle: (state) =>
        state.optionsList.all["categories_google"].data,
      companySizeOptions: (state) => state.optionsList.all["param_5"].data,
      companyTypeOptions: (state) => state.optionsList.all["param_10"].data,
      parametersTF: (state) => state.optionsList.all["parameters_tf"].data,
    }),
  },
  methods:{
    setCoordinates(cord){
      this.coordinates = cord
    },
    setCenter(center){
      this.actualcenter = center
    },
    setZoom(actualzoom){
      this.actualzoom = actualzoom
    },
    startSearch(){


      if(this.coordinates.length == 0){
          this.$swal({
          type: "warning",
            title: "Error",
            text: this.$t('lang.ondemand.errorchoosemap'),
            width: '400px',
            showCancelButton: false,
            showCloseButton: true,
          })
      }else{
      this.startingsearch = true;
        onDemandService.addSearch(this.inputindustry,this.coordinates,this.inputjob,this.name,this.searchlinkedin).then((response) => {
              this.done = true

              this.startingsearch = false;
              this.keysearchA++
              this.keysearchB++
              this.keysearchC++
              this.selectedFun = [];
              this.selectedLoc = [];
              this.selectedInd = [];

              this.$emit("load")

              this.$emit("start")
        });
      }


    }
  },
  components: {
    IndustrySearch,
    KeyWordSearch,
    Gmaps
  },
  props: {
    model:Object
  },
  created(){
  },

}
</script>