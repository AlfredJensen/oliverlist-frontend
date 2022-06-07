 <template>
  <div>
    <section>
    <div class="bg-white">
		 <treeselect 
		  v-model="chooseValues"
		  @select="onSelect"
          @deselect="ondeSelect" 
		  :backspaceRemoves="true"
		  :multiple="this.multiple" 
		  :required="false"
		  :maxHeight="500"
		  :limit="40"
		  :show-count="true"
          :searchable="true"
		  :clearable="false"
          :limitText="getLimitText"
		  :placeholder="$t('lang.search.insertsearch')"
		  :alwaysOpen="alwaysopen"
		  :defaultExpandLevel="0"
		  :openDirection="'bottom'"
		  :append-to-body="true"
          :load-options="searchOptions"
		  :async="true"
		  :defaultOptions="defaulOptions"
		  :disabled="isDisabled" >
          <label slot="option-label" slot-scope="{ node, shouldShowCount, count, labelClassName, countClassName }" :class="labelClassName">
            {{ node.label }}
          </label>
        </treeselect>

     </div>
		

    </section>
  </div>
</template>
<script>
import Treeselect from '@riophae/vue-treeselect';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';
import { ASYNC_SEARCH } from '@riophae/vue-treeselect'

const simulateAsyncOperation = fn => {
  setTimeout(fn, 20)
}

export default {
    props: {
        default_values: {
	        type: Array,
	        required: false,
	        default: () => [],
      	},
        option_list: {
	        type: Array,
	        required: true,
	        default: () => [],
      	},
        alwaysopen: {
	        type: Boolean,
	        required: false,
	        default: () => false,
      	},
        multiple: {
	        type: Boolean,
	        required: false,
	        default: () => true,
      	},
		isDisabled: {
	        type: Boolean,
	        required: false,
	        default: () => false,
      	},
    },
    data() {
      return {
      	chooseValues: Array,
      	defaulOptions: Array
       };

    },
    created(){
    	this.chooseValues = this.default_values
    	this.defaulOptions = this.option_list
    },
    
    components: {
    	'treeselect': Treeselect,
    },
    methods: {
		getLimitText(count){
			return "Recherchez ( "+count+" sélectionnés )";
		},
		getChildren(options){
		  const children = options.map(function(item) {
		    return item.children;
		  });
		  return children.flat();
		},
	    searchOptions({ action, searchQuery, callback }) {
	      if (action === ASYNC_SEARCH) {
	        simulateAsyncOperation(() => {
	          let options = this.defaulOptions.filter(option => option.label.toLowerCase().includes(searchQuery.toLowerCase()));
	          if(options.length == 0){
	            let options = this.getChildren(this.defaulOptions).filter(option => option.label.toLowerCase().includes(searchQuery.toLowerCase()));
	            if(options.length == 0){
	              let options = this.getChildren(this.getChildren(this.defaulOptions)).filter(option => option.label.toLowerCase().includes(searchQuery.toLowerCase()));
	              callback(null, options);
	            }
	            callback(null, options);
	          }
	          callback(null, options)
	        })
	      }
	    },
	    onSelect(node, instanceId){
	      this.default_values.push(node.id)
	    },
	    ondeSelect(node, instanceId){
	    	let index = this.default_values.indexOf(node.id)
			this.default_values.splice(index, 1);
	        // delete this.default_values[index]
	    },
    }
}

</script>