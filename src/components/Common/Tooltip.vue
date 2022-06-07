<template>
	
<span 
:style="'max-width:'+width"
:id="'olivertooltip-' + this.myid"
tabindex="0" 
data-toggle="tooltip" 
:title="text">
<slot></slot> 
</span>

</template>
<script>
import $ from "jquery";
import Vue from 'vue';

export default {
	  data() {
	    return {
	    	myid:0
	    }
	  },
	created(){
		if(this.width == undefined){
			this.width = "auto"
		}

		this.myid = Math.floor(Math.random() * Math.floor(999999))

        this.$nextTick(function () {
            $("#olivertooltip-" + this.myid).tooltip()
        });

	},
	methods:{

	   
	},
    props: {
      text:String,
      color:'#333',
      width:String
    },
}

</script>
<style scoped>

</style>