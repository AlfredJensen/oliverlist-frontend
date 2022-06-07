<template>
  <div>
    <LoadingSpinner v-if="loading" />
    <section class="account" v-else>
      <div
        class="bg-light pt-3 px-4 border-bottom border-grey"
        v-if="user.role_id != 1"
      >
        <div v-for="(tab, index) in tabs" class="ml-0 d-inline" :key="index">
          <span
            :class="
              activeTabId == tab.id
                ? 'active border-bottom-3 border-primary'
                : ''
            "
            class="p-0 it-tabs pb-2 mr-3 bg-transparent"
            type="button"
            @click="changeTab(index)"
          >
            {{ tab.title }}
          </span>
        </div>
      </div>
      <div class="contenedor">
        <div class="card mt-3" v-if="activeTabId == 1">
          <div class="body p-4 email-account">
            <!-- Email integration main screen -->
            <div
              class="col-sm-12 pb-3"
              v-if="!this.settings.email || this.settings.activated == 0"
            >
              <h5 class="bold mb-4">
                {{ $t("lang.label.unlockyoursalesinboxadvanced") }}
              </h5>
              <span
                ><p class="font-weight-light">
                  {{
                    $t(
                      "lang.label.tabswitchingandmanuallyforwardinfemailstooliverisathingofthepastwhenunlockedyoucanuseryoursalesinboxtosendemaildirectlyfromoliverwhileautomaticallylinkingthemtorelateddealsandcontacts"
                    )
                  }}
                </p></span
              >
              <ul class="list-unstyled pl-4 pt-3">
                <li>
                  <i class="icon-check1 text-success mr-1"></i
                  ><span>
                    {{
                      $t("lang.label.syncoliveremailswithanymajoremailprovider")
                    }}</span
                  >
                </li>
                <li>
                  <i class="icon-check1 text-success mr-1"></i
                  ><span> {{ $t("lang.label.trackemailopensandclicks") }}</span>
                </li>
                <li>
                  <i class="icon-check1 text-success mr-1"></i
                  ><span>
                    {{
                      $t(
                        "lang.label.savetimebymakinguseofcustomizabletemplates"
                      )
                    }}</span
                  >
                </li>
                <li>
                  <i class="icon-check1 text-success mr-1"></i
                  ><span>
                    {{
                      $t(
                        "lang.label.customizeyoursignatureforamoreprofessionallook"
                      )
                    }}</span
                  >
                </li>
              </ul>
              <div class="d-flex align-items-center">
                <button
                  class="btn btn-sm btn-success btn-sm mt-4 mb-3 mr-2"
                  @click="addNewAccount()"
                >
                  {{ $t("lang.label.addnewaccount") }}
                </button>
                <span
                  ><p class="font-weight-light mt-2">
                    {{ $t("lang.label.orchooseapreviouslyaddedaccount") }}
                  </p></span
                >
              </div>
            </div>

            <div
              class="col-sm-12 pb-3"
              v-if="this.settings.email && !addAccount"
            >
              <span><p class="font-weight-bold mb-2">Email sync:</p></span>
              <div class="card rounded-0">
                <div class="card-body row">
                  <div class="col-md-1">
                    <span v-if="isGmailServer" class="d-block icon-account"
                      ><img class="mx-auto" src="@/assets/images/gmail.png" alt
                    /></span>
                    <span v-if="isExchangeServer" class="d-block icon-account"
                      ><img
                        class="mx-auto"
                        src="@/assets/images/outlook.png"
                        alt
                    /></span>
                    <span
                      v-if="isSmtpServer"
                      class="icon-envelope-open-o d-block icon-account"
                    ></span>
                  </div>
                  <div class="col-md-9 d-block">
                    <span
                      ><p class="font-weight-bold small">
                        {{ this.settings.email }}
                      </p></span
                    >
                    <br />
                    <div v-if="this.settings.activated == 1">
                      <i class="icon-check1 text-success small mr-1"></i
                      ><span
                        ><p class="font-weight-light text-success small">
                          Active
                        </p></span
                      >
                    </div>
                    <div v-else>
                      <span
                        ><p class="font-weight-light small">
                          {{ $t("lang.label.disconnected") }}
                        </p></span
                      >
                    </div>
                    <!-- <i class="icon-warning text-warning small mr-1"></i><span><p class="font-weight-light text-warning small">Authentication Error</p></span> -->
                  </div>
                  <div class="col-md-2 text-right mt-2">
                    <button
                      class="btn btn-sm btn-danger"
                      @click="deactivate()"
                      v-if="this.settings.activated == 1"
                      :disabled="this.user.role_id == 1"
                    >
                      {{ $t("lang.label.stopsyncing") }}
                    </button>
                    <button
                      class="btn btn-sm btn-success"
                      @click="reconnect()"
                      v-else
                    >
                      {{ $t("lang.label.reconnect") }}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="addAccount">
              <div class="col-sm-12 pb-3">
                <span
                  ><p class="font-weight-light">
                    {{
                      $t(
                        "lang.label.selectyouremailproviderandclickonconnecttosynchronizeyoumailbox"
                      )
                    }}
                  </p></span
                >
              </div>
              <button
                v-if="!isSmtpServer && !isExchangeServer"
                type="button"
                class="btn btn-light border ml-2"
                :class="isGmailSelected ? 'active' : ''"
                @click="changeEmailProvider('Gmail')"
              >
                <span class="d-block icon"
                  ><img class="mx-auto" src="@/assets/images/gmail.png" alt
                /></span>
                Gmail/Gsuite
              </button>
              <button
                v-if="!isSmtpServer && !isGmailServer"
                type="button"
                class="btn btn-light border ml-2"
                :class="isExchangeSelected ? 'active' : ''"
                @click="changeEmailProvider('Exchange')"
              >
                <span class="d-block icon"
                  ><img src="@/assets/images/outlook.png" alt
                /></span>
                Outlook/Exchange
              </button>
              <button
                v-if="!isGmailServer && !isExchangeServer"
                type="button"
                class="btn btn-light border ml-2"
                :class="isSmtpSelected ? 'active' : ''"
                @click="changeEmailProvider('SMTP')"
              >
                <span class="icon-envelope-open-o d-block icon"></span>
                IMAP/SMTP
              </button>

              <div v-if="isSmtpSelected">
                <p class="ml-5 mt-4">
                  <Tutorial
                    id="smtpimap"
                    :linkText="$t('lang.label.smtp')"
                    linkClass="ml-2 mt-2"
                    :videoUrl="
                      'https://www.youtube.com/embed/' +
                      $t('lang.videos.emailsmtp')
                    "
                  >
                    <template slot="info" slot-scope="{ info }">
                      <table class="table table-sm" v-if="false">
                        <thead>
                          <tr>
                            <th scope="col">
                              {{ $t("lang.label.emailprovider") }}
                            </th>
                            <th scope="col">
                              {{ $t("lang.label.imapserverincomingmessages") }}
                            </th>
                            <th scope="col">
                              {{ $t("lang.label.smtpserveroutgoingmessages") }}
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <th scope="row">Gmail</th>
                            <td>imap.gmail.com / Port : 993</td>
                            <td>smtp.gmail.com / Port : 587</td>
                          </tr>
                          <tr>
                            <th scope="row">Outlook</th>
                            <td>imap-mail.outlook.com / Port : 993</td>
                            <td>smtp-mail.outlook.com / Port : 587</td>
                          </tr>
                          <tr>
                            <th scope="row">OVH</th>
                            <td>ssl0.ovh.net / Port : 993</td>
                            <td>ssl0.ovh.net / Port : 587</td>
                          </tr>
                          <tr>
                            <th scope="row">Gandi</th>
                            <td>mail.gandi.net / Port : 993</td>
                            <td>mail.gandi.net / Port : 587</td>
                          </tr>
                          <tr>
                            <th scope="row">Ionos</th>
                            <td>imap.ionos.fr / Port : 993</td>
                            <td>smtp.ionos.fr / Port : 587</td>
                          </tr>
                          <tr>
                            <th scope="row">Office365</th>
                            <td>outlook.office365.com / Port : 993</td>
                            <td>smtp.office365.com / Port : 587</td>
                          </tr>
                          <tr>
                            <th scope="row">Yahoo</th>
                            <td>imap.mail.yahoo.com / Port : 993</td>
                            <td>smtp.mail.yahoo.com / Port : 465</td>
                          </tr>
                          <tr>
                            <th scope="row">AOL</th>
                            <td>imap.aol.com / Port : 993</td>
                            <td>smtp.aol.com / Port : 587</td>
                          </tr>
                          <tr>
                            <th scope="row">1&1</th>
                            <td>imap.1and1.com / Port : 993</td>
                            <td>smtp.1and1.com / Port : 587</td>
                          </tr>
                          <tr>
                            <th scope="row">Zoho</th>
                            <td>imap.zoho.com / Port : 993</td>
                            <td>smtp.zoho.com / Port : 465</td>
                          </tr>
                          <tr>
                            <th scope="row">Mail.com</th>
                            <td>imap.mail.com / Port : 993</td>
                            <td>smtp.mail.com / Port : 587</td>
                          </tr>
                        </tbody>
                      </table>
                    </template>
                  </Tutorial>
                </p>
              </div>
              <div>
                <EmailProviderGmail
                  :settings="settings"
                  :selectedUserId="selectedUserId"
                />
              </div>
            </div>
            <div id="accordion">
              <div class="card" v-if="false">
                <div class="card-header" id="headingOne">
                  <h5 class="mb-0">
                    <button
                      class="btn btn-link collapsed"
                      data-toggle="collapse"
                      data-target="#collapseOne"
                      aria-expanded="false"
                      aria-controls="collapseOne"
                    >
                      {{ $t("lang.label.gmail") }}
                    </button>
                  </h5>
                </div>
                <div
                  id="collapseOne"
                  class="collapse"
                  aria-labelledby="headingOne"
                  data-parent="#accordion"
                >
                  <div class="card-body">
                    <span
                      ><p class="font-weight-light mt-2">
                        {{ $t("lang.label.explicationgmail") }}
                      </p></span
                    >
                    <div class="col-6 mt-4">
                      <h5 class="">{{ $t("lang.label.step1") }}</h5>
                      <span
                        ><p class="font-weight-light">
                          {{
                            $t(
                              "lang.label.giveauthorizationstotheOliverapplicationfortheprocessing"
                            )
                          }}
                        </p></span
                      >
                      <div class="embed-responsive embed-responsive-16by9 mt-3">
                        <iframe
                          class="embed-responsive-item"
                          src="https://player.vimeo.com/video/454079702"
                          allowfullscreen
                        ></iframe>
                      </div>
                    </div>
                    <div class="col-6 mt-4">
                      <h5 class="">{{ $t("lang.label.step2") }}</h5>
                      <span
                        ><p class="font-weight-light">
                          {{
                            $t(
                              "lang.label.authorizetheoliverapplicationinthegooglesuiteadministrationpanel"
                            )
                          }}
                        </p></span
                      >
                      <small
                        ><p class="font-weight-bold mt-2">
                          {{ $t("lang.label.iddelapplication") }}
                        </p></small
                      >
                      <div class="embed-responsive embed-responsive-16by9 mt-3">
                        <iframe
                          class="embed-responsive-item"
                          src="https://player.vimeo.com/video/454100979"
                          allowfullscreen
                        ></iframe>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="card" v-if="false">
                <div class="card-header" id="headingTwo">
                  <h5 class="mb-0">
                    <button
                      class="btn btn-link collapsed"
                      data-toggle="collapse"
                      data-target="#collapseTwo"
                      aria-expanded="false"
                      aria-controls="collapseTwo"
                    >
                      {{ $t("lang.label.outlook") }}
                    </button>
                  </h5>
                </div>
                <div
                  id="collapseTwo"
                  class="collapse"
                  aria-labelledby="headingTwo"
                  data-parent="#accordion"
                >
                  <div class="card-body">
                    <div class="col-6 mt-4">
                      <div class="embed-responsive embed-responsive-16by9 mt-3">
                        <iframe
                          class="embed-responsive-item"
                          src="https://player.vimeo.com/video/454357528"
                          allowfullscreen
                        ></iframe>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="card">
                <div class="card-header" id="headingThree">
                  <h5 class="mb-0">
                    <button
                      class="btn btn-link collapsed"
                      data-toggle="collapse"
                      data-target="#collapseThree"
                      aria-expanded="false"
                      aria-controls="collapseThree"
                    >
                      {{ $t("lang.label.smtp") }}
                    </button>
                  </h5>
                </div>
                <div
                  id="collapseThree"
                  class="collapse"
                  aria-labelledby="headingThree"
                  data-parent="#accordion"
                >
                  <div class="card-body">
                    <span
                      ><p class="font-weight-light mt-2">
                        {{ $t("lang.label.introsmtp") }}
                      </p></span
                    >
                    <div class="col-6 mt-4">
                      <table class="table table-sm">
                        <thead>
                          <tr>
                            <th scope="col">
                              {{ $t("lang.label.emailprovider") }}
                            </th>
                            <th scope="col">
                              {{ $t("lang.label.imapserverincomingmessages") }}
                            </th>
                            <th scope="col">
                              {{ $t("lang.label.smtpserveroutgoingmessages") }}
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <th scope="row">Gmail</th>
                            <td>imap.gmail.com / Port : 993</td>
                            <td>smtp.gmail.com / Port : 587</td>
                          </tr>
                          <tr>
                            <th scope="row">Outlook</th>
                            <td>imap-mail.outlook.com / Port : 993</td>
                            <td>smtp-mail.outlook.com / Port : 587</td>
                          </tr>
                          <tr>
                            <th scope="row">OVH</th>
                            <td>ssl0.ovh.net / Port : 993</td>
                            <td>ssl0.ovh.net / Port : 587</td>
                          </tr>
                          <tr>
                            <th scope="row">Gandi</th>
                            <td>mail.gandi.net / Port : 993</td>
                            <td>mail.gandi.net / Port : 587</td>
                          </tr>
                          <tr>
                            <th scope="row">Ionos</th>
                            <td>imap.ionos.fr / Port : 993</td>
                            <td>smtp.ionos.fr / Port : 587</td>
                          </tr>
                          <tr>
                            <th scope="row">Office365</th>
                            <td>outlook.office365.com / Port : 993</td>
                            <td>smtp.office365.com / Port : 587</td>
                          </tr>
                          <tr>
                            <th scope="row">Yahoo</th>
                            <td>imap.mail.yahoo.com / Port : 993</td>
                            <td>smtp.mail.yahoo.com / Port : 465</td>
                          </tr>
                          <tr>
                            <th scope="row">AOL</th>
                            <td>imap.aol.com / Port : 993</td>
                            <td>smtp.aol.com / Port : 587</td>
                          </tr>
                          <tr>
                            <th scope="row">1&1</th>
                            <td>imap.1and1.com / Port : 993</td>
                            <td>smtp.1and1.com / Port : 587</td>
                          </tr>
                          <tr>
                            <th scope="row">Zoho</th>
                            <td>imap.zoho.com / Port : 993</td>
                            <td>smtp.zoho.com / Port : 465</td>
                          </tr>
                          <tr>
                            <th scope="row">Mail.com</th>
                            <td>imap.mail.com / Port : 993</td>
                            <td>smtp.mail.com / Port : 587</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else>
          <keep-alive v-for="tab in tabs" :key="tab.id">
            <component :is="tab.component" v-if="activeTabId == tab.id" />
          </keep-alive>
        </div>
      </div>
    </section>
  </div>
</template>
    <script>
import Vue from "vue";
import { mapState, mapActions } from "vuex";
import Header from "@/components/Header.vue";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import {
  usersService,
  smtpMailboxesService,
  campaignsService,
} from "@/_services";
import { lenguagesService } from "@/_services";
import i18n from "@/_helpers/i18n";
import $ from "jquery";
import EmailProviderGmail from "@/components/Account/EmailProviderGmail";
import EmailProviderSMTP from "@/components/Account/EmailProviderSMTP";
import EmailTemplate from "@/components/Account/EmailTemplate";
import Tutorial from "@/components/Tutorial.vue";

export default {
  props: {
    selectedUserId: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      loading: true,
      emailProvider: "Gmail",
      emailAccount: "",
      isChecked: false,
      settings: {},
      active: false,
      errors: [],
      info: [],
      isSmtpServer: false,
      isGmailServer: false,
      isExchangeServer: false,
      addAccount: false,
      tabs: [
        {
          id: 1,
          title: this.$t("lang.emailsettings.synchronization"),
        },
        {
          id: 2,
          title: this.$t("lang.emailsettings.templates"),
          component: "EmailTemplate",
          roles: [2, 3],
        },
      ],
      activeTabId: 1,
    };
  },

  components: {
    Header,
    LoadingSpinner,
    EmailProviderGmail,
    EmailProviderSMTP,
    Tutorial,
    EmailTemplate,
  },

  computed: {
    ...mapState({
      headerTab: (state) => state.header.tab,
    }),

    user() {
      return this.$store.state.authentication.user;
    },
    isGmailSelected() {
      return this.emailProvider === "Gmail";
    },
    isExchangeSelected() {
      return this.emailProvider === "Exchange";
    },
    isSmtpSelected() {
      return this.emailProvider === "SMTP";
    },
  },

  created() {
    this.getEmailSettings();
  },

  methods: {
    ...mapActions("header", {
      changeHeaderTab: "changeTab",
    }),
    changeEmailProvider(provider) {
      this.emailProvider = provider;
    },
    isSmtp() {
      this.isSmtpServer = true;
      this.isGmailServer = false;
      this.isExchangeServer = false;
      this.emailProvider = "SMTP";
    },
    isGmail() {
      this.isGmailServer = true;
      this.isSmtpServer = false;
      this.isExchangeServer = false;
      this.emailProvider = "Gmail";
    },
    isExchange() {
      this.isExchangeServer = true;
      this.isSmtpServer = false;
      this.isGmailServer = false;
      this.emailProvider = "Exchange";
    },
    changeTab(index) {
      this.activeTabId = this.tabs[index]["id"];
    },
    getEmailSettings() {
      this.loading = true;
      /*smtpMailboxesService.getConfig()
            .then( result =>{
                if(result){
                    this.settings = result;
                    this.isSmtp();
                }
            });*/

      usersService
        .getEmailSettings(this.selectedUserId)
        .then((result) => {
          if (result) {
            if (this.settings.email) {
              if (this.settings.activated == 0) {
                this.settings = result;
                if (result.provider == "gmail") {
                  this.isGmail();
                } else if (result.provider == "eas") {
                  this.isExchange();
                } else if (result.provider == "custom") {
                  this.isSmtp();
                }
              }
            } else {
              this.settings = result;
              if (result.provider == "gmail") {
                this.isGmail();
              } else if (result.provider == "eas") {
                this.isExchange();
              } else if (result.provider == "custom") {
                this.isSmtp();
              }
            }
            let isEmailSync = false;
            if (result.email && result.activated == 1) {
              isEmailSync = true;
            }
            this.setIsEmailSync(isEmailSync);
          }
        })
        .then((result) => {
          this.loading = false;
        });
    },
    addNewAccount() {
      this.isSmtpServer = false;
      this.isGmailServer = false;
      this.isExchangeServer = false;
      this.addAccount = true;
      this.settings = {};
    },
    cancel() {
      this.getEmailSettings();
      this.addAccount = false;
    },
    reconnect() {
      this.getEmailSettings();
      this.addAccount = true;
    },
    deactivate() {
      let provider = this.settings.provider;
      if (
        provider == "gmail" ||
        provider == "eas" ||
        provider == "ews" ||
        provider == "custom"
      ) {
        campaignsService.getActiveCampaigns().then((result) => {
          if (result.total > 0) {
            this.$swal({
              icon: "error",
              type: "error",
              title: this.$t("lang.label.attention"),
              text: this.$t("lang.label.youcannotunsync"),
              showCancelButton: false,
            });
          } else {
            this.loading = true;
            this.settings = {};
            usersService
              .deactivateEmailSettings(this.selectedUserId)
              .then((result) => {
                this.getEmailSettings();
                this.addAccount = false;
              });
          }
        });
      } else {
        this.loading = true;
        this.settings = {};
        smtpMailboxesService.deactivate().then((result) => {
          this.getEmailSettings();
          this.addAccount = false;
        });
      }
    },

    setIsEmailSync(isEmailSync) {
      const { dispatch } = this.$store;
      dispatch("authentication/setIsEmailSync", isEmailSync);
    },
  },
};
</script>
    <style>
.email-account .btn-light {
  width: 160px;
  height: 100px;
}
.email-account .icon img {
  width: 25px;
}
.email-account .icon-account img {
  width: 40px;
}
.email-account .icon-envelope-open-o:before {
  font-size: 25px;
}

.input-group-text.icon-check-circle {
  color: #52be80;
}
</style>
    