<template>
  <div
    class="tab-pane fade show active"
    id="pill-comments"
    role="tabpanel"
    aria-labelledby="pills-tab-notes"
  >
    <div class="wrapperCard">
      <div class="p-3">
        <form>
          <div class="form-group">
            <textarea
              class="form-control mt-3"
              v-bind:placeholder="$t('lang.label.clickheretotakenotes')"
              id
              rows="3"
              v-model="comment"
            ></textarea>
          </div>
        </form>
        <div class="float-right pb-3">
          <button
          id="btn-send"
            class="btn btn-primary themed-button ml-1"
            :disabled="!canSave"
            @click="createComment"
          >{{ $t('lang.button.save') }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { linksService } from "@/_services";

export default {
  data() {
    return {
      comment: ""
    };
  },

  props: {
    linkId: String
  },

  watch:{
    'comment'(){
      this.comment = this.$sanitize(this.comment);
    },
  },

  computed: {
    user() {
      return this.$store.state.authentication.user;
    },

    canSave() {
      return this.comment != "";
    }
  },

  methods: {
    createComment() {
      const button = document.getElementById('btn-send');
      button.disabled = true;
      linksService.createComment(this.linkId, this.comment).then(comment => {
        // Creo una nueva fecha en el formato dd-mm-aaaa hh:mm:ss para el comentario
        var newDate = new Date();
        var creationDate =
          [
            newDate.getFullYear(),
            ("0" + (newDate.getMonth() + 1)).slice(-2),
            ("0" + newDate.getDate()).slice(-2)
          ].join("-") +
          " " +
          [
            ("0" + newDate.getHours()).slice(-2),
            ("0" + newDate.getMinutes()).slice(-2),
            ("0" + newDate.getSeconds()).slice(-2)
          ].join(":");

        var newComment = {
          id: "newComment",
          link_id: this.linkId,
          user_id: this.user.id,
          name: this.user.name + ' ' + this.user.lastname,
          type: "comment",
          comment: this.comment,
          creation_date: creationDate,
          user_name: this.user.name,
          user_lastname: this.user.lastname
        };

        this.comment = "";
        this.$emit("createComment", newComment);
      });
    }
  }
};
</script>