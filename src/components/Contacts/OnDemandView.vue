<template>
<section class="linkedin">
    <main class="main">
      <div class="contenedor">
      <div class="row">
        <div class="col-md-6">
          <h4>Searching</h4>
          <div v-for="(option,key) in list" >
            
            {{option.name}} - {{option.category}} -
            
            <a class="text-primary" target="_blank" :href="'https://www.google.com/maps/search/'+option.category+'/@'+option.actualposition+',10z'">Searching in <i class="icon-google"></i>maps</a>
            
            <small v-if="!option.finishposition" style="width:15px;height:15px;" class="spinner-border loading-spinner"></small>

            <span v-if="option.finishposition" >
              <i class="icon-checkmark">
            </i>
                completed
            </span>
          </div>
        </div>
        <div class="col-md-6"></div>
      </div>
    </div>
    </main>
  </section>
</template>


<script>
import { mapState, mapActions } from "vuex";

import { onDemandService } from "@/_services";

export default {
    computed: {
      ...mapState({
        headerTab: (state) => state.header.tab,
        isMenuCollapse: (state) => state.sidebar.isNavOpen,
      }),
    },
	  data() {
	     return {
	      keyLinkedin:1,
        list:[] 
	     }
    },
    created(){
      onDemandService.getList().then(
        (response) => {
            this.list = response.result
        });
    },
  	components: {
  	},
  	methods:{
  	}
};
</script>


