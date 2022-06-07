<template>
<section>
	<div>
		
	<span v-if="!okstat"
		        class="loadingres mr-2 ml-2 spinner-border loading-spinner"></span>

	<span v-if="okstat && list.length == 0">No users</span>
	
	<div v-if="okstat && list.length > 0" class="accordion" :id="'accordionlocation'+list[0].id">
		<div  class="p-2 bg-light w-100 align-left " type="button" data-toggle="collapse" :data-target="'#collapseLocation'+list[0].id" aria-expanded="false" 
                :aria-controls="'collapseLocation'+list[0].id">
			<h6 v-if="okstat">{{list[0].client}}
			<span><i class="icon-credit-card" :class="list[0].pmc_id == null ? 'badge-danger': 'badge-success'"></i></span>
			</h6>

		<table class=" w-100">
		<thead>
		<tr>
		<td>Group Viewer</td>
		<td>Email Sync</td>
		<td>Calendly Sync</td>
		<td>Campaigns</td>
		<td>Emails Objective</td>
		<td>Total contacts</td>
		<td>Deliverability</td>
		<td>Opening</td>
		<td>Appointments</td>
		<td>Av. day</td>
		<td>Valid</td>
		<td>No show</td>
		<td>Canceled</td>
		</tr>
		</thead>
		<tbody>
		<tr>
			<td>
			<small v-if="!total_viewer" class="text-success">
		   	<i class="icon-checkmark mr-1" 
		   		 ></i>
		   	</small>
			<small v-if="total_viewer" class="badge badge-danger">
		   	<i class="icon-eye mr-1" 
		   		 ></i>{{total_viewer}}
		   	</small>
		   	</td>
			<td>
			<small v-if="total_nylas" class="badge badge-danger mr-1">
		   	<i class="icon-unlink mr-1" 
		   		 ></i>{{total_nylas}}
		   	</small>
			<small v-if="!total_nylas" class="text-success">
		   	<i class="icon-checkmark mr-1" 
		   		 ></i>
		   	</small></td>
			<td><small v-if="total_calendly" class="badge badge-danger mr-1">
		   	<i class="icon-calendar mr-1" 
		   		 ></i>{{total_calendly}}
		   	</small>
			<small v-if="!total_calendly" class="text-success">
		   	<i class="icon-checkmark mr-1" 
		   		 ></i>
		   	</small></td>
			<td><small v-if="total_campaign" class="badge badge-danger mr-1">
		   	<i class="icon-group mr-1" 
		   		 ></i>{{total_campaign}}
		   	</small>
			<small v-if="!total_campaign" class="text-success">
		   	<i class="icon-checkmark mr-1" 
		   		 ></i>
		   	</small></td>
			<td><small v-if="total_danger_sent" class="badge badge-danger mr-1">
		   	<i class="icon-email mr-1" 
		   		 ></i>{{total_danger_sent}}
		   	</small>
			<small v-if="!total_danger_sent" class="text-success">
		   	<i class="icon-checkmark mr-1" 
		   		 ></i>
		   	</small></td>
			<td>
          	{{total_contacts}}</td>
			<td>
				<span v-if="lines > 0" class="bg-primary rounded text-white p-1">{{(total_deliv/lines).toFixed(2)}}%</span>
				<strong class="badge badge-secondary" v-else> No campaigns </strong>
			</td>
			<td>
				<span v-if="lines > 0" class="bg-primary rounded text-white p-1">{{(total_opening/lines).toFixed(2)}}%</span>
				<strong class="badge badge-secondary" v-else> No campaigns </strong>
			</td>
			<td>
				<span v-if="lines > 0" class="bg-primary rounded text-white p-1">{{(total_apoint/lines).toFixed(2)}}%</span>
				<strong class="badge badge-secondary" v-else> No campaigns </strong>
			</td>
			<td><span class="bg-secondary rounded text-white p-1">{{total_av.toFixed(2)}}</span></td>
			<td><span class="bg-success rounded text-white p-1">{{total_meeting_valid - total_meeting_absent - total_meeting_canceled}}</span></td>
			<td><span v-if="total_meeting_absent" class="bg-warning rounded text-white p-1">{{total_meeting_absent}}</span></td>
			<td><span  v-if="total_meeting_canceled" class="bg-danger rounded text-white p-1">{{total_meeting_canceled}}</span></td>

		</tr>
		</tbody>
		</table>
		</div>
	 <div v-if="okstat" :id="'collapseLocation'+list[0].id" class="collapse overflow-auto" 
            :aria-labelledby="'collapseLocation'" :data-parent="'#accordionlocation'+list[0].id">

		<table id="mytable" class="noselect w-100 table table-hover bg-white">
		<thead>
		<tr>
		<th>Client</th>
		<th>Name</th>
		<th>Role</th>
		<th>User</th>
		<th>Group</th>
		<th>Group Viewer</th>
		<th>Email Sync</th>
		<th>Calendly Sync</th>
		<th>Campaigns</th>
		<th>Emails Objective</th>
		<th>Total contacts</th>
		<th>Deliverability</th>
		<th>Opening</th>
		<th>Appointments</th>
		<th>Av. day</th>
		<th>Valid</th>
		<th>No show</th>
		<th>Canceled</th>
		</tr>
		</thead>
		<tbody>
		<tr v-for="row in list" class="overflow-auto"> 
		<td class="overflowhide">{{row.client}}</td> 
		<td class="overflowhide">{{row.name}} {{row.lastname}}</td> 
		<td class="overflowhide">{{teamRole(row.team_role_id)}}</td> 
		<td class="overflowhide">
		<a target="_blank" :href="'/users/'+list[0].id" class="text-primary">{{row.email}}</a></td> 
		<td class="overflowhide">{{row.team}}</td> 
		<td class="overflowhide"><i v-if="!row.team_viewer" class="icon-warning text-warning"></i> {{row.team_viewer}}</td> 
		<td class="overflowhide"><i v-if="row.activated == '' || row.activated == '0'" class="icon-warning text-warning"></i> {{row.nylas}}</td> 
		<td class="overflowhide"><ItemMonitor :type="'calendly'" :ref="row.id" :user_id="row.id"></ItemMonitor></td> 
		<td class="overflowhide"><ItemMonitor v-if="stats[row.id] !== undefined"  :stats="stats" :type="'campaigns'" :ref="row.id" :user_id="row.id"></ItemMonitor></td>
		<td class="overflowhide"><ItemMonitor v-if="okstat && stats[row.id] !== undefined" :stats="stats" :type="'emailsent'" :ref="row.id" :user_id="row.id"></ItemMonitor></td>
		<td class="overflowhide"><ItemMonitor v-if="okstat && stats[row.id] !== undefined" :stats="stats" :type="'stats'" :ref="row.id" :user_id="row.id"></ItemMonitor></td>
		<td class="overflowhide"><ItemMonitor v-if="okstat && stats[row.id] !== undefined" :stats="stats" :type="'deliverability'" :ref="row.id" :user_id="row.id"></ItemMonitor></td>
		<td class="overflowhide"><ItemMonitor v-if="okstat && stats[row.id] !== undefined" :stats="stats" :type="'emailsopen'" :ref="row.id" :user_id="row.id"></ItemMonitor></td>
		<td class="overflowhide"><ItemMonitor v-if="okstat && stats[row.id] !== undefined" :stats="stats" :type="'events'" :ref="row.id" :user_id="row.id"></ItemMonitor></td>
		<td class="overflowhide"><ItemMonitor v-if="okstat && stats[row.id] !== undefined" :stats="stats" :type="'avday'" :ref="row.id" :user_id="row.id"></ItemMonitor></td>
		<td class="overflowhide"><ItemMonitor v-if="okstat && stats[row.id] !== undefined" :stats="stats" :type="'valid'" :ref="row.id" :user_id="row.id"></ItemMonitor></td>
		<td class="overflowhide"><ItemMonitor v-if="okstat && stats[row.id] !== undefined" :stats="stats" :type="'absent'" :ref="row.id" :user_id="row.id"></ItemMonitor></td>
		<td class="overflowhide"><ItemMonitor v-if="okstat && stats[row.id] !== undefined" :stats="stats" :type="'canceled'" :ref="row.id" :user_id="row.id"></ItemMonitor></td>
		</tr>
		</tbody>
		</table>
	</div>
	</div>
	</div>
   </section>
</template>
<script>
import { usersService,monitorService } from "@/_services";
import { mapState,mapMutations  } from "vuex";
import ItemMonitor from "@/components/Dashboard/Monitor/row.vue";
export default {  
    data() {
        return {
          	list: Array,
          	stats: [],
          	okstat: false,
          	total_danger_sent:0,
          	total_warning_sent:0,
          	total_calendly:0,
          	total_campaign:0,
          	total_viewer:0,
          	total_nylas:0,
          	total_contacts:0,
          	total_deliv:0,
          	total_opening:0,
          	total_apoint:0,
          	total_av:0,
          	total_meeting_valid:0,
          	total_meeting_absent:0,
          	total_meeting_canceled:0,
          	lines:0
        };
    },
    props:{
        team_id:String
    },
	created(){
        monitorService.getMonitorList(this.team_id).then(result => {
        	this.list = result
			if(result.length == 0){
				this.okstat=true
			}else{
				this.loadMonitors(result)
			}
        
        })
    },
	components: {
	  ItemMonitor
	},
	methods: {
		loadMonitors(result){
			let cantstats
			cantstats=0
			result.forEach(result => {
				monitorService.getMonitorUser(result.id,'stats').then(result2 => {
					this.stats[result.id] = result2
					cantstats++
					if(cantstats >= this.list.length){
						this.loadTotals()
					}
				}).then(r => {
					this.okstat=true
					this.$forceUpdate()
				})
			})
		},
		loadTotals(){
				this.totalDangerSent()
				this.totalViewer()
				this.totalNylas()
				this.totalCalendly()

			
		},
	    teamRole(role_id){
	    	let roles = role_id.split(",")
	    	let r = ""
	    	roles.forEach(role_id => {
		    	if(role_id == 1){
		    		r = r + " Member"
		    	}
		    	if(role_id == 2){
		    		r = r + " Admin"
		    	}
		    	if(role_id == 3){
		    		r = r + " Viewer"
		    	}
	    	})
	    	return r;
	    },
	    
	    totalDangerSent(){
	    	this.stats.forEach(result => {

	    		if(
	    		(result !== undefined && result.campaigns !== undefined && result.campaigns[0] !== undefined) 
	    		 
	    		) {
	    			this.lines++
	    		

	    		if(result.emails_per_day_total.danger){
	    			this.total_danger_sent = this.total_danger_sent+result.emails_per_day_total.danger
	    		}
	    		if(result.emails_per_day_total.warning){
	    			this.total_warning_sent = this.total_warning_sent+result.emails_per_day_total.warning
	    		}
	    		
				let totc = Object.entries(result.available_contacts) 
				let quantity_per_day = Object.entries(result.quantity_per_day) 
				let workflow = Object.entries(result.workflow) 

				totc.forEach((res,key) => {
					if(res[1] <= 50 && quantity_per_day[key][1] > 0
					&& workflow[key][1] == 0){
						this.total_campaign++
					}
				})


	    		this.total_contacts= this.total_contacts + result.emails_sent_b
	    		if(result.deliverability){
	    			this.total_deliv= this.total_deliv + result.deliverability
	    		}

	    		let percentage = this.getPercentage(result.emails_opened,result.emails_sent_b);
	    		if(percentage > 0){
	    			this.total_opening = parseFloat(this.total_opening) + percentage
				}


	    		percentage = this.getPercentage(result.events,result.emails_sent_b)
	    		if(percentage > 0){
	    			this.total_apoint= parseFloat(this.total_apoint) + percentage
				}

	    		this.total_meeting_valid = this.total_meeting_valid + parseInt(result.events)
	          	this.total_meeting_absent = this.total_meeting_absent + parseInt(result.absent)
	          	this.total_meeting_canceled = this.total_meeting_canceled + parseInt(result.canceled)

	          	this.total_av = parseFloat(this.total_av) + parseFloat(result.avday)

				}

	    	})
	    },
	    getPercentage(cant, total){
          if(total == 0 && cant == 0){
            return parseFloat(0);
          }

          var result=(cant*100)/total;


          result = parseFloat(result)


          return result
        },
	    totalCalendly(){
	    	this.list.forEach(result => {
	    		if(!result.calendly){
	    			this.total_calendly++
	    		}
	    	})
	    },
	    totalNylas(){
	    	this.list.forEach(result => {
	    		if(result.activated == "0" || result.activated == ""){
	    			this.total_nylas++
	    		}
	    	})
	    },
	    totalViewer(){
	    	this.list.forEach(result => {
	    		if(!result.team_viewer){
	    			this.total_viewer++
	    		}
	    	})
	    }
	}
}
</script>