<template>
  <div>
    <section class="third-step-company">
      <div class="px-4">
        <div class="float-right w-100">
          <div class="d-block float-left mb-2 py-3">
           
          </div>
        </div>
        <div class="row">
          <div class="col-12 col-md-6">
            <div class="card p-4 text-left">
              <div
                class="d-flex justify-content-between align-items-center mb-2"
              >
                <h5>{{ $t("lang.label.clicktracking") }}</h5>
                <div class="custom-control custom-switch">
                  <input
                    type="checkbox"
                    class="custom-control-input"
                    id=""
                    checked="checked"
                  />

                  <label class="custom-control-label" for=""></label>
                </div>
              </div>
              <p>
                {{
                  $t(
                    "lang.label.discovertheprospectsthatclickonyourwebsitefromtheemailssentbyoliverforyou"
                  )
                }}
              </p>
            </div>
          </div>

          <div class="col-12 col-md-6" v-if="false">
            <div class="card p-4 text-left">
              <div
                class="d-flex justify-content-between align-items-center mb-2"
              >
                <h5>{{ $t("lang.label.activitytracking") }}</h5>
                <div class="custom-control custom-switch">
                  <input
                    type="checkbox"
                    class="custom-control-input"
                    id=""
                    checked="checked"
                  />
                  <label class="custom-control-label" for="swtraking"></label>
                </div>
              </div>
              <p>
                {{
                  $t(
                    "lang.label.accesstoyourprospectsfullactivityonyourwebsiteseethelinkstheyvisitandmuchmore"
                  )
                }}
              </p>
            </div>
          </div>
          <div class="col-12 col-md-6">
            <div class="card p-4 text-left">
              <div
                class="d-flex justify-content-between align-items-center mb-2"
              >
                <h5>{{ $t("lang.label.smartpopup") }}</h5>
                <div class="custom-control custom-switch">
                  <input
                    type="checkbox"
                    class="custom-control-input"
                    id="swSmartPopUp"
                    v-model="switchSmartPopUp"
                    @click="switchtrack('popup')"
                  />
                  <label
                    class="custom-control-label"
                    for="swSmartPopUp"
                  ></label>
                </div>
              </div>
              <p>
                {{
                  $t(
                    "lang.label.oliverwilldisplayapersonalizedmeetingpopuptoeveryprospectthatvisitsyourwebsite"
                  )
                }}
              </p>
              <!-- <button class="btn btn-secondary">Deactivated</button> -->
            </div>
          </div>
        </div>

        <div v-if="switchtraking && switchSmartPopUp" class="row">
          <div v-if="switchSmartPopUp" class="col-12 mt-4">
            <div class="card">
              <div class="contenedor pt-0 pb-0">
                <div class="row">
                  <div class="col-12 mt-4">
                    <h5>{{ $t("lang.label.yourpopup") }}</h5>
                  </div>
                  <div class="col-12 col-sm-4 mt-sm-4 p-0">
                    <div class="card rounded shadow px-1 py-4 p-sm-4">
                      <form @submit.prevent="onSubmit">
                        <vue-form-generator
                          ref="targetForm"
                          :schema="schemaCompany"
                          :model="this.model"
                          :options="formOptions"
                          @model-updated="hasModified"
                        >
                        </vue-form-generator>
                      </form>
                    </div>
                  </div>
                  <div class="col-12 col-sm-8 mt-4 px-0 px-sm-2">
                    <div class="card p-4 text-center">
                      <div
                        class="contentTracking"
                        v-bind:style="'margin-top:20px;background:url(https://go.oliverlist.com/capture.png);background-size:cover;padding: 28px;padding-top: 100px;'"
                      >
                        <div
                          class="olvr-js-popup-window show"
                          v-bind:style="
                            'float:' + this.model.campaign.popup_position + ';'
                          "
                        >
                          <div class="olvr-js-popup-window--left-panel"></div>
                          <div
                            class="olvr-js-popup-window--right-panel"
                            v-bind:style="
                              'background-color:' +
                              this.model.campaign.popup_color
                            "
                          >
                            <div
                              class="olvr-js-popup-window--right-panel--decor"
                            ></div>
                            <button
                              class="olvr-js-popup-window--right-panel--close"
                            ></button>
                            <div
                              class="
                                olvr-js-popup-window--right-panel--commercial-head
                              "
                            >
                              <div
                                class="
                                  olvr-js-popup-window--right-panel--commercial-head--icon
                                "
                              ></div>
                              <div
                                class="
                                  olvr-js-popup-window--right-panel--commercial-head--name
                                "
                              >
                                François
                              </div>
                            </div>
                            <div
                              class="olvr-js-popup-window--right-panel--form"
                            ></div>
                            <div
                              class="
                                olvr-js-popup-window--right-panel--client-section
                              "
                            >
                              <div
                                class="
                                  olvr-js-popup-window--right-panel--client-section--photo
                                "
                                style="
                                  background-size: 100%;
                                  background-image: url('https://go.oliverlist.com/avatar.png');
                                "
                              ></div>
                              <div
                                class="
                                  olvr-js-popup-window--right-panel--client-section--name
                                "
                              >
                                François
                              </div>
                            </div>
                            <div
                              class="
                                olvr-js-popup-window--right-panel--commercial-section
                              "
                            >
                              <div
                                class="
                                  olvr-js-popup-window--right-panel--commercial-section--photo
                                "
                                style="
                                  background-size: 100%;
                                  background-image: url('https://go.oliverlist.com/avatar.png');
                                "
                              ></div>
                              <div
                                class="
                                  olvr-js-popup-window--right-panel--commercial-section--name
                                "
                              >
                                {{ this.user.name }}
                              </div>
                            </div>
                            <div
                              class="
                                olvr-js-popup-window--right-panel--form--title
                                olvr-js-step1
                                pl-4
                                pr-4
                              "
                            >
                              {{ this.model.campaign.popup_message }}
                            </div>
                            <div
                              class="
                                olvr-js-popup-window--right-panel--form--title-separator
                                olvr-js-step1
                              "
                            ></div>
                            <div
                              class="
                                olvr-js-popup-window--input-container
                                olvr-js-popup-window--input-calendar
                                olvr-js-step1
                              "
                            >
                              <div
                                class="
                                  olvr-js-popup-window--input--icon
                                  olvr-js-popup-window--input-calendar--icon
                                "
                              ></div>
                              <input
                                type="text"
                                class="olvr-js-popup-window--input olvr-js-date"
                                placeholder="DD/MM/YYYY"
                              />
                            </div>
                            <div
                              class="
                                olvr-js-popup-window--input-container
                                olvr-js-popup-window--input-clock
                                olvr-js-step1
                              "
                            >
                              <div
                                class="
                                  olvr-js-popup-window--input--icon
                                  olvr-js-popup-window--input-clock--icon
                                "
                              ></div>
                              <input
                                type="text"
                                class="olvr-js-popup-window--input olvr-js-time"
                                placeholder="HH:MM"
                              />
                            </div>
                            <div
                              class="
                                olvr-js-popup-window--input-container
                                olvr-js-popup-window--input-telephone
                                olvr-js-step1
                              "
                            >
                              <div
                                class="
                                  olvr-js-popup-window--input--icon
                                  olvr-js-popup-window--input-telephone--icon
                                "
                              ></div>
                              <input
                                type="text"
                                class="
                                  olvr-js-popup-window--input
                                  olvr-js-telephone
                                "
                                placeholder="Entrez votre numéro de téléphone"
                              />
                            </div>
                            <button
                              class="
                                olvr-js-popup-window--right-panel--form--submit
                                olvr-js-step1
                              "
                              v-bind:style="
                                'background-color:' +
                                this.model.campaign.popup_color
                              "
                            >
                              Envoyer
                            </button>
                            <div
                              class="
                                olvr-js-popup-window--calendar-submitted
                                olvr-js-step2
                              "
                            ></div>
                            <div
                              class="
                                olvr-js-popup-window--message-submitted
                                olvr-js-step2
                              "
                            >
                              Paul a accepté votre rendez-vous
                            </div>
                            <div
                              class="
                                olvr-js-popup-window--datetime-submitted
                                olvr-js-step2
                              "
                            ></div>
                            <div
                              class="
                                olvr-js-popup-window--right-panel--copyright
                              "
                            >
                              Un outil de <a href="#">Oliver</a>
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
        </div>

        <div class="card p-4 text-left mt-4">
          <h5>
            {{ $t("lang.label.activitytracking") }} ({{
              $t("lang.general.optional")
            }})
          </h5>
          <div class="col-12" role="alert">
            {{
              $t(
                "lang.label.toallowtrackingofyoursitetrafficyoumustincludethefollowingjavascriptinthesection"
              )
            }}
            <span class="alert-link"> &lt;body&gt; &lt;/body&gt; </span>
            {{ $t("lang.label.ofyourhtmlcodeonyourwebsite") }}
            {{ this.model.campaign.demo_url }}
            <div class="alert alert-warning mt-3">
              <p>
                &lt;script type="text/javascript" &gt;<br />
                var currentdate = new Date();<br />
                var oliverscript = document.createElement('script');<br />
                var client="{{ getdemourl() }}";<br />
                oliverscript.type="text/javascript";<br />
                oliverscript.src="https://go.oliverlist.com/popup/main.js?c="+currentdate.getMinutes();<br />
                document.head.appendChild(oliverscript);<br />
                &lt;/script&gt;<br />
              </p>
            </div>
          </div>
          <div class="col-md-6 col-sm-12 justify-content-end">
            <div
              class="
                card
                py-1
                px-1
                py-sm-2
                px-sm-3
                no-border
                rounded-25
                mb-auto
              "
            >
              <strong>{{
                $t("lang.label.checkthatthetrackingscriptisactiveonyoursite")
              }}</strong>
              <small class="mt-2"
                >{{ $t("lang.label.afterinsertingtheabovecode")
                }}<a :href="this.model.campaign.demo_url" target="_blank"
                  ><strong>{{ $t("lang.label.clickhere") }}</strong></a
                >{{ $t("lang.label.forthecodetobeexecuted") }}
                <small><br /></small>
                {{ $t("lang.label.thenclickonthebuttonbelow") }}</small
              >
              <div class="my-2 ml-1">
                <h6>{{ $t("lang.campaigns_dashboard.setaddress") }}</h6>
                <span>https://www.</span>
                <form class="d-inline">
                  <input type="text" v-model="testurl" size="30" />
                  <button
                    v-if="!verifying"
                    :disabled="!testurl"
                    class="d-inline ml-2 btn-sm btn btn-primary"
                    @click="verifyScript()"
                  >
                    {{ $t("lang.button.verify") }}
                  </button>
                </form>
              </div>
              <div
                v-if="verifying"
                class="spinner-border loading-spinner mx-auto"
                role="status"
              >
                <span class="sr-only">Loading...</span>
              </div>
              <div
                v-if="verifyingresult && !verifying && verifyfirst"
                class="badge btn-success mt-3"
              >
                {{ $t("lang.label.congrats") }}
              </div>

              <div
                v-if="!verifyingresult && !verifying && verifyfirst"
                class="bg-danger p-1"
              >
                <small class="text-white">{{
                  $t("lang.label.wecouldnotdetectthescript")
                }}</small>
              </div>
            </div>
          </div>
        </div>

        <div class="py-4 col-md-12 d-flex justify-content-end">
          <div class="row">
            <button
              class="ml-2 btn  px-5 py-2 supersave btn-success btn-sm text-center"
              @click="goToStepCampaign(true)"
            >
              {{ $t("lang.button.save") }}
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
import Vue from "vue";
import VueFormGenerator from "vue-form-generator";
import "vue-form-generator/dist/vfg.css";
import { campaignsService } from "@/_services";
import Tutorial from "@/components/Tutorial.vue";
Vue.use(VueFormGenerator);
export default {
  methods: {
    hasModified() {
      this.modified = true;
    },
    goToStepCampaign(save) {
      if (save && save != "back") {
        if (this.switchtraking && this.switchSmartPopUp) {
          this.$refs.targetForm.validate();
          if (this.$refs.targetForm.errors.length > 0) {
            return;
          }
        }
      }
      this.$emit("goToStepCampaign", save);
    },

    verifyScript() {
      this.verifying = true;
      this.verifyfirst = true;
      campaignsService.verifyScript(this.testurl).then((response) => {
        this.verifyingresult = response;
        this.verifying = false;
      });
    },
    getdemourl() {
      return btoa(this.model.campaign.demo_url);
    },
    switchtrack(activity) {
      this.hasModified();
      if (activity == "activity" && this.switchSmartPopUp === true) {
        this.switchSmartPopUp = false;
        this.switchTraking = false;
        this.removeParam8();
      } else if (activity == "activity" && this.switchtraking === true) {
        this.switchTraking = false;
        this.removeParam8();
      } else if (activity == "activity" && this.switchtraking === false) {
        this.switchTraking = true;
        this.removeParam8();
      }
      if (activity == "popup" && this.switchSmartPopUp === false) {
        this.addParam8();
        this.switchtraking = true;
      } else if (activity == "popup" && this.switchSmartPopUp === true) {
        this.removeParam8();
      }
    },
    removeParam8() {
      if (this.model.parameters_tf.indexOf("8") !== -1) {
        this.model.parameters_tf.splice(
          this.model.parameters_tf.indexOf("8"),
          1
        );
      }
    },
    addParam8() {
      if (this.model.parameters_tf.indexOf("8") === -1) {
        this.model.parameters_tf.push("8");
      }
    },
  },
  computed: {
    user() {
      return this.$store.state.authentication.user;
    },
  },
  mounted() {
    if (this.model.campaign.popup_color == undefined) {
      this.model.campaign.popup_color = "#a5a7e9";
    }
  },

  created() {
    window.scrollTo(0, 0);
    if (this.model.parameters_tf.indexOf("8") !== -1) {
      this.switchtraking = true;
      this.switchSmartPopUp = true;
    }
  },
  components: {
    "vue-form-generator": VueFormGenerator.component,
    Tutorial,
  },
  props: {
    model: Object,
    currentUser: Object,
  },
  data() {
    return {
      modified: false,
      testurl: "",
      switchtraking: true,
      switchSmartPopUp: false,
      verifyingresult: false,
      verifying: false,
      verifyfirst: false,
      schemaCompany: {
        fields: [
          {
            type: "input",
            inputType: "text",
            label: this.$t("lang.label.message"),
            model: "campaign.popup_message",
            readonly: false,
            featured: true,
            required: true,
            min: 5,
            max: 30,
            validator: VueFormGenerator.validators.string.locale({
              fieldIsRequired: this.$t("lang.label.required"),
              textTooSmall: this.$t("lang.validation.texttosmall", {
                min: "{1}",
              }),
            }),
            validator: VueFormGenerator.validators.string,
            styleClasses: "col-md-12",
          },
          {
            type: "input",
            inputType: "color",
            label: this.$t("lang.label.color"),
            model: "campaign.popup_color",
            hint: "",
            readonly: false,
            featured: false,
            required: true,

            styleClasses: "col-md-12",
          },
          {
            type: "select",
            label: this.$t("lang.label.position"),
            model: "campaign.popup_position",
            readonly: false,
            featured: false,
            required: true,
            values: [
              { id: "left", name: "Gauche" },
              { id: "right", name: "Droite" },
            ],
            styleClasses: "col-md-12",
          },
        ],
      },
      formOptions: {
        validateAfterLoad: false,
        validateAfterChanged: true,
      },
    };
  },
};
</script>

<style>
.olvr-js-float-button {
  position: fixed;
  width: 60px;
  height: 60px;
  bottom: 30px;
  right: 20px;
  background-image: url("https://go.oliverlist.com/popup/img/svg/calendar-1-light.svg");
  background-repeat: no-repeat;
  background-size: 27.39px;
  background-position: center;
  border: transparent;
  border-radius: 50%;
  box-shadow: 0 11.4286px 11.4286px rgba(0, 0, 0, 0.25);
  cursor: pointer;
  outline: 0;
  z-index: 99997 !important;
}
.olvr-js-float-button.open {
  background-image: url("https://go.oliverlist.com/popup/img/svg/angle-down-light.svg");
  background-size: 14.86px 18.16px;
  transform: matrix(-1, 0, 0, 1, 0, 0);
}
.olvr-js-popup-window {
  position: relative;
  width: 270px;
  height: 491px;
  font-family: "Roboto", sans-serif !important;
  z-index: 99997 !important;
  float: right;
}
.olvr-js-popup-window.show {
  display: block;
}
.olvr-js-popup-window--left-panel {
  display: none;
}
.olvr-js-popup-window--left-panel.show {
  display: block;
}
.olvr-js-popup-window--left-panel--times {
  position: absolute;
  width: 21px;
  height: 21px;
  left: 173px;
  top: 184px;
  background-color: #3d51e4;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
  background-image: url("https://go.oliverlist.com/popup/img/svg/times-light.svg");
  background-repeat: no-repeat;
  background-size: 9px 9px;
  border-color: transparent;
  background-position: center;
  cursor: pointer;
  border-radius: 50%;
  outline: 0;
}
.olvr-js-popup-window--left-panel--float {
  position: absolute;
  width: 194px;
  height: 245px;
  left: 0;
  top: 213px;
  background: #ffffff;
  border: 2px solid #3d52e4;
  box-sizing: border-box;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.25);
  border-radius: 5px;
}
.olvr-js-popup-window--left-panel--title {
  font-style: normal;
  font-weight: 300;
  font-size: 10px;
  line-height: 12px;
  color: #404040;
  margin: 14px 12px 0 14px;
  font-family: "Roboto", sans-serif !important;
}
.olvr-js-popup-window--left-panel--calendar {
  width: 163px;
  height: 172.62px;
  margin-left: 10px;
  margin-top: 5px;
}
.olvr-js-popup-window--left-panel--button {
  width: 32px;
  height: 23px;
  background: linear-gradient(92.09deg, #4c61f2 -2.54%, #2f43d7 99.17%);
  border-color: transparent;
  outline: 0;
  border-radius: 11px;
  font-style: normal;
  font-weight: normal;
  font-size: 10px;
  line-height: 12px;
  color: #ffffff;
  z-index: 99999 !important;
  margin-right: 10px;
  float: right;
  cursor: pointer;
  font-family: "Roboto", sans-serif !important;
}
.olvr-js-popup-window--right-panel {
  width: 270px;
  height: 491px;
  right: 0;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 10px;
  font-family: "Roboto", sans-serif !important;
}
.olvr-js-popup-window--right-panel--form {
  position: absolute;
  width: 248px;
  height: 242px;
  left: 11px;
  right: 11px;
  top: 213px;
  background: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.25);
  border-radius: 5px;
  z-index: 99998 !important;
  font-family: "Roboto", sans-serif !important;
}
.olvr-js-popup-window--right-panel--decor {
  position: absolute;
  height: 132px;
  left: 0;
  right: 0;
  bottom: 0;
  background: #ffffff;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 0 0 10px 10px;
  z-index: 99998 !important;
}
.olvr-js-popup-window--right-panel--close {
  position: absolute;
  width: 21px;
  height: 21px;
  right: 11px;
  top: 10px;
  background-color: rgba(255, 255, 255, 0.65);
  border-radius: 50%;
  border-color: transparent;
  outline: 0;
  cursor: pointer;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
  background-image: url("https://go.oliverlist.com/popup/img/svg/angle-down-light.svg");
  background-repeat: no-repeat;
  background-size: 9px 11px;
  transform: matrix(-1, 0, 0, 1, 0, 0);
  background-position: center;
}
.olvr-js-popup-window--right-panel--commercial-head {
  position: absolute;
  top: 26.77px;
  left: 11px;
  font-family: "Roboto", sans-serif !important;
}
.olvr-js-popup-window--right-panel--commercial-head--icon {
  width: 29.98px;
  height: 29.98px;
  margin-right: 15px;
  background-image: url("https://go.oliverlist.com/popup/img/svg/calendar-1-light.svg");
  background-repeat: no-repeat;
  background-size: 29.98px 29.98px;
  background-position: center;
  display: inline-block;
}
.olvr-js-popup-window--right-panel--commercial-head--name {
  font-style: normal;
  font-weight: 300;
  font-size: 35.4582px;
  line-height: 42px;
  display: inline-block;
  color: #ffffff;
  font-family: "Roboto", sans-serif !important;
}
.olvr-js-popup-window--right-panel--client-section {
  position: absolute;
  width: 76px;
  height: 102px;
  left: 36px;
  top: 93px;
  z-index: 99999 !important;
  font-family: "Roboto", sans-serif !important;
}
.olvr-js-popup-window--right-panel--client-section--photo {
  width: 76px;
  height: 76px;
  vertical-align: top;
  border-radius: 50%;
}
.olvr-js-popup-window--right-panel--client-section--name {
  font-style: normal;
  font-weight: 300;
  font-size: 12.8884px;
  line-height: 15px;
  color: #ffffff;
  width: 100%;
  text-align: center;
  display: inline-block;
  margin-top: 11px;
  font-family: "Roboto", sans-serif !important;
}
.olvr-js-popup-window--right-panel--commercial-section {
  position: absolute;
  width: 76px;
  height: 102px;
  left: 156px;
  top: 93px;
  z-index: 99999 !important;
  margin-right: 44px;
  font-family: "Roboto", sans-serif !important;
}
.olvr-js-popup-window--right-panel--commercial-section--photo {
  width: 76px;
  height: 76px;
  vertical-align: top;
  border-radius: 50%;
  background-size: 100%;
}
.olvr-js-popup-window--right-panel--commercial-section--name {
  font-style: normal;
  font-weight: 300;
  font-size: 12.8884px;
  line-height: 15px;
  color: #ffffff;
  width: 100%;
  text-align: center;
  display: inline-block;
  margin-top: 11px;
  font-family: "Roboto", sans-serif !important;
}
.olvr-js-popup-window--right-panel--copyright {
  position: absolute;
  bottom: 8px;
  font-style: normal;
  font-weight: 300;
  font-size: 10px;
  line-height: 12px;
  text-align: center;
  color: rgba(0, 0, 0, 0.7);
  left: 0;
  right: 0;
  z-index: 99999 !important;
  font-family: "Roboto", sans-serif !important;
}
.olvr-js-popup-window--right-panel--copyright > a {
  color: #3d2ded;
  text-decoration: none;
  font-weight: 500;
  font-family: "Roboto", sans-serif !important;
}
.olvr-js-popup-window--right-panel--form--title {
  position: absolute;
  left: 0;
  right: 0;
  text-align: center;
  top: 231px;
  font-style: normal;
  font-weight: 300;
  font-size: 12.8884px;
  line-height: 15px;
  z-index: 99999 !important;
  color: #000000;
  font-family: "Roboto", sans-serif !important;
}
.olvr-js-popup-window--right-panel--form--title-separator {
  position: absolute;
  left: 11px;
  right: 11px;
  top: 262px;
  background: #c4c4c4;
  height: 0.01rem;
  z-index: 99999 !important;
}
.olvr-js-popup-window--right-panel--form--submit {
  position: absolute;
  width: 81px;
  height: 23px;
  left: 0;
  right: 0;
  top: 413px;
  border-color: transparent;
  outline: 0;
  border-radius: 11px;
  font-style: normal;
  font-weight: normal;
  font-size: 10px;
  line-height: 12px;
  color: #ffffff;
  z-index: 99999 !important;
  cursor: pointer;
  margin: 0 auto;
  font-family: "Roboto", sans-serif !important;
}
.olvr-js-popup-window--input {
  font-style: normal;
  font-weight: 300;
  font-size: 9.20602px;
  line-height: 11px;
  color: #000000;
  border: 0;
  vertical-align: middle;
  outline: 0;
  width: 150px !important;
  min-width: 150px !important;
  height: auto !important;
  font-family: "Roboto", sans-serif !important;
}
.olvr-js-popup-window--input-container {
  position: absolute;
  width: 226px;
  height: 29px;
  left: 0;
  right: 0;
  margin: 0 auto;
  background: #ffffff;
  border: 0.7px solid #babac2;
  box-sizing: border-box;
  border-radius: 2px;
  z-index: 99999 !important;
  font-family: "Roboto", sans-serif !important;
}
.olvr-js-popup-window--input--icon {
  background-repeat: no-repeat;
  background-size: 17px;
  background-position: center;
  margin: 5px 7px 5px 9px;
  height: 17px;
  width: 17px;
  z-index: 99999 !important;
  display: inline-block;
  vertical-align: middle;
}
.olvr-js-popup-window--input-calendar {
  top: 285px;
}
.olvr-js-popup-window--input-calendar--icon {
  background-image: url("https://go.oliverlist.com/popup/img/svg/calendar-2-dark.svg");
  margin: 6px 6px 6px 9px;
}
.olvr-js-popup-window--input-clock {
  top: 324px;
}
.olvr-js-popup-window--input-clock--icon {
  background-image: url("https://go.oliverlist.com/popup/img/svg/clock-dark.svg");
}
.olvr-js-popup-window--input-telephone {
  top: 363px;
}
.olvr-js-popup-window--input-telephone--icon {
  background-image: url("https://go.oliverlist.com/popup/img/svg/telephone-dark.svg");
}
.olvr-js-popup-window--message-submitted {
  position: absolute;
  top: 308px;
  left: 0;
  right: 0;
  width: 180px;
  font-style: normal;
  font-weight: 300;
  font-size: 14.3351px;
  line-height: 17px;
  text-align: center;
  color: #000000;
  margin: 0 auto;
  display: none;
  z-index: 99999 !important;
  font-family: "Roboto", sans-serif !important;
}
.olvr-js-popup-window--datetime-submitted {
  position: absolute;
  top: 366px;
  font-style: normal;
  font-weight: 500;
  left: 0;
  right: 0;
  font-size: 14.7857px;
  line-height: 17px;
  color: #000000;
  margin: 0 auto;
  display: none;
  z-index: 99999 !important;
  text-align: center;
  font-family: "Roboto", sans-serif !important;
}
.olvr-js-popup-window--calendar-submitted {
  position: absolute;
  width: 33px;
  height: 33px;
  left: 120px;
  top: 257px;
  background-size: 33px 33px;
  background: url(https://go.oliverlist.com/popup/img/svg/calendar-1-dark.svg)
    no-repeat center;
  display: none;
  z-index: 99999 !important;
}
.olvr-js-popup-window--right-panel--form--title.olvr-js-step1 {
  max-height: 30px;
  overflow-y: hidden;
}
</style>