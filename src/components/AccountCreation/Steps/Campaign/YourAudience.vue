<template>
    <section class="second-step-company" v-show="this.activeStep == 2">
      <div class="">
        <div class="">
          <div class=" bg-light pt-3 px-4 border-bottom border-grey">
            <div class="ml-0 d-inline">
              <span
                :class="
                  model.status !== undefined && model.status.all
                    ? 'active border-bottom-3 border-primary'
                    : ''
                "
                type="button"
                @click="all()"
                class="p-0 it-tabs pb-2 bg-transparent"
              >
                <i class="icon-circle"></i>
                {{ $t("lang.label.all") }}
              </span>
            </div>
            <div class="ml-3 d-inline">
              <span
                :class="
                  model.status !== undefined && model.status.notbuy
                    ? 'active border-bottom-3 border-primary'
                    : ''
                "
                type="button"
                @click="waiting()"
                class="p-0 it-tabs pb-2 bg-transparent"
              >
                <i class="icon-clock"></i>
                {{ $t("lang.campaigns_dashboard.available") }}
              </span>
            </div>
            <div class="ml-3 d-inline">
              <span
                :class="
                  model.status !== undefined && model.status.engaged
                    ? 'active border-bottom-3 border-primary'
                    : ''
                "
                type="button"
                @click="engaged()"
                class="p-0 it-tabs pb-2 bg-transparent"
              >
                <i class="icon-email"></i>
                {{ $t("lang.campaigns_dashboard.actives") }}
              </span>
            </div>
            <div class="ml-3 d-inline">
              <span
                :class="
                  model.status !== undefined && model.status.notengaged
                    ? 'active border-bottom-3 border-primary'
                    : ''
                "
                type="button"
                @click="notengaged()"
                class="p-0 it-tabs pb-2 bg-transparent"
              >
                <i class="icon-unlink"></i>
                {{ $t("lang.campaigns_dashboard.inactives") }}
              </span>
            </div>

            <div class="ml-3 d-inline">
              <span
                :class="
                  model.status !== undefined && model.status.excluded
                    ? 'active border-bottom-3 border-primary'
                    : ''
                "
                type="button"
                @click="excluded()"
                class="p-0 it-tabs pb-2 bg-transparent"
              >
                <i class="icon-close"></i>
                {{ $t("lang.campaigns_dashboard.outofcampaign") }}
              </span>
            </div>


          </div>
          <span class="pt-3 pb-1 pl-4 bg-light w-100" >
            <Tutorial
              id="billing"
              :linkText="$t('lang.label.howitworks')"
              linkClass="small"
              :videoUrl="'https://www.youtube.com/embed/' + $t('lang.videos.target')"
            />
          </span>
          <div class="">
          <SearchForm 
          :key="searchkey" 
          :model="model" 
          :status="model.status"
          @finishLoading="finishLoading">
          </SearchForm>
          </div>
        </div>
      </div>
    </section>
</template>
<script>
import SearchForm from "@/components/AccountCreation/Steps/Campaign/search/SearchForm.vue";
import Tutorial from "@/components/Tutorial.vue";


export default {
  data() {
    return {
      searchkey: 0,
      loading: false,
    };
  },
  components: {
    SearchForm,
    Tutorial
  },

  created() {
    this.model.campaignselected = [];
    this.model.campaignselected.select = [];
    this.model.campaignselected.select.push(this.model.campaign.id);
    this.model.status = [];
    this.model.status.all = true;
    if (
      this.model.parameters_tf == undefined ||
      this.model.parameters_tf.indexOf("12") == -1
    ) {
      this.model.imported = false;
    } else {
      this.model.imported = true;
    }
    this.searchkey++;
  },
  methods: {
    finishLoading(){
      this.loading=false
    },
    engaged() {
      this.loading=true
      this.model.currentPage = 1;
      this.model.status = [];
      this.model.status.engaged = true;
      this.searchkey++;
    },
    notengaged() {
      this.loading=true
      this.model.currentPage = 1;
      this.model.status = [];
      this.model.status.notengaged = true;
      this.searchkey++;
    },
    waiting() {
      this.loading=true
      this.model.currentPage = 1;
      this.model.status = [];
      this.model.status.notbuy = true;
      this.searchkey++;
    },
    excluded() {
      this.loading=true
      this.model.currentPage = 1;
      this.model.status = [];
      this.model.status.excluded = true;
      this.searchkey++;
    },
    all() {
      this.loading=true
      this.model.status = [];
      this.model.status.all = true;
      this.searchkey++;
    },
  },

  props: {
    model: Object,
    activeStep: Number,
  },
};
</script>
