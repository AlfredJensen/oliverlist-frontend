<template> 

      <div v-if="openIndustry == true">

     <div 
     class="boxsearch border rounded bg-white p-2" >

      <div class="mb-2 p-2 text-secondary" >
        <label>{{ label }}</label>
        <span 
        class="cursor-pointer text-primary float-right ml-2" @click="close()">
        <i class="icon-close"></i>
        </span>
        <button 
        @click="done()"
        class="btn btn-sm btn-primary p-0 px-1 float-right">{{ $t('lang.search.done') }}</button>

      </div> <div class="dropdown-divider"></div>

      <CustomSearch
      :key="keyitem"
      v-if="this.type=='custom'"
      :option_list="options"
      :default_values="selectedvalues">
      </CustomSearch>

      
      <div v-if="this.type=='industry'" class="dropdown-divider"></div>
      
      <IndustrySearch
      :key="keyitem+'all'"
      v-if="this.type=='industry'"
      :option_list="options.list"
      :default_values="selectedvalues.industry.list" >
      </IndustrySearch>


       <KeyWordSearch 
        :key="keyitem"
        v-if="this.type=='industry'"
        :enabled="[true,true,false,false]"
        :default_values="selectedvalues.industry.words.word.keywords"
       ref="postalcode" />


     
      <div v-if="this.type=='linkedin' && 
      (
      (options.ondemand !== undefined && options.ondemand.length > 0)
      || 
      (options.importlist !== undefined && options.importlist.length > 0)
      || 
      (options.linkedin !== undefined && options.linkedin.length > 0))" >

      <div v-if="options.linkedin !== undefined && !this.selectedvalues.imported">
      <small>Linkedin</small>
      <IndustrySearch
      class="mb-4 mt-2"
      :key="keyitem"
      v-if="this.type=='linkedin'"
      :option_list="options.linkedin"
      :default_values="selectedvalues.linkedin"  >
      </IndustrySearch>


      <small>Google maps</small>
      <IndustrySearch
      class="mb-4 mt-2"
      :key="keyitem+'1'"
      v-if="this.type=='linkedin'"
      :option_list="options.ondemand"
      :default_values="selectedvalues.ondemand"  >
      </IndustrySearch>

      </div>

       <div v-if="this.type=='linkedin' && options.importlist !== undefined && this.selectedvalues.imported">
        <small>My import lists</small>
        <IndustrySearch
        class="mb-4 mt-2"
        :key="keyitem+'1'"
        v-if="this.type=='linkedin'"
        :option_list="options.importlist"
        :default_values="selectedvalues.importlist"  >
        </IndustrySearch>
      </div>


      </div>


      <div v-else >
      <div v-if="this.type=='linkedin'" class="text-center mt-4 p-4">
      <h5>
        {{$t('lang.ondemand.nosearchs')}}
        </h5>
         <router-link
          to="/mysearchs"
          class="btn btn-primary btn-sm text-white"
        >
          {{ $t("lang.label.addcontacts") }}
        </router-link>
      </div>
      </div>

      <JobSearch
      :key="keyitem"
      v-if="this.type=='job'"
      :option_list="options"
      :default_values="selectedvalues">
      </JobSearch>

      <LocationSearch
      :key="keyitem"
      v-if="this.type=='location'"
      :option_list="options"
      :default_values="selectedvalues">
      </LocationSearch>

      <EmployeeSearch
      :key="keyitem"
      v-if="this.type=='employees'"
      :option_list="options"
      :default_values="selectedvalues">
      </EmployeeSearch>

      <UrlSearch
      :key="keyitem"
      v-if="this.type=='url'"
      :option_list="options"
      :default_values="selectedvalues">
      </UrlSearch>

      <CampaignSearch
      :key="keyitem"
      v-if="this.type=='campaignselected'"
      :option_list="options"
      :default_values="selectedvalues">
      </CampaignSearch>


      <StatusSearch
      :key="keyitem"
      v-if="this.type=='status'"
      :option_list="options"
      :default_values="selectedvalues">
      </StatusSearch>

      <WordSearch
      :key="keyitem"
      v-if="this.type=='word'"
      :option_list="options"
      :default_values="selectedvalues">
      </WordSearch>
      

    </div>
  </div>

</template>
<script>
  import IndustrySearch from "@/components/AccountCreation/Steps/Campaign/search/IndustrySearch.vue";
  import JobSearch from "@/components/AccountCreation/Steps/Campaign/search/JobSearch.vue";
  import LocationSearch from "@/components/AccountCreation/Steps/Campaign/search/LocationSearch.vue";
  import EmployeeSearch from "@/components/AccountCreation/Steps/Campaign/search/EmployeeSearch.vue";
  import KeyWordSearch from "@/components/AccountCreation/Steps/Campaign/search/KeyWordSearch.vue";
  import UrlSearch from "@/components/AccountCreation/Steps/Campaign/search/UrlSearch.vue";
  import StatusSearch from "@/components/AccountCreation/Steps/Campaign/search/StatusSearch.vue";
  import WordSearch from "@/components/AccountCreation/Steps/Campaign/search/WordSearch.vue";
  import CustomSearch from "@/components/AccountCreation/Steps/Campaign/search/CustomSearch.vue";
  import CampaignSearch from "@/components/AccountCreation/Steps/Campaign/search/CampaignSearch.vue";
  import $ from 'jquery';
  import { mapState, mapActions } from "vuex";


export default {
  components: {
    IndustrySearch,
    KeyWordSearch,
    JobSearch,
    LocationSearch,
    EmployeeSearch,
    UrlSearch,
    CampaignSearch,
    StatusSearch,
    CustomSearch,
    WordSearch
  },
  props: {
    type: String,
    label: String,
    icon: String,
    options: Array,
    selectedvalues: Object
  },
  data() {
    return {
      result_autocomplete: Object,
      categories_industry: [],
      categories_level: [],
      categories_function: [],
      region: [],
      employes: [],
      openIndustry: true,
      edited: false,
      keyref:0,
      keyitem:false
    }
  },
  created() {
    this.keyitem = this.keyref + '-' + this.type 
    this.openIndustry = true
    if(this.selectedvalues['industry'] == undefined)
      this.selectedvalues['industry'] = []
    if(this.selectedvalues['industry']['words'] == undefined)
      this.selectedvalues['industry']['words'] = []
    if(this.selectedvalues['industry']['words']['word'] == undefined)
      this.selectedvalues['industry']['words']['word'] = []
    if(this.selectedvalues['industry']['words']['word']['keywords'] == undefined)
      this.selectedvalues['industry']['words']['word']['keywords'] = {}

    if(this.selectedvalues['industry']['list'] == undefined)
      this.selectedvalues['industry']['list'] = []
    if(this.selectedvalues['status'] == undefined)
      this.selectedvalues['status'] = []
    if(this.selectedvalues['linkedin'] == undefined)
      this.selectedvalues['linkedin'] = []
    if(this.selectedvalues['ondemand'] == undefined)
      this.selectedvalues['ondemand'] = []
    if(this.selectedvalues['importlist'] == undefined)
      this.selectedvalues['importlist'] = []
  },
  methods:{
    done(){
    
      $('#list-'+this.type+'-list').removeClass("active");
      $('#list-'+this.type).removeClass("show");
      $('#list-'+this.type).removeClass("active");

      this.selectedvalues[this.type+"edited-prev"] = this.selectedvalues[this.type+"edited"]

      if(this.isEdited()){
        this.selectedvalues[this.type+"edited"] = true
        this.$emit("done")
        this.edited = true
      }else{
        this.edited = false
        this.selectedvalues[this.type+"edited"] = false
        this.$emit("done")
      }
    },
    close(){
      $('#list-'+this.type+'-list').removeClass("active");
      $('#list-'+this.type).removeClass("show");
      $('#list-'+this.type).removeClass("active");
    },

    selectEdited(a,b){
      let empty = true

      if(a && b){
        if(this.selectedvalues[this.type] !== undefined 
        && this.selectedvalues[a][b] !== undefined ){
          
          if(this.selectedvalues[a][b]['select'] !== undefined
            && this.selectedvalues[a][b]['select'].length > 0){

            this.selectedvalues[a][b]['select'].forEach(item => {
                if(item){
                  empty = false
                }
            })
          
          }else{
          
            if(this.selectedvalues[a][b] !== undefined
              && this.selectedvalues[a][b].length > 0){

              this.selectedvalues[a][b].forEach(item => {
                  if(item){
                    empty = false
                  }
              })
            
            }

          }

        }
        
      }else{
        if(a){
            if(this.selectedvalues[this.type] !== undefined 
              && this.selectedvalues[this.type][a] !== undefined 
              && this.selectedvalues[this.type][a].length > 0){
                this.selectedvalues[this.type][a].forEach(item => {
                    if(item){
                      empty = false
                    }
                })
            }
          }else{
            if(b){
              if(this.selectedvalues[b] !== undefined 
                && this.selectedvalues[b] !== undefined 
                && this.selectedvalues[b].length > 0){
                  this.selectedvalues[b].forEach(item => {
                      if(item){
                        empty = false
                      }
                  })
              }
            }else{
              if(this.selectedvalues[this.type] !== undefined 
                && this.selectedvalues[this.type].length > 0){
                  this.selectedvalues[this.type].forEach(item => {
                      if(item){
                        empty = false
                      }
                  })
              }
            }
          }
      }
      return !empty
    
    },

    keywordsEdited(){

        let selectedv = this.selectedvalues[this.type]

        if(this.type == 'industry'){
          selectedv = this.selectedvalues.industry.words.word
        }

        if(selectedv !== undefined 
        && selectedv['keywords'] !== undefined 
        && selectedv['keywords']['greater'] !== undefined 
        && selectedv['keywords']['greater'].length > 0)
          return true

        if(selectedv !== undefined 
        && selectedv['keywords'] !== undefined 
        && selectedv['keywords']['less'] !== undefined 
        && selectedv['keywords']['less'].length > 0)
          return true  

        if(selectedv !== undefined 
        && selectedv['keywords'] !== undefined 
        && selectedv['keywords']['anyof'] !== undefined 
        && selectedv['keywords']['anyof'].length > 0)
          return true

        if(selectedv !== undefined 
        && selectedv['keywords'] !== undefined 
        && selectedv['keywords']['notanyof'] !== undefined 
        && selectedv['keywords']['notanyof'].length > 0)
          return true

        if(selectedv !== undefined 
        && selectedv['keywords'] !== undefined 
        && selectedv['keywords']['known'] !== undefined 
        && selectedv['keywords']['known'].length > 0)
          return true

        if(selectedv !== undefined 
        && selectedv['keywords'] !== undefined 
        && selectedv['keywords']['unknown'] !== undefined 
        && selectedv['keywords']['unknown'].length > 0)
          return true


    },

    isEdited(){


      switch (this.type) {
          case 'industry':
            return this.selectEdited('hierarchy') || this.selectEdited('list') || this.keywordsEdited()
            break;
          case 'linkedin':
            return (this.selectEdited(false,'linkedin') || this.selectEdited(false,'ondemand') || this.selectEdited(false,'importlist'))
            break;
          case 'job':

            return this.selectEdited('job','functions')
                  || this.selectEdited('job','level')
                  || this.keywordsEdited()


            break;
          case 'location':

            return this.selectEdited('location','regions')
                  || this.selectEdited('location','countries')
                  || this.keywordsEdited() 

            break;

          case 'employees':
            return this.keywordsEdited() 
            break;
          case 'campaignselected':
            return this.selectEdited('select')
            break;
          case 'url':
            return this.keywordsEdited() 
            break;
          case 'word':
            return this.keywordsEdited() 
            break;
          case 'status':
              if(this.selectedvalues.status.buy !== undefined
                && this.selectedvalues.status.buy !== false){
                return true
              }
              if(this.selectedvalues.status.notbuy !== undefined
                && this.selectedvalues.status.notbuy !== false){
                return true
              }
              if(this.selectedvalues.status.bounced !== undefined
                && this.selectedvalues.status.bounced !== false){
                return true
              }
              if(this.selectedvalues.status.donotcontact !== undefined
                && this.selectedvalues.status.donotcontact !== false){
                return true
              }
              if(this.selectedvalues.status.engaged !== undefined
                && this.selectedvalues.status.engaged !== false){
                return true
              }
              if(this.selectedvalues.status.notengaged !== undefined
                && this.selectedvalues.status.notengaged !== false){
                return true
              }
              if(this.selectedvalues.status.newcontacts !== undefined
                && this.selectedvalues.status.newcontacts !== false){
                return true
              }
            break;
          case 'custom':
              if(this.selectedvalues.custom.filterquery !== undefined){
                  return true
              }
            break;
        }


      return false
    }, 
    clearIndustry(){
      this.edited = false
      this.$emit("clear");
      delete this.selectedvalues[this.type]
      this.keyref++
      this.keyitem = this.keyref + '-' + this.type 
      this.$emit("done");
    },
    getColor(){

      if(this.selectedvalues.imported){
        return "primary"
      }

      if(this.selectedvalues.status !== undefined && this.selectedvalues.status.notbuy){
        return "secondary"
      }
      if(this.selectedvalues.status !== undefined && this.selectedvalues.status.buy){
        return "success"
      }


      return "primary"

    },
  }

}
</script>
<style scopped>
.right-0 {
  right:0px;
}
@media (max-width: 714px) {
  .filterdropdown {
      position: relative !important;
      left: inherit !important;
      top: inherit !important;
      z-index: 9 !important;
      margin-left: inherit !important;
      width:100% !important;
  }
   .filterdropdown .box-search{
      width:100%;
  }
}
</style>