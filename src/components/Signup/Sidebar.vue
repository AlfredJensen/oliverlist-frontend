<template>
  <div class="sidebar">
    <img
        src="@/assets/images/logomenu.png"
        class="logo-img"
     />
        <div>
            <img class="item-img" src="@/assets/images/option.png"/>
            <p class="item">Your first B2B appointment order is just a few clicks away</p>
        </div>
        <div>
            <img class="item-img" src="@/assets/images/option.png"/>
            <p class="item">Get appointment in your calendar in 15 days</p>
        </div>
        <div>
            <img class="item-img" src="@/assets/images/option.png"/>
            <p class="item">You only pay when the first appointments will be generated</p>
        </div>    
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import { tabsMixin } from "@/_mixins/";
import jQuery from "jquery";
let $ = jQuery;

export default {
  created() {
    
  },
  data() {
    return {
        
    }
  },

  computed: {
   
  },

  methods: {
     
  },
};
</script>
<style>
    .sidebar {
        background-color: #1F203F;
        width: 100%;
        min-height: 100vh;
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        z-index: 999;
        text-align: center;
    }
    .sidebar > div {
        text-align: left;
        margin-bottom: 15px;
        padding-left: 50px;;
    }

    .logo-img {
        margin-top: 150px;
        margin-bottom: 100px;
    }

    .item-img {
        width: 33px;
        height: 33px;
    }

    .item {
        padding-left: 20px;
        display: inline;
        color: #ffffff;
        font-weight: 400;
        font-size: 20px;
    }
</style>
  