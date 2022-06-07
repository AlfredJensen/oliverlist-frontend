<template>
    <div v-if="!notification">
    <div class="">
    <div class="ml-4 py-1">  
       <Tutorial
            id="teemplatemessage"
            :linkText="$t('lang.label.howitworks')"
            linkClass="small ml-2 mt-2"
            :videoUrl="'https://www.youtube.com/embed/' + $t('lang.videos.mysearch')"
            playListurl="https://help.oliverlist.com/fr/category/recherche-de-contacts-13n5mv0/"
          />
    </div>



    <div class="row mb-4 pl-3 mt-3 border-bottom border-grey">
        <div class="ml-0 d-inline pl-4">
          <span
            type="button"
            class="p-0 it-tabs pb-2"
            :class="tab == 'newsearch' ? 'active border-primary':''"
            @click="changeTab('newsearch')"
          >
            <i class="icon-plus"></i> {{ $t("lang.linkedin.newsearch") }}
          </span>
        </div>

        <div class="ml-3 d-inline">
          <span
            type="button"
            class="p-0 it-tabs pb-2"
            :class="tab == 'captain' ? 'active border-primary':''"
            @click="changeTab('captain')"
          >

           <span 
            v-if="captainserching !== undefined 
              && captainserching != false && tab != 'captain'"
            class="loadingres mr-1 ml-1 spinner-border loading-spinner text-primary" 
          ></span> 
            <i  v-else class="icon-linkedin"></i> 


           <small 
            v-if="synUser && hasLimit()"
            class="ml-1 icon-warning text-danger" 
          ></small>

            {{ $t("lang.search.mysearchs") }} Linkedin
          </span>
        </div> 
        <div class="ml-3 d-inline">
          <span
            type="button"
            class="p-0 it-tabs pb-2"
            :class="tab == 'gmaps' ? 'active border-primary':''"
            @click="changeTab('gmaps')"
          > 
          <span 
            v-if="ondemandsearching.length > 0 && tab != 'gmaps'"
            class="loadingres mr-1 ml-1 spinner-border loading-spinner text-primary" 
          ></span> 
            <i v-if="ondemandsearching.length == 0" class="icon-map"></i> {{ $t("lang.search.mysearchs") }} Google maps
          </span>
        </div> 
        <div class="ml-3 d-inline">
          <span
            type="button"
            class="p-0 it-tabs pb-2"
            :class="tab == 'schedule' ? 'active border-primary':''"
            @click="changeTab('schedule')"
          >
            <i class="icon-clock"></i> {{ $t("lang.ondemand.scheduledsn") }} 
          </span>
          <span class="badge badge-primary ml-1" 
          v-if="levelplan != 3"><i class="icon-star "></i> PRO</span>
        </div> 
    </div>

    <div class="row px-4" v-if="tab == 'newsearch'">
      <div class="col-md-3">
       <div>
            <div class="row" >

            <div v-for="group in listSearchs" class="p-2 mb-3">
              
          

              <div class="card mb-2"
              :class="item.typesearch ==  typesearch ? 'border-primary' : ''"
              @click="changeTypeSearch(item.typesearch)"
              v-for="item in group.items" >
                <div class="card-header">
                   <img v-if="item.img !== undefined" :width="item.imgwidth" :src="require('@/assets/images/' + item.img)" />
                   <small v-if="item.plan !== undefined && !hasAccess(item.typesearch)" class="text-primary float-right"><i class="icon-star"></i> {{item.plan}} </small>
                </div>
                <div class="card-body">
                  <p class="card-text mb-2"
                  :class="!hasAccess(item.typesearch)? 'text-secondary':''">{{item.title}}</p>
                  <button 
                  :class="!hasAccess(item.typesearch)? 'btn-secondary':'btn-primary'"
                  @click="changeTypeSearch(item.typesearch)" class="btn-sm mt-2 btn ">{{$t('lang.ondemand.tryit')}}</button>
                </div>
              </div>
         
            </div>

  

            </div>
          </div>

      </div>
      <div class="col-md-9 p-2">

      <div class="card p-4">
        <div class="mb-2 bg-light border p-2 text-primary rounded" v-if="synUser && typesearch != 3">
        <h6 v-if="!loadinguser && synUser.is_valid">{{$t('lang.integrations.syncronized')}} <i class="icon-checkmark"></i></h6>
        <h6 v-if="!synUser.is_valid" class="text-danger">{{$t('lang.integrations.notsyncronized')}} <i class="icon-unlink"></i></h6>
        <div v-if="synUser.level != 'Classic'">
          <small><strong>{{ $t('lang.integrations.syncronized') }}:</strong> Sales Navigator / Linkedin </small>
        </div>
        <div> 
        <div
          v-if="loadinguser">
        <span 
          class="loadingres mr-2 ml-2 spinner-border loading-spinner text-primary" 
        ></span>
        <span>
        {{$t("lang.ondemand.synchronizing")}}...
        </span>
        </div> 
        <small  :class="synUser.is_valid ? 'text-primary' : 'text-danger'" ><strong>{{ $t('lang.column.username') }}:</strong> {{synUser.name}}</small>
      </div>

      <small v-if="false"><strong>Cookie:</strong> {{synUser.cookies.li_at}}</small>
      <div v-if="synUser.is_valid">
        <small><strong>{{$t('lang.integrations.syncronized')}}:</strong> {{synUser.setup_at}}</small>
      </div>

      <div v-for="(limit,index) in synUser.limits" class="row">
      <div class="content-bar col-12" 
        v-if="(( typesearch == 8 && index == 3)
          || index == 0 )" >
        <small :class="limit.item_scraped < limit.limit_value ? 'text-primary' : 'text-danger'">{{limit.limit_name}} {{limit.item_scraped}}/{{limit.limit_value}}</small>
        <div class="progress">
          <div
            :class="limit.item_scraped < limit.limit_value ? 'progress-bar bg-primary' : 'progress-bar bg-danger'"
            v-bind:style="{ width: calculatePercentage(limit.item_scraped,limit.limit_value) + '%' }"
            role="progressbar"
            aria-valuenow="limit.item_scraped"
            aria-valuemin="0"
            :aria-valuemax="limit.limit_value"
          ></div>
        </div>
            <small class="text-danger" v-if="limit.item_scraped == limit.limit_value">
        {{$t('lang.integrations.limit')}}
        </small>
      </div>

      </div>

      <div  v-if="errormessage" class=" px-2 py-2 rounded  bg-white">
              <i class="icon-warning text-warning"></i>
            <strong class="ml-1  text-secondary " v-html="errormessage">
            
            </strong>
            </div>

        <div class="mt-3 float-right"  v-if="true">
          <button @click="removeUser()" class="btn btn-sm btn-primary">
          <i class="icon-refresh"></i> {{$t('lang.integrations.refresh')}}</button>

       </div>
      </div>
        <span
          v-if="hidegetuser">
        <span 
          class="loadingres mr-2 ml-2 mb-2 spinner-border loading-spinner text-primary" 
        ></span>
        </span> 
        <div class="px-4 py-3 pb-3 mb-3 rounded bg-primary"
          v-if="typesearch != 3 && !synUser && !hidegetuser">
           
           
            <div  v-if="errormessage" class=" px-2 py-2 rounded  bg-white">
              <i class="icon-warning text-warning"></i>
            <strong class="ml-1  text-secondary " v-html="errormessage">
            
            </strong>
            </div>

            <div class="text-white"  v-if="!synUser">
            <div class="row">
              <div class="col-12 mt-3" v-if="!loadinguser"> 
                 <h6 class="text-white">1. {{$t('lang.integrations.notsyncronized')}}</h6>
                <div class="mb-2" >
                <strong class="text-white">
                {{$t('lang.integrations.youneedextension')}}
                </strong>
                </div>
                <div class="mt-2">
               <a href="https://chrome.google.com/webstore/detail/oliverlistcom/cnokccdjefelbfmadgbekghhaefmdofm"
              target="_blank" 
              class="btn btn-sm bg-white text-primary">
              <i class="icon-chrome"></i> {{ $t('lang.linkedin.downloadextension') }}
              </a>
              </div>
              <div v-if="!loadinguser">
                <h6 class="mt-3"> 2. {{ $t('lang.integrations.sync') }} </h6>
                {{$t('lang.integrations.howtosyn')}}
              </div>
              <div v-if="!loadinguser">
                <img class="mt-2" width="250px" src="@/assets/images/click.gif" /> 
              </div>
              </div>

              <span
                v-if="loadinguser">
              <span 
                class="loadingres mr-2 ml-2 spinner-border loading-spinner text-white" 
              ></span>
              {{$t("lang.ondemand.synchronizing")}}...
              </span> 

              
              </div>
            </div>
            
        </div>

    
        <div v-if="currentUser.role_id != 1" class="text-white pt-1 d-none">
          <button 
          @click="getUser(true)" id="olivercookieref" class=" btn btn-sm bg-white text-primary">
            <i class="icon-refresh"></i> {{ $t('lang.integrations.sync') }} 
          </button>
          <div class="text-white pt-1">
            <input  type="text"  id="linkedincookie" ref="linkedincookie" value=""></input>
          </div>
        </div>

       

        <div  v-if="typesearch == 3">
        <h5 class="mb-2">{{$t('lang.ondemand.title')}}</h5>
        <p class="mb-4">{{$t('lang.linkedin.ondemand')}}</p>
        <div class="w-100 float-left">
          <div class="mb-2">
              <Tutorial
              
                id="21v_DuZvZRo"
                :linkText="''"
                linkClass="small"
                textColor="text-primary"
                :videoUrl="'https://www.youtube.com/embed/'+$t('lang.videos.localizedsearch')"
              />
          </div>
        </div>
      

        <Ondemand 
        @load="loadOndemand()"
        @start="startGmaps()"
        key="keyondemand"
        v-if="ondemandsearching.length == 0"/>
        </div>
          <div v-if="ondemandsearching.length > 0" class="mt-4">
              {{$t('lang.ondemand.executing')}}
              <span
              type="button"
              class="p-0 it-tabs pb-2 text-primary"
              @click="changeTab('gmaps')"
            >
              <i class="icon-map"></i> {{ $t("lang.search.mysearchs") }} Gmaps
            </span>
          </div>

         
          <div v-if="captainserching !== undefined && captainserching != false" class="mt-4">
              {{$t('lang.ondemand.executing')}}
              <span
              type="button"
              class="p-0 it-tabs pb-2 text-primary"
              @click="changeTab('captain')"
            >
              <i class="icon-linkedin"></i> {{ $t("lang.search.mysearchs") }} Linkedin
            </span>
          </div> 

          <div v-if="!loadingl && typesearch != 3 && !hasActiveSearch()">
            

            <div class="row">
              <div class="col-12">
              <span v-if="typesearch == 1">

              <h5 class="mb-2">{{$t('lang.linkedin.normalsearch')}}</h5>
              <p class="mb-4">{{$t('lang.linkedin.normalsearchdesc')}}</p>

              <Tutorial
                id="zjggDTUk2JY"
                :linkText="''"
                linkClass="small ml-2 mt-2"
                textColor="text-primary"
                :videoUrl="'https://www.youtube.com/embed/'+$t('lang.videos.searchlinkedin')"
              />

              <small class=" text-secondary mr-1 mb-2 float-left" target="_blank" href="">{{typeurls[typesearch]}}
              </small>

              <a class="btn btn-sm btn-primary float-right" target="_blank" :href="typeurls[typesearch]">
                {{$t('lang.linkedin.newsearch')}}
              </a>

      
              </span>

              <span v-if="typesearch == 2">

                <h5 class="mb-2">{{$t('lang.linkedin.searchpost')}}</h5>
                <p class="mb-4">{{$t('lang.linkedin.searchpostdesc')}}</p>

                <Tutorial
                      id="8B802NHaKjw"
                      :linkText="''"
                      linkClass="small ml-2 mt-2"
                      textColor="text-primary"
                      :videoUrl="'https://www.youtube.com/embed/'+$t('lang.videos.likelinkedin')"
                    />
               
                 <small class=" text-secondary mr-1 mb-2 float-left" target="_blank" href="">{{typeurls[typesearch]}}
              </small>
               <a class="btn btn-sm btn-primary float-right" target="_blank" :href="typeurls[typesearch]">
                {{$t('lang.linkedin.newsearch')}}
              </a>
              </span>


              <span v-if="typesearch == 4">

                <h5 class="mb-2">{{$t('lang.linkedin.searchsalesnav')}}</h5>
                <p class="mb-4">{{$t('lang.linkedin.searchsalesnavdesc')}}</p>

                <Tutorial
                      id="7cV5IDBhTBE"
                      :linkText="''"
                      linkClass="small ml-2 mt-2"
                      textColor="text-primary"
                      :videoUrl="'https://www.youtube.com/embed/'+$t('lang.videos.salesnav')"
                    />
                <small class=" text-secondary mr-1 mb-2 float-left" target="_blank" href="">{{typeurls[typesearch]}}
              </small>
               <a class="btn btn-sm btn-primary float-right" target="_blank" :href="typeurls[typesearch]">
                {{$t('lang.linkedin.newsearch')}}
              </a>
              </span>


              <span v-if="typesearch == 8">

                <h5 class="mb-2">{{$t('lang.linkedin.searchsalesnav')}}</h5>
                <p class="mb-4">{{$t('lang.linkedin.searchsalesnavdesc')}}</p>

                <Tutorial
                      id="7cV5IDBhTBE"
                      :linkText="''"
                      linkClass="small ml-2 mt-2"
                      textColor="text-primary"
                      :videoUrl="'https://www.youtube.com/embed/'+$t('lang.videos.salesnav')"
                    />
                <small class=" text-secondary mr-1 mb-2 float-left" target="_blank" href="">{{typeurls[typesearch]}}
              </small>
               <a class="btn btn-sm btn-primary float-right" target="_blank" :href="typeurls[typesearch]">
                {{$t('lang.linkedin.newsearch')}}
              </a>
              </span>


              <span  v-if="typesearch == 5">

                <h5 class="mb-2">{{$t('lang.linkedin.searchevent')}}</h5>
                <p class="mb-4">{{$t('lang.linkedin.searcheventdesc')}}</p>

                <Tutorial
                      id="zTxQwklOZQM"
                      :linkText="''"
                      linkClass="small ml-2 mt-2"
                      textColor="text-primary"
                      :videoUrl="'https://www.youtube.com/embed/'+$t('lang.videos.eventlinkedin')"
                    />
                
                 <small class=" text-secondary mr-1 mb-2 float-left" target="_blank" href="">{{typeurls[typesearch]}}
              </small>
               <a class="btn btn-sm btn-primary float-right" target="_blank" :href="typeurls[typesearch]">
                {{$t('lang.linkedin.newsearch')}}
              </a>
              </span>



              <span v-if="typesearch == 7">


                <h5 class="mb-2">{{$t('lang.linkedin.searchgroup')}}</h5>
                <p class="mb-2">https://www.linkedin.com/groups/*/members/</p>
                <p class="mb-4">{{$t('lang.linkedin.searchgroupdesc')}}</p>

                <Tutorial
                      id="2t6RECAx1ko"
                      :linkText="''"
                      linkClass="small ml-2 mt-2"
                      textColor="text-primary"
                      :videoUrl="'https://www.youtube.com/embed/'+$t('lang.videos.grouplinkedin')"
                    />
                
                 <small class=" text-secondary mr-1 mb-2 float-left" target="_blank" href="">{{typeurls[typesearch]}}
              </small> 
              <a class="btn btn-sm btn-primary float-right" target="_blank" :href="typeurls[typesearch]">
                {{$t('lang.linkedin.newsearch')}}
              </a>
              </span>
              </div>
            </div>

            <div class="row">
            <div class="col-7">
            <label v-if="typesearch == 1">Linkedin Search URL </label> 
            <label v-if="typesearch == 2">Linkedin Post URL</label>
            <label v-if="typesearch == 4">Sales Navigator URL</label> 
            <label v-if="typesearch == 5">Linkedin Search URL</label>
            <label v-if="typesearch == 7">Linkedin Groups URL</label>
            <label v-if="typesearch == 8">Sales Navigator URL</label>

                <div class="input-group mb-3">
                  <input 
                  :placeholder="typeurls[typesearch]"
                  :disabled="loading || hasActiveSearch() || !synUser"
                  type="text" size="50" v-model="urlsearch" class="form-control">
                </div>
              </div>
              <div class="col-4">
              <label>{{$t('lang.linkedin.limit')}}</label> 
                  <div class="input-group mb-1">
                    <select v-if="typesearch !== 8" v-model="limit" class="form-control" :disabled="loading || hasActiveSearch() || !synUser" @change="chooseSelect" >
                        <option value="10">10</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                        <option value="200">200 <span v-if="levelplan == 0">(Pack Starter)</span></option>
                        <option value="400">400 <span v-if="levelplan == 0">(Pack Starter)</span></option>
                        <option value="600">600 <span v-if="levelplan < 2">(Pack Advanced/Pro)</span></option>
                        <option value="1000">1000 <span v-if="levelplan < 2">(Pack Advanced/Pro)</span></option>
                        <option value="2500">2500 <span v-if="levelplan < 2">(Pack Advanced/Pro)</span></option>
                   </select> 
                    <select v-if="typesearch == 8" v-model="limit" class="form-control" :disabled="loading || hasActiveSearch() || !synUser" @change="chooseSelect" >
                        <option value="10">10</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                        <option value="200">200 <span v-if="levelplan == 0">(Pack Starter)</span></option>
                   </select> 
                  </div>
                   <div class="pt-0 ml-1">
                    <small v-if="levelplan == 1" class="text-primary">
                      {{ $t('lang.ondemand.limitmax',{cant:limitmax,plan:plans[currentUser.plan_id].name}) }}
                    </small>
                    <small v-if="levelplan == 0" class="text-primary">
                      {{ $t('lang.ondemand.limitfree',{cant:limitmax}) }}
                    </small>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-7">
                <label>{{$t('lang.linkedin.listname')}}</label> 
                <div class="input-group mb-3">
                  <input 
                  :disabled="loading || hasActiveSearch() || !synUser"
                  type="text" size="50" v-model="namesearch" class="form-control">
                </div>
              </div>
              <div class="col-4 mt-1">
                <label>
                {{$t('lang.ondemand.linktocampaign')}}
                </label>
                <Tooltip 
                  class="ml-2 text-primary"
                  :text="$t('lang.ondemand.linkcampaign')"
                  :width="'auto'" >
                <i class="icon-question-circle cursor-pointer"></i>           
                </Tooltip>
                <div>

                
                <button 
                v-if="!synUser"
                disabled="disabled"
                class="ml-2 rounded btn btn-sm  btn-outline-secondary" 
                > 
                <i class="icon icon-bullhorn"></i> {{$t("lang.search.addselectiontothecampaign")}} 
                </button>
                <CampaignList 
                v-if="!campaign_id && synUser"
                :direction="'dropup'"
                @refresh="refreshList()"
                @addSelected="addSelected($event)"
                :key="campaignListKey"
                :model="model"/>
                <span v-if="campaign_name">
                {{$t('lang.ondemand.linkresult')}}:
                <span class="text-primary">{{campaign_name}}</span>
                <button @click="campaign_id=false;campaign_name=false" class="p-0 px-1 ml-2 btn btn-sm btn-danger ">
                <i class="icon-close"></i> {{this.$t("lang.button.cancel")}}
                </button>
                </span>
                </div>

              </div>


              <div class="col-12 align-left text-left" v-if="typesearch == 8"> 
               <div class="float-left" style="width:20px">

                    <input 
                    :disabled="loading || hasActiveSearch() || !synUser"
                    
                    type="checkbox" v-model="recurrent" class="form-control cursor-pointer d-inline">
                    </input>
                </div>
                <div class="d-inline">
                    <span class="pt-2 ml-2">
                    {{$t('lang.ondemand.notexportprevious')}}

                    </span>
                </div>
              </div>

            
            </div>

            <div class="mt-2">

            <div class="input-group mt-3 mb-3" v-if="typesearch == 8">
                  

            <div class="card p-3 border-primary cursor-pointer my-3"   v-if="openschedule">
              <div class="row">
                <div class="col-md-12 mb-3">
                  <h5 class="font-dark-blue mt-3">
                    <i class="icon-clock"></i>  {{ $t("lang.ondemand.scheduled") }}
                  </h5>
                  <small>{{
                    $t("lang.ondemand.scheduledesc")
                  }}</small>
                </div>
              </div>
              <div class="row">
                <div class="col-md-12">
                  <div
                    class="display-inline"
                  >
                    <Treeselect
                      v-model="scheduleday"
                      class="mb-2"
                      :multiple="true"
                      :required="true"
                      placeholder="Sélectionnez..."
                      :maxHeight="200"
                      :searchable="false"
                      :append-to-body="true"
                      :openDirection="'bottom'"
                      :options="sendingDaysI8N"
                    >
                    </Treeselect>
                   
                  </div>
                </div>
              </div>
            </div>


            </div>


              <div  v-if="typesearch != 8">
                <button 
                class="btn   mt-2 mr-2" type="button"
                :class="synUser ? 'cursor-pointer btn-outline-primary' : 'btn-outline-secondary'"
                :disabled="!urlsearch || loading || !synUser || hasLimit()"
                @click="search">{{$t('lang.button.submit')}}</button>
                <small class="text-danger" v-if="!synUser"> {{$t('lang.integrations.youneedextension')}} </small>
                <small class="text-danger" v-if="hasLimit()"> {{$t('lang.integrations.limit')}} </small>
              </div>
              <div  v-if="typesearch == 8">
                <button 
                class="btn btn-outline-primary cursor-pointer mt-2 ml-2" type="button"
                :disabled="!urlsearch || loading || !synUser || scheduleday.length == 0"
                @click="search"
                > {{$t('lang.button.save')}}</button>
              </div>

             
            </div>

            

            <span v-if="loadingl || loading"
              class="loadingres mr-2 ml-2 spinner-border loading-spinner" 
            ></span>
          </div>
        </div>
        
        

      </div>

      </div>

 <div class="row px-4" v-if="tab == 'captain'">
      <div class="row">
        <div class="col-12">
          <h5 class="ml-3">{{$t('lang.search.linkedin')}}</h5>
        </div>    
      </div>
      <div v-if="synUser" class="col-12">

 
        <div class="mb-2 bg-light border p-2 text-primary rounded" v-if="synUser && typesearch != 3">
               
              <h6 v-if="!loadinguser && synUser.is_valid">{{$t('lang.integrations.syncronized')}} <i class="icon-checkmark"></i></h6>
        <h6 v-if="!synUser.is_valid" class="text-danger">{{$t('lang.integrations.notsyncronized')}} <i class="icon-unlink"></i></h6>


          <div>
            <small  :class="synUser.is_valid ? 'text-primary' : 'text-danger'" ><strong>{{ $t('lang.column.username') }}:</strong> {{synUser.name}}</small>
          </div>

          <div  v-if="synUser.is_valid" v-for="(limit,index) in synUser.limits">
            <div class="content-bar" v-if="index == 0 || index == 3" >
              <small :class="limit.item_scraped < limit.limit_value ? 'text-primary' : 'text-danger'">{{limit.limit_name}} {{limit.item_scraped}}/{{limit.limit_value}}</small>
              <div class="progress">
                <div
                  :class="limit.item_scraped < limit.limit_value ? 'progress-bar bg-primary' : 'progress-bar bg-danger'"
                  v-bind:style="{ width: calculatePercentage(limit.item_scraped,limit.limit_value) + '%' }"
                  role="progressbar"
                  aria-valuenow="limit.item_scraped"
                  aria-valuemin="0"
                  :aria-valuemax="limit.limit_value"
                ></div>
              </div>
              <small class="text-danger" v-if="limit.item_scraped == limit.limit_value">
              {{$t('lang.integrations.limit')}}
              </small>
            </div>
          </div>
        </div>
     </div>
      <div class="col-md-12" >

     

      <img 
        v-if="!loadingl && workflows.length == 0 && !captainserching"
        width="20%"
        src="@/assets/images/search-oliver2.png" 
        class="d-block mx-auto mt-5">
            <span v-if="loadingl"
              class="loadingres mr-2 ml-2 spinner-border loading-spinner" 
            ></span>
            <div  v-if="currentUser.role_id != 1">
          <div 
            v-for="captainsearch in captaindataactualsearchs"
          class="mb-2" v-if="captainserching !== undefined && captainserching != false && tab == 'captain'">
          <div class="px-3 pt-2 bg-light card">

            <CaptaindataStatus 
              v-if="captainsearch !== undefined"
              :id="captainsearch.id"
              :notification="false"
              :search="captainsearch"
              :history="false"
              :key="keycap+'-'+captainsearch.id"
              @hasSearchActive="hasSearchActive($event)"
              ></CaptaindataStatus>
              </div>
          </div>
          
          </div>
          <Table 
          v-if="workflows.length > 0"
            :headers="headersCaptain"
            :cols="colsCaptain"
            :data="workflows"
            :checkbox="false"
            :notselect="true"
            :model="model"
            :key="captainkey"
            @deleteImport="deleteImport"
            @viewWorkflowStatus="viewWorkflowStatus"
            >
            </Table>

             <div class="text-center" v-if="havemoreCaptain">   
             <h3  @click="loadMoreCaptain()" class="icon-plus-circle cursor-pointer text-primary"></h3> 
             </div>


        <modal   
        name="workflowstatus" :resizable="false" height="auto" width="80%">
        <div class="pr-2 pt-1">

          <button
            type="button"
            class="close"
            data-dismiss="alert"
            aria-label="Close"
            @click="closeModal('workflowstatus')"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
          <div class="w-100"
            v-if="loadingModal">
        
        <span 
            style="margin-left:50%" 
            class="my-5"
          >
         <span 
            class="align-center spinner-border loading-spinner " 
          >
          </span>
          </span> 
          </div>
          <div v-else>
        <div class="p-3 overflow-auto">
        <h5>{{$t('lang.label.status')}}</h5>

            <h6>{{workflowstatus.bot_name}}</h6>
            Start date: {{workflowstatus.start_time}}<br>
            Finish date: {{workflowstatus.finish_time}}<br>
            Status: {{workflowstatus.status}}<br>
            Item Scraped count: {{workflowstatus.item_scraped_count}}<br>
            Queued inputs: {{workflowstatus.nbr_queued_inputs}}<br>
            Recipe inputs: {{workflowstatus.nbr_recipe_inputs}}<br>
            Success inputs: {{workflowstatus.nbr_success_inputs}}<br>
            Start urls number: {{workflowstatus.start_urls_number}}<br>
                    

             <div v-if="workflowstatus.synUser !== undefined && workflowstatus.synUser !== null && workflowstatus.synUser.is_valid">
                <small><strong>{{$t('lang.integrations.syncronized')}}:</strong> {{workflowstatus.synUser.setup_at}}</small>
             

              <div v-for="(limit,index) in workflowstatus.synUser.limits" class="row">
              <div class="content-bar col-12" 
                v-if="(( typesearch == 8 && index == 3)
                  || index == 0 )" >
                <small :class="limit.item_scraped < limit.limit_value ? 'text-primary' : 'text-danger'">{{limit.limit_name}} {{limit.item_scraped}}/{{limit.limit_value}}</small>
                <div class="progress">
                  <div
                    :class="limit.item_scraped < limit.limit_value ? 'progress-bar bg-primary' : 'progress-bar bg-danger'"
                    v-bind:style="{ width: calculatePercentage(limit.item_scraped,limit.limit_value) + '%' }"
                    role="progressbar"
                    aria-valuenow="limit.item_scraped"
                    aria-valuemin="0"
                    :aria-valuemax="limit.limit_value"
                  ></div>
                </div>
                    <small class="text-danger" v-if="limit.item_scraped == limit.limit_value">
                {{$t('lang.integrations.limit')}}
                </small>
              </div>
              </div>
            </div>

            <a v-if="currentUser.role_id == 1" class="text-primary" target="_blank" :href="'https://app.captaindata.co/workflows/'+workflowstatus.workflow_uid+'/job/'+
            workflowstatus.uid">Workflow</a>

            <button 
              @click="retry(workflowstatus.captaindata_id)"
              v-if="workflowstatus.oliver_status == 'error'" 
              class="p-0 px-1 btn mr-1 btn-sm btn-outline-danger float-left">
              <small>
              <i class="icon-refresh"></i> 
              {{$t('lang.ondemand.retry')}}
              </small>
            </button>

            </div>
            </div>
        </modal>
      </div>
    
    </div>

    </div>
    <div v-if="tab == 'gmaps'">
        <div  
        class="col-12 px-3">
          <h5>Google Maps</h5>
          <img 
            v-if="!loadinond && ondemand.length == 0 && ondemandsearching.length == 0"
            width="20%"
            src="@/assets/images/search-oliver2.png" 
            class="d-block mx-auto mt-5">

          <span v-if="loadinond"
                class="loadingres mr-2 ml-2 spinner-border loading-spinner" 
              ></span>

            <OnDemandSearching 
            :notification="false"
            v-if="ondemandsearching.length > 0"
            :key="keyondemand2"
            @stop="stopOndemand()"
            @finished="finishOndemand()"
            @refresh="loadOndemandHistory()"
            ></OnDemandSearching>
          
          
          <div class="my-3 pb-3 w-100">
          <Table 
          v-if="ondemand.length > 0"
            :headers="headersGmaps"
            :cols="colsGmaps"
            :data="ondemand"
            :checkbox="false"
            :notselect="true"
            :model="model"
            @changestatus="changestatus"
            >
            </Table>
          </div>

           <div class="text-center">   
           <h3 v-if="havemoreOndemand" @click="loadMoreOndemand()" class="icon-plus-circle cursor-pointer text-primary"></h3> 
           </div>
        </div>
      </div>

    <div v-if="tab == 'schedule'">
        <div  
        class="col-12">
          <h5>{{$t('lang.ondemand.scheduled')}}</h5>
          <img 
            v-if="!loadingschedule && schedulelist.length == 0"
            width="20%"
            src="@/assets/images/search-oliver2.png" 
            class="d-block mx-auto mt-5">

          <span v-if="loadingschedule"
                class="loadingres mr-2 ml-2 spinner-border loading-spinner" 
              ></span>

          <Table 
          v-if="schedulelist.length > 0"
            :headers="headersSch"
            :cols="colsSch"
            :data="schedulelist"
            :checkbox="false"
            :notselect="true"
            :model="model"
            @deleteSchedule="deleteSchedule"
            @pauseSchedule="pauseSchedule"
            @activeSchedule="activeSchedule"
            @viewSearchs="viewSearchs"
            >
            </Table>

        </div>
        <modal   
        name="schedulehistory" :resizable="false" height="auto" width="80%">
        <div class="pr-2 pt-1">
          <button
            type="button"
            class="close"
            data-dismiss="alert"
            aria-label="Close"
            @click="closeModal('schedulehistory')"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="p-3 overflow-auto">
        <h5>{{$t('lang.button.history')}}</h5> 
            <Table 
            :headers="headersCaptainSc"
            :cols="colsCaptainSch"
            :data="schedulehistory"
            :checkbox="false"
            :notselect="true"
            :model="model"
            :key="captainkey"
            @deleteImport="deleteImport"
            >
            </Table>
            </div>
        </modal>
      </div>


    </div>
    </div>
  </div>


  </section>
</template>
<script>

import Vue from 'vue';
import Tooltip from "@/components/Common/Tooltip.vue";

import { mapState,mapActions } from "vuex";
import Table from "@/components/Common/Table.vue";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import CaptaindataStatus from "@/components/AccountCreation/Steps/Campaign/search/CaptaindataStatus.vue";
import { captainDataService } from "@/_services";
import { onDemandService } from "@/_services";
import Ondemand from "@/components/AccountCreation/Steps/Campaign/search/Ondemand.vue";
import OnDemandSearching from "@/components/AccountCreation/Steps/Campaign/search/OnDemandSearching.vue";
import Tutorial from "@/components/Tutorial.vue";
import CampaignList from "@/components/AccountCreation/Steps/CampaignList.vue";


  export default {
    computed: {
      ...mapState({
        currentUser: (state) => state.authentication.user,
        plans: (state) => state.plans.all,
        sendingDays: (state) => state.optionsList.all["param_4"],
        switched: (state) => state.authentication.user.switched,
      }),
    },
    
    components: {
      CaptaindataStatus,
      Ondemand,
      OnDemandSearching,
      Tutorial,
      CampaignList,
      Treeselect,
      Table,
      Tooltip
    },
    mounted(){
      this.$root.$on('switchcaptaindata', arg => {
          this.getUser(true)
      })
    },
    props: {
      defaulttab: String,
      notification:Boolean
    },
    data() {
     return {
      recurrent:false,
      cookie:false,
      loadingModal:false,
      workflowstatus:[],
      typeurls:{
          1:'https://www.linkedin.com/search/results/people/',
          2:'https://www.linkedin.com/search/results/content/',
          5:'https://www.linkedin.com/search/results/events/',
          7:'https://www.linkedin.com/groups/',
          4:'https://www.linkedin.com/sales/search/people',
          8:'https://www.linkedin.com/sales/search/people'
      },
      typename:{
          1:'Linkedin',
          2:'Linkedin Like Post',
          3:'Google Maps',
          5:'Linkedin Events',
          7:'Linkedin Groups',
          4:'Sales Navigator',
          8:'Sales Navigator'
      },
      listSearchs:
        [{
          title: this.$t("lang.search.mysearchs") + ' Linkedin',
          items: [
            {
              img: 'linkedin-logo.png',
            imgwidth: '60px',
              title: this.$t('lang.linkedin.normalsearch'),
              desc: this.$t('lang.linkedin.normalsearchdesc'),
              typesearch: 1
            },
            {
              img: 'google-logo.png',
              imgwidth: '90px',
              title: this.$t("lang.ondemand.title"),
              desc: this.$t("lang.ondemand.desc"),
              typesearch: 3
            },
            {
              img: 'linkedin-logo.png',
            imgwidth: '60px',
              title: this.$t('lang.linkedin.searchpost'),
              desc: this.$t('lang.linkedin.searchpostdesc'),
              typesearch: 2,
              plan: 'Advanced'
            },
            {
              img: 'linkedin-logo.png',
            imgwidth: '60px',
              title: this.$t('lang.linkedin.searchevent'),
              desc: this.$t('lang.linkedin.searcheventdesc'),
              typesearch: 5,
              plan: 'Advanced'
            },
            {
              img: 'linkedin-logo.png',
              imgwidth: '60px',
              title: this.$t('lang.linkedin.searchgroup'),
              desc: this.$t('lang.linkedin.searchgroupdesc'),
              typesearch: 7,
              plan: 'Advanced'
            },
            {
              img: 'salesnav-logo.png',
              imgwidth: '90px',
              title: this.$t('lang.linkedin.searchsalesnav'),
              desc: this.$t('lang.linkedin.searchsalesnavdesc'),
              typesearch: 4,
              plan: 'Pro'
            },
            {
              img: 'salesnav-logo.png',
              imgwidth: '90px',
              title: this.$t('lang.linkedin.searchsalesnavrec'),
              desc: this.$t('lang.linkedin.searchsalesnavrec'),
              typesearch: 8,
              plan: 'Pro'
            }
          ]
        }],
      loadinschedulesearchs:false,
      openschedule:true,
      schedulehistory:[],
      scheduleday:[],
      sendingDaysI8N: [],
      captainkey:112000,
      model:{
        imported:false,
        refreshlist:false,
        selectfirst:false
      },
      colsGmaps: [
          [{
          'value' : 'name',
          }],
          [{
          'value' : 'industry',
          }],
          [{
          'value' : 'imported',
          }],
          [{
          'value' : 'status',
          'translate':'lang.ondemand',
          'icons' : [
                {
                'icon_if_value':'finished',
                'icon_true':'icon-checkmark text-success',
                },
                {
                'icon_if_value':'pending',
                'icon_true':'icon-clock text-secondary',
                },
                {
                'icon_if_value':'stopped',
                'icon_true':'icon-stop text-danger',
                },
                {
                'icon_if_value':'importing',
                'icon_true':'icon-download text-primary',
                },
                {
                'icon_if_value':'auto-paused',
                'icon_true':'icon-download text-primary',
                },
            ],
          }], 
          [{
          'value' : 'created',
          }],
          [{
            'value' :'map',
            'type' : 'map',
            'apikey': 'AIzaSyD8lJ7PX0clyNDGqzgKApjipSyO9vcrYSc'
          }],
          [{
            'label' : this.$t('lang.column.results'),
            'value' : 'id',
            'class' : 'text-primary',
            'type':'router',
            'icon':'icon-eye',
            'url':'/businesses/OD-'
          }],
          [{
            'label' : this.$t('lang.general.delete'),
            'value_emit' : 'id',
            'class' : 'text-danger',
            'type':'emit',
            'icon':'icon-trash',
            'emit': 'changestatus',
            'action':'deleted'
          }],
         ],
      headersGmaps: [
          {
          'label' : this.$t('lang.column.name'),
          'percentage':'20%',
          'class':'overflowhide'
          },
          {
          'label' : this.$t('lang.ondemand.industry'),
          'percentage':'20%',
          'class':'overflowhide'
          },
          {
          'label' : this.$t('lang.label.importedcontacts'),
          'percentage':'5%',
          'class':'overflowhide'
          },
          {
          'label' : this.$t('lang.column.status'),
          'percentage':'10%',
          'class':'overflowhide'
          },
          {
          'label' : this.$t('lang.column.creationdate'),
          'percentage':'15%',
          },
          {
          'label' : this.$t('lang.label.location'),
          'percentage':'10%',
          'class':'overflowhide'
          },
          {
          'label' : this.$t('lang.label.actions'),
          'percentage':'10%',
          'class':'overflowhide'
          },
          {
          'label' : '',
          'percentage':'10%',
          'class':'overflowhide'
          },
         ],
      colsCaptain: [
          [{
          'value' : 'name',
          'badges' : [{
              'badge_if' : 'schedule_name',
              'badge_class' : 'badge badge-primary text-white',
              'badge_label' : this.$t('lang.ondemand.scheduled'),
              }],
          }],
          [{
            'label' : '',
            'value_emit' : 'job_id',
            'class' : 'text-primary',
            'type':'emit',
            'icon':'icon-info',
            'emit': 'viewWorkflowStatus'
          }],
          [{
            'value' : 'url_search',
            'link' : 'url_search',
            'type':'link',
            'class':'cursor-pointer',
            'icons' : 'linkedin',
            'tooltip': 'url_search',
          }],
          [{
          'value' : 'status',
          'translate':'lang.ondemand',
          'icons' : [
                {
                'icon_if_value':'imported',
                'icon_true':'icon-checkmark text-success',
                },
                {
                'icon_if_value':'pending',
                'icon_true':'icon-clock text-secondary',
                },
                {
                'icon_if_value':'stopped',
                'icon_true':'icon-stop text-danger',
                },
                {
                'icon_if_value':'error',
                'icon_true':'icon-warning text-danger',
                },
                {
                'icon_if_value':'importing',
                'icon_true':'icon-download text-primary',
                },
                {
                'icon_if_value':'auto-paused',
                'icon_true':'icon-download text-primary',
                },
            ],
          }],
          [{
          'value' : 'result',
          }],
          [{
          'value' : 'imported',
          }],
          [{
          'value' : 'created',
          }],
          [{
          'value' : 'username',
          }],
          [{
          'value' : 'campaign_name',
          }],
          [{
            'label' : this.$t('lang.column.results'),
            'value' : 'id',
            'class' : 'text-primary',
            'type':'router',
            'icon':'icon-eye',
            'url':'/businesses/'
          }],
          [{
            'label' : this.$t('lang.general.delete'),
            'value_emit' : 'id',
            'class' : 'text-danger',
            'type':'emit',
            'icon':'icon-trash',
            'emit': 'deleteImport'
          }],
         ],
      colsCaptainSch: [
          [{
          'value' : 'name',
          }],
          [{
            'value' : 'url_search',
            'link' : 'url_search',
            'type':'link',
            'class':'cursor-pointer',
            'icons' : 'linkedin',
            'tooltip': 'url_search'
          }],
          [{
          'value' : 'status',
          'translate':'lang.ondemand',
          'icons' : [
                {
                'icon_if_value':'imported',
                'icon_true':'icon-checkmark text-success',
                },
                {
                'icon_if_value':'pending',
                'icon_true':'icon-clock text-secondary',
                },
                {
                'icon_if_value':'stopped',
                'icon_true':'icon-stop text-danger',
                },
                {
                'icon_if_value':'importing',
                'icon_true':'icon-download text-primary',
                },
                {
                'icon_if_value':'auto-paused',
                'icon_true':'icon-download text-primary',
                },
            ],
          }],
          [{
          'value' : 'result',
          }],
          [{
          'value' : 'imported',
          }],
          [{
          'value' : 'created',
          }],
          [{
            'label' : this.$t('lang.column.results'),
            'value' : 'id',
            'class' : 'text-primary',
            'type':'router',
            'icon':'icon-eye',
            'url':'/businesses/'
          }],
         ],
      headersCaptain: [
          {
          'label' : this.$t('lang.label.name'),
          'percentage':'10%',
          'class':'overflowhide'
          },
          {
          'label' : '',
          'size':'10px',
          'class':'overflowhide'
          },
          {
          'label' : 'URL',
          'percentage':'20%',
          'size':'250px',
          'class':'overflowhide'
          },
          {
          'label' : this.$t('lang.label.status'),
          'percentage':'10%',
          'class':'overflowhide'
          },
          {
          'label' : this.$t('lang.linkedin.exportable'),
          'percentage':'10%',
          'class':'overflowhide'
          },
          {
          'label' : this.$t('lang.linkedin.exportedcontacts'),
          'percentage':'10%',
          'class':'overflowhide'
          },
          {
          'label' : this.$t('lang.label.creationdate'),
          'percentage':'10%',
          'class':'overflowhide'
          },
          {
          'label' : this.$t('lang.label.user'),
          'percentage':'10%',
          'class':'overflowhide'
          },
          {
          'label' : this.$t('lang.column.campaign'),
          'percentage':'10%',
          'class':'overflowhide'
          },
          {
          'label' : this.$t('lang.label.actions'),
          'percentage': '10%',
          'class':'overflowhide'
          },
          {
          'label' : '',
          'percentage':'10%',
          'class':'overflowhide'
          },
         ],
      headersCaptainSc: [
          {
          'label' : this.$t('lang.label.name'),
          'percentage':'20%',
          'class':'overflowhide'
          },
          {
          'label' : 'URL',
          'percentage':'20%',
          'size':'250px',
          'class':'overflowhide'
          },
          {
          'label' : this.$t('lang.label.status'),
          'percentage':'20%',
          'class':'overflowhide'
          },
          {
          'label' : this.$t('lang.linkedin.exportable'),
          'percentage':'10%',
          'class':'overflowhide'
          },
          {
          'label' : this.$t('lang.linkedin.exportedcontacts'),
          'percentage':'10%',
          'class':'overflowhide'
          },
          {
          'label' : this.$t('lang.label.creationdate'),
          'percentage':'10%',
          'class':'overflowhide'
          },
          {
          'label' : this.$t('lang.label.actions'),
          'percentage': '10%',
          'class':'overflowhide'
          }
         ],
         colsSch: [
          [{
          'value' : 'name',
          }],
          [{
            'value' : 'url_search',
            'link' : 'url_search',
            'type':'link',
            'class':'cursor-pointer',
            'icons' : 'linkedin',
            'tooltip': 'url_search'
          }],
          [{
          'value' : 'campaign_name'
          }],
          [{
          'value' : 'days',
          'type' : 'days',
          'tooltip': 'days',
          }],
          [{
          'value' : 'username',
          }],
          [{
          'value' : 'status',
          'icons' : [
                {
                'icon_if_value':'paused',
                'icon_true':'icon-pause text-warning',
                },
                {
                'icon_if_value':'active',
                'icon_true':'icon-circle text-success',
                },
                {
                'icon_if_value':'error',
                'icon_true':'icon-warning text-danger',
                'tooltip_true': this.$t('lang.integrations.errorschedule')
                },
            ],
          }],
          [
            {
              'label' : '',
              'value_emit' : 'id',
              'value':'status',
              'value_if':'active',
              'class' : 'btn btn-sm btn-primary',
              'type':'emit',
              'icon':'icon-pause',
              'emit': 'pauseSchedule'
            },
            {
              'label' : '',
              'value_if':'paused',
              'value':'status',
              'value_emit' : 'id',
              'class' : 'btn btn-sm btn-primary',
              'type':'emit',
              'icon':'icon-play',
              'emit': 'activeSchedule'
            }
          ],
          [{
          'value' : 'created',
          }],
          [{
          'value' : 'last_execution',
          }],
          [{
            'label' : this.$t('lang.button.history'),
            'value_emit' : 'id',
            'class' : 'text-primary',
            'type':'emit',
            'icon':'icon-eye',
            'emit': 'viewSearchs'
          }],
          [{
            'label' : this.$t('lang.general.delete'),
            'value_emit' : 'id',
            'class' : 'text-danger',
            'type':'emit',
            'icon':'icon-trash',
            'emit': 'deleteSchedule'
          }]
         ],
      headersSch: [
          {
          'label' : this.$t('lang.label.name'),
          'percentage' : '20%',
          'class':'overflowhide'
          },
          {
          'label' : 'URL',
          'percentage' : '20%',
          'size':'250px',
          'class':'overflowhide'
          },
          {
          'label' : this.$t('lang.ondemand.linkedcampaign'),
          'percentage' : '20%',
          'class':'overflowhide'
          },
          {
          'label' : this.$t('lang.label.days'),
          'percentage' : '20%',
          'class':'overflowhide'
          },
          {
          'label' : this.$t('lang.label.user'),
          'percentage' : '20%',
          'class':'overflowhide'
          },
          {
          'label' : this.$t('lang.label.status'),
          'percentage' : '10%',
          'class':'overflowhide'
          },
          {
          'label' : '',
          'percentage' : '5%',
          'class':'overflowhide'
          },
          {
          'label' : this.$t('lang.label.creationdate'),
          'percentage' : '10%',
          'class':'overflowhide'
          },
          {
          'label' : this.$t('lang.ondemand.lastexecution'),
          'percentage' : '10%',
          'class':'overflowhide'
          },
          {
          'label' : this.$t('lang.label.actions'),
          'percentage' : '5%',
          'class':'overflowhide'
          },
          {
          'label' : '',
          'percentage' : '5%',
          'class':'overflowhide'
          }
         ],
      campaignListKey:233302,
      campaign_id:false,
      campaign_name:false,
      hidegetuser:true,
      widthvideo:false,
      havemoreOndemand: false,
      havemoreCaptain: false,
      limitcaptainlist:0,
      limitondemandlist:0,
      tab:'newsearch',
      urlsearch:'',
      pendingcaptain:false,
      errormessage:false,
      loadinguser:false,
      loadingschedule:false,
      schedulelist:[],
      apikey:'AIzaSyD8lJ7PX0clyNDGqzgKApjipSyO9vcrYSc',
      namesearch:'',
      synUser:false,
      keycap:23330,
      keycap2:54330,
      keyondemand:111000,
      keyondemand2:22000,
      limit:100,
      limitmax: false,
      workflows:[],
      ondemand:[],
      ondemandsearching:[],
      captainserching:false,
      captaindataactualsearchs:[],
      importing:false,
      importdata:[],
      typesearch:1,
      loading:false,
      loadingl:true,
      levelplan:0,
      loadinond:true,
      hasActive:false
     }
    },


    created() { 

      this.getAllOptionsList();

      if(this.sendingDays !== undefined){
        this.sendingDays.data.forEach((element) => {
          
            if (element.is_translated === undefined) {
              element.label = this.$t("lang.sending_days." + element.label);
              element.is_translated = true;
            }
          });

        this.sendingDaysI8N = this.sendingDays.data;
      }


    if(this.currentUser.subscription_status_id == 0){
      this.limitmax = 100
      this.levelplan = 0
    }else{
      if(this.currentUser.plan_id == 1){
        this.limitmax = 500
        this.levelplan = 1
      }
      if(this.currentUser.plan_id == 2){
        this.limitmax = false
        this.levelplan = 2
      }
      if(this.currentUser.plan_id == 3){
        this.limitmax = false
        this.levelplan = 3
      }
    }

    if(this.currentUser.role_id == 1){
        this.limitmax = false
        this.levelplan = 3
    }

    let cookie = captainDataService.getLinkedinCookie();
    if(cookie !== undefined){
      this.cookie = cookie
      this.syncronize(false);
    }else{
      this.getUser(false);
    }

      if(this.$route.params.defaulttab == 'mysearch'){
        this.tab = this.$route.params.defaulttab
      }
      
      if(this.currentUser.role_id == 1){
this.typesearch=4
      }else{
      this.typesearch=1
      }
      

      this.namesearch = this.typename[this.typesearch]
      this.loadCaptainSearching()
      this.loadOndemandHistory()     
      this.loadOndemand()

    },

    methods: { 
      ...mapActions("optionsList", {
        getAllOptionsList: "getAll",
      }),
      ...mapActions("headertopbar", {
        setCurrentRoute: "setRoute",
        setCurrentRouteChild: "setRouteChild",
      }),
      closeModal(mod){
        this.schedulehistory=[]
        this.$modal.hide(mod);
      },
      refreshList(){
        this.model.selectfirst=true
        this.campaignListKey++
      },
      hasActiveSearch(){
        return (this.hasActive && this.currentUser.role_id != 1)
      },
      retry(id){
        if(id){
          captainDataService.changeStatus(id,'pending')
          this.closeModal('workflowstatus')
          this.changeTab('captain')
        }
      },

      hasLimit(){
        if(this.synUser == undefined){
          return false
        }

        if(this.synUser.limits == undefined){
          return false
        }

          let limits = this.synUser.limits
          if(limits[0].item_scraped == limits[0].limit_value){
              return true;
          }
          if(limits[3].item_scraped == limits[3].limit_value){
              return true;
          }
          return false;
      },
      udpdateHeader(route) {
        this.setCurrentRoute({ page: route });
        this.setCurrentRouteChild({ child: "" });
      },
       addSelected(item){
          this.campaign_id = item.id
          this.campaign_name = item.name
      },
      startGmaps(){
        this.changeTab('gmaps')
      },
      loadCaptainSearching(){
        captainDataService.getActualList().then((response) => {
           this.loadingl = false
           if(response !== undefined){
             this.captaindataactualsearchs = response.result

             this.captainserching = response.result[0]
             if(this.captainserching){
              this.hasActive = true
             }else{
              this.hasActive = false
             }
             this.keycap++
           }
        }).catch((err) => {
              this.loadingl = false
            });  
      },
      loadScheduleHistory(scheduleid){
        this.loadinschedulesearchs = true
        captainDataService.getScheduleHistory(scheduleid).then((response) => {
         this.loadinschedulesearchs = false
          if(response.result !== undefined){
            this.schedulehistory = response.result
            this.$modal.show("schedulehistory");
          }
        })
      },
      viewSearchs(id){
        this.loadScheduleHistory(id)
      },
      loadWorkflowStatus(jobid){
        captainDataService.getWorkflowStatus(jobid).then((response) => {
          if(response.result !== undefined){
            this.loadingModal = false
            this.workflowstatus = response.result

          }
        })
      },
      viewWorkflowStatus(id){
        this.$modal.show("workflowstatus");
        this.loadingModal = true
        this.loadWorkflowStatus(id)
      },
      getColorType(type){
          
        if(type != 3 && type != 1 && this.levelplan == 0){
            return 'text-secondary';
        }else{
          if(type == 4 && this.levelplan != 3){
            return 'text-secondary';
          }
        }
        return 'text-primary';
      },

      hasAccess(type){

        if(this.currentUser.role_id == 1){
          return true;
        }

        if(type != 3 && type != 1 && this.levelplan == 0){
            return false
        }else{

          if((type == 4 || type == 8) && this.levelplan != 3){
            return false
          }
        }
        return true;

      },

      chooseSelect(option){
        if(this.limitmax && this.limit > this.limitmax){

          let title = ""
          if(this.currentUser.subscription_status_id == 0){
           title = this.$t('lang.ondemand.limitfree',{cant:this.limitmax})
          }else{
           title = this.$t('lang.ondemand.limitmax',{cant:this.limitmax,plan:this.plans[this.currentUser.plan_id].name})
          }

          this.$swal({
              type: "warning",
              title: this.$t('lang.label.restrictedaccess'),
              text: title,
              showCancelButton: true,
              confirmButtonColor: "#3085d6",
              cancelButtonColor: "#d33a2c",
              confirmButtonText: this.$t("lang.button.upgrade"),
              cancelButtonText: this.$t("lang.button.cancel"),
            }).then((result) => {

              if (result.value) {
                 if(result.value == true){
                    this.$router.push('/upgrade'); 
                  }  
              }
              this.limit = 100;
            });
        
        }
      },
      changeTypeSearch(type){
        this.recurrent=false
        this.scheduleday=[]
        let limitnow = false
        if(type == 3){
            this.$forceUpdate()
        }

        limitnow = !this.hasAccess(type)

        if(limitnow){
            this.$swal({
                  type: "warning",
                  title: this.$t('lang.label.restrictedaccess'),
                  text: "",
                  showCancelButton: true,
                  confirmButtonColor: "#3085d6",
                  cancelButtonColor: "#d33a2c",
                  confirmButtonText: this.$t("lang.button.upgrade"),
                  cancelButtonText: this.$t("lang.button.cancel"),
                }).then((result) => {

                  if (result.value) {
                     if(result.value == true){
                        this.$router.push('/upgrade'); 
                      }  
                  }
                });
        }else{
          this.typesearch = type
          this.namesearch = this.typename[type]

        }

      
      },
      refreshAll(){
        this.loadingl = true
        this.loadinond = true
        this.loadCaptainList()
        this.loadOndemandHistory()
        this.$forceUpdate()
      },
      openMap(loc,id){
          this.$swal({
            title: this.$t('lang.search.mysearchs'),
            html: "<img src='https://maps.googleapis.com/maps/api/staticmap?center="+loc[0]+"&zoom=12&key="+this.apikey+"&size=500x500&maptype=map&sensor=false&path=color%3ablue|weight:2|fillcolor%3ablue|"+this.getlocations2(loc)+"&cache="+id+"'/>",
            width: '550px',
            showCancelButton: false,
            showConfirmButton: false,
            showCloseButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33a2c",
            showCancelButton: false,
            cancelButtonText: this.$t('lang.button.close'),
        })
      },
      onlyUser(){
         return (this.currentUser.client_id == 63 || this.currentUser.client_id == 50
                 || this.currentUser.client_id == 4  || this.currentUser.client_id == 976
                   || this.currentUser.client_id == 15);
      },

      changeTab(tab){
        this.recurrent=false
        if(tab == 'schedule' && this.levelplan != 3){
         
        
            this.$swal({
                  type: "warning",
                  title: this.$t('lang.label.restrictedaccess'),
                  text: "",
                  showCancelButton: true,
                  confirmButtonColor: "#3085d6",
                  cancelButtonColor: "#d33a2c",
                  confirmButtonText: this.$t("lang.button.upgrade"),
                  cancelButtonText: this.$t("lang.button.cancel"),
                }).then((result) => {

                });

                return
        }

        this.schedulelist=[]
        if(tab == 'captain'){
          this.loadCaptainList()
        }else{
          if(tab == 'gmaps'){
            this.loadOndemandHistory()
          }else{
            if(tab == 'schedule'){
              this.loadSchedule()
            }else{
              this.loadOndemand()
              this.loadCaptainSearching()
            }
          }
        }

        this.tab = tab
      },
      loadMoreOndemand(){
        this.limitondemandlist = this.limitondemandlist + this.ondemand.length
        onDemandService.getHistoyList(this.limitondemandlist).then((response) => {


            
            if(response.result !== undefined && response.result[0].havemore){
              this.havemoreOndemand = true
            }else{
              this.havemoreOndemand = false
            }

           response.result.forEach((res) => {
            this.ondemand.push(res)
           })
           
        }).catch((err) => {
              this.loadinond = false
            }); 
      }, 
      loadCaptainList(){
        this.loadingl = true
        captainDataService.getHistory().then((response) => {
         this.loadingl = false
         if(response !== undefined){
          if(response.result !== undefined && response.result[0].havemore){
            this.havemoreCaptain = true
          }else{
            this.havemoreCaptain = false
          }
          this.workflows = response.result
          this.keycap++
         }else{
            this.havemoreCaptain = false
         }

        }).catch((err) => {
                this.loadingl = false
        });
      },
      loadMoreCaptain(){
        this.limitcaptainlist = this.limitcaptainlist + this.ondemand.length
        captainDataService.getHistory(this.limitcaptainlist).then((response) => {
          
           if(response.result !== undefined && response.result[0].havemore){
              this.havemoreCaptain = true
            }else{
              this.havemoreCaptain = false
            }

           response.result.forEach((res) => {
            this.workflows.push(res)
           })
        }).catch((err) => {
            this.loadingl = false
        });
      }, 
      loadOndemandHistory(){
        this.loadinond = true
        this.limitondemandlist = 0;
        onDemandService.getHistoyList().then((response) => {

          this.loadinond = false

          if(response !== undefined){
           if(response.result !== undefined && response.result[0].havemore){
              this.havemoreOndemand = true
            }else{
              this.havemoreOndemand = false
            }
           this.ondemand = response.result
           
           this.keyondemand++
          }else{
            this.havemoreOndemand = false
          }

        }).catch((err) => {
              this.loadinond = false
            }); 
      },

      loadSchedule(){
      this.loadingschedule = true
        captainDataService.getSchedule().then((response) => {
          this.loadingschedule = false
          if(response !== undefined){
                this.schedulelist = response.result
          }
        }).catch((err) => {
          this.loadingschedule = false
        });

      },
      loadOndemand(){
        onDemandService.getList().then((response) => {
          this.loadinond = false
          if(response !== undefined){
            if(response.result[0].status !== 'finished'){
                this.ondemandsearching = response.result
            }
          }
        }).catch((err) => {
          this.loadinond = false
        });

      },
      stopOndemand(){
        this.ondemandsearching = []
        this.loadinond = true
        this.refreshAll()
      },
      finishOndemand(){
        this.status = 'finished'
        this.keyondemand2++
         this.refreshAll()
        
      },
      changestatus(status,id){
        onDemandService.changestatus(id,status).then((response) => {
           this.refreshAll()
        })
      },
      deleteSchedule(id){
        captainDataService.changeStatusSchedule(id,'deleted').then((response) => {
           this.loadSchedule()
        })
      },
      pauseSchedule(id){
        captainDataService.changeStatusSchedule(id,'paused').then((response) => {
           this.loadSchedule()
        })
      },
      activeSchedule(id){
        captainDataService.changeStatusSchedule(id,'active').then((response) => {
           this.loadSchedule()
        })
      },
      deleteImport(id){
        captainDataService.deleteSearch(id).then((response) => {
           this.refreshAll()
        })
      },

      calculatePercentage(finished,totals) {
      let left = totals - finished;
      return Math.floor((finished / totals) * 100);
      },

      syncnow(response,click){
        if(response.result !== null){
          if(response.result.name !== undefined){
            this.currentUser.synUser = response.result

            
            this.synUser = response.result
            this.errormessage = false
              if(this.synUser.is_valid == false){
                  this.errormessage = this.$t('lang.integrations.errorsyn',{link:"<a target='_blank' class='text-primary' href='https://linkedin.com'>https://linkedin.com</a>"})
                }
          }else{
            if(response.result.response !== undefined){ 
              this.errormessage = this.$t('lang.integrations.errorsyn',{link:"<a target='_blank' class='text-primary' href='https://linkedin.com'>https://linkedin.com</a>"})

            }else{
              if(click){
               this.errormessage = this.$t('lang.integrations.errorsyn',{link:"<a target='_blank' class='text-primary' href='https://linkedin.com'>https://linkedin.com</a>"})
              }
            }
          }
        }
          this.loadinguser = false
          this.hidegetuser = false
      },

      syncronize(click){
        captainDataService.getUser(this.cookie).then((response) => {
              this.syncnow(response,click)
          })
      },

      getUser(click){
        

        this.loadinguser = true
        this.widthvideo = false
        

        if(click){
          if(this.$refs.linkedincookie !== undefined){
            this.cookie = this.$refs.linkedincookie.value
          }else{
             this.errormessage = this.$t('lang.integrations.errorsyn',{link:"<a target='_blank' class='text-primary' href='https://linkedin.com'>https://linkedin.com</a>"})
          }
        }

        this.syncronize(click)
         
      },
      removeUser(){
        this.loadinguser = true
        if(this.currentUser.role_id == 1){
         captainDataService.unSync().then((response) => {
            this.synUser = false
            this.loadinguser = false
            this.getUser(true)
          });
        }else{
         captainDataService.removeUser().then((response) => {
            this.synUser = false
            this.loadinguser = false
            this.getUser(true)
          });
        }
        this.$root.$emit('removecaptain')

      },
      getlocations(loc){
        loc = JSON.parse(loc)
        return loc[0]
      },
      getlocations2(loc){
        loc = JSON.parse(loc)
        loc = loc.join("|")
        loc = loc
        return loc
      },
      hasSearchActive(status){
        if(!status){
          this.captainserching = false
        }
        this.hasActive = status
      },
      search(){
        let error = false

        if(this.currentUser.role_id == 1){
          this.scheduleday = []
          this.scheduleday.push("99")

          this.recurrent = true

        }

        if(this.typeurls[this.typesearch] !== undefined){
          if(this.urlsearch.indexOf(this.typeurls[this.typesearch]) === -1) {
              error = this.typeurls[this.typesearch]
          }
        }

        if(error){

          this.$swal({
                type: "warning",
                title: this.$t('lang.ondemand.urlerror'),
                text: error,
                showCancelButton: false,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33a2c",
                confirmButtonText: this.$t("lang.button.ok"),
              }).then((result) => {
                return
              });
          return
        }

        this.$emit("actives",true)
        this.loading = true
        captainDataService.startSearch(this.urlsearch,this.namesearch,this.limit,this.campaign_id,this.scheduleday,this.recurrent).then(
        (response) => {
            this.loadCaptainSearching()
            this.loading = false
            this.urlsearch = ""
            this.campaign_id = false
            this.campaign_name = false

            if(this.typesearch == 8 && this.scheduleday.length > 0){
              this.changeTab('schedule')
            }else{
              this.changeTab('captain')
            }

          })
        

      },

      importResult(id){
        this.$emit("actives",true)
        this.importing = true
        captainDataService.importResult(id).then((response) => {
            this.importing = false
        })
      }
    },
  };
</script>
<style scoped>
.progress{
  height: 0.3rem;
}


#previewlist {
  height: 30vh;
  overflow: scroll !important;
  width: 100% !important;
}
</style>