<template>
  <div class="mt-3">
    <div class="text-center mt-1 pr-2">
      <span>{{ $t("lang.label.planned") }}</span>
    </div>
    <div class="wTimeLine mt-4">
      <ul>
        <div class="card ml-4 p-2" v-if="isCommingTimelineEmpty">
          <span>{{ $t("lang.label.nothingplannedatthemoment") }}</span>
        </div>

        <li
          class="activityLine border-left"
          v-for="(item, index) in timelineComming"
          :key="`${index}-comming`"
        >
          <span class="iconline" :class="timelineIcon(item)"> </span>
          <div class="card ml-3 p-2" v-if="!isType(item, 'activity')">
            <div class="d-flex">
              <small
                class="font-weight-bold"
                v-if="item.type != 'emailscheduled' && item.event_id != 3"
                >{{ item.name }} {{ $t("lang.label.createdanevent") }} ({{
                  calcSpanDate(item.event_date)
                }}) :
              </small>

              <div
                class="cursor-pointer"
                v-if="item.type == 'emailscheduled'"
                @click="openItem(item.id)"
              >
                <small v-if="!isOpenItem(item)" class="mr-2 text-primary"
                  ><i class="icon-plus"></i> {{ $t("lang.label.open") }}</small
                >
                <small v-if="isOpenItem(item)" class="mr-2 text-danger"
                  ><i class="icon-plus"></i>
                  {{ $t("lang.button.close") }}</small
                >
                <small class="font-weight-bold">
                  {{
                    $t(
                      "lang.label.oliversupcomingactiontheengagedprospectsofthiscompanywillberelaunchedon"
                    )
                  }}
                  {{ calcSpanDate(item.event_date) }} :
                </small>
              </div>
              <div class="font-weight-bold" v-if="isType(item, 'comment')">
                {{ $t("lang.label.leftanote") }} :
              </div>
            </div>

            <div
              class="d-flex justify-content-between mt-2"
              v-if="item.event_id != 3"
            >
              <pre
                class="text-muted"
                v-html="getEmail(item.comment)"
                v-if="isType(item, 'event')"
              ></pre>
              <pre
                class="text-muted"
                v-html="getEmail(item.comment)"
                v-else-if="
                  isOpenItem(item) && isType(item, 'emailscheduled')
                "
              ></pre>
              <pre
                class="text-muted"
                v-html="getEmail(item.comment)"
                v-else-if="!isType(item, 'emailscheduled')"
              ></pre>
            </div>
            <CalendlyEvent :id="item.comment" v-if="item.event_id == 3">
            </CalendlyEvent>

            <div class="">
              <small class="float-right cdarkgray" v-if="item.creation_date">
                {{ calcSpanDate(item.creation_date) }}</small
              >
            </div>
          </div>
        </li>

        <li
          class="activityLine"
          :class="!isCommingTimelineEmpty ? '' : ''"
          v-if="!isPassedTimelineEmpty"
        >
          <div class="text-center mt-4 pr-2">
            <span>{{ $t("lang.label.done") }}</span>
          </div>
        </li>

        <li
          class="cursor-pointer activityLine border-left pb-4"
          v-for="(item, index) in timelineRecent"
          :key="`${index}-passed`"
        >
          <span class="iconline icon-one-finger-tap"></span>
          <div class="card ml-3 p-2">
            <div>
              <img
                width="20px"
                height="20px"
                :src="getBusinessPhoto(item.photo)"
                class="rounded-circle mr-2 border-2 border border-success"
              />
              <small
                ><strong> {{ item.name }} </strong> ({{ item.email }})</small
              >
              <span class="badge badge-success ml-2 text-white">{{
                $t("lang.timeline.recentonline")
              }}</span>

              <small class="float-right"
                ><span class="icon-clock" :title="$t('lang.label.sessionduration')"></span
                >{{ calcSpanDate(item.creation_date) }}</small
              >
            </div>
          </div>
        </li>

        <li
          v-if="status.name == 'Do not contact'"
          class="activityLine border-left pb-4"
        >
          <span class="iconline icon-warning"></span>
          <div class="ml-3">
            <div class="alert alert-danger" role="alert">
              Bonjour, un des membres de l’organisation a indiqué qu’il ne
              souhaitait plus être contacté dans le cadre de cette campagne. Les
              emails prévus pour ce contact ont été annulés
            </div>
          </div>
        </li>

        <li
          class="cursor-pointer activityLine border-left pb-4"
          v-for="(item, index) in timelinePassed"
          :key="`${index}-passed2`"
        >
          <span
            class="iconline"
            :class="timelineIcon(item)"
            @click="openItem(item.id)"
          ></span>
          <div v-if="item.link == 'createdopportunity'">
            <div class="card ml-3 p-2">
              <strong>{{ $t("lang.label.opportunitywascreated") }}</strong>
              <p>
                <strong>{{ item.name | formatContactName(item.email) }}</strong>
                {{ $t("lang.label.hasopenedthedemolink") }}
              </p>
              <p>
                {{
                  $t(
                    "lang.label.theopportunitywascreatedandaddedtoyourcompanysaccount"
                  )
                }}
              </p>
              <small class="float-right cdarkgray">
                {{ calcSpanDate(item.creation_date) }}</small
              >
            </div>
          </div>

          <div v-else>
            <div
              class="card ml-3 p-2 pt-0"
              v-if="isType(item, 'activity')"
              @click="openItem(item.id)"
            >
              <div>
                <img
                  width="20px"
                  height="20px"
                  :src="getBusinessPhoto(item.photo)"
                  class="rounded-circle mr-2"
                />
                <small
                  ><strong
                    >{{ $t("lang.label.newsession") }} :
                    {{ item.activities[0].name }}
                  </strong>
                  ({{ item.activities[0].email }})</small
                >
                <small class="float-right"
                  ><span class="icon-clock" title="durée de la session"></span
                  >{{ item.activities[0].comment }}
                </small>
              </div>
              <div>
                <ul>
                  <li
                    class="activityLine border-left dashed pb-2"
                    v-for="(activity, index2) in item.activities"
                    :key="`${index2}-activity`"
                  >
                    <small class="">
                      <span
                        v-if="
                          activity.response_from == 1 ||
                          index2 < item.activities.length - 1
                        "
                        class="icon-one-finger-tap"
                        title="click"
                      ></span>

                      <span
                        v-if="
                          activity.response_from == 0 &&
                          index2 == item.activities.length - 1
                        "
                        class="icon-globe"
                        title="la session a démarré directement depuis le web"
                      ></span>
                      <span
                        v-if="
                          activity.response_from == 1 &&
                          index2 == item.activities.length - 1
                        "
                        class="icon-mail"
                        title="la session a commencé en cliquant sur l'email"
                      ></span>
                      <span v-else class="icon" title="website"></span>
                      <span
                        v-if="
                          activity.link_id &&
                          index2 < item.activities.length - 1
                        "
                        >{{ activity.link_id }} -></span
                      >
                      {{ activity.link }}
                    </small>
                    <small class="float-right cdarkgray">
                      {{ calcSpanDate(activity.event_date) }}</small
                    >
                  </li>
                </ul>
              </div>
            </div>

            <div
              class="card ml-3 p-2 cursor-pointer"
              v-if="!isType(item, 'activity')"
              :class="item.user_id != currentUser.id ? 'bg-light':''"
            >
              <div class="d-block" v-if="item.event_id != 3">
                <small
                  class="font-weight-bold"
                  v-if="isType(item, 'event')"
                  @click="openItem(item.id)"
                >
                  {{ item.name }} {{ $t("lang.label.createdanevent") }} ({{
                    calcSpanDate(item.event_date)
                  }}) :</small
                >
                <small class="font-weight-bold" 
                v-if="isType(item, 'comment')"
                 :class="item.user_id != currentUser.id ? 'text-primary':''"
                  >{{ $t("lang.label.notes") }}  ({{ item.name }}) :</small
                >    
                <small   v-if="isType(item, 'comment')" class="float-right cdarkgray">{{
                  calcSpanDate(item.creation_date)
                }}</small>
              </div>

              <div
                class=""
                v-if="isType(item, 'emailreceived')"
                @click="openItem(item.id)"
              >
                <small v-if="!isOpenItem(item)" class="mr-2 text-primary"
                  ><i class="icon-plus"></i> {{ $t("lang.label.open") }}</small
                >
                <small v-if="isOpenItem(item)" class="mr-2 text-danger"
                  ><i class="icon-plus"></i>
                  {{ $t("lang.button.close") }}</small
                >

                <small class="font-weight-bold">
                  {{ item.name | formatContactName(item.email) }}
                  {{ $t("lang.label.sentyouanemail") }} :
                </small>

                <span
                  v-if="item.is_automatic == '1'"
                  class="badge badge-primary ml-3"
                  >{{ $t("lang.label.autoreply") }}</span
                >

                <span
                  v-if="isMailInBlack(item.comment)"
                  class="badge badge-danger ml-3"
                  >{{ $t("lang.label.antispam") }}</span
                >

                <small class="float-right cdarkgray">{{
                  calcSpanDate(item.creation_date)
                }}</small>
              </div>
              <div
                class="w-100"
                v-if="isType(item, 'emailsent')"
                @click="openItem(item.id)"
              >
                <div class="float-left font-weight-bold">
                  <small v-if="!isOpenItem(item)" class="mr-2 text-primary"
                    ><i class="icon-plus"></i>
                    {{ $t("lang.label.open") }}</small
                  >
                  <small v-if="isOpenItem(item)" class="mr-2 text-danger"
                    ><i class="icon-plus"></i>
                    {{ $t("lang.button.close") }}</small
                  >
                  {{ item.name | formatContactName(item.email) }}
                  {{ $t("lang.label.answeredto") }} {{ item.response_from }}
                </div>
                <div class="float-right">
                  <small class="cdarkgray">{{
                    calcSpanDate(item.creation_date)
                  }}</small>
                </div>
              </div>

              <div
                class=""
                v-if="isType(item, 'emailsentopportunity')"
                @click="openItem(item.id)"
              >
                <small v-if="!isOpenItem(item)" class="mr-2 text-primary"
                  ><i class="icon-plus"></i> {{ $t("lang.label.open") }}</small
                >
                <small v-if="isOpenItem(item)" class="mr-2 text-danger"
                  ><i class="icon-plus"></i>
                  {{ $t("lang.button.close") }}</small
                >
                <small class="font-weight-bold"
                  >{{ item.name | formatContactName(item.email) }}
                  {{ $t("lang.label.sentanemail") }}
                </small>
                <div class="float-right">
                  <small>{{ calcSpanDate(item.creation_date) }}</small>
                </div>
              </div>

              <div
                class=""
                v-if="isType(item, 'emailssent')"
                @click="openItem(item.id)"
              >
                <small v-if="!isOpenItem(item)" class="mr-2 text-primary"
                  ><i class="icon-plus"></i> {{ $t("lang.label.open") }}</small
                >
                <small v-if="isOpenItem(item)" class="mr-2 text-danger"
                  ><i class="icon-plus"></i>
                  {{ $t("lang.button.close") }}</small
                >
                <small class="font-weight-bold"
                  >{{ $t("lang.label.sentto") }} : {{ item.email }}
                </small>
                <small class="cursor-pointer ml-1 mr-2 text-primary"
                  ><i class="icon-eye"></i> {{ item.opendate.length }}
                </small>
                <div id="tooltip" v-if="isOpenItem(item)" class="card p-2">
                  <label
                    >{{ item.opendate.length }}
                    {{ $t("lang.label.views") }}</label
                  >
                  <small
                    class="cdarkgray"
                    v-for="(datemail, index) in item.opendate"
                  >
                    <i class="text-primary icon-envelope-open-o mr-2"></i>
                    <span class="text-primary">{{ item.from[index] }}</span>
                    {{ datemail }}
                  </small>
                </div>
                <img
                  v-for="(photo, index) in item.photo"
                  width="20px"
                  height="20px"
                  :src="getBusinessPhoto(photo)"
                  class="rounded-circle mr-2"
                />
                <small class="float-right cdarkgray">{{
                  calcSpanDate(item.creation_date)
                }}</small>
              </div>

              <div class="small text-muted" v-if="item.response_cc != null && item.response_cc != ''">
                CC: {{ item.response_cc }}
              </div>

              <span class="mt-2" v-if="isEmail(item)" v-html="item.link"></span>

                            <div
                v-if="
                  isOpenItem(item) ||
                  isType(item, 'comment') ||
                  isType(item, 'event')
                "
              >
                <div
                  v-if="
                    isType(item, 'emailsentopportunity') &&
                    item.link_activity_type_id
                  "
                >
                  <a>
                    <span class="badge badge-secondary">
                      {{ attachmentName(item.link_activity_type_id) }}
                    </span>
                  </a>
                </div>
                <CalendlyEvent :id="item.comment" v-if="item.event_id == 3">
                </CalendlyEvent>

                <div
                  class="d-flex justify-content-between mt-2"
                  v-if="item.event_id != 3"
                >
                  <pre
                    class="text-muted"
                    v-html="getEmail(item.comment)"
                    v-if="isType(item, 'event')"
                  ></pre>

                  <iframe
                    v-if="isType(item, 'emailreceived')"
                    class="h-iframe text-muted w-100"
                    :srcdoc="getEmail(item.comment)"
                  >
                  </iframe>

                  <span v-if="isType(item, 'autocomment') && item.comment == 'absentactive'">
                    {{$t('lang.task.absentactive')}}
                  </span>
                  <span v-if="isType(item, 'autocomment') && item.comment == 'cancelrefused'">
                    {{$t('lang.refuse.cancelrefused')}}
                  </span>
                  <span v-if="isType(item, 'autocomment') && item.comment == 'activecanceled'">
                    {{$t('lang.task.activecanceled')}}
                  </span>
                  <span v-if="isType(item, 'autocomment') && item.comment == 'activeabsentyou'">
                    {{ item.name }} {{$t('lang.task.activeabsentyou')}}
                  </span>
                  <span v-if="isType(item, 'autocomment') && item.comment == 'activecanceledyou'">
                    {{ item.name }} {{$t('lang.task.activecanceledyou')}}
                  </span>
                  
                  <pre
                    v-if="
                      isType(item, 'emailssent') ||
                      isType(item, 'emailsent') ||
                      isType(item, 'emailsentopportunity') ||
                      (isType(item, 'comment') && !isType(item, 'autocomment'))
                    "
                    class="text-muted"
                    v-html="$sanitize(getEmail(item.comment))"
                  ></pre>
                </div>

                <div
                  class=""
                  v-if="isType(item, 'emailreceived') && permissionFront()"
                >
                  <button
                    v-if="!item.answer && !blocked()"
                    class="float-left btn btn-sm mt-2 btn-success"
                    @click="switchTextarea(item)"
                  >
                    <span class="icon-reply d-inline"></span
                    >{{ $t("lang.button.answer") }}
                  </button>

                  <button
                    v-if="!item.answer && blocked()"
                    class="float-left btn btn-sm mt-2 btn-secondary"
                    disabled
                  >
                    Oliver ON
                  </button>
                  <replyEmail
                    v-show="isModalVisible"
                    @close="closeModal(item)"
                    :selected="emails[item.id]"
                    :closebtn="true"
                    v-if="item.answer"
                  ></replyEmail>
                </div>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import replyEmail from "@/components/Emails/replyEmail.vue";
import Tooltip from "@/components/Common/Tooltip.vue";
import CalendlyEvent from "@/components/Common/CalendlyEvent.vue";
import { formattersMixin } from "@/_mixins/";

export default {
  data() {
    return {
      tooltip: [],
      isModalVisible: false,
      openitem: [],
    };
  },
  props: {
    timelineComming: Array,
    timelinePassed: Array,
    timelineRecent: Array,
    emails: Array,
    status: Object,
  },

  components: {
    replyEmail,
    Tooltip,
    CalendlyEvent,
  },

  mixins: [formattersMixin],
 
  computed: {
    isCommingTimelineEmpty() {
      return this.timelineComming.length == 0;
    },

    isPassedTimelineEmpty() {
      return this.timelinePassed.length == 0;
    },
    ...mapState({
      currentUser: (state) => state.authentication.user,
    }),
  },

  methods: {
    removeSpace(chain) {
      chain = chain.replace(/\n\s*\n\s*\n/g, "\n");
      return chain.trim();
    },
    openItem(index) {
      if (this.openitem[index] != true) this.openitem[index] = true;
      else this.openitem[index] = false;
      this.$forceUpdate();
    },
    permissionFront() {
      return (
        this.currentUser.team_role_id == undefined ||
        this.currentUser.team_role_id != 3
      );
    },
    isMailInBlack(body) {
      return body.includes(".mailinblack");
    },
    isOpenItem(item) {
      if(item.type == "emailreceived"){
        return true
      }

      return this.openitem[item.id] == true;
    },
    showModal() {
      this.isModalVisible = true;
    },
    closeModal(item) {
      item.answer = 0;
      this.isModalVisible = false;
    },

    blocked() {
      return (
        this.status.name != "Positive" &&
        this.status.name != "Created" &&
        this.status.name != "Working"
      );
    },
    attachmentName(url) {
      let splitUrl = url.split("/");
      return splitUrl[splitUrl.length - 1];
    },

    timelineIcon(item) {
      if (item.type == "emailssent") {
        return "icon-email";
      }
      if (item.type == "emailsent") {
        return "icon-email";
      }

      if (this.isEmail(item)) {
        return "icon-mail";
      }

      if (item.link) {
        return "icon-one-finger-tap";
      } else {
        if (this.isType(item, "event")) {
          if (item.event_id === "1") {
            return "icon-phone-call";
          } else {
            if ((item.event_id == 3)) {
              return "icon-calendar";
            }
            return "icon-clock";
          }
        }
        if (this.isType(item, "comment")) {
          return "icon-comment";
        }
      }
    },
    getEmail(body) {
      if (body == "readerroremail") {
        return this.$t("lang.general.readerroremail");
      }
      return body.replace("<a", '<a target="_blank" ');
    },
    switchTextarea(item) {
      item.answer = "1";
      this.showModal();
    },
    isType(item, type) {
      if(type == 'autocomment' && item.comment == 'absentactive'){
        return true
      }
      if(type == 'autocomment' && item.comment == 'activecanceled'){
        return true
      }
      if(type == 'autocomment' && item.comment == 'activeabsentyou'){
        return true
      }
      if(type == 'autocomment' && item.comment == 'activecanceledyou'){
        return true
      }
      if(type == 'autocomment' && item.comment == 'cancelrefused'){
        return true
      }
      return item.type == type;
    },
    isEmail(item) {
      return (
        item.type == "emailreceived" ||
        item.type == "emailssent" ||
        item.type == "emailscheduled" ||
        item.type == "emailsentopportunity"
      );
    },

    isEmailreceived(item) {
      return item.type == "emailreceived";
    },
    checkName(name) {
      if (name.includes("Generic")) {
        return "Responsble";
      } else {
        return name;
      }
    },

    calcSpanDate(stringDate) {
      // Creo un Date con la fecha enviada como parametro
      var dateArray = stringDate.split(/-|\s|:/);
      var date = new Date(
        dateArray[0],
        dateArray[1] - 1,
        dateArray[2],
        dateArray[3],
        dateArray[4],
        dateArray[5]
      );

      // Creo un Date de ayer, hoy y mañana
      var yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      var today = new Date();
      var tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      // Verifico el dia para ver si es ayer, hoy o mañana, caso contrario devuelvo la fecha
      var processdate;

      if (date.setHours(0, 0, 0, 0) === today.setHours(0, 0, 0, 0)) {
        var processdate = "Today ";
      } else if (date.setHours(0, 0, 0, 0) === tomorrow.setHours(0, 0, 0, 0)) {
        var processdate = "Tomorrow ";
      } else if (date.setHours(0, 0, 0, 0) === yesterday.setHours(0, 0, 0, 0)) {
        var processdate = "Yesterday ";
      } else {
        var processdate = `${dateArray[2]}-${dateArray[1]}-${dateArray[0]}`;
      }

      if (dateArray[3] !== undefined) {
        processdate =
          processdate + " " + `${dateArray[3]}:${dateArray[4]}:${dateArray[5]}`;
      }

      return processdate;
    },
  },
};
</script>
<style>
.h-iframe {
  height: 400px;
}

pre a {
  color: #5155ea !important;
}

pre {
  overflow-x: auto;
  white-space: pre-wrap;
  white-space: -moz-pre-wrap;
  white-space: -pre-wrap;
  white-space: -o-pre-wrap;
  word-wrap: break-word;
  font-family: inherit !important;
}

blockquote {
  max-width: 600px !important;
}
.wTimeLine ul li.activityLine:first-child .card {
  background: #eaeaea;
  border-color: #eaeaea;
}
.wTimeLine ul li.activityLine:first-child .card .text-muted {
  line-height: 1.2;
  margin-top: 20px;
}
.iconline {
  margin-left: -29px;
}
.opportunity .wTimeLine .text-muted.breaknormal {
  white-space: pre-line;
  word-wrap: break-Word;
  line-height: 1.2;
}
</style>