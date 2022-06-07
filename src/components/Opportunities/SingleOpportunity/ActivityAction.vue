<template>
  <div class="tab-pane fade" id="pill-activity" role="tabpanel" aria-labelledby="pills-tab-notes">
    <div class="wrapperCard">
      <div class="p-3">
        <div class="mt-3" >
          <button
            class="btnActivity"
            :class="isPhoneCallSelected ? 'active' : ''"
            @click="changeEventId('1')"
            v-if="false"
          >
            <span class="icon-phone_in_talk"></span>
          </button>
          <button
            class="btnActivity"
            :class="isAppointmentSelected ? 'active' : ''"
            @click="changeEventId('2')"
            v-if="false"
          >
            <span class="icon-clock"></span>
          </button>
        </div>
        <form action class="formActivity mt-3">
          <div class="form-row">
            <div class="form-group col-md-6">
              <label for="inputEmail4">{{ $t('lang.label.day') }}</label>
              <date-picker v-model="day" :config="configs.day" v-bind:placeholder="$t('lang.label.clickheretosetday')"></date-picker>
            </div>
            <div class="form-group col-md-6">
              <label for="inputPassword4">{{ $t('lang.label.hour') }}</label>
              <date-picker
                v-model="hour"
                :config="configs.hour"
                v-bind:placeholder="$t('lang.label.clickheretosethour')"
              ></date-picker>
            </div>
          </div>
          <div class="form-group">
            <textarea
              class="form-control mt-3"
              v-bind:placeholder="$t('lang.label.comment')"
              id="exampleFormControlTextarea1"
              rows="3"
              v-model="remark"
            ></textarea>
          </div>
        </form>
        <div class="float-right pb-3">
          <button
            class="btn btn-primary themed-button ml-1"
            :disabled="!canSave"
            @click.once="createEvent"
          >{{ $t('lang.button.save') }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { linksService } from "@/_services";
import { mapActions } from "vuex";
import moment from "moment";

export default {
  data() {
    return {
      eventId: "1",
      day: null,
      hour: "9:00 AM",
      remark: "",
      configs: {
        day: {
          format: "DD-MM-YYYY",
          useCurrent: false,
          minDate: moment().startOf("day")
        },
        hour: {
          format: "LT",
          useCurrent: false
        }
      }
    };
  },

  props: {
    linkId: String
  },

  computed: {
    isPhoneCallSelected() {
      return this.eventId === "1";
    },

    isAppointmentSelected() {
      return this.eventId === "2";
    },

    canSave() {
      return this.remark != "" && this.day != null && this.hour != null;
    }
  },

  created(){
     this.eventId = 2;
  },

  methods: {
    ...mapActions("opportunities", {
      reloadOpportunity: "reloadOpportunity",
      getPriorityopportunity: "getPriority",
      resetPriorityopportunity: "resetPriority"
    }),

    ...mapActions("header", {
      changeHeaderTab: "changeTab"
    }),

    changeEventId(activity) {
      this.eventId = activity;
    },

    createEvent() {
      const eventDate = this.createEventDate(
        this.day,
        this.formatTime(this.hour)
      );
      linksService
        .createEvent(this.linkId, this.eventId, this.remark, eventDate)
        .then(event => {
          this.reloadOpportunity({ headerTab: "NOTHING" })
        });
    },

    createEventDate(day, hour) {
      var dayArray = day.split(/-|\s|:/);
      return `${dayArray[2]}-${dayArray[1]}-${dayArray[0]} ${hour}`;
    },

    formatTime(time) {
      var hours = Number(time.match(/^(\d+)/)[1]);
      var minutes = Number(time.match(/:(\d+)/)[1]);
      var AMPM = time.match(/\s(.*)$/)[1];
      if (AMPM == "PM" && hours < 12) hours = hours + 12;
      if (AMPM == "AM" && hours == 12) hours = hours - 12;
      var sHours = hours.toString();
      var sMinutes = minutes.toString();
      if (hours < 10) sHours = "0" + sHours;
      if (minutes < 10) sMinutes = "0" + sMinutes;
      return `${sHours}:${sMinutes}:00`;
    }
  }
};
</script>