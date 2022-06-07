<template>
  <main class="contenedor">
    <LoadingSpinner v-if="loadingOptionsList || loading" />
    <div class="card mt-3 mb-5" v-if="!loadingOptionsList && !loading">
      <div class="px-4 pb-2 pt-4">
        <div>
          <h6 class="mt-4">{{ $t("lang.appointments.signedon") }}</h6>

          <p>{{ model.client.signed_on }}</p>

          <h6 class="mt-4">{{ $t("lang.label.target") }}</h6>
        
        <TargetsView :targets="model.targets" />

          <h6 class="mt-4">Sales Reps:</h6>
          <div class="row">
            <div class="col-sm-6">
              <div class="row">
                <div class="col-sm-3 font-weight-bold">
                  {{ $t("lang.label.name") }}
                </div>
                <div class="col-sm-3 font-weight-bold">
                  {{ $t("lang.label.lastname") }}
                </div>
                <div class="col-sm-3 font-weight-bold">
                  {{ $t("lang.label.email") }}
                </div>
                <div class="col-sm-3 font-weight-bold">
                  {{ $t("lang.label.phone") }}
                </div>
              </div>
            </div>
          </div>
          <div
            class="row"
            v-for="(person, index) in model.salesRep"
            :key="index"
          >
            <div class="col-sm-6">
              <div class="row">
                <div class="col-sm-3">{{ person.first_name }}</div>
                <div class="col-sm-3">{{ person.last_name }}</div>
                <div class="col-sm-3">{{ person.email }}</div>
                <div class="col-sm-3">{{ person.phone }}</div>
              </div>
            </div>
          </div>

          <h6 class="mt-4">{{ $t("lang.appointments.quantity") }}:</h6>

          <p>{{ model.client.appt_quantity }}</p>

          <h6 class="mt-4">{{ $t("lang.appointments.duration") }}:</h6>

          <p>{{ model.client.appt_duration }}</p>

          <h6 class="mt-4">{{ $t("lang.appointments.outreachdomain") }}:</h6>

          <p>{{ model.client.outreach_domain }}</p>

          <h6 class="mt-4">{{ $t("lang.appointments.startdate") }}</h6>

          <p>{{ appt_start_date }}</p>

          <h6 class="mt-4">{{ $t("lang.appointments.synccrm") }}</h6>

          <p>
            <span v-if="model.client.sync_crm == 0">{{
              $t("lang.button.yes")
            }}</span>
            <span v-else>{{ $t("lang.label.no") }}</span>
          </p>

          <h6 class="mt-4">{{ $t("lang.appointments.meetingprice") }}:</h6>

          <p>{{ model.client.meeting_price }}</p>

          <h6 class="mt-4">{{ $t("lang.appointments.pitch") }}:</h6>
          <p v-html="model.client.pitch"></p>

          <h6 class="mt-4">{{ $t("lang.appointments.extrainfo") }}</h6>
          <p
            v-if="
              model.client.extra_info === null || model.client.extra_info === ''
            "
          >
            Aucun commentaire
          </p>
          <p v-else v-html="model.client.extra_info"></p>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import { mapState, mapActions } from "vuex";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import { clientsService } from "@/_services";
import TargetsView from "@/components/Agencies/TargetsView.vue";

export default {
  props: {},
  data() {
    return {
      loading: false,
      model: {},
      formOptions: {
        validateAfterLoad: false,
        validateAfterChanged: true,
      },
    };
  },
  components: {
    LoadingSpinner,
    TargetsView
  },
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

    appt_start_date() {
      return this.model.client.appt_start_date.substring(0, 10);
    },
  },
  created() {
    this.getAllOptionsList();
    this.getAgency();
  },
  methods: {
    ...mapActions("optionsList", {
      getAllOptionsList: "getAll",
    }),
    getAgency() {
      this.loading = true;
      clientsService.getAgency(0).then((response) => {
        this.model = response;

        if (this.model.targets !== undefined && this.model.targets !== null) {
          this.model.targets.forEach((target) => {
            // convert empty array into object
            if (Array.isArray(target.data.employees)) {
              target.data.employees = {};
            }
            if (
              target.data.categories_jobs === undefined ||
              Array.isArray(target.data.categories_jobs)
            ) {
              target.data.categories_jobs = {};
            }
          });
        }
        this.loading = false;
      });
    },
  },
  watch: {},
};
</script>