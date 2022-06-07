<template>
<main class="main"  :class="{ 'expand-main' : isMenuCollapse }">
<div class="contentCenter all">

<section class="importcontacts">

	<MyContacts/>

</section>
</div>
</main>
</template>
<script>
import MyContacts from "@/components/Contacts/MyContacts.vue";

import { mapState, mapActions } from "vuex";

export default {
	data() {
	    return {
	      route:'',
	    }
	    
	},
  components: {
    MyContacts
  },
        computed: {
        ...mapState({
          headerTab: state => state.header.tab,
	    	isMenuCollapse: state => state.sidebar.isNavOpen, 
        }),



      },
		created(){
		      this.setCurrentRoute({page:'csvimport'});
		      this.setCurrentRouteChild({child:''});	
		},
	methods:{

	    ...mapActions("headertopbar", {
         setCurrentRoute:"setRoute",
         setCurrentRouteChild:"setRouteChild"
    	}),
	},

 }
</script>