<template>
     <div>

        <IndustrySearch 
        v-if="option_list.length < 100"
        :option_list="option_list" 
        :default_values="default_values.campaignselected.select">
        </IndustrySearch> 
        <div v-else>
          <ul>
            <li class="ml-3" v-for="(option,key) in option_list">
               <input 
                :id="option.id"
                v-model="default_values.campaignselected.select[key]"
                v-bind:true-value="option.id"
                v-bind:false-value="undefined"

                class="" type="checkbox">
                <label class=" ml-2 cursor-pointer form-check-label" :for="option.id">
                  {{option.name}}
                </label>
                </input>
            </li>
          </ul>
        </div>
      </div>
</template>
<script>
import IndustrySearch from "@/components/AccountCreation/Steps/Campaign/search/IndustrySearch.vue";
import { mapState, mapActions } from "vuex";

export default {
  data(){
    return{
      multioption:[]
    }
  },
  components: {
    IndustrySearch,
  },
  props: {
    option_list: Array,
    default_values: Object,
  },
  created() {
    this.default_values['campaignselected'] = []
    this.default_values['campaignselected']['select'] = []
  }
}
</script>