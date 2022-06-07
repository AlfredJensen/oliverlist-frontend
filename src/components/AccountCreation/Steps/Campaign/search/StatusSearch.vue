<template>
  
<div class="p-2">
      <div class="form-check mt-2 mb-3" v-if="false">
        <input 
        id="newcontacts"
        v-model="default_values.status.newcontacts"
        class="  cursor-pointer form-check-input" type="checkbox">
        <label class=" cursor-pointer form-check-label" for="newcontacts">
          {{$t('lang.label.newavailablecontacts')}}
        </label>
      </div>
      <div class="form-check mt-2 mb-3"  v-if="false">
        <input 
        id="imported"
        :disabled="default_values.imported"
        v-model="default_values.status.buy"
        class="  cursor-pointer form-check-input" type="checkbox">
        <label class=" cursor-pointer form-check-label" for="imported">
          {{$t('lang.label.contactsalreadypurchased')}}
        </label>
        </input>
      </div>
      <div class="form-check mt-2 mb-3">
        <input 
        id="engaged"
        v-model="default_values.status.engaged"
        class="  cursor-pointer form-check-input" type="checkbox">
        <label class=" cursor-pointer form-check-label" for="engaged">
          {{$t('lang.label.active')}}
        </label>
      </div>
      <div class="form-check mt-2 mb-3">
        <input 
        id="notengaged"
        v-model="default_values.status.notengaged"
        class="  cursor-pointer form-check-input" type="checkbox">
        <label class=" cursor-pointer form-check-label" for="notengaged">
          {{$t('lang.label.inactive')}}
        </label>
      </div>

      <div 
      v-if="default_values.imported"
      class="form-check mt-2 mb-3">
        <input 
        id="bounced"
        v-model="default_values.status.bounced"
        class="  cursor-pointer form-check-input" type="checkbox">
        <label class=" cursor-pointer form-check-label" for="bounced">
          Bounced
        </label>
        <h6>
          <small>{{$t('lang.mycontacts.bouncedemail')}}</small>
        </h6>
      </div>       
      <div 
      class="form-check mt-2 mb-3">
        <input 
        id="donotcontact"
        v-model="default_values.status.donotcontact"
        class="  cursor-pointer form-check-input" type="checkbox">
        <label class=" cursor-pointer form-check-label" for="donotcontact">
          {{$t('lang.button.donotcontact')}}
        </label>
      </div>
</div>



</template>
<script>
export default {
  data(){
    return {
      engaged:false,
      notengaged:false,
      buy:false,
      notbuy:false,
      newcontacts:false,
      donotcontact:false
    }
  },
  props: {
    option_list: Array,
    default_values: Object,
  },
  created() {
  },
}
</script>