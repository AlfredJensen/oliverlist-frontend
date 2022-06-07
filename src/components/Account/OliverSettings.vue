<template>
    <div class="contenedor">
      <div class="row">
	    <div class="col-12">
	    	<h4>Email detection</h4>
	    	<div class="bg-light p-3" v-for="area in areawords">
	    		<label>{{area.label}}</label>
	    		<small class="d-inline ml-2 text-secondary">{{area.desc}}</small>
	    		<i v-if="editnow != area.type" @click="editnow = area.type"
	    		  class="cursor-pointer ml-2 icon-pencil text-primary"></i>
	    		<i v-if="editnow == area.type" class="icon-close text-danger ml-1 cursor-pointer" @click="editnow = false"></i>



			    <div v-if="editnow != area.type && area.type == 'automaticwords'">
			    	<small v-for="word in automaticwords.split(',')" class="bg-secondary text-white mx-1">
			    		|{{word}}|
			    	</small>
			    </div>
			    <div v-if="editnow != area.type && area.type == 'positivewords'">
			    	<small v-for="word in positivewords.split(',')" class="bg-secondary text-white mx-1">
			    		|{{word}}|
			    	</small>
			    </div>
			    <div v-if="editnow != area.type && area.type == 'negativewords'">
			    	<small v-for="word in negativewords.split(',')" class="bg-secondary text-white mx-1">
			    		|{{word}}|
			    	</small>
			    </div>
			    <div v-if="editnow != area.type && area.type == 'stopwords'">
			    	<small v-for="word in stopwords.split(',')" class="bg-secondary text-white mx-1">
			    		|{{word}}|
			    	</small>
			    </div>
			    <div v-if="editnow != area.type && area.type == 'spamwords'">
			    	<small v-for="word in spamwords.split(',')" class="bg-secondary text-white mx-1">
			    		|{{word}}|
			    	</small>
			    </div>
			    <div v-if="editnow != area.type && area.type == 'notworkingwords'">
			    	<small v-for="word in notworkingwords.split(',')" class="bg-secondary text-white mx-1">
			    		|{{word}}|
			    	</small>
			    </div>
			    <div v-if="editnow != area.type && area.type == 'scopewords'">
			    	<small v-for="word in scopewords.split(',')" class="bg-secondary text-white mx-1">
			    		|{{word}}|
			    	</small>
			    </div>
			    <div v-if="editnow != area.type && area.type == 'wrongwords'">
			    	<small v-for="word in wrongwords.split(',')" class="bg-secondary text-white mx-1">
			    		|{{word}}|
			    	</small>
			    </div>
	    	  
	    	  <div class="bg-light p-3" v-if="editnow == area.type">
		    	
			    <textarea v-if="area.type == 'negativewords'" type="text" class="form-control" 
			     v-model="negativewords" 
			    rows="5">
			    </textarea>
			    <textarea v-if="area.type == 'positivewords'" type="text" class="form-control" 
			     v-model="positivewords" 
			    rows="5">
			    </textarea>
			    <textarea v-if="area.type == 'automaticwords'"  type="text" class="form-control" 
			     v-model="automaticwords" 
			    rows="5">
			    </textarea>
			    <textarea v-if="area.type == 'stopwords'"  type="text" class="form-control" 
			     v-model="stopwords" 
			    rows="5">
			    </textarea>
			    <textarea v-if="area.type == 'spamwords'"  type="text" class="form-control" 
			     v-model="spamwords" 
			    rows="5">
			    </textarea>
			    <textarea v-if="area.type == 'notworkingwords'"  type="text" class="form-control" 
			     v-model="notworkingwords" 
			    rows="5">
			    </textarea>
			    <textarea v-if="area.type == 'scopewords'"  type="text" class="form-control" 
			     v-model="scopewords" 
			    rows="5">
			    </textarea>
			    <textarea v-if="area.type == 'wrongwords'"  type="text" class="form-control" 
			     v-model="wrongwords" 
			    rows="5">
			    </textarea>
			    <button @click="updateWords(area.type)" class="btn btn-sm btn-primary mt-2">{{$t('lang.button.save')}}</button>
		    </div>

		    </div>

	    	

	    </div>
	  </div>
	  <div class="dropdown-divider mt-4 mb-4"></div>
	  <h4 class="mb-3">Level</h4>
      <div class="row mt-4">
	    <div class="col-12">
	    	<label> 
	    		Label
	    		<input type="text" v-model="newtitle">
	    	</label>
	    	<br>
	    	Words
		    <textarea type="text" class="form-control" 
		     v-model="newwords" 
		    rows="5">
		    </textarea>
		    <button :disabled="!newwords || !newtitle" @click="insertNew('level')" class="btn btn-sm btn-primary mt-2">{{ $t('lang.button.save') }}</button>
	    </div>
	  </div>
      <div  v-for="level in levels" class="row">
	    <div class="col-12 bg-light p-3" v-if="level.id != 12013">
	    	<label>{{level.label}} 
	    	<i v-if="editnow != level.id" class="icon-pencil text-primary ml-1 cursor-pointer" @click="editnow = level.id"></i>
	    	<i v-if="editnow == level.id" class="icon-close text-danger ml-1 cursor-pointer" @click="editnow = false"></i>
	    	</label>
	    

			    <div v-if="editnow != level.id">
			    	<small v-for="word in levelwords[level.id].split(',')" class="bg-secondary text-white mx-1">
			    		|{{word}}|
			    	</small>
			    </div>
	    	<div class="bg-light p-3" v-if="editnow == level.id">
			    <textarea type="text" class="form-control" 
			     v-model="levelwords[level.id]" 
			    rows="5">
			    </textarea>
			    <button class="mt-2 btn btn-sm btn-primary" @click="saveWordsLevel(level.id)">{{$t('lang.button.save')}}</button>
		    </div>
	    </div>
	  </div>
	  <div class="dropdown-divider mt-4 mb-4"></div>
	  <h4 class="mb-3">Function</h4>

	  <div class="row mt-4">
	    <div class="col-12">
	    	<label> 
	    		Label
	    		<input type="text" v-model="newtitle">
	    	</label>
	    	<br>
	    	Words
		    <textarea type="text" class="form-control" 
		     v-model="newwords" 
		    rows="5">
		    </textarea>
		    <button :disabled="!newwords || !newtitle" @click="insertNew('function')" class="btn btn-sm btn-primary mt-2">{{ $t('lang.button.save') }}</button>
	    </div>
	  </div>

      <div  v-for="level in functs" class="row">
	    <div class="col-12 bg-light p-3" v-if="level.id != 12013">
	    	<label>{{level.label}} 
	    	<i v-if="editnow != level.id" class="icon-pencil text-primary ml-1 cursor-pointer" @click="editnow = level.id"></i>
	    	<i v-if="editnow == level.id" class="icon-close text-danger ml-1 cursor-pointer" @click="editnow = false"></i>
	    	</label>
	    	
			    <div v-if="editnow != level.id">
			    	<small v-for="word in functionwords[level.id].split(',')" class="bg-secondary text-white mx-1">
			    		|{{word}}|
			    	</small>
			    </div>
	    	<div class="bg-light p-3" v-if="editnow == level.id">
			    <textarea type="text" class="form-control" 
			     v-model="functionwords[level.id]" 
			    rows="5">
			    </textarea>
			    <button class="mt-2 btn btn-sm btn-primary" @click="saveWordsFunction(level.id)">{{$t('lang.button.save')}}</button>
		    </div>
	    </div>
	  </div>

    </div>
</template>
<script>
import { adminService } from "@/_services";

export default {
    data() {
    return {
      negativewords:"",
      positivewords:"",
      stopwords:"",
      automaticwords:"",
      notworkingwords:"",
      spamwords:"",
      functs:[],
      levels:[],
      editnow:"",
      functionwords:[],
      levelwords:[],
      newwords:"",
      newtitle:"",
      scopewords:"",
      wrongwords:"",
      areawords:[
      	{desc: 'Oliver OFF + (Auto Reply + Auto Follow Up)',label: this.$t('lang.refuse.negativewords'), type:'negativewords'},
      	{desc: 'Tag',label: this.$t('lang.refuse.positivewords'), type: 'positivewords'},
      	{desc: 'Oliver OFF + Tag',label: this.$t('lang.refuse.automaticwords'), type: 'automaticwords'},
      	{desc: 'Oliver ON + Do not contact + Tag',label: this.$t('lang.refuse.stopwords'), type: 'stopwords'},
      	{desc: 'Oliver ON + Tag',label: this.$t('lang.refuse.spamwords'), type: 'spamwords'},
      	{desc: 'Oliver ON + Delete contact (ATTENTION)',label: this.$t('lang.refuse.notworkingwords'), type: 'notworkingwords'},
      	{desc: 'Oliver OFF + Tag',label: 'Scope Words', type: 'scopewords'},
      	{desc: 'Oliver ON + OFF contact in this opp + Future Recalls',label: this.$t('lang.refuse.wrongwords'), type: 'wrongwords'}
      ],
    };
  },

  created(){
    this.getOliverSettings();
  },

  methods:{
  	getOliverSettings(){
		adminService.getOliverSettings().then((response) => {
	    		this.functs = response.functions
	    		this.levels = response.levels  
	    		this.negativewords = response.negativewords
	    		this.positivewords = response.positivewords
	    		this.stopwords = response.stopwords
	    		this.spamwords = response.spamwords
	    		this.automaticwords = response.automaticwords
	    		this.notworkingwords = response.notworkingwords
	    		this.scopewords = response.scopewords
	    		this.wrongwords = response.wrongwords
	    		this.levels.forEach(l => {
	    			this.levelwords[l.id] = l.words  
	    		})
	    		this.functs.forEach(f => {
	    			this.functionwords[f.id] = f.words  
	    		})
	    		        
	    })
  	},
  	saveWordsLevel(id){
  		adminService.updateWords(this.levelwords[id],id)
  	},
  	saveWordsFunction(id){
  		adminService.updateWords(this.functionwords[id],id)
  	},
  	updateWords(type){
  		if(type == 'negativewords'){
  			adminService.updateOliverVariables(this.negativewords,type)
  		}
  		if(type == 'positivewords'){
  			adminService.updateOliverVariables(this.positivewords,type)
  		}
  		if(type == 'automaticwords'){
  			adminService.updateOliverVariables(this.automaticwords,type)
  		}
  		if(type == 'notworkingwords'){
  			adminService.updateOliverVariables(this.notworkingwords,type)
  		}
  		if(type == 'stopwords'){
  			adminService.updateOliverVariables(this.stopwords,type)
  		}
  		if(type == 'spamwords'){
  			adminService.updateOliverVariables(this.spamwords,type)
  		}
  		if(type == 'scopewords'){
  			adminService.updateOliverVariables(this.scopewords,type)
  		}
  		if(type == 'wrongwords'){
  			adminService.updateOliverVariables(this.wrongwords,type)
  		}
  	},

  	insertNew(type){
  		adminService.insertNew(this.newwords,this.newtitle,type).then((res) => {
  			this.newwords = '';
  			this.newtitle = '';
  			this.getOliverSettings();
  		})
  	}
  }

}
</script>