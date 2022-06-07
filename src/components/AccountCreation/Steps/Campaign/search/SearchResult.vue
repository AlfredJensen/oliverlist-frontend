<template>
  <div>
    <div
      id="actionsSearch"
      class="pt-2 pl-4 d-flex justify-content-between bd-highlight mb-3"
    >
      <div class="bd-highlight">
        {{ $t("lang.label.results") }}:
        <small v-if="!total" class="ml-1 text-primary"
          >{{ $t("lang.search.calculating") }}...</small
        >
        <strong v-else>{{ total }}</strong>
        <span
          :class="'badge-' + getColor()"
          class="badge-primary badge ml-2 p-2"
        >
          <span v-if="!list.allselected">{{ list.selectedIds.length }}</span>
          <span v-else>{{ totalSelectAll() }}</span>
          {{ $t("lang.search.selected") }}
        </span>
      </div>
      <div class="form" v-if="false">
        Max
        <select
          class="form-select form-select-sm"
          v-model="maxpercompany"
          @change="selectPerCompany"
        >
          <option value="1">One</option>
          <option value="2">Two</option>
          <option value="3" selected>Three</option>
          <option value="0">Unlimited</option>
        </select>
        people per company
      </div>
      <div>
        <Pagination
          v-if="!loading"
          :total="getTotalByUser()"
          :totalpage="list.contacts.list.length"
          :model="model"
          :color="getColor()"
          :limit="limitPagination"
          @changePage="changePage"
          key="paginationkey"
        ></Pagination>
      </div>
      <div>
        <button
          :disabled="list.selectedIds.length == 0 || deleting"
          :class="
            list.selectedIds.length == 0 ? 'btn-secondary' : 'btn-primary'
          "
          v-if="!campaignedit && model.imported"
          type="button"
          @click="deleteImport"
          class="rounded ml-2 btn btn-sm btn-danger"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
        >
          {{ $t("lang.label.remove") }}
          <span v-if="!list.allselected">{{ list.selectedIds.length }}</span>
          <span v-else>{{ totalSelectAll() }}</span>
          {{ $t("lang.search.selected") }}
        </button>

        <button
          :disabled="list.selectedIds.length == 0"
          :class="
            list.selectedIds.length == 0 ? 'btn-secondary' : 'btn-primary'
          "
          v-if="
            campaignedit && model.status !== undefined && model.status.notbuy
          "
          type="button"
          @click="deleteSelected"
          class="rounded ml-2 btn btn-sm btn-primary"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
        >
          {{ $t("lang.search.deleteselectionfromcampaign") }}
        </button>

        <button
          :disabled="list.selectedIds.length == 0"
          :class="
            list.selectedIds.length == 0 ? 'btn-secondary' : 'btn-primary'
          "
          v-if="
            campaignedit && model.status !== undefined && model.status.engaged
          "
          type="button"
          @click="dactivateSelected"
          class="rounded ml-2 btn btn-sm btn-primary"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
        >
          {{ $t("lang.search.removefromallcampaigns") }}
        </button>

        <div class="btn-group dropleft" v-if="!campaignedit">
          <button
            v-if="!model.imported && false"
            @click="saveSelected()"
            :disabled="list.selectedIds.length == 0"
            :class="
              list.selectedIds.length > 0
                ? 'btn-' + getColor() + '  effect-btn'
                : ''
            "
            class="ml-2 rounded btn btn-sm btn-primary themed-button"
          >
            <i class="icon icon-save"></i> {{ $t("lang.button.save") }}
          </button>

          <CampaignList
            v-if="list.selectedIds.length > 0"
            @addSelected="addSelected($event)"
            @deleteSelected="deleteSelected($event)"
            @refresh="refreshList()"
            :key="campaignListKey"
            :model="model"
          />

          <button
            v-else
            disabled
            class="ml-2 rounded btn btn-sm btn-secondary effect-btn"
          >
            <i class="icon icon-rocket"></i>
            {{ $t("lang.search.addselectiontothecampaign") }}
          </button>

          <button
            v-if="
              (isCrmConfigSetted &&
                !['1', '2'].includes(currentUser.role_id)) ||
              list.selectedIds.length == 0
            "
            :disabled="list.selectedIds.length == 0"
            :class="
              sending
                ? 'btn-secondary btn-loading'
                : list.selectedIds.length == 0
                ? 'btn-outline-secondary'
                : 'btn-outline-primary'
            "
            class="ml-2 rounded btn btn-sm"
            @click="sendToCrm()"
          >
            <i class="icon icon-rocket"></i>
            {{ $t("lang.integrations.sendtomycrm") }}
          </button>

          <CrmList
            v-else-if="['1', '2'].includes(currentUser.role_id)"
            @sendToCrm="sendToCrm"
            :sending="sending"
            :model="model"
          />

          <button
            v-if="!this.model.imported"
            :disabled="downloading || list.selectedIds.length == 0"
            :class="
              downloading
                ? 'btn-secondary btn-loading'
                : list.selectedIds.length == 0
                ? 'btn-outline-secondary'
                : 'btn-outline-primary'
            "
            class="rounded ml-2 btn btn-sm"
            @click="downloadConfirmation()"
          >
            <i class="icon-download"></i>
            {{ $t("lang.button.downloadselecteddata") }}
          </button>
        </div>
      </div>
    </div>
    <div class="px-4" style="overflow-x: scroll">
      <Table
        v-if="!loading"
        :key="tablekey"
        :headers="headers"
        :cols="cols"
        :data="list.contacts.list"
        :customColumns="customColumns"
        :contactsColumns="contactsColumns"
        @toggleItem="toggleItem"
        :allselected="list.allselected"
        :allpageselected="list.allpageselected"
        :checkbox="true"
        :model="list"
        :campaignid="campaignId"
      >
      </Table>
    </div>
    <div
      v-if="loading"
      class="d-flex p-2 spinner-border loading-spinner mx-auto"
      role="status"
    >
      <span class="sr-only">{{ $t("lang.search.loading") }}...</span>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import {
  crmService,
  campaignsService,
  categoriesService,
  businessContactsService,
  regionsService,
} from "@/_services";

import Pagination from "@/components/Common/Pagination.vue";
import Table from "@/components/Common/Table.vue";
import { formattersMixin } from "@/_mixins/";
import { mapState, mapActions } from "vuex";
import Tooltip from "@/components/Common/Tooltip.vue";
import CampaignList from "@/components/AccountCreation/Steps/CampaignList.vue";
import CrmList from "@/components/AccountCreation/Steps/CrmList.vue";

export default {
  components: {
    Pagination,
    Table,
    Tooltip,
    CampaignList,
    CrmList,
  },
  mixins: [formattersMixin],
  props: {
    list: Object,
    total: Number,
    loading: Boolean,
    model: Object,
  },
  data() {
    return {
      ai: [],
      deleting: false,
      campaignListKey: 1,
      newcampaign: false,
      maxpercompany: 3,
      paginationkey: 9900,
      contactsColumns: [],
      customColumns: [],
      headers: [],
      cols: [],
      campaignedit: false,
      tablekey: 1,
      downloading: false,
      sending: false,
      limitPagination: false,
      campaignId: "",
      crmConfig: {},
    };
  },
  computed: {
    ...mapState({
      currentUser: (state) => state.authentication.user,
    }),
    toastNotificationData() {
      return this.$store.state.authentication.toastNotificationData;
    },
    isCrmConfigSetted() {
      return Object.keys(this.crmConfig).length > 0;
    },
  },
  created() {
    this.getCrmSettings();
    this.list.noselectall = true;

    if (!this.model.imported && this.trialPeriod()) {
      this.limitPagination = true;
    }

    if (this.model.imported) {
      this.list.noselectall = false;
      businessContactsService.getCustomFields().then((response) => {
        if (response) {
          response.forEach((item, key) => {
            this.contactsColumns.push({
              name: item.label,
              name_: item.label,
              type: item.type,
              field: "custom_field_" + item.id,
            });
            this.customColumns.push({ id: item.id, label: item.label });
            this.tablekey++;
          });
        }
      });
    }

    if (
      this.model.campaign !== undefined &&
      this.model.campaign.id !== undefined
    ) {
      this.list.noselectall = false;
      this.campaignedit = true;
      this.campaignId = this.model.campaign.id;
    }
    this.list.allpageselected = false;
    if (this.list.selectedIds == undefined) {
      this.list.excludedIds = [];
      this.list.selectedIds = [];
      this.list.allselected = false;
      this.list.allpageselected = false;
      if (this.list.contacts === undefined) {
        this.list.contacts = [];
        this.list.contacts.list = [];
      }
    }
    if (this.list.allselected == true) {
      this.activeAll();
    }

    /*if(this.toastNotificationData.dontChargePayments == 1 || this.model.buy){*/
    // if(this.model.buy){
    //   this.list.noselectall = false
    // }

    this.list.noselectall = false;

    this.headers = [
      {
        label: "",
        size: "5px",
      },
      {
        label: this.$t("lang.column.name"),
        size: "180px",
        class: "overflowhide",
        value: "contact_name",
      },
      {
        label: this.$t("lang.column.jobtitle"),
        size: "250px",
        class: "overflowhide",
        value: "job",
      },
      {
        label: this.$t("lang.column.email"),
        size: "200px",
        class: "overflowhide",
        value: "email",
      },
      {
        label: this.$t("lang.column.company"),
        size: "150px",
        class: "overflowhide",
        value: "business_name",
      },
      {
        label: this.$t("lang.label.opportunities"),
        size: "130px",
      },
      {
        label: this.$t("lang.column.phone"),
        size: "160px",
        class: "overflowhide",
        value: "business_phone",
      },
      {
        label: this.$t("lang.column.category"),
        size: "160px",
        class: "overflowhide",
        value: "category_name",
      },
      {
        label: this.$t("lang.column.companysize"),
        size: "50px",
        value: "salaries",
      },
      {
        label: this.$t("lang.column.contactcountry"),
        size: "90px",
        value: "language",
      },
      {
        label: this.$t("lang.column.country"),
        size: "90px",
        value: "country",
      },
      {
        label: this.$t("lang.label.postalcode"),
        size: "100px",
        value: "postal_code",
      },
      {
        label: this.$t("lang.column.address"),
        size: "150px",
        class: "overflowhide",
        value: "address",
      },
      {
        label: this.$t("lang.column.location"),
        size: "150px",
        class: "overflowhide",
        value: "city",
      },
      {
        value: "linkedinurl",
        label: "Linkedin URL",
        visible: false,
      },
    ];

    this.cols = [
      [
        {
          icon_if: "imported",
          icon_true: "icon-upload text-primary",
        },
      ],
      [
        {
          value: "contact_name",
          value_if: "Contact Email",
          value_true: "business_name",
          link: "linkedinurl",
          type: "link",
          class: "cursor-pointer",
          icons: [
            {
              icon_if: "linkedinurl",
              icon_true: "icon-linkedin text-primary",
            },
          ],
          badges: [
            {
              badge_if: "engaged",
              badge_class: "badge badge-success text-white",
              badge_label: this.$t("lang.label.active"),
            },
            {
              badge_if: "bounced",
              badge_class: "text-secondary small",
              badge_label: "Bounced",
              badge_icon: "icon-undo2",
            },
            {
              badge_if: "donotcontact",
              badge_class: "text-secondary small",
              badge_label: this.$t("lang.campaigns_dashboard.donotcontactinfo"),
              badge_tooltip: this.$t(
                "lang.campaigns_dashboard.donotcontactinfo"
              ),
              badge_icon: "icon-user-times",
            },
          ],
        },
      ],
      [
        {
          value: "job",
          tooltip: "job",
        },
      ],
      [
        {
          type: "email",
          value: "email",
          tooltip: "email",
        },
      ],
      [
        {
          value: "business_name",
          tooltip: "business_name",
          link: "domain",
          type: "link",
          class: "cursor-pointer",
          icons: [
            {
              icon_if: "domain",
              icon_true: "icon-globe text-primary",
            },
          ],
        },
      ],
      [
        {
          value: "opportunities",
          class: "cursor-pointer",
        },
      ],
      [
        {
          value: "business_phone",
          tooltip: "business_phone",
        },
      ],
      [
        {
          value: "category_name",
          tooltip: "category_name",
        },
      ],
      [
        {
          value: "salaries",
        },
      ],
      [
        {
          value: "language",
        },
      ],
      [
        {
          value: "country",
        },
      ],
      [
        {
          value: "postal_code",
        },
      ],
      [
        {
          value: "address",
          tooltip: "address",
        },
      ],
      [
        {
          value: "city",
        },
      ],
    ];
  },
  watch: {
    total: function (newVal, oldVal) {
      // watch it
      this.total = newVal;
    },
  },
  methods: {
    refreshList() {
      this.model.refreshlist = true;
      this.$swal({
        type: "success",
        title: this.$t("lang.campaigns_dashboard.campaignecreated"),
        text: this.$t("lang.campaigns_dashboard.addcontactsnow"),
        showCancelButton: false,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33a2c",
        confirmButtonText: this.$t("lang.button.ok"),
      }).then((result) => {
        this.campaignListKey++;
      });
    },
    selectPerCompany() {
      this.model.maxpercompany = this.maxpercompany;
    },
    getTotalByUser() {
      if (
        this.list.contacts.list.length > 100 &&
        this.currentUser.role_id == "2" &&
        this.currentUser.subscription_status_id == 0
      ) {
        return 100;
      }
      if (this.total == false) return 0;

      return this.total;
    },
    trialPeriod() {
      if (this.toastNotificationData.dontChargePayments == 1) {
        return false;
      }

      if (
        this.currentUser.role_id == "2" &&
        this.currentUser.subscription_status_id == 0 &&
        this.toastNotificationData.trialPeriodData.trial_period_ended == 0
      ) {
        return true;
      }
    },

    downloadConfirmation() {
      if (this.model.imported) {
        this.downloadDataCSV();
        return;
      }

      this.$swal({
        type: "warning",
        title: this.$t("lang.mycontacts.exportwhytitle"),
        text: this.$t("lang.mycontacts.exportwhy"),
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33a2c",
        confirmButtonText: this.$t("lang.button.yes"),
      }).then((result) => {
        if (result.value) {
          this.downloadDataCSV();
        }
      });
    },

    async downloadDataCSV() {
      this.downloading = true;
      let datosExportar = [];
      this.model.selectedIds = this.list.selectedIds;
      this.model.selectAll = this.list.allselected;
      const response = await businessContactsService
        .exportData(this.model, true)
        .then((result) => {
          if (result.list.length == 0) {
            this.$swal({
              type: "warning",
              title: this.$t("lang.mycontacts.nocontactunlock"),
              showCancelButton: false,
              confirmButtonColor: "#d33a2c",
              confirmButtonText: this.$t("lang.button.ok"),
            }).then((result) => {});
            this.downloading = false;
            return false;
          } else {
            for (let i = 0; i < result.list.length; i++) {
              let rowCSV = {};
              for (let j = 0; j < this.headers.length; j++) {
                if (this.headers[j].value !== undefined) {
                  let colName = this.headers[j].value;
                  if (
                    result.list[i] != undefined &&
                    result.list[i].hasOwnProperty(colName)
                  ) {
                    rowCSV[this.headers[j].label] = result.list[i][colName];
                  }
                }
              }
              datosExportar.push(rowCSV);
            }
          }
        });

      if (datosExportar.length > 0) {
        this.unparsedResults = this.$papa.unparse(datosExportar, {
          delimiter: ";",
        });
        this.$papa.download(this.unparsedResults, "AllData");
        this.downloading = false;
      }
    },

    getRowValues(indexColumn, indexBusinessContact) {
      let custom_val =
        this.list.contacts.list[indexBusinessContact].custom_values;
      let custom_cols =
        this.list.contacts.list[indexBusinessContact].custom_columns;

      if (custom_val !== null) {
        custom_val = custom_val.split(",");
        custom_cols = custom_cols.split(",");
        for (let i = 0; i < custom_cols.length; i++) {
          if (custom_cols[i] == indexColumn) return custom_val[i];
        }
      }
      return " ";
    },
    getColor() {
      if (this.model.imported) {
        return "primary";
      }

      if (this.model.status !== undefined && this.model.status.notbuy) {
        return "primary";
      }
      if (this.model.status !== undefined && this.model.status.buy) {
        return "primary";
      }
      return "primary";
    },
    deleteImport() {
      this.deleting = true;
      this.loading = true;
      this.$swal({
        type: "warning",
        title: this.$t("lang.label.areyousure"),
        text: "",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33a2c",
        confirmButtonText: this.$t("lang.button.yes"),
      }).then((result) => {
        if (result.value) {
          this.model.selectedIds = this.list.selectedIds;
          this.model.excludedIds = this.list.excludedIds;
          this.model.selectAll = this.list.allselected;
          businessContactsService.deleteImport(this.model).then((result) => {
            this.deleting = false;
            this.loading = false;
            this.$emit("reload");
          });
        } else {
          this.deleting = false;
          this.loading = false;
        }
      });
    },
    isActive(id) {
      return (
        this.list.selectedIds.indexOf(id) > -1 &&
        this.list.excludedIds.indexOf(id) == -1
      );
    },
    isAllActive() {
      if (this.list.allselected == true || this.list.allpageselected == true) {
        return "checked";
      }
    },
    activeAll() {
      this.list.contacts.list.forEach((element) => {
        if (this.list.selectedIds.indexOf(element.id) == -1) {
          this.list.selectedIds.push(element.id);
        }
      });
    },
    totalSelectAll() {
      return this.total - this.list.excludedIds.length;
    },
    dactivateSelected() {
      this.$swal({
        type: "warning",
        title: this.$t("lang.label.areyousure"),
        text: this.$t("lang.search.removefromallcampaigns"),
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33a2c",
        confirmButtonText: this.$t("lang.button.yes"),
        cancelButtonText: this.$t("lang.button.cancel"),
      }).then((result) => {
        if (result.value) {
          this.model.selectedIds = this.list.selectedIds;
          this.model.excludedIds = this.list.excludedIds;
          this.model.selectAll = this.list.allselected;

          businessContactsService
            .deactivateSelected(this.model)
            .then((response) => {
              this.$swal({
                type: "success",
                title: this.$t("lang.label.great"),
                showConfirmButton: false,
                timer: 1500,
              });
              this.list.selectedIds = [];
              this.list.excludedIds = [];
              this.list.allselected = false;
              this.$emit("reload");
            });
        } else {
        }
      });
    },
    deleteSelected(item) {
      this.$swal({
        type: "warning",
        title: this.$t("lang.label.areyousure"),
        text: this.$t("lang.label.removecontactsfromcampaign"),
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33a2c",
        confirmButtonText: this.$t("lang.button.yes"),
        cancelButtonText: this.$t("lang.button.cancel"),
      }).then((result) => {
        if (result.value) {
          this.model.selectedIds = this.list.selectedIds;
          this.model.excludedIds = this.list.excludedIds;
          this.model.selectAll = this.list.allselected;
          if (item != undefined) {
            this.model.deleteFromCampaign = item.id;
          }
          businessContactsService
            .deleteSelected(this.model)
            .then((response) => {
              this.$swal({
                type: "success",
                title: this.$t("lang.label.great"),
                showConfirmButton: false,
                timer: 1500,
              });
              this.list.selectedIds = [];
              this.list.excludedIds = [];
              this.list.allselected = false;
              this.$emit("reload");
            });
        } else {
        }
      });
    },
    saveSelected() {
      this.$swal({
        type: "warning",
        title: this.$t("lang.label.areyousure"),
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33a2c",
        confirmButtonText: this.$t("lang.button.yes"),
      }).then((result) => {
        if (result.value) {
          this.$swal({
            type: "success",
            title: this.$t("lang.search.waitplease"),

            showConfirmButton: false,
            allowOutsideClick: false,
            timer: 150000,
          });

          this.model.selectedIds = this.list.selectedIds;
          this.model.excludedIds = this.list.excludedIds;
          this.model.selectAll = this.list.allselected;
          businessContactsService.saveSelected(this.model).then((response) => {
            if (response == "limitmax") {
              this.$swal({
                type: "warning",
                text: this.$t("lang.planfeatures.limitcontact"),
                showCancelButton: true,
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                confirmButtonText: this.$t("lang.button.upgrade"),
                cancelButtonText: this.$t("lang.button.ok"),
              }).then((result) => {
                if (result.value == true) {
                  this.$router.push("/upgrade");
                }
              });
            } else {
              this.$swal({
                type: "success",
                title: this.$t("lang.label.great"),
                showConfirmButton: false,
                timer: 1500,
              });
            }
            this.tablekey++;
          });
        } else {
        }
      });
    },

    sendToCrm(user_id) {
      this.sending = true;
      this.model.selectedIds = this.list.selectedIds;
      this.model.selectAll = this.list.allselected;
      if (user_id != undefined) {
        this.model.crmUserId = user_id;
      }

      businessContactsService.sendToCrm(this.model).then((response) => {
        this.$swal({
          type: "success",
          title: this.$t("lang.label.great"),
          html:
            this.$t("lang.search.contactssent") +
            ": <b>" +
            response.list +
            "</b>",
          showConfirmButton: false,
          timer: 2500,
        });
        this.sending = false;
      });
    },

    getTitleAlertCampaignList() {
      if (this.totalSelectAll() > 25000) {
        return this.$t("lang.search.25mille");
      }
      return "";
    },
    newCampaign() {
      this.newcampaign = true;
    },
    addSelected(item) {
      let id = item.id;
      let name = item.name;
      this.$swal({
        type: "warning",
        title: this.$t("lang.label.areyousure"),
        html:
          this.$t("lang.campaign_parameters.addcontacttocampaign") +
          " " +
          name +
          " <br> <small><strong>" +
          this.getTitleAlertCampaignList() +
          "</strong></small>",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33a2c",
        confirmButtonText: this.$t("lang.button.yes"),
      }).then((result) => {
        if (result.value) {
          this.$swal({
            type: "success",
            title: this.$t("lang.search.waitplease"),
            text: this.$t("lang.search.weareadding"),
            showConfirmButton: false,
            allowOutsideClick: false,
            timer: 150000,
          });

          this.model.selectedIds = this.list.selectedIds;
          this.model.excludedIds = this.list.excludedIds;
          this.model.selectAll = this.list.allselected;
          this.model.selectedCampaign = id;
          businessContactsService
            .insertIntoCampaign(this.model)
            .then((response) => {
              if (response == "limitmax") {
                this.$swal({
                  type: "warning",
                  text: this.$t("lang.planfeatures.limitcontact"),
                  showCancelButton: true,
                  showCancelButton: true,
                  confirmButtonColor: "#3085d6",
                  confirmButtonText: this.$t("lang.button.upgrade"),
                  cancelButtonText: this.$t("lang.button.ok"),
                }).then((result) => {
                  if (result.value == true) {
                    this.$router.push("/upgrade");
                  }
                });
              } else {
                this.$swal({
                  type: "success",
                  title: this.$t("lang.label.great"),
                  showConfirmButton: false,
                  timer: 1500,
                });
              }
            });
        } else {
        }
      });
    },
    toggleItem() {
      this.$forceUpdate();
    },
    getText(type) {
      if (type == 7) {
        return "Le système n'a pas encore lié la personne qui utilise cet e-mail à un contact précis. Cet e-mail est néanmoins utilisé par un membre de l'équipe de direction.";
      }
      if (type == 5) {
        return "info@...,contact@...,support@...,etc...";
      }
      if (type == 12) {
        return "buyed";
      }
      return false;
    },
    mouseover(key, bo) {
      this.ai[key] = bo;
      this.$forceUpdate();
    },
    changePage() {
      this.$emit("changePage");
      this.paginationkey++;
    },

    getSalaries(salaries) {
      if (salaries > 200) {
        return "+200";
      }
      if (salaries <= 200 && salaries > 10) {
        return "10-200";
      }
      return "1-10";
    },

    getCrmSettings() {
      crmService
        .getConfig()
        .then((result) => {
          if (result) {
            this.crmConfig = result;
          }
        })
        .catch((error) => {
          this.crmConfig = {};
        });
    },
  },
};
</script>
<style>
.loadingres {
  width: 17px !important;
  height: 17px !important;
}
.btn-loading {
  position: relative;
}
.btn-loading:after {
  position: absolute;
  width: 100%;
  background: blue;
  display: block;
  content: " ";
  height: 100%;
  top: 0;
  left: 0;
  background: linear-gradient(
    110deg,
    rgba(236, 236, 236, 0.3) 8%,
    rgba(245, 245, 245, 0.5) 18%,
    rgba(236, 236, 236, 0.3) 33%
  );
  border-radius: 5px;
  background-size: 200% 100%;
  animation: 1.8s shine linear infinite;
}

@keyframes shine {
  to {
    background-position-x: -200%;
  }
}
</style>