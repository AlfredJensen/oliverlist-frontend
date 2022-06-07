<template>
  <div>
    <div v-if="!loadingOptionsList" class="mt-4 px-4 pb-4 text-center">
      <div class="d-flex justify-content-center align-items-center">
        <div class="text-center">
          <small>{{ $t("lang.label.testwithdifferentprospects") }}</small>
          <div class="my-2">
            <button
              class="ml-3 btn btn-primary themed-button btn-sm text-right"
              @click="changeBusinessContactSelected(-1)"
            >
              <i class="icon-navigate_before"></i>
            </button>
            <span class="mx-2 minw-150">{{
              this.testBusinessContact[this.testBusinessContactSelected][
                "[prospect_company_name]"
              ]
            }}</span>
            <button
              class="ml-3 btn btn-primary themed-button btn-sm text-right"
              @click="changeBusinessContactSelected(1)"
            >
              <i class="icon-navigate_next"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="card p-4">
      <div class="campaign-steps template-msg">
        <ul class="">
          <li class="pb-5" v-for="(step, key) in model.campaign_steps">
            <div class="step-wrapper">
              <div
                class="step"
                :class="step.recall_step == 0 ? 'bg-primary' : 'bg-success'"
              >
                {{ step.step }}
              </div>
              <div class="text-center" v-if="step.delay > 0">
                +{{ step.delay }}{{ $t("lang.label.daysabbreviation") }}
              </div>
            </div>
            <div>
              <div class="w-100 bg-lg px-2 py-2" style="min-height: 40px">
                <span
                  v-if="model"
                  v-html="$sanitize(formatTokens(convertNLtoBR(step.subject)))"
                ></span>
              </div>
              <div class="py-2 px-2 my-4 bg-lg">
                <p class="w-100 px-2 py-2">
                  <div
                    class="msgCamp"
                    v-if="model"
                    v-html="
                      $sanitize(formatTokens(convertNLtoBR(step.message)))
                    "
                  ></div>
                  <p class="mt-2 mb-2">---</p>
                  <div
                    class=""
                    v-if="model.campaign.email_signature"
                    v-html="
                      $sanitize(formatTokens(convertNLtoBR(model.campaign.email_signature)))
                    "
                  ></div>
                  <br><br>
                  <img v-if="model.campaign.logo" :src="model.campaign.logo" alt="" class="rounded border-color mr-4" width="100px" />
                </p>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import { formattersMixin, campaignUtilsMixin } from "@/_mixins/";
import { mapState, mapActions } from "vuex";

export default {
  props: {
    model: Object,
  },

  data() {
    var self = this;
    return {};
  },

  created() {
    this.getAllOptionsList;
  },
  computed: {
    ...mapState({
      currentUser: (state) => state.authentication.user,
      loadingOptionsList: (state) => !state.optionsList.completeLoading,
      availableTokens: (state) =>
        state.optionsList.all["available_tokens"].data.filter(
          (token) => token.token != "[my_proposition]"
        ),
    }),
    ...mapActions("optionsList", {
      getAllOptionsList: "getAll",
    }),
  },

  mixins: [formattersMixin, campaignUtilsMixin],
};
</script>
