<template>
  <div>
    <section class="row third-step-company w-100" v-show="this.activeStep == 3">
          <div class="col-12">
            <div>
                <LoadingSpinner v-if="loading" />
                <div class="YourMessage" v-if="!loading">
                  <div class="row ml-2 mb-2 mt-3"  v-if="isPending()">
                    <div v-if="clicked">
                      <div class="">
                        <div class="col-12 ">
                          <button
                            id="template"
                            v-if="isPending()"
                            :class="
                              this.selectedMessageTab === 'CUSTOM'
                                ? 'btn-secondary'
                                : 'btn-primary'
                            "
                            class="btn btn-sm text-white"
                            @click="changeMessageTab('TEMPLATE')"
                            type="submit"
                          >
                            {{ $t("lang.label.template") }}
                          </button>
                          <button
                            id="personalized"
                            v-if="isPending()"
                            :class="
                              this.selectedMessageTab === 'TEMPLATE'
                                ? 'btn-secondary'
                                : 'btn-primary'
                            "
                            class="btn btn-sm text-white ml-2"
                            @click="changeMessageTab('CUSTOM')"
                            type="submit"
                          >
                            {{ $t("lang.label.personalizedsequence") }}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div
                      v-if="!clicked"
                      class="text-center"
                      :class="!isSaved() ? 'col-md-6' : 'col-md-12'"
                    >
                      <div
                        v-if="
                          !isSaved() || this.model.campaign.is_tpl_first_step
                        "
                        :class="
                          this.selectedMessageTab === 'TEMPLATE' ? 'active' : ''
                        "
                      >
                        <img
                          src="@/assets/images/undraw_website_builder_bxki.png"
                          class="rounded mx-auto d-block"
                          width="300px"
                        />
                        <h2>{{ $t("lang.label.yourmessage") }}</h2>
                        <div class="py-4 text-center">
                          <div>{{ $t("lang.label.thankstotemplate") }}</div>
                        </div>
                        <div class="top-area-opp mb-5">
                          <button
                            id="template"
                            :class="
                              this.selectedMessageTab === 'CUSTOM'
                                ? 'btn-secondary'
                                : 'btn-primary'
                            "
                            class="btn btn-sm text-white"
                            @click="changeMessageTab('TEMPLATE')"
                            type="submit"
                          >
                            {{ $t("lang.label.template") }}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div
                      v-if="!clicked"
                      class="text-center"
                      :class="!isSaved() ? 'col-md-6' : 'col-md-12'"
                    >
                      <div
                        v-if="
                          !isSaved() || !this.model.campaign.is_tpl_first_step
                        "
                        :class="
                          this.selectedMessageTab === 'CUSTOM' ? 'active' : ''
                        "
                      >
                        <img
                          src="@/assets/images/undraw_personal_settings_kihd.png"
                          class="rounded mx-auto d-block"
                          width="320px"
                        />
                        <h2>{{ $t("lang.label.yourmessagepersonalized") }}</h2>
                        <div
                          class="py-4 text-center"
                          :class="
                            this.selectedMessageTab === 'CUSTOM'
                              ? ''
                              : 'opacity-2'
                          "
                        >
                          <div>{{ $t("lang.label.thankstopersonalized") }}</div>
                        </div>
                        <div class="top-area-opp">
                          <button
                            id="personalized"
                            :class="
                              this.selectedMessageTab === 'TEMPLATE'
                                ? 'btn-secondary'
                                : 'btn-primary'
                            "
                            class="btn btn-sm text-white ml-2"
                            @click="changeMessageTab('CUSTOM')"
                            type="submit"
                          >
                            {{ $t("lang.label.personalizedsequence") }}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <main class="mx-0 mx-sm-3" v-if="isSaved() || clicked">
                    <keep-alive>
                    <component
                      :is="messageTabComponent"
                      :model="model"
                      :ref="messageTabComponent"
                      :availableTokens="availableTokens"
                      @changeMessageTab="changeMessageTab($event)"
                      @goToStepCampaign="goToStepCampaign"
                      :activeStep="activeStep"
                    ></component>
                    </keep-alive>
                  </main>
                </div>
            </div>
          </div>
    </section>
  </div>
</template>
<script>
import Vue from "vue";
import Header from "@/components/Header.vue";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import TemplateMsg from "@/components/AccountCreation/Steps/Campaign/TemplateMsg.vue";
import CustomMsg from "@/components/AccountCreation/Steps/Campaign/CustomMsg.vue";
import { mapState, mapActions } from "vuex";
import { campaignsService } from "@/_services";
import i18n from "@/_helpers/i18n";

export default {
  props: {
    model: Object,
    activeStep: Number,
  },

  data() {
    return {
      selectedMessageTab: "",
      clicked: false,
    };
  },

  components: {
    Header,
    LoadingSpinner,
    CustomMsg,
    TemplateMsg,
  },

  computed: {
    ...mapState({
      loading: (state) => state.campaigns.loading,
      currentUser: (state) => state.authentication.user,
      availableTokens: (state) =>
        state.optionsList.all["available_tokens"].data
          .map(function (element) {
            if (element.translated === undefined) {
              element.name = i18n.t("lang.token." + element.name);
              element.translated = true;
            }
            return element;
          })
          .filter((token) => token.token != "[my_proposition]"),
    }),
    messageTabComponent() {
      if (!this.isSaved()) {
        this.setCampaignStepsDefault();
      }
      if (this.selectedMessageTab === "TEMPLATE") {
        this.model.campaign.is_tpl_first_step = true;
        return "TemplateMsg";
      } else {
        this.model.campaign.is_tpl_first_step = false;
        return "CustomMsg";
      }
    },
    haveProfile() {
      return this.profile;
    },
  },
  created() {
    if (this.currentUser.language_id == undefined) {
      this.currentUser.language_id = 1;
    }
    this.activeStep = 3;
    let msgTab = this.model.campaign.is_tpl_first_step ? "TEMPLATE" : "CUSTOM";

    if (!this.isSaved()) {
      if (this.model.campaign.is_tpl_first_step) {
        if (
          this.model.campaign.tpl_first_step.subject === "" &&
          this.model.campaign.tpl_first_step.entrance === "" &&
          this.model.campaign.tpl_first_step.hook === "" &&
          this.model.campaign.tpl_first_step.personalized_hook === "" &&
          this.model.campaign.tpl_first_step.final_hook === "" &&
          this.model.campaign.tpl_first_step.service === "" &&
          this.model.campaign.tpl_first_step.presentation === "" &&
          this.model.campaign.tpl_first_step.politeness === "" &&
          this.model.campaign.tpl_first_step.exit === ""
        ) {
          this.generateDefaultsSteps({
            language_id: this.currentUser.language_id,
          });
        }
      } else {
        if (
          this.model.campaign.campaign_steps == undefined ||
          this.model.campaign.campaign_steps.length == 0
        ) {
          this.generateDefaultsSteps({
            language_id:
              this.model.campaign.language_id !== ""
                ? this.model.campaign.language_id
                : this.currentUser.language_id,
          });
        }
      }
    }

    if (this.isSaved()) this.changeMessageTab(msgTab);
  },

  methods: {
    ...mapActions("campaigns", {
      generateDefaultsSteps: "generateDefaultsSteps",
      changeMode: "changeMode",
    }),
    isSaved() {
      var savedSteps;
      if (this.model.campaign.step !== null) {
        savedSteps = this.model.campaign.step.split(",");
        if (savedSteps.indexOf(3) >= 0 || savedSteps.indexOf("3") >= 0) {
          return true;
        }
      }
      return false;
    },
    isPending() {
      return this.model.campaign_status_id == 1;
    },
    changeMessageTab(selectedMessageTab) {
      if (this.selectedMessageTab != selectedMessageTab) {
        this.changeMode({
          isTplFirstStep: selectedMessageTab === "TEMPLATE" ? true : false,
        });
      }
      this.selectedMessageTab = selectedMessageTab;
      this.clicked = true;
    },
    setCampaignStepsDefault() {
      if (this.model.campaign_steps_default !== undefined) {
        this.model.campaign_steps = JSON.parse(
          JSON.stringify(this.model.campaign_steps_default)
        );
      }
    },
    updateCampaignSteps() {
      this.model.campaign_steps = JSON.parse(
        JSON.stringify(this.model.campaign_steps_default)
      );
    },
    goToStepCampaign(save) {
      this.model.step = this.activeStep;
      this.$emit("goToStepCampaign", save);
    },
    
    goToStepCampaignChild() {
      let reference = "CustomMsg";
      if (this.selectedMessageTab === "TEMPLATE") {
        reference = "TemplateMsg";
      }
      this.$refs[reference].goToStepCampaign(true);
    },
  },
};
</script>
