<template>
<section class="float-left w-100 text-left">
  <label class="mt-3" >
     {{ $t('lang.search.location') }}
    </label>
      <gmap-autocomplete 
      v-if="modify"
      class="form-control mb-2"
      @place_changed="updateCenter($event)" />
    <small class="d-block text-secondary mb-3"  v-if="modify">{{$t('lang.ondemand.locationdesc')}}</small>


  <GmapMap
    :center="center"
    :zoom="actualzoom"
    :key="keymap"
    :options="optionsmap"
    ref="mapRef"
    :scrollwheel="true"
    map-type-id="terrain"
    style="width: 100%; height: 500px"
    @click="addPathNow()"
    @zoom_changed="zoomChange($event)"
  >
    <GmapMarker
      :key="index"
      :icon="iconmarker"
      v-for="(m, index) in markers"
      :position="m"
      :clickable="false"
      :draggable="false"
      :scrollwheel="false"
      @click="center=m"
    />
    <GmapMarker
      :key="'pro-'+index2"
      :icon="iconprocessed"
      v-for="(m, index2) in processed"
      :position="m"
      :clickable="false"
      :draggable="false"
      :scrollwheel="false"
      @click="center=m"
    />

    <gmap-polygon 
    v-if="paths.length > 0" 
    :paths="paths" 
    :editable="this.modify" 
    :draggable="this.modify"
    :options="PolygonOptions"
    @paths_changed="updateEdited($event)"
    @dragstart="dragstart()"
    @dragend="dragend()"
    @click="handleClickForDelete"
          ref="polygon">
      </gmap-polygon>
  </GmapMap>
</section>
</template>
<script>
import Vue from 'vue';
import GmapCluster from 'vue2-google-maps/dist/components/cluster';
import * as VueGoogleMaps from 'vue2-google-maps';
 
export default {
  mounted () {
    if(this.modify){
      this.$refs.mapRef.$mapPromise.then((map) => {
        map.panTo(this.center)
        this.addPath(map,true)
      })
    }
  },
  components: {
    GmapCluster,
  },
  created () {
    this.actualzoom = this.zoom
    this.paths = this.coordinates
    if(this.thecenter){
        this.center = this.thecenter
    }
    this.iconmarker = require('@/assets/images/pin-shops.png')
    this.iconprocessed = require('@/assets/images/checkmark.png')
  },
  data() {
    return {
      keymap:1,
      centerpos:'',
      mvcArrayAnt:[],
      pathAnt:[],
      dragging:false,
      center:{lat: 48.83, lng: 2.37},
      paths: [],
      actualzoom:12,
      PolygonOptions : {
          strokeColor: "#0000ff",
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: "#0000ff",
        },
      optionsmap : {
         zoomControl: true,
         mapTypeControl: false,
         scaleControl: false,
         streetViewControl: false,
         rotateControl: false,
         fullscreenControl: false,
         disableDefaultUI: false
       }
    };
  }, 
  props: {
    zoom: {
      type: Number,
      required: false,
      default: 12
    },
    limitzoom: {
      type: Number,
      required: false,
      default: 7
    },
    limited:false,
    processed:Array,
    modify:true,
    thecenter:false,
    coordinates:Array,
    markers:Array,
  },
 methods: {
          zoomChange(z){

            if(z < this.limitzoom && this.limited){
              
                 this.$swal({
                  type: "warning",
                  title: this.$t('lang.label.restrictedaccess'),
                  text: "",
                  showCancelButton: true,
                  confirmButtonColor: "#3085d6",
                  cancelButtonColor: "#d33a2c",
                  confirmButtonText: this.$t("lang.button.upgrade"),
                  cancelButtonText: this.$t("lang.button.cancel"),
                }).then((result) => {
                  this.$refs.mapRef.$mapObject.setZoom(this.limitzoom);
                  this.actualzoom = this.limitzoom
                  if (result.value) {
                     if(result.value == true){
                        this.$router.push('/upgrade'); 
                      }  
                  }
                });
            }else{
               this.actualzoom = z
            }
            this.$emit("zoom",this.actualzoom)


          },

          updateCenter: function (place) {
            this.center = {
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
            }
            this.showPolygon()
          },
          showPolygon(){

            this.$refs.mapRef.$mapPromise.then((map) => {
              map.panTo(this.center)
              this.addPath(map,true)
            })
          },
          dragstart(){
           this.dragging=true
          },
          dragend(){
           this.dragging=false
          },

          updateEdited: function (mvcArray) {
            if(!this.modify)
              return;
            let coords=[]

            let newpaths = []
            let mvcArrayNew = []

            for (let i = 0; i < mvcArray.getLength(); i++) {
              for (let j = 0; j < mvcArray.getAt(i).getLength(); j++) {

                let a = mvcArray.getAt(i).getAt(j).lat()
                let b = mvcArray.getAt(i).getAt(j).lng()

                let coord = a + "," + b;

                newpaths.push({lng:b,lat:a})

                coords.push( coord );
              }
            }

            this.centerpos = coords[0];
            this.$emit("centerpos",this.centerpos)
          



            if(!this.dragging && this.limited){
                let error = false

                if(coords.length > 4){

                  error = true

                }else{

                  let a = ""
                  let b = ""
                  let c = ""
                  let d = ""
                  
                  let cor = coords[0].split(",")
                  let pos1lat = cor[0];
                  let pos1lng = cor[1];
                  cor = coords[1].split(",")
                  let pos2lat = cor[0];
                  let pos2lng = cor[1];
                  cor = coords[2].split(",")
                  let pos3lat = cor[0];
                  let pos3lng = cor[1];
                  cor = coords[3].split(",")
                  let pos4lat = cor[0];
                  let pos4lng = cor[1];

                  
                  let diff = parseFloat(pos1lat) - parseFloat(pos2lat)
                  let diff2 = parseFloat(pos3lat) - parseFloat(pos4lat) 


                  if(diff2 < 0){
                    diff2 = diff2*-1;
                  }
                  if(diff < 0){
                    diff = diff*-1;
                  }


                  if(
                  (
                    diff > 0 
                      || 
                    diff2 > 0 
                    )
                   ){
                    error = true
                  }

                  diff = parseFloat(pos1lng).toFixed(2) - parseFloat(pos4lng).toFixed(2)
                  if(diff < 0){
                    diff = diff*-1;
                  }
                  diff2 = parseFloat(pos2lng).toFixed(2) - parseFloat(pos3lng).toFixed(2)
                  if(diff2 < 0){
                    diff2 = diff2*-1;
                  }
                  if(
                  (
                    diff > 0
                  || diff2 > 0  
                    )
                   ){
                    error = true
                  }
                  

                }
                if(error && this.limited){
                
                  this.$swal({
                  type: "warning",
                  title: this.$t('lang.label.restrictedaccess'),
                  text: "",
                  showCancelButton: true,
                  confirmButtonColor: "#3085d6",
                  cancelButtonColor: "#d33a2c",
                  confirmButtonText: this.$t("lang.button.upgrade"),
                  cancelButtonText: this.$t("lang.button.cancel"),
                }).then((result) => {

                  this.removePath()
                  this.paths.push(this.pathAnt)
                  this.updateEdited2(this.mvcArrayAnt,first)

                  if (result.value) {
                     if(result.value == true){
                        this.$router.push('/upgrade'); 
                      } 
                  }
                });

                }else{

                  this.mvcArrayAnt = coords
                  this.pathAnt = newpaths
                  this.$emit("setCoordinates",coords)
                }
          }else{

                  this.mvcArrayAnt = coords
                  this.pathAnt = newpaths
                  this.$emit("setCoordinates",coords)
                }

          },

          updateEdited2: function (mvcArray,first) {
            let coords=mvcArray
            if(!first){
              this.$emit("setCoordinates",coords)
            }
          },

          addPathNow(map){
            if(!this.modify){
              return;
            }
            this.addPath(map,false)
          },

          addPath: function (mapObject,first) {



            // obtain the bounds, so we can guess how big the polygon should be
          
            if(mapObject == undefined){
              mapObject = this.$refs.mapRef.$mapObject
            }

            var degree = 4;

            var bounds = mapObject.getBounds()

            if(bounds === undefined){
              var degree = 0;

              bounds = new google.maps.LatLngBounds(
                  new google.maps.LatLng(48.845,2.29),
                  new google.maps.LatLng(48.865916,2.36)
              );

            }

            var northEast = bounds.getNorthEast()
            var southWest = bounds.getSouthWest()
            var center = bounds.getCenter()

            this.centerpos = center.lat() + "," + center.lng();
            this.$emit("centerpos",this.centerpos)
          
            var f = Math.pow(0.66, degree)


            // Draw a triangle. Use f to control the size of the triangle.
            // i.e., every time we add a path, we reduce the size of the triangle
            let coords=[]

            let latlng


            latlng = (1-f) * center.lng() + (f) * southWest.lng()+','+(1-f) * center.lat() + (f) * southWest.lat();
            coords.push(latlng)
            latlng = (1-f) * center.lng() + (f) * northEast.lng()+','+(1-f) * center.lat() + (f) * southWest.lat();
            coords.push(latlng)
            latlng = (1-f) * center.lng() + (f) * northEast.lng()+','+(1-f) * center.lat() + (f) * northEast.lat();
            coords.push(latlng)
            latlng = (1-f) * center.lng() + (f) * southWest.lng()+','+(1-f) * center.lat() + (f) * northEast.lat();
            coords.push(latlng)
            
            if(!first){
              this.$emit("setCoordinates",coords)
            }

            var pos1lng = (1-f) * center.lng() + (f) * southWest.lng()
            var pos1lat = (1-f) * center.lat() + (f) * southWest.lat()
            var pos2lng = (1-f) * center.lng() + (f) * northEast.lng()
            var pos2lat = (1-f) * center.lat() + (f) * southWest.lat()
            var pos3lng = (1-f) * center.lng() + (f) * northEast.lng()
            var pos3lat = (1-f) * center.lat() + (f) * northEast.lat()  
            var pos4lng = (1-f) * center.lng() + (f) * southWest.lng()
            var pos4lat = (1-f) * center.lat() + (f) * northEast.lat()

            var path = [
              { lng: pos1lng, 
                lat:  pos1lat },

              { lng: pos2lng, 
                lat:  pos2lat },

              { lng: pos3lng, 
                lat: pos3lat },
              

              { lng: pos4lng, 
                lat:  pos4lat },
            ]

             this.pathAnt = [
              { lng: pos1lng, 
                lat:  pos1lat },

              { lng: pos2lng, 
                lat:  pos2lat },

              { lng: pos3lng, 
                lat: pos3lat },
              

              { lng: pos4lng, 
                lat:  pos4lat },
            ]
            

            let mvcArray;
            mvcArray = new Array();
            mvcArray.push(pos1lat+','+pos1lng)
            mvcArray.push(pos2lat+','+pos2lng)
            mvcArray.push(pos3lat+','+pos3lng)
            mvcArray.push(pos4lat+','+pos4lng)
            this.updateEdited2(mvcArray,first)

            this.mvcArrayAnt = mvcArray;


            this.paths = []
            this.paths.push(path)

          },
          removePath: function () {
           if(!this.modify)
              return;
            this.paths.splice(this.paths.length - 1, 1)
          },
          handleClickForDelete($event) {
            if(!this.modify)
              return;

            if ($event.vertex) {
              this.$refs.polygon.$polygonObject.getPaths()
                .getAt($event.path)
                .removeAt($event.vertex)
            }
          },
          readGeojson: function ($event) {
            try {
              this.polygonGeojson = $event.target.value

              var v = JSON.parse($event.target.value);

              this.paths = v.coordinates.map(linearRing =>
                linearRing.slice(0, linearRing.length - 1)
                .map(([lng, lat]) => ({lat, lng}))
              )


              this.errorMessage = null
            } catch (err) {
              this.errorMessage = err.message
            }
          }
        }
}

Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyBC_P0f8Vc5jpGZnZZ0bBVOnNLkRos5T4s',
    libraries: 'places', // This is required if you use the Autocomplete plugin
    
  },
 
})

</script>
<style>
.vue-map-container .vue-map {
  width:100%;
  height:500px;
}

</style>