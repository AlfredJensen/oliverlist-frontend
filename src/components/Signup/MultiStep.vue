<template>
<div id="app" class="bg-white">
  <div class="ml-2 mr-2">
      <section :class="animation">
        <div class="input-fields">

        </div>
      </section>
  </div>
</div>
</template>

<script>

import Step1 from "@/components/Signup/Steps/Step1.vue";
import Step2 from "@/components/Signup/Steps/Step2.vue";
import Step3 from "@/components/Signup/Steps/Step3.vue";

export default {

  components: {
    Step1,
    Step2,
    Step3
  },

  props: {
    user: Object
  },

  data () {
      return {

      };
  },
  methods: {
    
  }
}
</script>
