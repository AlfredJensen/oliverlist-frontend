<template>
  <div>
  <section class="info">
    <div class="bg-white p-3 mt-0">
      <div class="row">
        <button class="ml-3 btn btn-outline-primary btn-sm mr-2" >
          <a class="cursor-pointer d-inline" @click="changeComponent('ALL','contacts')">
            <span class="d-inline">{{ $t('lang.label.olivercontacts') }}</span>
          </a>
        </button>
        <button class="btn btn-outline-primary btn-sm mr-2 active" >
          <a class="cursor-pointer d-inline" @click="changeComponent('AllCompanies','companies')">
            <span class="d-inline">{{ $t('lang.label.olivercompanies') }}</span>
          </a>
        </button>
      </div>
    </div>
</section> 
<section class="businesses-list mt-2">
  <div class="contenedor all-businesses" >
    <div class="row">
      <div class="col-sx-12 col-md-6" v-if="!showEmptyImage()">
        <button class="float-left ml-2 mt-2 btn btn-primary themed-button btn-sm" @click="refresh" type="submit"  >
          <i class="icon-refresh"></i>
        </button>

        <FilterSystem :columns="companiesColumns" :reset="resetFilterSystem" :sort="sort" :dir="dir" :filterSystem="filtersSystem" :filterOldQuery="oldQuery"  @callApi="callApi" v-if="!showEmptyImage()" />
      </div>
    </div>
            <LoadingSpinner v-if="loading" />
            <div class="wrappList animated fadeIn fast" v-if="!loading">
             <div class="table-responsive">
              <table class="table table-hover card-style min-width-table"  v-if="!showEmptyImage()">
                <thead>
                  <tr>
                    <th></th>
                    <th></th>
                    <th scope="col" style="white-space:nowrap;" class="cursor-pointer" @click="orderBy('Name')">
                      {{ $t('lang.column.name') }}
                      <span v-if="sort == 'business.name' && dir=='asc'" class="icon-angle-double-up ml-2" />
                      <span v-if="sort == 'business.name' && dir=='desc'" class="icon-angle-double-down ml-2" />
                      <span v-if="sort != 'business.name'"  class="icon-angle-down ml-2" />
                    </th>
                    <th scope="col"style="white-space:nowrap;" class="cursor-pointer" @click="orderBy('Salaries')">
                      {{ $t('lang.label.companysize') }}
                      <span v-if="sort == 'business.salaries' && dir=='asc'" class="icon-angle-double-up ml-2" />
                      <span v-if="sort == 'business.salaries' && dir=='desc'" class="icon-angle-double-down ml-2" />
                      <span v-if="sort != 'business.salaries'"  class="icon-angle-down ml-2" />
                    </th>
                    <th scope="col" style="white-space:nowrap;" class="cursor-pointer" @click="orderBy('Domain')">
                      {{ $t('lang.column.domain') }}
                      <span v-if="sort == 'business.domain' && dir=='asc'" class="icon-angle-double-up ml-2" />
                      <span v-if="sort == 'business.domain' && dir=='desc'" class="icon-angle-double-down ml-2" />
                      <span v-if="sort != 'business.domain'"  class="icon-angle-down ml-2" />
                    </th>

                    <th scope="col" style="white-space:nowrap;">{{ $t('lang.column.phone') }}</th>
                    <th scope="col">{{ $t('lang.column.category') }}</th>

                    <th scope="col" style="white-space:nowrap;" class="cursor-pointer" @click="orderBy('City')">
                      {{ $t('lang.column.city') }}
                      <span v-if="sort == 'business.city' && dir=='asc'" class="icon-angle-double-up ml-2" />
                      <span v-if="sort == 'business.city' && dir=='desc'" class="icon-angle-double-down ml-2" />
                      <span v-if="sort != 'business.city'"  class="icon-angle-down ml-2" />
                    </th>
                    <th scope="col" style="white-space:nowrap;" class="cursor-pointer" @click="orderBy('Country')">
                      {{ $t('lang.column.country') }}
                      <span v-if="sort == 'business.country' && dir=='asc'" class="icon-angle-double-up ml-2" />
                      <span v-if="sort == 'business.country' && dir=='desc'" class="icon-angle-double-down ml-2" />
                      <span v-if="sort != 'business.country'"  class="icon-angle-down ml-2" />
                    </th>
                  </tr>
                </thead>
                <tbody >
                  <tr v-for="(company, key) in companies.list" :key="key" class="shadow-sm p-3 mb-3 bg-white rounded">
                   <td>
                    <input type="checkbox" :id="key" :name = "key" v-model="checkedCompany" :value="key">
                  </td>
                  <td>
                    <img :src="getBusinessPhoto(company.logo)" class="float-left rounded-circle companies-img-list"  width="25" height="25"   alt="person image">
                  </td>
                  <td style="min-width: 300px;" @click="goToBusiness(company.id)">
                    <div>
                      <a class="cursor-pointer" style="color:#8580f2">
                       {{company.name}}
                     </a>
                   </div>
                 </td>
                 <td style="min-width: 150px;">
                    <div class="badge" style="background-color:#5155ea; color:white">
                      <span> {{ getSalaries(company.salaries) }}</span>
                    </div>
                  </td>
                 <td style="white-space:nowrap;">
                  <p>
                    <a class="cursor-pointer" >
                     {{company.domain}}
                   </a>
                 </p>
               </td>

               <td class="col-phone-company" style="white-space:nowrap;">
                <p>
                  <a class="cursor-pointer" >
                   {{company.business_phone}}
                 </a>
               </p>
             </td>
             <td  style="min-width: 250px;" class="hovertext">
              <span>
                 {{company.category_name}}
             </span>
           </td>
           <td style="min-width:150px;">
            <p>
              <a class="cursor-pointer" >
               {{company.city}}
             </a>
           </p>
         </td>
         <td style="min-width:150px;">
          <p>
            <a class="cursor-pointer" >
             {{company.country}}
           </a>
         </p>
       </td>

 
     </tr>
   </tbody>
 </table>
                <div class="w-100 text-center pt-5"  v-if="showEmptyImage()">
                    <img src="@/assets/images/location.png" class="">
                      <div class="mt-3 text-center">
                        <span
                        class="font-weight-light ft-1-5 text-center text-secondary"
                        >{{ $t('lang.label.therearenocompaniesatthemoment') }}</span>
                      </div>
                      <div class="mt-3 text-center">

                        <div class="mr-2 d-inline">
                            <button class="btn btn-sm  btn-primary themed-button effect-btn" @click="addCampaign" type="submit">
                              <i class="icon-plus1"></i> {{ $t('lang.button.addnewcampaign') }}
                            </button>
                        </div>
                        <div class=" d-inline">
                            <button class="btn btn-outline-secondary btn-sm" @click="openPopup" type="submit">
                              {{ $t('lang.button.whatisacompany') }}
                            </button>
                        </div>
                      </div>
                  </div>
</div>
<div class="table-footer row mb-2 mt-2" v-if="totalCompanies > 0">
  <div class="col-12 text-left mb-3">
    <span
    class="font-weight-bold"
    >{{ $t('lang.label.showing') }} {{ firstInPage }} {{ $t('lang.label.to') }} {{ lastInPage }} {{ $t('lang.label.of') }} {{ totalCompanies }} {{ $t('lang.label.companies') }}.</span>
  </div>
  <div class="col-md-9 col-8">
    <button
    type="button"
    class="btn btn-primary btn-sm themed-button btnNavTabla"
    :disabled="isFirstPage"
    @click="prevPage()"
    >
    <span class="icon-angle-double-left mr-2" />{{ $t('lang.button.previous') }}
  </button>
  <button
  type="button"
  class="btn btn-primary btn-sm themed-button ml-2 btnNavTabla"
  :disabled="isLastPage"
  @click="nextPage()"
  >
  {{ $t('lang.button.next') }}
  <span class="icon-angle-double-right ml-2" />
</button>
</div>
<div class="col-3 dropdown text-right" >
         <button class = "display-inline ml-2 mb-1 btn btn-secondary themed-button btnNavTabla" @click="allDataCSV" >
           {{ $t('lang.button.downloadalldata') }}
         </button>
         <button class = "display-inline ml-2 mb-1 btn btn-secondary  themed-button btnNavTabla" @click="descargarCheckList" >
           {{ $t('lang.button.downloadselecteddata') }}
         </button>
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
<div class="dropdown-menu col-md-3 col-4" aria-labelledby="dropdownCantPerPage">
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
</section>
</div>
</template>
<script>
import { mapState, mapActions, mapMutations } from "vuex";
import { router } from "@/_helpers";
import { statusPointMixin, formattersMixin } from "@/_mixins/";
import { companiesService, categoriesService } from "@/_services";
import Header from "@/components/Header.vue";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import moment from "moment";
import FilterSystem from "@/components/FilterSystem.vue";

export default {
  data() {
    return {
      cantPerPage: 50,
      cantPerPageOptions: [5, 10, 20, 50, 100],
      searchFilter: {},
      quickSearchFilter: '',
      selected: [],
      allSelected: false,
      checkedCompany:[],
      companyIds: [],
      opened: [],
      name: [],
      datePickerConfig: {
        format: "YYYY-MM-DD",
        useCurrent: false,
        minDate: moment().startOf("day"),
      },
      resetFilterSystem: false,
      companiesColumns: [
        {
          name: this.$t('lang.label.companyname'),
          type: "string",
          field: 'business.name'
        },
        {
          name: this.$t('lang.label.domain'),
          type: "string",
          field: 'business.domain'
        },
        {
          name: this.$t('lang.label.city'),
          type: "string",
          field: 'business.city'
        },
        {
          name: this.$t('lang.label.country'),
          type: "string",
          field: 'business.country'
        },
        {
          name: this.$t('lang.label.companysize'),
          type: "number",
          field: 'business.salaries'
        },
      ],
      sort: '',
      dir: ''
    };
  },

  mixins: [statusPointMixin, formattersMixin],

  components: {
    LoadingSpinner,
    FilterSystem
  },

  watch: {
    currentPage() {
      if (this.resetFilterSystem == true){
        this.searchCompanies();      
      }else{
        this.refresh();
      }

    },

    cantPerPage() {
      if (this.resetFilterSystem == true){
        this.searchCompaniesWithPageReset();
      }else{
        this.refresh();
      }
    }
  },

  computed: {
    ...mapState({
      loading: state => state.companies.loading,
      filters: state => state.companies.allFilters,
      companies: state => state.companies.all.data,
      filtersSystem: (state) => state.companies.filtersSystem,
      oldQuery: (state) => state.companies.oldQuery,
      currentUser: state => state.authentication.user,
      headerTab: state => state.header.tab,
      currentPage: state => state.companies.currentPage, 
    }),

    user() {
      return this.$store.state.authentication.user;
    },

    isFirstPage() {
      return this.currentPage === 1;
    },

    isLastPage() {
      return this.currentPage === this.pageCount;
    },

    pageCount() {
      var cantPage = this.totalCompanies / this.cantPerPage;
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
        this.totalCompanies >= this.firstInPage &&
        this.totalCompanies <= this.currentPage * this.cantPerPage
        ) {
        return this.totalCompanies;
    } else {
      return this.currentPage * this.cantPerPage;
    }
  },

  totalCompanies() {
    if (
      this.companies !== undefined &&
      this.companies.total !== undefined
      ) {

      this.$store.state.companies.empty = false
      return this.companies.total;
  } else {
    return 0;
  }
}

},

created() {
  categoriesService.getAllCategoriesByClient().then((parentCategories) => {
    let parentCategory =  {
      name: "Category",
      type: "list",
      list: parentCategories,
      field: 'category_google.parent'
    };
    this.companiesColumns.push(parentCategory);
  });

  this.cantPerPage = 50;
  if(screen.width <=  480){
    this.cantPerPage = 5;
  }
  
  if(this.companies === undefined){
    if(this.filtersSystem.predicates){
      this.refresh();
    }else{
      this.searchCompanies();
    }
  }
},

methods: {
  ...mapActions("companies", {
    getAllCompanies: "getAll",
    getAllByFilter: "getAllByFilter",
    setFilterSystem : "setFilterSystem",
    resetFiltersSystem : "resetFilterSystem",
  }),
  ...mapActions("headertopbar", {
         setCurrentRoute:"setRoute",
         setCurrentRouteChild:"setRouteChild"
    }),
   ...mapMutations('companies',{
        nextPage: 'nextPage',
        prevPage: 'prevPage',
        resetPage: 'resetPage'
    }),
  ...mapActions("header", {
    changeHeaderTab: "changeTab"
  }),
    showEmptyImage(){
      return this.$store.state.companies.empty
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
  openPopup(){
      this.$swal({
        title: this.$t('lang.button.whatisacompany'),
        html: '<iframe class="w-100"  height="400" src="https://player.vimeo.com/video/470888684" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>',
        width: '800px',
        showCancelButton: true,
        showConfirmButton: false,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33a2c",
        cancelButtonText: this.$t('lang.button.cancel'),
      }).then(result => {
        if (result.value) {
          this.$router.push('/settings-account');

        }
      });
    },
  getCompanies() {
    this.searchCompanies();
  },

  refresh() {
    this.getAllByFilter({
      currentPage: this.currentPage,
      cantPerPage: this.cantPerPage,
      searchFilter: this.filtersSystem
    });
  },
  orderBy(columnName){
    let column = this.companiesColumns.filter(c => c.name === columnName)[0];
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


  searchCompanies() {
    this.getAllCompanies({
      currentPage: this.currentPage,
      cantPerPage: this.cantPerPage,
      searchFilter: this.quickSearchFilter
    });
  },

  searchCompaniesWithPageReset() {
    this.getAllCompanies({
      currentPage: this.currentPage,
      cantPerPage: this.cantPerPage,
      searchFilter: this.quickSearchFilter
    }).then(result => (this.resetPage()));
  },

  confirmSearch() {
    this.resetFilterSystem = true;
    this.getAllCompanies({
      currentPage: this.currentPage,
      cantPerPage: this.cantPerPage,
      searchFilter: this.quickSearchFilter
    }).then(result => (this.resetPage()));
  },

  select: function() {
    this.allSelected = false;
  },

  goToBusiness(companyId) {
    this.changeHeaderTab({ tab: "SelectedCompany" });
    router.push({
      name: "selected-company",
      params: { id: companyId.toString() },
    });
  },
  udpdateHeader(route){
      this.setCurrentRoute({page:route});
      this.setCurrentRouteChild({child:''});
  },
  changeComponent(tab,label){     
      this.$store.state.header.tab = tab;
      this.udpdateHeader(label)
  },
  callApi(filters){
    this.setFilterSystem({filters : filters }).then(result => {
        this.resetFilterSystem = false;
        this.quickSearchFilter = '';
        this.searchFilter = filters;
        this.getAllByFilter({
          currentPage: this.currentPage,
          cantPerPage: this.cantPerPage,
          searchFilter: this.filtersSystem,
        }).then(result => (this.resetPage()));
    });    
  },


  async allDataCSV(){
    this.$store.state.companies.loading =true
    const response = await companiesService.getDataToCsv().then( result => {

      this.listCompany = []

      for(let i=0; i < result.list.length;i++){      
        this.listCompany.push({
          'Name': result.list[i]['business_name'], 
          'Domain ': result.list[i]['domain'], 
          'Phone': result.list[i]['business_phone'],
          'Category': result.list[i]['category_name'],
          'Size': this.getSalaries(result.list[i]['salaries']),
          'City': result.list[i]['city'],
          'Country': result.list[i]['country']          
        })
      }
      this.$store.state.companies.loading = false
    } );

    this.unparsedResults = this.$papa.unparse(this.listCompany, {
      delimiter: ";"
    })
    this.$papa.download(this.unparsedResults, 'AllData')

  },
  descargarCheckList(){
    if (this.checkedCompany.length > 0) {
      this.$store.state.companies.loading = true
      this.listCompany = []
      for (var i =0; i < this.checkedCompany.length; i++) {
        this.listCompany.push({
          'Name': this.companies.list[this.checkedCompany[i]]['business_name'], 
          'Domain': this.companies.list[this.checkedCompany[i]]['domain'], 
          'Phone': this.companies.list[this.checkedCompany[i]]['business_phone'],
          'Category': this.companies.list[this.checkedCompany[i]]['category_name'],
          'Size': this.getSalaries(this.companies.list[this.checkedCompany[i]]['salaries']),
          'City': this.companies.list[this.checkedCompany[i]]['city'],
          'Country': this.companies.list[this.checkedCompany[i]]['country'],        
        })
      }
      this.$store.state.companies.loading = false
      this.unparsedResults = this.$papa.unparse(this.listCompany, {
        delimiter: ";"
      })
      this.$papa.download(this.unparsedResults, 'SelectedData')
    }else{
      alert('No existen datos para exportar!')
      return false
    }
  },







}
};
</script>

<style scoped>
.datepicker {
  transform: translate(0, 3.1em);
}
.dropdown-menu.dropdown-menu-lg-left.scrolled-div.company-name.show{
  left: 0px;
}
.companies-img-list{
    border: 1px solid lightgrey;
    object-fit: cover;
    background: #ece9e9;
}

</style>