<template>
    <div class="d-inline-block">
	<div class="d-inline-block">
		<nav>
		  <ul class="pagination pagination-sm">
		    <li class="page-item">
				  <button class="btn btn-sm text-primary bg-white dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
				   {{ model.cantPerPage }} 
				  </button>
				  <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
				    <a v-for="(optionCant, index) in this.options"
				     @click="changeCant(optionCant)"
				     class="dropdown-item" href="#">{{ optionCant }} {{ $t('lang.button.perpage') }}</a>
				  </div>
		    </li>
		    <li class="page-item">
		      <a 
		      v-if="currentPage > 1"
		      :class="'text-'+color"
		      @click="prevPage"
		      class="page-link" href="#" aria-label="Previous">
		        <span aria-hidden="true">&laquo;</span>
		        <span class="sr-only">Previous</span>
		      </a>
		    </li>


		    <li 
			    class="page-item"
			    v-for="(optionCant,index) in firstpages" 
			    :class="optionCant == currentPage ? 'active' : ''"
			    >
			    <a 
				v-if="endOptionCant(optionCant)"
			    class="page-link" href="#"
			    :class="optionCant == currentPage ? 'bg-'+color+' border-'+color : 'text-'+color"
			    @click="changePage(optionCant)">{{optionCant}}</a>
		    </li>

		    <span class="text-primary" v-if="firstpages.length>0">
		    ...
		    </span>

		    <li 
			    class="page-item"
			    v-for="(optionCant,index) in pages" 
			    :class="optionCant == currentPage ? 'active' : ''"
			    >
			    <a 
				v-if="endOptionCant(optionCant)"
			    class="page-link" href="#"
			    :class="optionCant == currentPage ? 'bg-'+color+' border-'+color : 'text-'+color"
			    @click="changePage(optionCant)">{{optionCant}}</a>
		    </li>

		    <span class="text-primary" v-if="lastpages.length>0 && !limit">
		    ...
		    </span>
		    <li 
		    	v-if="!limit"
			    class="page-item"
			    v-for="(optionCant,index) in lastpages" 
			    :class="optionCant == currentPage ? 'active' : ''"
			    >
			    <a 
				v-if="endOptionCant(optionCant)"
			    class="page-link" href="#"
			    :class="optionCant == currentPage ? 'bg-'+color+' border-'+color : 'text-'+color"
			    @click="changePage(optionCant)">{{optionCant}}</a>
		    </li>

		    <li 
		    	v-if="!end() && !nextend()"
		    	class="page-item">
		      <a class="page-link"
		      @click="nextPage"
		      :class="'text-'+color"
		       href="#" aria-label="Next">
		        <span aria-hidden="true">&raquo;</span>
		        <span class="sr-only">Next</span>
		      </a>
		    </li>

		    <li 
		    	v-if="limit && nextend() && currentPage == 5"
		    	class="page-item">
		      <a class="page-link"
		      :class="'text-'+color"
		       href="#" aria-label="Next"> 
		       <small class="pt-2 pl-2">{{$t('lang.mycontacts.trialperiodmax')}}</small>
		      </a>
		    </li>
		   
		  </ul>
		</nav>
	</div>
    </div>
</template>
<script>
export default {
	  data() {
	    return {
	      pages:[1,2,3],
	      lastpages:[],
	      firstpages:[],
	      options:[25,50,100],
	      currentPage:0
	    }
	  },
	  watch:{
	  },
	created(){
		if(this.color === undefined)
			this.color = 'primary'
		this.currentPage = this.model.currentPage
		if(this.pages[this.pages.length-1] < this.model.currentPage){
			let newpages = []
				newpages.push(this.model.currentPage-2)
				newpages.push(this.model.currentPage-1)
				newpages.push(this.model.currentPage)
			this.pages = newpages
		}
		if(this.nextend() && !this.end() 
		&& this.pages[this.pages.length-2] == this.model.currentPage && this.pages.length == 3){
			this.pages.pop()
		}

		if(this.totalpage !== undefined){
		   let pages = Math.round(this.total / this.model.cantPerPage)
		   if(pages > 5 && this.model.currentPage < pages-1){
		   	this.lastpages = [pages-1,pages]
		   }else{
		   	this.lastpages = []
		   }
		   if(pages > 5 && this.model.currentPage > 5){
		   	this.firstpages = [1,2]
		   }else{
		   	this.firstpages = []
		   }

		}


	},
	methods:{
		changePage(index){
			if(this.model.currentPage != index){
				this.model.currentPage = index
				this.currentPage = this.model.currentPage
	        	this.$emit('changePage');
        	}
		},
		nextPage(){
			this.model.currentPage++
			
			this.currentPage = this.model.currentPage
        	this.$emit('changePage');
		},
		prevPage(){
			if(this.model.currentPage > 1){
				this.model.currentPage--
				this.currentPage = this.model.currentPage
	        	this.$emit('changePage');
        	}
		},
		firstPage(){
			if(this.model.currentPage > 1){
				this.model.currentPage=1
				this.currentPage = this.model.currentPage
	        	this.$emit('changePage');
        	}
		},
		nextend(){

			if(this.limit && this.currentPage == 5)
				return true

			if(this.totalpage < this.model.cantPerPage)
				return true
		
			return false
		
		},
		end(){
			if(!this.total)
				return false
			if( (this.model.currentPage * this.model.cantPerPage) == this.total){
				return true
			}
		},
		endOptionCant(optionCant){
			if( (--optionCant * this.model.cantPerPage) <= this.total){
				return true
			}
			return false
		},
		changeCant(cant){
			this.model.cantPerPage = cant
			this.model.currentPage = 1
			this.$emit('changePage');
		}
	},
    props: {
      limit:Boolean,
      total:Number,
      model: {},
      totalpage:Number,
      color:String
    },
}
</script>
