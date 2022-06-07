<template>
  <div class="business-sheet">
    <LoadingSpinner v-if="loading" />
    <main class v-if="!loading">
       {{udpdateHeader('companies', selected.name ) }}
      <div class="contenedor">
        <div class="contentCenter all">
          <div class="row">
            <div class="col-12">
              <div class="card business rounded">
                <div class="card-top rounded-top"></div>
                <div class="card-body pxmax-4">
                  <div class="wrapper-img-business">
                    <div class="content-img-business">
                      <img
                        v-if="!selectedbusiness.business.logo"
                        src="@/assets/images/realstate.png"
                        class="img-business blackwhite"
                        alt="business image"
                      />
                      <img
                        v-else
                        :src="selectedbusiness.business.logo"
                        class="img-business"
                        alt="business image"
                      />
                    </div>
                  </div>
                  <h3>{{ selected.name }}</h3>
                  <p>{{ selected.snippet }}</p>
                  <div class="d-flex align-items-center mr-2 my-2">
                    <p class="mr-3">{{selected.alias}}</p>
                    <StarRating v-if="selected.stars !=null" :grade="convertType(selected.stars)" :maxStars="5" ></StarRating>
                  </div>
                  <div>
                    <span
                      v-if="selected.category_name"
                      class="badge"
                      :class="statusBadge(selected.category_name)"
                    >{{selected.category_name }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="row mt-4 contact-information-business">
            <div class="col-12">
              <h5>{{ $t('lang.label.contactinfo') }}</h5>
            </div>
            <div class="col-6">
              <div class="card p-4 mt-4">
                <div class="px-4 h-100 d-block">
                  <ul class="h-100 d-flex flex-column justify-content-around">
                    <li v-if="selected.phone != null" class="my-2">
                      <i class="icon-phone mr-3"></i>
                      <span class>{{selected.phone}}</span>
                    </li>
                    <li class="my-2">
                      <i class="icon-room mr-3"></i>
                       <span>{{selected.address}}, {{selected.city}}</span>
                    </li>
                    <li v-if="selected.emails != null" class="my-2">
                      <i class="icon-markunread mr-3"></i>
                      <span class>{{selected.emails}}</span>
                    </li>
                    <li class="my-2">
                      <i class="icon-public mr-3"></i>
                      <a :href="'http://'+selected.domain" target="_blank">
                        <span class>{{selected.domain}}</span>
                      </a>
                    </li>
                    <li class="my-2" v-if="selected.url">
                     <a class="mr-2"
                     :href="selected.url" target="_blank" rel="noopener noreferrer">
                       <i class="icon-linkedin-square color-ln mr-3"></i>Linkedin
                     </a>
                   </li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="col-sm-12 col-md-6">
              <div class="card card-map p-4 mt-4">
                  <div v-if="selected.latitude" id="map" ref="map"></div>
              </div>
            </div>
          </div>
          <div class="row mt-4">
            <div class="col-12">
              <h5>{{ $t('lang.label.linkedopportunities') }}</h5>
              <div class="card opportunities-linked mt-4">
                <div class>
                  <ul class>
                    <li v-for="(opp ,key) in selectedbusiness.links" :key="key" class="p-4">
                      <span class="font-weight-bold">{{opp.campaign_name}}</span>
                      <span class="ml-4">
                        <a :href="'/opportunities/'+opp.id" class="btn btn-secundary themed-button">
                          <i class="icon-search"></i>
                        </a>
                      </span>
                      <div class="my-2">
                        <span class="mr-3">Status:</span>
                        <span class="badge" :class="statusBadge(opp.status)">{{opp.status}}</span>
                      </div>
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
              <h5>{{ $t('lang.label.previouslyengagedcontacts') }}</h5>
              <div class="card collegues mt-4">
                <div class>
                  <ul class>
                    <li v-for="(collegue ,key) in selectedbusiness.contacts" :key="key" class="p-4">
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
                           <strong> {{ collegue.first_name + ' '+ collegue.last_name | formatContactName( collegue.email ) }}</strong>
                          <span class="badge badge-info ml-2">{{collegue.role}}</span>
                          <div>
                            <small>{{collegue.job}}</small>
                          </div>
                        </div>
                        <div>
                          <span class="ml-4">
                            <a
                              :href="'/contact/'+collegue.id"
                              class="btn btn-secundary themed-button"
                            >
                              <i class="icon-search"></i>
                            </a>
                          </span>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <!-- <div class="row mt-4">
            <div class="col-12">
              <h5>Financial and juridical information</h5>
              <div class="card collegues mt-4 p-2">
                <div class="p-4">
                  <h6 class="mt-4 pb-2">About the establishment</h6>
                  <table class="table table-bordered mb-4">
                    <tbody>
                      <tr>
                        <th scope="row">SIRET</th>
                        <td>53517063300015</td>
                      </tr>
                      <tr>
                        <th scope="row">NAF Code</th>
                        <td>4399C</td>
                      </tr>
                      <tr>
                        <th scope="row">Number of employees</th>
                        <td>1 2 Employees</td>
                      </tr>
                      <tr>
                        <th scope="row">Company typology</th>
                        <td>Corporate Office</td>
                      </tr>
                    </tbody>
                  </table>
                  <h6 class="mt-4 pt-2">About the company</h6>
                  <table class="table table-bordered mt-3">
                    <tbody>
                      <tr>
                        <th scope="row">SIREN</th>
                        <td>535170633</td>
                      </tr>
                      <tr>
                        <th scope="row">Headquarters</th>
                        <td>4 r Ste Marguerite, 97490 Saint Denis</td>
                      </tr>
                      <tr>
                        <th scope="row">Juridical Status</th>
                        <td>SARL unipersonnelle</td>
                      </tr>
                      <tr>
                        <th scope="row">Creation date</th>
                        <td>01/10/2011</td>
                      </tr>
                      <tr>
                        <th scope="row">Number of employees</th>
                        <td>1 2 Employees</td>
                      </tr>
                      <tr>
                        <th scope="row">Other names</th>
                        <td>---</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>-->

          <!-- <div class="row mt-4">
            <div class="col-12">
              <h5>Notice</h5>
              <div class="card collegues mt-4">
                <div class>
                  <ul class="list-collegues">
                    <li v-for="(notice ,key) in notices" :key="key" class="p-4">
                      <div class="d-flex align-items-center">
                        <div class="collegues-img mr-3">
                          <img
                            src="@/assets/images/emptyperson.png"
                            class="rounded-circle img-collegue"
                            alt="person image"
                          />
                        </div>
                        <div>
                          <strong>{{notice.name}}</strong>
                          <div>
                            <StarRating :grade="4" :maxStars="5"></StarRating>
                          </div>
                          <div>
                            <small>{{notice.comment}}</small>
                          </div>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>-->
        </div>
        <!--end contentCenter -->
      </div>
    </main>
  </div>
</template>
<script>
import { statusBadgeMixin, statusPointMixin } from "@/_mixins/";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import { router } from "@/_helpers";
import { mapState, mapActions } from "vuex";
import StarRating from "@/components/StarRating.vue";

export default {
  mixins: [statusBadgeMixin, statusPointMixin],
  props: {
    selectedBusinessId: String,
  },
  components: {
    StarRating,
    LoadingSpinner,
  },
   updated(){
        if(!this.loading){
             this.loadMap();
        }
    },
  computed: {
    ...mapState({
      loading: (state) => state.businesses.loading,
      selected: (state) => state.businesses.selected.data.business,
      selectedbusiness: (state) => state.businesses.selected.data,
      currentUser: (state) => state.authentication.user,
    }),
     currentPage(){
          if(this.$route.path.includes('/businesses')){this.changeHeaderTab({ tab: "ALL" });}
          return 
    },
  },

  data() {
    return {
      business: {
        name: "Super Immo Concept 54",
        alias: "Real Estate Agency",
        category_name: "Real Estate",
        raing: "4.6",
        reviews: "399",
        employers: "1-50",
      },
      contactInformation: {
        address: "43 Rue Du Mont Saint George, Saint Francois",
        phone: "01 68 75 95 60",
        email: "concept@immo.fr",
        website: "www.immmoconcept.fr",
      },
      opp_linked: [
        {
          opp_name: "Opportunité Website Immo Concept 54",
          status: "positive",
          last_activity: "24.04.2020",
        },
        {
          opp_name: "Opportunité Website Immo Concept 54",
          status: "negative",
          last_activity: "24.04.2020",
        },
      ],
      collegues: [
        {
          name: "Camilla Corbello",
          job: "Responsable Gestion at Immo 54",
          role: "Administration",
        },
        {
          name: "Fabianne Blot",
          job: "Responsable Gestion at Immo 54",
          role: "Operations",
        },
      ],
      notices: [
        {
          name: "Camilla Corbello",
          score: "4.8",
          comment: "Very good, the service here is amazing",
        },
        {
          name: "Camilla Corbello",
          score: "4.8",
          comment: "Very good, the service here is amazing",
        },
        {
          name: "Camilla Corbello",
          score: "4.8",
          comment: "Very good, the service here is amazing",
        },
        {
          name: "Camilla Corbello",
          score: "4.8",
          comment: "Very good, the service here is amazing",
        },
      ],
    };
  },
   watch: {
        currentPage(){
          if(this.$route.path.includes('/businesses')){this.changeHeaderTab({ tab: "ALL" });}
          return 
        },
    },

  created() {
    this.getBusinessById({ id: this.selectedBusinessId });
  },
  methods: {
    ...mapActions("businesses", {
      getBusinessById: "getById",
      startLoading: "startLoading",
      finishLoading: "finishLoading",
    }),

    ...mapActions("header", {
      changeHeaderTab: "changeTab",
    }),
    changeTab(selectedTab) {
      router.push({
        name: "businesses",
      });
      this.changeHeaderTab({ tab: selectedTab });
    },
     ...mapActions("headertopbar", {
        setCurrentRoute:"setRoute",
        setCurrentRouteChild:"setRouteChild"
        }),
        udpdateHeader(route,currentChild){
          this.setCurrentRoute({page:route});
          this.setCurrentRouteChild({child:currentChild});
        },
     convertType(value){
            let v = parseInt(value);
            return v
        },
         loadMap(){
            function truncate(n) {
                return n > 0 ? Math.floor(n) : Math.ceil(n);
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

            let lat = this.selected.latitude;
            let lon =  this.selected.longitude;
            let latDMS = getDMS(lat, 'lat'); 
            let lonDMS = getDMS(lon, 'long');
            let caracter='"';
            let url = "https://maps.google.com/maps?q="+"%2B"+latDMS[0]+"%C2%B0+"+latDMS[1]+"+"+latDMS[2]+",+"+lonDMS[0]+"%C2%B0+"+lonDMS[1]+"+"+lonDMS[2]+""+"&hl=en&z=14&amp;output=embed"
            const html = "<iframe height='250' frameborder='0' scrolling='no' marginheight='0' marginwidth='0' src='"+ url +"'></iframe>"
            m.innerHTML = html;

           
        },

  },
};
</script>
<style>
.img-business.blackwhite {
  filter: grayscale(100%);
}
.business-sheet .collegues-img img {
  width: 50px;
  height: 50px;
  background: lightgrey;
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
