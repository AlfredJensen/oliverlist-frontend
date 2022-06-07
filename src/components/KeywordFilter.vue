<template>
    <div id="filterSystem" style="display:flex;flex-wrap: wrap;">
      <div v-for="(column, columnIndex) in myQuery.predicates"  
        :key="columnIndex"
        style="display:flex;"
      >

        <div v-if="columnIndex>0" class="dropdown">
          <ul class="dropdown-menu dropdown-menu-right">
            <li class="dropdown-item p-10"
              @click="myQuery.type ='and'"
              style="cursor: pointer;position:relative:"
            >
              and
              <i v-if="myQuery.type=='and'" class="icon-check-square-o"></i>
            </li>
            <li class="dropdown-item p-20" 
              @click="myQuery.type ='or'"
              style="cursor: pointer;position:relative:"
            >
              or
              <i v-if="myQuery.type=='or'" class="icon-check-square-o"></i>
            </li>
          </ul>

          <button :id="column.id"
            class="btn p-0" 
            style="margin: 5px;"
            type="button"
            data-toggle="dropdown" 
            aria-haspopup="true" 
            aria-expanded="true"
          >
            <span class="p-2"><strong>{{ myQuery.type }}</strong></span>
          </button>
        </div>


        <div v-if="column.predicates.length > 0" style="display:flex;flex-wrap: wrap;">
          <div v-for="(columnInGroup, columnIndex) in column.predicates" 
            :key="columnIndex" 
            style="display:flex;"
          >

            <div v-if="columnIndex>0" class="dropdown">
              <ul class="dropdown-menu dropdown-menu-right">
                <li class="dropdown-item p-10"
                  @click="column.type ='and'"
                  style="cursor: pointer;"
                >
                  and 
                  <i v-if="column.type=='and'" class="icon-check-square-o"></i>
                </li>
                <li class="dropdown-item p-20" 
                  @click="column.type ='or'"
                  style="cursor: pointer"
                >
                  or
                  <i v-if="column.type=='or'" class="icon-check-square-o"></i>
                </li>
              </ul>
              <button v-if="columnIndex>0"  class="btn button_custom p-0" 
                type="button"
                data-toggle="dropdown" 
                aria-haspopup="true" 
                aria-expanded="true"
              >
                <span class="p-2"><strong>{{ column.type }}</strong></span>
              </button>   
            </div>

            <div>
              <div class="dropdown-menu dropdown-menu-right" >
                <form class="px-4 py-3" >
                  <div 
                    v-for="(option, index) in getOptions(columnInGroup.type)"
                    :key="index" 
                    @click.stop="updateQuery($event, columnInGroup, option)"
                  >

                    <label style="display: block;" :for="columnInGroup.id + '-' + index" >
                      <input class="mr-1" type="radio" 
                        :id="columnInGroup.id + '-' + index" 
                        :name="columnInGroup.id"
                        :value="option.label" 
                        v-model="columnInGroup.label" 
                        @click="radioClick(columnInGroup)"
                      >
                      {{ option.label }} 
                    </label>


                    <div v-if="option.type == 'text' && 
                      columnInGroup.comparison == option.comparison && 
                      option.comparison != 'unknown' &&
                      option.comparison != 'known'"
                      @keyup="inputKeyup"
                      @keydown="inputKeydown"
                    >
                      <input type="text"
                        :id="columnInGroup.id + 'input'"
                        v-focus="focused" 
                        :for="columnInGroup.id + option.label" 
                        v-model="columnInGroup.value" />
                    </div>
                    <div v-if="option.type == 'number' && 
                      columnInGroup.comparison == option.comparison &&
                      option.comparison != 'unknown' &&
                      option.comparison != 'known'" 
                      @keyup="inputKeyup"
                      @keydown="inputKeydown"
                    >
                      <input type="number"
                        :id="columnInGroup.id + 'input'"
                        v-focus="focused" 
                        :for="columnInGroup.id + option.label"
                        v-model="columnInGroup.value" />
                    </div>
                    <div v-if="option.type == 'list' && 
                      columnInGroup.comparison == option.comparison"
                    >
                      <select class="form-control" @change="inputKeyup" v-model="columnInGroup.value">
                        <option  v-for="item in columnInGroup.list" :key="item.id" :value="item.id" >{{item.name}}</option>
                      </select>
                    </div>

                  </div>
                  <div class="done_button"> 
                    <span class="btn btn-link">{{ $t('lang.label.donefilter') }}</span>
                  </div>
                </form>

              </div>
              <button 
                :class="isEmptyColumn(columnInGroup) ? 'btn p-0 button_custom_empty' : 'btn p-0 button_custom'"
                @mouseover="columnInGroup.onHover = true"
                @mouseleave="columnInGroup.onHover = false"
                type="button" 
                :id="columnInGroup.id + '-luciano1'"
                data-toggle="dropdown" 
                aria-haspopup="true" 
                aria-expanded="true"
              >
                <div style="position: relative;">
                  <span class="pl-1 pt-1 pb-1 mr-1"><strong>{{ columnInGroup.name }} </strong></span>
                  <span class="pt-1 pb-1 pr-1" v-if="columnInGroup.value">{{ columnInGroup.label }} {{ columnInGroup.value }} </span>
                  <span class="pt-1 pb-1 pr-1" v-else>
                    <span v-if="columnInGroup.comparison == 'unknown' || columnInGroup.comparison == 'known'"> {{ columnInGroup.comparison }} </span>
                    <span v-else>is missing value </span>
                  </span>
                  
                  <i
                    :class="isEmptyColumn(columnInGroup) ? 'btn p-0 m-0 button_custom_empty' : 'btn p-0 m-0 button_custom'"
                    style="right:0;width:30px;position: absolute;font-size:25px; "
                    v-if="columnInGroup.onHover"
                    aria-hidden="true" 
                    @click="removeButton($event, columnInGroup)"
                  >
                    &times;
                  </i>
                </div>
              </button>
            </div>


            <div v-if="columnInGroup.canAddFilter">
              <button class="btn button_custom p-0" 
                type="button"
                data-toggle="dropdown" 
                aria-haspopup="true" 
                aria-expanded="true"
                title="Add Filter to this Group"
              >
                <span class="p-1"><strong>+</strong></span>
              </button>

              <div class="dropdown-menu dropdown-menu-right scrollable-menu" >
                <input type="text" 
                  class="dropdown-item p-10" 
                  v-model="columnFilter" 
                  v-focus="focused" 
                  v-bind:placeholder="$t('lang.label.search')"
                >
                <ul>
                  <li v-for="(option, index) in getColumnsFiltered()" 
                    class="dropdown-item" 
                    :key="index"
                    @click="addFilter(option, column)"
                  >
                    {{ option.name }}
                  </li>
                </ul>
              </div>
            </div>
            <div v-if="columnInGroup.canCreateGroup">
              <button class="btn button_custom p-0 " 
                type="button"
                data-toggle="dropdown" 
                aria-haspopup="true" 
                aria-expanded="true"
                title="Create a Filter Group"
              >
                <span class="pl-2 pr-2 p-1"><strong>+</strong></span>
              </button>

              <div class="dropdown-menu dropdown-menu-right scrollable-menu" >
                <input type="text" 
                  class="dropdown-item p-10" 
                  v-model="columnFilter" 
                  v-focus="focused" 
                  v-bind:placeholder="$t('lang.label.search')"
                >
                <ul>
                  <li v-for="(option, index) in getColumnsFiltered()" 
                    class="dropdown-item" 
                    :key="index"
                    @click="createGroup(option, column)"
                  >
                    {{ option.name }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

      </div>

      <div class="dropdown">

        <button class="btn btn-sm btn-outline-primary mt-2 p-1" 
          type="button"
          data-toggle="dropdown" 
          aria-haspopup="true" 
          aria-expanded="true"
        >
          <span class="p-0">{{ $t('lang.button.refine') }}</span>
        </button>

        <div class="dropdown-menu dropdown-menu-right scrollable-menu" >
          <input type="text" 
            class="dropdown-item p-10" 
            v-model="columnFilter" 
            v-focus="focused" 
            v-bind:placeholder="$t('lang.label.search')"
          >

          <ul>
            <li v-for="(option, index) in getColumnsFiltered()" 
              class="dropdown-item" 
              :key="index"
              @click="addFilter(option)"
            >
              {{ option.name }}
            </li>
          </ul>
        </div>
      </div>
    </div>

</template>

<script>
import $ from "jquery";
import { focus } from 'vue-focus';

export default {
  directives: { focus: focus },
  props: {
    columns: {
      type: Array,
      required: true
    },
    defaultFilters: String,
    reset: Boolean,
    sort: String,
    dir: String
  },

  data() {
    return {
      focused: true,
      columnFilter: '',
      stringOptions: [
        {
          label: this.$t('lang.label.is'),
          comparison: 'eq',
          type: "text"
        }, 
        {
          label: this.$t('lang.label.isnot'),
          comparison: 'ne',
          type: "text"
        }, 
        {
          label: this.$t('lang.label.startswith'),
          comparison: 'starts_with',
          type: "text"
        }, 
        {
          label: this.$t('lang.label.endswith'),
          comparison: 'ends_with',
          type: "text"
        }, 
        {
          label: this.$t('lang.label.countains'),
          comparison: 'contains',
          type: "text"
        }, 
        {
          label: this.$t('lang.label.doesnotcontains'),
          comparison: 'not_contains',
          type: "text"
        }, 
        {
          label: this.$t('lang.label.isunknown'),
          comparison: 'unknown',
          type: "text"
        }, 
        {
          label: this.$t('lang.label.hasanyvalue'),
          comparison: 'known',
          type: "text"
        }
      ],
      numberOptions: [
        {
          label: this.$t('lang.label.greaterthan'),
          comparison: 'gt',
          type: "number",
        },
        {
          label: this.$t('lang.label.lessthan'),
          comparison: 'lt',
          type: "number",
        },
        {
          label: this.$t('lang.label.is'),
          comparison: 'eq',
          type: "number",
        },
        {
          label: this.$t('lang.label.isnot'),
          comparison: 'ne',
          type: "number",
        },
        {
          label: this.$t('lang.label.isunknown'),
          comparison: 'unknown',
          type: "number",
        },
        {
          label: this.$t('lang.label.hasanyvalue'),
          comparison: 'known',
          type: "number",
        }
      ],
      listOptions: [
        {
          label: this.$t('lang.label.is'),
          comparison: 'eq',
          type: "list",
        },
        {
          label: this.$t('lang.label.isnot'),
          comparison: 'ne',
          type: "list",
        },
      ],
      dateOptions: [
        {
          label: this.$t('lang.label.morethan'),
          comparison: 'lt',
          type: "number",
        },
        {
          label: this.$t('lang.label.exactly'),
          comparison: 'eq',
          type: "number",
        },
        {
          label: this.$t('lang.label.lessthan'),
          comparison: 'gt',
          type: "number",
        },
        {
          label: this.$t('lang.label.after'),
          comparison: 'gt',
          type: "date",
        },
        {
          label: this.$t('lang.label.on'),
          comparison: 'eq',
          type: "date",
        },
        {
          label: this.$t('lang.label.before'),
          comparison: 'lt',
          type: "date",
        },
        {
          label: this.$t('lang.label.isunknown'),
          comparison: 'unknown',
          type: "date",
        },
        {
          label: this.$t('lang.label.hasanyvalue'),
          comparison: 'known',
          type: "date",
        }

      ],
      oldQuery:'{}',
      myQuery: {
        type: 'or',
        sort: '',
        dir: '',
        predicates: [],
      },
      nextId: 1,
      keydown: true,
    };
  },

  created(){
    if(this.defaultFilters !== null && this.defaultFilters !== undefined && this.defaultFilters.length > 0){
      this.myQuery = JSON.parse(this.defaultFilters);
      this.oldQuery = this.processQuery(this.myQuery);
      for (let column of this.myQuery.predicates){
            this.nextId++;
            for (let innerColumn of column.predicates){
            this.nextId++;
            }
      }
    }
  },

  watch: {
    myQuery: {
      deep: true,
      handler(){
        if (this.keydown == false){
          this.checkCallApi();
        }
      }
    },
    reset:{
      handler(){
        if (this.reset==true){
          this.oldQuery = '';
          this.myQuery = {
            type: 'or',
            predicates: [],
          };
        }
      }
    },
    sort:{
      handler(){
        this.myQuery.sort = this.sort;
        this.myQuery.dir = this.dir;
        this.checkCallApi();
      }
    },
    dir:{
      handler(){
        this.myQuery.sort = this.sort;
        this.myQuery.dir = this.dir;
        this.checkCallApi();
      }
    }
  },

  methods: {

    processQuery(myQuery){
      let newQuery = '';
        newQuery += myQuery.sort + ' ';
        newQuery += myQuery.dir + ' ';
        let i=0;
        for (let column of myQuery.predicates){
          i+=1;
          if (column.type == 'and' || column.type == 'or'){
            if (i>1){
              newQuery += myQuery.type + ' ';
            }
          }
          let j=0;
          for (let innerColumn of column.predicates){
            if (innerColumn.comparison != 'unknown' && 
              innerColumn.comparison != 'known' && 
              innerColumn.comparison != 'list' && 
              innerColumn.value == ''){
              return;
            }
            j+=1;
            if (j>1 && innerColumn.value != ''){
              newQuery += column.type + ' ';
            }
            if (innerColumn.value != ''){
              newQuery += '(' + innerColumn.comparison  + ')' + innerColumn.value + ' ';
            }
            if (innerColumn.comparison == 'unknown' ||
              innerColumn.comparison == 'known' ||
              innerColumn.comparison == 'list'){
              newQuery += '(' + innerColumn.comparison  + ')';
            }

          }
        }
        return newQuery;
    },

    checkCallApi(){
      let newQuery = this.processQuery(this.myQuery);
      
      if (newQuery !== undefined && 
      newQuery.replace(/\s/g, '') !== this.oldQuery.replace(/\s/g, '')
      ){
        this.oldQuery = newQuery;
        this.$emit('callApi', this.myQuery);
      }
    },
    radioClick(column){
      if (column.comparison == 'known' || column.comparison == 'unknown'){
        this.checkCallApi();
      }
    },
    inputKeydown(){
      this.keydown = true;
    },
    inputKeyup(){
      setTimeout(()=>{
        this.keydown = false;
        this.checkCallApi();
      }, 1500);
    },

    stopPropagation(event){
      event.stopPropagation();
    },
    getColumnsFiltered(){
      if (this.columnFilter != undefined){
        return this.columns.filter(c => c.name.includes(this.columnFilter))
      }else{
        return this.columns;
      }
    },

    updateQuery(event, column, option) {
      // event.preventDefault();
      //Prevent twice click
      /*
      if ($(event.target).is("label")){
        return;
      }*/
      column.comparison = option.comparison;
      if (option.comparison == 'unknown' || option.comparison == 'known'){
        column.value = '';
      }
    },

    getOptions(type){
      switch(type){
        case "text":
          return this.stringOptions;
        case "string":
          return this.stringOptions;
        case "number":
          return this.numberOptions;
        case "date":
          return this.dateOptions;
        case "list":
          return this.listOptions;          
      }
    },

    removeButton(event, column){
      event.stopPropagation();

      this.myQuery.predicates  = this.myQuery.predicates.filter(c => c.id != column.id);
     
      for (let myColumn of this.myQuery.predicates){
        if (myColumn.predicates != undefined && myColumn.predicates.length >0){
          myColumn.predicates  = myColumn.predicates.filter(c => c.id != column.id);
          if (myColumn.predicates.length > 0){
            if (myColumn.predicates.length > 1){
              myColumn.predicates[myColumn.predicates.length -1].canAddFilter = true;
            }
          }else{
            //remove empty group
            this.removeButton(event, myColumn);
          }
        }
      }

      this.checkCallApi()

    },

    isEmptyColumn(column){
      if(column.comparison != 'unknown' && 
        column.comparison != 'known'&&
        column.value == ''){
        return true;
      }else{
        return false;
      }
    },

    getNextId(){
      this.nextId +=1;
      return this.nextId;
    },

    createGroup(columnToAdd, columnBefore){
      let newColumn = {
        id: this.getNextId(),
        name: columnToAdd.name,
        type: columnToAdd.type,
        field: columnToAdd.field,
        list: columnToAdd.list,
        label: '',
        value: '',
        comparison: '',
        onHover: false,
        canCreateGroup: false,
        canAddFilter: true,
        predicates: [],
      }
      columnBefore.predicates[columnBefore.predicates.length-1].canCreateGroup = false;
      columnBefore.predicates.push(newColumn);

      setTimeout(() =>{ 
        $('#' + newColumn.id + '-luciano1').trigger('click');  
      }, 100);
    },

    addFilter(columnValues, columnGroup){
      let newColumn = {
        id: this.getNextId(),
        name: columnValues.name,
        type: columnValues.type,
        field: columnValues.field,
        list: columnValues.list,
        label: '',
        value: '',
        comparison: '',
        onHover: false,
        canCreateGroup: true,
        canAddFilter: false,
        predicates: [],
      }

      //Add column to group
      if (columnGroup != undefined){

        columnGroup.predicates[columnGroup.predicates.length-1].canAddFilter = false;
        newColumn.canAddFilter = true;
        newColumn.canCreateGroup = false;
        columnGroup.predicates.push(newColumn);
      }else{

        let newColumnGroup = {
          id: this.getNextId(),
          name: "or",
          type: "or",
          label: "or",
          field: "or",
          list: '',
          value: '',
          comparison: '',
          onHover: false,
          canCreateGroup: false,
          canAddFilter: false,
          predicates: [newColumn],
        }
        this.myQuery.predicates.push(newColumnGroup);

      }

      setTimeout(() =>{ 
        $('#' + newColumn.id + '-luciano1').trigger('click');  
      }, 100);

    },
  }
};
</script>
<style>
.button_custom_empty{
  background-color: #d7d7d7  !important;
  border: 1px solid #d7d7d7  !important;
  border-radius: 6px !important;
  margin: 5px;  
}
.button_custom{
  background-color: #e4e4e4 !important;
  /*background: green !important;*/
  border: 1px solid #e4e4e4 !important;
  border-radius: 6px !important;
  margin: 5px;
}
.button_custom:hover{
  /*background-color: #e3e7fa !important;*/
  color: blue !important;
  border: 1px solid transparent !important;
}

#filterSystem span {
  white-space: pre;
}

.done_button{
  text-align: center;
  border-top-color: rgba(0, 0, 0, 0.1);
  border-top-style: solid;
  border-top-width: 1px;
}

.scrollable-menu{
  height: auto;
  overflow-x: hidden;
}
</style>