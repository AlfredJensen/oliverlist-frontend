<template>
     <div>
       
    <small class="pl-1 mt-2 text-secondary"><strong>{{ $t('lang.search.companylocation') }}</strong></small>


       

        <div class="accordion" id="accordionregion">
          <div class="">
            <div class="" id="headingLocation">
              <h2 class="mb-0">
                <button class="btn  btn-sm btn-light collapsed" type="button" data-toggle="collapse" data-target="#collapseRegion" aria-expanded="false" aria-controls="collapseRegion">
                <span>{{ $t('lang.search.region') }}</span></button>
                <div class="dropdown-divider"></div>
              </h2>
            </div>
            <div id="collapseRegion" class="collapse" aria-labelledby="collapseRegion" data-parent="#accordionregion">
              <div class="">
                <IndustrySearch
          :option_list="option_list.regions"
          :default_values="default_values.location.regions.select" >
        </IndustrySearch>
              </div>
            </div>
          </div>
        </div> 



        <div class="accordion" id="accordionlocation">
          <div class="">
            <div class="" id="headingLocation">
              <h2 class="mb-0">
                <button class="btn  btn-sm btn-light collapsed" type="button" data-toggle="collapse" data-target="#collapseLocation" aria-expanded="false" aria-controls="collapseLocation">
                <span>{{ $t('lang.search.postalcode') }}</span>
                
               <small v-if="keywordscant > 0">
              <span class="badge-primary badge-sm rounded px-1 ml-1">{{keywordscant}}</span></small>
                </button>
                <div class="dropdown-divider"></div>
              </h2>
            </div>
            <div id="collapseLocation" class="collapse" aria-labelledby="collapseLocation" data-parent="#accordionlocation">
              <div class="">
                <KeyWordSearch 
                  @quantity="updateCant"
                  :default_values="default_values.location.keywords"
                 ref="postalcode" />
              </div>
            </div>
          </div>
        </div> 

    <small class="pl-1 text-secondary"><strong>{{ $t('lang.search.contactlocation') }}</strong></small>

      
      <div class="accordion" id="accordioncountry">
          <div class="">
            <div class="" id="headingLocation">
              <h2 class="mb-0">
                <button class="btn  btn-sm btn-light collapsed" type="button" data-toggle="collapse" data-target="#collapseCountry" aria-expanded="false" aria-controls="collapseCountry">
                <span>{{ $t('lang.search.country') }}</span></button>
                <div class="dropdown-divider"></div>
              </h2>
            </div>
            <div id="collapseCountry" class="collapse" aria-labelledby="collapseCountry" data-parent="#accordioncountry">
              <div class="">
                <IndustrySearch
          :option_list="option_list.country"
          :default_values="default_values.location.countries.select" >
        </IndustrySearch>
              </div>
            </div>
          </div>
        </div> 
      
      </div>
</template>
<script>
import IndustrySearch from "@/components/AccountCreation/Steps/Campaign/search/IndustrySearch.vue";
import KeyWordSearch from "@/components/AccountCreation/Steps/Campaign/search/KeyWordSearch.vue";

import { mapState, mapActions } from "vuex";

export default {
  data(){
    return {
      keywordscant:0
    }
  },
  methods:{
    updateCant(cant){
      this.keywordscant = cant
    }
  },
  components: {
    IndustrySearch,
    KeyWordSearch
  },
  props: {
    option_list: Array,
    default_values: Object,
  },
  created(){
    this.default_values['location'] = []
    this.default_values['location']['keywords'] = {}
    this.default_values['location']['regions'] = []
    this.default_values['location']['countries'] = []
    this.default_values['location']['regions']['select'] = []
    this.default_values['location']['countries']['select'] = []
  },

}
</script>