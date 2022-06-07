<template>
    <div>
    <LoadingSpinner v-if="loading" />
      <section class="account"  v-if="!loading">
        <div class="contenedor">
            <div v-if="alert.message">
                <div class="mt-4">
                    <AlertError :msgError="''" />
                </div>
             </div>
            <div class="">
                <div class="row">
                    <div class="col-md-6">
                        <form @submit.prevent="onSubmit">
                            <vue-form-generator ref="connectionFormUser" :schema="user_schema" :model="this.model" :options="formOptions">
                            </vue-form-generator>
                        </form>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-6">
                        <div class="my-4 mx-2">
                            <h5>IMAP</h5>
                        </div>
                        <form @submit.prevent="onSubmit">
                            <vue-form-generator ref="connectionFormImap" :schema="imap_schema" :model="this.model" :options="formOptions">
                            </vue-form-generator>
                        </form>
                    </div>
                    <div class="col-md-6">
                        <div class="my-4 mx-2">
                            <h5>SMTP</h5>
                        </div>
                        <form @submit.prevent="onSubmit">
                            <vue-form-generator ref="connectionFormSmtp" :schema="smtp_schema" :model="this.model" :options="formOptions">
                            </vue-form-generator>
                        </form>
                    </div>
                </div>
            </div>
        
            <div class="my-4 text-right mr-5">
                <button class="btn btn-primary connect mr-2" type="submit" @click="connect()" >{{ $t('lang.button.connect') }}</button>
                <button class="btn btn-danger connect" type="submit" @click="cancel()" >{{ $t('lang.button.cancel') }}</button>
            </div>
        </div>
        <!--//Card-->
                    
                
       
      </section>
      </div>
</template>
    <script>
    import Vue from 'vue';
    import { mapState, mapActions } from "vuex";
    import LoadingSpinner from "@/components/LoadingSpinner.vue";
    import { usersService , smtpMailboxesService } from "@/_services";
    import { lenguagesService } from "@/_services";
    import i18n from '@/_helpers/i18n'
    import VueFormGenerator from 'vue-form-generator';
    import 'vue-form-generator/dist/vfg.css';
    import AlertError from "@/components/AlertError.vue";
    
    export default {
        data () {
            return {
                loading: true,
                emailProvider: "Gmail",
                emailAccount : "" ,
                isChecked: false,
                errors: [],
                info:{},
                model: {},
                user_schema:{
                    fields: [
                        {
                        type: "input",
                        inputType: "email",
                        label: "Email",
                        model: "email",
                        id:"email",
                        placeholder: "",
                        required: true,
                        styleClasses:'col-md-8',
                        validator:  VueFormGenerator.validators.required
                        },
                        {
                        type: "input",
                        inputType: "text",
                        label: this.$t('lang.label.firstname'),
                        model: "first_name",
                        id:"first_name",
                        placeholder: "",
                        required: true,
                        styleClasses:'col-md-8',
                        validator:  VueFormGenerator.validators.required
                        },{
                        type: "input",
                        inputType: "text",
                        label: this.$t('lang.label.lastname'),
                        model: "last_name",
                        id:"last_name",
                        placeholder: "",
                        required: true,
                        styleClasses:'col-md-8',
                        validator:  VueFormGenerator.validators.required
                        }

                    ]
                },
                smtp_schema: {
                    fields: [
                        {
                        type: "input",
                        inputType: "text",
                        label: "Host",
                        model: "smtp_url",
                        id:"smtp_url",
                        placeholder: "",
                        required: true,
                        styleClasses:'col-md-8',
                        validator:  VueFormGenerator.validators.required,
                        autocomplete: false
                    },
                        {
                        type: "input",
                        inputType: "number",
                        label: "Port",
                        model: "smtp_port",
                        id:"smtp_port",
                        placeholder: "",
                        required: true,
                        styleClasses:'col-md-8',
                        validator: VueFormGenerator.validators.required
                    },
                    {
                        type: "input",
                        inputType: "text",
                        label: "Username",
                        model: "smtp_user",
                        id:"smtp_user",
                        placeholder: "",
                        required: true,
                        styleClasses:'col-md-8',
                        validator: VueFormGenerator.validators.required
                    },
                    {
                        type: "input",
                        inputType: "password",
                        label: "Password",
                        model: "smtp_password",
                        id:"smtp_password",
                        placeholder: "",
                        required: true,
                        styleClasses:'col-md-8',
                        validator: VueFormGenerator.validators.required
                    },{
                        type: "switch",
                        label: "SSL",
                        model: "is_ssl",
                        id:"is_ssl",
                        multi: true,
                        default: true,
                        textOn: "",
                        textOff: "",
                        valueOn: "1",
                        valueOff: "0",
                        styleClasses:'col-md-8',
                    }
                    ]
               },
                imap_schema: {
                    fields: [{
                        type: "input",
                        inputType: "text",
                        label: "Host",
                        model: "imap_url",
                        id:"imap_url",
                        placeholder: "",
                        required: true,
                        styleClasses:'col-md-8',
                       validator: VueFormGenerator.validators.required,
                    },{
                        type: "input",
                        inputType: "number",
                        label: "Port",
                        model: "imap_port",
                        id:"imap_port",
                        placeholder: "",
                        required: true,
                        styleClasses:'col-md-8',
                        validator: VueFormGenerator.validators.required
                    },
                    {
                        type: "input",
                        inputType: "text",
                        label: "Username",
                        model: "mailbox_user",
                        id:"mailbox_user",
                        placeholder: "",
                        required: true,
                        styleClasses:'col-md-8',
                        validator: VueFormGenerator.validators.required
                    },
                    {
                        type: "input",
                        inputType: "password",
                        label: "Password",
                        model: "mailbox_password",
                        id:"mailbox_password",
                        placeholder: "",
                        required: true,
                        styleClasses:'col-md-8',
                        validator: VueFormGenerator.validators.required
                    }

                    ],
                },
               
                formOptions: {
                    validateAfterLoad: false,
                    validateAfterChanged: true
                }

            }
        },
        props: {
            settings: Object
        },
    
      components: {
        LoadingSpinner,
        AlertError,
        "vue-form-generator": VueFormGenerator.component,
      },
    
      computed: {
        ...mapState({
          headerTab: state => state.header.tab
        }),
    
        user() {
          return this.$store.state.authentication.user;
        },
        alert() {
          return this.$store.state.alert;
        }
      },
    
      created(){
        this.$store.dispatch("alert/clear");
        this.setSettingsClient();
        return this.loading = false;
      },
    
      methods: {
        ...mapActions("header", {
          changeHeaderTab: "changeTab"
        }),
        getSettingsClient(){
            smtpMailboxesService.getConfig()
            .then( result =>{
                if(result){
                    this.model = result;
                    this.$parent.isSmtp();
                }
            })
        },
        setSettingsClient(){   
            if(this.settings){
                this.model = this.settings;
            }
        },
        cancel(){
            this.$parent.cancel();
        },
        connect(){
             this.$refs.connectionFormUser.validate();
             this.$refs.connectionFormSmtp.validate();
             this.$refs.connectionFormImap.validate();
            
            if(this.$refs.connectionFormUser.errors.length > 0 || this.$refs.connectionFormSmtp.errors.length > 0 || this.$refs.connectionFormImap.errors.length > 0){
              return;
            }else{
                  this.loading = true;
                  smtpMailboxesService.connectData(Object.assign(this.$refs.connectionFormUser.model, this.$refs.connectionFormSmtp.model,  this.$refs.connectionFormImap.model))
              .then(result =>{
                this.$store.dispatch("alert/clear");
                this.loading = false;
                this.$parent.addAccount = false;
                this.$parent.getEmailSettings();
              },
              error => {
                    this.$store.dispatch('alert/error', error, { root: true }).then( result => this.loading = false);
               })
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
    </style>
    