<template>
   <div>


 <i v-if="type == 'calendly' && !calendly" class="icon-calendar text-danger"></i>
   <span v-if="calendly">{{calendly}}</span>
   <div v-if="stats !== undefined">
   <span v-if="type == 'stats'">{{stats[user_id].emails_sent_b}}</span>
   
   <div 
    v-for="(available_contacts,key) in stats[user_id].available_contacts" 
    v-if="type == 'campaigns' && stats[user_id].available_contacts !== undefined">
   <a target="_blank" :href="getCampaignSearch(stats[user_id].campaign_names[key])">
   <span :class="getClassAvailable(available_contacts,stats[user_id].quantity_per_day[key],stats[user_id].workflow[key])"  class="badge" >

   {{stats[user_id].campaign_names[key]}} 
   <i class="icon-checkmark ml-1"></i>
   {{available_contacts}}
   <i class="icon-search ml-1"></i>
   {{stats[user_id].visible_contacts[key]}}
   </span>
   </a>
   </div>

   <div v-for="(campaign,key) in stats[user_id].emails_per_day" 
   v-if="type == 'emailsent'"   >
   <a target="_blank" :href="getCampaignSearch(stats[user_id].campaign_names[key])">
   <span :class="getClassSent(campaign,stats[user_id].quantity_per_day[key],stats[user_id].available_contacts[key])"  class="badge" >

   {{stats[user_id].campaign_names[key]}} 

   <i class="icon-email ml-1"></i>  
   {{stats[user_id].new_emails_sent_today[key]}} 
   <i class="icon-refresh ml-1"></i>
   {{stats[user_id].recurring_emails_sent_today[key]}}
   </span>
   </a>
   

   </div>
   

   <span class="bg-primary rounded text-white p-1" v-if="type == 'deliverability'">{{parseFloat(stats[user_id].deliverability).toFixed(2)}}% 
   </span>

   <span v-if="type == 'statsnow'">
   <i class="icon-send text-success"></i>{{stats[user_id].emails_sent}},
   <i class="icon-close text-danger"></i>{{stats[user_id].bounce_total}},
   <i class="icon-eye text-primary"></i>{{stats[user_id].emails_opened}}
   </span>

    <span  class="bg-primary rounded text-white p-1" v-if="type == 'emailsopen'">{{getPercentage(stats[user_id].emails_opened,stats[user_id].emails_sent_b)}}</span>


    <span  class="bg-secondary rounded text-white p-1"  v-if="type == 'avday'">{{parseFloat(stats[user_id].avday).toFixed(2)}}</span>

    <span  class="bg-primary rounded text-white p-1" v-if="type == 'events'">{{getPercentage(stats[user_id].events,stats[user_id].emails_sent_b)}}</span>

    <span v-if="type == 'valid'"
        class="bg-success text-white p-1 rounded">{{stats[user_id].events - stats[user_id].absent - stats[user_id].canceled}}</span>



    <span v-if="type == 'absent' && stats[user_id].absent > 0" class="bg-warning text-white p-1 rounded">{{stats[user_id].absent}}</span>
    <span v-if="type == 'canceled' && stats[user_id].canceled > 0" class="bg-danger text-white p-1 rounded">{{stats[user_id].canceled}}</span>
    </div>


   </div>
</template>
<script>
import { mapState,mapMutations  } from "vuex";
import { monitorService,usersService } from "@/_services";
export default {
    created(){
      if(this.type == 'calendly'){
            this.getCalendly()
       }
        if(this.stats !== undefined && this.stats[this.user_id] !== undefined){
            this.result = this.stats[this.user_id].campaigns[0];
        }
    },
    props:{
        user_id: String,
        type: String,
        stats: Array
    },
    data() {
        return {
            result: Array,
            calendly: false
        };
    },
    methods:{
        getCalendly() {
          usersService.getCalendly(this.user_id).then((result) => {
              this.calendly = result.name
            });
        },
        getClassAvailable(cant,per_day,workflow){

            if(per_day == 0){
              return "badge badge-secondary text-white rounded"
            }

            if(cant <= 0 && !workflow){
                return "badge badge-danger text-white rounded"
            }

            if(cant <= 0 && workflow){
                return "badge badge-warning text-white rounded"
            }
                return "badge badge-success text-white rounded"
        },
        getCampaignSearch(campaign_name){

            return 'campaigns/filter/{ "filters": { "type": "and", "sort": "", "dir": "", "predicates": [ { "id": 1637054526, "name": "and", "type": "and", "label": "and", "field": "and", "list": "", "value": "", "comparison": "", "onHover": false, "canCreateGroup": false, "canAddFilter": false, "predicates": [ { "id": 1637054526, "name": "Campaign Name", "type": "string", "field": "campaign.name", "label": "Countains", "value": "'+campaign_name+'", "comparison": "contains", "onHover": false, "canCreateGroup": false, "canAddFilter": false, "predicates": [] } ] } ] }, "oldQuery": " (contains)'+campaign_name+' " }'

        },
        getClassSent(num,per_day,available_contacts){
           if(per_day == 0){
              return "badge-secondary"
            }
            if(num == 'danger' && available_contacts == 0){
              return "badge-secondary"
            }

            return "badge-"+num
        },
        getPercentage(cant, total){


          if(total == 0 && cant == 0){
            return "0%";
          }

            var result=(cant*100)/total;
            result= (parseFloat(result).toFixed(2))
            return result+"%"
          
        },
    }
}
</script>
