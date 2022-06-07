<template>
  <div class="contentCenter">
   <span 
   v-if="loading"
      class="loadingres mr-2 ml-2 spinner-border loading-spinner" 
    ></span>
    <div class="row mt-4 p-4" v-if="!loading">
        <div class="col-12 ">

            <h4 for="firstname" class="font-weight-bolder">
            {{$t('lang.refuse.title')}}</h4>
            <p>{{$t('lang.refuse.desc')}}</p>

            <strong class="ml-2">{{$t('lang.refuse.sentemail')}}:</strong>
            <div class="col-12 pl-0 my-2">

             <div class="mb-4" v-if="sendemailplease">
               <div class="input-group my-2">
                   <div class="input-group-prepend">
                     <span class="input-group-text" id="inputGroup-sizing-default">From:</span>
                   </div>
                   <input disabled :value="opportunity.link.owner_name" id="input_response" type="text" class="form-control input-a" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default">
              </div>
               <div class="input-group my-2">
                   <div class="input-group-prepend">
                     <span class="input-group-text" id="inputGroup-sizing-default">To:</span>
                   </div>
                   <input disabled :value="opportunity.link.event.invitees[0].name+' <'+opportunity.link.event.invitees[0].email+'>'" id="input_response" type="text" class="form-control input-a" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default">
              </div>
                <textarea type="text" class="form-control mb-2" 
                id="subject" v-model="reply_email.subject" 
                rows="1"
                placeholder="Subject" required="true">
                </textarea>

                <textarea type="text" class="form-control" 
                id="email" v-model="reply_email.message" 
                rows="10"
                v-bind:placeholder="$t('lang.label.hello')+' '+opportunity.link.event.invitees[0].name" required="true">
                 </textarea>
            </div>
            <div class="my-4">
           
             </input>
                
                <div class="form-group mt-4">
                <h6> <small><i class="icon-asterisk text-danger mr-1"></i></small>{{$t('lang.refuse.why')}}</h6>
                          <textarea
                          required="required" class="form-control" 
                          v-model="why"></textarea>
                              
                      </div> 
            </div>
            <div>
             <h6>
            <small><i class="icon-asterisk text-danger mr-1"></i></small>{{$t('lang.refuse.conditions')}}</h6>
            <input class="d-inline mr-2 mt-2 cursor-pointer" type="checkbox" v-model="oliverexplaination">
            {{$t('lang.refuse.checkbox')}}
            </div>

            <button :disabled="sendemailplease && (!reply_email.subject || !reply_email.subject) || !oliverexplaination || !why" @click="refuse()" class="btn btn-sm btn-danger mt-2">{{$t('lang.refuse.button')}}</button>
            <button class="btn btn-sm btn-primary mt-2 ml-2" @click="cancel()">{{$t('lang.button.cancel')}}</button>
    
        </div>
    </div>
   </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { opportunitiesService, emailsService, calendlyService } from "@/_services";

export default {
  data() {
    return {
      emailanswer: "",
      oliverexplaination: "",
      loading:true,
      sendemailplease:true,
      why:"",
      reply_email:{
          to:'',
          subject:'',
          message:'',
          email_selected:{
              id: null,
              link_id: null,
              response_to: null,
          }
      },
    };
  },


  computed: {
    ...mapState({
      opportunity: state => state.opportunities.selected.data,
    }),

  },
 
  created() { 
    this.reply_email.to = this.opportunity.link.event.invitees[0].email
    this.loading=false
    this.reply_email.label_from = this.opportunity.link.owner_name
    this.reply_email.email_selected.link_id = this.opportunity.link.id
  },


  methods: {

    cancel(){
      this.$emit('cancel')
    },
    refuse(){
      this.sendEmail()
    },
    validEmail: function (email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    },
    getEvent() {

    },
    sendEmail(){
      
      this.$swal({
              type: 'warning',
              title: this.$t('lang.refuse.title'),
              text: this.$t('lang.refuse.analyzerequest'),
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33a2c',
              confirmButtonText: this.$t('lang.button.send')
          }).then((result) => {
              if (result.value) {

              this.why = this.$t('lang.refuse.refusewarning') + ": " + this.why
        
              opportunitiesService.refuse(this.opportunity.link.id,this.why)

              if(this.sendemailplease){
                this.startLoadingSendEmail = true
                if(!this.reply_email.to.includes("*") && !this.reply_email.to.includes("(")){
                    if (!this.validEmail(this.reply_email.to)) {
                        this.errors.push('The email field is invalid.');
                        this.startLoadingSendEmail = false;
                        return false;
                    }
                }
                emailsService.replyEmail(this.reply_email, this.file)
                .then((res) => {
                    this.$swal({
                      type: 'success',
                      title: this.$t('lang.label.great'),
                      text: this.$t('lang.label.emailwassentsuccessfully'),
                      showConfirmButton: false,
                      timer: 1500
                    })
                }).then((res)=>{

                    let date_ob = new Date();
                    // adjust 0 before single digit date
                    let date = ("0" + date_ob.getDate()).slice(-2);
                    // current month
                    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
                    // current year
                    let year = date_ob.getFullYear();
                        
                        var newEmail = {
                          id: "newEmail",
                          name: this.reply_email.label_from,
                          link: this.reply_email.subject,
                          comment: this.reply_email.message,
                          type: "emailsentopportunity",
                          response_from: this.reply_email.to,
                          creation_date: year + "-" + month + "-" + date
                        };

                })
              }

                    this.$emit("refused")
        
                         
              } 
          })
    },
  }
};
</script>