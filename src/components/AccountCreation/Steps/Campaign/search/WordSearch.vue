<template>


      
              <div class="">
                <KeyWordSearch 
                  :enabled="[true,false,false,false]"
                  @quantity="updateCant"
                  :default_values="default_values.word.keywords"
                 ref="postalcode" />
              </div>
         



</template>
<script>
import KeyWordSearch from "@/components/AccountCreation/Steps/Campaign/search/KeyWordSearch.vue";



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
    KeyWordSearch
  },
  props: {
    option_list: Array,
    default_values: Object,
  },
  created() {
    this.default_values['word'] = []
    this.default_values['word']['keywords'] = {}
  },
}
</script>