<template>
<section class="linkedin">
     <main class="main"  :class="{ 'expand-main' : isMenuCollapse }">

        <Captaindata 
        :key="keyLinkedin"
        @refresh="refreshLinkedin"></Captaindata>

    </main>
  </section>
</template>


<script>
import { mapState, mapActions } from "vuex";
import Captaindata from "@/components/AccountCreation/Steps/Campaign/search/Captaindata.vue";
import { businessContactsService } from "@/_services";

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
	     }
    },
  	components: {
    	Captaindata,
  	},
  	methods:{
  		refreshLinkedin(){
  			this.keyLinkedin++
  		}
  	}
};
</script>

