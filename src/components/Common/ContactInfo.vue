<template>
  <div class="row contact-info">
    <div class="col-md-12">
      <div class="wrapperCard mt-2">
        <div class="row">
          <div class="col-6 titCard">
            <h4 class="d-inline">Contact</h4>
            <a
              class="d-inline ml-2 cursor-pointer"
              @click.once="executeAction('editContact')"
              data-toggle="tooltip"
              data-placement="top"
              title="Edit contact"
            >
              <span class="icon-pencil"></span>
            </a>
          </div>
          <div class="col-6 text-right">
            <button
              v-if="status.name !== 'Positive'"
              type="button"
              class="btn btn-sm btn-primary btnIndex positive"
              @click.once="executeAction('positiveBusiness')"
            >
              <span class="">Positive</span>
            </button>
            <button
              v-if="status.name !== 'Negative'"
              type="button"
              class="btn btn-sm btn-primary btnIndex negative"
              @click.once="executeAction('negativeBusiness')"
            >
              <span class="">Negative</span>
            </button>
            <button
              type="button"
              class="btn btn-sm btn-primary btnIndex delete-button ml-4"
              @click.once="executeAction('deleteBusiness')"
            >
              <span class="">Claim</span>
            </button>
            <button
              type="button"
              class="btn btn-sm btn-primary btnIndex do-not-contact-button"
              @click.once="executeAction('doNotContactBusiness')"
            >
              <span class="">{{ $t('lang.button.donotcontact') }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="col-md-12">
        <div class="card p-4 mt-3 shadow">
          <div class="mb-3 mt-3 ml-3 mr-3">
            <div class="row">
              <div class="col-12 d-flex">
                <div>
                  <span v-html="business.logo" v-if="isSvgLogo(business.logo)" class="contact-logo"></span>
                  <img
                    class="d-block imgmain contact-logo"
                    :class="(business.headerwhite == 0) ? 'dark-background' : ''"
                    :src="logoUrl(business.logo)"
                    v-else
                  />
                </div>
                <div class="ml-3">
                  <div>
                    <p class="nameClient mb-2 d-inline font-weight-bold">{{ business.name }}</p>
                  </div>
                  <div class>
                    <span class="icon-room d-inline mr-1"></span>
                    <p
                      class="d-inline font-weight-bold"
                    >{{ business.city | capitalize }}, {{ business.country_name | capitalize}}</p>
                  </div>
                </div>
                <div class="btnConect">
                  <button
                    class="btn"
                    :class="statusButton(status.name)"
                  >{{ status.name.toUpperCase() }}</button>
                </div>
              </div>
            </div>
            <div class="wrapperBody mt-5 contact">
              <div class="row d-flex justify-content-between align-items-start">
                <div class="col-4">
                  <div class="d-flex align-items-center">
                    <div class>
                      <span class="icon-phone-call mr-3"></span>
                    </div>
                    <div>
                      <span class="font-weight-bold">Phone</span>
                      <p>{{ business.phone }}</p>
                    </div>
                  </div>
                  <div class="d-flex align-items-center mt-3">
                    <div class>
                      <span class="icon-mail2 font-weight-bold mr-3"></span>
                    </div>
                    <div class="scrolled-div contact-emails">
                      <span class="d-block font-weight-bold">Emails</span>
                      <ul>
                        <li v-for="(contact, key) in businessContacts" :key="key">
                          <a class="d-inline">{{ contact.email }}</a>
                          <div
                            class="ml-2 badge badge-success d-inline"
                            v-if="isContactManager(contact)"
                          >MANAGER</div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div class="col-12">
                  <div class="row d-flex justify-content-between align-items-start">
                    <div class="col-12">
                      <div class="d-flex align-items-center">
                        <div class>
                          <span class="icon-map font-weight-bold mr-3"></span>
                        </div>
                        <div>
                          <span class="font-weight-bold">Address</span>
                          <p>{{ business.address | capitalize }}</p>
                        </div>
                      </div>
                      <div class="d-flex align-items-center mt-3">
                        <div class>
                          <span class="icon-desktop1 font-weight-bold mr-3"></span>
                        </div>
                        <div>
                          <span class="d-block font-weight-bold">Website</span>
                          <a
                            :href="'//' + buildUrl(business.domain)"
                            target="_blank"
                          >{{ buildUrl(business.domain) }}</a>
                        </div>
                      </div>
                      <div class="d-flex align-items-center mt-3">
                        <div class>
                          <span class="icon-globe font-weight-bold mr-3"></span>
                        </div>
                        <div>
                          <span class="d-block font-weight-bold">Latitude & Longitude</span>
                          <span>{{ business.latitude }}, {{ business.longitude }}</span>
                        </div>
                      </div>
                    </div>
                    <div class="col-12">
                      <div class="d-flex align-items-center">
                        <div class>
                          <span class="icon-briefcase1 font-weight-bold mr-3"></span>
                        </div>
                        <div>
                          <span class="d-block font-weight-bold">Core business</span>
                          <span>{{ business.category_name }}</span>
                        </div>
                      </div>
                      <div class="d-flex align-items-center mt-3">
                        <div class>
                          <span class="icon-device_hub mr-3"></span>
                        </div>
                        <div>
                          <span class="d-block font-weight-bold">Contact person</span>
                          <span>{{ business.contact_person }}</span>
                        </div>
                      </div>
                      <div class="d-flex align-items-center mt-3">
                        <div class>
                          <span class="icon-eyedropper font-weight-bold mr-3"></span>
                        </div>
                        <div>
                          <span class="d-block font-weight-bold">Colors</span>
                          <div class="d-block">
                            <span
                              class="d-inline icon-square mr-2"
                              :style="{ color: business.primary_color }"
                            ></span>
                            <span class="d-inline">{{ business.primary_color }}</span>
                          </div>
                          <div class="d-block">
                            <span
                              class="d-inline icon-square mr-2"
                              :style="{ color: business.secondary_color }"
                            ></span>
                            <span class="d-inline">{{ business.secondary_color }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="col-12">
                      <div class="d-flex align-items-center">
                        <div class>
                          <span class="icon-tree mr-3"></span>
                        </div>
                        <div>
                          <span class="d-block font-weight-bold">Salaries</span>
                          <span>{{ business.salaries }}</span>
                        </div>
                      </div>
                      <div class="d-flex align-items-center mt-3">
                        <div class>
                          <span class="icon-wallet font-weight-bold mr-3"></span>
                        </div>
                        <div>
                          <span class="d-block font-weight-bold">Budget</span>
                          <span>{{ business.budget }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
  </div>
</template>

<script>
import { businessesService } from "@/_services";
import { statusButtonMixin, urlMixin, logoMixin } from "@/_mixins";
import { mapActions } from "vuex";

export default {
  mixins: [statusButtonMixin, urlMixin, logoMixin],

  props: {
    business: Object,
    status: Object,
    businessContacts: Array
  },

  methods: {

    executeAction(action) {
      this.$emit(action);
    },

    isContactManager(contact) {
      return contact.role != null && contact.role.length !== 0;
    }
  }
};
</script>