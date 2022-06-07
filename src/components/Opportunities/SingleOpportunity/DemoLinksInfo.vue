<template>
  <div class="tab-pane fade" id="pills-profile" role="tabpanel" aria-labelledby="pills-profile-tab">
    <div class="wrapperCard triangle">
      <div class="card p-3 shadow demo-links">
        <div class="row">
          <div class="col-12">
            <form>
              <div class="input-group">
                <input
                  class="form-control"
                  type="search"
                  placeholder="Quick search..."
                  aria-label="Search"
                  v-model="searchFilter"
                />
                <div class="input-group-append">
                  <button class="btn btn-secondary themed-hover" type="button">
                    <span class="icon-search"></span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
        <div class="table-responsive scrolled-div mt-4">
          <table class="table table-hover">
            <thead>
              <tr>
                <th scope="col">Email</th>
                <th scope="col">Link</th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(businessContact, key) in filteredBusinessContacts" :key="key">
                <td>
                  <span>{{ businessContact.email }}</span>
                </td>
                <td>
                  <span
                    :id="generateInputId(businessContact.id)"
                  >{{ buildDemoLink(businessContact.id) }}</span>
                </td>
                <td>
                  <button
                    class="btn btn-sm btn-secondary"
                    :id="generateButtonId(businessContact.id)"
                    @click="copyLink(businessContact.id)"
                  >
                    <span class="icon-copy d-inline pr-2"></span>
                    <span class="d-inline" :id="generateSpanId(businessContact.id)">Copy</span>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import JQuery from "jquery";
let $ = JQuery;

export default {
  data() {
    return {
      searchFilter: ""
    };
  },

  props: {
    link: Object,
    business: Object,
    businessContacts: Array
  },

  computed: {
    filteredBusinessContacts() {
      if (this.searchFilter === "") return this.businessContacts;
      var filter = this.searchFilter.toLowerCase();
      return this.businessContacts.filter(function(contact) {
        return contact.email.toLowerCase().includes(filter);
      });
    },

    emptyBusinessContacts() {
      return this.businessContacts.length == 0;
    }
  },

  methods: {
    generateSpanId(businessContactId) {
      return `demo-link-span-${businessContactId}`;
    },

    generateButtonId(businessContactId) {
      return `demo-link-button-${businessContactId}`;
    },

    generateInputId(businessContactId) {
      return `demo-link-input-${businessContactId}`;
    },

    buildDemoLink(businessContactId) {
      return `${this.link.demo_url}${this.business.alias}/${businessContactId}`;
    },

    copyLink(businessContactId) {
      var copyText = document.getElementById(
        `demo-link-input-${businessContactId}`
      );
      var textArea = document.createElement("textarea");
      textArea.value = copyText.textContent;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("Copy");
      textArea.remove();

      $(`#demo-link-span-${businessContactId}`).text("Copied!");
      $(`#demo-link-button-${businessContactId}`).removeClass("btn-secondary");
      $(`#demo-link-button-${businessContactId}`).addClass("btn-primary");

      setTimeout(function() {
        $(`#demo-link-span-${businessContactId}`).text("Copy");
        $(`#demo-link-button-${businessContactId}`).addClass("btn-secondary");
        $(`#demo-link-button-${businessContactId}`).removeClass("btn-primary");
      }, 3000);
    }
  }
};
</script>
