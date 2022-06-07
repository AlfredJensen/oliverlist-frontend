<template>
  <section class="websites-analysis">
    <main class="main" :class="{ 'expand-main' : isMenuCollapse }" >
      <div class="contentCenter all">
        <LoadingSpinner v-if="loading" />
        <section class="info pt-4" v-if="!loading"></section>
        <section class="opportunitiesList" v-if="!loading">
          <div class="contenedor animated fadeIn fast">
            <div class="wrappList">
              <div class="row row-fixed">
                <div class="col-3 text-left mt-2">
                  <span class="font-weight-bold text-uppercase">{{ totalWebsites }} WEBSITES LEFT</span>
                </div>
                <div class="col-9 text-right mt-2">
                  <button
                    class="btn btn-primary reanalyze-button text-uppercase"
                    :disabled="isEmptySelectedWebsites"
                    @click="reanalyzeWebsites()"
                  >
                    <span class="icon-wrench mr-2"></span>Reanalyze
                  </button>
                  <button
                    class="btn btn-danger text-uppercase ml-2"
                    :disabled="isEmptySelectedWebsites"
                    @click="deleteWebsites()"
                  >
                    <span class="icon-trash-o mr-2"></span>Delete
                  </button>
                  <button
                    class="btn btn-primary text-uppercase themed-button ml-2"
                    :disabled="isEmptySelectedWebsites"
                    @click="saveWebsites()"
                  >
                    <span class="icon-save mr-2"></span>Save
                  </button>
                </div>
              </div>
              <div class="table-responsive table-fixed-container mt-3 mb-3">
                <table class="table table-hover table-fixed">
                  <thead class="header-fixed">
                    <tr>
                      <th scope="col">
                        <div class="form-group form-check">
                          <input
                            type="checkbox"
                            class="form-check-input"
                            :value="allWebsitesSelected"
                            :checked="allWebsitesSelected"
                            @click="selectAllWebsites()"
                          />
                        </div>
                      </th>
                      <th scope="col">ID</th>
                      <th scope="col">Screenshot</th>
                      <th scope="col">Analysis</th>
                      <th scope="col">Name</th>
                      <th scope="col">Domain</th>
                      <th scope="col">Address</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(website, key) in websites" :key="key" :class="rowClass(website)">
                      <th scope="row" @click="selectWebsite(website)">
                        <div class="form-group form-check">
                          <input
                            type="checkbox"
                            class="form-check-input"
                            :value="website"
                            v-model="selectedWebsites"
                          />
                        </div>
                      </th>
                      <td @click="selectWebsite(website)">{{ website.id }}</td>
                      <td>
                        <a :href="'//' + buildUrl(website.business_domain)" target="_blank">
                          <img :src="getDomainScreenshot(website.business_domain)" />
                        </a>
                      </td>
                      <td>
                        <LoadingSpinner v-if="website.analyzing" />
                        <div class="row website-analysis-column" v-else>
                          <div class="col-12 mb-2">
                            <span class="d-block font-weight-bold pb-2">Logo</span>
                            <span
                              v-html="business.logo"
                              v-if="isSvgLogo(website.logo)"
                              class="website-logo"
                            ></span>
                            <img
                              class="d-block imgmain website-logo"
                              :src="logoUrl(website.logo)"
                              v-else
                            />
                          </div>
                          <div class="col-6">
                            <span class="d-block font-weight-bold">Primary color</span>
                            <input
                              class="d-block input-colors"
                              type="color"
                              v-model="website.primary_color"
                            />
                            <input type="text" class="d-block" v-model="website.primary_color" />
                          </div>
                          <div class="col-6">
                            <span class="d-block font-weight-bold">Secondary color</span>
                            <input
                              class="d-block input-colors"
                              type="color"
                              v-model="website.secondary_color"
                            />
                            <input type="text" class="d-block" v-model="website.secondary_color" />
                          </div>
                          <div class="col-12 mt-2">
                            <span class="d-block font-weight-bold pb-2">Header white</span>
                            <toggle-button
                              :value="isHeaderWhite(website)"
                              @change="toogleHeaderWhite(website)"
                              :labels="{checked: 'Yes', unchecked: 'No'}"
                              :sync="true"
                            />
                          </div>
                          <div class="col-12 mt-2" v-if="website.analyzed == true">
                            <span class="d-block font-weight-bold pb-2">Alternatives logos</span>
                            <div class="alternatives-logos">
                              <div
                                class="d-inline pr-3"
                                v-for="(alt_logo, key) in website.alternative_logos"
                                :key="key"
                              >
                                <img
                                  class="website-logo"
                                  :src="alt_logo"
                                  @click="changeLogo(website, alt_logo)"
                                />
                              </div>
                            </div>
                          </div>
                          <div class="col-12 mt-2">
                            <span class="d-block font-weight-bold pb-2">Upload logo</span>
                            <div class="custom-file">
                              <input
                                type="file"
                                class="custom-file-input"
                                id="customFile"
                                @change="onLogoInputChange($event, website)"
                              />
                              <label class="custom-file-label" for="customFile">Choose file</label>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>{{ website.business_name | capitalize }}</td>
                      <td>
                        <a
                          :href="'//' + buildUrl(website.business_domain)"
                          target="_blank"
                        >{{ buildUrl(website.business_domain) }}</a>
                      </td>
                      <td>{{ website.business_address | capitalize }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div class="table-footer row mb-2 mt-5">
                <div class="col-9">
                  <button
                    type="button"
                    class="btn btn-primary themed-button"
                    :disabled="isFirstPage"
                    @click="currentPage --"
                  >
                    <span class="icon-angle-double-left mr-2" />{{ $t('lang.button.previous') }}
                  </button>
                  <button
                    type="button"
                    class="btn btn-primary themed-button ml-2"
                    :disabled="isLastPage"
                    @click="currentPage ++"
                  >
                    {{ $t('lang.button.next') }}
                    <span class="icon-angle-double-right ml-2" />
                  </button>
                </div>
                <div class="col-3 dropdown text-right">
                  <button
                    type="button"
                    class="btn btn-secondary dropdown-toggle themed-button"
                    id="dropdownCantPerPage"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                    data-offset="10,20"
                  >
                    <span>{{ cantPerPage }} per page</span>
                  </button>
                  <div class="dropdown-menu" aria-labelledby="dropdownCantPerPage">
                    <a
                      class="dropdown-item cursor-pointer"
                      v-for="(optionCant, index) in cantPerPageOptions"
                      :key="index"
                      @click="cantPerPage = optionCant"
                    >{{ optionCant }} per page</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  </section>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { websitesService, toolsService } from "@/_services";
import { urlMixin, logoMixin } from "@/_mixins";
import LoadingSpinner from "@/components/LoadingSpinner.vue";

export default {
  data() {
    return {
      selectedWebsites: [],
      currentPage: 1,
      cantPerPage: 5,
      cantPerPageOptions: [5, 10, 20, 50, 100]
    };
  },

  mixins: [urlMixin, logoMixin],

  components: {
    LoadingSpinner
  },

  watch: {
    currentPage() {
      this.getAllWebsites({
        currentPage: this.currentPage,
        cantPerPage: this.cantPerPage
      });
    },

    cantPerPage() {
      this.getAllWebsites({
        currentPage: this.currentPage,
        cantPerPage: this.cantPerPage
      });
    }
  },

  computed: {
    ...mapState({
      loading: state => state.websites.loading,
       isMenuCollapse: state => state.sidebar.isNavOpen,
      websites: state => state.websites.all.data.list,
      totalWebsites: state => state.websites.all.data.total
    }),

    isEmptySelectedWebsites() {
      return this.selectedWebsites.length === 0;
    },

    isFirstPage() {
      return this.currentPage === 1;
    },

    isLastPage() {
      return this.currentPage === this.pageCount;
    },

    allWebsitesSelected() {
      return this.selectedWebsites.length === this.websites.length;
    }
  },

  created() {
    this.getAllWebsites({
      currentPage: this.currentPage,
      cantPerPage: this.cantPerPage
    });
  },

  methods: {
    ...mapActions("websites", {
      getAllWebsites: "getAll"
    }),

    ...mapActions("header", {
      changeHeaderTab: "changeTab"
    }),

    getDomainScreenshot(domain) {
      return `https://s0.wordpress.com/mshots/v1/${domain}?w=300&amp;h=250`;
    },

    resetSelectedWebsites() {
      this.selectedWebsites = [];
    },

    isHeaderWhite(website) {
      return website.headerwhite === "1";
    },

    toogleHeaderWhite(website) {
      website.headerwhite = website.headerwhite === "1" ? "0" : "1";
    },

    saveWebsites() {
      websitesService.updateSelected(this.selectedWebsites).then(result => {
        this.resetSelectedWebsites();
        this.getAllWebsites({
          currentPage: this.currentPage,
          cantPerPage: this.cantPerPage
        });
      });
    },

    deleteWebsites() {
      websitesService.deleteSelected(this.selectedWebsites).then(result => {
        this.resetSelectedWebsites();
        this.getAllWebsites({
          currentPage: this.currentPage,
          cantPerPage: this.cantPerPage
        });
      });
    },

    reanalyzeWebsites() {
      this.selectedWebsites.forEach(website => {
        website.analyzing = true;
        toolsService.analyzeLogo(website.business_domain).then(logoResult => {
          if (logoResult.logos) {
            website.logo = logoResult.logos;
            website.alternative_logos = logoResult.logosalt;
            toolsService
              .analyzeColors(
                logoResult.logos,
                `http://${website.business_domain}`
              )
              .then(colorsResult => {
                website.headerwhite =
                  colorsResult.headerwhite === "yes" ? "1" : "0";
                website.primary_color = `#${colorsResult.color1}`;
                website.secondary_color = `#${colorsResult.color2}`;
              });
          }
          website.analyzing = false;
          website.analyzed = true;
        });
      });
    },

    hasAlternativeLogos(website) {
      return website.hasOwnProperty("alternative_logos");
    },

    changeLogo(website, newLogo) {
      website.analyzing = true;
      website.logo = newLogo;
      toolsService
        .analyzeColors(newLogo, `http://${website.business_domain}`)
        .then(colorsResult => {
          website.headerwhite = colorsResult.headerwhite === "yes" ? "1" : "0";
          website.primary_color = `#${colorsResult.color1}`;
          website.secondary_color = `#${colorsResult.color2}`;
          website.analyzing = false;
        });
    },

    selectAllWebsites() {
      if (this.selectedWebsites.length === this.websites.length) {
        this.selectedWebsites = [];
      } else {
        this.selectedWebsites = [].concat(this.websites);
      }
    },

    selectWebsite(website) {
      var index = this.selectedWebsites.indexOf(website);
      if (index == -1) {
        this.selectedWebsites.push(website);
      } else {
        this.selectedWebsites.splice(index, 1);
      }
    },

    isWebsiteSelected(website) {
      return this.selectedWebsites.indexOf(website) !== -1;
    },

    rowClass(website) {
      if (website.analyzed == true) {
        return "analyzed";
      } else if (this.isWebsiteSelected(website)) {
        return "selected";
      } else {
        return "";
      }
    },

    onLogoInputChange(e, website) {
      var files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;
      this.saveImage(files[0], website);
    },

    saveImage(file, website) {
      website.analyzing = true;
      toolsService.uploadImage(file).then(newLogo => {
        website.logo = newLogo;
        toolsService
          .analyzeColors(newLogo, `http://${website.business_domain}`)
          .then(colorsResult => {
            website.headerwhite =
              colorsResult.headerwhite === "yes" ? "1" : "0";
            website.primary_color = `#${colorsResult.color1}`;
            website.secondary_color = `#${colorsResult.color2}`;
            website.analyzing = false;
          });
      });
    }
  }
};
</script>