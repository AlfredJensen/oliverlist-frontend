<template>
  <div>

    <span 
      v-if="loading"
        class="loadingres mr-2 ml-2 spinner-border loading-spinner" 
  ></span>
  

	<div v-if=" mysearchs !== false" class="card">

	<div   
	v-for="(mysearch, index) in mysearchs" 
	class="bg-light  p-2 ">
			
	  <div class="float-left w-100 mb-0">
	  {{$t('lang.linkedin.listname')}}:<strong class="mr-2">
 	   {{mysearch.name}}</strong>
      <br>
    {{$t('lang.ondemand.industry')}}:
 	  <strong>
       {{mysearch.industry}}
      </strong>
     <img 
      @click="openMap(mysearch.location,mysearch.processing,mysearch.id)"
      class="float-right cursor-pointer" :src="'https://maps.googleapis.com/maps/api/staticmap?zoom=9&key='+apikey+'&size=183x50&maptype=map&sensor=false&path=color%3ablue|weight:2|fillcolor%3ablue|'+getlocations2(mysearch.location)+'&cache='+mysearch.id" />
     
      </div>

  
  <div class="row">
    <div class="px-3">
     <button 
      class="p-0 px-1 btn btn-sm btn-outline-danger float-left"
      @click="changestatus('stopped')"
      v-if="!finished">
      <small>
      <i class="icon-stop"></i> 
      {{$t('lang.button.cancel')}}
      </small>
     </button>

     <button 
      v-if="false"
      class="p-0 px-1 btn btn-sm btn-primary ml-1 float-left"
      @click="changestatus('paused')">
      <small>
      <i class="icon-pause"></i> 
      </small>
     </button>
     <button 
      v-if="status == 'paused' && !finishedpoints"
      class="p-0 px-1 btn btn-sm btn-primary ml-1 float-left"
      @click="changestatus('pending')">
      <small>
      <i class="icon-play"></i> 
      </small>
     </button>


  
      <button 
      v-if="finished"
      @click="$emit('refresh')"
      class="p-0 px-1 btn btn-sm btn-primary ml-1 ">
      <small>
      <i class="icon-search mr-1"></i>{{$t('lang.ondemand.another')}}
      </small>
     </button>
 
     
     </div>
  </div>      

    
   <div class="mt-3" v-if="notification == false">

      <h6 class="mt-2">{{$t('lang.ondemand.step',{'step':1})}}</h6>
      <strong class="d-block mt-2 mb-1 " v-if="getFinished() > 0">
       <span 
      v-if="status != 'paused' && !finishedpoints"
        class="loadingres mr-2 ml-2 spinner-border loading-spinner" 
      ></span>
      <small>{{$t('lang.ondemand.point_processed',{"processed":mysearch.point_processed,"total":mysearch.point_total})}}. </small> <Tooltip v-if="notification == false"
                                :text="$t('lang.ondemand.whatispoint')"
                                :width="'auto'"
                              >  
                              <i class="icon-question-circle text-primary cursor-pointer"></i>
                              </Tooltip> 

      <i class="icon-checkmark text-success" v-if="finishedpoints"></i>
      </strong>
    <div class="float-left my-2 w-100 mb-4" v-if="!finishedpoints">
      <div class="content-bar">
          <div class="progress">
            <div
              v-if="getFinishedPoint() >= 0 && calculatePercentagePoint() > 0"
              class="progress-bar"
              v-bind:style="{ width: calculatePercentagePoint() + '%' }"
              role="progressbar"
              aria-valuenow="calculatePercentagePoint()"  
              aria-valuemin="0"
              aria-valuemax="100"
            >
            {{calculatePercentagePoint()}}%
            </div>

            <span class="ml-2 text-primary" v-if="getFinishedPoint() == 0">
              {{$t('lang.ondemand.init')}}.
            </span>
            
    <img width="25px" height="15px" src="@/assets/images/2 (1).png">
            
          </div>
      </div>
      </div>
    <div>
      <div class="mb-3">
        <small v-if="!finished"  class="text-primary">
         <i class="icon-mail"></i> {{ $t('lang.linkedin.etape1desc') }}
        </small>
        <small v-if="mysearch.data.length == 0 && finished"  class="text-secondary">
         <i class="icon-warning"></i> {{$t('lang.ondemand.empty',{type:mysearch.industry})}}
        </small>
      </div>  
      <small class="text-primary">
       <a target="_blank" :href="$t('lang.videos.why')"
      v-if="mysearch.data.length > 0" ><i class="icon-question mr-1"></i>  {{$t('lang.ondemand.why')}}</a>
      </small>

      <strong class="d-block mt-2 mb-1" v-if="mysearch.data.length > 0">
     {{$t('lang.ondemand.business_found',{"cant":companiesfound.length})}}. 
      <i class="icon-checkmark text-success ml-1" v-if="finishedpoints"></i>  
      </strong> 
      </div>
 
    
          <ul 
          v-if="mysearch.data.length > 0"
          class="bg-light p-2"
      id="previewlist" >
      <li

      v-for="(item, index) in companiesfound" reversed>
      
        <small>
        <a class="text-primary mr-1" target="_blank" :href="'https://www.google.com/maps/search/'+item.name+'/@'+item.latlng+',10z'"><i class="icon-location"></i></a>

        <strong>{{item.name}}</strong> - {{item.address}}    
        <a class="text-primary ml-1" :href="item.siteweb" target="_blank">{{item.siteweb}}</a>
        </small>
         <small class="ml-3 text-secondary">{{item.phone}}</small>
        </li>
      </ul>
    </div>
    <h6 class="mt-2 d-inline">{{$t('lang.ondemand.step',{'step':2})}} 
    <small v-if="!finishedpoints" class="d-inline">({{$t('lang.ondemand.waiting')}})</small></h6> 
      <strong class="d-block mt-2">
      <span 
      v-if="status != 'paused' && !finished && finishedpoints"
        class="loadingres mr-2 ml-2 spinner-border loading-spinner" 
      ></span>
      <small v-if="finishedpoints">{{getImported(mysearch.imported)}} {{$t('lang.label.importedcontacts')}}.
      </small> 
      <small v-if="!finishedpoints">0 {{$t('lang.label.importedcontacts')}}.
      </small> 
        <button 
    class="p-0 px-0 btn btn-sm text-primary ml-1" v-if="getFinished() > 0">
    <router-link
          :to="'/businesses/OD-'+mysearch.id">  

  
      <span>

      <span v-if="$route.fullPath !== '/businesses/OD-'+mysearchs[0].id && mysearchs[0].imported > 0"> <i class="icon-eye"></i> {{$t('lang.column.results')}}</span>
      </span>
    </router-link>  
    </button>      

    <Tooltip v-if="notification == false"
        :text="$t('lang.ondemand.whatisimport')"
        :width="'auto'"
        class="mr-2"
      >  
      <i class="icon-question-circle text-primary cursor-pointer"></i>
      </Tooltip> 

      </strong>
      <div>
     </div>

      <div class="float-left my-2 w-100" v-if="!finished && mysearch.data.length > 0">
	    <div class="content-bar">
	        <div class="progress">
	          <div
              v-if="getFinished() > 0"
	            class="progress-bar"
	            v-bind:style="{ width: calculatePercentage() + '%' }"
	            role="progressbar"
	            aria-valuenow="calculatePercentage()"  
	            aria-valuemin="0"
	            aria-valuemax="100"
	          >
            {{calculatePercentage()}}%
	          </div>

            <span class="ml-2 text-primary" v-if="finishedpoints && status == 'pending'">
              {{$t('lang.ondemand.init')}}...
            </span>

	          
	  <img width="25px" height="15px" src="@/assets/images/2 (1).png">
	          
	        </div>
	    </div>
     <button 
      v-if="status == 'paused' && finishedpoints"
      class="p-0 px-1 btn btn-sm btn-primary mt-2"
      @click="changestatus('processing')">
      <small>
      <i class="icon-play"></i> {{$t('lang.button.continue')}}
      </small>
     </button>
     <button 
      v-if="status == 'processing' && finishedpoints && !finished"
      class="p-0 px-1 btn btn-sm btn-primary mt-2"
      @click="changestatus('paused')">
      <small>
      <i class="icon-pause"></i> {{$t('lang.button.pause')}}
      </small>
     </button>
     <span class="pt-2 ml-1">
     <small v-if="limitmax" class="text-primary">
     {{  $t('lang.ondemand.limitfree',{cant:limitmax}) }}
     </small>
     </span>
	    </div>


   
    
      <span v-if="finished" class="text-success"  >
       <i class="icon-checkmark"></i>
      </span>


 
  <div class="" v-if="notification == false">
      <div class="">
       <Gmaps
       v-if="onlyUser()"
       :processed="processed"
       :modify=false
       :zoom="zoom"
       :thecenter="mysearch.center"
       :coordinates="[]"
       :markers="markers"/>
      </div>
    </div>
  

	</div>
	</div>
  </div>
</template>
<script>
import { onDemandService } from "@/_services";
import Gmaps from "@/components/Gmaps.vue";
import { mapState } from "vuex";
import Tooltip from "@/components/Common/Tooltip.vue";


export default {
  computed: {
      ...mapState({
        currentUser: (state) => state.authentication.user,
        plans: (state) => state.plans.all,
      }),
    },
   data() {
    return {
      searchlist:0,
      limitmax:false,
      loading:true,
      refreshing:false,
      processed:[],
      companiesfound:[],
      mysearchs:false,
      mysearch:[],
      apikey:'AIzaSyD8lJ7PX0clyNDGqzgKApjipSyO9vcrYSc',
      status:'pending',
      markers:[],
      dataList:[],
      zoom:12,
      finished:false,
      finishedpoints:false
      }
  },
  props: {
    data:Array,
    notification:Boolean
  },
  components: {
    Gmaps,
    Tooltip
  },  
  created(){
      this.refreshItem()
    
  
    if(this.currentUser.subscription_status_id == 0){
      this.limitmax = 100
    }

  },
  methods: {
      getImported(total){
          if(this.limitmax && total > this.limitmax) {
            return 100
          }else{
            return total
          }
      },
      processData(data){
        if(data.length == 0 && this.mysearch.imported !== undefined){
            this.finished=true
            this.$emit("finished")
          }else{

            this.mysearchs = data

            if(this.mysearch.imported == undefined){
              this.mysearch.imported = 0
            }

            if(this.mysearchs[0] !== undefined){
              if(this.mysearchs[0].status == 'finished' 
              || this.mysearchs[0].status == 'paused' 
              || this.mysearchs[0].status == 'processing'){
                this.status = this.mysearchs[0].status

              }

              if(this.mysearchs[0].status == 'finished' ){
              this.finished=true

              }


                let loc = JSON.parse(this.mysearchs[0].location)
                let locpos = loc.length
                locpos = (locpos/2)
                locpos = Math.round(locpos)
                loc = loc[locpos].split(",")
                loc = {lat: parseFloat(loc[0]), lng: parseFloat(loc[1])}
                this.mysearchs[0].center = loc
                if(this.mysearchs[0].processed){
                  let processed = this.mysearchs[0].processed.split(",")

                  for (let j = 0; j < processed.length; j++) {
                      let latlng = processed[j].split("|")
                      this.processed.push({lat: parseFloat(latlng[0]), lng: parseFloat(latlng[1])});
                  }

                }
                if(this.mysearchs[0].zoom == undefined){
                  this.zoom = 12;
                }else{
                  if(this.mysearchs[0].zoom == 0){
                    this.zoom = 12
                  }
                  if(this.mysearchs[0].zoom == 1){
                    this.zoom = 10
                  }
                  if(this.mysearchs[0].zoom == 2){
                    this.zoom = 8
                  }
                  if(this.mysearchs[0].zoom == 3){
                    this.zoom = 6
                  }
                  if(this.mysearchs[0].zoom == 4){
                    this.zoom = 5
                  }
                }


                this.companiesfound = this.mysearchs[0].data

                
            }
          }

      },

      onlyUser(){
      return false
         return (this.currentUser.client_id == 63 || this.currentUser.client_id == 50
                 || this.currentUser.client_id == 4  || this.currentUser.client_id == 976
                   || this.currentUser.client_id == 15);
      },
      getlocations2(loc){
        loc = JSON.parse(loc)
        loc = loc.join("|")
        loc = loc
        return loc
      },
    calculatePercentage(){

          
    if( (this.status == 'processing') 
      && this.limitmax 
      && this.mysearchs[0].imported > this.limitmax) {

        if(status == 'processing'){
          this.changestatus('paused')
        } 
       

          this.changestatus('paused') 
          this.$swal({
          type: "warning",
            title: this.$t('lang.ondemand.limitplan',{cant:this.limitmax}),
            html: this.$t('lang.ondemand.limitfree',{cant:this.limitmax}),
            width: '400px',
            showCancelButton: true,
            showCloseButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33a2c",
            confirmButtonText: this.$t("lang.button.upgrade"),
            cancelButtonText: this.$t("lang.button.cancel"),
          })
          return;

      }

        let left = this.mysearchs[0].total - this.mysearchs[0].finished
        let attempts = this.mysearchs[0].finished
        let total = this.mysearchs[0].total
        total = Math.floor((attempts/total)*100)
        
        if(!total && attempts > 0){
          return 1;
        }

        if(!total){
          return 0;
        }
        return total
    },
    calculatePercentagePoint(){
        if(this.mysearchs[0].status == 'finished'){
          return 100;
        }
        let left = this.mysearchs[0].point_total - this.mysearchs[0].point_processed
        let attempts = this.mysearchs[0].point_processed
        let total = this.mysearchs[0].point_total
        total = Math.floor((attempts/total)*100)
        
        if(!total && attempts > 0){
          return 1;
        }

        if(!total){
          return 0;
        }
        return total
    },
    getFinished(){
        if(this.mysearchs[0].finished !== undefined && this.mysearchs[0].finished > 0){
          return this.mysearchs[0].finished
        }
        if(this.mysearchs[0].imported !== undefined && this.mysearchs[0].imported > 0){
          return this.mysearchs[0].imported
        }

        if(this.status == 'pending' && !this.finishedpoints ){
          return 1
        }

        if(this.status == 'processing' && this.finishedpoints  ){
          return 1
        }

        return 0
    },
    getFinishedPoint(){


        if(this.mysearchs[0].point_processed !== undefined && this.mysearchs[0].point_processed > 0){
          if(this.mysearchs[0].point_processed == this.mysearchs[0].point_total){
            this.finishedpoints = true
          }

          return this.mysearchs[0].point_processed
        }
        return 0
    },

      openMap(loc,actual,id){
          this.$swal({
            title: this.$t('lang.label.searching'),
            html: "<img src='https://maps.googleapis.com/maps/api/staticmap?&zoom="+this.zoom+"&key="+this.apikey+"&size=500x500&maptype=map&sensor=false&path=color%3ablue|weight:2|fillcolor%3ablue|"+this.getlocations2(loc)+"&cache="+id+"'/>",
            width: '550px',
            showCancelButton: false,
            showConfirmButton: false,
            showCloseButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33a2c",
            showCancelButton: false,
            cancelButtonText: this.$t('lang.button.close'),
        })
      },
    delaynow(){
	      setTimeout(function () {
          if(!this.loading && !this.refreshing && !this.finished){
	          this.refreshItem()
          }
		  }.bind(this), 15000)
	  },
    changestatus(status){
      if(status == 'processing' && !this.finishedpoints){
        return
      }

      if(status == 'processing' && this.limitmax 
      && this.mysearchs[0].imported > this.limitmax) {


          this.changestatus('paused') 
          this.$swal({
          type: "warning",
            title: this.$t('lang.ondemand.limitplan',{cant:this.limitmax}),
            html: this.$t('lang.ondemand.limitfree',{cant:this.limitmax}),
            width: '400px',
            showCancelButton: true,
            showCloseButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33a2c",
            confirmButtonText: this.$t("lang.button.upgrade"),
            cancelButtonText: this.$t("lang.button.cancel"),
          })
          return;

      }

      this.status=status
      onDemandService.changestatus(this.mysearchs[0].id,status)
      if(status == "stopped"){
        this.$emit("stop")
      }
    },
  	refreshItem(){
      this.searchlist++
      this.refreshing=true

      if(this.dataList !== undefined && this.dataList.length>0){

        this.processData(this.dataList)
        this.dataList=[]
        this.loading=false
        this.refreshing=false
        if(this.status == 'processing' || this.status == 'pending'){
          this.delaynow()
        }
      }else{    
    	  onDemandService.getList().then((response) => {
          if(response !== undefined){
            this.loading=false
            this.refreshing=false
            this.processData(response.result)
          }
          if(this.status == 'processing' || this.status == 'pending'){
            this.delaynow()
          }
    	  }).catch((err) => {
                this.loading = false
                this.refreshing=false
        });
      }
  	},
  },
}
</script>

<style scoped>
.progress{
  height: 1rem;
}
.spinner-border{
  animation: spinner-border 2s linear infinite;
}
#previewlist {
  height: 30vh;
  overflow: scroll !important;
  width: 100% !important;
}
</style>