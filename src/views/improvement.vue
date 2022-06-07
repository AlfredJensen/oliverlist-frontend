<template>
  <section class="campaign">
    <main class="main  animated fadeIn faster"  :class="{ 'expand-main' : isMenuCollapse }">
      <!-- <ol class="breadcrumb">
        <li class="breadcrumb-item active">{{ $t('lang.label.improvement') }}</li>
      </ol> -->
       {{udpdateHeader('improvement')}}
    <div class="contenedor animated fadeIn faster">
        <div class="styles-steps pb-4">
              <div class="card-body">
                <div class="row">
                    <div class="col-12 col-md-4">
                       <h2 class="mb-0">{{ $t('lang.label.anysuggestionsforimprovement') }}</h2>
                    </div>

                </div>
              <div class="card-body">
                  <p>{{ $t('lang.label.doyouhavedifficultydoingcertaintasks') }}</p>

                  <form name="app_bundle_campaign_type" method="post">
                  <div class="form-group mt-2">
                          <textarea id="app_bundle_campaign_type_message" name="app_bundle_campaign_type[message]" required="required" class="form-control" v-bind:placeholder="$t('lang.label.pleasespecifywhatyouhaveinmindhere')" v-model="message"></textarea>
                              
                      </div>
                      <div class="alert alert-danger alert-dismissible fade show" role="alert" v-if="error.length">
                        <ul>
                            <li><strong>Error!</strong></li>
                            <li v-for="(error, key) in error" :key="key">{{ error }}</li>
                        </ul>
                        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>

                      <div class="form-group form-actions">
                          <button type="button" class="btn btn-block btn-outline-primary btn-lg" @click="send()">
                              {{ $t('lang.button.send') }}
                          </button>
                      </div>
                  <!-- <input type="hidden" id="app_bundle_campaign_type__token" name="app_bundle_campaign_type[_token]" value="5Uom27cwtlaAJtL6B3K_sYJnMJsRZC3g5EfrQQagmAc"> -->
                </form>
              </div>
            </div>
         
        </div>
      
    </div>
      
  </main>
</section>
</template>
<script>
import { mapState, mapActions } from "vuex";
import { usersService } from "@/_services";

export default {
  data () {
        return {
          message: "",
          error:[]
        }
    },
  created() {
    this.changeHeaderTab({ tab: "ALL" });
    if (typeof this.$route.params.id !== "undefined") {
      this.changeHeaderTab({ tab: "SELECTED" });
    }
  },
   mounted(){
    window.onbeforeunload  = null;
  },

  components: {
    
  },

  computed: {
    ...mapState({
      headerTab: state => state.header.tab,
       isMenuCollapse: state => state.sidebar.isNavOpen,
    }),

    user() {
      return this.$store.state.authentication.user;
    },

  },

  methods: {
    ...mapActions("header", {
      changeHeaderTab: "changeTab"
    }),
     ...mapActions("headertopbar", {
         setCurrentRoute:"setRoute",
         setCurrentRouteChild:"setRouteChild"
    }),
     udpdateHeader(route){
      this.setCurrentRoute({page:route});
      this.setCurrentRouteChild({child:''});
    },
    send(){
        this.error = [];
        if (!this.message) {
                this.error.push("The message can not be blank.");
                return false;
        }else{
          usersService.sendImprovement(this.message).then(result => {
            this.$swal({
                        type: "success",
                        title: this.$t('lang.label.great'),
                        text: '',
                        showConfirmButton: false,
                        timer: 1500
                        
            });
          });
        }
      
    }
  }
};
</script>