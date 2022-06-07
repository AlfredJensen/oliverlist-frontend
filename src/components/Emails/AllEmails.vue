<template>
  <section class="emails">
    <main class="contenedor">
      <div class="contentCenter all">
       <div class="row" v-if="loading" >
        <LoadingSpinner />
       </div>
       <div class="row"  v-if="!loading">
        <div 
        :class="classExpand()">
        <section class="" v-show="!expanded">
          <div class="row">
            <div class="col-sx-10 col-md-8">
              <form class=" mb-4">
                <div class="input-group">
                  <input class="form-control" type="search" v-bind:placeholder="$t('lang.label.quicksearch')" aria-label="Seafrch" v-model="searchFilter"/>
                  <div class="input-group-append ">
                    <button class="btn btn-secondary themed-hover " type="button" @click="confirmSearch">
                      <span class="icon-search"></span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
            <div class="col-sx-12 col-md-12 mb-12">
              <button class="float-left btn ml-2 " @click="goToPage('/emailscat/mailinblack','mailinblack')" type="submit" >
                Mail In Black
              </button>
              <button class="float-left btn ml-2 " @click="goToPage('/emailscat/amazonses','amazonses')" type="submit" >
                Amazon automatique
              </button>
              <button class="float-left btn ml-2 " @click="goToPage('/emailscat/amazonses','Réponse automatique')" type="submit" >
                Réponse automatique
              </button>

              <button class="float-left btn ml-2 " @click="goToPage('/emails')" type="submit" >
               All
             </button>

             <button class="float-right btn " @click="refresh()" type="submit" >
              <i class="icon-refresh"></i>
            </button> 
            <button 
            v-show="expanded"
            class="mr-2 float-right btn btn-primary themed-button" @click="explodecolumn" type="submit" >
            <i class="icon-arrow-right"></i>
          </button>
        </div>
      </div>
    </section>
    <section class="businesses-list">
      <div class=" animated fadeIn fast">
        <div 
        style="
        border: 1px solid rgba(0,0,0,.125);
        border-radius: .25rem;"
        :class="getStyleOpened()">
        <div class="table-responsive" >
          <table  v-show="!expanded"  class="table table-hover">
            <thead class="thead-dark">
              <tr>
                <th><span class="font-weight-bold pl-1"> {{ $t('lang.column.selected') }} : {{ mailsIds.length }}</span></th>
                <th scope="col">{{ $t('lang.column.from') }}</th>
                <th scope="col">{{ $t('lang.column.subject') }}</th>
                <th scope="col">{{ $t('lang.column.opportunity') }}</th>
                <th scope="col">{{ $t('lang.column.status') }}</th>
                <th scope="col">{{ $t('lang.column.date') }}</th>
                <th scope="col">
                  <div class="btn-group">
                    <a
                    class="dropdown-toggle cursor-pointer"
                    data-toggle="dropdown"
                    data-display="static"
                    aria-haspopup="true"
                    aria-expanded="false"
                    >{{ $t('lang.column.users') }}</a>
                    <div class="dropdown-menu dropdown-menu-right scrolled-div">
                      <a
                      class="dropdown-item cursor-pointer"
                      v-for="(user, index) in salesUsers"
                      :key="index"
                      @click="changeSalesUserFilter(user)"
                      >
                      <span
                      :class="isFilteredSalesUser(user) ? 'icon-check-square-o pr-1' : 'icon-square-o pr-1'"
                      ></span>
                      {{ user.name + ' ' + user.lastname }}
                    </a>
                  </div>
                </div>
              </th>
            </tr>
          </thead>
          <tbody class="row" v-if="loading" >
            <LoadingSpinner />
          </tbody>
          <tbody   v-if="!loading" >
            <tr 
            v-for="(email, key) in emails.list" 
            :key="key"
            :class="getClassOpened(email.opened,email.id)"
            class="cursor-pointer itememail"
            @click="goToEmail(email.id, email.business_name, email.response_subject)"

            >

            <td><input type="checkbox" v-model="mailsIds" @click="select" :value="email.id" ></td>
            <td><strong>{{ email.label }}</strong>
            {{ email.response_from | capitalize }}</td>
            <td>{{ email.response_subject }}</td>
            <td>{{ email.business_name }}</td>
            <td>
              <div v-if="email.status !== 'valid'" class="badge" :class="statusBadge(email.status)">{{ email.status }}</div>
              <div class="badge" :class="statusEmail(email.response_label)">{{ email.response_label }}</div>
              <div class="badge btn-danger">{{ email.business_contact_status }}</div>
              <div class="badge btn-primary">{{ email.taglinks }}</div>
            </td>
              <td><small>{{ email.response_date }}</small></td>
              <td><small>{{ email.user_name + ' ' + email.user_lastname }}</small></td>
            </tr>
          </tbody>
        </table>
        <table  v-show="expanded"   class="table table-hover">
          <thead class="thead-dark">
            <tr>
              <th><span class="font-weight-bold pl-1"> {{ mailsIds.length }}</span></th>
              <th scope="col">{{ $t('lang.column.from') }}</th>
            </tr>
          </thead>
          <tbody class="row" v-if="loading" >
            <LoadingSpinner />
          </tbody>
          <tbody   v-if="!loading">
            <tr 
            v-for="(email, key) in emails.list" 
            :key="key"
            :class="getClassOpened(email.opened,email.id)"
            class="cursor-pointer itememail"
            @click="goToEmail(email.id, email.business_name, email.response_subject)"

            >

            <td>
              <input type="checkbox" v-model="mailsIds" @click="select" :value="email.id" >
              <i class="icon-envelope-o d-block"></i>
            </td>
            <td>
             <div class="d-block">
              <span class="badge mr-2" :class="statusBadge(email.status)">{{ email.status }}</span>
              <span class="badge " :class="statusEmail(email.response_label)">{{ email.response_label }}</span>
            </div>
            <div class="d-block mt-2">
              <div class="d-flex align-items-center">
                <small><span class="info-mail-collapse">{{ email.label  +' ' }}  {{ email.response_from | capitalize }}</span></small>
                <small class="ml-2 pb-1"><span>{{ email.response_date }}</span></small></div>
              </div>
              <div>
               <small>{{ email.response_subject }}</small>
             </div>
             <div>
              <small   class="mr-2">{{ email.business_name }}</small>

            </div>

          </td>                           
        </tr>
      </tbody>
    </table>
  </div>
  <div class="table-footer row mb-2 mt-2">
    <div class="col-12 text-left mb-3">
      <span class="font-weight-bold">{{ $t('lang.label.showing') }} {{ firstInPage }} {{ $t('lang.label.to') }} {{ lastInPage }} {{ $t('lang.label.of') }} {{ totalEmails }} {{ $t('lang.label.emails') }}.</span>
    </div>
    <div class="col-md-9 col-8">
      <button type="button" class="btn btn-primary themed-button btnNavTabla" :disabled="isFirstPage" @click="currentPage --"><span class="icon-angle-double-left mr-2"/><span class="btn-name">{{ $t('lang.button.previous') }}</span>
      </button>
      <button type="button" class="btn btn-primary themed-button ml-2 btnNavTabla" :disabled="isLastPage" @click="currentPage ++"><span class="btn-name">{{ $t('lang.button.next') }}</span><span class="icon-angle-double-right ml-2"/>
      </button>
    </div>
    <div class="col-3 dropdown text-right">
      <button type="button" class="btn btn-secondary dropdown-toggle themed-button btnNavTabla" id="dropdownCantPerPage" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" data-offset="10,20"><span>{{ cantPerPage }} {{ $t('lang.button.perpage') }}</span>
      </button>
      <div class="dropdown-menu" aria-labelledby="dropdownCantPerPage">
        <a class="dropdown-item cursor-pointer" v-for="(optionCant, index) in cantPerPageOptions" :key="index" @click="cantPerPage = optionCant">{{ optionCant }} {{ $t('lang.button.perpage') }}</a>
      </div>
    </div>
  </div>
</div>
</div>
</section>
</div> 



<div class="col-md-8 mailDetail" v-show="expanded" >
  <section class="" v-show="expanded">
    <div class="row">

      <div class="col-sx-12 col-md-12 mb-12">


        <button class="float-right btn " @click="refresh()" type="submit" >
          <i class="icon-refresh"></i>
        </button>
        <button 
        v-show="expanded"
        class="mr-2 float-right btn btn-primary themed-button" @click="explodecolumn" type="submit" >
        <i class="icon-arrow-right"></i>
      </button>
    </div>
  </div>
</section>
<div v-if="emails !== 'undefined'">
  <div
  v-for="(email, key) in emails.list" 
  :key="key"
  >

  <EmailsThread 
  v-if="showThread(email.id.toString())" 
  v-show="showThread(email.id.toString())"
  :selectedEmailId="email.id.toString()"
  :selectedEmailSubject="email.response_subject" />
  <EmailsView 
  v-if="showEmail(email.id.toString())" 
  v-show="showEmail(email.id.toString())"
  :selectedEmailId="email.id.toString()"
  :selectedEmailSubject="email.response_subject" />

  </div>
</div>
</div>

</div>
</div>
</main>
</section>
</template>

<script>

  import { mapState, mapActions } from "vuex";
  import { router } from "@/_helpers";
  import { statusBadgeMixin } from "@/_mixins/";
  import { emailsService, usersService } from "@/_services";
  import Header from "@/components/Header.vue";
  import LoadingSpinner from "@/components/LoadingSpinner.vue";
  import EmailsThread from "@/components/Emails/EmailThread.vue";
  import EmailsView from "@/components/Emails/EmailView.vue";



  export default {
   data() {
    return {
      currentPage: 1,
      cantPerPage: 50,
      salesUsers:[],
      cantPerPageOptions: [5, 10, 20, 50, 100],
      searchFilter: "",
      selected: [],
      allSelected: false,
      actualEmail : "",
      actualThread : "",
      expanded : false,
      mailsIds: [] 
    };
  },



  mixins: [statusBadgeMixin],

  components: {
    LoadingSpinner,
    EmailsThread,
    EmailsView
  },

  watch: {
    currentPage() {
      this.searchEmails();
    },
    cantPerPage() {
      this.searchEmailsWithPageReset();
    },
    'searchFilter'(){
      this.searchFilter = this.$sanitize(this.searchFilter);
    },
  },
  computed: {
    ...mapState({
      loading: state => state.emails.loading,
      filters: state => state.emails.allFilters,
      emails: state => state.emails.all.data,
      currentUser: state => state.authentication.user
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
      var cantPage = this.totalEmails / this.cantPerPage;
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
        this.totalEmails >= this.firstInPage &&
        this.totalEmails <= this.currentPage * this.cantPerPage
        ) {
        return this.totalEmails;
    } else {
      return this.currentPage * this.cantPerPage;
    }
  },
  
  totalEmails() {
    if (
      this.emails !== undefined &&
      this.emails.total !== undefined
      ) {
      return this.emails.total;
  } else {
    return 0;
  }
}
},
props: {
  selectedCatId: String
},
created() {
  if(screen.width <=  480){
    this.cantPerPage = 5;
  }
  
  if(this.$route.params.cat){
    this.searchFilter = this.$route.params.cat;
  }
  this.getEmails();
  this.getAllSalesUsers();
},
methods: {
 ...mapActions("emails", {
  getAllEmails: "getAll",
  setSalesUserFilter: "setSalesUserFilter",
}),
 classExpand(){
  if(this.expanded){
    return "ml-10 expandedlist";
  }else{
    return "col-md-12";

  }
},
getStyleOpened(){
  if(this.expanded){
    return ''
  }
},
goToPage(url,filter){
  this.$router.push(url);
  this.refresh(filter);
},
getClassOpened(opened,email_id){
  if(this.actualEmail == email_id)
    return "bg-email-active-open";
  if(this.actualThread == email_id)
    return "bg-email-active-open";

  if(opened)
    return "bg-white";
  else
    return "bg-email-active";
},
...mapActions("header", {
  changeHeaderTab: "changeTab"
}),
getEmails() {
  if (this.emails == undefined) {
    this.searchEmails();
  }
},
getAllSalesUsers() {
  usersService.getAll().then(users => (this.salesUsers = users));
},
isFilteredSalesUser(salesUser) {
  return (
    this.filters.salesUserFilter !== undefined &&
    this.filters.salesUserFilter === salesUser.id
    );
},
changeSalesUserFilter(user) {
  var userId = this.isFilteredSalesUser(user) ? "" : user.id;
  this.setSalesUserFilter({ salesUser: userId }).then(result =>
    this.searchEmailsWithPageReset()
    );
},
refresh(filter) {
  this.resetAllFilters();
  if(filter){
    this.searchFilter = filter;
  }
  this.searchEmails();
},
explodecolumn() {
  this.expanded = false;
},
searchEmails() {

  this.getAllEmails({
    currentPage: this.currentPage,
    cantPerPage: this.cantPerPage,
    searchFilter: this.searchFilter,
  });
},
searchEmailsWithPageReset() {
  this.getAllEmails({
    currentPage: this.currentPage,
    cantPerPage: this.cantPerPage,
    searchFilter: this.searchFilter
  }).then(result => (this.currentPage = 1));
},
confirmSearch() {
  this.getAllEmails({
    currentPage: this.currentPage,
    cantPerPage: this.cantPerPage,
    searchFilter: this.searchFilter
  }).then(result => (this.currentPage = 1));
},
resetAllFilters() {
  this.searchFilter = "";
},


showEmail(email_id){
  return this.actualEmail == email_id;
},
showThread(email_id){
  return this.actualThread == email_id;
},   

goToEmail(email_id, email_opportunity,email_subject) {

  if(email_opportunity === null){

    this.actualEmail = email_id.toString();
    this.actualThread = "";

  }else{

    this.actualThread = email_id.toString();
    this.actualEmail = "";

  }
  this.expanded = true;
  router.push({
    name: "emails",
    params: { id: email_id.toString(), name: email_subject.toString() }
  });

},
selectAll: function() {
  this.mailsIds = [];
  if (this.allSelected) {
    for (email in this.list) {
      this.mailsIds.push(this.list[email].id.toString());
    }

  }

},
select: function() {
  this.allSelected = false;
}


},
getAllSalesUsers() {
  usersService.getAll().then(users => (this.salesUsers = users));
},

};
</script>
<style>
  .itememail:hover{
    background-color:white !important;
  }
  .info-mail-collapse{
    width: 100px;
    font-weight: 600;
    /* color: #443CEC; */
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    /* resize: horizontal; */
  }
  .em-collapse .table-footer .col-9{
    max-width: 40% !important;
    padding-right: 0px;
    margin-right: 0px;
  }
  .em-collapse .table-footer .col-3{
    padding-left: 0px;
    margin-left: 0px;
  }
  .em-collapse .table-footer .btn-primary.themed-button,
  .em-collapse .table-footer .btn.btn-secondary.dropdown-toggle.themed-button{
   padding: .175rem .5rem;
 }
 .em-collapse .table-footer .btn-name{
   display: none;
 }

 .expandedlist{
  position: fixed !important;
  top: 0px;
  bottom: 0px;
  margin-left: -15px;
  overflow-y: scroll;
  width: 30%;
}

.itememail:hover{
 background-color:#d6d6d6!important;
}
.bg-email-active{
 background-color:#dfe0fc!important;
}
.bg-email-active-open{
 background-color:#dedede!important;
}
</style>