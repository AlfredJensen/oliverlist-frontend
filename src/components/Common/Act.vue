<template>
  <div class="row contact-info">
    <span
      v-if="activities.events > 0"
      class="mr-2 position-relative text-success"
      :class="
        getNotification(5) ? 'text-primary font-weight-bold' : ''
      "
    >
      <i class="icon-clock"></i> {{ activities.events }}
    </span>
    <span
      class="mr-2 position-relative"
      :class="
        getNotification(2) ? 'text-danger font-weight-bold' : ''
      "
    >
      <i class="icon-one-finger-tap"></i> {{ activities.activitycant }}
    </span>
    <span
      class="mr-2 position-relative"
      :class="
        getNotification(3) ? ' text-success font-weight-bold' : ''
      "
    >
      <i class="icon-mail"></i>
      {{ activities.emailresponsecant }}
    </span>
    <span
      class="mr-4 position-relative"
      :class="
        getNotification(4) ? 'text-primary font-weight-bold' : ''
      "
    >
      <i class="icon-eye"></i> {{ activities.openemailcant }}
    </span>
    <Tooltip
      text="tasks"
      :width="'auto'"
      v-if="false">
     <span
      class="mr-2 position-relative"
      :class="
        getNotification(9) ? ' text-success font-weight-bold' : ''
      "
    >
      <i class="icon-list"></i>
      {{ activities.tasks }} {{ $t("lang.label.tasks") }}
    </span>
    </Tooltip>
  </div>
</template>

<script>
import { mapActions, mapMutations } from "vuex";
import Tooltip from "@/components/Common/Tooltip.vue";
import { opportunitiesService } from "@/_services";

export default {
  data() {
    return {
      activities: [],
    };
  },
  props: {
    opportunity: Object,
  },
  components: {
    Tooltip
  },
  created() {
    opportunitiesService.getActivityLink(this.opportunity.id).then((result) => {
      this.activities = result;
      this.setOppTasks( {
        link_id: this.opportunity.id,
        tasks: result.tasks,
      });
    });
  },

  methods: {
    ...mapActions("opportunities", {
      setOppTasks: "setTasks"
    }),
    getNotification(id) {
      let color = false;
      switch (id) {
        case 2:
          color = this.activities.activitycant > 0;
          break;
        case 3:
          color = this.activities.emailresponsecant > 0;
          break;
        case 4:
          color = this.activities.openemailcant > 0;
          break;
        case 5:
          color = this.activities.events > 0;
          break;
        case 9:
          color = this.activities.tasks > 0;
          break;
      }
      return (
        color &&
        !this.$store.state.opportunities.clicked[this.opportunity.link_id]
      );
    },
  },
};
</script>