<template>
<div>
    <LoadingSpinner v-if="loading" />
    <section class="account"  v-if="!loading">
                <div class="contenedor">
                    <div>
                        <div class="row ">
                           <div class="col-md-12">
                            <div v-if="alert.message">
                                <div class="mt-4">
                                    <AlertError :msgError="alert.message" />
                                </div>
                             </div>
                            <div class="form-group col-sm-8 row pr-0">
                                <label for="inputPassword" class="col-sm-12">Email</label>
                                <div class="col-sm-12 input-group mb-3 pr-0">
                                    <input type="text" class="form-control" v-model="emailAccount">
                                </div>
                                <small v-if="this.isGmailAccount(this.emailAccount)" class="text-danger ml-4">{{ $t('lang.validation.gmailsuit') }}</small>
                            </div>
                            <div class="form-group col-sm-8 row pr-0">
                                 <label for="inputPassword" class="col-sm-12">{{ $t('lang.label.firstname') }}</label>
                                <div class="col-sm-12 input-group mb-3 pr-0">
                                <input type="text" class="form-control" v-model="firstNameAccount">
                                </div>
                            </div>
                            <div class="form-group col-sm-8 row pr-0">
                                 <label for="inputPassword" class="col-sm-12">{{ $t('lang.label.lastname') }}</label>
                                <div class="col-sm-12 input-group mb-3 pr-0">
                                <input type="text" class="form-control" v-model="lastNameAccount">
                                </div>
                            </div>
                            </div>
                            <div class="col-md-12 mt-2">
                                <div class="my-4 text-right mr-5">
                                    <button class="btn btn-primary btn-sm connect mr-2" type="submit" @click="connect()" >{{ $t('lang.button.connect') }}</button>
                                     <button class="btn btn-danger btn-sm connect" type="submit" @click="cancel()" >{{ $t('lang.button.cancel') }}</button>
                                </div>
                            </div>
                        </div>
                        
                        <div class="alert alert-danger alert-dismissible fade show" role="alert" v-if="errors.length">
                                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                                <ul>
                                    <li><strong>Error!</strong></li>
                                    <li v-for="(error, key) in errors" :key="key">{{ error }}</li>
                                </ul>
                            </div>
                    </div>
                    <!--//Card-->
                    
                </div>
    </section>
    </div>
</template>
 <script>
    import Vue from 'vue';
    import { mapState, mapActions } from "vuex";
    import Header from "@/components/Header.vue";
    import LoadingSpinner from "@/components/LoadingSpinner.vue";
    import { usersService , smtpMailboxesService } from "@/_services";
    import { lenguagesService } from "@/_services";
    import i18n from '@/_helpers/i18n'
    import $ from "jquery";
    import AlertError from "@/components/AlertError.vue";
   
    
    export default {
        data () {
            return {
                loading: true,
                emailProvider: "Gmail",
                emailAccount : "" ,
                firstNameAccount : "" ,
                lastNameAccount : "" ,
                isChecked: false,
                errors: [],
 
            }
        },
    
    props: {
        settings: Object,
        selectedUserId: {
            type: String,
            default: null
        },
    },
    
      components: {
        LoadingSpinner,
        AlertError,
      },

      watch:{
        'emailAccount'(){
            this.emailAccount = this.$sanitize(this.emailAccount);
        },
        'firstNameAccount'(){
            this.firstNameAccount = this.$sanitize(this.firstNameAccount);
        },
        'lastNameAccount'(){
            this.lastNameAccount = this.$sanitize(this.lastNameAccount);
        },
    },

      computed: {
        ...mapState({
          headerTab: state => state.header.tab
        }),
    
        user() {
          return this.$store.state.authentication.user;
        },
        isGmailSelected(){
            return this.emailProvider === 'Gmail';
        },
        alert() {
          return this.$store.state.alert;
        }
      },
    
      created(){
        this.setEmailSettings();
        this.$store.dispatch("alert/clear");
        return this.loading = false;
      },
    
      methods: {
        ...mapActions("header", {
          changeHeaderTab: "changeTab"
        }),

        setEmailSettings(){
           if(Object.entries(this.settings).length > 0){
               this.emailAccount = this.settings.email;
               this.firstNameAccount = this.settings.first_name;
               this.lastNameAccount = this.settings.last_name;
               this.isChecked = true;
           }
        },
      
        validate(){
            this.errors = [];

            if (!this.emailAccount) {
                this.errors.push('Email is required.');
                return false;
            } else if (!this.validEmail(this.emailAccount)) {
                this.errors.push('The email field is invalid.');
                return false;
            } else if(this.isGmailAccount(this.emailAccount)){
                this.errors.push(this.$t('lang.validation.gmailsuit'));
                return false;
            }
            if (!this.firstNameAccount) {
                this.errors.push('First name is required.');
                return false;
            }
            if (!this.lastNameAccount) {
                this.errors.push('Last name is required.');
                return false;
            }

            return true;
        },
        validEmail(email) {
            return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,9})+$/.test(email);
        },
        isGmailAccount(email) {
            return false;
            return email !== undefined && email.includes('@gmail.com') && this.user.client_id != 435 ;
        },
        cancel(){
            this.$parent.cancel();
        },
        connect(){
            if(this.validate()){
                    usersService
                    .getAuthenticationUrl(this.emailAccount, this.firstNameAccount, this.lastNameAccount, this.selectedUserId)
                    .then( result => {
                            window.open(result,"_self")
                            },
                            error => {
                                this.$store.dispatch('alert/error', error, { root: true });
                            }
                    );
            }
        }
        
      }
    };
    </script>
    <style>
    .email-account .icon img{
        width: 25px;
    }
    .email-account .icon-envelope-open-o:before {
        font-size: 25px;
    }

    .input-group-text.icon-check-circle{
        color:#52BE80;
    }
    .account button.connect{
        height: auto;
    }
    </style>
