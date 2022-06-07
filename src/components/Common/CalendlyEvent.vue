<template>
  <div class="contact-info">
   <span 
   v-if="loading"
      class="loadingres mr-2 ml-2 spinner-border loading-spinner" 
    ></span>
    <div v-if="event">
        <h6>{{event.name}} <i class="icon-circle" :class="event.status == 'active' ? 'text-success': 'text-danger'"></i></h6> 
        <div>
        <strong class="mr-2">{{event.invitees[0].name}}</strong> <small><i class="icon-calendar"></i> {{event.start_time}}</small>
        </div>
        <div>
        <small>{{event.invitees[0].email}}</small>
        </div>
        <div v-for="question in event.invitees[0].questions_and_answers">
            <small>
              {{question.question}}: {{question.answer}}
            </small>
        </div>
        <div>
        <a :href="event.location.join_url" target="_blank" class="text-primary">
        <small>{{event.location.join_url}}</small></a>
        </div>
    </div>
  </div>
</template>

<script>
import { calendlyService } from "@/_services";
import { mapState, mapActions } from "vuex";

export default {
  data() {
    return {
      event:false,
      loading:true
    };
  },
  props: {
    id: String,
  },
  created() {
    this.getEvent()
  },
  computed: {
    ...mapState({
      opportunity: state => state.opportunities.selected.data,
    }),
  },
  methods: {
    getEvent() {
      calendlyService.getEvent(this.id).then((result) => {
          this.event = result
          this.loading = false
          this.opportunity.link.event = this.event
      })
    },
  }
};
</script>