<template>
    <div class="row ml-0 mr-0">
            <div class="col-md-5">
                <SideBar></SideBar>
            </div>
            <div class="col-md-7">
                <MultiStep  :user="user" />
            </div>
        </div>
</template>


<script>

import MultiStep from "@/components/SignUp/MultiStep.vue";
import SideBar from "@/components/SignUp/SideBar.vue";

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
    SideBar
  },
  methods: {

  }

}
</script>