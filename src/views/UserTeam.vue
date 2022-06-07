<template>
  <div>  
    <component is="UserTeam" :hashClient="hashClient"></component>
  </div>  
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  data () {
    return {
      addUser: false,
    }
  },

  created() {
   // console.log(this.$route.query.hash)
 },

 components: {

},
mounted(){
},

computed: {
  ...mapState({
  }),

  hashClient() {
    return this.$route.query.hash;
  }
},

methods: {
}
};
</script>