<template>
  <div class="">
    <section class="second-step-company" >

    <div v-if="false" class=" mt-2">
      <div class="col-md-12">     
        <Autocomplete 
        :isAsync="true"
        :results="result_autocomplete"
        @getResults="filterResultsAutocomplete" />
      </div>
    </div>
     

    
    <div class=" bg-white p-4">

      <h6>{{ $t('lang.label.advancedfilters') }}</h6>


  
<div class="btn-group mb-2">
  <button type="button" class="btn btn-sm btn-primary">
  <i class="icon-building"></i> 
  {{ $t('lang.label.industry') }}</button>
  <button 
    v-on:click.stop.prevent="openIndustry = true"
  type="button"
  class="btn btn-primary"
   data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
      <div @click="clearIndustry()" v-if="categories_industry.length > 0">
        <i class="icon-close float-right ml-2"></i>
      </div>
        <i class="icon-edit float-right ml-2"></i> 
  </button>
   <div 
   :class="{ 'show' : openIndustry == true }"
   class="filterdropdown dropdown-menu p-2 position-absolute" >
    <div class="mb-2" >
    <label>{{ $t('lang.label.industry') }}</label>
    <button
    @click="openIndustry = false"
     class="btn btn-sm btn-danger float-right ml-2"><i class="icon-close"></i></button>
    <button class="btn btn-sm btn-primary float-right">{{ $t('lang.label.done') }}</button>
    </div> 
    <IndustrySearch
    :option_list="this.hierarchyoptionsGoogle" 
    :default_values="this.categories_industry">
    </IndustrySearch>
  </div>
</div>



      <div>
      <button class="w-50 text-left mb-2 btn btn-sm btn-primary">
        <i class="icon-people"></i> 
        <span class="pl-1 pr-3">Job title</span>
        <i class="icon-close float-right ml-2"></i>
        <i class="icon-edit float-right"></i> 
      </button>
      </div>

      <div>
      <button class="w-50 text-left mb-2 btn btn-sm btn-primary">
        <i class="icon-location"></i> 
        <span class="pl-1 pr-3">Location</span>
        <i class="icon-close float-right ml-2"></i>
        <i class="icon-edit float-right"></i> 
      </button>
      </div>

 

      <div class="card p-2">
        <div class="mb-2">
        <label>Job title</label>
        <button class="btn btn-sm btn-primary float-right">Done</button>
        </div> 
        <div class="accordion" id="accordionjobtitle">
          <div class="" id="headingJobOne">
          <h2 class="mb-0">
            <button class="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#collapseJobOne" aria-expanded="false" aria-controls="collapseJobOne">
              Search by job title
            </button>
          </h2>
          </div>
          <div id="collapseJobOne" class="collapse" aria-labelledby="headingJobOne" data-parent="#accordionjobtitle">
          <div class="card-body">

            <KeyWordSearch ref="jobtilte" />
          </div>
          </div>
          </div>
          <div class="">
          <div class="" id="headingJobTwo">
          <h2 class="mb-0">
            <button class="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#collapseJobTwo" aria-expanded="false" aria-controls="collapseJobTwo">By job function
            </button>
          </h2>
          </div>
          <div id="collapseJobTwo" class="collapse" aria-labelledby="headingJobTwo" data-parent="#accordionjobtitle">
          <div class="card-body">

          <IndustrySearch 
          :option_list="this.hierarchyoptionsSearchFunction" 
          :default_values="this.categories_function">
          </IndustrySearch>
          </div>
          </div>
          </div>
          <div class="">
          <div class="" id="headingJobThree">
          <h2 class="mb-0">
            <button class="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#collapseJobThree" aria-expanded="false" aria-controls="collapseJobThree">
            By management level
            </button>
          </h2>
          </div>
          <div id="collapseJobThree" class="collapse" aria-labelledby="collapseJobThree" data-parent="#accordionjobtitle">
          <div class="card-body">

          <IndustrySearch 
          :option_list="this.hierarchyoptionsSearchLevel" 
          :default_values="this.categories_level">
          </IndustrySearch>
          </div>
          </div>
        </div>
      </div> 


      <div class="card p-2">
        <div class="mb-2">
        <label>Location</label>
        <button class="btn btn-sm btn-primary float-right">Done</button>
        </div> 
        <IndustrySearch 
        :option_list="this.hierarchyoptions" 
        :default_values="this.region">
        </IndustrySearch>

        <div class="accordion" id="accordionlocation">
          <div class="">
            <div class="" id="headingLocation">
              <h2 class="mb-0">
                <button class="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#collapseLocation" aria-expanded="false" aria-controls="collapseLocation">
                By postal code
                </button>
              </h2>
            </div>
            <div id="collapseLocation" class="collapse" aria-labelledby="collapseLocation" data-parent="#accordionlocation">
              <div class="card-body">
                <KeyWordSearch  ref="postalcode" />
              </div>
            </div>
          </div>
        </div> 
      </div>


      <div class="card p-2">
        <div class="mb-2">
        <label>Employees</label>
        <button class="btn btn-sm btn-primary float-right">Done</button>
        </div> 
        <IndustrySearch 
        :option_list="this.companySizeOptions" 
        :default_values="this.employes">
        </IndustrySearch>
      </div>

      <div class="card p-2">
        <div class="mb-2">
        <label>By company url</label>
        <button class="btn btn-sm btn-primary float-right">Done</button>
        </div> 
        <KeyWordSearch  ref="companyurl" />
      </div>

      </div>
   

    </section>
  </div>
</template>
<script>
import IndustrySearch from "@/components/AccountCreation/Steps/Campaign/search/IndustrySearch.vue";

import { categoriesService  } from "@/_services";
import Autocomplete from "@/components/AccountCreation/Steps/Campaign/search/Autocomplete.vue";
import KeyWordSearch from "@/components/AccountCreation/Steps/Campaign/search/KeyWordSearch.vue";

import { mapState, mapActions } from "vuex";

export default {
  components: {
    IndustrySearch,
    Autocomplete,
    KeyWordSearch
  },
  created() {
    this.openIndustry = false
  },
  props: {
    model: Object,
    activeStep: Number
  },
  data() {
    return {
      result_autocomplete: Object,
      categories_industry: [],
      categories_level: [],
      categories_function: [],
      region: [],
      employes: [],
      openIndustry: false,
    }
  },
  computed: {
    ...mapState({
      loadingOptionsList: state => !state.optionsList.completeLoading,
      hierarchyoptions: state => state.optionsList.all['regions'].data,
      hierarchyoptionsSearch: state => state.optionsList.all['categories_search_words'].data,
      hierarchyoptionsSearchFunction: state => state.optionsList.all['categories_search_function'].data,
      hierarchyoptionsSearchLevel: state => state.optionsList.all['categories_search_level'].data,
      hierarchyoptionsGoogle: state => state.optionsList.all['categories_google'].data,
      companySizeOptions: state => state.optionsList.all['param_5'].data,
      companyTypeOptions: state => state.optionsList.all['param_10'].data,
      parametersTF: state => state.optionsList.all['parameters_tf'].data,
    }),
  },
    methods: {
    filterResultsAutocomplete(text){
      categoriesService.searchCategories(text,false).then(
              (response) => {
                this.result_autocomplete = response
              }
            );
    },
  }

}
</script>
<style>
.filterdropdown{
  width:430px !important;
  z-index:2 !important;
}
</style>