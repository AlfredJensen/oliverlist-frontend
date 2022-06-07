<template>
  <!-- Integrations.vue -->
  <div>
    <LoadingSpinner v-if="loading" />
    <section class="account" v-else>
      <div class="contenedor" v-if="!isCustomFields">
        <div class="card mt-3">
          <div class="body p-4 email-account">
            <div class="col-sm-12 pb-3">
              <h5 class="bold mb-4">
                {{ $t("lang.integrations.title") }}
              </h5>
              <span
                ><p class="font-weight-light">
                  {{ $t("lang.integrations.description") }}
                </p></span
              >
              <ul class="list-unstyled pl-4 pt-3">
                <li>
                  <i class="icon-check1 text-success mr-1"></i>
                  <span>{{ $t("lang.integrations.feature1") }}</span>
                </li>
                <li>
                  <i class="icon-check1 text-success mr-1"></i>
                  <span> {{ $t("lang.integrations.feature2") }} </span>
                </li>
                <li>
                  <i class="icon-check1 text-success mr-1"></i>
                  <span>{{ $t("lang.integrations.feature3") }}</span>
                </li>
              </ul>
              <div class="crm-list">
                <div class="row flex-row">
                  <div
                    class="col-sm-4 col-lg-3 panel text-center crm-item"
                    v-for="(crmItem) in crmList"
                    :key="crmItem.id"
                  >
                    <div
                      class="card shadow my-5"
                      :class="!isCrmConfigSetted ||
                        crmConfig.crm_config_type_id == crmItem.id
                          ? ''
                          : 'disabled'
                      "
                    >
                      <div class="card-body">
                        <img
                          :src="require('@/assets/images/' + crmItem.logo)"
                          class="opp-logo br-30"
                        />
                        <h4 class="mt-2 mb-2">{{ crmItem.name }}</h4>

                        <div v-if="['2,3'].includes(user.plan_id)" class="mt-2">
                          <small>{{
                            $t("lang.label.upgradetounlockthisfeature")
                          }}</small>
                          <router-link
                            class="btn-primary btn-sm px-3 py-2 mr-4 ml-2 badge"
                            to="/upgrade"
                          >
                            <i class="icon icon-rocket"></i>
                            {{ $t("lang.button.upgrade") }}
                          </router-link>
                        </div>
                        <div v-else>
                          <div class="mb-3">
                            <b
                              v-if="
                                crmConfig.crm_config_type_id ==
                                crmItem.id
                              "
                            >
                              {{ crmConfig.email }}
                              <br />
                              {{ crmConfig.company_name }}
                            </b>
                          </div>
                          <div
                            v-if="
                              crmConfig.crm_config_type_id ==
                              crmItem.id
                            "
                          >
                            <div>
                              <button
                                class="btn btn-sm btn-success mt-2 w-100"
                                @click="goToCustomFields"
                              >
                                {{ $t("lang.integrations.configcustomfields") }}
                              </button>
                            </div>
                            <div>
                              <button
                                class="btn btn-sm btn-danger mt-2 w-100"
                                @click="deactivate"
                              >
                                {{ $t("lang.label.stopsyncing") }}
                              </button>
                            </div>
                          </div>
                          <a
                            class="btn btn-sm btn-primary btn-sm mb-3 mr-2"
                            :href="crmItem.href"
                            v-if="!isCrmConfigSetted"
                          >
                            {{ $t("lang.button.connect") }}
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <IntegrationsCustomFields
        v-if="isCustomFields"
        @hideCustomFields="hideCustomFields"
      />
    </section>
  </div>
</template>
<script>
import { mapState, mapActions } from "vuex";
import Header from "@/components/Header.vue";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import { crmService } from "@/_services";
import Tutorial from "@/components/Tutorial.vue";
import IntegrationsCustomFields from "@/components/Account/IntegrationsCustomFields.vue";

export default {
  data() {
    return {
      loading: true,
      crmConfig: {},
      isCustomFields: false,
      crmList: [
        {
          id: 1,
          name: "Pipedrive",
          logo: "pipedrive-logo.png",
          href: "https://oauth.pipedrive.com/oauth/authorize?response_type=code&client_id=44cd8a8a2d52a7df&redirect_uri=https://crm.oliverlist.com/1",
        },
        {
          id: 2,
          name: "Hubspot",
          logo: "hubspot-logo.png",
          href: "https://app.hubspot.com/oauth/authorize?client_id=459024f1-b968-4961-9f8f-d1833adc1521&redirect_uri=https://app.oliverlist.com/settings-account/integrations/2&scope=oauth%20crm.objects.contacts.read%20crm.objects.contacts.write%20crm.objects.companies.write%20crm.objects.companies.read%20crm.objects.deals.read%20crm.objects.deals.write",
        },
      ],
    };
  },

  components: {
    Header,
    LoadingSpinner,
    Tutorial,
    IntegrationsCustomFields,
  },

  computed: {
    ...mapState({
      headerTab: (state) => state.header.tab,
    }),

    user() {
      return this.$store.state.authentication.user;
    },

    isCrmConfigSetted(){
      return Object.keys(this.crmConfig).length > 0;
    }
  },

  created() {
    this.getCrmSettings();
  },

  methods: {
    ...mapActions("header", {
      changeHeaderTab: "changeTab",
    }),
    getCrmSettings() {
      this.loading = true;
      crmService
        .getConfig()
        .then((result) => {
          if (result) {
            this.crmConfig = result;
            this.loading = false;
          }
        })
        .then((error) => {
          this.loading = false;
        });
    },
    goToCustomFields() {
      this.isCustomFields = true;
    },
    hideCustomFields() {
      this.isCustomFields = false;
    },
    deactivate() {
      this.$swal({
        type: "warning",
        title: this.$t("lang.label.areyousure"),
        text: this.$t("lang.integrations.allsettingswillbedeleted"),
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33a2c",
        confirmButtonText: this.$t("lang.button.yes"),
      }).then((result) => {
        if (result.value) {
          crmService
            .deactivate()
            .then((result) => {
              if (result) {
                this.crmConfig = result;
                this.loading = false;
              }
            })
            .then((error) => {
              this.loading = false;
            });
        }
      });
    },
  },
};
</script>
<style scoped>
.crm-list .card {
  border: none;
  border-radius: 1rem;
  transition: all 0.2s;
  box-shadow: 0 0.5rem 1rem 0 rgba(0, 0, 0, 0.1);
  height: 100%;
}
.crm-list .card.disabled:after {
  position: absolute;
  display: block;
  content: " ";
  background: rgba(46, 49, 49, 0.55);
  width: 100%;
  height: 100%;
  border-radius: 1rem;
}
</style>