<template>
  <div class="row">
    <div class="col-md-12">
    <div class="card mt-3 p-3">

            <h6>{{ $t('lang.label.company') }}</h6>
             <small class="nameClient mb-2 d-inline" v-if="business.name"><i class="icon-flag mr-2"></i><span class="font-weight-bold">{{ business.name }}</span></small>
             <small
             v-if="business.address || business.postal_code || business.city"
              class="mb-2"><i class="icon-location mr-2"></i><span>{{ business.address}}, {{ business.postal_code}}, {{ business.city}}
              </span></small>

              <small class="mb-2" v-if="business.category_name"><i class="icon-book mr-2"></i><span>{{ business.category_name }}</span></small>
             <small v-if="business.domain" class="nameClient mb-2 d-inline"><i class="icon-desktop mr-2"></i><a
                            :href="'//' + buildUrl(business.domain)"
                            target="_blank"
                          >{{ buildUrl(business.domain) }}</a></small>
             <small class="nameClient mb-2 d-inline" v-if="business.phone"><i class="icon-phone mr-2"></i><span>{{ business.phone }}</span>
             </small>
             <small class="nameClient mb-2 d-inline" v-if="business.salaries"><i class="icon-users mr-2"></i><span>{{ business.salariesmin }} - {{ business.salaries }} employees</span>
             </small>

              <small class="mb-2">
              <a :href="'https://google.com/search?q='+ business.name + ' ' + business.city" target="_blank"> <i class="icon-google mr-2"></i></a>
              <a :href="'https://google.com/search?q='+ business.name + ' ' + business.city" target="_blank">
              <i class="icon-star ml-1" :class="business.stars > 0 ? 'text-warning' : 'text-secondary'"></i>
              <i class="icon-star ml-1" :class="business.stars > 1 ? 'text-warning' : 'text-secondary'"></i>
              <i class="icon-star ml-1" :class="business.stars > 2 ? 'text-warning' : 'text-secondary'"></i>
              <i class="icon-star ml-1" :class="business.stars > 3 ? 'text-warning' : 'text-secondary'"></i>
              <i class="icon-star ml-1" :class="business.stars > 4 ? 'text-warning' : 'text-secondary'"></i>
              </a>
              </small>
            
      </div>
      <div class="card mt-3 p-3" v-if="businessContacts.length > 0">
        <div class="row">
          <div class="col-md-12">
              <h6>{{ $t('lang.label.contacts') }}</h6>
          </div>
          </div>
          
        <div class="row" >
            <div v-for="(contact, key) in businessContacts" :key="key" class="col-12">
              <div class="opp card bg-light p-2 mt-2">
              
              <img  v-if="contact.photo" v-bind:class="{'imageblur':(contact.valid === 1)}" class="bg-dark float-left rounded-circle" :src="contact.photo" width=40 height=40>
              <div class="d-flex mt-2">
                
                <strong>
                  <div>{{ contact.name | formatContactName( contact.email ) }} </div>
                </strong>
                <a v-if="contact.linkedinurl" class="ml-2" 
                  :href="contact.linkedinurl" target="_blank" rel="noopener noreferrer">
                    <i class="icon-linkedin color-ln"></i>
                </a>
              
                <div
                  class="badge badge-danger d-inline ml-2"
                  v-if="contact.business_contact_status_id == 7"
                >{{ $t('lang.button.donotcontact') }}</div>
              </div>

              <div v-if="isContactManager(contact)">
                <small>{{replaceChain(contact.job)}}</small>
              </div>

               <div>
                <small class="font-weight-bold text-primary">{{ contact.email }}</small>
              </div>
              
              <div v-if="contact.phone">
                  <p><small>{{contact.phone}}</small></p>
                </div>
                <div v-else-if="permissionFront()">
                  <input type="tel" 
                    v-model="contact.newPhone" 
                    class="float-left mt-2 font-weight-normal"
                    v-bind:placeholder="$t('lang.label.addphone')"
                    pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}" />
                  <button 
                    @click="savePhoneContact(contact)"
                    class="float-left btn btn-primary btn-sm themed-button ml-2  mt-2 "
                  ><i class="icon-plus1"></i></button>
                </div>

              <div v-if="permissionFront()" class="float-right d-flex justify-content-end align-items-center mt-2">
                    <span v-if="contact.active == 1" class="badge badge-pill badge-success text-white px-3 pt-0">
                      <small>{{ $t('lang.label.active') }}</small>
                    </span>
                    <span v-else class="badge badge-pill badge-secondary px-3 pt-0 ml-2">
                      <small>{{ $t('lang.label.inactive') }}</small>
                    </span>
                  
                  <div v-if="contact.active == 1 || contact.business_contact_status_id != 7"  class="dropdown dropMenu">
                      <button class="btn btn-outline-dark rounded-pill pt-0 ml-2 menu-btn dropdown-toggle" type="button" id="dropMenuContact" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <small><i class="icon-ellipsis-h"></i></small>
                      </button>
                    <div class="dropdown-menu" aria-labelledby="dropMenuContact">
                        <button  v-if="contact.active == 1" @click="unsubscribeContactAction(contact.id, contact.business_contact_status_id)" class="dropdown-item" type="button">{{ $t('lang.button.unsubscribeall') }}</button>
                        <button v-if="contact.business_contact_status_id != 7" @click="changeBusinessContactStatusByLinkIdAction(contact.id, contact.business_contact_status_id)" class="dropdown-item" type="button">{{ statusButtonName('donotcontact') }}</button>
                    </div>
              </div>
            </div>

        </div>

              </div>
            </div>
        </div>
        
    </div>
  </div>
</template>

<script>
import { businessesService, businessContactsService} from "@/_services";
import { statusButtonMixin, urlMixin, logoMixin } from "@/_mixins";
import { mapActions, mapState} from "vuex";

export default {
  mixins: [statusButtonMixin, urlMixin, logoMixin],
  created() {
  this.isAdmin = false
    if(this.user.role_id == 1){
      this.isAdmin = true
    }
  },
  props: {
    business: Object,
    status: Object,
    businessContacts: Array,
    link: Object,
    unlocked: String,
    status: Object,
  },
  computed: {
    user() {
      return this.$store.state.authentication.user;
    },
    ...mapState({
      currentUser: (state) => state.authentication.user,
    })
  },
  methods: {

    replaceChain(chain){
      if(chain!=null){
        var search = '&amp;';
        var str=chain;
        str=str.replace(new RegExp(search,"g") ,"&");
        return str
      }
    },
 
    unlockContactsAction(linkId) {
      this.$emit("unlockContacts",{
      linkId: this.link.id,
      statusReason: "24"
      });
    },

    changeBusinessContactStatusByLinkIdAction(id, statusId) {
      this.$emit("changeBusinessContactStatusByLinkId",{
        businessContactId: id,
        linkId: this.link.id,
        statusId: 7
      });
    },    

    executeAction(action) {
      this.$emit(action);
    },

    isContactManager(contact) {
      return contact.role != "Generic";
    },

    permissionFront(){
      return (this.currentUser.team_role_id == undefined || this.currentUser.team_role_id != 3)
    },

    savePhoneContact(contact){
      this.$swal({
          type: "warning",
          title: this.$t('lang.label.areyousure'),
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33a2c",
          confirmButtonText: this.$t('lang.button.yes'),
          cancelButtonText: this.$t('lang.button.cancel')
      }).then(result => {
          if (result.value) {
            businessContactsService
            .setPhone(contact.id, contact.newPhone)
            .then(data => {
              contact.phone = contact.newPhone;
              contact.newPhone = '';
          });
        }
      });
    },
    unsubscribeContactAction(id, statusId){
      this.$emit("unsubscribeContact",{
        businessContactId: id,
        linkId: this.link.id,
        statusId: statusId
      });
    }
  }
};
</script>
<style>
.icon-linkedin-square{font-size: 16px;}
.color-ln{color:#0077B5;}
.menu-btn{
    height: 30px;
    width: 30px;
    position: relative;
}
.menu-btn small{
  position: absolute;
  top: 6px;
  left: 9px;
}
.menu-btn.dropdown-toggle::after{
  display: none;
}
.opp.card:hover,.opp.card{
  transform: none!important;
  box-shadow: 0px !important;
  transition: none !important;
}
.dropMenu .dropdown-menu.show{
  z-index: 99;
  left: -40px !important;
}
.btn.btn-succ,.btn.btn-succ:hover{
  background-color: #96D35F;
  border-color: #96D35F;
  color: #ffffff;
}
.badge-success.budge-succ{
  background-color: #96D35F;
  border-color: #96D35F;
  color: #ffffff;
}
</style>