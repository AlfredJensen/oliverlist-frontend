<template>
  <div class="person-sheet">
    <LoadingSpinner v-if="loading" />
    <main class="" v-if="!loading">
      {{ udpdateHeader("users", selected.user.name) }}
      <div class="contenedor" v-if="selected">
        <div class="contentCenter all">
          <div class="row mt-4">
            <div class="col-12">
              <div class="card person rounded">
                <div class="card-top rounded-top">
                  <div
                    v-if="
                      selected.user.client_id != null ||
                      selected.user.role_id != '1'
                    "
                    class="d-flex justify-content-end p-4"
                  >
                    <div class="">
                      <button
                        type="button"
                        id="dropMenuUser"
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                        class="
                          btn btn-light
                          rounded-pill
                          menu-btn
                          dropdown-toggle
                        "
                      >
                        <small><i class="icon-ellipsis-v"></i></small>
                      </button>
                      <div class="dropdown-menu">
                        <form class="px-4 py-3">
                          <div class="form-group mb-2">
                            <label for="modify-credid">Credit</label>
                            <input
                              type="number"
                              min="1"
                              v-model="amount"
                              class="form-control"
                              id="modify-credit"
                              placeholder="Example: 10.00"
                            />
                          </div>
                          <div v-if="error">
                            <small style="color: #dc3545"
                              ><i class="icon-warning"></i> Enter value greater
                              than zero.</small
                            >
                          </div>
                          <button
                            type="button"
                            @click="modifyCredit()"
                            class="btn btn-primary btn-sm mt-2"
                            :disabled="!disabled"
                          >
                            Add
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="card-body pxmax-4">
                  <div class="row">
                    <div class="col-md-2">
                      <div class="wrapper-img-person">
                        <img
                          :src="selected.user.avatar"
                          class="rounded-circle img-profile"
                          alt="person image"
                          v-if="selected.user.avatar"
                        />
                        <img
                          src="@/assets/images/emptyperson.png"
                          class="rounded-circle img-profile"
                          alt="person image"
                          v-else
                        />
                      </div>
                      <h3>
                        {{ selected.user.name + " " + selected.user.lastname }}
                      </h3>
                      <h5 class="my-2">
                        <span class="mr-2"
                          >{{ $t("lang.label.currentcredit") }} :
                        </span>
                        <span>{{ selected.budget }} €</span>
                      </h5>
                      <h5 class="my-2">
                        <span class="mr-2"
                          >{{ $t("lang.label.totalexpenses") }} :
                        </span>
                        <span>{{ selected.expenses }} €</span>
                      </h5>
                    </div>

                    <div
                      class="col-md-3"
                      v-if="active || !selected.user.verificationcode"
                    >
                      <h5 class="my-2">
                        <span class="mr-2"> Account Verified </span>
                        <i class="text-success icon-checkmark"></i>
                      </h5>
                      <div v-if="selected.user.login_attempt < 4">
                        <div>
                          <h5>
                            <span class="mr-2"> Account Active </span>
                            <i class="text-success icon-checkmark"></i>
                          </h5>
                          <small
                            >Remaining attempts:
                            {{ 4 - selected.user.login_attempt }}
                          </small>
                        </div>
                      </div>
                      <div v-if="selected.user.login_attempt == 4">
                        <div>
                          <h5>
                            <span class="mr-2"> Account Blocked </span>
                            <i class="text-danger icon-close"></i>
                          </h5>
                          <small class="text-danger"
                            >( Account locked for repeated attempts )</small
                          >
                        </div>
                        <button
                          @click="unBlock()"
                          class="mt-3 btn btn-sm btn-success"
                        >
                          unblock
                        </button>
                      </div>
                    </div>
                 
                    <div
                      class="col-md-3"
                      v-if="!active && selected.user.verificationcode"
                    >
                      <h5 class="my-2">
                        <span class="mr-2"> Account not verified yet. </span>
                        <i class="text-danger icon-close"></i>
                      </h5>
                      <h5>
                        Code verification
                        <small class="ml-1">
                          {{ selected.user.verificationcode }}
                        </small>
                      </h5>
                      <button
                        @click="approveVerification()"
                        class="ml-1 btn btn-sm btn-primary"
                      >
                        Force activation
                        <i class="text-white icon-checkmark"></i>
                      </button>
                      <small class="ml-1">
                        active this account without verification.</small
                      >
                    </div>
                     </div>
                  <div class="row">
                    <div class="col-md-6">
                      <div class="row">
                        <div class="col-md-12">

                          <div class="mb-3">
                            <h5 class="mr-1">Rol</h5>
                            <select v-model="role_id">
                              <option value="2">
                                Admin
                              </option>
                              <option value="3">
                                Non-admin
                              </option>
                              <option value="4">
                                Billing
                              </option>
                            </select>
                          </div>

                          <h5 class="my-2">
                            <span class="mr-2"> Star : </span>
                            <input type="checkbox" v-model="star" />
                            <small class="ml-1" v-if="!star"
                              ><i class="icon-star"></i> inactive
                            </small>
                            <small class="ml-1 text-success" v-if="star"
                              ><i class="icon-star"></i> active
                            </small>
                          </h5>
                          <h5 class="my-2">
                            <span class="mr-2"> Trial period : </span>
                            <input
                              type="checkbox"
                              v-model="trial_period_ended"
                            />
                            <small class="ml-1 text-danger" v-if="trialEnd()"
                              >finished
                            </small>
                            <small class="ml-1 text-success" v-if="!trialEnd()"
                              >active
                            </small>
                          </h5>
                        </div>

                        <div class="col-md-12">
                          <div>
                            <h5 class="my-2">
                              <span class="mr-2">
                                Client Meeting Price €:
                              </span>
                            </h5>
                            <input
                              type="number"
                              v-model="meeting_price"
                              class="form-control"
                              min="1"
                            />
                          </div>
                          <h5 class="my-2">
                            <span class="mr-2"> Free trial emails : </span>
                          </h5>
                          <input
                            type="number"
                            v-model="trial_emails"
                            min="1"
                            :disabled="trialEnd()"
                            class="form-control"
                          />
                          <h5 class="my-2">
                            <span class="mr-2">
                              Free trial days : ({{ getFinishDate() }})
                            </span>
                          </h5>
                          <input
                            type="number"
                            v-model="trial_days"
                            min="1"
                            class="form-control"
                            :disabled="trialEnd()"
                          />
                          <h5 class="my-2">
                            <span class="mr-2"> Warm Update : </span>
                          </h5>
                          <input
                            type="date"
                            v-model="warm_update"
                            class="form-control"
                          />
                          <h5 class="my-2">
                            <span class="mr-2"> Link Calendar : </span>
                          </h5>
                          <input
                            type="text"
                            v-model="calendar_link"
                            class="form-control"
                          />
                          <h5 class="my-2">
                            <span class="mr-2"> Link Landing Page : </span>
                          </h5>
                          <input
                            type="text"
                            v-model="landing_link"
                            class="form-control"
                          />
                          <h5 class="my-2">
                            <span class="mr-2"> Calendly Token : </span>
                          </h5>
                          <input
                            type="text"
                            v-model="calendly"
                            class="form-control"
                          />
                        </div>
                        <div class="col-md-12">
                          <div class="mt-3">
                            <div v-if="mygroups.length > 0" class="p-2 card">
                              <h6>My current groups</h6>
                              <ul>
                                <li v-for="group in mygroups">
                                  {{ group.name }} -
                                  {{ getRole(group.team_role_id) }}
                                  <i
                                    class="
                                      icon-close
                                      text-danger
                                      cursor-pointer
                                    "
                                    @click="deleteMember(group.id)"
                                  ></i>
                                </li>
                              </ul>
                            </div>
                            <h6 class="mr-1">Assign Group</h6>
                            Select:
                            <select v-model="group" @change="selectGroup">
                              <option value="">-none-</option>
                              <option v-for="group in groups" :value="group.id">
                                {{ group.name }}
                              </option>
                            </select>
                            <span v-if="!group">
                              Or create:
                              <input type="text" v-model="groupnew" />
                            </span>
                          </div>
                          <div class="mb-3" v-if="group || groupnew">
                            <strong class="mr-1">Rol</strong>
                            <select v-model="group_role">
                              <option value="2">
                                Project manager (all opportunities access)
                              </option>
                              <option value="3">
                                Viewer (only calendar opportunity access)
                              </option>
                              <option value="1">
                                Member (own opportunities access)
                              </option>
                            </select>
                          </div>                          
                        </div>
                        <div class="col-md-12 mt-4">
                          <button
                            @click="trialModify()"
                            class="ml-1 btn btn-sm btn-primary w-100"
                          >
                            update
                          </button>
                        </div>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <EmailSettings :selectedUserId="selectedUserId" v-if="selected.user.role_id != 1"/>
                    </div> 
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="row mt-4">
            <div class="col-12">
              <h5>
                {{ $t("lang.label.contactinfo") }}
              </h5>
              <div class="card p-4 mt-4">
                <div class="px-4">
                  <ul>
                    <li class="my-4">
                      <i class="icon-building-o mr-3"></i>
                      <span class="font-weight-bold">{{
                        selected.client.name
                      }}</span>
                    </li>
                    <li class="my-4">
                      <i class="icon-arrow-down mr-3"></i>
                      <span class="">{{
                        selected.user.creation_date | formatDate
                      }}</span>
                    </li>
                    <li class="my-4">
                      <i class="icon-mail_outline mr-3"></i>
                      <span class="">{{ selected.user.email }}</span>
                    </li>
                    <li v-if="selected.user.phone != null" class="my-4">
                      <i class="icon-phone mr-3"></i>
                      <span class="">{{ selected.user.phone }}</span>
                    </li>
                    <li class="my-4">
                      <i class="icon-user-circle-o mr-3"></i>
                      <span class="">{{ selected.user.role_name }}</span>
                    </li>
                    <li
                      v-if="selected.user.last_connection_date != null"
                      class="my-4"
                    >
                      <i class="icon-clock mr-3"></i>
                      <span class="">{{
                        selected.user.last_connection_date
                      }}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div class="row mt-4">
            <div class="col-12">
              <h5>
                {{ $t("lang.label.campaigns") }}
              </h5>
              <div class="mt-4">
                <div class="row">
                  <div
                    v-for="(campaign, key) in selected.campaign"
                    :key="key"
                    class="col-12 col-sm-6 col-md-3 p-2"
                  >
                    <div class="card p-4">
                      <div>
                        <span class="font-weight-bold">{{
                          campaign.name
                        }}</span>
                        <span class="ml-4">
                          <button
                            @click="goToCampaign(campaign.id, campaign.name)"
                            class="btn btn-secundary themed-button"
                            type="button"
                          >
                            <i class="icon-search"></i>
                          </button>
                        </span>
                        <div class="my-2">
                          <span class="mr-2"
                            >{{ $t("lang.label.status") }} :
                          </span>
                          <span
                            class="badge"
                            :class="statusBadge(campaign.campaign_status)"
                            >{{ campaign.campaign_status }}</span
                          >
                        </div>
                      </div>
                      <!-- <div class="my-2">
                                                <span class="mr-2">{{ $t('lang.label.creationdate') }} : </span>
                                                <span>{{campaign.creation_date}}</span>
                                            </div> -->
                      <div v-for="(stat, key2) in campaign.stats" :key2="key2">
                        <div class="my-2">
                          <span class="mr-2">{{ $t(stat.name) }} : </span>
                          <span>{{ stat.activity_total }} </span>
                        </div>
                      </div>
                      <div class="my-2">
                        <span class="mr-2"
                          >{{ $t("lang.label.expenses") }} :
                        </span>
                        <span>{{ campaign.expenses }} €</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <BillingInfo :selected="selected" />
        </div>
        <!--end contentCenter -->
      </div>
    </main>
  </div>
</template>
<script>
import { mapState, mapActions } from "vuex";
import { router } from "@/_helpers";
import {
  statusBadgeMixin,
  statusPointMixin,
  pdfInvoiceMixin,
} from "@/_mixins/";
import Header from "@/components/Header.vue";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import { usersService, clientsService } from "@/_services";
import BillingInfo from "./BillingInfo.vue";
import EmailSettings from "@/components/Account/EmailSettings.vue";

export default {
  mixins: [statusBadgeMixin, statusPointMixin, pdfInvoiceMixin],
  data() {
    return {
      amount: 1,
      active: false,
      groups: [],
      meeting_price: 1,
      mygroups: [],
      group_role: 1,
      group: false,
      groupnew: "",
      error: false,
      client_star: "-1",
      client_trial_period_ended: "-1",
      client_trial_days: "-1",
      client_trial_emails: false,
      login_attempt: 0,
      model_landing_link:false,
      model_calendar_link:false,
      model_warm_update:false,
      model_calendly:false,
      model_role_id:false,
    };
  },
  props: {
    selectedUserId: String,
  },

  components: {
    Header,
    LoadingSpinner,
    BillingInfo,
    EmailSettings
  },
  watch: {
    Page() {
      this.$route.fullPath == "/users"
        ? this.changeHeaderTab({ tab: "ALL" })
        : "";
      return;
    },
  },
  computed: {
    ...mapState({
      loading: (state) => state.users.loading,
      selected: (state) => state.users.selected.data,
      currentUser: (state) => state.authentication.user,
    }),
    ...mapState({
      headerTab: (state) => state.header.tab,
    }),
    disabled: function () {
      if (this.amount != "" && this.amount > 0) {
        return true;
      }
    },
    Page() {
      this.$route.fullPath == "/users"
        ? this.changeHeaderTab({ tab: "ALL" })
        : "";
      return;
    },
    trial_period_ended: {
      get: function () {
        if (this.client_trial_period_ended !== "-1")
          return this.client_trial_period_ended;
        return this.selected.client.trial_period_ended == "1";
      },
      set: function (newValue) {
        this.client_trial_period_ended = newValue;
      },
    },
    star: {
      get: function () {
        if (this.client_star !== "-1") return this.client_star;

        this.meeting_price = this.selected.client.meeting_price;

        return this.selected.client.dont_charge_payments == "1";
      },
      set: function (newValue) {
        this.client_star = newValue;
      },
    },
    trial_days: {
      get: function () {
        if (this.client_trial_days !== "-1") return this.client_trial_days;
        return this.selected.client.trial_days;
      },
      set: function (newValue) {
        this.client_trial_days = newValue;
      },
    },
    trial_emails: {
      get: function () {
        if (this.client_trial_emails !== false) return this.client_trial_emails;
        return this.selected.client.trial_emails;
      },
      set: function (newValue) {
        this.client_trial_emails = newValue;
      },
    },
    calendar_link: {
      get: function () {
        if (this.model_calendar_link !== false) return this.model_calendar_link;
        return this.selected.user.calendar_link;
      },
      set: function (newValue) {
        this.model_calendar_link = newValue;
      },
    },
    landing_link: {
      get: function () {
        if (this.model_landing_link !== false) return this.model_landing_link;
        return this.selected.user.landing_link;
      },
      set: function (newValue) {
        this.model_landing_link = newValue;
      },
    },
    warm_update: {
      get: function () {
        if (this.model_warm_update !== false) return this.model_warm_update;
        return this.selected.user.warm_update;
      },
      set: function (newValue) {
        this.model_warm_update = newValue;
      },
    },
    calendly: {
      get: function () {
        if (this.model_calendly !== false) return this.model_calendly;
        return this.selected.user.calendly;
      },
      set: function (newValue) {
        this.model_calendly = newValue;
      },
    },
    role_id: {
      get: function () {
        if (this.model_role_id !== false) return this.model_role_id;
        return this.selected.user.role_id;
      },
      set: function (newValue) {
        this.model_role_id = newValue;
      },
    }
  },

  created() {
    this.getUser();
    if (this.currentUser !== undefined && this.currentUser.role_id == 1) {
      usersService.getAllGroups().then((result) => {
        this.groups = result;
      });
    }
    this.myGroups();
  },

  methods: {
    ...mapActions("header", {
      changeHeaderTab: "changeTab",
    }),
    ...mapActions("users", {
      getUserById: "getUserById",
    }),
    ...mapActions("headertopbar", {
      setCurrentRoute: "setRoute",
      setCurrentRouteChild: "setRouteChild",
    }),
    udpdateHeader(route, currentChild) {
      this.setCurrentRoute({ page: route });
      this.setCurrentRouteChild({ child: currentChild });
    },
    selectGroup() {
      if (this.group) {
        this.groupnew = "";
      }
    },
    addDays(date, days) {
      const copy = new Date(Number(date));
      copy.setDate(date.getDate() + days);
      return copy;
    },

    approveVerification() {
      this.active = true;
      usersService.verificationCodeAdmin(this.selected.user.id);
    },
    getRole(id) {
      if (id == 1) {
        return "Member";
      }
      if (id == 2) {
        return "Project manager";
      }
      if (id == 3) {
        return "Viewer";
      }
    },
    unBlock() {
      this.selected.user.login_attempt = 0;
      usersService.unBlock(this.selected.user.id);
    },

    getFinishDate() {
      let dateinit = this.selected.client.creation_date;
      dateinit = dateinit.split("-");
      let result = new Date(
        dateinit[0] + "-" + dateinit[1] + "-" + dateinit[2]
      );
      let trialdays;
      if (this.client_trial_days != "-1") {
        trialdays = parseInt(this.client_trial_days);
      } else {
        trialdays = parseInt(this.selected.client.trial_days);
      }
      if (isNaN(trialdays)) trialdays = 0;

      return this.addDays(result, trialdays).toLocaleDateString();
    },
    trialEnd() {
      if (this.client_trial_period_ended != "-1") {
        return this.client_trial_period_ended === true;
      }
      return this.trial_period_ended;
    },
    refreshCredit() {
      this.searchUser();
    },
    myGroups() {
      usersService.getUserGroupList(this.selectedUserId).then((result) => {
        this.mygroups = result;
      });
    },
    deleteMember(team_user_id) {
      usersService.deleteMember(team_user_id).then((result) => {
        this.getUser();
        this.myGroups();
      });
    },
    trialModify() {
      if (this.groupnew) {
        this.group = this.groupnew;
      }
      clientsService
        .modifyTrial(
          [this.selectedUserId,
          this.trial_days,
          this.trial_emails,
          this.trial_period_ended,
          this.star,
          this.group,
          this.group_role,
          this.meeting_price,
          this.warm_update,
          this.landing_link,
          this.calendar_link,
          this.calendly,
          this.role_id]
        )
        .then((result) => {
          this.getUser();
          this.myGroups();
          this.groupnew = "";
        });
    },
    modifyCredit() {
      if (this.amount > 0) {
        this.$swal({
          type: "warning",
          title: this.$t("lang.label.areyousure"),
          text: "Modify Credit",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33a2c",
          confirmButtonText: this.$t("lang.button.yes"),
          cancelButtonText: this.$t("lang.button.cancel"),
        }).then((result) => {
          if (result.value) {
            clientsService
              .modifyCredit(this.selectedUserId, this.amount)
              .then((response) => {
                this.$swal({
                  type: "success",
                  title: this.$t("lang.label.great"),
                  text: "Credit modified successfully",
                  showConfirmButton: false,
                  timer: 3000,
                });
              })
              .then((response) => {
                this.refreshCredit();
              });
          }
        });
      } else {
        this.error === true;
      }
    },
    getUser() {
      this.searchUser();
    },
    searchUser() {
      this.getUserById({
        id: this.selectedUserId,
      });
    },
    changeTab(selectedTab) {
      this.changeHeaderTab({ tab: selectedTab });
    },
    goToCampaign(campaign_id, campaign_name) {
      this.changeHeaderTab({ tab: "STATS" });
      router.push({
        name: "campaigns",
        params: { id: campaign_id.toString(), name: campaign_name.toString() },
      });
    },
  },
};
</script>
<style>
#dropMenuUser.btn-light {
  border-color: transparent;
  background-color: transparent;
  outline: none !important;
}
#dropMenuUser.btn-light.menu-btn {
  width: 20px;
  height: 25px;
}
#dropMenuUser.btn-light.focus,
#dropMenuUser.btn-light:focus {
  box-shadow: none !important;
}
#dropMenuUser.btn-light.menu-btn small {
  position: absolute;
  top: 3px;
  left: 10px;
}
#dropMenuUser.btn-light.menu-btn small i {
  color: #ffffff;
  font-size: 18px;
}
</style>
