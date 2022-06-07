<template>
  

      <div>
       
 

          <div class="">
          <div class="" id="headingJobThree">
          <h2 class="mb-0">
            <button class="btn  btn-sm btn-light collapsed" type="button" data-toggle="collapse" data-target="#collapseJobThree" aria-expanded="false" aria-controls="collapseJobThree">
            {{ $t('lang.search.bymanagementlevel') }}
            </button><div class="dropdown-divider"></div>
          </h2>
          </div>
          <div id="collapseJobThree" class="collapse" aria-labelledby="collapseJobThree" data-parent="#accordionjobtitle">
          <div class="">

          <IndustrySearch 
          :option_list="option_list['level']" 
          :default_values="default_values.job.level">
          </IndustrySearch>
          </div>
          </div>
            <div class="">
          <div class="" id="headingJobTwo">
          <h2 class="mb-0">
            <button class="btn btn-sm btn-light collapsed" type="button" data-toggle="collapse" data-target="#collapseJobTwo" aria-expanded="false" aria-controls="collapseJobTwo">{{ $t('lang.search.byjobfunction') }}
            </button><div class="dropdown-divider"></div>
          </h2>
          </div>
          <div id="collapseJobTwo" class="collapse" aria-labelledby="headingJobTwo" data-parent="#accordionjobtitle">
          
          <div class="">

          <IndustrySearch 
          :option_list="option_list['function']" 
          :default_values="default_values.job.functions">
          </IndustrySearch>
          </div>
          </div>
          </div>

       <div class="accordion" id="accordionjobtitle">
            <div class="" id="headingJobOne">
            <h2 class="mb-0">
              <button class="btn  btn-sm btn-light collapsed" type="button" data-toggle="collapse" data-target="#collapseJobOne" aria-expanded="false" aria-controls="collapseJobOne">
                {{ $t('lang.search.byjobtitle') }} 
                 <small v-if="keywordscant > 0">
                <span class="badge-primary badge-sm rounded px-1 ml-1">{{keywordscant}}</span></small>
              </button><div class="dropdown-divider"></div>
            </h2>
            </div>
            <div id="collapseJobOne" class="collapse" aria-labelledby="headingJobOne" data-parent="#accordionjobtitle">
              <div class=" pb-4">
                <KeyWordSearch 
                @quantity="updateCant"
                :default_values="default_values.job.keywords"
                ref="jobtilte" />
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
  components: {
    IndustrySearch,
    KeyWordSearch,
  },
  created(){
    this.default_values['job'] = []
    this.default_values['job']['level'] = []
    this.default_values['job']['functions'] = []
    this.default_values['job']['keywords'] = {}
  },
  methods:{
    updateCant(cant){
      this.keywordscant = cant
    }
  },
  props: {
    option_list: Array,
    default_values: Object,
  },
}
</script>