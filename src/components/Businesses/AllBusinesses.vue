<template>
  <div class="">
    <section class="second-step-company">
      <div class="">
        <div class="accordion" id="businessAccordion">
          <div
            id="businessOne"
            class="collapse"
            aria-labelledby="businessHeadingOne"
            data-parent="#businessAccordion"
          >
            <div class="contenedor fast">
              <div id="searchHeadingOne" class="btn-group dropleft">
                <button
                  v-if="importview"
                  class="rounded ml-2 btn btn-sm btn-primary"
                  type="button"
                  data-toggle="collapse"
                  data-target="#searchOne"
                  aria-expanded="false"
                  aria-controls="searchOne"
                >
                  <i class="icon-arrow-left"></i>
                  &nbsp;Contact list
                </button>

                <button
                  @click="
                    openCsvModal = true;
                    finishimported = false;
                    importnumber++;
                  "
                  class="rounded ml-2 btn btn-sm btn-success"
                >
                  <i class="icon-upload"></i>
                  {{ $t("lang.label.csvimport") }}
                </button>
                <Tooltip
                  :text="$t('lang.mycontacts.customfieldsdesc')"
                  :width="'auto'"
                >
                  <router-link
                    class="rounded ml-2 btn btn-sm btn-primary"
                    to="/settings-account?mycustomfields=1"
                    tag="button"
                  >
                    {{ $t("lang.mycontacts.gotocreatecustomfields") }}
                  </router-link>
                </Tooltip>
              </div>

              <div class="row">
                <div class="col-md-12">
                  <ImportContacts
                    :key="importnumber"
                    v-if="openCsvModal == true"
                    @contactImported="contactImported"
                    @finishImported="finishImported"
                  />
                </div>
              </div>
            </div>
          </div>

          <div
            id="searchOne"
            class="collapse show"
            aria-labelledby="searchHeadingOne"
            data-parent="#businessAccordion"
          >
            <SearchForm
              :key="searchkey"
              v-if="!loadingcam && !loadingOptionsList"
              :model="model"
            >
            </SearchForm>
            <LoadingSpinner v-else />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
import SearchForm from "@/components/AccountCreation/Steps/Campaign/search/SearchForm.vue";
import { mapState, mapActions } from "vuex";
import ImportContacts from "@/components/Contacts/ImportContacts.vue";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import Tooltip from "@/components/Common/Tooltip.vue";

export default {
  data() {
    return {
      model: {},
      searchkey: 0,
      importnumber: 10,
      openCsvModal: true,
      importview: true,
    };
  },

  created() {
    this.model.imported = false;
    this.getAllOptionsList;
    this.searchkey++;
  },

  computed: {
    ...mapState({
      loading: (state) => state.optionsList.loading,
      loadingcam: (state) => state.campaigns.loading,
      hierarchyoptionsSearchLevel: (state) =>
        state.optionsList.all["categories_search_level"],
      loadingOptionsList: (state) => !state.optionsList.completeLoading,
    }),
    ...mapActions("optionsList", {
      getAllOptionsList: "getAll",
    }),
  },

  methods: {
    contactImported() {},
    finishImported() {},
    async allDataCSV() {
      this.$store.state.contacts.loading = true;
      const response = await businessContactsService
        .getDataToCsv()
        .then((result) => {
          this.listContacts = [];
          for (let i = 0; i < result.list.length; i++) {
            this.listContacts.push({
              Name: result.list[i]["contact_name"],
              "Job Title": result.list[i]["job"],
              Email: result.list[i]["email"],
              Company: result.list[i]["business_name"],
              "Company Size": this.getSalaries(result.list[i]["salaries"]),
              "Company Phone": result.list[i]["business_phone"],
              Phone: result.list[i]["phone"],
              Address: result.list[i]["business_address"],
              Category: result.list[i]["category_name"],
              City: result.list[i]["city"],
              Linkedin: result.list[i]["linkedinurl"],
              "Campaign Name": result.list[i]["campaign_name"],
            });
          }
          this.$store.state.contacts.loading = false;
        });

      this.unparsedResults = this.$papa.unparse(this.listContacts, {
        delimiter: ";",
      });
      this.$papa.download(this.unparsedResults, "AllData");
    },
  },
  components: {
    SearchForm,
    ImportContacts,
    LoadingSpinner,
    Tooltip
  },
};
</script>
<style>
#businessAccordion .collapsing {
  -webkit-transition: none;
  transition: none;
  display: none;
}
</style>