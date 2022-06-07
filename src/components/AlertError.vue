<template>
    <div class="alertErrorComponent">
    <div class=" alert alert-danger">
       
       <div><span class="icon-exclamation-circle color-red anim mr-2 "></span><span class="alert-link">Please, write the data again</span></div>
       <div v-if="msgError != ''" >
        <hr>
           <div v-html="msgError"></div>
      </div>
    </div>
    </div>
</template>

<script>
export default {
      props: {
        msgError: String,
    },
     data () {
        return {}
    
    
    }
};

</script>