<template>
  <div class="">
    <section class="">
      <div class="row"> 
        <div class="col-12 w-100 " v-if="!campaignedit">
        <div class="mb-3 px-4">
          <Tutorial
            id="teemplatemessage"
            :linkText="$t('lang.label.howitworks')"
            linkClass="small ml-2 mt-2"
            :videoUrl="'https://www.youtube.com/embed/' + $t('lang.videos.mycontacts')"
            playListurl="https://help.oliverlist.com/fr/category/mes-contacts-1g5cmua/"
          />
        </div>
        <div class="px-4 border-bottom border-grey">
        <div class="ml-0 d-inline">
          <span
            :class="!model.imported ? 'active' : ''"
            :disabled="loading"
            type="button"
            @click="done('imported')"
            class="p-0 it-tabs pb-2 bg-white"
          >
            {{ $t("lang.search.olivercontacts") }}
          </span>
        </div>

          <div class="ml-3 d-inline">
            <span
              :disabled="loading"
              :class="model.imported ? 'active border-primary' : ''"
              type="button"
              @click="done('imported')"
              class="p-0 it-tabs  pb-2 bg-white"
            >
              {{ $t("lang.search.importedcontacts") }}
            </span>
          </div>
        </div>
      </div>

      <div
        class="
          col-12
          px-4
          bg-light
          pt-3
          pb-3
        "
      >

        <div class="float-left ml-3" v-if="!model.imported">  
          <Autocomplete
            :key="autocompletekey"
            :isAsync="true"
            :items="itemswords"
            @getResults="getResultWords"
            @viewAll="viewAllWords"
            @choose="chooseItem"
            @close="done('autocomplete')"
          ></Autocomplete>
        </div>

        <div class="float-left ml-2">
          <button @click="done()" 
          :disabled="loading"
          class="btn btn-outline-primary btn-sm">
            <i class="icon-refresh"></i>
            {{$t('lang.general.refresh')}}
          </button>
        </div>




        <div class="btn-group float-right mr-3 " v-if="!campaignedit && model.imported">

          <button
            class="rounded btn ml-3 btn-sm btn-primary"
            type="button"
            data-toggle="collapse"
            data-target="#businessOne"
            aria-expanded="false"
            aria-controls="businessOne"
          >
            <i class="icon-upload"></i>
            Import csv
          </button>
        </div>

        </div>

        <div v-if="!campaignedit" class="col-md-2 pl-4 pt-0 bg-white border-right">
       

          <h6 class="text-left ml-4 pt-3 d-none d-md-block" >
            <strong class="">{{ $t("lang.search.advancedfilters") }}</strong>
          </h6>
          <div class="filterdropdown tab-content" id="nav-tabContent">
            <div
              v-if="model.imported"
              class="tab-pane fade box-search"
              id="list-custom"
              role="tabpanel"
              aria-labelledby="list-custom-list"
            >
              <PopupItem
                :key="keyCustom"
                @done="done('custom')"
                @clear="clear('custom')"
                :label="$t('lang.search.customfilters')"
                :icon="'icon-filter'"
                :type="'custom'"
                :selectedvalues="this.model"
                :options="contactsColumns"
              >
              </PopupItem>
            </div>

            <div
              class="tab-pane fade box-search"
              id="list-industry"
              role="tabpanel"
              aria-labelledby="list-industry-list"
            >
              <PopupItem
                v-if="!model.imported"
                :key="keyIndustry"
                @done="done('industry')"
                @clear="clear('industry')"
                :label="$t('lang.search.industry')"
                :icon="'icon-building'"
                :type="'industry'"
                :selectedvalues="this.model"
                :options="this.categoryGoogle"
              >
              </PopupItem>
            </div>

            <div
              class="tab-pane fade box-search"
              id="list-job"
              role="tabpanel"
              aria-labelledby="list-job-list"
            >
              <PopupItem
                :key="keyJob"
                @done="done('job')"
                :label="$t('lang.search.jobtitle')"
                :icon="'icon-people'"
                :type="'job'"
                :selectedvalues="this.model"
                :options="this.jobOptions"
              >
              </PopupItem>
            </div>

            <div
              class="tab-pane fade box-search"
              id="list-location"
              role="tabpanel"
              aria-labelledby="list-location-list"
            >
              <PopupItem
                :key="keyLocation"
                @done="done('location')"
                :label="$t('lang.search.location')"
                :icon="'icon-location'"
                :type="'location'"
                :selectedvalues="this.model"
                :options="this.locationOptions"
              >
              </PopupItem>
            </div>

            <div
              class="tab-pane fade box-search"
              id="list-word"
              role="tabpanel"
              aria-labelledby="list-word-list"
            >
              <PopupItem
                :key="keyWord"
                @done="done('word')"
                :label="$t('lang.search.keywords')"
                :icon="'icon-key'"
                :type="'word'"
                :selectedvalues="this.model"
                :options="this.wordOptions"
              >
              </PopupItem>
            </div>

            <div
              class="tab-pane fade box-search"
              id="list-employees"
              role="tabpanel"
              aria-labelledby="list-employees-list"
            >
              <PopupItem
                :key="keyEmployees"
                @done="done('employees')"
                :label="$t('lang.search.companysize')"
                :icon="'icon-people'"
                :type="'employees'"
                :selectedvalues="this.model"
                :options="employeeOptions"
              >
              </PopupItem>
            </div>

            <div
              class="tab-pane fade box-search"
              id="list-url"
              role="tabpanel"
              aria-labelledby="list-url-list"
            >
              <PopupItem
                :key="keyUrl"
                @done="done('url')"
                :label="$t('lang.search.companyurl')"
                :icon="'icon-world'"
                :type="'url'"
                :selectedvalues="this.model"
                :options="this.urlOptions"
              >
              </PopupItem>
            </div>

            <div
              class="tab-pane fade box-search"
              id="list-linkedin"
              role="tabpanel"
              aria-labelledby="list-linkedin-list"
           
            >
              <PopupItem
                v-if="!model.imported"
                :key="keyLinkedin"
                @done="done('linkedin')"
                :label="$t('lang.search.mysearchs')"
                :icon="'icon-search'"
                :type="'linkedin'"
                :selectedvalues="this.model"
                :options="this.linkedinOptions"
              >
              </PopupItem>

              <PopupItem
                v-if="model.imported"
                :key="keyLinkedin"
                @done="done('linkedin')"
                :label="$t('lang.mycontacts.myimport')"
                :icon="'icon-download'"
                :type="'linkedin'"
                :selectedvalues="this.model"
                :options="this.linkedinOptions"
              >
              </PopupItem>

            </div>

          

            <div
              class="tab-pane fade box-search"
              id="list-status"
              role="tabpanel"
              aria-labelledby="list-status-list"
            >
              <PopupItem
                :key="keyStatus"
                @done="done('status')"
                :label="$t('lang.search.contactstatus')"
                :icon="'icon-world'"
                :type="'status'"
                :selectedvalues="this.model"
                :options="this.statusOptions"
              >
              </PopupItem>
            </div>

            <div
              class="tab-pane fade box-search"
              id="list-campaignselected"
              role="tabpanel"
              aria-labelledby="list-campaignselected-list"
            >
              <PopupItem
                :key="keyCampaign"
                @done="done('campaignselected')"
                :label="$t('lang.search.campaign')"
                :icon="'icon-list'"
                :type="'campaignselected'"
                :selectedvalues="this.model"
                :options="this.campaignOptions"
              >
              </PopupItem>
            </div>
          </div>

          <button
            class="d-md-none btn btn-sm btn-primary"
          
            data-toggle="collapse"
            data-target="#listsearchnav"
            aria-controls="listsearchnav"
            aria-expanded="false"
            aria-label="Toggle navigation"
            ref="toggleMenu"
            >
            <span class="icon-more_horiz"></span>
            {{ $t("lang.search.advancedfilters") }}
          </button>

          <div class="collapse navbar-collapse" id="listsearchnav">
            <div class="list-group" id="list-tab" role="tablist">
              <ListItem
                v-if="model.imported"
                :key="listkeyCustom"
                @done="done('custom')"
                @clear="clear('custom')"
                :label="$t('lang.search.customfilters')"
                :icon="'icon-filter'"
                :type="'custom'"
                :model="model"
              ></ListItem>
              <ListItem
                v-if="!model.imported"
                :key="listkeyLinkedin"
                @done="done('linkedin')"
                @clear="clear('linkedin')"
                :label="$t('lang.search.mysearchs')"
                :icon="'icon-search'"
                :type="'linkedin'"
                :model="model"
              ></ListItem>
              <ListItem
                v-if="model.imported"
                :key="listkeyLinkedin"
                @done="done('linkedin')"
                @clear="clear('importlist')"
                :label="$t('lang.mycontacts.myimport')"
                :icon="'icon-download'"
                :type="'linkedin'"
                :model="model"
              ></ListItem>

              <ListItem
                v-if="!model.imported"
                :key="listkeyIndustry"
                @done="done('industry')"
                @clear="clear('industry')"
                :label="$t('lang.search.industry')"
                :icon="'icon-industry'"
                :type="'industry'"
                :model="model"
              ></ListItem>

              <ListItem
                :key="listkeyJob"
                @done="done('job')"
                @clear="clear('job')"
                :label="$t('lang.search.jobtitle')"
                :icon="'icon-briefcase'"
                :type="'job'"
                :model="model"
              ></ListItem>

              <ListItem
                :key="listkeyLocation"
                @done="done('location')"
                @clear="clear('location')"
                :label="$t('lang.search.location')"
                :icon="'icon-location'"
                :type="'location'"
                :model="model"
              ></ListItem>


              <ListItem
                :key="listkeyEmployees"
                @done="done('employees')"
                @clear="clear('employees')"
                :label="$t('lang.search.companysize')"
                :icon="'icon-people'"
                :type="'employees'"
                :model="model"
              ></ListItem>

              <ListItem
                :key="listkeyUrl"
                @done="done('url')"
                @clear="clear('url')"
                :label="$t('lang.search.companyurl')"
                :icon="'icon-chrome'"
                :type="'url'"
                :model="model"
              ></ListItem>

              <ListItem
                :key="listkeyCampaign"
                @done="done('campaignselected')"
                @clear="clear('campaignselected')"
                :label="$t('lang.search.campaign')"
                :icon="'icon-list'"
                :type="'campaignselected'"
                :model="model"
              ></ListItem>

              <ListItem
                :key="listkeyStatus"
                @done="done('status')"
                @clear="clear('status')"
                :label="$t('lang.search.contactstatus')"
                :icon="'icon-people'"
                :type="'status'"
                :model="model"
              ></ListItem>

              <ListItem
                :key="listkeyWord"
                @done="done('word')"
                @clear="clear('word')"
                :label="$t('lang.search.keywords')"
                :icon="'icon-key'"
                :type="'word'"
                :model="model"
              ></ListItem>

              <button
                @click="clearAllFields"
                class="btn btn-sm btn-outline-primary my-2 ml-3"
              >
                {{ $t("lang.label.clearall") }}
              </button>
            </div>
          </div>

          <div class="d-none d-md-block">
            <div class="list-group" id="list-tab" role="tablist">
              <ListItem
                v-if="model.imported"
                :key="listkeyCustom"
                @done="done('custom')"
                @clear="clear('custom')"
                :label="$t('lang.search.customfilters')"
                :icon="'icon-filter'"
                :type="'custom'"
                :model="model"
              ></ListItem>
              <ListItem
                v-if="!model.imported"
                :key="listkeyLinkedin"
                @done="done('linkedin')"
                @clear="clear('linkedin')"
                :label="$t('lang.search.mysearchs')"
                :icon="'icon-search'"
                :type="'linkedin'"
                :model="model"
              ></ListItem>
              <ListItem
                v-if="model.imported"
                :key="listkeyLinkedin"
                @done="done('linkedin')"
                @clear="clear('importlist')"
                :label="$t('lang.mycontacts.myimport')"
                :icon="'icon-download'"
                :type="'linkedin'"
                :model="model"
              ></ListItem>

              <ListItem
                v-if="!model.imported"
                :key="listkeyIndustry"
                @done="done('industry')"
                @clear="clear('industry')"
                :label="$t('lang.search.industry')"
                :icon="'icon-industry'"
                :type="'industry'"
                :model="model"
              ></ListItem>

              <ListItem
                :key="listkeyJob"
                @done="done('job')"
                @clear="clear('job')"
                :label="$t('lang.search.jobtitle')"
                :icon="'icon-briefcase'"
                :type="'job'"
                :model="model"
              ></ListItem>

              <ListItem
                :key="listkeyLocation"
                @done="done('location')"
                @clear="clear('location')"
                :label="$t('lang.search.location')"
                :icon="'icon-location'"
                :type="'location'"
                :model="model"
              ></ListItem>


              <ListItem
                :key="listkeyEmployees"
                @done="done('employees')"
                @clear="clear('employees')"
                :label="$t('lang.search.companysize')"
                :icon="'icon-people'"
                :type="'employees'"
                :model="model"
              ></ListItem>

              <ListItem
                :key="listkeyUrl"
                @done="done('url')"
                @clear="clear('url')"
                :label="$t('lang.search.companyurl')"
                :icon="'icon-chrome'"
                :type="'url'"
                :model="model"
              ></ListItem>

              <ListItem
                :key="listkeyCampaign"
                @done="done('campaignselected')"
                @clear="clear('campaignselected')"
                :label="$t('lang.search.campaign')"
                :icon="'icon-list'"
                :type="'campaignselected'"
                :model="model"
              ></ListItem>

              <ListItem
                :key="listkeyStatus"
                @done="done('status')"
                @clear="clear('status')"
                :label="$t('lang.search.contactstatus')"
                :icon="'icon-people'"
                :type="'status'"
                :model="model"
              ></ListItem>

              <ListItem
                :key="listkeyWord"
                @done="done('word')"
                @clear="clear('word')"
                :label="$t('lang.search.keywords')"
                :icon="'icon-key'"
                :type="'word'"
                :model="model"
              ></ListItem>

              <button
                @click="clearAllFields"
                class="btn btn-sm btn-outline-primary my-2 ml-3"
              >
                {{ $t("lang.label.clearall") }}
              </button>
            </div>
          </div>

        </div>

        <div
          :class="campaignedit ? 'col-md-12' : 'col-md-10 pl-0'"
          class="pt-2 "
        >
          <div class="mb-3 pl-4  border-bottom border-grey" v-if="!campaignedit">
            <div class="ml-0 d-inline">
              <span
                :class="model.all ? 'active' : ''"
                type="button"
                @click="done('all')"
                class="p-0 it-tabs pb-2 bg-white"
              >
                {{ $t("lang.button.all") }}
              </span>
            </div>

            <div class="ml-3 d-inline">
              <span
                :class="model.new ? 'active border-primary' : ''"
                type="button"
                @click="done('new')"
                class="p-0 it-tabs pb-2 bg-white"
              >
                {{ $t("lang.search.new") }}
              </span>
            </div>

            <div class="ml-3 d-inline" v-if="!model.imported">
              <span
                :class="model.buy ? 'active border-primary' : ''"
                type="button"
                @click="done('buy')"
                class="p-0 it-tabs pb-2 bg-white"
              >
                {{ $t("lang.label.contactsalreadypurchased") }}
              </span>
            </div>
          </div>

          <div
            class="row p-4"
            v-if="!model.imported && !resultlist.contacts && campaignedit"
          >
            <div class="text-center col-md-12">
              <img
                src="@/assets/images/Logo-oliver-400.png"
                class="rounded mx-auto d-block"
                width="150px"
              />
              <h2 v-if="model.status !== undefined && model.status.notbuy">{{ $t("lang.label.nocontactsavailableinthiscampaign") }}</h2>
              <h2 v-else>{{ $t("lang.label.useolivercontactdatabase") }}</h2>

              <div class="py-4 text-center">
                <div>{{ $t("lang.ondemand.nosearchs") }}</div>
              </div>

              <div class="top-area-opp mb-5">
                <button
                  @click="$router.push('/businesses')"
                  id="template"
                  class="btn btn-primary btn-sm text-white"
                >
                  {{ $t("lang.label.addcontacts") }}
                </button>

                <span class="ml-2">
                  <Tutorial
                    id="addcontacts"
                    linkClass="small ml-2 mt-2"
                    :videoUrl="'https://www.youtube.com/embed/' +  $t('lang.videos.target')"
                    v-if="model.status !== undefined && model.status.notbuy"
                  />
                </span>
              </div>
            </div>
          </div>

          <div
            class="row p-4"
            v-if="model.imported && !resultlist.contacts && campaignedit"
          >
            <div class="text-center col-md-12">
              <img
                src="@/assets/images/undraw_personal_email_t7nw.png"
                class="rounded mx-auto d-block"
                width="150px"
              />
              <h2>{{ $t("lang.label.useyourimportedcontacts") }}</h2>
              <div class="py-4 text-center">
                <div>{{ $t("lang.label.thankstoimportedcontacts") }}</div>
              </div>
              <div class="top-area-opp mb-5">
                <button
                  @click="$router.push('/businesses/imported')"
                  id="template"
                  class="btn btn-primary btn-sm text-white"
                >
                  {{ $t("lang.label.contacts") }}
                </button>
              </div>
            </div>
          </div>

          <div
            v-if="!resultlist.contacts && !anyEdited() && !campaignedit"
            class="row mt-2 ml-2"
          >
            <div class="text-center w-100 mt-4">
              <h4 class="font-weight-light" v-if="currentUser.id >= 1681">
                {{ $t("lang.ondemand.nosearchs") }}
              </h4>
              <h4 class="font-weight-light" v-if="availableSearch()">
                {{ $t("lang.label.addafilter") }}
              </h4>
            </div>
            <div class="text-center w-100 my-4">
              <img
                src="@/assets/images/search-oliver3.png"
                class="rounded mx-auto d-block"
                width="200px"
              />
            </div>
            <div class="m-auto d-inline">
              <router-link
                class="btn btn-outline-primary btn-sm"
                to="/mysearchs"
              >
                <i class="icon-search"></i>
                {{ $t("lang.label.addcontacts") }}
              </router-link>
            </div>
          </div>

          <div
            v-if="
              !campaignedit &&
              !resultlist.contacts &&
              anyEdited() &&
              model.currentPage == 1
            "
            class="row mt-2 ml-2"
          >
            <div class="text-center w-100 mt-4">
              <div class="alert alert-warning" role="alert">
                {{ $t("lang.label.noresults") }}
              </div>
            </div>
            <div class="text-center w-100 mt-4">
              <img
                src="@/assets/images/search-oliver3.png"
                class="rounded mx-auto d-block"
                width="200px"
              />
            </div>
          </div>

          <SearchResult
            v-if="resultlist.contacts"
            :key="keyresult"
            @changePage="changePage"
            @reload="search"
            :list="resultlist"
            :total.sync="total"
            :model="this.model"
            :loading="loading"
          >
          </SearchResult>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
import Vue from "vue";
import { captainDataService, onDemandService } from "@/_services";

import Autocomplete from "@/components/AccountCreation/Steps/Campaign/search/Autocomplete.vue";
import PopupItem from "@/components/AccountCreation/Steps/Campaign/search/Popup-item.vue";
import Ondemand from "@/components/AccountCreation/Steps/Campaign/search/Ondemand.vue";

import SearchResult from "@/components/AccountCreation/Steps/Campaign/search/SearchResult.vue";
import ListItem from "@/components/AccountCreation/Steps/Campaign/search/list-item.vue";
import Tutorial from "@/components/Tutorial.vue";

import { businessContactsService, campaignsService } from "@/_services";
import { mapState } from "vuex";

export default {
  components: {
    PopupItem,
    SearchResult,
    Autocomplete,
    ListItem,
    Tutorial,
    Ondemand,
  },
  created() {

  if(this.model.cantPerPage == undefined){
    this.model.currentPage = 1;
    this.model.cantPerPage = 25;
  }

    this.ondemand = new Vue({
      ...Ondemand,
      parent: this,
      propsData: { model: this.model },
    }).$mount();

    this.model.all = true;

    businessContactsService.getCustomFields().then((response) => {
      if (response) {
        response.forEach((item, key) => {
          this.contactsColumns.push({
            name: item.label,
            name_: item.label,
            type: item.type,
            field: "custom_field_" + item.id,
          });
          this.keyCustom++;
        });
      }
    });

 
      captainDataService.getSearchList().then((response) => {
        if (response) {
          this.linkedinOptions.linkedin = [];
          response.result.forEach((item, key) => {
            this.linkedinOptions.linkedin.push({
              label: item.name,
              id: item.id,
            });
            this.keyLinkedin++;
          }); 
        }
      }).catch((err) => {
           
        });
    

      businessContactsService.getImportList().then((response) => {
        if (response) {
          this.linkedinOptions.importlist = [];
          response.forEach((item, key) => {
            this.linkedinOptions.importlist.push({
              label: item.name,
              id: item.id,
            });
            this.keyLinkedin++;
          });
        }
      });
    

      onDemandService.getHistoyList().then((response) => {
        if (response) {
          this.linkedinOptions.ondemand = [];
          response.result.forEach((item, key) => {
            this.linkedinOptions.ondemand.push({
              label: item.name,
              id: item.id,
            });

            this.keyLinkedin++;
          });
        }
      });
    

    if (
      this.model.campaign !== undefined &&
      this.model.campaign.id !== undefined
    ) {
      this.campaignedit = true;

      if (this.campaignedit) {
        this.model.contacts_all = undefined;
      }
    }

       if (
      this.$route.params.id !== undefined &&
      this.$route.params.id.indexOf("OD") != -1 &&
      !this.campaignedit
    ) {
      this.model["ondemandedited"] = true;
      this.model["linkedinedited"] = true;
      if(this.model.ondemand == undefined){
        this.model.ondemand =[]
      }

        this.model.ondemand.push(this.$route.params.id.replace("OD-", ""));
    }



    if (
      this.$route.params.id !== undefined &&
      this.$route.params.id.indexOf("OD") == -1 &&
      !this.campaignedit
    ) {
      this.model.linkedin = [];
      this.model["linkedinedited"] = true;
      this.model.linkedin.push(this.$route.params.id);
    }

    this.search();
    

    
    this.model.currentPage = 1;
    this.model.cantPerPage = 25;
    this.jobOptions["function"] = this.hierarchyoptionsSearchFunction;
    this.jobOptions["level"] = this.hierarchyoptionsSearchLevel;
    this.locationOptions["regions"] = this.hierarchyoptions;
    this.locationOptions["country"] = this.hierarchyoptionsCountry;
    this.categoryGoogle["hierarchy"] = this.hierarchyoptionsGoogle;
    this.categoryGoogle["list"] = this.hierarchyoptionsGoogleAll;

    this.employeeOptions = this.companySizeOptions;

    if (this.$route.fullPath == "/businesses/imported") {
      this.model.imported = false;
      this.done("imported");
    }

    if (this.model.mycampaigns === undefined) {
      campaignsService.getAllByClientId().then((response) => {
        if (response) {
          this.campaignOptions = response;
          this.model.mycampaigns = response;
          this.keyCampaign++;
        }
      });
    }
  },
  props: {
    model: Object,
  },
  data() {
    return {
      total: 0,
      promiseSearch: false,
      promiseTotal: false,
      ondemand: false,
      importlist:false,
      campaignedit: false,
      jobOptions: [],
      locationOptions: [],
      linkedinOptions: [],
      employeeOptions: [],
      categoryGoogle: [],
      urlOptions: [],
      campaignOptions: [],
      wordOptions: [],
      statusOptions: [],
      keyIndustry: 1000,
      keyJob: 2000,
      keyLocation: 3000,
      keyEmployees: 4000,
      keyCampaign: 5000,
      keyUrl: 6000,
      keyStatus: 9000,
      keyLinkedin: 19000,
      keyCustom: 10000,
      keyWord: 91000,
      listkeyIndustry: 1100,
      listkeyJob: 2100,
      listkeyLocation: 3100,
      listkeyLinkedin: 12100,
      listkeyEmployees: 4100,
      listkeyCampaign: 5100,
      listkeyUrl: 6100,
      listkeyStatus: 7100,
      listkeyCustom: 8100,
      listkeyWord: 9100,
      resultlist: {},
      keyresult: 8000,
      loading: false,
      itemswords: {},
      autocomplete: [],
      autocompletekey: 0,
      contactsColumns: [
        {
          name: this.$t("lang.label.name"),
          name_: "name",
          type: "string",
          field: "business_contact.name",
        },
        {
          name: this.$t("lang.label.email"),
          name_: "email",
          type: "string",
          field: "business_contact.email",
        },
        {
          name: this.$t("lang.label.companyname"),
          name_: "company",
          type: "string",
          field: "business.name",
        },
        {
          name: this.$t("lang.label.city"),
          name_: "city",
          type: "string",
          field: "business.city",
        },
        {
          name: this.$t("lang.label.country"),
          name_: "country",
          type: "string",
          field: "business.country",
        },
      ],
    };
  },
  methods: {

    availableSearch(){
     
        return true
    
    },

    search() {


      if(
      this.availableSearch() 
      && !this.anyEdited() 
      && !this.campaignedit
      && !this.model.buy
      && !this.model.new){
        this.loading = false
        this.resultlist.contacts = undefined;
        this.keyresult++;
        return; 
      }

      this.model.currentPage = 1;

      
      this.total = 0;
      this.loading = true;

      this.resultlist.contacts = true;
      this.resultlist.total = 0;

  


      businessContactsService.search(this.model).then((response) => {
        this.resultlist.contacts = response;
        if (this.campaignedit) {
          this.$forceUpdate();
        }
        this.loading = false;
        this.$emit("finishLoading")
        this.keyresult++;
      });


      businessContactsService.total(this.model).then((response) => {
        if(response !== undefined){
          this.total = parseInt(response.total);
        }
      });
      
    },
    chooseItem(results) {
      this.model.business_contacts = [];
      this.model.business_id = [];
      this.model.business_all = undefined;
      this.model.contacts_all = undefined;
      if (results.logo === undefined) {
        this.model.business_contacts.push(results.id);
        this.search();
      }
      if (results.logo !== undefined) {
        this.model.business_id.push(results.id);
        this.search();
      }
    },
    getResultWords(text) {
      businessContactsService.searchAutocomplete(text).then((result) => {
        this.itemswords = result;
      });
    },
    viewAllWords(text, type) {
      this.model.business_contacts = [];
      this.model.business_id = [];
      this.model.business_all = undefined;
      this.model.contacts_all = undefined;
      if (type == "business") {
        this.model.business_all = text;
      }
      if (type == "contacts") {
        this.model.contacts_all = text;
      }
      this.search();
    },
    changePage() {
      this.loading = true;
      businessContactsService.search(this.model).then((response) => {
        this.resultlist.contacts = response;
        this.loading = false;
        this.keyresult++;
      });
    },
    refreshSelected() {
      this.resultlist.selectedIds = [];
      this.resultlist.allselected = false;
      this.resultlist.allpageselected == false;
      this.model.currentPage = 1;
    },
    refresListItems(type) {
      switch (type) {
        case "industry":
          this.listkeyIndustry++;
          break;
        case "job":
          this.listkeyJob++;
          break;
        case "location":
          this.listkeyLocation++;
          break;
        case "linkedin":
          this.listkeyLinkedin++;
          break;
        case "importlist":
          this.listkeyLinkedin++;
          break;
        case "employees":
          this.listkeyEmployees++;
          break;
        case "campaignselected":
          this.listkeyCampaign++;
          break;
        case "url":
          this.listkeyUrl++;
          break;
        case "status":
          this.listkeyStatus++;
          break;
        case "custom":
          this.listkeyCustom++;
          break;
        case "word":
          this.listkeyWord++;
          break;
      }
    },
    clearAll() {
      this.clearField("industry");
      this.clearField("job");
      this.clearField("location");
      this.clearField("employees");
      this.clearField("linkedin");
      this.clearField("ondemand");
      this.clearField("importlist");
      this.clearField("campaignselected");
      this.clearField("url");
      this.clearField("status");
      this.clearField("word");
    },
    clearAllFields() {
      this.clearAll();
      this.search();
    },
    anyEdited() {
      if (
        this.model["industryedited"] == true ||
        this.model["linkedinedited"] == true ||
        this.model["ondemandedited"] == true ||
        this.model["importlistedited"] == true ||
        this.model["jobedited"] == true ||
        this.model["locationedited"] == true ||
        this.model["campaignselectededited"] == true ||
        this.model["urledited"] == true ||
        this.model["customedited"] == true ||
        this.model["statusedited"] == true ||
        this.model["employeesedited"] == true ||
        this.model["wordedited"] == true ||
        this.model.imported == true
      ) {
        return true;
      }

      if (
        this.model.business_contacts !== undefined &&
        this.model.business_contacts.length > 0
      ) {
        return true;
      }
      if (
        this.model.business_id !== undefined &&
        this.model.business_id.length > 0
      ) {
        return true;
      }
      if (
        this.model.business_all !== undefined &&
        this.model.business_all.length > 0
      ) {
        return true;
      }
      if (
        this.model.contacts_all !== undefined &&
        this.model.contacts_all.length > 0
      ) {
        return true;
      }
    },
    clearField(type) {
      delete this.model[type];
      this.model[type + "edited"] = false;
      switch (type) {
        case "industry":
          this.keyIndustry++;
          break;
        case "linkedin":
          this.keyLinkedin++;
          break;
        case "job":
          this.keyJob++;
          break;
        case "location":
          this.keyLocation++;
          break;
        case "employees":
          this.keyEmployees++;
          break;
        case "campaignselected":
          this.keyCampaign++;
          break;
        case "url":
          this.keyUrl++;
          break;
        case "status":
          this.keyStatus++;
          break;
        case "custom":
          this.keyCustom++;
          break;
        case "word":
          this.keyWord++;
          break;
      }
      this.refresListItems(type);
    },
    openPopup() {
      this.$swal({
        title: this.$t("lang.mycontacts.videotutorial"),
        html: '<iframe class="w-100"  height="400" src="https://player.vimeo.com/video/527271686" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>',
        width: "800px",
        showCancelButton: true,
        showConfirmButton: false,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33a2c",
        cancelButtonText: this.$t("lang.button.cancel"),
      });
    },

    openOnDemand() {
      this.openpopup = this.$swal({
        title: this.$t("lang.lookingfor.label"),
        html: this.ondemand.$el,
        width: "800px",
        showCancelButton: false,
        showConfirmButton: false,
        showCloseButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33a2c",
        showCancelButton: true,
        cancelButtonText: this.$t("lang.button.close"),
      });
    },
    done(type) {
      this.loading = true;
      if (this.model[type + "edited-prev"] == undefined)
        this.model[type + "edited-prev"] = false;

      if (
        type != "all" &&
        type != "new" &&
        type != "buy" &&
        type != "imported" &&
        type != "autocomplete" &&
        !this.model[type + "edited"] &&
        this.model[type + "edited"] == this.model[type + "edited-prev"]
      ) {
        this.clearField(type);
        return;
      }

      if (type == "imported") {
        this.clearAll();
        this.model.imported = !this.model.imported;
        this.model.all = true;
        this.model.buy = false;
        this.model.new = false;
      }

      if (type == "linkedin") {
        this.model.all = true;
        this.model.buy = false;
        this.model.new = false;
      }
      if (type == "ondemand") {
        this.model.imported = false;
        this.model.all = true;
        this.model.buy = false;
        this.model.new = false;
      }

      this.refreshSelected();
      this.autocompletekey++;
      this.model.currentPage = 1;
      this.model.business_contacts = [];
      this.model.business_id = [];
      this.model.business_all = [];
      this.model.contacts_all = [];

      if (type == "all" && !this.model.imported) {
        this.model.all = true;
      }

      if (type == "buy") {
        this.model.status = new Array();
        this.model.status.buy = true;
        this.model[type + "edited"] = true;
        this.model.all = false;
        this.model.buy = true;
        this.model.new = false;
      }

      if (type == "new") {
        this.model.status = new Array();
        this.model.status.newcontacts = true;
        this.model.all = false;
        this.model[type + "edited"] = true;
        this.model.buy = false;
        this.model.new = true;
      }

      if (type == "all") {
        this.model.status = new Array();
        this.model.status.newcontacts = false;
        this.model[type + "edited"] = true;
        this.model.new = false;
        this.model.status = new Array();
        this.model.status.buy = false;
        this.model.buy = false;
        this.model.all = true;
      }

      this.search();
      this.refresListItems(type);
    },
    clear(type) {
      this.model.business_contacts = [];
      this.model.business_id = [];
      this.model.business_all = [];
      this.model.contacts_all = [];
      this.refreshSelected();
      this.clearField(type);
      this.search();
    },
  },
  computed: {
    ...mapState({
      loadingOptionsList: (state) => !state.optionsList.completeLoading,
      hierarchyoptions: (state) => state.optionsList.all["regions"].data,
      hierarchyoptionsCountry: (state) =>
        state.optionsList.all["countries"].data,
      hierarchyoptionsSearch: (state) =>
        state.optionsList.all["categories_search_words"].data,
      hierarchyoptionsSearchFunction: (state) =>
        state.optionsList.all["categories_search_function"].data,
      hierarchyoptionsSearchLevel: (state) =>
        state.optionsList.all["categories_search_level"].data,
      hierarchyoptionsGoogle: (state) =>
        state.optionsList.all["categories_google"].data,
      hierarchyoptionsGoogleAll: (state) =>
        state.optionsList.all["categories_google_all"].data,
      companySizeOptions: (state) => state.optionsList.all["param_5"].data,
      companyTypeOptions: (state) => state.optionsList.all["param_10"].data,
      parametersTF: (state) => state.optionsList.all["parameters_tf"].data,
      currentUser: state => state.authentication.user,
    }),
  },
};
</script>
<style>
.filterdropdown {
  position: absolute;
  left: 0;
  top: 105px;
  width: auto;
  z-index: 9;
  margin-left: 100%;
}
.box-search {
  width: 350px;
}
#list-industry .filterdropdown {
  width: 350px;
}
.filterdropdown .show {
}
.swal2-container {
  z-index: inherit !important;
}

.boxsearch {
  height: 369px;
  overflow-y: scroll;
}
.absoluteflex {
  position: absolute !important;
  height: 100% !important;
  width: 100% !important;
}
</style>