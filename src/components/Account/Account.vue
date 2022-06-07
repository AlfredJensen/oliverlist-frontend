<template>
  <div>
    <LoadingSpinner v-if="loading" />
    <section class="account" v-if="!loading">
      <!-- {{udpdateHeader('account')}} -->
      <div class="card p-4">
        <div>
          <div class="px-4 pb-2 pt-4" v-if="permissionFront()">
            <div class="row">
              <div class="px-3 w-100">
                <div clas="row pb-3">
                  <h5 class="mb-4 d-inline">
                    {{ $t("lang.credits.creditusage") }}
                  </h5>
                  <div class="float-right">
                    <Tutorial
                      id="smtpimap"
                      :linkText="$t('lang.label.howitworks')"
                      linkClass="small ml-2 mt-2"
                      :videoUrl="
                        'https://www.youtube.com/embed/' +
                        $t('lang.videos.credits')
                      "
                    />
                  </div>
                </div>
              </div>
            </div>

            <div class="d-block">
              <div class="float-left mt-3">
                <small v-if="toastNotificationData.credits.from"
                  >{{
                    $t("lang.credits.fromto", {
                      from: toastNotificationData.credits.from,
                      to: toastNotificationData.credits.to,
                    })
                  }}
                </small>
              </div>

              <div class="float-right mt-3">
                <small v-if="toastNotificationData.credits.attempts">
                  {{
                    $t("lang.credits.using", {
                      using: toastNotificationData.credits.attempts,
                      of: toastNotificationData.credits.total,
                    })
                  }}
                  <router-link
                    class="btn btn-primary themed-button btn-sm ml-2 ml-2"
                    to="/upgrade"
                  >
                    {{ $t("lang.button.upgrade") }}
                  </router-link>
                </small>

                <small v-else>
                  {{
                    $t("lang.credits.using", {
                      using: "0",
                      of: toastNotificationData.credits.total,
                    })
                  }}
                </small>
              </div>

              <div class="float-left my-2 w-100">
                <div class="content-bar">
                  <div class="progress">
                    <div
                      class="progress-bar"
                      v-bind:style="{ width: calculatePercentage() + '%' }"
                      role="progressbar"
                      aria-valuenow="calculatePercentage()"
                      aria-valuemin="0"
                      aria-valuemax="100"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="card mt-3">
          <div class="title px-4 pb-2 pt-4">
            <div class="d-flex">
              <div>
                <h4>{{ dataUser.user.name + " " + dataUser.user.lastname }}</h4>
                <p class="text-left">
                  {{ $t("lang.label.userid") }} :
                  <span>{{ dataUser.user.id }}</span>
                </p>
              </div>
            </div>
          </div>
          <div class="row">
          <div class="col-md-6">
          <div class="p-4">
            <h6 class="font-weight-bold pb-4">
              {{ $t("lang.label.general") }}
            </h6>
            <div>
              <div class="my-2">
                <label class="col-form-label">Avatar</label>
                <div class="d-block mb-1 border ml-3">
                  <img
                    :src="this.dataUser.user.avatar"
                    alt=""
                    class="rounded border-color mr-4"
                    width="100px"
                  />
                  <a
                    class="
                      btn
                      cursor-pointer
                      font-weight-bolder
                      btn-sm btn-outline-secondary
                    "
                    @click="toggleShow"
                    >{{ $t("lang.button.setimage") }}</a
                  >
                  <uploadImage
                    field="img"
                    @crop-success="cropSuccess"
                    @crop-upload-success="cropUploadSuccess"
                    @crop-upload-fail="cropUploadFail"
                    v-model="show"
                    :width="300"
                    :height="300"
                    :params="params"
                    :headers="headers"
                    lang-type="en"
                    img-format="png"
                  >
                  </uploadImage>
                </div>
              </div>
            </div>

            <div class="form-group ">
              <label for="YourName" class="col-form-label">{{
                $t("lang.label.firstname")
              }}</label>
              <div>
                <input
                  type="text"
                  class="form-control"
                  :disabled="rolCampo('YourName') == true"
                  id="YourName"
                  v-model="dataUser.user.name"
                />
              </div>
            </div>
            <div class="form-group">
              <label for="LastName" class="col-form-label">{{
                $t("lang.label.lastname")
              }}</label>
              <div>
                <input
                  type="text"
                  class="form-control"
                  :disabled="rolCampo('YourLastName') == true"
                  id="YourLastName"
                  v-model="dataUser.user.lastname"
                />
              </div>
            </div>
            <div class="form-group">
              <label for="YourEmail" class="col-form-label">{{
                $t("lang.label.email")
              }}</label>
              <div>
                <input
                  type="text"
                  class="form-control"
                  :disabled="rolCampo('YourEmail') == true"
                  id="YourEmail"
                  v-model="dataUser.user.email"
                />
              </div>
            </div>

            <div class="form-group">
              <label for="YourEmail" class="col-form-label">{{
                $t("lang.label.language")
              }}</label>
              <div>
                <select
                  v-model="dataUser.user.language_id"
                  class="form-control"
                >
                  <option
                    v-for="(lang, i) in langs"
                    :key="`Lang${i}`"
                    :value="lang.id"
                  >
                    {{ lang.name }}
                  </option>
                </select>
              </div>
            </div>
          </div>
          </div>
          <div class="col-md-6">
          <div v-if="dataUser.client">
            <div class="title px-4 pb-2 pt-4">
              <div class="d-flex">
                <div>
                  <h4>{{ dataUser.client.name }}</h4>
                  <p class="text-left">
                    {{ $t("lang.label.companyid") }} :
                    <span>{{ dataUser.client.id }}</span>
                  </p>
                </div>
              </div>
            </div>
            <div class="body p-4">
              <h6 class="font-weight-bold pb-6">
                {{ $t("lang.label.general") }}
              </h6>
              <div class="form-group">
                <label for="CompanyName" class="col-form-label">{{
                  $t("lang.label.companyname")
                }}</label>
                <div>
                  <input
                    type="text"
                    class="form-control"
                    :disabled="rolCampo('CompanyName') == true"
                    id="CompanyName"
                    v-model="dataUser.client.name"
                  />
                </div>
              </div>
              <div class="form-group ">
                <label
                  for="CompanyEmail"
                  class="col-form-label"
                  >{{ $t("lang.label.companyemail") }}</label
                >
                <div class="">
                  <input
                    type="text"
                    class="form-control"
                    :disabled="rolCampo('CompanyEmail') == true"
                    id="CompanyEmail"
                    v-model="dataUser.client.email"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="body p-4" v-if="permissionFront()">
            <h6
              class="font-weight-bold"
              v-if="dataUser.users.length > 0"
            >
              {{ $t("lang.label.team") }}
            </h6>
            <div class="form-group row" v-if="dataUser.users.length > 0">
              <label for="CurrentPassword" class="ml-4 col-form-label">{{
                $t("lang.label.teammates")
              }}</label>
              <div class="">
                <ul class="d-flex">
                  <li v-for="(usr, key) in dataUser.users" :key="key">
                    <div class="container-circle-users">
                      <div class="circle">
                        <span class="font-weight-bold">{{
                          (usr.name + usr.lastname) | firstLetters
                        }}</span>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          </div>
        </div>
        <!--//Calendly-->
        <div class="row" >
        <div class="col-md-6 mt-3"  v-if="permissionFront()">
          <div class="title px-4 pb-2 pt-4">
            <div class="d-flex">
              <div>
                <h4>Calendly</h4>
              </div>
            </div>
          </div>
          <div class="body p-4">
            <div class="form-group mt-2" >

              <input
                type="text"
                class="form-control"
                v-model="dataUser.user.calendly"
              />

              <a href="https://calendly.com/integrations" target="_blank" class="text-primary">https://calendly.com/integrations</a>

              <div v-if="calendly" class="mt-2">
                <div class="float-left mr-3">
                  <img class="" :src="calendly.avatar_url" width="100px" height="100px"/>
                </div>
                <div class="d-inline">
                  <strong class="d-block">{{calendly.name}}</strong>
                  <span class="d-block">{{calendly.email}}</span>
                  <span class="d-block">{{calendly.timezone}}</span>
                  <span class="d-block"><a class="text-primary" target="_blank" :href="calendly.scheduling_url">{{calendly.scheduling_url}}</a></span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!--//GROUP-->
        <div class="col-md-6 mt-3" v-if="dataUser.user.team_role_id && permissionFront()" >
          <div class="title px-4 pb-2 pt-4">
            <div class="d-flex">
              <div>
                <h4>Group</h4>
              </div>
            </div>
          </div>
          <div class="body p-4">
            <div class="form-group mt-2">
              <ul>
                <li v-for="team in myteam" >
                  <strong class="mr-2">{{ team.name }}</strong> <i :class="getRoleGroup(team.team_role_id)"></i> {{ team.username }}
                </li>
              </ul>
            </div>
          </div>
        </div>
        <!--//Card-->
        <div class="col-md-6 mt-3">
          <div class="title px-4 pb-2 pt-4">
            <div class="d-flex">
              <div>
                <h4>Black List</h4>
              </div>
            </div>
          </div>
          <div class="body p-4">
            <div class="form-group mt-2">
              <multiselect
                v-model="domains_excluded"
                v-bind:tag-placeholder="$t('lang.search.add')"
                v-bind:placeholder="
                  $t('lang.label.enterthedomainstoexcludeseparatedbycommas')
                "
                label="domains_excluded"
                track-by="id"
                :options="domains_excluded"
                :multiple="true"
                :taggable="true"
                :searchable="true"
                :showLabels="true"
                :disabled="false"
                openDirection="below"
                class="small"
                @remove="removeTag($event, domains_excluded)"
                @tag="addTag($event, domains_excluded)"
              >
                <template slot="tag" slot-scope="props">
                  <span class="mr-1 p-1 text-white rounded bg-primary">
                    <span v-text="props.option.domains_excluded"></span>
                    <i
                      @click="removeTag(props.option, domains_excluded)"
                      class="icon-close pl-1 cursor-pointer"
                    ></i>
                  </span>
                </template>
              </multiselect>

              <small class="form-text text-muted">{{
                $t("lang.label.enterthedomainstoexcludeseparatedbycommas")
              }}</small>
            </div>
          </div>
        </div>

        </div>
        <div class="my-4 text-right mr-4">
          <button class="btn btn-success btn" @click="SaveAll()">
            {{ $t("lang.button.save") }}
          </button>
        </div>
        </div>
        
        <div class="card mt-3">
          <div class="title px-4 pb-2 pt-4">
            <div class="d-flex">
              <div>
                <h4>{{ $t("lang.label.changeyourpassword") }}</h4>
              </div>
            </div>
          </div>
          <div class="body p-4">
            <div class="input-group mb-3">
              <label
                for="CurrentPassword"
                class="col-12 col-sm-4 col-form-label"
                >{{ $t("lang.label.currentpassword") }}</label
              >
              <input
                type="password"
                class="form-control"
                id="CurrentPassword"
                v-model="passwords.currentPass"
              />
              <div class="input-group-append">
                <button
                  class="btn btn-outline-link"
                  type="button"
                  id="button-addon2"
                  @mousedown="showText('CurrentPassword')"
                  @mouseup="hideText('CurrentPassword')"
                  @mouseout="hideText('CurrentPassword')"
                >
                  <span class="icon-eye"></span>
                </button>
              </div>
            </div>
            <div class="input-group mb-3">
              <label for="NewPassword" class="col-12 col-sm-4 col-form-label">{{
                $t("lang.label.newpassword")
              }}</label>
              <input
                type="password"
                class="form-control"
                id="NewPassword"
                v-model="passwords.newPass"
              />
              <div class="input-group-append">
                <button
                  class="btn btn-outline-link"
                  type="button"
                  id="button-addon2"
                  @mousedown="showText('NewPassword')"
                  @mouseup="hideText('NewPassword')"
                  @mouseout="hideText('NewPassword')"
                >
                  <span class="icon-eye"></span>
                </button>
              </div>
            </div>
            <div class="input-group mb-3">
              <label
                for="ConfirmPassword"
                class="col-12 col-sm-4 col-form-label"
                >{{ $t("lang.label.confirmpassword") }}</label
              >
              <input
                type="password"
                class="form-control"
                id="ConfirmPassword"
                v-model="passwords.newPassValid"
              />
              <div class="input-group-append">
                <button
                  class="btn btn-outline-link"
                  type="button"
                  id="button-addon2"
                  @mousedown="showText('ConfirmPassword')"
                  @mouseup="hideText('ConfirmPassword')"
                  @mouseout="hideText('ConfirmPassword')"
                >
                  <span class="icon-eye"></span>
                </button>
              </div>
            </div>
            <div
              class="alert alert-danger alert-dismissible fade show"
              role="alert"
              v-if="errorPass.length"
            >
              <ul>
                <li><strong>Error!</strong></li>
                <li v-for="(error, key) in errorPass" :key="key">
                  {{ error }}
                </li>
              </ul>
              <button
                type="button"
                class="close"
                data-dismiss="alert"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="my-4 text-right mr-4">
              <button class="btn btn-success btn-sm" @click="validate()">
                {{ $t("lang.button.confirmnewpassword") }}
              </button>
            </div>
          </div>
        </div>
        <!--//Card-->
      </div>
    </section>
  </div>
</template>
<script>
import Vue from "vue";
import { mapState, mapActions, mapMutations } from "vuex";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import { usersService } from "@/_services";
import { lenguagesService } from "@/_services";
import i18n from "@/_helpers/i18n";
import $ from "jquery";
import imageUser from "@/assets/images/emptyperson.png";
import uploadImage from "vue-image-crop-upload";
import Tutorial from "@/components/Tutorial.vue";
import Multiselect from "vue-multiselect";
Vue.component("multiselect", Multiselect);

export default {
  data() {
    return {
      myteam:[],
      calendly:false,
      dataUser: {
        user: {},
        client: {},
        users: {},
        domains_excluded: "",
      },
      domains_excluded: [],
      errorPass: [],
      passwords: {
        currentPass: "",
        newPass: "",
        newPassValid: "",
      },
      loading: true,
      langs: [],
      image: { url: require("@/assets/images/emptyperson.png") },
      show: false,
      params: {
        token: "123456798",
        name: "avatar",
      },
      headers: {
        smail: "*_~",
      },
      campos: [
        {
          nombre: "YourName",
          roles: [1, 2, 3],
        },
        {
          nombre: "YourLastName",
          roles: [1, 2, 3],
        },
        {
          nombre: "YourEmail",
          roles: [],
        },
        {
          nombre: "CompanyName",
          roles: [1, 2],
        },
        {
          nombre: "CompanyEmail",
          roles: [1, 2],
        },
      ],
    };
  },

  watch: {
    "dataUser.user.name"() {
      this.dataUser.user.name = this.$sanitize(this.dataUser.user.name);
    },
    "dataUser.user.lastname"() {
      this.dataUser.user.lastname = this.$sanitize(this.dataUser.user.lastname);
    },
    "dataUser.user.email"() {
      this.dataUser.user.email = this.$sanitize(this.dataUser.user.email);
    },
    "dataUser.client.name"() {
      this.dataUser.client.name = this.$sanitize(this.dataUser.client.name);
    },
    "dataUser.client.email"() {
      this.dataUser.client.email = this.$sanitize(this.dataUser.client.email);
    },
  },

  components: {
    LoadingSpinner,
    uploadImage,
    Tutorial,
    Multiselect,
  },

  computed: {
    ...mapState({
      headerTab: (state) => state.header.tab,
    }),

    toastNotificationData() {
      return this.$store.state.authentication.toastNotificationData;
    },
    user() {
      return this.$store.state.authentication.user;
    },
  },

  created() {
    this.getDataUs();
    this.getLanguages();
    this.getCalendly();
    this.myTeamList();
    return (this.loading = false);

  },

  methods: {
    ...mapActions("header", {
      changeHeaderTab: "changeTab",
    }),
    ...mapActions("headertopbar", {
      setCurrentRoute: "setRoute",
      setCurrentRouteChild: "setRouteChild",
    }),
    ...mapMutations("sidebar", {
      NavigationClicked: "navigationClicked",
    }),
    udpdateHeader(route) {
      this.setCurrentRoute({ page: route });
      this.setCurrentRouteChild({ child: "" });
    },
    getRoleGroup(role_id){
      if(role_id == "1"){
        return "icon-group"
      }
      if(role_id == "2"){
        return "icon-user"
      }
      if(role_id == "3"){
        return "icon-eye"
      }
    },
    permissionFront(){
      return (this.user.team_role_id == undefined || this.user.team_role_id != 3) && this.user.role_id != 4
    },
    calculatePercentage() {
      let left = this.toastNotificationData.credits.left;
      let attempts = this.toastNotificationData.credits.attempts;
      let total = this.toastNotificationData.credits.total;
      return Math.floor((attempts / total) * 100);
    },
    myTeamList(){
      
        usersService.getGroupList().then((result) => {
          this.myteam = result
        })
      
    },
    downloadImage() {},
    toggleShow() {
      this.show = !this.show;
    },
    cropSuccess(imgDataUrl, field) {
      this.dataUser.user.avatar = imgDataUrl;
    },
    cropUploadSuccess(jsonData, field) {},
    cropUploadFail(status, field) {},

    getDataUs() {
      usersService.getUserSettings().then((result) => {
        this.dataUser = result;
        if (
          this.dataUser.client !== null && 
          this.dataUser.client.domains_excluded != undefined &&
          this.dataUser.client.domains_excluded !== ""
        ) {
          var values = this.dataUser.client.domains_excluded.split(",");
          for (var i = 0; i < values.length; i++) {
            this.domains_excluded.push({ ["domains_excluded"]: values[i] });
          }
        }
      });
    },

    rolCampo(campo) {
      for (let i = 0; i < this.campos.length; i++) {
        if (this.campos[i]["nombre"] == campo) {
          if (
            $.inArray(parseInt(this.user.role_id), this.campos[i]["roles"]) ==
            -1
          ) {
            return true;
          } else {
            return false;
          }
        }
      }

      return false;
    },

    showText(id) {
      $("#" + id).prop("type", "text");
    },
    hideText(id) {
      $("#" + id).prop("type", "password");
    },
    getLanguages() {
      lenguagesService.getAll().then((result) => {
        this.langs = result;
      });
    },

    validatePasswords() {
      return this.passwords.newPass === this.passwords.newPassValid;
    },

    checkFildsPass() {
      this.errorPass = [];
      if (!this.passwords.currentPass) {
        this.errorPass.push("The field Current Password can not be blank.");
        return false;
      }
      if (!this.passwords.newPass) {
        this.errorPass.push("The field New Password can not be blank.");
        return false;
      }
      if (!this.passwords.newPassValid) {
        this.errorPass.push("The field Confirm Password can not be blank.");
        return false;
      }
      if (
        !/^(?=(.*[a-z]){1,})(?=(.*[A-Z]){1,})(?=(.*[0-9]){1,}).{6,16}$/.test(
          this.passwords.newPass
        )
      ) {
        this.errorPass.push(this.$t("lang.validation.password"));
        return false;
      }
      if (!this.validatePasswords()) {
        this.errorPass.push(
          "The filds New Password and Confirm Password are different."
        );
        return false;
      }
      if (!this.errorPass.length) {
        return true;
      }
    },
    saveData() {
      usersService.setUserSettings(
        this.dataUser.user,
        this.dataUser.client,
        this.dataUser.user.avatar,
      );
    },
    saveCalendly() {
      usersService.saveCalendly(
        this.dataUser.user.calendly
      ).then((result) => {
          this.getCalendly()
        });
    },
    getCalendly() {
      usersService.getCalendly().then((result) => {
          this.calendly = result
        });
    },
    validate() {
      let valid = this.checkFildsPass();
      if (valid) {
        this.$swal({
          type: "warning",
          title: this.$t("lang.label.changepassword"),
          text: "",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33a2c",
          confirmButtonText: "Ok",
        }).then((result) => {
          if (result.value) {
            this.changePass();
            this.$swal({
              type: "success",
              title: this.$t("lang.label.great"),
              text: this.$t("lang.label.passwordchangedsuccessfully"),
              showConfirmButton: false,
              timer: 1500,
            });
          }
        });
      }
    },
    changePass() {
      usersService.changePassword(
        this.passwords.currentPass,
        this.passwords.newPassValid
      );
    },
    SaveAll() {
      this.$swal({
        type: "warning",
        title: this.$t("lang.label.saveallchanges"),
        text: "",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33a2c",
        confirmButtonText: "Ok",
      }).then((result) => {
        if (result.value) {
          this.saveData();
          let langSelected = this.langs.find(
            (item) => item.id === this.dataUser.user.language_id
          );

          const { dispatch } = this.$store;
          dispatch("authentication/setLangCode", langSelected.lang_code).then(
            (result) => {
              this.$swal({
                type: "success",
                title: this.$t("lang.label.great"),
                text: this.$t("lang.label.yourdatawassuccessfullychanged"),
                showConfirmButton: false,
                timer: 1500,
              });

              this.NavigationClicked();
            }
          );

            this.saveCalendly()
          
        }
      });
    },

    addTag(newTag, tagsany) {
      newTag = this.$sanitize(newTag);
      var newTags = newTag.split(",");

      newTags.forEach((newTag) => {
        const tag = {
          domains_excluded: newTag,
        };

        tagsany.push(tag);

        if (tagsany != undefined && tagsany.length > 0) {
          tagsany = tagsany.filter(
            (t) => t.domains_excluded != tag.domains_excluded
          );
          this.domains_excluded = tagsany;
        }
        this.domains_excluded.push(tag);
        this.dataUser.client.domains_excluded = this.getDomainsExcluded(
          this.domains_excluded
        );
      });
    },

    removeTag(tag, tagsany) {
      if (tagsany != undefined && tagsany.length > 0) {
        tagsany = tagsany.filter(
          (t) => t.domains_excluded != tag.domains_excluded
        );
        this.domains_excluded = tagsany;
      }
      this.domains_excluded = tagsany;
      this.dataUser.client.domains_excluded = this.getDomainsExcluded(
        this.domains_excluded
      );
    },

    getDomainsExcluded(arrayObjects) {
      return Array.prototype.map
        .call(arrayObjects, function (item) {
          return item.domains_excluded;
        })
        .join(",");
    },
  },
};
</script>