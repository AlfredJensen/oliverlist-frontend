<template>
<div class="container">
    <div class="row">
        <div class='col-md-3'></div>
        <div class="col-md-6">
  <div class="login-block well">
    <img src="@/assets/images/Logo-oliver-400.png" class="rounded mx-auto d-block" width="150px">
    <h2 class="text-lg-center mt-4">{{ $t('lang.label.needanewpassword') }}</h2>
    <p class="text-center">{{ $t('lang.label.pleaseprovideyouremailaddressandwellsendyou') }}</p>
    <div v-if="alert.message" :class="`login-alert alert ${alert.type}`">{{alert.message}}</div>
    <form @submit.prevent="handleSubmit" class="login-form">
      <div class="input-wrapper">
        <label for="user">Email</label>
        <input
          type="text"
          v-model="email"
          name="email"
          class="form-control"
          :class="{ 'is-invalid': submitted && !email }"
        />
        <div v-show="submitted && !email" class="invalid-feedback">{{ $t('lang.label.required') }}</div>
      </div>
        
      <div class="row">
        <div class="col-8">
          <button class="btn btn-primary" :disabled="wasSent">{{ $t('lang.button.send') }}</button>
        </div>
        <div class="col-4">
          <router-link to="/login" class="nav-link">
            <span class="icon-dashboard d-md-none"></span>
            <span >{{ $t('lang.button.login') }}</span>
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
import { usersService } from '@/_services';
export default {
  data() {
    return {
      email: "",
      submitted: false
    };
  },
  computed: {
    wasSent() {
      return this.submitted;
    },
    alert() {
      return this.$store.state.alert;
    }
  },
  created() {
    
  },
  methods: {
    handleSubmit(e) {
      this.submitted = true;
      const { email } = this;
      const { dispatch } = this.$store;
      if (email) {
        dispatch("authentication/requestNewPassword", { email });
      }
    },
  },
};
</script>