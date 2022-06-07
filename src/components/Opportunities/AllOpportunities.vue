<template>
  <main class="main" :class="{ 'expand-main': isMenuCollapse }">
    <div class="">  
      <div class="ml-4 py-1" v-if="opportunity_id == false">
      
        <span class="ml-2">
          <Tutorial
           v-if="permissionFront()"
            id="billing"
            :linkText="$t('lang.label.howitworks')"
            playListurl="https://help.oliverlist.com/fr/category/opportunites-w169gd/"
            linkClass="small ml-2 mt-2" 
            :videoUrl="'https://www.youtube.com/embed/' + $t('lang.videos.opportunities')"
          />
        </span>
      </div>
      <section class="opportunitiesList">
        <div class="pt-3 animated fadeIn fast">
          <div class="row">
            <div
              :class="
                opportunity_id == false
                  ? 'col-12'
                  : 'expandedlist border-right border-2 pl-2'
              "
            >
              <div
                class="row px-3 bg-light border-top border-2 border-grey pb-2"
                
              >
              <!-- v-if="!showEmptyImage() || filters.quickSearchFilter !== '' || (filtersSystem.predicates !== undefined && filtersSystem.predicates.length > 0)" -->
                <div class="ml-4 w-100">
                  <div
                    class="display-inline float-left mt-2"
                  >
                    <form v-on:submit.prevent="confirmSearch()">
                      <div class="input-group">
                        <input
                          class="form-control-sm border-0"
                          type="search"
                          v-on:search="confirmSearch()"
                          v-on:keyup.enter="confirmSearch()"
                          v-bind:placeholder="$t('lang.label.quicksearch')"
                          aria-label="Search"
                          v-model="filters.quickSearchFilter"
                        />
                        <div class="input-group-append" >
                          <button
                            class="
                              themed-button
                              btn-sm
                              border-0
                              btn-secondary
                              themed-hover
                            "
                            type="submit"
                          >
                            <span class="icon-search"></span>
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>

                  <button 
                    class="
                      float-right
                      display-inline
                      ml-2
                      mr-2
                      mt-2
                      mb-1
                      btn btn-secondary
                      themed-button
                      btnNavTabla
                    "
                    v-if="opportunity_id == false && !showEmptyImage() && permissionFront()"
                    @click="allDataCSV"
                  >
                    {{ $t("lang.button.downloadalldata") }}
                  </button>
                  <button 
                    class="
                      float-right
                      display-inline
                      ml-2
                      mt-2
                      mb-1
                      btn btn-secondary
                      themed-button
                      btnNavTabla
                    "
                    v-if="opportunity_id == false && !showEmptyImage() && permissionFront()"
                    :disabled="checkedOpportunities.length == 0"
                    @click="descargarCheckList"
                  >
                    {{ $t("lang.button.downloadselecteddata") }}
                  </button>
                  <button
                    v-if="opportunity_id != false"
                    class="
                      float-left
                      ml-2
                      mt-2
                      btn btn-primary
                      themed-button
                      btn-sm
                    "
                    @click="closeOp()"
                  >
                    <i class="icon-times"></i>
                  </button>
                  <div  v-if="permissionFront()"
                    class="display-inline float-left mt-2 ml-2"
                  >
                    <FilterSystem
                      v-if="keyFilter > 1"
                      :columns="opportunitiesColumns"
                      :reset="resetFilterSystem"
                      :sort="sort"
                      :dir="dir"
                      :key="keyFilter"
                      :filterSystem="filtersSystem"
                      :filterOldQuery="oldQuery"
                      @callApi="callApi"
                    />
                  </div>
                </div>
              </div>
              <LoadingSpinner v-if="loading" />
              <div class="mt-4" v-if="!loading">
                <div class="px-2 border-2 border-bottom border-grey">
                  <div
                    v-for="(list, key) in opportunitiesLists"
                    v-if="listv1"
                    :class="list == 'todo' ? 'mr-2' : ''"
                    class="ml-3 d-inline opp-listtype"
                  >
                    <span
                      :class="
                        selectedList == list
                          ? 'active border-bottom-3 border-primary'
                          : ''
                      "
                      :key="key"
                      type="button"
                      :data-token="list"
                      v-on:click="chooseList"
                      class="p-0 it-tabs pb-2"
                    >
                      {{ $t("lang.opportunities." + list) }}
                    </span>
                    <small
                      class="pl-2 pb-4 position-absolute p-1 notif"
                      v-if="list == 'todo' && permissionFront()"
                    >
                      <transition enter-active-class="animated tada">
                        <strong
                          v-show="notifications > 0"
                          enter-active-class="animated tada"
                          class="ease-in-out bg-danger mb-2 p-1 px-1 rounded"
                        >
                          {{ notifications }}
                        </strong>
                      </transition>
                    </small>
                  </div>
                </div>

                <div
                  class="table-responsive"
                  :class="listv1 == true ? 'px-4' : 'pl-3'"
                >
                  <table
                    class="table table-hover card-style min-width-table"
                    :class="opportunity_id == false ? 'card-style' : ''"
                    v-if="!showEmptyImage() && listv1 == true"
                  >
                    <thead v-if="opportunity_id == false">
                      <tr>
                        <th></th>
                        <th
                          scope="col"
                          style="white-space: nowrap"
                          class="cursor-pointer"
                          @click="orderBy('company')"
                        >
                          {{ $t("lang.column.company") }}
                          <span
                            v-if="sort == 'business.name' && dir == 'asc'"
                            class="icon-angle-double-up ml-2"
                          />
                          <span
                            v-if="sort == 'business.name' && dir == 'desc'"
                            class="icon-angle-double-down ml-2"
                          />
                          <span
                            v-if="sort != 'business.name'"
                            class="icon-angle-down ml-2"
                          />
                        </th>
                        <th
                        v-if="permissionFront()"
                          scope="col"
                          style="white-space: nowrap"
                          class="cursor-pointer"
                          @click="orderBy('score')"
                        >
                          Score
                          <span
                            v-if="
                              sort == 'link.score_normalized' && dir == 'asc'
                            "
                            class="icon-angle-double-up ml-2"
                          />
                          <span
                            v-if="
                              sort == 'link.score_normalized' && dir == 'desc'
                            "
                            class="icon-angle-double-down ml-2"
                          />
                          <span
                            v-if="sort != 'link.score_normalized'"
                            class="icon-angle-down ml-2"
                          />
                        </th>
                        <th scope="col" style="white-space: nowrap" class="">
                          {{ $t("lang.label.activity") }}
                        </th>
                        <th
                          scope="col"
                          style="white-space: nowrap"
                          class=""
                          v-if="permissionFront()"
                        >
                          {{ $t("lang.label.tasks") }}
                        </th>
                        <th
                          scope="col"
                          style="white-space: nowrap"
                          class="cursor-pointer"
                          @click="orderBy('tag')"
                           v-if="permissionFront()"
                        >
                          Tags
                          <span
                            v-if="sort == 'tag.id' && dir == 'asc'"
                            class="icon-angle-double-up ml-2"
                          />
                          <span
                            v-if="sort == 'tag.id' && dir == 'desc'"
                            class="icon-angle-double-down ml-2"
                          />
                          <span
                            v-if="sort != 'tag.id'"
                            class="icon-angle-down ml-2"
                          />
                        </th>
                        <th
                          v-if="!permissionFront()"
                          scope="col"
                          style="white-space: nowrap"
                          class="cursor-pointer"
                          @click="orderBy('lastActivity')"
                        >
                          {{ $t("lang.column.date") }}
                          
                        </th>
                        <th
                          v-if="permissionFront()"
                          scope="col"
                          style="white-space: nowrap"
                          class="cursor-pointer"
                          @click="orderBy('lastActivity')"
                        >
                          {{ $t("lang.column.lastactivity") }}
                          <span
                            v-if="sort == 'last_activity' && dir == 'asc'"
                            class="icon-angle-double-up ml-2"
                          />
                          <span
                            v-if="sort == 'last_activity' && dir == 'desc'"
                            class="icon-angle-double-down ml-2"
                          />
                          <span
                            v-if="sort != 'last_activity'"
                            class="icon-angle-down ml-2"
                          />
                        </th>

                        <th
                          scope="col"
                          style="white-space: nowrap"
                          class="cursor-pointer"
                           v-if="permissionFront()"
                          @click="orderBy('campaign')"
                        >
                          {{ $t("lang.column.campaign") }}
                          <span
                            v-if="sort == 'campaign.name' && dir == 'asc'"
                            class="icon-angle-double-up ml-2"
                          />
                          <span
                            v-if="sort == 'campaign.name' && dir == 'desc'"
                            class="icon-angle-double-down ml-2"
                          />
                          <span
                            v-if="sort != 'campaign.name'"
                            class="icon-angle-down ml-2"
                          />
                        </th>
                        <th
                          scope="col"
                          style="white-space: nowrap"
                          class="cursor-pointer"
                          @click="orderBy('salaries')"
                          v-if="permissionFront()"
                        >
                          {{ $t("lang.label.companysize") }}
                          <span
                            v-if="sort == 'business.salaries' && dir == 'asc'"
                            class="icon-angle-double-up ml-2"
                          />
                          <span
                            v-if="sort == 'business.salaries' && dir == 'desc'"
                            class="icon-angle-double-down ml-2"
                          />
                          <span
                            v-if="sort != 'business.salaries'"
                            class="icon-angle-down ml-2"
                          />
                        </th>
                        <th scope="col" style="white-space: nowrap"  v-if="permissionFront()">
                          {{ $t("lang.column.owner") }}
                        </th>
                      </tr>
                    </thead>

                    <tbody v-if="!showEmptyImage()">
                      <tr
                        v-for="(opportunity, key) in opportunities.list"
                        :key="key"
                        class="shadow-sm p-3 mb-5 bg-white rounded"
                        :class="
                          opportunity.link_id == opportunity_id
                            ? 'bg-email-active-open'
                            : ' bg-white'
                        "
                      >
                        <div
                          v-if="
                            key > 1 && !toastNotificationData.subscriptionActive
                          "
                          style="
                            position: absolute;
                            width: 100%;
                            height: 90px;
                            background: #ffffff52;
                            backdrop-filter: blur(4px);
                            z-index: 9999;
                          "
                        >
                          <small class="d-flex justify-content-center">
                            <router-link
                              class="mt-4 btn btn-primary btn-sm"
                              to="/upgrade"
                            >
                              {{ $t("lang.button.upgrade") }}
                            </router-link>
                          </small>
                        </div>
                        <td v-if="opportunity_id == false">
                          <input
                            type="checkbox"
                            :id="key"
                            :name="key"
                            v-model="checkedOpportunities"
                            :value="key"
                          />
                        </td>
                        <td
                          :class="opportunity_id == false ? '' : 'p-4'"
                          @click="goToOpportunity(opportunity.link_id)"
                          style="min-width: 300px; color: #8580f2"
                          class="cursor-pointer"
                        >
                          <span class="badge-danger badge" v-if="opportunity.link_status_id == 8 && opportunity.link_status_reason_id == 34  && (!permissionFront() || currentUser.team_role_id == 2 )">{{$t('lang.refuse.refused')}}</span>
                          <span class="badge-warning badge" v-if="opportunity.link_status_id == 8 && opportunity.link_status_reason_id == 35  && (!permissionFront() || currentUser.team_role_id == 2 )">{{$t('lang.refuse.absentlabel')}}</span>

                          {{ opportunity.business_name | capitalize }}

                          <a
                            :href="'//' + buildUrl(opportunity.business_domain)"
                            target="_blank"
                          >
                            <small
                              class="icon-link"
                              style="color: #6c757d"
                            ></small>
                          </a>
                        </td>

                        <td
                          v-if="opportunity_id == false && permissionFront()"
                          @click="goToOpportunity(opportunity.link_id)"
                          style="min-width: 100px"
                          class="cursor-pointer"
                        >
                          <div>
                            <label
                              :class="getScoreColor(opportunity)"
                              class="badge p-2 text-white mr-2"
                            >
                              <span v-if="opportunity.score > 1">{{
                                getScore(opportunity.score)
                              }}</span>
                            </label>
                          </div>
                        </td>
                        <td
                          v-if="opportunity_id == false"
                          @click="goToOpportunity(opportunity.link_id)"
                          style="min-width: 150px"
                          class="cursor-pointer"
                        >
                          <div>
                            <Act :opportunity="opportunity"></Act>
                          </div>
                        </td>
                        <td
                          v-if=" permissionFront() && opportunity_id == false"
                          @click="goToOpportunity(opportunity.link_id)"
                          style="min-width: 150px"
                          class="cursor-pointer"
                        >
                          <div>
                            <label
                              class="mb-0"
                              :class="
                                opportunity.tasks > 0 ? 'text-success' : ''
                              "
                              :key="tasksChange"
                            >
                              {{ opportunity.tasks }}
                              {{ $t("lang.opportunities.tasks") }}</label
                            >
                          </div>
                        </td>
                        <td
                          v-if="opportunity_id == false && permissionFront()"
                          style="min-width: 250px"
                        >
                          <multiselect
                            v-model="opportunity.tags"
                            tag-placeholder="Add this as new tag"
                            v-bind:placeholder="
                              $t('lang.label.searchoraddatag')
                            "
                            label="name"
                            track-by="id"
                            :options="tags"
                            :multiple="true"
                            :taggable="true"
                            :searchable="true"
                            :showLabels="false"
                            openDirection="below"
                            class="small"
                            @tag="addTag($event, opportunity)"
                            @input="onChange($event, opportunity)"
                            @select="selectLinkTag($event, opportunity.link_id)"
                            @remove="removeLinkTag($event, opportunity)"
                          >
                            <template slot="option" slot-scope="props">
                              <div
                                v-if="props.option.name"
                                class="option__desc"
                              >
                                <span class="option__title customOptions">
                                  <div>
                                    {{ props.option.name }}
                                  </div>
                                  <div>
                                    <a
                                      v-if="
                                        props.option.count == 0 &&
                                        props.option.client_id != undefined
                                      "
                                      @mouseover="hover = true"
                                      @mouseleave="hover = false"
                                      @click="removeTag(props.option)"
                                    >
                                      <span class="icon-remove ft-2" />
                                    </a>
                                  </div>
                                </span>
                              </div>
                            </template>
                            <template slot="tag" slot-scope="props" >
                              <span
                                class="multiselect__tag"
                                v-bind:style="
                                  'background: #' + props.option.color
                                "
                              >
                                <span
                                  v-text="props.option.name"
                                  class="mr-1"
                                ></span>
                                <i
                                  aria-hidden="true"
                                  tabindex="1"
                                  @keydown.enter.prevent="
                                    removeLinkTag(props.option, opportunity)
                                  "
                                  @mousedown.prevent="
                                    removeLinkTag(props.option, opportunity)
                                  "
                                  class="multiselect__tag-icon"
                                  v-bind:style="
                                    'background: #' + props.option.color
                                  "
                                >
                                </i>
                              </span>
                            </template>
                          </multiselect>
                        </td>

                        <td
                          v-if="opportunity_id == false && permissionFront()"
                          style="min-width: 150px"
                          @click="goToOpportunity(opportunity.link_id)"
                          class="cursor-pointer"
                        >
                          <span>{{ formatGetTimeAgo(opportunity) }}</span>
                        </td>
                         <td
                          v-if="!permissionFront()"
                          style="min-width: 150px"
                          @click="goToOpportunity(opportunity.link_id)"
                          class="cursor-pointer"
                        >
                          <span>
                                <i class="icon-calendar"></i> {{ opportunity.event_date }}</span>
                        </td>


                        <td
                          v-if="opportunity_id == false && permissionFront()"
                          @click="goToOpportunity(opportunity.link_id)"
                          style="min-width: 150px"
                          class="cursor-pointer"
                        >
                          <div
                            class="badge"
                            :class="
                              statusBadgeOliver(opportunity.link_status_name)
                            "
                          >
                            {{ opportunity.campaign_name.toUpperCase() }}
                          </div>
                        </td>

                        <td
                          v-if="opportunity_id == false && permissionFront()"
                          @click="goToOpportunity(opportunity.link_id)"
                          class="cursor-pointer"
                        >
                          <div
                            class="badge"
                            style="background-color: #5155ea; color: white"
                          >
                            <span>
                              {{ getSalaries(opportunity.salaries) }}</span
                            >
                          </div>
                        </td>
                        <td
                          v-if="opportunity_id == false &&  permissionFront()"
                          @click="goToOpportunity(opportunity.link_id)"
                          class="cursor-pointer"
                        >
                          <div class="badge badge-primary">
                            <span> {{ opportunity.owner_name }}</span>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  <table
                    class="table table-hover"
                    :class="opportunity_id == false ? 'card-style' : ''"
                    v-if="listv1 == false"
                  >
                    <thead>
                      <tr>
                        <th class="cursor-pointer">
                          <span
                            class="
                              btn-todo btn btn-outline-primary btn-sm
                              dropdown-toggle
                              opp-type
                            "
                            type="button"
                            data-toggle="dropdown"
                            aria-haspopup="true"
                            aria-expanded="false"
                          >
                            {{ $t("lang.opportunities." + this.selectedList) }}
                          </span>
                          <div class="dropdown-menu">
                            <a
                              v-for="(list, key) in opportunitiesLists"
                              :key="key"
                              :data-token="list"
                              v-on:click="chooseList"
                              class="dropdown-item c-pointer hover-bg token"
                            >
                              {{ $t("lang.opportunities." + list) }}
                            </a>
                          </div>
                        </th>
                        <th v-if="!permissionFront()">
                          <div
                            class="cursor-pointer float-right"
                            @click="orderBy('lastActivity')"
                            v-if="!showEmptyImage()"
                          >
                            {{ $t("lang.column.date") }}
                           
                          </div>
                        </th>
                        <th v-if="permissionFront()">
                          <div
                            class="cursor-pointer float-right"
                            @click="orderBy('lastActivity')"
                            v-if="!showEmptyImage()"
                          >
                            {{ $t("lang.column.lastactivity") }}
                            <span
                              v-if="sort == 'last_activity' && dir == 'asc'"
                              class="icon-angle-double-up ml-2"
                            />
                            <span
                              v-if="sort == 'last_activity' && dir == 'desc'"
                              class="icon-angle-double-down ml-2"
                            />
                            <span
                              v-if="sort != 'last_activity'"
                              class="icon-sort ml-2"
                            />
                          </div>
                        </th>
                      </tr>
                    </thead>

                    <tbody v-if="!showEmptyImage() && !showNotTodoImage()">
                      <tr
                        v-for="(opportunity, key) in opportunities.list"
                        @click="goToOpportunityNow(opportunity.link_id, key)"
                        :key="key"
                        class="p-5 cursor-pointer border-bottom"
                        :class="
                          opportunity.link_id == opportunity_id
                            ? 'bg-email-active-open'
                            : ' bg-white'
                        "
                      >
                        <td
                          :class="opportunity_id == false ? '' : 'px-3'"
                          class="mw-50"
                        >
                          <div
                            v-if="
                              key > 1 &&
                              !toastNotificationData.subscriptionActive
                            "
                            style="
                              position: absolute;
                              width: 100%;
                              height: 140px;
                              left: 0px;
                              margin-top: -25px;
                              background: #ffffff52;
                              backdrop-filter: blur(4px);
                              z-index: 9999;
                            "
                          ></div>
                          <badge class="badge-danger badge" v-if="opportunity.link_status_id == 8 && opportunity.link_status_reason_id == 34 && (!permissionFront() || currentUser.team_role_id == 2 )">{{$t('lang.refuse.refused')}}</badge>
                          <badge class="badge-warning badge" v-if="opportunity.link_status_id == 8 && opportunity.link_status_reason_id == 35 && (!permissionFront() || currentUser.team_role_id == 2 )">{{$t('lang.refuse.absentlabel')}}</badge>
                          <div>
                            <label  v-if="permissionFront()"
                              :class="getScoreColor(opportunity)"
                              class="badge p-2 text-white mr-2"
                            >
                              <span v-if="opportunity.score > 1">{{
                                getScore(opportunity.score)
                              }}</span>
                            </label>
                            <span style="color: #8580f2">{{
                              opportunity.business_name | capitalize
                            }}</span>
                          </div>
                          <div class="mt-4" style="white-space: nowrap" >
                            <small
                              v-if="permissionFront()"
                              class="mb-0"
                              :class="
                                opportunity.tasks > 0 ? 'text-success' : ''
                              "
                              :key="tasksChange"
                              >{{ opportunity.tasks }}
                              {{ $t("lang.opportunities.tasks") }}</small
                            >

                            <div class="ml-3 mt-2">
                              <small>
                                <Act :opportunity="opportunity"></Act>
                              </small>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div class="float-right">
                            <div class="text-right w-100">
                              <span v-if="permissionFront()" class="float-right"
                                ><small class="cdarkgray">{{
                                  formatGetTimeAgo(opportunity)
                                }}</small></span
                              >
                              <span v-if="!permissionFront()" class="float-right"
                                ><small class="cdarkgray">
                                <i class="icon-calendar"></i>
                                {{
                                  opportunity.event_date
                                }}</small></span
                              >
                            </div>

                            <div class="text-right w-100 mb-5"  v-if="permissionFront()">
                              <Tooltip
                                :text="opportunity.campaign_name.toUpperCase()"
                                :width="'auto'"
                              >
                                <span
                                  class="badge hovertext2"
                                  :class="
                                    statusBadgeOliver(
                                      opportunity.link_status_name
                                    )
                                  "
                                  >{{
                                    opportunity.campaign_name.toUpperCase()
                                  }}</span
                                >
                              </Tooltip>
                            </div>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  <div
                    class="w-100 text-center pt-5"
                    v-if="
                      !showEmptyImage() &&
                      !showNotTodoImage() &&
                      this.opportunities.length == 0
                    "
                  >
                    <span
                      class="
                        font-weight-light
                        ft-1-5
                        text-center text-secondary
                      "
                    >
                      {{ $t("lang.label.noresultsfound") }}
                    </span>
                  </div>

                  <div class="w-100 text-center pt-5" v-if="showNotTodoImage()">
                    <img src="@/assets/images/not-todo.png" class="mw-70" />
                    <div>
                      <h2 class="mt-5 text-secondary">
                        {{ $t("lang.label.brave") }} !
                      </h2>
                      <h6 class="mt-2 text-secondary">
                        {{ $t("lang.label.donthavetask") }} !
                      </h6>
                    </div>
                  </div>

                  <div
                    class="w-100 text-center pt-5"
                    v-if="showEmptyImage() && !showNotTodoImage()"
                  >
                    <img src="@/assets/images/job-seeker.png" class="" />
                    <div class="mt-3 text-center">
                      <span
                        class="
                          font-weight-light
                          ft-1-5
                          text-center text-secondary
                        "
                        >{{
                          $t("lang.label.therearenoopportunitiesatthemoment")
                        }}</span
                      >
                    </div>
                    <div class="mt-3 text-center">
                      <div class="mr-2 d-inline">
                        <button
                           v-if="permissionFront()"
                          class="
                            btn btn-sm btn-primary
                            themed-button
                            effect-btn
                          "
                          type="submit"
                          @click="addCampaign"
                        >
                          <i class="icon-plus1"></i>
                          {{ $t("lang.button.addnewcampaign") }}
                        </button>
                      </div>
                      <div class="d-inline">
                           <Tutorial
                            v-if="permissionFront()"
                            id="billing"
                            :linkText="$t('lang.label.howitworks')"
                            playListurl="https://help.oliverlist.com/fr/category/opportunites-w169gd/"
                            linkClass="small ml-2 mt-2"
                            :videoUrl="'https://www.youtube.com/embed/' + $t('lang.videos.opportunities')"
                          />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div
                class="px-3 mb-4 table-footer row"
                v-if="totalOpportunities > 0 && !loading"
              >
                <div class="col-12 text-left mb-3 ml-3">
                  <span class="font-weight-bold"
                    >{{ $t("lang.label.showing") }} {{ firstInPage }}
                    {{ $t("lang.label.to") }} {{ lastInPage }}
                    </span
                  >
                </div>
                <div class="col-md-12 ml-3">
                  <button
                    type="button"
                    class="btn btn-primary themed-button btnNavTabla"
                    :disabled="isFirstPage"
                    @click="prevPage()"
                  >
                    <span class="icon-angle-double-left mr-2" />{{
                      $t("lang.button.previous")
                    }}
                  </button>
                  <button
                    type="button"
                    class="btn btn-primary themed-button ml-2 btnNavTabla"
                    :disabled="isLastPage"
                    @click="nextPage()"
                  >
                    {{ $t("lang.button.next") }}
                    <span class="icon-angle-double-right ml-2" />
                  </button>
                  <button
                    type="button"
                    class="
                      btn btn-secondary
                      display-inline
                      ml-2
                      dropdown-toggle
                      themed-button
                      btnNavTabla
                    "
                    id="dropdownCantPerPage"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                    data-offset="10,20"
                  >
                    <span
                      >{{ cantPerPage }} {{ $t("lang.button.perpage") }}</span
                    >
                  </button>
                  <button
                    v-if="opportunity_id == false && !showEmptyImage() && permissionFront()"
                    class="
                      float-right
                      display-inline
                      ml-2
                      mr-4
                      mb-1
                      btn btn-secondary
                      themed-button
                      btnNavTabla
                    "
                    @click="allDataCSV"
                  >
                    {{ $t("lang.button.downloadalldata") }}
                  </button>
                  <button
                    v-if="opportunity_id == false && !showEmptyImage() && permissionFront()"
                    class="
                      float-right
                      display-inline
                      ml-2
                      mb-1
                      btn btn-secondary
                      themed-button
                      btnNavTabla
                    "
                    :disabled="checkedOpportunities.length == 0"
                    @click="descargarCheckList"
                  >
                    {{ $t("lang.button.downloadselecteddata") }}
                  </button>
                  <div
                    class="col-3 dropdown text-right"
                    
                  >
                    <div
                      class="dropdown-menu"
                      aria-labelledby="dropdownCantPerPage"
                    >
                      <a
                        class="dropdown-item cursor-pointer"
                        v-for="(optionCant, index) in cantPerPageOptions"
                        :key="index"
                        @click="cantPerPage = optionCant"
                        >{{ optionCant }} {{ $t("lang.button.perpage") }}</a
                      >
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <transition v-if="opportunity_id != false" name="fade">
              <div class="mailDetail">
                <div class="row">
                  <Opportunity
                    :key="opportunity_id"
                    :opportunity_id="opportunity_id"
                  />
                </div>
              </div>
            </transition>
          </div>
        </div>
      </section>
    </div>
  </main>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
import { router } from "@/_helpers";
import {
  statusBadgeMixin,
  urlMixin,
  logoMixin,
  billingUtilsMixin,
} from "@/_mixins/";
import {
  linkStatusService,
  usersService,
  campaignsService,
  categoriesService,
  opportunitiesService,
  tagsService,
} from "@/_services";
import moment from "moment";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import Opportunity from "@/components/Opportunities/Opportunity.vue";
import Act from "@/components/Common/Act.vue";
import Multiselect from "vue-multiselect";
import Vue from "vue";
import Tutorial from "@/components/Tutorial.vue";
Vue.component("multiselect", Multiselect);
import FilterSystem from "@/components/FilterSystem.vue";
import Tooltip from "@/components/Common/Tooltip.vue";

export default {
  data() {
    return {
      activities: [],
      blur: false,
      listv1: true,
      campaignslist:[],
      keyFilter:1,
      opportunity_id: false,
      cantPerPage: 30,
      cantPerPageOptions: [5, 10, 20, 50, 100],
      linkStatus: [],
      campaigns: [],
      parentCategories: [],
      businessFilter: [],
      tagFilter: [],
      tags: [],
      oppTasks: [],
      hover: false,
      deleted: "",
      searchFilter: {},
      resetFilterSystem: false,
      opportunitiesColumns: [],
      opportunitiesColumnsOnlyForOrder: [
        {
          name: "LastActivity",
          name_: "lastActivity",
          field: "last_activity",
        },
        {
          name: "Tasks",
          name_: "Tasks",
          field: "tasks",
        },
      ],
      sort: "",
      dir: "",
      contacts: 3,
      links: 5,
      engagements: 8,
      orderType: "last_activity DESC",
      orderOptions: [
        {
          text: this.$t("lang.label.newesttooldest"),
          value: "last_activity ASC",
        },
        {
          text: this.$t("lang.label.oldesttonewest"),
          value: "last_activity DESC",
        },
        { text: this.$t("lang.label.lowesttohighest"), value: "score ASC" },
        { text: this.$t("lang.label.highesttolowest"), value: "score DESC" },
      ],
      checkedOpportunities: [],
      unparsedResults: null,
      opportunitiesLists: ["all", "todo", "treated"],
    };
  },

  mixins: [statusBadgeMixin, urlMixin, logoMixin, billingUtilsMixin],

  components: {
    LoadingSpinner,
    Multiselect,
    FilterSystem,
    Opportunity,
    Act,
    Tutorial,
    Tooltip,
  },
  watch: {
    $route(to, from) {
      if (
        this.$route.params.id !== undefined &&
        this.$route.params.id !== this.opportunity_id
      ) {
        let link_id = this.$route.params.id;
        link_id = parseInt(link_id);
        this.switchOpportunity(link_id);
      }
    },

    currentPage() {
      if (this.resetFilterSystem == true) {

        this.searchOpportunities();
      } else {
          this.refresh();
        
      }
    },

    cantPerPage() {
      if (this.resetFilterSystem == true) {
        this.searchOpportunitiesWithPageReset();
      } else {
        this.refresh();
      }
    },

    "filters.quickSearchFilter"() {
      this.filters.quickSearchFilter = this.$sanitize(
        this.filters.quickSearchFilter
      );
    },
  },

  computed: {
    ...mapState({
      isMenuCollapse: (state) => state.sidebar.isNavOpen,
      currentPage: (state) => state.opportunities.currentPage,
      loading: (state) => state.opportunities.loading,
      opportunities: (state) => state.opportunities.all.data,
      filters: (state) => state.opportunities.allFilters,
      filtersSystem: (state) => state.opportunities.filtersSystem,
      oldQuery: (state) => state.opportunities.oldQuery,
      currentUser: (state) => state.authentication.user,
      myCampaigns: (state) => state.campaigns.listAllCampaigns.data,
      headerTab: (state) => state.header.tab,
      tasksChange: (state) => state.opportunities.tasksChange,
    }),
    toastNotificationData() {
      return this.$store.state.authentication.toastNotificationData;
    },
    isFirstPage() {
      return this.currentPage === 1;
    },
    isLastPage() {
      return this.totalOpportunities < this.cantPerPage;
    },
    pageCount() {
      var cantPage = this.totalOpportunities / this.cantPerPage;
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
        this.totalOpportunities >= this.firstInPage &&
        this.totalOpportunities <= this.currentPage * this.cantPerPage
      ) {
        return this.totalOpportunities+this.cantPerPage;
      } else {
        return this.currentPage * this.cantPerPage;
      }
    },
    totalOpportunities() {
      if (
        this.opportunities !== undefined  && this.opportunities.list !== undefined
      ) {
        this.$store.state.opportunities.empty = false;
        return this.opportunities.list.length;
      } else {
        return 0;
      }
    },
    tagsFiltered() {
      return this.tags.filter((t) => t.client_id == undefined || t.count > 0);
    },
    selectedList: {
      get() {
        return this.$store.state.opportunities.selectedList;
      },
      set(value) {
        this.setSelectedList(value);
      },
    },
    notifications() {
      return this.$store.state.authentication.notifications;
    },
  },

  created() {
    if (this.myCampaigns == undefined) {
      this.getListAllCampaigns();
    }else{
      this.campaignslist = this.myCampaigns;
    }

    this.createFilters();
    this.keyFilter++

    this.udpdateHeader("opportunities");

    if (this.$route.params.id !== undefined) {
      let opid = this.$route.params.id;
      opid = parseInt(opid);
      this.switchOpportunity(opid);
    }

    if (this.opportunities == undefined) {
      if (this.filtersSystem.predicates) {
        this.refresh();
      } else {
        this.searchTypeList("all");
      }
    }

    if (
      this.$route.query.list !== undefined &&
      this.opportunitiesLists.indexOf(this.$route.query.list) !== -1
    ) {
      this.searchTypeList(this.$route.query.list);
    }

    if (screen.width <= 480) {
      this.cantPerPage = 5;
    }

    let linkStatus = [
      { id: 1, name: "Oliver OFF" },
      { id: 2, name: "Oliver ON" }
    ];  

    if( this.currentUser.team_role_id == 2 || this.currentUser.role_id == 1 ) {
   
      linkStatus[2] = { id: 11, name: "Absent" };
      linkStatus[3] = { id: 10, name: "Refused" };
    }


    
    
    

    let status = {
      name: "Status",
      type: "list",
      list: linkStatus,
      field: "link_status_history.link_status_id",
    };
    this.opportunitiesColumns.push(status);

  
    tagsService.getAllByClientId().then((tags) => {
      this.tags = tags;
      let tag = {
        name: "Tag",
        name_: "tag",
        type: "list",
        list: tags,
        field: "tag.id",
      };
      this.opportunitiesColumns.push(tag);
    });
  },

  methods: {
    ...mapActions("opportunities", {
      getAllOpportunities: "getAll",
      getAllByFilter: "getAllByFilter",
      setSalesUserFilter: "setSalesUserFilter",
      setOrderBy: "setOrderBy",
      resetAllOpportunitiesStateFilters: "resetAllFilters",
      setFilterSystem: "setFilterSystem",
      resetFiltersSystem: "resetFilterSystem",
    }),
    ...mapActions("campaigns", {
      getListAllCampaigns: "getListAllCampaigns",
    }),
    ...mapActions("headertopbar", {
      setCurrentRoute: "setRoute",
      setCurrentRouteChild: "setRouteChild",
    }),
    ...mapMutations("opportunities", {
      nextPage: "nextPage",
      prevPage: "prevPage",
      resetPage: "resetPage",
      setSelectedList: "setSelectedList",
    }),
    ...mapActions("header", {
      changeHeaderTab: "changeTab",
    }),


    udpdateHeader(route) {
      this.setCurrentRoute({ page: route });
      this.setCurrentRouteChild({ child: "" });
    },
    permissionFront(){
      return (this.currentUser.team_role_id == undefined || this.currentUser.team_role_id != 3)
    },
    getStatus(op) {
      if (op.link_status_name == "Created") {
        return "OLIVER ON";
      }
      if (op.link_status_name == "Do not contact") {
        return this.$t("lang.campaigns_dashboard.donotcontactinfo");
      }
      if (op.link_status_name == "Positive") {
        return "OLIVER OFF";
      }
    },

  createFilters(){
   this.opportunitiesColumns = 
        [{
          name: this.$t("lang.search.campaign"),
          name_: "campaign",
          type: "string",
          list: this.campaignslist,
          field: "campaign.name",
        },
        {
          name: this.$t("lang.column.email"),
          name_: "email",
          type: "string",
          field: "business_contact.email",
        },
        {
          name: this.$t("lang.label.companyname"),
          name_: "company",
          type: "string",
          field: "business.name",
        },
        {
          name: this.$t("lang.label.companysize"),
          name_: "salaries",
          type: "number",
          field: "business.salaries",
        },
        {
          name: this.$t("lang.label.sessionquantity"),
          type: "number",
          field: "activitycant",
        },
        {
          name: this.$t("lang.label.answerqty"),
          type: "number",
          field: "emailresponsecant",
        },
        {
          name: this.$t("lang.label.openingqty"),
          type: "number",
          field: "openemailcant",
        },
        {
          name: this.$t("lang.label.score"),
          name_: "score",
          type: "number",
          field: "link.score_normalized",
        },
        {
          name: this.$t("lang.column.owner"),
          name_: "user",
          type: "string",
          field: 'CONCAT(user.name," ",user.lastname)',
        },
        {
          name: this.$t("lang.label.sessionduration"),
          type: "number",
          field: "cs.seconds_total",
        },
      ]
  },

    getScoreColor(opportunity) {
      if (opportunity.score >= 10 && opportunity.score <= 50) {
        return "badge-warning";
      }
      if (opportunity.score < 10) {
        return "badge-primary";
      }
      return "badge-success";
    },
    chooseList(event) {
      let list = event.target.getAttribute("data-token");
      this.selectedList = list
      this.refresh()
    },
    changeList() {
      this.listv1 = !this.listv1;
      this.refresh();
    },
    getClassStatus(op) {
      if (op.link_status_name == "Created") return "badge-success";
      return "badge-secondary";
    },
    showEmptyImage() {
      if(this.loading){
        return false
      }
      if(this.opportunities == undefined || 
              this.opportunities.list == undefined ||  
              this.opportunities.list == true ||
              this.opportunities.list.length == 0){
            return true
      }

    },
    showNotTodoImage() {
      return this.totalOpportunities == 0 && this.selectedList == "todo";
    },
    getScore(score) {
      return Math.round(score);
    },
    closeOp() {
      this.opportunity_id = false;
      this.$router.push("/opportunities");
      this.listv1 = true;
      if (screen.width > 990) {
        this.$store.state.sidebar.isNavOpen = false;
      }
    },
    getSalaries(salaries) {
      if (salaries > 200) {
        return "+200";
      }
      if (salaries <= 200 && salaries > 10) {
        return "10-200";
      }
      return "1-10";
    },

    addCampaign() {
      this.changeHeaderTab({ tab: "SELECTED" });
      router.push({
        name: "campaigns",
      });
    },

    formatGetTimeAgo(data) {
      data = data.last_activity;

      if (data != null) {
        let timeNotif = new Date(data);
        let today = moment();

        let hours = today.diff(timeNotif, "hours");
        let days = today.diff(timeNotif, "days");
        let weeks = today.diff(timeNotif, "weeks");

        if (days < 1) {
          data = moment(timeNotif, "YYYYMMDD").fromNow();
        } else if (days < 7) {
          data = days + " days ago";
        } else if (days < 30) {
          data = weeks + " weeks ago";
        } else {
          data = data = moment(timeNotif, "YYYYMMDD").fromNow();
        }
        return data;
      } else return data;
    },

    getDataUserBilling() {
      this.blur = this.checkPaymentMethodAndBudget();
    },

    alertaShowOpp() {
      this.$swal({
        type: "warning",
        title: "De nouvelles opportunités vous attendent !",
        text: "De nouvelles opportunités ont été générées depuis la fin de votre essai. Félicitations! Pour les découvrir, complétez votre profil de facturation dans la section dédiée à cet effet.",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33a2c",
        confirmButtonText: this.$t("lang.label.addpaymentmethod"),
      }).then((result) => {
        if (result.value) {
          this.$router.push("/settings-account");
        }
      });
    },
    openPopup() {
      this.$swal({
        title: this.$t("lang.button.whatisanopportunity"),
        html: '<iframe class="w-100"  height="400" src="https://player.vimeo.com/video/470887986" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>',
        width: "800px",
        showCancelButton: true,
        showConfirmButton: false,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33a2c",
        cancelButtonText: this.$t("lang.button.cancel"),
      }).then((result) => {
        if (result.value) {
          this.$router.push("/settings-account");
        }
      });
    },

    getLeadScore(score, number) {
      if (score > number) {
        return "lead__score__item lead__score__item--active";
      } else {
        return "lead__score__item";
      }
    },

    refresh() { 
      if(this.selectedList !== undefined ){
         this.searchTypeList(this.selectedList)
      }else{
        this.getAllByFilter({
          currentPage: this.currentPage,
          cantPerPage: this.cantPerPage,
          searchFilter: this.filtersSystem,
        });
      }
    },
    orderBy(columnName) {
      let column = this.opportunitiesColumns.filter(
        (c) => c.name_ === columnName
      )[0];
      if (column == undefined) {
        column = this.opportunitiesColumnsOnlyForOrder.filter(
          (c) => c.name_ === columnName
        )[0];
      }
      if (column != undefined) {
        if (this.sort == column.field) {
          if (this.dir == "desc") {
            this.dir = "asc";
          } else {
            this.dir = "desc";
          }
        } else {
          this.dir = "desc";
          this.sort = column.field;
        }
      }
    },
    searchOpportunities() {
      this.getAllOpportunities({
        currentPage: this.currentPage,
        cantPerPage: this.cantPerPage,
        searchFilter: this.filters.quickSearchFilter,
      });
    },

    searchOpportunitiesWithPageReset() {
      this.getAllOpportunities({
        currentPage: this.currentPage,
        cantPerPage: this.cantPerPage,
        searchFilter: this.filters.quickSearchFilter,
      }).then((result) => this.resetPage());
    },

    buildUrl(url) {
      var pattern = /^((http|https):\/\/)/;
      if (/^((http|https):\/\/)/.test(url)) {
        url = url.replace(/^https?\:\/\//i, "");
      }
      if (!/www./.test(url)) {
        url = "www." + url;
      }
      return url;
    },

    goToOpportunity(link_id) {
      this.$router.push("/opportunities/" + link_id);
    },
    goToOpportunityNow(link_id, key) {
      if (key > 1 && !this.toastNotificationData.subscriptionActive) {
        return false;
      } else {
        this.goToOpportunity(link_id);
      }
    },
    switchOpportunity(link_id) {
      this.opportunity_id = link_id;
      this.$store.state.opportunities.clicked[link_id] = true;
      this.$store.state.sidebar.isExpandedList = true;
      if (screen.width > 990) {
        this.$store.state.sidebar.isNavOpen = true;
      }
      this.listv1 = false;
    },

    getNotification(opportunity, id) {
      return (
        opportunity.notifications !== null &&
        opportunity.notifications.includes(id) &&
        !this.$store.state.opportunities.clicked[opportunity.link_id]
      );
    },

    getAllTags() {
      tagsService.getAllByClientId().then((tags) => (this.tags = tags));
    },

    changeOrderBy(orderBy) {
      this.setOrderBy({ orderBy: orderBy }).then((result) =>
        this.searchOpportunitiesWithPageReset()
      );
    },

    resetAllFilters() {
      this.filters.actualQuickFilter = "ALL";
      this.searchFilter = "";
      this.resetAllOpportunitiesStateFilters();
      this.searchOpportunitiesWithPageReset();
    },

    searchOrderedBy(orderBy) {
      this.searchFilter = "";
      this.resetAllOpportunitiesStateFilters();
      if (orderBy === "score") {
        this.filters.actualQuickFilter = "PRIORITY";
      } else {
        this.filters.actualQuickFilter = "HISTORY";
        this.setSalesUserFilter({ salesUser: this.currentUser.id });
      }
      this.changeOrderBy(orderBy);
    },

    searchTypeList(typelist) {
      this.selectedList = typelist;
      let searchNow;
      if (this.searchFilter.filters == undefined) {
        searchNow = { typelist };
      } else {
        this.searchFilter.filters["typelist"] = typelist;
        searchNow = this.searchFilter.filters;
      }
      this.getAllByFilter({
        currentPage: this.currentPage,
        cantPerPage: this.cantPerPage,
        searchFilter: searchNow,
      }).then((result) => {
        return true;
      });
    },

    confirmSearch() {
      this.resetAllOpportunitiesStateFilters();
      this.getAllOpportunities({
        currentPage: this.currentPage,
        cantPerPage: this.cantPerPage,
        searchFilter: this.filters.quickSearchFilter,
      }).then((result) => this.resetPage());
    },
    callApi(filters) {
      this.setFilterSystem({ filters: filters }).then((result) => {
        this.resetFilterSystem = false;
        this.filters.quickSearchFilter = "";
        this.searchFilter = filters;
        this.searchFilter.filters["typelist"] = this.selectedList;
        this.getAllByFilter({
          currentPage: this.currentPage,
          cantPerPage: this.cantPerPage,
          searchFilter: this.searchFilter.filters,
        }).then((result) => this.resetPage());
      });
    },

    getRandomColor() {
      var r, g, b, rg, gb, rb;
      var range = 180; // controls the range of r,g,b you would like
      //reduce the range if you want more darker colors
      var sep = range / 4; // controls the minimum separation for saturation
      //note- keep sep < range/3 otherwise may crash browser due to performance
      //reduce the sep if you do not mind pastel colors
      //generate r,g,b, values as long as any difference is < separation
      do {
        r = Math.floor(Math.random() * range);
        g = Math.floor(Math.random() * range);
        b = Math.floor(Math.random() * range);

        rg = Math.abs(r - g);
        gb = Math.abs(g - b);
        rb = Math.abs(r - b);
      } while (rg < sep || gb < sep || rb < sep);

      //convert the rgb to hex

      function rgbtohex(rgb) {
        var first, second; // makes the two hex code for each rgb value

        first = Math.floor(rgb / 16); //get first unit of hex
        second = rgb % 16; //get second unit of hex
        // convert to string with hex base 16
        first = first.toString(16);
        second = second.toString(16);
        //concatenate the two units of the hex
        var rgbtohex = first + second;
        //return the two unit hex code for the r,g,b value
        return rgbtohex;
      }

      //convert the r,g,b numbers to hex code by calling the rgbto hex function
      var r_str = rgbtohex(r),
        g_str = rgbtohex(g),
        b_str = rgbtohex(b);
      //concatenate the final string for the output
      var final = r_str + g_str + b_str;

      //output random color
      return final;
    },

    addTag(newTag, opportunity) {
      const tag = {
        name: this.$sanitize(newTag),
        description: newTag,
        color: this.getRandomColor(),
      };

      tagsService
        .createTag(tag.name, tag.description, tag.color)
        .then((tag) => {
          tagsService.createLinkTag(opportunity.link_id, tag.id);
          if (opportunity.tags == undefined) {
            opportunity.tags = [];
          }
          opportunity.tags.push(tag);
          this.getAllTags();
        });
    },
    removeTag(tag) {
      this.deleted = tag;
      tagsService.removeTag(tag.id).then(() => {
        this.tags = this.tags.filter((t) => t.id != this.deleted.id);
      });
    },
    onChange(value, opportunity) {
      if (this.hover == true) {
        if (value != undefined && value.length > 0) {
          opportunity.tags = value.filter((t) => t.id != this.deleted.id);
        }
      }
    },
    removeLinkTag(tag, opportunity) {
      tagsService.removeLinkTag(opportunity.link_id, tag.id).then(() => {
        if (opportunity.tags != undefined && opportunity.tags.length > 0) {
          opportunity.tags = opportunity.tags.filter((t) => t.id != tag.id);
        }
        this.getAllTags();
      });
    },
    selectLinkTag(tag, linkId) {
      if (this.hover == false) {
        tagsService.createLinkTag(linkId, tag.id);
      }
    },

    descargarCheckList() {
      if (this.checkedOpportunities.length > 0) {
        this.$store.state.opportunities.loading = true;

        this.listOpportunities = [];

        for (var i = 0; i < this.checkedOpportunities.length; i++) {
          let tags = [];
          let status = "";

          if (
            this.opportunities.list[this.checkedOpportunities[i]]["tags"] !=
            null
          ) {
            for (
              let l = 0;
              l <
              this.opportunities.list[this.checkedOpportunities[i]]["tags"]
                .length;
              l++
            ) {
              tags.push(
                this.opportunities.list[this.checkedOpportunities[i]]["tags"][
                  l
                ]["name"]
              );
            }
          }

          if (
            this.opportunities.list[this.checkedOpportunities[i]][
              "link_status_name"
            ] == "Created"
          ) {
            status = "OLIVER ON";
          }

          if (
            this.opportunities.list[this.checkedOpportunities[i]][
              "link_status_name"
            ] == "Do not contact"
          ) {
            status = "Opt-out";
          }

          if (
            this.opportunities.list[this.checkedOpportunities[i]][
              "link_status_name"
            ] == "Positive"
          ) {
            status = "OLIVER OFF";
          }

          this.listOpportunities.push({
            Company:
              this.opportunities.list[this.checkedOpportunities[i]][
                "business_name"
              ],
            "Company Size": this.getSalaries(
              this.opportunities.list[this.checkedOpportunities[i]]["salaries"]
            ),
            Score:
              this.opportunities.list[this.checkedOpportunities[i]]["score"],
            Phone:
              this.opportunities.list[this.checkedOpportunities[i]][
                "business_phone"
              ],
            Address:
              this.opportunities.list[this.checkedOpportunities[i]][
                "business_address"
              ],
            "Last Activity":
              this.opportunities.list[this.checkedOpportunities[i]][
                "last_activity"
              ],
            /*Category: this.opportunities.list[this.checkedOpportunities[i]][
              "category_name"
            ],*/
            Status: status,
            Campaign:
              this.opportunities.list[this.checkedOpportunities[i]][
                "campaign_name"
              ],
            Tags: tags,
          });
        }
        this.$store.state.opportunities.loading = false;

        this.unparsedResults = this.$papa.unparse(this.listOpportunities, {
          delimiter: ";",
        });
        this.$papa.download(this.unparsedResults, "SelectedData");
      } else {
        alert("No hay datos seleccionados para exportar!");
        return true;
      }
    },
    async allDataCSV() {
      this.$store.state.opportunities.loading = true;
      const response = await opportunitiesService
        .getDataToCsv(this.filtersSystem)
        .then((result) => {
          this.listOpportunities = [];

          for (let i = 0; i < result.list.length; i++) {
            let tags = [];
            let status = "";
            if (result.list[i]["tags"] != null) {
              for (let l = 0; l < result.list[i]["tags"].length; l++) {
                tags.push(result.list[i]["tags"][l]["name"]);
              }
            }
            if (result.list[i]["link_status_name"] == "Created") {
              status = "OLIVER ON";
            }

            if (result.list[i]["link_status_name"] == "Do not contact") {
              status = "Opt-out";
            }

            if (result.list[i]["link_status_name"] == "Positive") {
              status = "OLIVER OFF";
            }

            this.listOpportunities.push({
              Company: result.list[i]["business_name"],
              Phone: result.list[i]["business_phone"],
              Address: result.list[i]["business_address"],
              "Company Size": this.getSalaries(result.list[i]["salaries"]),
              Score: result.list[i]["score"],
              "Last Activity": result.list[i]["last_activity"],
              //Category: result.list[i]["category_name"],
              Status: status,
              Campaign: result.list[i]["campaign_name"],
              Tags: tags,
            });
          }
          this.$store.state.opportunities.loading = false;
        });

      this.unparsedResults = this.$papa.unparse(this.listOpportunities, {
        delimiter: ";",
      });
      this.$papa.download(this.unparsedResults, "AllData");
    },
  },
};
</script>
<style>
.dropdown-menu.dropdown-menu-lg-left.scrolled-div.show,
.dropdown-menu.dropdown-menu-right.scrolled-div.show {
  position: absolute;
  left: -50px;
  top: 40px;
  max-width: 600px;
}

.min-width-table {
  min-width: 1300px;
}
.dropdown-menu.dropdown-menu-right.scrolled-div.show {
  left: initial;
}
.breadcrumb {
  margin-bottom: 0px !important;
}
.opp-logo,
img.bg-secondary.d-block.imgmain.contact-logo {
  max-width: 100px;
}
.icon-bg-circle {
  background-color: #bababa;
  padding: 3px 3px;
  color: #ffff;
  border-radius: 50%;
  position: absolute;
  top: 0;
  left: 0;
}
.icon-on-click {
  background-color: #3f48cc;
}
.icon-on-email {
  background-color: #ff1bbf;
}

.lead__score {
  width: 65px;
  height: 6px;
  display: flex;
  justify-content: space-between;
  background: linear-gradient(90deg, #64bdff, #ff64ff);
  border-radius: 0.2rem;
}
.lead__score__item {
  width: 100%;
  height: 100%;
  border-right: 2px solid #fff;
  background: #d8ebfa;
}
.lead__score__item--active {
  background: transparent;
}
.icon-on-popup {
  background-color: #3fcc91;
}
.opp-blur {
  z-index: 20;
  position: absolute;
  display: block;
  width: 100%;
  height: 100%;

  left: 0;
  top: 0;
  right: 0;
  bottom: 0;

  filter: blur(3px);
  -webkit-filter: blur(3px);
  -moz-filter: blur(3px);
  -o-filter: blur(3px);
  -ms-filter: blur(3px);
}
.opp-blur + div.opp .table.table-hover {
  filter: blur(3px);
  -webkit-filter: blur(3px);
  -moz-filter: blur(3px);
  -o-filter: blur(3px);
  -ms-filter: blur(3px);
}
.opportunitiesList .wrappList {
  position: relative;
  z-index: 0;
}
.multiselect * {
  font-size: 10px;
}
.multiselect__placeholder {
  font-size: 10px;
}
.multiselect__tag-icon {
  width: 30px !important;
  line-height: 18px !important;
}

.customOptions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.mailDetail {
  margin-left: clamp(350px, 25%, 500px) !important;
  width: 100%;
}
.expandedlist {
  width: 24% !important;
  min-width: 365px;
}
@media screen and (max-width: 990px) {
  .expandedlist {
    display: none !important;
  }
  .mailDetail {
    margin-left: unset !important;
  }
}

@media (min-width: 991px) and (max-width: 1650px) {
  .opp-type.btn-sm {
    font-size: 0.6rem;
  }
}
@media (min-width: 1651px) and (max-width: 1750px) {
  .opp-type.btn-sm {
    font-size: 0.7rem;
  }
}

.mw-70 {
  max-width: 70%;
}
.opp-listtype {
  position: relative;
}
.opp-listtype .notif {
  right: -19px;
  top: -12px;
  font-size: 70%;
  color: white !important;
}
</style>