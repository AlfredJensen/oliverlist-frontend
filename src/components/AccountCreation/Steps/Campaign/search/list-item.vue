<template>  
<a class="border-0 my-2 rounded cursor-pointer list-group-item"

     :id="'list-'+type+'-list'" 
     data-toggle="list" 
     :href="'#list-'+type"
     role="tab" 
     aria-controls="type"
     >

    <div
    v-if="this.model[type+'edited']"
     class="right-0 mr-0 position-absolute">
    <span class="text-primary  cursor-pointer">
        <i class="icon-pencil"></i> 
    </span>
    <span 

    v-on:click.stop.prevent="clear()" class="text-primary ml-1 cursor-pointer"  >
        <i class="icon-close"></i>
    </span>
    </div>

    <span
    class="w-100">
    <i :class="icon"></i> 
      {{label}}
    </span>
</a>
</template>
<script>


export default {
   props: {
    type: String,
    label: String,
    icon: String,
    options: Array,
    selectedvalues: Object,
    model:Object
  },
  methods: {
    clear(){
      this.model[this.type+"edited"] = false
      this.$emit("clear");
    }
  },
}

</script>