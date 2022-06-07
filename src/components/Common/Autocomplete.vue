<template>
  <div>
    
      <input
         type="text"
         ref="search"
         v-model="location"
        @focus="geolocate()"
      />

  </div>
</template>

<script>
import Vue from 'vue';
import { gmapsMixin } from "@/_mixins/";


export default {

  data() {
    return {
        location:'',
        autocomplete: false,
        componentForm : {
          street_number: "short_name",
          route: "long_name",
          locality: "long_name",
          administrative_area_level_1: "short_name",
          country: "long_name",
          postal_code: "short_name",
        }
    }
  },
 
  mixins: [gmapsMixin],
  
  mounted() {
    this.checkAndAttachMapScript(this.initLocationSearch);
  },

  created(){
    
  },

  methods:{
    geolocate(){
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const geolocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          const circle = new google.maps.Circle({
            center: geolocation,
            radius: position.coords.accuracy,
          });
          autocomplete.setBounds(circle.getBounds());
        });
      }
    },
    initLocationSearch() {
      let options =  {
    componentRestrictions: { country: "fr" },
    types: ["geocode"],
  };

       let autocomplete = new window.google.maps.places.Autocomplete(this.$refs.search,options);
       autocomplete.addListener("place_changed", function() {
          let place = autocomplete.getPlace();
          if (place && place.address_components) {
             console.log(place.address_components);
          }
       });
    },
    fillInAddress() {
      const place = autocomplete.getPlace();
      for (const component in componentForm) {
        document.getElementById(component).value = "";
        document.getElementById(component).disabled = false;
      }
      for (const component of place.address_components) {
        const addressType = component.types[0];

        if (componentForm[addressType]) {
          const val = component[componentForm[addressType]];
          document.getElementById(addressType).value = val;
        }
      }
    }
  }

}

</script>