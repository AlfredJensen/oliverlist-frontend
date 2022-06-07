<template>
    <div class="person-sheet">
        <LoadingSpinner v-if="loading"  />
       <main class=""  v-if="!loading" >
            {{udpdateHeader('contacts', selected.contact.name, selected.contact.email ) }}
           <div class="contenedor">
                <div class="contentCenter all" v-if="selected">
                    <div class="row ">
                        <div class="col-12">
                            <div class="card person rounded">
                                <div class="card-top rounded-top">
                                </div>
                                <div class="card-body pxmax-4">
                                    <div class="wrapper-img-person" >
                                        <img :src="getBusinessPhoto(selected.contact.photo)" class="rounded-circle img-profile"  alt="person image">
                                     </div>

                                      <label>{{ $t('lang.column.firstname') }}: </label>
                                     <h5>
                                      <input v-if="editing"
                                       v-model="selected.contact.first_name"
                                       type="text"  >
                                      <span v-else>
                                     {{ selected.contact.first_name }} 
                                     </span>
                                    </h5>
                                      <label>{{ $t('lang.column.lastname') }}: </label>
                                     <h5>
                                      <input v-if="editing"
                                       v-model="selected.contact.last_name"
                                       type="text">
                                      <span  v-else>
                                     {{ selected.contact.last_name }} 
                                     </span>

                                    </h5>
                                      <label>Linkedin: </label>
                                         <h6>
                                       <input v-if="editing"
                                       v-model="selected.contact.linkedinurl"
                                       type="text" >
                                      <span v-else>
                                     {{ selected.contact.linkedinurl }} 
                                     </span> 
                                     </h6>
                                     
                                     <div>

                                      <label>{{ $t('lang.column.jobtitle') }}: </label>
                                         <h6>
                                       <input v-if="editing"
                                       v-model="selected.contact.job"
                                       type="text">
                                      <span v-else>
                                     {{ selected.contact.job }} 
                                     </span> 
                                     </h6>

                                     </div>

                                      <label>{{ $t('lang.label.email') }}: </label>
                                     <h6>
                                        <span v-if="editing && selected.contact.campaign_act == null && selected.contact.campaign_name == null" 
                                        class="">
                                          <input
                                          v-model="selected.contact.email"
                                          type="text" >
                                        </span>
                                        <span v-else>
                                          {{ selected.contact.email }} 
                                        </span>
                                     <div>
                                      <div v-if="editing">
                                       <small v-if="selected.contact.campaign_act != null" class="text-danger">Ce contact a déjà été utilisé dans une campagne, son email ne peut pas être modifié</small>
                                       <small v-if="selected.contact.campaign_name != null" class="text-danger">Cet e-mail ne peut pas être modifié car le contact est lié à une campagne: {{selected.contact.campaign_name}}</small>
                                       </div>
                                       </div>
                                     </h6>

                                    <label>{{ $t('lang.label.phone') }}: </label>
                                     <h6>
                                      </span>
                                            <input v-if="editing"
                                       v-model="selected.contact.phone"
                                       type="text">
                                     </span>
                                      <span v-else>
                                     {{ selected.contact.phone }} 
                                     </span>
                                     </h6>
                                  <div v-if="selected.contact.client_id">
                                  <button
                                  v-if="!editing"
                                  @click="editing=true"
                                   class="btn btn-primary btn-sm">{{ $t('lang.label.edit') }}</button>
                                  <button v-if="editing"
                                  @click="update();editing=false" 
                                  class="btn btn-success mr-2 btn-sm">{{ $t('lang.button.save') }}</button>
                                  <button 
                                  v-if="editing" 
                                  @click="editing=false"
                                  class="btn btn-danger btn-sm">{{ $t('lang.button.cancel') }}</button>
                                  </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <LoadingSpinner v-if="loadingBusiness" />
                    <div  v-if="!loadingBusiness" class="row mt-4">
                        <div class="col-12">
                            <h5>
                                {{ $t('lang.label.companyinformation') }}
                            </h5>
                        </div>
                        <div class="col-sm-12 col-md-6">
                            <div class="card cardcompany p-4 mt-4">
                                <div class="px-4">
                                    <ul>
                                        <li class="my-2">
                                            <i class="icon-building-o mr-3"></i>
                                            <span class="font-weight-bold">
                                        <input v-if="editingbusiness"
                                       v-model="business.business.name"
                                       type="text"  >
                                      <span v-else>
                                     {{ business.business.name }} 
                                     </span>
                                            </span>
                                        </li>
                                         <li class="my-2">
                                            <i class="icon-phone mr-3"></i>
                                            <input v-if="editingbusiness"
                                             v-model="business.business.phone"
                                             type="text" >
                                            <span v-else>
                                           {{ business.business.phone }} 
                                           </span>
                                        </li>
                                        <li class="my-2">
                                            <i class="icon-map-marker mr-3"></i>
                                            <input v-if="editingbusiness"
                                             v-model="business.business.address"
                                             type="text" >
                                            <span v-else>
                                           {{ business.business.address }} 
                                           </span>
                                        </li>
                                         <li class="my-2">
                                            <i class="icon-globe mr-3"></i>
                                            <input v-if="editingbusiness"
                                             v-model="business.business.domain"
                                             type="text"  >
                                            <span v-else>
                                           {{ business.business.domain }} 
                                           </span>
                                        </li>
                                        <li class="my-2">
                                            <i class="icon-gear mr-3"></i>
                                            <input v-if="editingbusiness"
                                             v-model="business.business.category_name"
                                             type="text"  >
                                            <span v-else>
                                           {{ business.business.category_name }} 
                                           </span>
                                        </li>
                                         <li v-if="business.business.emails !=null" class="my-2">
                                            <i class="icon-mail_outline mr-3"></i>
                                            <span class="">{{business.business.emails}}</span>
                                        </li>
                                         <li v-if="business.business.stars !=null" class="my-2">
                                            <div class="d-flex align-items-center mr-2 my-2">
                                                <i class="icon-star mr-3"></i>  
                                                <StarRating :grade="convertType(business.business.stars)" :maxStars="5" ></StarRating>
                                            </div>
                                         </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-12 col-md-6">
                           <div class="card card-map p-4 mt-4">
                               <div id="map" ref="map"></div>
                           </div>
                        </div>
                    </div>
                    <div class="row mt-4">
                        <div class="col-12">
                            <h5>
                               {{ $t('lang.label.linkedopportunities') }}
                            </h5>
                            <div class="card opportunities-linked mt-4">
                                <div class="">
                                    <ul class="">
                                        <li  v-for="(opp ,key) in selected.opportunities" :key="key" class="p-4">
                                            <span class="font-weight-bold">{{opp.campaign_name}}</span>
                                            <span class="ml-4">
                                                <a :href="'/opportunities/'+opp.id" class="btn btn-secundary btn-sm themed-button"><i class="icon-search"></i></a>
                                            </span>
                      <div class="my-2">
                        <span class="mr-3">Last Activity:</span>
                        <span>{{opp.last_activity}}</span>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div class="row mt-4">
            <div class="col-12">
              <h5>{{ $t('lang.label.colleagues') }}</h5>
              <div class="card collegues mt-4">
                <div class>
                  <ul class>
                    <li v-for="(collegue ,key) in selected.collegues" :key="key" class="p-4">
                      <div class="d-flex align-items-center">
                        <div class="collegues-img mr-3">
                          <img
                            v-if="!collegue.photo"
                            src="@/assets/images/emptyperson.png"
                            class="rounded-circle img-collegue"
                            alt="person image"
                          />
                          <img
                            v-else
                            :src="collegue.photo"
                            class="rounded-circle img-collegue"
                            alt="person image"
                          />
                        </div>
                        <div>
                          <strong>{{ collegue.contact_name | formatContactName( collegue.email ) }}</strong>
                          <span class="badge badge-info ml-2">{{collegue.role}}</span>
                          <span class="ml-4">
                            <a
                              :href="'/contact/'+collegue.id"
                              class="btn btn-secundary themed-button"
                            >
                              <i class="icon-search"></i>
                            </a>
                          </span>
                          <div>
                            <small>{{collegue.job}}</small>
                          </div>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!--end contentCenter -->
      </div>
    </main>
  </div>
</template>
<script>
import { statusBadgeMixin, statusPointMixin } from "@/_mixins/";
import { mapState, mapActions } from "vuex";
import { router } from "@/_helpers";
import StarRating from "@/components/StarRating.vue";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import { businessContactsService } from "@/_services";
export default {
     mixins: [statusBadgeMixin,statusPointMixin],
     data(){
         return{
            editing:false,
            editingbusiness:false
            
         }
    },

    props: {
    selectedContactId: String,
    selectedBusinessId:String,
    },
    components: {
        LoadingSpinner,
        StarRating, 
    },
   
    updated(){
        if(!this.loadingBusiness){
             this.loadMap();
        }
    },

  computed: {
    ...mapState({
        loading: state => state.contacts.loading,
        loadingBusiness: state => state.businesses.loading,
        selected: state => state.contacts.selected.data,
        business: state => state.businesses.selected.data,
        currentUser: state => state.authentication.user
    }),
      currentPage(){
      if(this.$route.path.includes('/businesses')){this.changeHeaderTab({ tab: "ALL" });}
      return 
    },
  },
  created() {
    this.searchBusinessContact();
  },

    
    watch: {
        loading: function() {
             if(!this.loading){
                this.getBusiness(this.selected.contact.business_id.toString())
                
            }
        },
        currentPage(){
          if(this.$route.path.includes('/businesses')){this.changeHeaderTab({ tab: "ALL" });}
          return 
        },
    },

    created() {
        this.searchBusinessContact();
        
    },

    methods: {
        ...mapActions("contacts", {
            getBusinessContactById: "getContactById",
            startLoading: "startLoading",
            finishLoading: "finishLoading"
        }),
         ...mapActions("businesses", {
        getBusinessById: "getById",
        startLoading: "startLoading",
        finishLoading: "finishLoading"

        }),

        ...mapActions("header", {
        changeHeaderTab: "changeTab"
        }),
        ...mapActions("headertopbar", {
        setCurrentRoute:"setRoute",
        setCurrentRouteChild:"setRouteChild"
        }),

        convertName(contactName,email){
          if (!contactName) return '';
          if (contactName.match(RegExp('\\b' + 'Generic' + '\\b', "ig"))){
            if (!email) return '';
            let name=email.split('@')[0];
            name = name.replace(/[_.-]/gi, " ");
            name = name.replace(/(^\w{1})|(\s{1}\w{1})/g, match => match.toUpperCase());
            return name;}
          else
            return contactName;
        },

        udpdateHeader(route,name,email){
          let currentChild = this.convertName(name,email);
          this.setCurrentRoute({page:route});
          this.setCurrentRouteChild({child:currentChild});
        },
        update(){
              businessContactsService.update(this.selected.contact).then(business => {
                console.log(business)
              });
        },
        searchBusinessContact() {
            this.getBusinessContactById({ id: this.selectedContactId });
            this.getBusinessById( {id: this.selectedBusinessId} );
        } ,
        getBusiness(businessId){
            this.getBusinessById( {id: businessId} );
        },

        changeTab(selectedTab) {
        this.changeHeaderTab({ tab: selectedTab });
        },
        convertType(value){
            let v = parseInt(value);
            return v
        },
          getBusinessPhoto(photo){
      if(photo){
        return "https://img.app.oliverlist.com/" + btoa(photo);
      }else{
        return "data:image/png;base64,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";

      }

    },
        loadMap(){
            function truncate(n) {
                return n > 0 ? Math.floor(n) : Math.ceil(n);
            }  

            if(this.business.business.latitude == null){
              return;
            }

            let getDMS = function  (dd, longOrLat) {
                let hemisphere = /^[WE]|(?:lon)/i.test(longOrLat)
                ? dd < 0
                ? "W"
                : "E"
                : dd < 0
                ? "S"
                : "N";
                
                const absDD = Math.abs(dd);
                const degrees = truncate(absDD);
                const minutes = truncate((absDD - degrees) * 60);
                const seconds = ((absDD - degrees - minutes / 60) * Math.pow(60, 2)).toFixed(2);
                
                let dmsArray = [degrees, minutes, seconds, hemisphere];
               
                return dmsArray;
               
            }
            
            let m = document.getElementById('map');

            let lat = this.business.business.latitude;
            let lon =  this.business.business.longitude;
            let latDMS = getDMS(lat, 'lat'); 
            let lonDMS = getDMS(lon, 'long');
            let caracter='"';
            let url = "https://maps.google.com/maps?q="+"%2B"+latDMS[0]+"%C2%B0+"+latDMS[1]+"+"+latDMS[2]+",+"+lonDMS[0]+"%C2%B0+"+lonDMS[1]+"+"+lonDMS[2]+""+"&hl=en&z=14&amp;output=embed"
            const html = "<iframe height='250' frameborder='0' scrolling='no' marginheight='0' marginwidth='0' src='"+ url +"'></iframe>"
            m.innerHTML = html;

           
        },

    changeTab(selectedTab) {
      router.push({
        name: "businesses",
      });
      this.changeHeaderTab({ tab: selectedTab });
    },
  },
};
</script>
<style>
.person-sheet .img-profile{
  height: 100px;
  width: 100px;
}
.person-sheet .collegues-img img{
  width: 50px;
  height: 50px;
}
</style>

 <style>
.card.person .icon-linkedin{
    color: #0077B5;
}
.card-map{
    min-height:300px ;
}
.cardcompany{
    min-height: 305px;
}
.card-map #map iframe{
    width: 100% !important;
}
.cardcompany .rating-component .grade{
    color:#808080;
}
</style>