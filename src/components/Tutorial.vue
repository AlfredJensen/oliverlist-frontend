<template>
  <small class="tutorial">
      
    <a v-if="playListurl" target="_blank" class="cursor-pointer" 
        :href="playListurl">
      <span class=" mr-2" :class="textColor ? textColor : 'text-primary'">
      <span class="icon-book" :class="textColor ? textColor : 'text-primary'"></span>
      {{ $t('lang.label.howtostart') }} </span>
       </a>
    

    <a v-if="videoUrl" href="#" @click="openModal()">
      <span class="" :class="textColor ? textColor : 'text-primary'">
      <span class="icon-video-camera mr-1" :class="textColor ? textColor : 'text-primary'"></span>
      <span v-if="!videoTitle">{{ $t('lang.label.watchvideo') }}</span>
      <span v-if="videoTitle">{{ videoTitle }}</span> </span>
    </a>
    <div class="">
      <modal
        :name="modalName"
        :clickToClose="true"
        class="modal-preview"
        :resizable="true"
        height="auto"
        width="70%"
        :max-width="800"
      >
        <div class="pr-2 pt-1">
          <button
            type="button"
            class="close"
            data-dismiss="alert"
            aria-label="Close"
            @click="closeModal()"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>

        <div class="">
          <div class="">
            <slot name="info"> </slot>
          </div>
          <div class="embed-responsive embed-responsive-16by9 mt-3">
            <iframe
              class="embed-responsive-item"
              :src="videoUrl"
              :title="videoTitle === undefined ? linkText : videoTitle"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            ></iframe>
          </div>
        </div>
      </modal>
    </div>
  </small>
</template>

<script>
export default {
  props: {
    id: {
      type: String,
      required: false,
    },
    autoplay: {
      type: Boolean,
      required: false,
      default_values: false,
    },
    linkText: {
      type: String,
      required: false,
    },
    linkClass: {
      type: String,
      required: false,
    },
    textColor: {
      type: String,
      required: false,
      default_values:'text-primary'
    },
    videoUrl: {
      type: String,
      required: false,
    },
    videoTitle: {
      type: String,
    },
    playListurl: {
      type: String,
      required: false,
    },
  },

  data: () => ({}),

  mounted() {
    if(this.autoplay){
      this.openModal()
    }

  },

  computed: {
    modalName() {
      return "modal-" + this.id;
    },
  },

  methods: {
    openModal() {
      this.$modal.show(this.modalName);
    },
    closeModal() {
      this.$modal.hide(this.modalName);
    },
  },
};
</script>
<style>
.tutorial{
  z-index: 10000;
}
</style>