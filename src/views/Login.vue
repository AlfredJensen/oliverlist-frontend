<template>
  <div class="container">
    <div class="row">
      <div class="col-md-3"></div>
      <div class="col-md-6">
        <div class="login-block well shadow py-5 bg-white">
          <img
            src="@/assets/images/2.png"
            class="rounded mx-auto d-block"
            width="150px"
          />
          <h2 class="text-lg-center my-4">{{ $t("lang.label.welcomeback") }} </h2>
          <LoadingSpinnerBar v-if="loading" />
          <div v-if="!loading">
            <div
              v-if="alert.message && !submittedSecond"
              :class="`login-alert alert ${alert.type}`"
              v-html="alert.message"
            ></div>
          </div>
          <div v-if="!loading">
            <div v-if="alert.message && submittedSecond">
              <AlertError :msgError="alert.message" />
            </div>
          </div>
          <form
            @submit.prevent="handleSubmit"
            class="login-form"
            v-if="!loading"
          >
            <div class="input-wrapper">
              <label for="user">{{ $t("lang.label.user") }}</label>
              <input
                type="text"
                v-model="username"
                name="username"
                class="form-control"
                :class="{ 'is-invalid': submitted && !username }"
              />
              <div v-show="submitted && !username" class="invalid-feedback">
                Username is required
              </div>
            </div>
            <div class="input-wrapper">
              <label for="pass">{{ $t("lang.label.password") }}</label>
              <input
                type="password"
                v-model="password"
                name="password"
                class="form-control"
                :class="{ 'is-invalid': submitted && !password }"
              />
              <router-link to="/lostpassword" class="nav-link pxmd-0">
                <small>{{ $t("lang.label.forgotyourpassword") }}</small>
              </router-link>
              <div v-show="submitted && !password" class="invalid-feedback">
                Password is required
              </div>
            </div>
            <div class="row">
              <div class="col-sx-12 col-md-12 col-lg-4">
                <button
                  class="btn btn-primary themed-button btn-sm"
                  :disabled="loggingIn"
                >
                  {{ $t("lang.button.login") }}
                </button>
              </div>
              <div class="col-sx-12 md-12 col-lg-8 mymd-4">
                <router-link to="/createaccount">
                  <a class="nav-link pxmd-0" href>
                    <span href="#">{{
                      $t("lang.label.donthaveanaccount")
                    }}</span>
                  </a>
                </router-link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LoadingSpinnerBar from "@/components/LoadingSpinnerBar.vue";
import AlertError from "@/components/AlertError.vue";
import { mapState } from "vuex";
export default {
  data() {
    return {
      username: "",
      password: "",
      submitted: false,
      submittedSecond: false,
    };
  },
  components: {
    LoadingSpinnerBar,
    AlertError,
  },
  computed: {
    ...mapState({
      loading: (state) => state.authentication.status.loggingIn,
    }),
    loggingIn() {
      return this.$store.state.authentication.status.loggingIn;
    },
    alert() {
      return this.$store.state.alert;
    },
  },
  created() {

    // reset login status
    this.$store.dispatch("authentication/logout");
    this.$store.dispatch("opportunities/resetState");
    this.$store.dispatch("alert/clear");
  },
  methods: {
    handleSubmit(e) {
      if (!this.submitted) {
        this.submitted = true;
      } else {
        this.submittedSecond = true;
      }
      const { username, password } = this;
      const { dispatch } = this.$store;
      if (username && password) {
        dispatch("authentication/login", { username, password }).then(
          (result) => {
            this.$router.push("/");
          }
        );
      }
    },
  },
  watch: {
    $route(to, from) {
      // clear alert on location change
      this.$store.dispatch("alert/clear");
    },
    username() {
      this.username = this.$sanitize(this.username);
    },
  },
};
</script>
<style>
.color-red {
  color: #721c24;
}
@media (max-width: 991px) {
  .mymd-4 {
    margin-top: 1em;
    margin-bottom: 1em;
  }
  .pxmd-0 {
    padding-right: 0px !important;
    padding-left: 0px !important;
  }
}
</style>