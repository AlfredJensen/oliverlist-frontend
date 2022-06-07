<template>
  <table id="mytable" class="noselect w-100 table table-hover bg-white">
    <thead>
      <TR v-if="ccol.length > 0">
        <th class="text-secondary" scope="colgroup" :colspan="ccol.length + 13">
          <span>
            <button
              v-if="isopen"
              class="btn btn-outline-secondary btn-sm pb-1 py-0 mr-1"
              @click="closeCols()"
            >
              <small>
                <i class="icon-arrow-right"></i>
                <i class="icon-arrow-left"></i>
                {{ $t("lang.button.close") }}
              </small>
            </button>

            <button
              v-if="!isopen"
              class="btn btn-outline-secondary btn-sm pb-1 py-0 mr-1"
              @click="openCols()"
            >
              <small>
                <i class="icon-arrow-left"></i>
                <i class="icon-arrow-right"></i>
                {{ $t("lang.label.open") }}
              </small>
            </button>
          </span>
          {{ $t("lang.mycontacts.mycustomcolumns") }}
        </th>
      </TR>
      <tr>
        <th v-if="checkbox" scope="col" style="width: 10px">
          <div class="">
            <div class="btn-group">
              <button
                type="button"
                :class="allselected || allpageselected ? 'bg-primary' : ''"
                class="border btn btn-sm btn-white"
                data-toggle="dropdown"
              >
                <span class="">
                  <i
                    v-if="allselected || allpageselected"
                    class="text-white icon-check-circle"
                  ></i>
                  <i
                    v-if="!allselected && !allpageselected"
                    class="icon-circle-o"
                  ></i>
                </span>
              </button>
              <button
                type="button"
                :class="allselected || allpageselected ? 'bg-primary' : ''"
                class="border btn btn-sm btn-white dropdown-toggle"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              ></button>
              <div class="dropdown-menu dropdown-menu-right">
                <button
                  @click="toggleAllPages()"
                  :class="allselected ? 'text-primary' : ''"
                  class="dropdown-item"
                  type="button"
                >
                  <small
                    >{{ $t("lang.mycontacts.selectallpages") }}
                    <i v-if="model.noselectall" class="icon-lock"></i>
                  </small>
                  <i v-if="allselected" class="text-primary icon-checkmark"></i>
                </button>
                <button
                  @click="toggleAll()"
                  :class="allpageselected ? 'text-primary' : ''"
                  class="dropdown-item"
                  type="button"
                >
                  <small>{{ $t("lang.mycontacts.selectonlypages") }} </small>
                  <i
                    v-if="allpageselected"
                    class="text-primary icon-checkmark"
                  ></i>
                </button>
              </div>
            </div>
          </div>
        </th>

        <th
          :class="!isopen ? 'closed' : ''"
          class=""
          v-for="(customCol, keyc) in ccol"
        >
          <span class="text-primary">{{ customCol }}</span>
        </th>

        <th
          v-for="header in headers"
          :style="'width:' + header.size"
          v-if="header.visible == undefined || header.visible"
          class=""
        >
          {{ header.label }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="(row, trkey) in data"
        @click="toggleItem(row.id, row.business_contact_status_id)"
        :class="isActive(row.id) ? 'table-primary' : ''"
      >
        <td v-if="checkbox" class="cursor-pointer">
          <div>
            <div class="form-check">
              <input
                class="form-check-input"
                type="checkbox"
                value=""
                :id="'flexCheckDefault-' + row.id"
                :checked="isActive(row.id)"
              />
            </div>
          </div>
        </td>

        <td
          class="overflowhide"
          v-for="(customColumnValue, keyvalue) in customColumns"
          :class="isOpenClass(keyvalue)"
        >
          <span
            style="width: 150px"
            v-if="getRowValues(customColumnValue.id, trkey)"
          >
            <Tooltip
              :text="getRowValues(customColumnValue.id, trkey)"
              :width="'auto'"
            >
              {{ getRowValues(customColumnValue.id, trkey) }}
            </Tooltip>
          </span>
        </td>

        <td
          v-for="(colg, key) in cols"
          :class="headers[key].class"
          :style="
            headers[key].percentage !== undefined
              ? 'width:' + headers[key].percentage
              : ''
          "
        >
          <span
            v-for="col in colg"
            @click="gotoLink(col.type, row[col.link])"
            :class="
              col.type == 'link' && row[col.link]
                ? 'text-primary cursor-pointer'
                : ''
            "
            :style="
              headers[key].size !== undefined
                ? 'width:' + headers[key].size
                : ''
            "
          >
            <span
              class="mr-2"
              v-for="icon in col.icons"
              v-if="!row[icon.icon_if] && icon.icon_false"
            >
              <Tooltip
                :text="
                  icon.tooltip_false_value === undefined
                    ? icon.tooltip_false
                    : row[icon.tooltip_false_value]
                "
                :width="'auto'"
                v-if="icon.tooltip_false || icon.tooltip_false_value"
              >
                <i
                  class="d-inline ml-2 cursor-pointer"
                  :class="icon.icon_false"
                ></i>
              </Tooltip>
              <i
                v-else
                class="d-inline ml-2 cursor-pointer"
                :class="icon.icon_false"
              ></i>
            </span>

            <span
              class="mr-2"
              v-for="icon in col.icons"
              v-if="row[col.value] == icon.icon_if_value"
            >
              <Tooltip
                :text="icon.tooltip_true"
                :width="'auto'"
                v-if="icon.tooltip_true"
              >
                <i
                  class="d-inline ml-2 cursor-pointer"
                  :class="icon.icon_true"
                ></i>
              </Tooltip>
              <i
                v-else
                class="d-inline ml-2 cursor-pointer"
                :class="icon.icon_true"
              ></i>
            </span>

            <span
              class="mr-2"
              v-for="icon in col.icons"
              v-if="row[icon.icon_if] && icon.icon_true"
            >
              <Tooltip
                :text="
                  icon.tooltip_true_value === undefined
                    ? icon.tooltip_true
                    : row[icon.tooltip_true_value]
                "
                :width="'auto'"
                v-if="icon.tooltip_true || icon.tooltip_true_value"
              >
                <i
                  class="d-inline ml-2 cursor-pointer"
                  :class="icon.icon_true"
                >{{icon.tooltip_true_value}}</i>
              </Tooltip>

              <i
                v-if="!icon.tooltip_true && !icon.tooltip_true_value && icon.icon_if != 'domain'"
                class="d-inline ml-2 cursor-pointer"
                :class="icon.icon_true"
              ></i>

              <i
                class="d-inline ml-2 icon-facebook"
                v-if="icon.icon_if == 'domain' && isFacebook(row[icon.icon_if])"
              ></i>
              <i
                class="d-inline ml-2 icon-globe"
                v-if="
                  icon.icon_if == 'domain' && !isFacebook(row[icon.icon_if])
                "
              ></i>
            </span>

            <Tooltip
              :text="getValue(row, col, 'tooltip')"
              :width="headers[key].size"
              v-if="row[col.tooltip] && col.type != 'email'"
            >
              {{ getValue(row, col) }}
            </Tooltip>

            <span
              v-if="
                !row[col.tooltip] &&
                col.type != 'email' &&
                col.type != 'router' &&
                col.type != 'emit' &&
                col.type != 'map' &&
                (!col.value_if || col.value_if != getValue(row, col))
              "
            >
              {{ getValue(row, col) }}
            </span>
            <span v-if="col.type == 'map'">
              <img
                class="float-right cursor-pointer"
                :src="
                  'https://maps.googleapis.com/maps/api/staticmap?center=' +
                  row.location[0] +
                  '&zoom=9&key=' +
                  col.apikey +
                  '&size=150x50&maptype=map&sensor=false&path=color%3ablue|weight:2|fillcolor%3ablue|' +
                  getlocations2(row.location) +
                  '&cache=' +
                  row.id
                "
              />
            </span>

            <span
              class="mr-2 overflowhide text-primary cursor-pointer"
              v-if="
                col.type == 'link' &&
                col.value_if == getValue(row, col) &&
                getValue(row, col)
              "
            >
              <span>
                <a
                  :href="
                    'https://google.com/search?q=' +
                    row[col.value_true] +
                    '+' +
                    row['city']
                  "
                  target="blank"
                >
                  <i class="d-inline ml-2 icon-location"></i>
                  {{ row[col.value_true] }}</a
                ></span
              >
            </span>

            <span class="overflowhide" v-if="col.value == 'opportunities'">
              <ContactOpportunities :bcid="row.id" :campaignid="campaignid">
              </ContactOpportunities>
            </span>

            <div v-if="col.value == 'contact_name' && !row['bounced']">
              <ContactStatus :bcid="row.id" :campaignid="campaignid">
              </ContactStatus>
            </div>

            <span v-if="col.type == 'router'" :class="col.class">
              <router-link :to="col.url + getValue(row, col)">
                <span>
                  <i v-if="col.icon != undefined" :class="col.icon"></i>
                  <span v-if="col.label != undefined">{{ col.label }}</span>
                  <span v-else-if="col.valua_label != undefined">{{
                    row[col.valua_label]
                  }}</span>
                </span>
              </router-link>
            </span>

            <span
              v-if="col.type == 'emit' && col.value_if == row[col.value]"
              :class="col.class"
              @click="emitnow(col, row[col.value_emit])"
            >
              <i v-if="col.icon != undefined" :class="col.icon"></i>
              <span v-if="col.label != undefined">{{ col.label }}</span>
              <span v-else-if="col.valua_label != undefined">{{
                row[col.valua_label]
              }}</span>
            </span>

            <span v-if="col.type == 'email'">
              <Email
                v-if="col.type == 'email'"
                :email="getValue(row, col)"
                :model="data"
                :rowkey="trkey"
                :status="row['business_contact_status_id']"
                :status_email="row['business_contact_status_email']"
                :id="row.id"
              >
              </Email>
            </span>

            <div
              v-for="badge in col.badges"
              v-if="row[badge.badge_if]"
              :class="badge.badge_class"
              class="ml-2"
            >
              <Tooltip
                :class="badge.badge_tooltip"
                :text="badge.badge_tooltip"
                :width="'auto'"
              >
                <i :class="badge.badge_icon" :v-if="badge.badge_icon"> </i>
                {{ badge.badge_label }}
              </Tooltip>
            </div>
          </span>
        </td>
      </tr>
    </tbody>
  </table>
</template>
<script>
import Email from "@/components/AccountCreation/Steps/Campaign/search/Email.vue";
import ContactOpportunities from "@/components/AccountCreation/Steps/Campaign/search/ContactOpportunities.vue";
import ContactStatus from "@/components/AccountCreation/Steps/Campaign/search/ContactStatus.vue";

import Tooltip from "@/components/Common/Tooltip.vue";

export default {
  data() {
    return {
      ccol: [],
      cdata: [],
      isopen: false,
      title: "ABCDEFGABCDEFGABCDEFGABCDEFGABCDEFGABCDEFG",
    };
  },
  components: {
    Tooltip,
    Email,
    ContactOpportunities,
    ContactStatus,
  },
  props: {
    notselect: {
      type: Boolean,
      required: false,
      default: false,
    },
    allpageselected: {
      type: Boolean,
      required: false,
      default: false,
    },
    allselected: {
      type: Boolean,
      required: false,
      default: false,
    },
    customColumns: {
      type: Array,
      required: false,
    },
    checkbox: {
      type: Boolean,
      required: false,
      default: false,
    },
    headers: {
      type: Array,
      required: true,
    },
    cols: {
      type: Array,
      required: true,
    },
    model: {
      type: Object,
    },
    campaignid: String,
    data: {
      type: Array,
      required: true,
    },
    sizes: {
      type: Array,
      required: false,
      default: () => {
        [];
      },
    },
  },
  created() {
    if (this.customColumns) {
      let ccol = [];
      this.customColumns.forEach((element) => {
        if (element) this.ccol.push(element.label);
      });
    }

    if (this.model.selectedIds == undefined) this.model.selectedIds = [];
    if (this.model.excludedIds == undefined) this.model.excludedIds = [];
  },
  methods: {
    isFacebook(domain) {
      return domain.includes("facebook");
    },
    emitnow(col, value) {
      if (col.action !== undefined) {
        this.$emit(col.emit, col.action, value);
      } else {
        this.$emit(col.emit, value);
      }
    },
    getlocations2(loc) {
      loc = JSON.parse(loc);
      loc = loc.join("|");
      loc = loc;
      return loc;
    },
    getSalaries(salaries) {
      if (salaries > 200) {
        return "+200";
      }
      if (salaries <= 200 && salaries > 10) {
        return "10-200";
      }
      if (salaries) return "1-10";
      else return "-";
    },
    gotoLink(type, link) {
      if (type == "link" && link !== undefined && link) {
        window.open(link, "_blank");
      }
    },
    getValue(row, col, tooltip) {
      let value = col.value;

      if (tooltip) {
        value = col.tooltip;
      }

      if (col.type == 'link' && col.value_label && row[col.link] ) {
        value = col.value_label;
        return value
      }

      if (col.filter) {
        value = this.$options.filters[col.filter](row[value]);
        return value
      }

      if (col.type == "days") {
        let result = [];
        let days = row[value].split(",");
        days.forEach((element) => {
          result.push(this.$t("lang.sending_days." + element));
        });
        return result.join(", ");
      }

      if (col.value == "salaries") {
        return this.getSalaries(row[value]);
      }

      if (col.translate !== undefined && col.translate) {
        return this.$t(col.translate + "." + row[value]);
      }

      if (row[value]) return row[value];
      else return col.value_empty;
    },
    closeCols() {
      this.isopen = false;
    },
    openCols() {
      this.isopen = true;
    },
    isAllActive() {
      if (this.allselected == true || this.allpageselected == true) {
        return "checked";
      }
    },
    activeAll() {
      this.data.forEach((element) => {
        if (this.model.selectedIds.indexOf(element.id) == -1) {
          this.model.selectedIds.push(element.id);
        }
      });
    },
    deactiveAll() {
      this.model.selectedIds = [];
      this.model.allselected = false;
      this.model.allpageselected = false;
      this.$forceUpdate();
    },
    selectAll() {
      this.model.excludedIds = [];
      this.model.selectedIds = [];
      this.model.allselected = true;
      this.model.allpageselected = false;
      this.activeAll();
    },
    selectAllPage() {
      this.model.selectedIds = [];
      this.model.excludedIds = [];
      this.model.allselected = false;
      this.model.allpageselected = true;
      this.activeAll();
    },

    getRowValues(indexColumn, indexBusinessContact) {
      let custom_val =
        this.model.contacts.list[indexBusinessContact].custom_values;
      let custom_cols =
        this.model.contacts.list[indexBusinessContact].custom_columns;

      if (custom_val == null) {
        custom_cols = [];
        custom_val = [];
        this.customColumns.forEach((element, index) => {
          custom_cols.push(index);
          custom_val.push(" ");
        });
        for (let i = 0; i < custom_cols.length; i++) {
          if (custom_cols[i] == indexColumn) {
            if (custom_val[i]) {
              return custom_val[i];
            } else {
              return false;
            }
          }
        }
      } else {
        if (custom_val !== null) {
          custom_val = custom_val.split(",");
          custom_cols = custom_cols.split(",");
          for (let i = 0; i < custom_cols.length; i++) {
            if (custom_cols[i] == indexColumn) {
              if (custom_val[i]) {
                return custom_val[i];
              } else {
                return false;
              }
            }
          }
        }
      }
      return false;
    },
    isOpenClass(index) {
      if (this.isopen && this.customColumns[index + 1] == undefined) {
        return "opened openedlast";
      }

      if (!this.isopen) {
        return "closed";
      }

      return "opened";
    },
    toggleAllPages() {
      if (this.model.noselectall) {
        this.$swal({
          type: "warning",
          title: this.$t("lang.planfeatures.planbusinesstitle"),
          html: this.$t("lang.planfeatures.planbusiness"),
          showCancelButton: true,
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          confirmButtonText: this.$t("lang.button.contactus"),
          cancelButtonText: this.$t("lang.button.cancel"),
        }).then((result) => {
          if (result.value == true) {
            window.open("mailto:entreprise@oliverlist.com", "_blank");
            // this.$router.push('/upgrade');
          }
        });
        return;
      }

      if (this.model.allselected == false) {
        this.selectAll();
      } else {
        this.deactiveAll();
      }
      this.$forceUpdate();
      this.$emit("toggleItem");
    },
    toggleAll() {
      if (this.model.allpageselected == false) {
        this.selectAllPage();
      } else {
        this.deactiveAll();
      }
      this.$forceUpdate();
      this.$emit("toggleItem");
    },
    isActive(id) {
      return (
        this.model.selectedIds.indexOf(id) > -1 &&
        this.model.excludedIds.indexOf(id) == -1
      );
    },
    toggleItem(id, status) {
      if (this.notselect) {
        return;
      }

      this.allpageselected = false;
      if (this.isActive(id)) {
        this.model.selectedIds = this.model.selectedIds.filter((c) => c != id);
        this.model.excludedIds.push(id);
      } else {
        this.model.excludedIds = this.model.excludedIds.filter((c) => c != id);
        this.model.selectedIds.push(id);
      }
      this.$forceUpdate();
      this.$emit("toggleItem");
    },
  },
};
</script>


<style scoped>
.overflowtable > span {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  cursor: pointer;
}
.ellipsis {
  text-overflow: ellipsis;
}
.overflowhide > span {
  overflow: hidden;
  white-space: nowrap;
  cursor: pointer;
}
.overflowtable:hover {
  position: relative;
  padding: 0;
  vertical-align: inherit;
  text-align: left;
}
.overflowtable:hover > span {
  cursor: pointer;
  overflow: inherit;
  width: 100% !important;
  z-index: 999;
  position: absolute;
  border: 0;
  margin-top: -12px;
  margin-left: 12px;
  text-align: left;
  padding: 0;
  max-width: 100%;
  white-space: normal;
  background: rgb(236 236 236);
}

tr.table-primary .overflowtable:hover > span {
  background: #b7b9f6;
}
.noselect {
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Old versions of Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome, Edge, Opera and Firefox */
}
.overflowtable:hover > span > span {
}
#mytable .closed {
  display: none;
}

#mytable .opened {
  -webkit-animation: fadeIn 0.4s;
  animation: fadeIn 0.4s;
}

#mytable .openedlast {
  border-right: 2px solid #dee2e6;
}

.table {
  width: auto !important;
}
</style>