<template>
  <main>
    <!-- <h6 class="mt-4">{{ $t("lang.label.target") }}</h6> -->
    <div class="row">
      <div
        class="col-sm-6"
        v-for="(target, index) in targets"
        :key="index"
      >
        <div class="card p-4 mt-4">
          <h5 class="">{{ target.name }}</h5>

          <h6 class="mt-4">{{ $t("lang.label.industry") }}</h6>
          <IndustrySearch
            :option_list="hierarchyoptionsGoogleAll"
            :default_values="target.data.categories_industry"
            :isDisabled="true"
          >
          </IndustrySearch>

          <h6 class="mt-4">{{ $t("lang.label.jobtitle") }}</h6>
          <p class="p-2">
            <b>{{ $t("lang.search.isanyof") }}: </b>
            <span
              v-for="(tag, ti) in target.data.categories_jobs.anyof"
              :key="ti"
            >
              {{ tag.word }},
            </span>
          </p>
          <p class="p-2">
            <b>{{ $t("lang.search.isnotanyof") }}: </b>
            <span
              v-for="(tag, ti) in target.data.categories_jobs.notanyof"
              :key="ti"
            >
              {{ tag.word }},
            </span>
          </p>

          <h6 class="mt-4">{{ $t("lang.label.companysize") }}</h6>
          <div
            v-if="
              target.data.employees != undefined &&
              target.data.employees.keywords != undefined
            "
          >
            <span v-if="target.data.employees.keywords.greater != undefined">
              {{ $t("lang.label.morethan") }} :
              {{ target.data.employees.keywords.greater }}</span
            >
            |
            <span
              v-if="
                target.data.employees != undefined &&
                target.data.employees.keywords.less != undefined
              "
            >
              {{ $t("lang.label.lessthan") }} :
              {{ target.data.employees.keywords.less }}</span
            >
          </div>

          <h6 class="mt-4">{{ $t("lang.label.location") }}</h6>
          <IndustrySearch
            :option_list="hierarchyoptions"
            :default_values="target.data.region"
            :isDisabled="true"
          >
          </IndustrySearch>

          <h6 class="mt-4">{{ $t("lang.label.hierarchicallevel") }}</h6>
          <IndustrySearch
            :option_list="hierarchyoptionsSearchLevel"
            :default_values="target.data.categories_level"
            :isDisabled="true"
          >
          </IndustrySearch>

          <h6 class="mt-4">{{ $t("lang.label.sector") }}</h6>
          <IndustrySearch
            :option_list="hierarchyoptionsSearchFunction"
            :default_values="target.data.categories_function"
            :isDisabled="true"
          >
          </IndustrySearch>

          <h6 class="mt-4">{{ $t("lang.label.country") }}</h6>
          <IndustrySearch
            :option_list="hierarchyoptionsCountry"
            :default_values="target.data.countries"
            :isDisabled="true"
          >
          </IndustrySearch>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import { mapState, mapActions } from "vuex";
import IndustrySearch from "@/components/AccountCreation/Steps/Campaign/search/IndustrySearch.vue";

export default {
  props: {
    targets: Array,
  },
  data() {
    return {};
  },
  components: {IndustrySearch},
  computed: {
    ...mapState({
      currentUser: (state) => state.authentication.user,
      loadingOptionsList: (state) => !state.optionsList.completeLoading,
      hierarchyoptions: (state) => state.optionsList.all["regions"].data,
      hierarchyoptionsSearch: (state) =>
        state.optionsList.all["categories_search_words"].data,
      hierarchyoptionsSearchFunction: (state) =>
        state.optionsList.all["categories_search_function"].data,
      hierarchyoptionsSearchLevel: (state) =>
        state.optionsList.all["categories_search_level"].data,
      hierarchyoptionsGoogle: (state) =>
        state.optionsList.all["categories_google"].data,
      companySizeOptions: (state) => state.optionsList.all["param_5"].data,
      hierarchyoptionsGoogleAll: (state) =>
        state.optionsList.all["categories_google_all"].data,
      hierarchyoptionsCountry: (state) =>
        state.optionsList.all["countries"].data,
    }),
  },
  created() {
    this.getAllOptionsList();
  },
  methods: {
    ...mapActions("optionsList", {
      getAllOptionsList: "getAll",
    }),
  },
  watch: {},
};
</script>