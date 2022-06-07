<template>
  <div class="sidebar">
    <div class="side-header"> 
        <img
            src="@/assets/images/logomenu.png"
            class="logo-img"
        />
    </div>
    <div class="side-content">
        <div class="side-left">
        </div>
        <div class="side-right">
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
    </div>
    <div class="side-footer">
        <div class="side-left">

        </div>
        <div class="side-right">
            <p class="item-end">OliverList&nbsp;&nbsp;&nbsp;&nbsp; Privacy and T&Cs</p>
        </div>
        
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
    .sidebar{
        display: flex;
        flex-direction: column;
        background-color: #1F203F;
        height: 100%;
        padding: 3em 0 3em 0;
    }
    .side-header {
        display: flex;
        flex: 2;   
        justify-content: center;
        align-items: center;
    }
    .side-content {
        flex: 1;
        display: flex;
    }
    .side-content > div > div{
        display: flex;
        align-items: center;
        flex: 1;
    }
    .side-left {
        flex: 2;
    }
    .side-right {
        display: flex;
        flex: 11;
        flex-direction: column;
        justify-content: flex-end;
    }
    .side-footer {
        display: flex;
        flex: 2;
    }
    .item {
        color: #ffffff;
    }
    .item-img {
        width: 33px;
    }
    .item {
        display: inline;
        color: #ffffff;
        font-weight: 400;
        font-size: 20px;
        margin-left: 10px;
    }
    .item-end {
        color: #ffffff;
        font-weight: 400;
        font-size: 20px;
        flex: flex
    }
</style>
  