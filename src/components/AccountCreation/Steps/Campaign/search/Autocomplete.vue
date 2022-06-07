<template>
  <div class="autocomplete position-relative">
   

  <div class="input-group ">
    <input
      style="height:31px"
      class="form-control border-0 pt-0 pb-0 text-primary"
      :placeholder="$t('lang.label.quicksearch')"
      type="text"
      @input="onChange"
      v-model="search"
    >
    <span 
    v-if="search.length > 0 && !isAsync"
    class="closeicon text-primary  cursor-pointer float-right ml-2" @click="close()">
        <i class="icon-close"></i>
        </span>

   
    <span 
    v-if="search.length == 0 && !isAsync"
    class="closeicon text-secondary  cursor-pointer float-right ml-2">
        <i class="icon-search"></i>
        </span>

    <span 
    v-if="isAsync"
    @click="viewAll('contacts')"
    class="btn-sm btn-primary  cursor-pointer float-right ">
        <i class="icon-search"></i>
        </span>

    </input>
     
  </div>


<div 
 id="autocomplete-results"
      v-show="isOpen"
      class="dropdown-menu list-group position-absolute autocomplete-results w-100 p-1"
>


      <a 
      @click="viewAll('contacts')"
      class="dropdown-item" href="#"
      >
        <small class="text-primary">Contacts</small>
        <small class="btn btn-sm btn-outline-primary float-right pt-1">
        <i class="icon-search"></i></small>
      </a>
      <div class="dropdown-divider"></div>
      <a 
       class="text-center"
      href="#"   v-if="!isLoading && 
        (!results.list || results.list.length == 0)"
      >
        <small>Empty results...</small>
      </a>
      <a href="#"   v-if="isLoading">
      <span
        class="loadingres d-flex p-2 spinner-border loading-spinner mx-auto" 
        role="status"
      >
      </span>
      </a>

      <a href="#"
        v-if="!noresult"
        v-for="(result, i) in results.list"
        :key="i+32"
        @click="setResult(result)"
        class="dropdown-item"
      >
        
        <small>
        <div>
        <strong>{{ result.contact_name }}</strong>
        <div>
        <small>{{ result.business_name }}</small>
        </div>
        </div>
        </small>

      </a>

      <a href="#" 
      @click="viewAll('business')"
      class="dropdown-item">
        <small class="text-primary">Business</small>

        <small class="btn btn-sm btn-outline-primary float-right pt-1">
        <i class="icon-search"></i></small>
      </a>

      <div class="dropdown-divider"></div>


      <a 
       class="text-center"
      href="#"   v-if="!isLoading && 
        (!results.business || results.business.length == 0)"
      >
        <small>Empty results...</small>
      </a>
      <a href="#"  v-if="isLoading" class="pb-2">
      <span
        class="loadingres d-flex p-2 spinner-border loading-spinner mx-auto" 
        role="status"
      >
      </span>
      </a>

      <a href="#"
        v-if="!noresult"
        v-for="(business, i) in results.business"
        :key="i"
        @click="setResult(business)"
        class="dropdown-item"
      >
      
        <small>
        <div>
        <strong>{{ business.contact_name }}</strong>
        <div>
        <small>{{ business.domain }}</small>
        </div>
        </div>
        </small>

      </a>

  </div>
  </div>
</template>
<script>
import Vue from "vue";
import {
  campaignsService,
  categoriesService,
  regionsService,
} from "@/_services";
import { formattersMixin } from "@/_mixins/";
import { mapState, mapActions } from "vuex";

export default {
  name: "autocomplete",
  mixins: [formattersMixin],
  props: {
    items: {
      type: Object,
      required: false,
      default: () => {
        (list) => [], (business) => [];
      },
    },
    isAsync: {
      type: Boolean,
      required: false,
      default: false,
    },
  },

  data() {
    return {
      isOpen: false,
      isLoading: false,
      arrowCounter: 0,
      search: "",
      noresult: false,
      searching: "",
      results: [],
    };
  },

  methods: {
    onChange(evt) {
      if (!this.isAsync) {
        setTimeout(
          function () {
            this.isLoading = true;
            this.results = [];
            this.isOpen = true;
            if (this.searching != this.search) {
              this.searching = this.search;
              this.filterResults();
            } else {
              if (this.results.length > 0) {
                this.isLoading = false;
              }
            }
          }.bind(this),
          1500
        );
      }
    },
    viewAll(type) {
      this.isOpen = false;
      this.$emit("viewAll", this.search, type);
    },
    filterResults() {
      // first uncapitalize all the things
      this.$emit("getResults", this.search.toLowerCase());
    },
    close() {
      // first uncapitalize all the things
      this.search = "";
      this.$emit("close");
    },
    setResult(result) {
      this.search = result.contact_name;
      this.isOpen = false;
      this.$emit("choose", result);
    },
    onEnter() {
      this.search = this.results[this.arrowCounter].contact_name;
      this.isOpen = false;
      this.arrowCounter = -1;
    },
    onArrowDown(evt) {
      if (this.arrowCounter < this.results.length) {
        this.arrowCounter = this.arrowCounter + 1;
      }
    },
    onArrowUp() {
      if (this.arrowCounter > 0) {
        this.arrowCounter = this.arrowCounter - 1;
      }
    },
    handleClickOutside(evt) {
      if (!this.$el.contains(evt.target)) {
        this.isOpen = false;
        this.arrowCounter = -1;
      }
    },
  },
  watch: {
    items: function (val, oldValue) {
      this.results = val;
      this.searching = false;
      this.isLoading = false;
      if (this.results.length == 0) {
        this.noresult = true;
      } else {
        this.noresult = false;
      }
    },
  },
  mounted() {
    document.addEventListener("click", this.handleClickOutside);
  },
  destroyed() {
    document.removeEventListener("click", this.handleClickOutside);
  },
};
</script>
<style>
.loadingres {
  width: 17px !important;
  height: 17px !important;
}
.autocomplete-results {
  border: 1px solid #eeeeee;
  max-height: 250px;
  overflow: auto;
  z-index: 99;
  background: #fff;
  border-radius: 5px;
  box-shadow: 0 4px 13px rgb(6 41 46 / 21%);
  position: absolute;

  width: 100%;
  z-index: 99;
}
.closeicon {
  position: absolute;
  right: 15px;
  top: 8px;
}
</style>