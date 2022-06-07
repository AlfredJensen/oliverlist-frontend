<template>
  <section>
   
    <div class="accordion" id="accordionmorethan">
          <div class="">
            <div class="" id="headingLocation">
              <h2 class="mb-0">
                <button class="btn  btn-sm btn-light collapsed" type="button" data-toggle="collapse" data-target="#collapseMore" aria-expanded="false" aria-controls="collapseMore">
                <span>{{ $t('lang.search.morethan') }}</span></button>
                <div class="dropdown-divider"></div>
              </h2>
            </div>
            <div id="collapseMore" class="collapse" aria-labelledby="collapseMore" data-parent="#accordionmorethan">
              <div class="">
              <input class="form-control" :placeholder="$t('lang.label.persons')"   type="number" v-model="default_values.employees.keywords.greater">
              </div>
            </div>
          </div>
    </div>
    <div class="accordion" id="accordionlessthan">
          <div class="">
            <div class="" id="headingLocation">
              <h2 class="mb-0">
                <button class="btn  btn-sm btn-light collapsed" type="button" data-toggle="collapse" data-target="#collapseLess" aria-expanded="false" aria-controls="collapseLess">
                <span>{{ $t('lang.search.lessthan') }}</span></button>
                <div class="dropdown-divider"></div>
              </h2>
            </div>
            <div id="collapseLess" class="collapse" aria-labelledby="collapseLess" data-parent="#accordionlessthan">
              <div class="">
              <input class="form-control" :placeholder="$t('lang.label.persons')"   type="number" v-model="default_values.employees.keywords.less">
              </div>
            </div>
          </div>
    </div>
  
</section>
</template>
<script>

import { mapState, mapActions } from "vuex";

export default {
  props: {
    option_list: Array,
    default_values: Object,
  },
  created() {
    this.default_values['employees'] = []
    this.default_values['employees']['keywords'] = []
    this.default_values['employees']['keywords']['greater'] = undefined
    this.default_values['employees']['keywords']['less'] = undefined
  }
}
</script>