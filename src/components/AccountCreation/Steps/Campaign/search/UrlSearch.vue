<template>
    
<div class="accordion" id="accordionmorethan">
          <div class="">
            <div class="" id="headingLocation">
              <h2 class="mb-0">
                <button class="btn  btn-sm btn-light collapsed" type="button" data-toggle="collapse" data-target="#collapseMore" aria-expanded="false" aria-controls="collapseMore">
                <span>{{ $t('lang.search.url') }}</span></button>
                <div class="dropdown-divider"></div>
              </h2>
            </div>
            <div id="collapseMore" class="" aria-labelledby="collapseMore" data-parent="#accordionmorethan">
              <div>
            <div class="ml-2">
            <small>example.com</small><br>
            <small>example.co.uk</small><br>
            <small>example</small>
            </div>
        
        <KeyWordSearch  
        :default_values="default_values.url.keywords"
        ref="companyurl" />
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
  components: {
    IndustrySearch,
    KeyWordSearch
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

  props: {
    default_values: Object,
  },
  data() {
    return {
      result_autocomplete: Object,
      categories_industry: [],
      categories_level: [],
      categories_function: [],
      region: [],
      employes: [],
    }
  },  
  created(){
    this.default_values['url'] = []
    this.default_values['url']['keywords'] = {}
  },

}
</script>