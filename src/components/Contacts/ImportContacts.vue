<template>
  <section class="import">
    <div class="uploadbox" v-if="parseCsv.length == 0">
        <div class="p-2 mt-3 mb-1 rounded text-center">
          <div class="col-12 text-left mt-4">
            <h3 v-html="$t('lang.mycontacts.importyourdataintooliverlist')"></h3>
            <p>
  {{ 
  $t('lang.mycontacts.importyourdataintooliverlisttext',{ quantity:toastNotificationData.importlimit}) }}
            </p>
            <div class="download-template mt-2 mb-4">
              <a href="./files/oliver-import-template.csv" class="text-primary">
                {{ $t("lang.mycontacts.downloadsampletemplate") }}</a
              >
          </div>
        </div>
        <div class="row">
        <div class="col-md-3">
          <label class="d-inline">{{ $t('lang.mycontacts.importname') }}</label>
          <input
            @change="importid=false"
            type="text"
            size="30"
            class="form-control d-inline ml-2 mb-1"
            v-model="importname"
          />
          <small class="d-block mb-3 ">{{ $t('lang.mycontacts.importdesc') }}</small>
 
          <div v-if="importlist.length > 0" class="mb-3" >
           {{$t('lang.mycontacts.importselect')}}:
            <select class="form-control" v-model="importid" @change="selectList">
              <option value="" selected>-None-</option>
              <option  v-for="item in importlist" :key="item.id" :value="item.id" >{{item.name}}</option>
            </select>
          <small class="d-block mb-3  ">{{ $t('lang.mycontacts.importlistdesc') }}</small>
          </div>



        </div>
        <div class="col-md-9">
          <VueCsvImport
            id="importcontacts"
            v-model="parseCsv"
            headers="true"
            url="#"
            :autoMatchFields="true"
            :autoMatchIgnoreCase="true"
            buttonClass="btn btn-sm btn-primary"
            :loadBtnText="$t('lang.button.continue')"
            :fileMimeTypes="['text/csv', 'application/vnd.ms-excel']"
            :map-fields="fields"
            :key="importkey"
          >

          <template slot="submit" slot-scope="{ submit }">
            <button
              class="btn btn-success btn-sm w-100 p-4"
              @click.prevent="submit"
              @click="uploadContacts()"
            >
              {{ $t("lang.label.previewimport") }}
            </button>
          </template>

          <template slot="thead">
            <tr>
              <th colspan="2">
                <div class="p-2 mb-2 rounded bg-secondary">
                  <p class="text-white small" v-html="$t('lang.mycontacts.requiredfields')" >
                  </p>
                </div>
              </th>
            </tr>
            <tr>
              <th>{{ $t("lang.label.olivercolumns") }}</th>
              <th>{{ $t("lang.label.csvcolumns") }}</th>
            </tr>
          </template>
        </VueCsvImport>
        </div>
        </div>
      </div>
    </div>

    <div v-if="importing && !importingfinish">

      <div class="progress">
        <div
          class="progress-bar"
          role="progressbar"
          :style="getProgress()"
          aria-valuenow="25"
          aria-valuemin="0"
          aria-valuemax="100"
        ></div>
      </div>
    </div>

    <div class="wrappList animated fadeIn fast" v-if="parseCsv.length > 0">
      <div v-if="!importing">
        <button
          v-if="error == false"
          class="w-100 float-left mt-2 btn btn-success btn-sm"
          @click="startImport()"
        >
          <i class="icon-upload"></i>
          {{ $t("lang.label.startimport") }}
        </button>

        <div class="p-2 rounded bg-danger text-white" v-if="error != false">
          <i class="icon-warning"></i> {{ this.$t("lang.mycontacts." + error) }}
        </div>

        <h5 class="mt-4">
          {{ $t("lang.label.readytoimport") }} {{ parseCsv.length }}
          {{ $t("lang.label.contacts") }}
        </h5>
      </div>
      <div v-if="importing && !importingfinish">
        Importing {{ progress }} of {{ parseCsv.length }} contacts
      </div>
      <div v-if="importing && importingfinish" class="mt-4">{{$t('lang.column.results')}}:
      <strong>
{{ 
$t('lang.mycontacts.importyourdataintooliverlisttext',{ quantity:toastNotificationData.importlimit}) }}</strong>

      </div>
      <div v-if="importing && !importingfinish">
        <button @click="clickpause()" v-if="!pause" class="btn btn-danger">
          <i class="icon-pause"></i>
        </button>
        <button @click="clickplay()" v-if="pause" class="btn btn-success">
          <i class="icon-play"></i>
        </button>
      </div>

      <button
        @click="finishImport()"
        v-if="importing && importingfinish == false"
        class="btn btn-sm btn-warning"
      >
        {{ $t("lang.button.cancel") }}
        <i class="icon-close"></i>
      </button>
      <div class="table-responsive" v-if="!importing">
        <table class="table table-hover card-style">
          <thead>
            <tr>
              <th v-for="(header, key) in headers">{{ header }}</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(company, key) in exampleList"
              :key="key"
              class="shadow-sm p-3 mb-3 bg-white rounded"
            >
              <td v-for="(header, key2) in headers">{{ company[key2] }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div id="preview" v-if="resultProgress.length > 0">
      <ul class="h-100 d-inline-block">
        <li v-for="(result, key) in resultProgress">
          <small class="text-danger" :class="result">
            {{ $t(result) }}</small
          >
        </li>
      </ul>
    </div>
  </section>
</template>


<script>
import { businessContactsService } from "@/_services";
import { VueCsvImport } from "vue-csv-import";

export default {
  components: {
    VueCsvImport,
  },
  props: {},
  data() {
    return {
      importkey: 1,
      pause: false,
      importlist:[],
      importname:"",
      importid:false,
      importing: false,
      resultProgress: [],
      importingfinish: false,
      exampleList: [],
      parseCsv: [],
      progress: 0,
      headers: {},
      error: false,
    };
  },
  computed: {
    fields: function () {
      return this.headers;
    },
    toastNotificationData() {
        return this.$store.state.authentication.toastNotificationData;
    },
  },
  created() {
    this.importname = "Import CSV - " + Date.now();
    this.getMyCustomFields();
  },
  methods: {
    selectList(){
      this.importname = ""
    },
    getMyCustomFields() {
      this.headers = {
        first_name: this.$t("lang.column.firstname"),
        last_name: this.$t("lang.column.lastname"),
        post: this.$t("lang.column.jobtitle"),
        email: this.$t("lang.label.email"),
        company: this.$t("lang.column.company"),
        phone: this.$t("lang.column.phone"),
        country: this.$t("lang.column.country"),
        city: this.$t("lang.column.city"),
        postal_code: this.$t("lang.label.postalcode"),
        address: this.$t("lang.column.address"),
        website: this.$t("lang.column.website"),
        linkedin: "Linkedin",
      };

      businessContactsService.getCustomFields().then((response) => {
        if (response) {
          response.forEach((item, key) => {
            this.headers["custom_field_" + item.id] = item.label;
          });
        }
        this.importkey++;
      });

      businessContactsService.getImportList().then((result) => {
        this.importlist = result
      });

    },
    finishImport() {
      this.importingfinish = true;
      this.$emit("finishImported");
      this.$forceUpdate();
    },
    startImport() {
      this.importing = true;
      if (this.parseCsv.length == this.progress || this.progress == this.toastNotificationData.importlimit) {
        this.finishImport();
        return;
      }

      this.importContact(this.parseCsv[this.progress]);
    },
    clickpause() {
      this.pause = true;
    },
    clickplay() {
      this.pause = false;
      this.startImport();
    },
    getProgress() {
      let percentage = (this.progress * 100) / this.parseCsv.length;
      return "width: " + percentage + "%";
    },
    importContact(contact) {
      businessContactsService.importContact(contact,this.importname,this.importid).then((result) => {
        if (this.pause) {
          return;
        }

        this.progress++;
        this.startImport();
        this.$emit("contactImported");
        if (result == "business-contact-exists") {
          this.resultProgress.push(
            contact.email + ": " + this.$t("lang.mycontacts." + result)
          );
        } else {
          this.resultProgress.push(result);
        }
      });
    },
    uploadContacts() {
      this.exampleList = [];
      for (var i = 0; i < 10 && i < this.parseCsv.length; i++) {
        this.exampleList.push(this.parseCsv[i]);
      }
      if (this.exampleList[0] == undefined) {
        this.error = "csvempty";
        return;
      }
      console.log(this.exampleList[0]["company"]);
      if (this.exampleList[0]["company"] == undefined) {
        this.error = "notcompany";
        return;
      }
      if (this.exampleList[0]["email"] == undefined) {
        this.error = "notemail";
        return;
      }
    },
  },
};
</script>

<style>
.vue-csv-uploader-part-one {
  width: 100%;
  float: left;
}
.vue-csv-uploader-part-two {
  width: 100%;
  float: left;
}
.import .wrappList table,
.vue-csv-uploader-part-two table {
  width: 100% !important;
  text-align: left;
}
#preview {
  height: 100vh;
  overflow: scroll !important;
  width: 100% !important;
}
#preview small.text-danger.contact-imported {
  color: #53be80 !important;
}
.linedotted {
  border-style: dashed !important;
}
.form-control-file {
  display: block;
  position: relative;
  width: 200px !important;
  margin: auto;
  cursor: pointer;
  height: 40px;
  border-radius: 5px;
  outline: 0;
  border: 1px solid #909090;
  border-style: dashed;
  padding: 15px;
}
.form-control-file:hover:after {
  background: #5978f8;
}
.form-control-file:after {
  transition: 200ms all ease;
  border-bottom: 3px solid rgba(0, 0, 0, 0.2);
  background: #3c5ff4;
  text-shadow: 0 2px 0 rgba(0, 0, 0, 0.2);
  color: #fff;
  font-size: 16px;
  text-align: center;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: block;
  content: "Select CSV File";
  line-height: 40px;
  border-radius: 5px;
}

.download-template > div {
  color: grey;
  position: relative;
  font-weight: bold;
}
.download-template > div:before,
.download-template > div:after {
  position: absolute;
  display: block;
  width: 100px;
  height: 1px;
  content: "";
  background: grey;
  right: calc(50% + 25px);
  top: 10px;
}
.download-template > div:after {
  right: inherit;
  left: calc(50% + 25px);
}
</style>
