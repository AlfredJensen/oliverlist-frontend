<template>
  <section class="campaign">

    <table class="table table-hover" v-if="showheader && showlist">
    <colgroup span="3"></colgroup>
    <colgroup span="3"></colgroup>
    <tr class="bg-light">
    <td rowspan="3"></td>
    <th colspan="3" scope="colgroup"><h6>{{ $t('lang.label.acquisition') }}</h6></th>
    <th colspan="3" scope="colgroup"><h6>{{ $t('lang.label.behaviour') }}</h6></th>
    </tr>
    <tr class="bg-light">
      <th scope="col">{{ $t('lang.label.users') }}</th>
      <th scope="col">{{ $t('lang.label.newusers') }}</th>
      <th scope="col">{{ $t('lang.label.sessions') }}</th>
      <th scope="col">{{ $t('lang.label.pagessession') }}</th>
      <th scope="col">{{ $t('lang.label.avgsessionduration') }}</th>
      <th scope="col">{{ $t('lang.label.bouncerate') }}</th>
    </tr>
    <tr>
      <td><h4>{{ remove0(headers[1].cant) }} <small class="text-secondary font-weight-light">(100%)</small></h4></td>
      <td><h4>{{ remove0(headers[2].cant) }} <small class="text-secondary font-weight-light">(100%)</small></h4></td>
      <td><h4>{{ remove0(headers[5].cant) }} <small class="text-secondary font-weight-light">(100%)</small></h4></td>
      <td><h4>{{ remove0(headers[3].cant) }}</h4></td>
      <td><h4>{{ seconds(headers[4].cant) }}</h4></td>
      <td><h4>{{ remove0(headers[0].cant) }} %</h4></td>
    </tr>

    
    <tr v-if="tab == 'post'" v-for="(row, key) in rows" :key="key">
      <th class="bg-light" scope="row">{{ row.label }}</th>
      <td>{{ remove0(row.users) }} <small class="text-secondary font-weight-light">({{ getPercentage(headers[1].cant,row.users) }})</small></td>
      <td>{{ remove0(row.users_new) }} <small class="text-secondary font-weight-light">({{ getPercentage(headers[2].cant,row.users_new) }})</small></td>
      <td>{{ remove0(row.sessions) }} <small class="text-secondary font-weight-light">({{ getPercentage(headers[5].cant,row.sessions) }})</small></td>
      <td>{{ remove0(row.session_page) }}</td>
      <td>{{ seconds(row.session_avg) }}</td>
      <td>{{ remove0(row.rebounds) }} %</td>
    </tr>
    
    <tr v-if="tab == 'region'" v-for="(row, key) in rowsregion" :key="key">
      <th class="bg-light" scope="row">{{ row.label }}</th>
      <td>{{ remove0(row.users) }} <small class="text-secondary font-weight-light">({{ getPercentage(headers[1].cant,row.users) }})</small></td>
      <td>{{ remove0(row.users_new) }} <small class="text-secondary font-weight-light">({{ getPercentage(headers[1].cant,row.users) }})</small></td>
      <td>{{ remove0(row.sessions) }} <small class="text-secondary font-weight-light">({{ getPercentage(headers[1].cant,row.users) }})</small></td>
      <td>{{ remove0(row.session_page) }}</td>
      <td>{{ seconds(row.session_avg) }}</td>
      <td>{{ remove0(row.rebounds) }} %</td>
    </tr>
    
    <tr v-if="tab == 'google'" v-for="(row, key) in rowsgoogle" :key="key">
      <th class="bg-light" scope="row">{{ row.label }}</th>
      <td>{{ remove0(row.users) }} <small class="text-secondary font-weight-light">({{ getPercentage(headers[1].cant,row.users) }})</small></td>
      <td>{{ remove0(row.users_new) }} <small class="text-secondary font-weight-light">({{ getPercentage(headers[1].cant,row.users) }})</small></td>
      <td>{{ remove0(row.sessions) }} <small class="text-secondary font-weight-light">({{ getPercentage(headers[1].cant,row.users) }})</small></td>
      <td>{{ remove0(row.session_page) }}</td>
      <td>{{ seconds(row.session_avg) }}</td>
      <td>{{ remove0(row.rebounds) }} %</td>
    </tr>

    </table>
  </section>
</template>
<script>
import { campaignsService } from "@/_services";

export default {

  props: {
    campaignId: String,
    dateFrom: String,
    dateTo: String,
    tab: String,
  },

  data () {
    return {
      showheader: false,
      showlist: false,
      headers:{},
      rows: {},
      rowsregion: {},
      rowsgoogle: {},
    }     
  },

  created() {
     this.showheader = false;
     this.showlist = false;
      campaignsService.getStatistics(this.campaignId,this.dateFrom,this.dateTo).then( result => {
         this.headers = result;
         this.showheader = true;
      });
      campaignsService.getStatisticsByFilter(this.campaignId,'post',this.dateFrom,this.dateTo).then( result => {
         this.rows = result;
         this.showlist = true;
      });

      campaignsService.getStatisticsByFilter(this.campaignId,'region',this.dateFrom,this.dateTo).then( result => {
         this.rowsregion = result;
      });

      campaignsService.getStatisticsByFilter(this.campaignId,'google',this.dateFrom,this.dateTo).then( result => {
         this.rowsgoogle = result;
      });

    this.tab = 'post'
  },

  methods:{
    remove0(num){
      if(num != null)
        return num.replace('.00','');
    },
    getPercentage(cant, total){
      if(total == 0){
        return "-%"
      }else{
        var result=(cant*100)/total;
        result= (parseFloat(result).toFixed(0))
        return result+"%"
      }
    },
    seconds(num){
      let seconds = Math.round(num);
      if(seconds < 10){
        return "00:00:0"+seconds;
      }
      if(seconds < 60){
        return "00:00:"+seconds;
      }

      let minutes = Math.round(seconds/60);

      seconds = seconds - (minutes*60)

      if(seconds < 10 && seconds >= 0)
        seconds = "0"+seconds
      
      if(seconds < 0)
        seconds = "00"

       
      if(minutes < 10)
        minutes = "0"+minutes


      if(minutes < 60)
        return "00:"+minutes+":"+seconds
     

    },

  }

   
  
};
</script>