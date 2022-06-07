<template>
  <div class="contact-info">
    <div class="card not-effect p-3 shadow">
        <div class="row">
            <div class="col-md-12 col-sm-12">

                <span class="float-right" v-if="Math.floor(link.score)>1"><span v-bind:class="getColorClass(link.score)"
                class="px-2 py-1 ml-2 rounded text-white">{{ Math.floor(link.score) }}</span></span>

              <div class="mt-2 mb-2">
                <span><h6 class="font-weight-bold">
                {{ business.name }}</h6></span>
                <small class="badge rounded-25 px-3 ml-2"
                :class="statusBadgeOliver(status.name)">{{ link.campaign_name }}</small>
             
                
              </div>

              
              <div>
              <div>
                <div>
                  <multiselect 
                  v-model="value" 
                  tag-placeholder="Add this as new tag" 
                  v-bind:placeholder="$t('lang.label.searchoraddatag')"
                  label="name" 
                  track-by="id" 
                  :options="options" 
                  :multiple="true" 
                  :taggable="true"
                  :searchable="true"
                  :showLabels="false"
                  openDirection="below"
                  class="small"
                  @tag="addTag($event)"
                  @input="onChange($event)"
                  @select="selectLinkTag($event)"
                  @remove="removeLinkTag($event)">

                  <template slot="option" slot-scope="props">
                    <span class="option__title customOptions" >
                      <div style="font-size:1rem;">
                        {{props.option.name}}
                      </div>
                      <div>
                       <a
                       v-if="props.option.client_id != undefined" 
                       @mouseover="hover = true" 
                       @mouseleave="hover = false" 
                       @click="removeTag(props.option)">   
                       <span class="icon-remove ft-2 " />
                     </a>
                   </div>
                 </span>
               </template>

               <template slot="tag" slot-scope="props">
                <span class="multiselect__tag" v-bind:style="'background: #' + (props.option.color)">
                  <span v-text="props.option.name" class="mr-1"></span>
                  <i aria-hidden="true" tabindex="1" 
                  @keydown.enter.prevent="removeLinkTag(props.option)"  
                  @mousedown.prevent="removeLinkTag(props.option)" 
                  class="multiselect__tag-icon" 
                  v-bind:style="'background: #' + (props.option.color)">
                </i>
              </span>
            </template>


          </multiselect>

        </div>
      </div>
    </div>
    </div>

      <div class="col-md-12 col-sm-12 mt-3">
        <div>
          <button
          v-if="status.name !== 'Positive'"
          type="button"
          :class="statusButton('positive')"
          class="border-0 btn btn-sm w-100"
          @click="executeAction('positiveBusiness')"
          >
          <span class="">{{ statusButtonName('positive') }}</span>
          </button>  
        </div>
        <div class="bg-light p-2" v-if="user.team_role_id == 2">
          <select 
          v-model="keywordselected" 
          class="form-control mt-2 d-inline">
          <option v-for="group in keywordgroups"
          :value="group.name"
          v-if=" group.name != 'outdatedwords' && group.name != 'positivewords' && group.name != 'notworkingwords'">{{ $t('lang.refuse.'+group.name) }}</option>
          </select>
          <select 
          v-model="contactselected" 
          class="form-control mt-2 d-inline">
          <option v-for="contact in businessContacts"
          :value="contact.id">{{ contact.name }}</option>
          </select>
          <button
          type="button"
          :disabled="!(keywordselected && contactselected)"
          class="btn btn-sm btn-primary w-100 mt-1"
          @click="selectKeyword"
          >
          {{$t('lang.button.continue')}}
          </button> 
        </div>

        

        <ActionButtonsDisqualified
        class="top-area-opp d-none d-sm-block"
        v-if="status.name === 'Positive'" 
        :link="{'id': this.link.id}"
        :status="'define status'"
        />
        <ActionButtonsDisqualified
        class="top-area-opp border-0 mt-4 w-100 d-block d-sm-none"
        v-if="status.name === 'Positive'" 
        :link="{'id': this.link.id}"
        :status="'define status'"
        />
      </div>
    </div>
  </div>
</div>

    </template>

    <script>
    import { businessesService } from "@/_services";
    import { statusButtonMixin, statusBadgeMixin, urlMixin, logoMixin } from "@/_mixins";
    import { mapActions , mapState} from "vuex";
    import Header from "@/components/Header.vue";
    import  ActionButtonsDisqualified  from "@/components/Emails/ActionButtonsDisqualified.vue";
    import Multiselect from 'vue-multiselect';
    import { tagsService } from "@/_services";
    export default {

      data() {
        return {
          tooltip: Boolean,
          value: [],
          options:[],
          styleObject: {
            color:'red',
            fontSize:'13px'
          },
          keywordselected:false,
          contactselected:false,
          keywordgroups: [],
          deleted: '',
          hover: false,


        };
      },

      mixins: [statusButtonMixin,statusBadgeMixin, urlMixin, logoMixin],
      components: {
        Multiselect,
        ActionButtonsDisqualified
      },
      props: {
        business: Object,
        status: Object,
        businessContacts: Array,
        link: Object,
        unlocked: Number
      },
      computed: {
        ...mapState({
          headerTab: state => state.header.tab
        }),

        user() {
          return this.$store.state.authentication.user;
        },
      },
      created(){
        this.getAllTags()
        this.getKeyWordGroups()
      },
      mounted(){
        this.getAllByLinkId()

      },
      methods: {
       ...mapActions("header", {
        changeHeaderTab: "changeTab"
      }),
      ...mapActions("opportunities", {
        addOpportunityTag: "addOpportunityTag",
        removeOpportunityTag: "removeOpportunityTag"
      }),
       changeTab(){
        this.changeHeaderTab({ tab: "ALL" });
      },
      selectKeyword(){
        tagsService.tagOpportunity(this.keywordselected,this.link.id,this.link.campaign_id,this.business.id,this.contactselected).then((result) => {
            this.$emit("reloadOp")
        });
      },
      getColorClass(score){
        if(score <= 10){
          return "bg-primary";
        }
        if(score > 50){
          return " bg-success ";
        }
        if(score > 10 && score < 49){
         return "bg-warning"
        }
   },
   opentooltip(){
      this.tooltip=true
     },
    closetooltip(){
      this.tooltip=false
     },





      addTag (newTag) {
       const tag = {
        name: newTag,
        description: newTag,
        color: this.getRandomColor(),
      }
      tagsService.createTag(tag.name, tag.description, tag.color)
      .then((tag) => {

        tagsService.createLinkTag(this.link.id, tag.id).then( (response) => {

          this.getAllTags();
          this.value.push(tag);
          this.addOpportunityTag({link_id : this.link.id, tag : tag});


        } );
      }
      );

    },
    onChange (value, opportunity) {
      if (this.hover == true){
        if (value != undefined && value.length >0){
          this.value = value.filter(t => t.id != this.deleted.id);
        }
      }
    },
    selectLinkTag(tag){
      if (this.hover == false){
        tagsService.createLinkTag(this.link.id, tag.id);
        this.addOpportunityTag({link_id : this.link.id, tag : tag});
      }
    },
    removeLinkTag(tag){

      let tag_id = 0
      if(tag.tag_id !== undefined){
        tag_id = tag.tag_id
      }else{
        tag_id = tag.id
      }

      tagsService.removeLinkTag(this.link.id, tag_id)
      .then(() => {
        if (this.value != undefined && this.value.length >0){

          this.value = this.value.filter(t => t.id != tag.id);
        }
        this.removeOpportunityTag({link_id : this.link.id, tag : tag});
        // this.getAllTags();
      }
      );
    },
    removeTag(tag){
      this.deleted = tag;
      tagsService.removeTag(tag.id)
      .then(() => {
        this.options = this.options.filter(t => t.id !=  this.deleted.id);
      });
    },
    newTag (newTag) {
     const tag = {
      name: newTag,
      description: newTag,
      color: this.getRandomColor(),
    }
    tagsService.createTag(tag.name, tag.description, tag.color)
    .then((tag) => {
      tagsService.createLinkTag(this.link.id, tag.id).then( (response) => { } );
      }
     );




  },
 
  getRandomColor() {
    var r, g, b, rg, gb, rb;
      var range = 180; // controls the range of r,g,b you would like
      //reduce the range if you want more darker colors
      var sep = range / 4; // controls the minimum separation for saturation
      //note- keep sep < range/3 otherwise may crash browser due to performance
      //reduce the sep if you do not mind pastel colors
      //generate r,g,b, values as long as any difference is < separation
      do {
        r = Math.floor(Math.random() * range);
        g = Math.floor(Math.random() * range);
        b = Math.floor(Math.random() * range);

        rg = Math.abs(r - g);
        gb = Math.abs(g - b);
        rb = Math.abs(r - b);
      } while (rg < sep || gb < sep || rb < sep);

      //convert the rgb to hex

      function rgbtohex(rgb) {
        var first, second; // makes the two hex code for each rgb value

        first = Math.floor(rgb / 16); //get first unit of hex
        second = rgb % 16; //get second unit of hex
        // convert to string with hex base 16
        first = first.toString(16);
        second = second.toString(16);
        //concatenate the two units of the hex
        var rgbtohex = first + second;
        //return the two unit hex code for the r,g,b value
        return rgbtohex;
      }

      //convert the r,g,b numbers to hex code by calling the rgbto hex function
      var r_str = rgbtohex(r), g_str = rgbtohex(g), b_str = rgbtohex(b);
      //concatenate the final string for the output
      var final = r_str + g_str + b_str;

      //output random color
      return final;
    },



    executeAction(action) {
      this.$emit(action,{
        linkId: this.link.id,
        statusReason: "24"
      });
    },
    getAllByLinkId(){
      tagsService.getAllByLinkId(this.link.id).then(
        (tags) => {
          if(tags.length > 0){
            for(let i=0; i<tags.length; i++){

             this.value.push({
              "id": tags[i].id,
              "name": tags[i].tag_name,
              "description": tags[i].description,
              "client_id": null,
              "color": tags[i].color,
              "tag_id": tags[i].tag_id
            })

           }

         }


       } );
    },
    getAllTags() {
      tagsService.getAllByClientId().then((tags) => {
        this.options = tags
      });
    },
    getKeyWordGroups() {
      tagsService.getKeyWordGroups().then((result) => {
        this.keywordgroups = result
      });
    },

    updateTag(tag, id){
    },
    isContactManager(contact) {
      return contact.role != null && contact.role.length !== 0;
    }
  }
};
</script>
<style>

.bootstrap-datetimepicker-widget.dropdown-menu.usetwentyfour.bottom.pull-right{
  top: auto!important; 
  bottom: auto!important; 
  left: -250px!important; 
  right: 0px!important;

}
.dropMenuTop .dropdown-menu.show{
  left: -70px !important;
}
</style>