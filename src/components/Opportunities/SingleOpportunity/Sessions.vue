<template>
  <section class="sessions">
   <ul>
  		        <li
          class="activityLine border-left pb-4"
          v-for="(session, index) in sessions"
        > 
        <div class="card ml-4 p-2" >
        <div>
        <img style="background-color:#a2a2a2;" width="30px" height="30px" :src="getBusinessPhoto(session.photo)" class="mr-2 rounded-circle img-profile"> 
        <span>{{ session.name }}</span>
        </div>
        </div>

  		</li>


 	</ul>
  		{{ this.sessions }}
  </section>
</template>
<script>
import { opportunitiesService } from "@/_services";
import { formattersMixin } from "@/_mixins/";

export default {

  props: {
    opportunityId: String,
  },

  data () {
    return {
      sessions: false,
    }     
  },

  created() {
      opportunitiesService.getSessions(this.opportunityId).then( result => {
         this.sessions = result;
      });
      
  },

  mixins: [formattersMixin],

  methods:{
  },
 
   
  
};
</script>