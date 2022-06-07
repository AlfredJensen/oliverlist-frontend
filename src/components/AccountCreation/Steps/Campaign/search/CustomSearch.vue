<template>
  <div>
    <section>

    <div class="bg-white">
        

         <FilterSystem 
        class="display-inline" 
        :columns="defaulOptions" 
        :reset="false" 
        :sort="sort" 
        :dir="dir" 
        :filterSystem="filtersSystem" 
        :filterOldQuery="oldQuery" 
        @callApi="callApi" />

     </div>
        

    </section>
  </div>
</template>
<script>
import FilterSystem from "@/components/FilterSystem.vue";
import { mapState } from "vuex";

export default {
  components: {
    FilterSystem
  },
  computed: {
    ...mapState({
      loading: (state) => state.contactscsv.loading,
      businesses: (state) => state.contactscsv.all.data,
      filters: (state) => state.contactscsv.allFilters,
      filtersSystem: (state) => state.contactscsv.filtersSystem,
      oldQuery: (state) => state.contactscsv.oldQuery,
      currentUser: (state) => state.authentication.user,
      currentPage: state => state.contactscsv.currentPage, 
    }),
    },
    props: {
        option_list: {
            type: Array,
            required: true,
        },
        default_values: {
            type: Object,
            required: false,
            default: Object
        },
    },
    data() {
      return {
        chooseValues: Array,
        defaulOptions: Array,
        sort:'id',
        dir:'asc',
       };

    },
    created(){
        this.chooseValues = this.default_values
        this.defaulOptions = this.option_list
        this.default_values.custom = {}
    },
    
    methods: {
       getFilterQuery(filters){
         var filterquery
         filterquery = {};
         filterquery["condition"] = String(filters.type);
         for(var i = 0; i <= filters.predicates.length - 1; i++) {
            filterquery[i] = {};
            filterquery[i]["condition"] = String(filters.predicates[i].type)
            for(var i2 = 0; i2 <= filters.predicates[i].predicates.length - 1; i2++) {
              filterquery[i][i2] = {};
              filterquery[i][i2]["type"] = String(filters.predicates[i].predicates[i2].comparison)
              filterquery[i][i2]["field"] = String(filters.predicates[i].predicates[i2].field)
              filterquery[i][i2]["value"] = String(filters.predicates[i].predicates[i2].value)
            }
         }
         return Object.assign(filterquery);
      },
      callApi(filters){
       filters = filters.filters
       this.default_values.custom.filterquery = this.getFilterQuery(filters);
      },
      done(){

      }
    }
}

</script>