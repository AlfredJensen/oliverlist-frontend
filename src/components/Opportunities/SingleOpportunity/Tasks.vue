<template>
  <section class="tasks">
      <div v-if="pendingtasks.length > 0" class="card mt-2 p-3">
        <h6>{{ $t('lang.opportunities.tasks') }} <label 
        :class="cantpending > 0 ? 'badge-danger': 'badge-success'"
        class="ease-in-out badge badge-danger">{{ cantpending }}</label>
        </h6>
        <div style="max-height: 300px;overflow-y: scroll;">
          <div v-for="(task, key) in pendingtasks">
            <label :class="donetasks[key] ? 'done':''">
            <input 
            @change="checkDone(key)"
            class="mr-2" 
             v-model="donetasks[key]" 
            type="checkbox" :checked="isDone(key) ? 'checkbox':''">
            <small><strong>{{ getTranslation(task.title) }} : </strong></small>
            <small> {{ getTranslation(task.message) }}</small>
          </label>
          </div>
        </div>
      </div>
  </section>
</template>
<script>
import { notificationService } from "@/_services";
import { formattersMixin } from "@/_mixins/";

export default {

  props: {
    link: Object,
  },
  data () {
    return {
      pendingtasks: [],
      donetasks: [],
      cantpending: 0,
    }     
  },
  mixins: [formattersMixin],
  created() {
    notificationService.getTasks(this.link.link.id).then( result => {
       this.pendingtasks = result
       for(let i=0;i < result.length;i++){
          if(this.pendingtasks[i].notification_status_id == "2"){
            this.donetasks[i] = true
          }else{
            this.cantpending++
          }
       }  
    });
  },
  methods:{
    checkDone(taskid){
      if(this.donetasks[taskid] == true){
        this.pendingtasks[taskid].notification_status_id = "2"
        this.cantpending--
        notificationService.closeTask(this.pendingtasks[taskid].id);

      }else{
        this.pendingtasks[taskid].notification_status_id = "1"
        this.cantpending++
        notificationService.openTask(this.pendingtasks[taskid].id);
      }
      this.$emit("pendingTasks",this.cantpending)
    },
    isDone(taskid){
      return this.pendingtasks[taskid].notification_status_id == "2" 
    } 
  },
 
};
</script>
<style>
.done{
  text-decoration: line-through;
}
</style>