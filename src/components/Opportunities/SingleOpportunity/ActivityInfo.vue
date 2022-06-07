<template>
  <div
    class="tab-pane fade show active"
    id="pills-home"
    role="tabpanel"
    aria-labelledby="pills-home-tab"
  >
    <div class="wrapperCard triangle">
      <div class="card p-3 shadow">
        <div class="d-flex justify-content-between align-items-center">
          <button class="btn btn-sm btn-primary btnBl" @click="openDemo()">
            <span class="icon-play_arrow mr-2"></span>
            DEMO
          </button>
          <div class="ft-2">
            <span class="font-weight-bold">{{ Math.floor(link.score) }}</span>
            <span class="icon-whatshot cred"></span>
          </div>
        </div>
        <ul class="listPourInfo mt-4" v-if="!emptyLinkActivities">
          <li class="pt-2 pb-2">
            <div>
              <span class="icon-fiber_manual_record cblue pr-1"></span>
              <span class="d-inline">Was opened last</span>
            </div>
            <div class="pl-4 date">
              <span class="d-block">{{ calcPassedDaysFromOpenedLast() }} days</span>
              <span class="d-block">{{ getOpenedLast() }}</span>
            </div>
          </li>
        </ul>
        <div class="d-flex mt-4 scrolled-div" v-if="!emptyLinkBusinessContacts">
          <div>
            <span class="icon-email ft-1-5 mr-3"></span>
          </div>
          <ul class="w-100">
            <li
              v-for="(contact, key) in linkBusinessContacts"
              :key="key"
              :class="(key === 0) ? '' : 'mt-2'"
            >
              <div class="d-flex justify-content-between">
                <div>
                  <span>{{ contact.email }}</span>
                  <div class="ml-2 badge badge-success" v-if="isContactManager(contact)">MANAGER</div>
                </div>
                <span class="d-block sent-dates">{{ contact.link_sent_date | formatDate }}</span>
              </div>
            </li>
          </ul>
        </div>
        <div class="d-flex mt-4 scrolled-div" v-if="!emptyLinkActivities">
          <div>
            <span class="icon-monitor ft-1-5 mr-3"></span>
          </div>
          <ul class="w-100">
            <li
              v-for="(activity, key) in linkActivities"
              :key="key"
              :class="(key === 0) ? '' : 'mt-2'"
            >
              <div class="d-flex justify-content-between">
                <span>{{ activity.link }}</span>
                <span
                  class="badge badge-primary badgeQualifier"
                >{{ activity.creation_date | formatDatetime }}</span>
              </div>
            </li>
          </ul>
        </div>
        <div class="d-flex mt-4 scrolled-div" v-if="!emptyLinkBusinessContacts">
          <div>
            <span class="icon-one-finger-tap ft-1-5 mr-3"></span>
          </div>
          <ul class="w-100">
            <li
              v-for="(contact, key) in linkBusinessContacts"
              :key="key"
              :class="(key === 0) ? '' : 'mt-2'"
            >
              <div class="d-flex justify-content-between">
                <span>{{ contact.email }}</span>
                <span
                  class="badge badge-primary badge-pill bg-violet rounded-circle badgeNumber"
                >{{ contact.clicks }}</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    link: Object,
    business: Object,
    linkActivities: Array,
    linkBusinessContacts: Array
  },

  computed: {
    emptyLinkActivities() {
      return this.linkActivities.length == 0;
    },

    emptyLinkBusinessContacts() {
      return this.linkBusinessContacts.length == 0;
    }
  },

  methods: {
    getOpenedLast() {
      return this.$options.filters.formatDate(
        this.linkActivities[this.linkActivities.length - 1].creation_date
      );
    },

    calcSecondsForActivity(key) {
      if (this.linkActivities.length - 1 === key) {
        return "Last entered";
      } else {
        // Creo un Date con la fecha en que se entro al link
        var actTimeArray = this.linkActivities[key].creation_date.split(
          /-|\s|:/
        );
        var activityTime = new Date(
          actTimeArray[0],
          actTimeArray[1] - 1,
          actTimeArray[2],
          actTimeArray[3],
          actTimeArray[4],
          actTimeArray[5]
        );

        // Creo un Date con la fecha en que se entro al link posterior
        var nextActTimeArray = this.linkActivities[key + 1].creation_date.split(
          /-|\s|:/
        );
        var nextActivityTime = new Date(
          nextActTimeArray[0],
          nextActTimeArray[1] - 1,
          nextActTimeArray[2],
          nextActTimeArray[3],
          nextActTimeArray[4],
          nextActTimeArray[5]
        );

        // Guardo la diferencia en tiempo entre fechas
        var difActivitiesTime =
          activityTime.getTime() - nextActivityTime.getTime();

        // Convierto esa diferencia a segundos
        var secondsDifActivitiesTime = difActivitiesTime / 1000;

        // Convierto esos segundos calculandolos entre dias y los devuelvo
        return Math.abs(secondsDifActivitiesTime) + " seconds";
      }
    },

    calcPassedDaysFromOpenedLast(stringDate) {
      var actTimeArray = this.linkActivities[
        this.linkActivities.length - 1
      ].creation_date.split(/-|\s|:/);
      var date = new Date(
        actTimeArray[0],
        actTimeArray[1] - 1,
        actTimeArray[2],
        actTimeArray[3],
        actTimeArray[4],
        actTimeArray[5]
      );

      var today = new Date();

      return Math.round((today - date) / (1000 * 60 * 60 * 24));
    },

    openDemo() {
      var demoUrl = this.link.demo_url + this.business.alias;
      window.open(demoUrl, "_blank");
    },

    isContactManager(contact) {
      return contact.role != null && contact.role.length !== 0;
    }
  }
};
</script>
