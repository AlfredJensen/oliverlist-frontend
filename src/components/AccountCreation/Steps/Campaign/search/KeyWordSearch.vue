<template>
  <div>
    <section>
      <div class="accordion" id="accordionExample">
        <div class="">
          <div class="" id="headingOne" v-if="enabled[0]">
            <h2 class="mb-0">
              <button
                class="btn btn-sm btn-link"
                type="button"
                data-toggle="collapse"
                data-target="#collapseOne"
                aria-expanded="false"
                aria-controls="collapseOne"
              >
                {{ $t("lang.search.isanyof") }}
                <small v-if="tags_any.length > 0">
                  <span class="badge-primary badge-sm rounded px-1 ml-1">{{
                    tags_any.length
                  }}</span></small
                >
              </button>
            </h2>
          </div>

          <div
            id="collapseOne"
            :key="cant"
            class="collapse show"
            aria-labelledby="headingOne"
            data-parent="#accordionExample"
            v-if="enabled[0]"
          >
            <div class="">
              <multiselect
                v-model="tags_any"
                v-bind:tag-placeholder="$t('lang.search.add')"
                v-bind:placeholder="$t('lang.search.addoneorseveralwords')"
                label="word"
                track-by="id"
                :options="tags_any"
                :multiple="true"
                :taggable="true"
                :searchable="true"
                :showLabels="true"
                openDirection="below"
                class="small"
                @remove="removeTag($event, tags_any, 'anyof')"
                @tag="addTag($event, tags_any, 'anyof')"
              >
                <template slot="tag" slot-scope="props">
                  <span class="mr-1 p-1 text-white rounded bg-primary">
                    <span v-text="props.option.word"></span>
                    <i
                      @click="removeTag(props.option, tags_any, 'anyof')"
                      class="icon-close pl-1 cursor-pointer"
                    ></i>
                  </span>
                </template>
              </multiselect>
            </div>
          </div>
        </div>
        <div class="">
          <div class="" id="headingTwo" v-if="enabled[1]">
            <h2 class="mb-0">
              <button
                class="btn btn-sm btn-link collapsed"
                type="button"
                data-toggle="collapse"
                data-target="#collapseTwo"
                aria-expanded="false"
                aria-controls="collapseTwo"
              >
                {{ $t("lang.search.isnotanyof") }}
                <small v-if="tags_not_any.length > 0">
                  <span class="badge-primary badge-sm rounded px-1 ml-1">{{
                    tags_not_any.length
                  }}</span></small
                >
              </button>
            </h2>
          </div>
          <div
            id="collapseTwo"
            class="collapse"
            aria-labelledby="headingTwo"
            data-parent="#accordionExample"
            v-if="enabled[1]"
          >
            <div class="">
              <multiselect
                v-model="tags_not_any"
                v-bind:tag-placeholder="$t('lang.search.add')"
                v-bind:placeholder="$t('lang.search.addoneorseveralwords')"
                label="word"
                track-by="id"
                :options="tags_not_any"
                :multiple="true"
                :taggable="true"
                :searchable="true"
                :showLabels="false"
                openDirection="below"
                class="small"
                @remove="removeTag($event, tags_not_any, 'notanyof')"
                @tag="addTag($event, tags_not_any, 'notanyof')"
              >
                <template slot="tag" slot-scope="props">
                  <span class="multiselect__tag pr-2 py-1 bg-primary">
                    <span v-text="props.option.word"></span>

                    <i
                      @click="removeTag(props.option, tags_not_any, 'notanyof')"
                      class="icon-close pl-1 cursor-pointer"
                    ></i>
                  </span>
                </template>
              </multiselect>
            </div>
          </div>
        </div>
        <div v-if="false" class="">
          <div class="" id="headingThree" v-if="enabled[2]">
            <h2 class="mb-0">
              <button
                class="btn btn-link collapsed"
                type="button"
                data-toggle="collapse"
                data-target="#collapseThree"
                aria-expanded="false"
                aria-controls="collapseThree"
              >
                Is known
              </button>
            </h2>
          </div>
          <div
            id="collapseThree"
            class="collapse"
            aria-labelledby="headingThree"
            data-parent="#accordionExample"
            v-if="enabled[2]"
          >
            <div class="">
              <multiselect
                v-model="tags_know"
                v-bind:tag-placeholder="$t('lang.search.add')"
                v-bind:placeholder="$t('lang.search.addoneorseveralwords')"
                label="word"
                track-by="id"
                :options="tags_know"
                :multiple="true"
                :taggable="true"
                :searchable="true"
                :showLabels="false"
                openDirection="below"
                class="small"
                @remove="removeTag($event, tags_know, 'known')"
                @tag="addTag($event, tags_know, 'known')"
              >
                <template slot="tag" slot-scope="props">
                  <span class="multiselect__tag bg-primary">
                    <span v-text="props.option.word"></span>
                  </span>
                </template>
              </multiselect>
            </div>
          </div>
        </div>
        <div v-if="false" class="">
          <div class="" id="headingThree" v-if="enabled[3]">
            <h2 class="mb-0">
              <button
                class="btn btn-link collapsed"
                type="button"
                data-toggle="collapse"
                data-target="#collapseFour"
                aria-expanded="false"
                aria-controls="collapseFour"
              >
                Is unknown
              </button>
            </h2>
          </div>
          <div
            id="collapseFour"
            class="collapse"
            aria-labelledby="headingThree"
            data-parent="#accordionExample"
            v-if="enabled[3]"
          >
            <div class="">
              <multiselect
                v-model="tags_unknow"
                v-bind:tag-placeholder="$t('lang.search.add')"
                v-bind:placeholder="$t('lang.label.addoneorseveralwords')"
                label="word"
                track-by="id"
                :options="tags_unknow"
                :multiple="true"
                :taggable="true"
                :searchable="true"
                :showLabels="false"
                openDirection="below"
                class="small"
                @remove="removeTag($event, tags_unknow, 'unknown')"
                @tag="addTag($event, tags_unknow, 'unknown')"
              >
                <template slot="tag" slot-scope="props">
                  <span class="multiselect__tag bg-primary">
                    <span v-text="props.option.word"></span>
                  </span>
                </template>
              </multiselect>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
import Multiselect from "vue-multiselect";
import Vue from "vue";
Vue.component("multiselect", Multiselect);

export default {
  props: {
    default_values: {
      type: Object,
      required: true,
      default: () => {},
    },
    enabled: {
      type: Array,
      required: false,
      default: () => [true, true, false, false],
    },
  },
  data() {
    return {
      tags_any: [],
      tags_not_any: [],
      tags_know: [],
      tags_unknow: [],
      cant: 0,
    };
  },

  components: {
    Multiselect,
  },
  created() {
    this.init_tags("anyof");
    this.init_tags("notanyof");
    this.init_tags("known");
    this.init_tags("unknown");

  },
  methods: {
    init_tags(type) {
      if (this.default_values[type] === undefined) {
        this.default_values[type] = [];
      } else {
        switch (type) {
          case "anyof":
            this.tags_any = this.default_values[type];
            break;
          case "notanyof":
            this.tags_not_any = this.default_values[type];
            break;
          case "known":
            this.tags_know = this.default_values[type];
            break;
          case "unknown":
            this.tags_unknow = this.default_values[type];
            break;
        }
      }
    },
    addTag(newTag, tagsany, type) {
      const tag = {
        word: this.$sanitize(newTag),
      };
      tagsany.push(tag);
      if (tagsany != undefined && tagsany.length > 0) {
        tagsany = tagsany.filter((t) => t.word != tag.word);
        this.default_values[type] = tagsany;
      }
      this.default_values[type].push(tag);
      this.cant++;
      this.$emit("quantity", this.cant);
    },
    removeTag(tag, tagsany, type) {
      if (tagsany != undefined && tagsany.length > 0) {
        tagsany = tagsany.filter((t) => t.word != tag.word);
        this.default_values[type] = tagsany;
      }
      if (type == "anyof") {
        this.tags_any = tagsany;
      }

      if (type == "notanyof") {
        this.tags_not_any = tagsany;
      }

      if (type == "known") {
        this.tags_know = tagsany;
      }

      if (type == "unknown") {
        this.tags_unknow = tagsany;
      }
      this.cant--;
      this.$emit("quantity", this.cant);
    },
  },
};
</script>