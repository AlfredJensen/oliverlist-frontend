<template>
  <section class="create-user hv-md-100">
    <div class="d-flex align-items-center justify-content-center h-100 mymd-5">
      <div class="container">
        <div class="row h-100">
          <div class="col-sm-12 col-lg-8 h-100 mx-auto mt2em bg-white">
            <div class="p-4 shadow">
              <img
                src="@/assets/images/5-1-300x233.png"
                class="rounded mx-auto d-block"
                width="150px"
              />
              <div
                class="wrapper-form"
                v-if="emailSent() && showVerificationCode"
              >
                <div class="my-4">
                  <h2 class="dark-blue">
                    {{ $t("lang.label.verificationcode") }}
                  </h2>
                  <p id="codeHelp" class="form-text">
                    {{ $t("lang.label.insertthecodethatyoureceivedbyemail") }}
                  </p>
                </div>
                <div class="mt-4">
                  <div class="form-row my-3">
                    <input
                      id="code"
                      type="text"
                      class="form-control"
                      v-bind:placeholder="$t('lang.label.insertcode')"
                      v-model="code"
                      required="true"
                    />
                    <div
                      v-if="alert.message && !submittedCodeSecond"
                      :class="`mt-4 alert ${alert.type}`"
                    >
                      {{ alert.message }}
                    </div>
                    <div v-if="submittedCodeSecond && alert.message">
                      <div class="mt-4">
                        <AlertError :msgError="alert.message" />
                      </div>
                    </div>
                  </div>
                  <button
                    class="btn btn-primary themed-button text-right"
                    @click="checkVerificationCode"
                  >
                    {{ $t("lang.button.submitcode") }}
                  </button>
                  <button
                    class="btn btn-primary themed-button ml-2 text-right"
                    @click="resendVerificationCode()"
                  >
                    {{$t('lang.label.resendcode')}}
                  </button>
                  <router-link class="ml-3" to="/login">
                    {{ $t("lang.button.logout") }}
                  </router-link>
                </div>
              </div>
              <div class="wrapper-form" v-if="!emailSent()">
                <div v-if="hash != null">
                  <h2>{{ $t("lang.label.createteamaccount") }}</h2>
                </div>
                <div class="my-4 text-center" v-else>
                 
                  <div>
                    {{ $t("lang.label.fullaccessnocreditcardrequired") }}
                  </div>
                </div>

                <form class="mt-4" v-on:submit.prevent="handleSubmit">
                  <div class="form-row my-4">
                    <div class="col-sm-12 col-md-6 mbsm-2">
                      <input
                        id="firstname"
                        type="text"
                        class="form-control"
                        v-bind:placeholder="$t('lang.label.firstname')"
                        v-model="firstname"
                        required="true"
                      />
                    </div>
                    <div class="col-sm-12 col-md-6">
                      <input
                        id="lastname"
                        type="text"
                        class="form-control"
                        v-bind:placeholder="$t('lang.label.lastname')"
                        v-model="lastname"
                        required="true"
                      />
                    </div>
                  </div>
                  <div class="form-row my-4">
                    <div class="col-sm-12 col-md-6 mbsm-2">
                      <input
                        id="company"
                        type="text"
                        class="form-control"
                        v-bind:placeholder="$t('lang.label.company')"
                        v-model="company"
                        required="true"
                      />
                    </div>
                    <div class="col-sm-12 col-md-6">
                      <input
                        id="phone"
                        type="text"
                        class="form-control"
                        v-bind:placeholder="$t('lang.label.phone')"
                        v-model="phone"
                        required="true"
                      />
                    </div>
                  </div>
                  <div class="form-row my-4">
                    <div class="form-group col-md-12">
                      <input
                        id="email"
                        type="email"
                        class="form-control"
                        v-bind:placeholder="$t('lang.label.email')"
                        v-model="username"
                        required="true"
                      />
                      <small id="emailHelp" class="form-text dark-gray">{{
                        $t(
                          "lang.label.youwillhavetoconfirmthatthisemailisyours"
                        )
                      }}</small>
                    </div>
                    <div class="form-group col-md-6">
                      <input
                        type="password"
                        class="form-control"
                        id="password"
                        v-model="password"
                        v-bind:placeholder="$t('lang.label.password')"
                        pattern="^(?=(.*[a-z]){1,})(?=(.*[A-Z]){1,})(?=(.*[0-9]){1,}).{6,16}$"
                        required
                        :title="$t('lang.validation.password')"
                      />
                      <small class="form-text dark-gray">{{
                        $t("lang.validation.password")
                      }}</small>
                    </div>
                    <div class="form-group col-md-6">
                      <input
                        type="password"
                        pattern=".{8,}"
                        required
                        title="8 characters minimum"
                        v-model="confirmpass"
                        class="form-control"
                        id="confirmpass"
                        v-bind:placeholder="$t('lang.label.confirmpassword')"
                      />
                    </div>

                    <div class="form-group col-md-6">
                      <input
                        type="text"
                        v-model="codepromo"
                        class="form-control"
                        v-bind:placeholder="$t('lang.label.codepromo')"
                      />
                    </div>



                    <div
                      v-if="alert.message && !submittedDataSecond"
                      :class="`alert ${alert.type}`"
                    >
                      {{ alert.message }}
                    </div>
                    <div v-if="submittedDataSecond && alert.message">
                      <div class="mt-4">
                        <AlertError :msgError="alert.message" />
                      </div>
                    </div>
                    <div v-if="errors.length" :class="`alert ${alert.type}`">
                      <li v-for="error in errors">{{ error }}</li>
                    </div>
                  </div>
                  <div class="d-flex justify-content-end">
                    <button
                      class="btn btn-primary themed-button btn-sm text-right"
                    >
                      {{ $t("lang.button.freetrial") }}
                    </button>
                  </div>
                </form>
              </div>
              <div class="wrapper-form" v-if="showUserParameters">
                <div class="my-4">
                  <h2 class="dark-blue">
                    {{ $t("lang.label.aboutyourcompany") }}
                  </h2>
                </div>
                <form class="mt-4" v-on:submit.prevent="handleSubmitParameters">
                  <div class="form-row my-3">
                    <div class="col-md-12" v-if="showClientParameters">
                      {{ $t("lang.label.howknowus") }}
                      <treeselect
                        v-model="how_they_know_us"
                        class="mb-2"
                        :multiple="false"
                        :required="false"
                        :maxHeight="200"
                        :show-count="true"
                        :searchable="false"
                        :append-to-body="true"
                        :options="howKnowOptions"
                      >
                      </treeselect>
                    </div>
                    
                    <div class="col-md-12" v-if="showClientParameters">
                      {{ this.$t("lang.lookingfor.label") }}
                      <treeselect
                        v-model="looking_for"
                        class="mb-2"
                        :multiple="false"
                        :required="false"
                        :maxHeight="200"
                        :show-count="true"
                        :searchable="false"
                        :append-to-body="true"
                        :options="lookingFor"
                      >
                      </treeselect>
                    </div>
                    <div class="col-md-12" v-if="showClientParameters">
                      {{ $t("lang.label.companytype") }}
                      <treeselect
                        v-model="param_5"
                        class="mb-2"
                        :multiple="false"
                        :required="false"
                        :maxHeight="200"
                        :show-count="true"
                        :searchable="false"
                        :append-to-body="true"
                        :options="companySizeOptions"
                        @select="onSelect"
                        @deselect="onDeselect"
                      >
                      </treeselect>
                    </div>
                    <div class="col-md-12" v-if="showClientParameters">
                      {{ this.$t("lang.label.industry") }}
                      <!-- CATEGORIES GOOGLE -->
                      <treeselect
                        v-model="categories_allowed"
                        class="mb-2"
                        :multiple="false"
                        :required="false"
                        :maxHeight="200"
                        :show-count="true"
                        :append-to-body="true"
                        :searchable="true"
                        :options="hierarchyoptionsGoogle"
                      >
                        <label
                          slot="option-label"
                          slot-scope="{
                            node,
                            shouldShowCount,
                            count,
                            labelClassName,
                            countClassName,
                          }"
                          :class="labelClassName"
                        >
                          {{ node.label }}
                          <!-- <span v-if="shouldShowCount" :class="countClassName">({{ count }})</span> -->
                        </label>
                      </treeselect>
                    </div>
                    <div class="col-md-12">
                      {{ this.$t("lang.label.yourposition") }}
                      <treeselect
                        v-model="categories_search_level"
                        class="mb-2"
                        :multiple="false"
                        :required="false"
                        :maxHeight="200"
                        :show-count="true"
                        :searchable="false"
                        :append-to-body="true"
                        :options="categories_search_level_options"
                      >
                      </treeselect>
                    </div>
                    <div class="col-md-12" v-if="false">
                      {{ this.$t("lang.label.yourarea") }}
                      <treeselect
                        v-model="categories_search_function"
                        class="mb-2"
                        :multiple="false"
                        :required="false"
                        :maxHeight="200"
                        :show-count="true"
                        :searchable="false"
                        :append-to-body="true"
                        :options="categories_search_function_options"
                      >
                      </treeselect>
                    </div>
                  </div>
                  <button class="btn btn-primary themed-button text-right">
                    {{ $t("lang.label.startusingoliver") }}
                  </button>
                </form>
              </div>
            </div>
            <div class="text-center mt-2">
              {{ $t("lang.label.byregistering") }}
              <a
                href="https://oliverlist.com/terms-of-services/"
                target="_blank"
                >{{ $t("lang.label.termsofuse") }} </a
              >{{ $t("lang.label.and") }}
              <a
                href="https://oliverlist.com/privacy-policy/"
                target="_blank"
                >{{ $t("lang.label.privacypolicy") }}.</a
              >
            </div>
            <div class="w-100 d-flex justify-content-end my-4">
              <router-link to="/login">
                <a class="btn btn-sm btn-outline-dark mr-4" href>
                  <span>{{ $t("lang.button.login") }}</span>
                </a>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import { mapState, mapActions } from "vuex";
import AlertError from "@/components/AlertError.vue";
import {
  clientsService,
  campaignsService,
  categoriesService,
  usersService,
} from "@/_services";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  computed: {
    ...mapState({
      emailConfirmed: (state) => state.authentication.status.emailVerified,
    }),
    alert() {
      return this.$store.state.alert;
    },
    userEmail(){
      const userEmail = this.usersame == '' || this.usersame == undefined ? this.$store.state.authentication.user.username : this.usersame
      return userEmail
    }
  },
  props: {
    user: Object,
  },
  data() {
    return {
      submittedCode: false,
      submittedCodeSecond: false,
      submittedData: false,
      submittedDataSecond: false,
      codepromo:"",
      errors: [],
      lastname: "",
      firstname: "",
      company: "",
      phone: "",
      password: "",
      email: "",
      username: "",
      confirmpass: "",
      code: null,
      clientId: null,
      hash: null,
      showVerificationCode: true,
      showClientParameters: false,
      showUserParameters: false,
      param_5: null,
      salaries: null,
      companySizeOptions: [],
      categories_allowed: null,
      hierarchyoptionsGoogle: [],
      categories_search_function: null,
      categories_search_function_options: [],
      categories_search_level: null,
      categories_search_level_options: [],
      how_they_know_us: null,
      howKnowOptions: [
        { id: "google", label: "Google" },
        { id: "linkedin", label: "Linkedin" },
        { id: "facebook", label: "Facebook" },
        { id: "recommendation", label: "Recommandation" },
        { id: "email", label: "Email" },
      ],
      looking_for: null,
      lookingFor: []
    };
  },
  components: {
    treeselect: Treeselect,
    AlertError,
  },
  created() {
    this.$store.dispatch("alert/clear");
    this.verifyHash();
    this.getParametersOptions(5);
    // esto lo quite dela linea 145: pattern="^(?=(.*[a-z]){1,})(?=(.*[A-Z]){1,})(?=(.*[0-9]){1,})(?=(.*[ !#$%&'()*+,-./:;<=>?@\[\\\]^_`{|}~]){1,}).{8,16}$"
  },
  watch: {
    emailConfirmed: function () {
      if(this.emailConfirmed){
        if (this.clientId == null) {
        
          this.showClientParameters = true;
          this.showUserParameters = true;
          this.showVerificationCode = false;
        } else {
          this.showClientParameters = false;
          this.showUserParameters = true;
          this.showVerificationCode = false;
        }
      }else{
        this.showClientParameters = false;
        this.showUserParameters = false;
        this.showVerificationCode = true;
      }
    },
    'firstname'(){
      this.firstname = this.$sanitize(this.firstname);
    },
    'lastname'(){
      this.lastname = this.$sanitize(this.lastname);
    },
    'company'(){
      this.company = this.$sanitize(this.company);
    },
    'phone'(){
      this.phone = this.$sanitize(this.phone);
    },
    'email'(){
      this.email = this.$sanitize(this.email);
    },
    'username'(){
      this.username = this.$sanitize(this.username);
    },

  },
  methods: {
    verifyHash() {
      if (this.$route.query.hash !== undefined) {
        this.hash = this.$route.query.hash;

        if (this.hash != null) {
          clientsService.verifyHash(this.$route.query.hash).then((result) => {
            if (result.client_id != null) {
              this.clientId = result.client_id;
            } else {
              this.clientId = "INVALID";
            }
          });
        } else {
          this.$router.push("/login");
        }
      }
    },
    getParametersOptions(type_id) {
      campaignsService.getParameterTypesOptions(type_id).then((response) => {
        response.forEach((item) => {
          item.label = item.name;
        });
        this.companySizeOptions = response;
      });
      categoriesService.getCategoriesGoogleParent().then((response) => {
        this.hierarchyoptionsGoogle = response;
      });
      categoriesService.getCategoriesSearchFunction().then((response) => {
        this.categories_search_function_options = response;
      });
      categoriesService.getCategoriesSearchLevel().then((response) => {
        this.categories_search_level_options = response;
      });
      let lookingForOption = ["curious", "verified-business-contacts", "send-emails", "verified-business-contacts-and-send-emails" ];
      lookingForOption.forEach((item,key) => {
        this.lookingFor.push({"id": item, "label": this.$t("lang.lookingfor."+item) })
      });
    },
    handleSubmit(e) {
      this.submittedData
        ? (this.submittedDataSecond = true)
        : (this.submittedData = true);
      
      const { dispatch } = this.$store;
      
      let dataUser = {};
      dataUser.name = this.firstname;
      dataUser.lastname = this.lastname;
      dataUser.company = this.company;
      dataUser.phone = this.phone;
      dataUser.email = this.username;
      dataUser.codepromo = this.codepromo;
      dataUser.password = this.password;
      dataUser.username = this.username;
      dataUser.client_id = this.clientId;

      if (this.checkForm()) {
        dispatch("authentication/create", { dataUser });
        this.$store.dispatch("alert/clear");
      }
    },
    handleSubmitParameters(e) {
      if (this.showClientParameters == true) {
        if (
          this.salaries != null ||
          this.categories_allowed != null ||
          this.categories_search_function != null ||
          this.categories_search_level != null ||
          this.how_they_know_us != null ||
          this.looking_for != null
        ) {
          clientsService
            .setParameters(
              this.salaries,
              this.categories_allowed,
              this.how_they_know_us,
              this.looking_for
            )
            .then((result) => {
              usersService
                .setParameters(
                  this.categories_search_function,
                  this.categories_search_level
                )
                .then((result) => {
                  this.$router.push("/");
                });
            });
        } else {
          this.$router.push("/");
        }
      } else {
        if (
          this.categories_search_level != null
        ) {
          usersService
            .setParameters(
              this.categories_search_function,
              this.categories_search_level
            )
            .then((result) => {
              this.$router.push("/dashboard");
            });
        }
      }
    },
    onSelect(node, instanceId) {
      this.salaries = node.label;
    },
    onDeselect(node, instanceId) {
      this.salaries = null;
    },
    emailSent() {
      if (this.user !== null && this.user.verificationcode != null) {
        return true;
      }
      return this.$store.state.authentication.status.emailSent;
    },
    checkVerificationCode() {
      this.submittedCode
        ? (this.submittedCodeSecond = true)
        : (this.submittedCode = true);
      const { code, username, password, clientId } = this;
      const { dispatch } = this.$store;
      if (this.code) {
        dispatch("authentication/verificationcode", {
          code,
          username,
          password,
          clientId,
        });
      }
    },
    resendVerificationCode() {
      const { username } = this;
      const { dispatch } = this.$store;
      dispatch("authentication/resendVerificationCode", {
        username
      }).then( result => {
        this.$swal({
          type: "success",
          title: this.$t("lang.label.great"),
          html: this.$t("lang.accountcreation.verificationcoderesend", { "user_email" : this.userEmail }),
          showConfirmButton: true,
          timer: 10000,
        });
      });
    },
    checkForm: function (e) {
      this.errors = [];
      if (
        this.firstname &&
        this.lastname &&
        this.firstname &&
        this.company &&
        this.phone &&
        this.confirmpass &&
        this.username
      ) {
        if (this.password != this.confirmpass) {
          this.errors.push("The password is not the same");
          return false;
        }
        return true;
      }
      this.errors.push("You must complete all the fields");
      return false;
    },
    goToStep(step) {
      //tiene que ir gotostep(1)
      this.$emit("goToStep", step);
    },
  },
};
</script>
    <style>
.mt2em {
  margin-top: 10%;
}
@media (min-width: 992px) {
  .hv-md-100 {
    height: 100vh;
  }
}
@media (max-width: 991px) {
  .mymd-5 {
    margin-top: 2em;
    margin-bottom: 2em;
  }
}
@media (max-width: 767px) {
  .mbsm-2 {
    margin-bottom: 1.5em;
  }
}
.reqfield:after {
  content: "*";
  font-weight: 400;
  color: red;
  padding-left: 0.2em;
  font-size: 1em;
}

svg.vue-treeselect__option-arrow {
  display: none !important;
}

div.vue-treeselect__option-arrow-container {
  font-family: "icomoon" !important;
  speak: none;
  font-style: normal;
  font-weight: normal;
  font-variant: normal;
  text-transform: none;
  line-height: 1;
  -webkit-font-smoothing: antialiased;
}

div.vue-treeselect__option-arrow-container::before {
  content: "\f196";
  color: #5155ea;
}
</style>