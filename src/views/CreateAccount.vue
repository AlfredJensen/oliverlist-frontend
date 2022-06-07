<template>
      
      <div>
      <MultiStep  :user="user" />
      </div>
</template>


<script>
import MultiStep from "@/components/AccountCreation/MultiStep.vue";
export default {
  data(){
    return{
      option:'',
    }
  },
  computed: {
    user() {
      return this.$store.state.authentication.user;
    }
  },
  components: {
    MultiStep,
    
  },
  methods: {

  }

}
</script>