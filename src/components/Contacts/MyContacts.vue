<template>
  <div>
  <section class="businesses-list mt-2 pt-5">
  <div class="contenedor animated fadeIn fast">
  {{ $t('lang.mycontacts.customfieldsdesc') }}
  <router-link class="btn btn-sm btn-primary mb-2" to="/settings-account?mycustomfields=1" tag="button">
      {{ $t('lang.mycontacts.gotocreatecustomfields') }}</router-link>
    <div class="row">
      <div class="col-md-12">
        <button 
          @click="openCsvModal = true;finishimported=false;importnumber++"
         
        class="w-100 p-2 mb-2 mt-2 btn btn-success btn-sm" >
          <i class="icon-upload"></i>
          {{ $t('lang.label.csvimport') }}
        </button>
        <ImportContacts
          :key="importnumber"
          v-if="openCsvModal == true"
         @contactImported="contactImported" 
         @finishImported="finishImported" />
      </div>
   </div>
</div>


  <div class="contenedor animated fadeIn fast">
      <div class="" v-if="!showEmptyImage()">
                          <button v-if="!showEmptyImage()" class="float-left mt-2 btn btn-primary themed-button btn-sm" @click="refresh" type="submit"  >
                          <i class="icon-refresh"></i>
                        </button>
    <div class="row">
        <FilterSystem class="display-inline" :columns="contactsColumns" :reset="resetFilterSystem" :sort="sort" :dir="dir" :filterSystem="filtersSystem" :filterOldQuery="oldQuery" @callApi="callApi" />
         <button
            v-if="!showEmptyImage() && !allPagesSelected"
            :disabled="checkedContacts.length == 0"
            @click="deleteChecked()"
            type="button"
            class="display-inline ml-2 btn btn-danger btn-sm mt-2"
            >
            <span>{{ $t('lang.label.remove') }} {{ this.$t('lang.mycontacts.deletecontactstotal',{'contacts':checkedContacts.length}) }} </span>
          </button>
         <button
            v-if="allPagesSelected"
            @click="deleteAllPages()"
            type="button"
            class="display-inline ml-2 btn btn-danger btn-sm mt-2"
            >
            <span>{{ $t('lang.label.remove') }} {{ this.$t('lang.mycontacts.deletecontactstotal',{'contacts':totalBusinesses}) }} </span>
          </button>
      </div>
    </div>
    <LoadingSpinner v-if="loading" />
    <div class="wrappList animated fadeIn fast"  v-if="!loading">
      <div class="wrappList">
        <div class="table-responsive">
          <div class="mt-4 pl-2" v-if="!showEmptyImage()">
          <span class="badge bg-danger text-white">
            Bounced</span> 
            <small> {{ this.$t('lang.mycontacts.bouncedemail') }}</small>
         </div>
          <div>
                 <button
                    v-if="checkedContacts.length > 0 && allPagesSelected == false && pageCount > 1 && false"
                    @click="selectAllPages(true)"
                    type="button"
                    class="display-inline ml-2 btn btn-primary btn-sm mt-2"
                    >
                    <span>{{ $t('lang.mycontacts.selectallpages') }} ({{ totalBusinesses }} {{  $t('lang.label.importedcontacts')}})</span>
                  </button>
                 <button
                    v-if="checkedContacts.length > 0 && allPagesSelected == true"
                    @click="selectAllPages(false)"
                    type="button"
                    class="display-inline ml-2 btn btn-primary btn-sm mt-2"
                    >
                    <span>{{ $t('lang.mycontacts.unselectallpages') }} ({{ totalBusinesses }} {{  $t('lang.label.importedcontacts')}})</span>
                  </button>
          </div>
          <table class="table table-hover  card-style" v-if="!showEmptyImage()">
            <thead>
              <tr>
                <th>
                  {{ $t('lang.label.all') }}
                  <input type="checkbox" v-model="selectAll" @change="checkboxall()" value="true">
                </th>
                 <th>
                 </th>
                <th scope="col" style="white-space:nowrap;" class="cursor-pointer" @click="orderBy('name')">
                  {{ $t('lang.column.name') }}
                  <span v-if="sort == 'business_contact.name' && dir=='asc'" class="icon-angle-double-up ml-2" />
                  <span v-if="sort == 'business_contact.name' && dir=='desc'" class="icon-angle-double-down ml-2" />
                  <span v-if="sort != 'business_contact.name'"  class="icon-angle-down ml-2" />
                </th>
                <th scope="col" style="white-space:nowrap;" class="cursor-pointer">
                  {{ $t('lang.label.activecampaigns') }}
                </th>
                <th scope="col" style="white-space:nowrap;" class="cursor-pointer" @click="orderBy('job')">
                  {{ $t('lang.column.jobtitle') }}
                  <span v-if="sort == 'business_contact.job' && dir=='asc'" class="icon-angle-double-up ml-2" />
                  <span v-if="sort == 'business_contact.job' && dir=='desc'" class="icon-angle-double-down ml-2" />
                  <span v-if="sort != 'business_contact.job'"  class="icon-angle-down ml-2" />
                </th>
                <th scope="col" style="white-space:nowrap;" class="cursor-pointer" @click="orderBy('email')">
                  Email
                  <span v-if="sort == 'business_contact.email' && dir=='asc'" class="icon-angle-double-up ml-2" />
                  <span v-if="sort == 'business_contact.email' && dir=='desc'" class="icon-angle-double-down ml-2" />
                  <span v-if="sort != 'business_contact.email'"  class="icon-angle-down ml-2" />
                </th>
                <th scope="col" style="white-space:nowrap;" class="cursor-pointer" @click="orderBy('company')">
                  {{ $t('lang.column.company') }}
                  <span v-if="sort == 'business.name' && dir=='asc'" class="icon-angle-double-up ml-2" />
                  <span v-if="sort == 'business.name' && dir=='desc'" class="icon-angle-double-down ml-2" />
                  <span v-if="sort != 'business.name'"  class="icon-angle-down ml-2" />
                </th>
                <th scope="col" style="white-space:nowrap;">{{ $t('lang.column.category') }}</th>
                <th scope="col" style="white-space:nowrap;">{{ $t('lang.label.postalcode') }}</th>
                <th scope="col" style="white-space:nowrap;" class="cursor-pointer" @click="orderBy('salaries')">
                  {{ $t('lang.label.companysize') }}
                  <span v-if="sort == 'business.salaries' && dir=='asc'" class="icon-angle-double-up ml-2" />
                  <span v-if="sort == 'business.salaries' && dir=='desc'" class="icon-angle-double-down ml-2" />
                  <span v-if="sort != 'business.salaries'"  class="icon-angle-down ml-2" />
                </th>
                <th scope="col" style="white-space:nowrap;">{{ $t('lang.column.phone') }}</th> 
                <th scope="col" style="white-space:nowrap;" class="cursor-pointer" @click="orderBy('city')">
                  {{ $t('lang.column.city') }}
                  <span v-if="sort == 'business.city' && dir=='asc'" class="icon-angle-double-up ml-2" />
                  <span v-if="sort == 'business.city' && dir=='desc'" class="icon-angle-double-down ml-2" />
                  <span v-if="sort != 'business.city'"  class="icon-angle-down ml-2" />
                </th>
                <th scope="col">Linkedin</th>
                <th v-for="(customCol, keyc) in customColumns">{{ customCol }}</th>
            </tr>
          </thead>
          <tbody v-if="!showEmptyImage()">
                  <tr v-for="(business, key) in businesses.list" :key="key" class="shadow-sm p-3 mb-3 bg-white rounded">
                    <td>
                      <input  
                      type="checkbox" 
                      v-model="checkedContacts"
                      :disabled="business.campaign_name || business.campaign_act"
                      :id="key" 
                      :name = "key"  
                      :value="business.id"
                      >
                    </td>
                    <td>
                      <img :src="getBusinessPhoto(business.photo)" class="float-left rounded-circle"  width="25" height="25"   alt="person image">
                    </td>
                    <td style="white-space:nowrap;">
                      <div
                      class="cursor-pointer" style="color:#8580f2"
                      @click="goToContact(business.id, business.business_id )"
                      >{{ business.contact_name | formatContactName(business.email) }}
                      <span  class="badge bg-success text-white" v-if="business.client_id">import csv</span>                      
                      <span  v-else  class="badge bg-primary text-white">oliver</span>

                      <span v-if="business.business_contact_status_id == 5"  class="badge ml-2 bg-danger text-white">Bounced</span>

                      </div>
                    </td>
                    <td style="min-width: 150px;">{{ business.campaign_name }}</td>
                    <td  style="min-width: 150px;" class="hovertext"><span>{{ business.job }}</span></td>
                    <td style="white-space:nowrap;">{{ business.email }}</td>
                    <td  style="min-width: 250px;" class="hovertext2">
                    <div
                    class="cursor-pointer" style="color:#8580f2"
                    @click="goToBusiness(business.business_id,business.id)"
                    >{{ business.business_name | capitalize }}</div>
                  </td>

                  <td  style="min-width: 150px;" class="hovertext"><span>{{ business.category_name }}</span></td>
                  <td  style="min-width: 150px;" class="hovertext"><span>{{ business.postal_code }}</span></td>
                  <td style="min-width: 150px;">
                    <div  class="badge" style="background-color:#5155ea; color:white">
                      <span> {{ getSalaries(business.salaries) }}</span>
                    </div>
                  </td>
                  <td style="white-space:nowrap;">{{ business.business_phone }}</td>
                  <td  style="min-width: 150px;" class="hovertext2">{{ business.city }}</td>
                  <td  style="min-width: 150px;">
                    <div class="d-flex mt-2">
                      <a
                      v-if="business.linkedinurl"
                      class="mr-2"
                      :href="business.linkedinurl"
                      target="_blank"
                      rel="noopener noreferrer"
                      >
                      <i class="icon-linkedin-square color-ln"></i>
                    </a>
                  </div>
                </td>                
                <td v-for="(customColumnValue, keyvalue) in customColumns">{{ getRowValues(keyvalue,key) }}</td>

                  </tr>

                </tbody>
              </table>
              <div class="w-100 text-center pt-5"  v-if="!showEmptyImage() && this.businesses.length == 0">
                  <span
                    class="font-weight-light ft-1-5 text-center text-secondary">
                  {{ $t('lang.label.noresultsfound') }}
                </span>
              </div>
                <div class="w-100 text-center pt-5"  v-if="showEmptyImage()">
                    <img src="@/assets/images/id-card.png" class="">
                      <div class="mt-3 text-center">
                        <span
                        class="font-weight-light ft-1-5 text-center text-secondary"
                        >{{ $t('lang.label.therearenobusinessesatthemoment') }}</span>
                      </div>
                  </div>
            </div>
            <div class="table-footer row mb-2 mt-2" v-if="totalBusinesses > 0">
              <div class="col-12 text-left mb-3">
                <span
                class="font-weight-bold"
                >{{ $t('lang.label.showing') }} {{ firstInPage }} {{ $t('lang.label.to') }} {{ lastInPage }} {{ $t('lang.label.of') }} {{ totalBusinesses }} {{ $t('lang.label.contacts') }}.</span>
              </div>
              <div class="col-9">
                <button
                type="button"
                class="btn btn-primary btn-sm themed-button"
                :disabled="isFirstPage"
                @click="prevPage()"
                >
                <span class="icon-angle-double-left mr-2" />{{ $t('lang.button.previous') }}
              </button>
              <button
              type="button"
              class="btn btn-primary btn-sm themed-button ml-2"
              :disabled="isLastPage"
              @click="nextPage()"
              >
              {{ $t('lang.button.next') }}
              <span class="icon-angle-double-right ml-2" />
            </button>
          </div>
          <div class="col-3 dropdown text-right">

            <button
            type="button"
            class="display-inline ml-2 btn btn-secondary btn-sm dropdown-toggle themed-button"
            id="dropdownCantPerPage"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
            data-offset="10,20"
            >
            <span>{{ cantPerPage }} {{ $t('lang.button.perpage') }}</span>
          </button>
          <div class="dropdown-menu" aria-labelledby="dropdownCantPerPage">
            <a
            class="dropdown-item cursor-pointer"
            v-for="(optionCant, index) in cantPerPageOptions"
            :key="index"
            @click="cantPerPage = optionCant"
            >{{ optionCant }} {{ $t('lang.button.perpage') }}</a>
          </div>
        </div>
      </div>
    </div>
    </div>
  </div>
</section>

</div>
</template>
<script>


import moment from "moment";
import ImportContacts from "@/components/Contacts/ImportContacts.vue";

import { mapState, mapActions, mapMutations } from "vuex";
import { router } from "@/_helpers";
import { statusBadgeMixin, urlMixin, logoMixin, formattersMixin } from "@/_mixins/";
import { businessStatusService, categoriesService, businessContactsService } from "@/_services";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import FilterSystem from "@/components/FilterSystem.vue";

export default {
  data() {
    return {
      selectAll: false,
      openCsvModal: false,
      allPagesSelected: false,
      importnumber:1,
      finishimported: true,
      cantPerPage: 50,
      cantPerPageOptions: [5, 10, 20, 50, 100],
      businessStatus: [],
      categories: [],
      searchFilter: {},
      quickSearchFilter: '',
      checkedContacts:[],
      resetFilterSystem: false,
      customColumns: [],
      contactsColumns: [
        {
          name: this.$t('lang.label.name'),
          name_ : "name",
          type: "string",
          field: 'business_contact.name'
        },
        {
          name: this.$t('lang.label.email'),
          name_ : "email",
          type: "string",
          field: 'business_contact.email'
        },
        {
          name: this.$t('lang.label.companyname'),
          name_ : "company",
          type: "string",
          field: 'business.name'
        },
        {
          name: this.$t('lang.label.city'),
          name_ : "city",
          type: "string",
          field: 'business.city'
        },
        {
          name: this.$t('lang.label.jobtitle'),
          name_ : "job",
          type: "string",
          field: 'business_contact.job'
        },
        {
          name: this.$t('lang.label.companysize'),
          name_ : "salaries",
          type: "number",
          field: 'business.salaries'
        },
      ],
      sort: '',
      dir: ''
    };
  },

  mixins: [statusBadgeMixin, urlMixin, logoMixin, formattersMixin],

  components: {
    LoadingSpinner,
    FilterSystem,
    ImportContacts,
    formattersMixin
  },


  watch: {
    currentPage() {
      this.checkedContacts = []
      this.selectAll = false
      if (this.resetFilterSystem == true){
        this.searchBusinesses();
      }else{
        this.refresh();
      } 
    },

    cantPerPage() {
      this.checkedContacts = []
      this.selectAll = false
      if (this.resetFilterSystem == true){
        this.searchBusinessesWithPageReset();
      }else{
        this.refresh();
      }
    },

    
  },



  computed: {
    ...mapState({
      loading: (state) => state.contactscsv.loading,
      businesses: (state) => state.contactscsv.all.data,
      filters: (state) => state.contactscsv.allFilters,
      filtersSystem: (state) => state.contactscsv.filtersSystem,
      oldQuery: (state) => state.contactscsv.oldQuery,
      currentUser: (state) => state.authentication.user,
      currentPage: state => state.contactscsv.currentPage, 
    }),

    routePage(){
       if(this.$route.fullPath == '/businesses'){
          this.changeHeaderTab({ tab: "ALL" })
          this.udpdateHeader('contacts');
       }else{
        if( this.$route.path.includes( '/company')  ){
           this.changeHeaderTab({ tab: "SelectedCompany" });
        }else{
          if( this.$route.path.includes( '/contact')  ){
            this.changeHeaderTab({ tab: "SelectedContact" });
          }
        }
      }
      },
    isFirstPage() {
      return this.currentPage === 1;
    },

    isLastPage() {
      return this.currentPage === this.pageCount;
    },

    pageCount() {
      var cantPage = this.totalBusinesses / this.cantPerPage;
      var fixedCantPage = parseInt(cantPage.toFixed());
      if (cantPage > fixedCantPage) {
        return fixedCantPage + 1;
      } else {
        return fixedCantPage;
      }
    },

    firstInPage() {
      return (this.currentPage - 1) * this.cantPerPage + 1;
    },

    lastInPage() {
      if (
        this.totalBusinesses >= this.firstInPage &&
        this.totalBusinesses <= this.currentPage * this.cantPerPage
        ) {
        return this.totalBusinesses;
    } else {
      return this.currentPage * this.cantPerPage;
    }
  },


  totalBusinesses() {
    if (
      this.businesses !== undefined &&
      this.businesses.total !== undefined
      ) {

      this.$store.state.contactscsv.empty = false
      return this.businesses.total;
  } else {
    return 0;
  }
},

},


created() {

    if(this.businesses === undefined){
      this.cantPerPage = 50;
      this.searchBusinesses();
    }

    if(this.$route.fullPath == '/mycontacts'){
      this.openCsvModal = true;
      this.finishimported = false;
    }

    businessContactsService.getCustomFields().then(
      (response) => {
        response.forEach((item,key) => {
          this.contactsColumns.push({
                  name: item.label,
                  name_: item.label,
                  type: item.type,
                  field: "custom_field_"+item.id
                })
          this.customColumns[item.id] = item.label
          
        });
      }
    );
  
},


  methods: {
    ...mapActions("header", {
      changeHeaderTab: "changeTab"
    }),

    ...mapMutations('contactscsv',{
        nextPage: 'nextPage',
        prevPage: 'prevPage',
        resetPage: 'resetPage'
    }),
    ...mapActions("contactscsv", {
      getAllBusinessContacts: "getAll",
      getAllByFilter: "getAllByFilter",
      setFilterSystem : "setFilterSystem",
      resetFiltersSystem : "resetFilterSystem",
    }),

    ...mapActions("header", {
      changeHeaderTab: "changeTab",
    }),
     ...mapActions("headertopbar", {
         setCurrentRoute:"setRoute",
         setCurrentRouteChild:"setRouteChild"
    }),

     udpdateHeader(route){
      this.setCurrentRoute({page:route});
      this.setCurrentRouteChild({child:''});
    },
    getRowValues(indexColumn,indexBusinessContact){
      let custom_val = this.businesses.list[indexBusinessContact].custom_values
      let custom_cols = this.businesses.list[indexBusinessContact].custom_columns

      if(custom_val !== null){
        custom_val = custom_val.split(',')
        custom_cols = custom_cols.split(',')
        for(let i=0;i < custom_cols.length;i++){
            if(custom_cols[i] == indexColumn)
              return custom_val[i]
        }
      }
      return " "
    },
    contactImported(){

    },
    selectAllPages(st){
      this.allPagesSelected = st
      if(st) {  
        this.selectAll = true   
        this.checkboxall()
      }else{
        this.checkedContacts = []
        this.selectAll = false 
      }
    },

    checkboxall(){
        this.checkedContacts = []
        for(let i=0;i < this.businesses.list.length;i++){
          if(!this.businesses.list[i].campaign_name && !this.businesses.list[i].campaign_act){
            if(this.selectAll){
              this.checkedContacts.push(this.businesses.list[i].id)
            }else{
              this.checkedContacts.pop(this.businesses.list[i].id)
            }
          }
        }
    },

    resetImport(){
      this.$forceUpdate()
    },

    finishImported(){
      this.searchBusinesses()
      this.finishimported = true
    },


    refresh() {
      if(this.searchFilter !== undefined &&
        this.searchFilter.filters  !== undefined){
        
        this.searchFilter.filters['importcsv'] = true;
        this.getAllByFilter({
          currentPage: this.currentPage,
          cantPerPage: this.cantPerPage,
          searchFilter: this.searchFilter.filters,
        });

      }else{
        this.searchBusinesses();
      }
    },
  
    deleteChecked(){
        this.$swal({
              type: 'warning',
              title: this.$t('lang.mycontacts.deletecontactstotal',{'contacts':this.checkedContacts.length}) + ' ' + this.$t('lang.label.areyousure'),
              text: "",
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33a2c',
              confirmButtonText: this.$t('lang.button.yes'),
          }).then((result) => {
              if (result.value) {
                businessContactsService.deleteChecked(this.checkedContacts).then( result => { 
                  this.checkedContacts=[];
                  this.refresh();
                } );
           }
       });
    },

    deleteAllPages(){
       this.$swal({
              type: 'warning',
              title: this.$t('lang.mycontacts.deletecontactstotal',{'contacts':this.totalBusinesses}) + ' ' + this.$t('lang.label.areyousure'),
              text: "",
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33a2c',
              confirmButtonText: this.$t('lang.button.yes'),
          }).then((result) => {
              if (result.value) {
                businessContactsService.deleteAll();
           }
       });
    },
 
    showEmptyImage(){
      return this.$store.state.contactscsv.empty
    },
    getSalaries(salaries){   
      if(salaries > 200){
        return "+200";
      }
      if(salaries <= 200 && salaries > 10){
        return "10-200";
      }
      return "1-10";
    },

  addCampaign() {
      this.changeHeaderTab({ tab: "SELECTED" });
      router.push({
        name: "campaigns"
      });  
       
  },

  orderBy(columnName){
    let column = this.contactsColumns.filter(c => c.name_ === columnName)[0];
    if (column != undefined){
      if (this.sort == column.field){
        if (this.dir == 'desc'){
          this.dir = 'asc';
        }else{
          this.dir = 'desc';
        }
      }else{
        this.dir = 'desc';
        this.sort = column.field;
      }
    }
  },

  openPopup(){
      this.$swal({
        title: this.$t('lang.button.whatisacontact'),
        html: '<iframe class="w-100"  height="400" src="https://player.vimeo.com/video/470886986" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>',
        width: '800px',
        showCancelButton: true,
        showConfirmButton: false,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33a2c",
        cancelButtonText: this.$t('lang.button.cancel')
      }).then(result => {
        if (result.value) {
          this.$router.push('/settings-account');

        }
      });
    },
  searchBusinesses() {
    this.getAllBusinessContacts({
      currentPage: this.currentPage,
      cantPerPage: this.cantPerPage,
      searchFilter: 'importcsv'
    });
  },
  searchBusinessesWithPageReset() {
    this.getAllBusinessContacts({
      currentPage: this.currentPage,
      cantPerPage: this.cantPerPage,
      searchFilter: 'importcsv'
    }).then((result) => (
      this.resetPage()
    ));
  },

  goToContact(contact_id, business_id) {
    this.changeHeaderTab({ tab: "SelectedContact" });
    router.push({
      name: "selected-contact",
      params: { id: contact_id.toString(), businessId: business_id.toString() },
    });
  },

  goToBusiness( business_id, contact_id,) {
    this.changeHeaderTab({ tab: "SelectedCompany" });
    router.push({
      name: "selected-company",
      params: { id: business_id.toString(), contactId: contact_id.toString() },
    });
  },


    isFilteredBusinessStatus(businessStatus) {
      return (
        this.filters.businessStatusFilter !== undefined &&
        this.filters.businessStatusFilter === businessStatus.id
        );
    },

    isFilteredCategory(category) {
      return (
        this.filters.categoryFilter !== undefined &&
        this.filters.categoryFilter === category.id
        );
    },

    getAllFilters(){
      businessContactsService.getAllFilters().then( result => { 
        this.contactFilter = result.contacts
        this.jobFilter = result.jobs
        this.roleFilter = result.roles
        this.cityFilter = result.city
        this.companyFilter = result.company
        this.emailFilter = result.emails
      } );
    },

    changeBusinessStatusFilter(status) {
      var statusId = this.isFilteredBusinessStatus(status) ? "" : status.id;
      this.setAllBusinessStatusFilter({
        businessStatus: statusId
      }).then(result => this.searchBusinessesWithPageReset());
    },

    changeCategoryFilter(category) {
      var categoryId = this.isFilteredCategory(category) ? "" : category.id;
      this.setAllCategoryFilter({ category: categoryId }).then(result =>
        this.searchBusinessesWithPageReset()
        );
    },

  
    callApi(filters){
      this.setFilterSystem({filters : filters }).then(result => {
        this.resetFilterSystem = false;
        this.quickSearchFilter = '';
        this.searchFilter = filters;
        this.searchFilter.filters['importcsv'] = true;
        this.getAllByFilter({
          currentPage: this.currentPage,
          cantPerPage: this.cantPerPage,
          searchFilter: this.searchFilter.filters,
        }).then(result => (this.resetPage()));
      });    
    },

    changeComponent(tab,label){     
      this.$store.state.header.tab = tab;
      this.udpdateHeader(label)
    },

    nameRoute(name) {
      if (name.includes("businesses")) {
        return true;
      } else {
        return false;
      }
    },
  }
}
</script>
<style>
.link-destacated{
  color: #8580f2 !important;
}
.table td.setcol, 
.table th.setcol {
  width: 280px;
  min-width: 280px !important;
  /* overflow-wrap: break-word;
  word-wrap: break-word;
  hyphens: auto; */
}
.col-phone-company{
  width: 290px;
  min-width: 290px !important;
  white-space: nowrap;
}
.col-phone{
  width: 145px;
  min-width: 145px !important;
  white-space: nowrap;
}
 .all-businesses .dropdown-menu.dropdown-menu-right.scrollable-menu.show{
  left: 30px !important;
}

</style>