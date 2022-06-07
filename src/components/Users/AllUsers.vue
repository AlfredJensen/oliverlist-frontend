<template>
  <div class="contentCenter all">
<section class="businesses-list mt-2">
  <div class="contenedor animated fadeIn fast">
    <div class="row">    
      <div class="col-sx-12 col-md-6" v-if="!showEmptyImage()">

        <button v-if="!showEmptyImage()" class="float-left ml-2 mt-2 btn btn-primary themed-button btn-sm" @click="refresh" type="submit"  >
          <i class="icon-refresh"></i>
        </button>
        <FilterSystem :columns="contactsColumns" :reset="resetFilterSystem" :sort="sort" :dir="dir" :filterSystem="filtersSystem" :filterOldQuery="oldQuery" @callApi="callApi" />
      </div> 
    </div>
    <LoadingSpinner v-if="loading" />
    <div class="wrappList animated fadeIn fast"  v-if="!loading">
      <div class="wrappList"> 
     
     <router-link to="/settings-account?integrations=1" class="btn btn-sm btn-primary mt-2" >
        Synchronize PIPEDRIVE
      </router-link>
     <button class="btn btn-sm btn-primary mt-2 ml-2" 
     @click="sendPagePipedrive(0)" 
     :disabled="this.loadingPipedrive">Send this page to pipedrive
      <loadingCircle v-if="this.loadingPipedrive"
      ></loadingCircle>
      <span v-if="this.loadingPipedrive">{{this.cantsendPipedrive}}</span>
     </button>
        <div class="table-responsive">
          <table class="table table-hover">
            <thead>
              <tr>
                <th scope="col">{{ $t('lang.column.picture') }}</th>
                <th scope="col">{{ $t('lang.column.lastname') }}</th>
                <th scope="col">{{ $t('lang.column.company') }}</th>
                <th scope="col">{{ $t('lang.column.username') }}</th>
                <th class="col-phone" scope="col">{{ $t('lang.column.phone') }}</th>
                <!-- <th scope="col">{{ $t('lang.column.email') }}</th> -->
                <th scope="col">{{ $t('lang.column.creationdate') }}</th>
                <th scope="col">Days</th>
                <th scope="col">Contacts</th>
                <th scope="col">Active</th>
                <th scope="col">Pending</th>
                <th scope="col">Stopped</th>
                <th scope="col">{{ $t('lang.column.expenses') }}</th>
                <th scope="col">{{ $t('lang.column.role') }}</th>
                <th scope="col">{{ $t('lang.column.paymentmethod') }}</th>
                <th scope="col">Email Sync</th>
                <th scope="col">{{ $t('lang.column.lastconnectiondate') }}</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody v-if="totalUsers > 0">
                    <tr v-for="(user, key) in users.list" :key="key"> 
                      <td>
                        <div class="">
                          <img :src="user.avatar" class="d-block imgmain rounded-circle wcontact" />
                        </div>
                        <span class="text-primary cursor-pointer"
                         @click="sendPipedrive(user.id)">Send to pipedrive</span>
                      </td>
                      <td>{{ user.name }} {{ user.lastname }}</td>
                      <td>{{ user.company }}</td>
                      <td>{{ user.username }}</td>
                      <td>{{ user.phone }}</td>
                      <!-- <td>{{ user.email }}</td> -->
                      <td><span class="small">{{ user.creation_date }}</span></td>
                      <td>{{ user.days_left }}</td>
                      <td>{{ user.emails_left }}</td>
                      <td><strong class="text-success">{{ user.active }}</strong></td>
                      <td><strong class="text-secondary">{{ user.pending }}</strong></td>
                      <td><strong class="text-danger">{{ user.stopped }}</strong></td>
                      <td>{{ user.total }} €</td>
                      <td>{{ user.role_name }}</td>
                      <td>
                        <span v-if="user.plan_name">
                          {{user.plan_name}} ({{user.plan_price}}€)
                          <br>
                          <span class="small">{{user.subscription_date}}</span> 
                        </span>                     
                        <span class="ml-2 text-center">
                          <i v-if="user.payment_method_cc_id != null" class="icon-credit-card"></i>
                          <i v-if="user.dont_charge_payments == 1 " class="icon-star"></i>
                        </span>
                      </td>
                      <td>
                        {{ user.nylas_email_sync }} 
                        <div v-if="user.nylas_email_sync != '' && user.nylas_email_sync_status == 1" class="badge btn-success">Active</div>
                        <div v-if="user.nylas_email_sync != '' && user.nylas_email_sync_status == 0" class="badge btn-danger">Disconnected</div>
                        {{ user.smtp_email_sync }} 
                        <div v-if="user.smtp_email_sync != '' && user.smtp_email_sync_status == 1" class="badge btn-success">Active</div>
                        <div v-if="user.smtp_email_sync != '' && user.smtp_email_sync_status == 0" class="badge btn-danger">Disconnected</div>
                      </td>
                      <td class="text-center">
                        <span class="small">{{ user.last_connection_date }}</span>
                        <!-- <i v-if="user.last_connection_date == null" class="icon-ellipsis-h"></i> -->
                      </td>
                      <td>
                        <a class="cursor-pointer" @click="goToUser(user.id)">
                          <span class="icon-search ft-1-5"></span>
                        </a>
                      </td>
                    </tr>
                  </tbody>
                  <tbody v-else>
                    <tr class="no-results-row">
                      <td colspan="9">
                        <span
                        class="font-weight-bold ft-1-5 text-center"
                        >{{ $t('lang.label.therearenousersatthemoment') }}</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div class="table-footer row mb-2 mt-2">
                <div class="col-12 text-left mb-3">
                  <span
                  class="font-weight-bold"
                  >{{ $t('lang.label.showing') }} {{ firstInPage }} {{ $t('lang.label.to') }} {{ lastInPage }} {{ $t('lang.label.of') }} {{ totalUsers }} {{ $t('lang.label.users') }}.</span>
                </div>
                <div class="col-md-9 col-8">
                  <button
                  type="button"
                  class="btn btn-primary themed-button btnNavTabla"
                  :disabled="isFirstPage"
                  @click="currentPage --"
                  >
                  <span class="icon-angle-double-left mr-2" />{{ $t('lang.button.previous') }}
                </button>
                <button
                type="button"
                class="btn btn-primary themed-button ml-2 btnNavTabla"
                :disabled="isLastPage"
                @click="currentPage ++"
                >
                {{ $t('lang.button.next') }}
                <span class="icon-angle-double-right ml-2" />
              </button>
            </div>
            <div class="col-3 dropdown text-right">
              <button
              type="button"
              class="btn btn-secondary dropdown-toggle themed-button btnNavTabla"
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
  import { mapState, mapActions } from "vuex";
  import { router } from "@/_helpers";
  import { statusBadgeMixin, urlMixin, logoMixin } from "@/_mixins/";
  import { businessStatusService, categoriesService, campaignsService, pipedriveService } from "@/_services";
  import LoadingSpinner from "@/components/LoadingSpinner.vue";
  import loadingCircle from "@/components/Common/Loadingcircle.vue";
  import FilterSystem from "@/components/FilterSystem.vue";

  export default {
    data() {
      return {
        cantsendPipedrive:0,
        loadingPipedrive:false,
        code: false,
        currentPage: 1,
        cantPerPage: 30,
        cantPerPageOptions: [5, 10, 20, 30, 50, 100],
        businessStatus: [],
        categories: [],
        searchFilter: {},
        resetFilterSystem: false,
        contactsColumns: [
          {
            name: this.$t('lang.label.name'),
            type: "string",
            field: 'u.name'
          },
          {
            name: this.$t('lang.label.user'),
            type: "string",
            field: 'u.username'
          },
          {
            name: this.$t('lang.label.companyname'),
            type: "string",
            field: 'c.name'
          },
          {
            name: this.$t('lang.label.creationdate'),
            type: "date",
            field: 'CAST(u.creation_date AS DATE)'
          },
          {
            name: this.$t('lang.label.days'),
            type: "number",
            field: '(c.trial_days - TIMESTAMPDIFF(DAY, c.creation_date, NOW()))'
          },
          {
            name: this.$t('lang.label.contacts'),
            type: "number",
            field: '(c.trial_emails - c.emails_sent)'
          },
          {
            name: this.$t('lang.label.expenses'),
            type: "number",
            field: 'IFNULL(budget.total,0)'
          },
          {
            name: this.$t('lang.label.emailsynced'),
            type: "string",
            field: 'cn.email'
          },
          {
            name: this.$t('lang.label.lastconnectiondate'),
            type: "date",
            field: 'CAST(u.last_connection_date AS DATE)'
          },
        ],
        sort: '',
        dir: ''
      };
    },

    mixins: [statusBadgeMixin, urlMixin, logoMixin],

    components: {
      LoadingSpinner,
      FilterSystem,
      loadingCircle
    },

    watch: {
      currentPage() {
      if (this.resetFilterSystem == true){
        this.searchUsers();    
      }else{
        this.refresh();
      }
      },

      cantPerPage() {
        if (this.resetFilterSystem == true){
          this.searchUsersWithPageReset();
        }else{
          this.refresh();
        }
      },
      Page(){
          this.$route.path.includes('/users/') ? this.changeHeaderTab({ tab: "SELECTED" }) : ''
           return
        },
    },

    computed: {
      ...mapState({
        loading: state => state.users.loading,
        users: state => state.users.all.data,
        filtersSystem: (state) => state.users.filtersSystem,
        oldQuery: (state) => state.users.oldQuery,
        filters: state => state.users.allFilters,
        currentUser: state => state.authentication.user
      }),
      
      Page(){
        this.$route.path.includes('/users/') ? this.changeHeaderTab({ tab: "SELECTED" }) : ''
          return
      },

      isFirstPage() {
        return this.currentPage === 1;
      },

      isLastPage() {
        return this.currentPage === this.pageCount;
      },

      pageCount() {
        var cantPage = this.totalUsers / this.cantPerPage;
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
          this.totalUsers >= this.firstInPage &&
          this.totalUsers <= this.currentPage * this.cantPerPage
          ) {
          return this.totalUsers;
      } else {
        return this.currentPage * this.cantPerPage;
      }
    },

    totalUsers() {
      if (
        this.users !== undefined &&
        this.users.total !== undefined
        ) {
        this.$store.state.users.empty = false
        return this.users.total;
    } else {
      return 0;
    }
  }
},

created() {
    let urlParams = new URLSearchParams(window.location.search);
    if(urlParams.has('code')){
      this.code = urlParams.get('code')
    }
  if(screen.width <=  480){
    this.cantPerPage = 5;
  }

  if(this.filtersSystem.predicates){
      this.refresh();
  }else{
    this.searchUsers();
  }

  campaignsService.getStatusOptions().then((stateOptions)=>{
      let status =  {
        name: "Campaign Status",
        type: "list",
        list: stateOptions,
        field: 'csh.campaign_status_id'
      };
      this.contactsColumns.push(status);
    });
},

methods: {
  ...mapActions("users", {
    getAllUsers: "getAll",
    setAllBusinessStatusFilter: "setAllBusinessStatusFilter",
    setAllCategoryFilter: "setAllCategoryFilter",
    resetAllUsersStateFilters: "resetAllFilters",
    getAllByFilter: "getAllByFilter",
    setFilterSystem : "setFilterSystem",
    resetFiltersSystem : "resetFilterSystem",
  }),

  ...mapActions("header", {
    changeHeaderTab: "changeTab"
  }),

  searchUsers() {
    this.refresh();
    // this.getAllUsers({
    //   currentPage: this.currentPage,
    //   cantPerPage: this.cantPerPage,
    //   searchFilter: this.searchFilter
    // });
  },

  sendPipedrive(user_id){
    pipedriveService.sendPipedrive(user_id,this.code)
    this.code = undefined
  },
  sendPagePipedrive(position){
    this.loadingPipedrive = true
    pipedriveService.sendPipedrive(this.users.list[position].id,this.code).then((result) => {
      this.code = undefined
      this.cantsendPipedrive++
      if(position >= this.users.list.length-1){
       this.loadingPipedrive = false
      }else{
        this.sendPagePipedrive(position+1)
      }
    })
  },

  refresh() {
    this.getAllByFilter({
      currentPage: this.currentPage,
      cantPerPage: this.cantPerPage,
      searchFilter: this.filtersSystem
    });
  },

  showEmptyImage(){
      return this.$store.state.users.empty
  },

  searchUsersWithPageReset() {
    this.refresh();
    // this.getAllUsers({
    //   currentPage: this.currentPage,
    //   cantPerPage: this.cantPerPage,
    //   searchFilter: this.searchFilter
    // }).then(result => (this.currentPage = 1));
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

  goToUser(user_id) {
    this.changeHeaderTab({ tab: "SELECTED" });
    router.push({
      name: "users",
      params: { id: user_id.toString() }
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

  getAllBusinessStatus() {
    businessStatusService
    .getAll()
    .then(businessStatus => (this.businessStatus = businessStatus));
  },

  getAllCategories() {
    categoriesService
    .getAll()
    .then(categories => (this.categories = categories));
  },

  changeBusinessStatusFilter(status) {
    var statusId = this.isFilteredBusinessStatus(status) ? "" : status.id;
    this.setAllBusinessStatusFilter({
      businessStatus: statusId
    }).then(result => this.searchUsersWithPageReset());
  },

  changeCategoryFilter(category) {
    var categoryId = this.isFilteredCategory(category) ? "" : category.id;
    this.setAllCategoryFilter({ category: categoryId }).then(result =>
      this.searchUsersWithPageReset()
      );
  },

  resetAllFilters() {
    this.filters.actualQuickFilter = "ALL";
    this.searchFilter = "";
    this.resetAllUsersStateFilters();
    this.searchUsersWithPageReset();
  },

  confirmSearch() {
    this.resetAllUsersStateFilters();
    this.getAllUsers({
      currentPage: this.currentPage,
      cantPerPage: this.cantPerPage,
      searchFilter: this.searchFilter
    }).then(result => (this.currentPage = 1));
  }
}
};
</script>
<style>
  .wcontact{
    width: 45px;
  }
  .businesses-list .icon-credit-card{
    font-size: 18px;
  }
</style>