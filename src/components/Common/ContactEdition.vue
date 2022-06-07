<template>
  <div class="row contact-edition">
    <div class="col-md-12">
      <div class="row">
        <div class="col-md-12">
          <div class="wrapperCard mt-2">
            <div class="row">
              <div class="col-6 titCard">
                <h4>Contact</h4>
              </div>
            </div>
            <div class="card p-4 mt-3 shadow">
              <div class="mb-3 mt-3 ml-3 mr-3">
                <div class="wrapperBody contact">
                  <div class="row d-flex justify-content-between align-items-start">
                    <div class="col-4">
                      <LoadingSpinner v-if="reanalyzingLogo" />
                      <div class="d-flex align-items-center" v-else>
                        <div class>
                          <span class="icon-image contact-icon font-weight-bold mr-3"></span>
                        </div>
                        <div>
                          <span class="font-weight-bold">Logo</span>
                          <span
                            v-html="business.logo"
                            v-if="isSvgLogo(business.logo)"
                            class="business-logo"
                          ></span>
                          <img
                            class="d-block imgmain business-logo"
                            :src="logoUrl(businessEdited.logo)"
                            v-else
                          />
                        </div>
                      </div>
                      <div class="d-flex align-items-center mt-3">
                        <button
                          class="btn btn-primary btn-sm reanalyze-button text-uppercase mr-2"
                          @click.once="reanalyzeLogo()"
                        >
                          <span
                            class="icon-wrench"
                            data-toggle="tooltip"
                            data-placement="bottom"
                            title="Reanalyze logo"
                          ></span>
                        </button>
                        <div class="custom-file">
                          <input
                            type="file"
                            class="custom-file-input"
                            id="customFile"
                            @change="onLogoInputChange($event)"
                          />
                          <label class="custom-file-label" for="customFile">Upload logo</label>
                        </div>
                      </div>
                      <div class="d-flex align-items-center mt-4" v-if="!emptyAlternativeLogos">
                        <div class="alternatives-logos-col">
                          <div class="alternatives-logos">
                            <div
                              class="d-inline pr-3"
                              v-for="(alternativeLogo, key) in alternativeLogos"
                              :key="key"
                            >
                              <img
                                class="business-logo"
                                :src="alternativeLogo"
                                @click="businessEdited.logo = alternativeLogo"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="d-flex align-items-center mt-3">
                        <div class>
                          <span class="icon-mail2 contact-icon font-weight-bold mr-3"></span>
                        </div>
                        <div class="scrolled-div contact-emails">
                          <span class="d-inline font-weight-bold">Emails</span>
                          <ul>
                            <li
                              v-for="(contact, key) in businessContactsEdited"
                              :key="key"
                              class="mt-1"
                            >
                              <button
                                class="btn btn-ssm btn-danger mr-2"
                                @click="deleteContact(contact)"
                              >
                                <span class="icon-user-times delete-contact-icon"></span>
                              </button>
                              <a class="mr-2">{{ contact.email }}</a>
                              <toggle-button
                                :value="isContactManager(contact)"
                                @change="toogleContactManager(contact)"
                                :labels="{checked: 'Manager', unchecked: 'Not manager'}"
                                :sync="true"
                                class="manager-switch"
                                :class="isContactManager(contact) ? 'manager-selected' : ''"
                              />
                            </li>
                            <li
                              v-for="(contact, key) in newBusinessContacts"
                              :key="'nc-' + key"
                              class="mt-1"
                            >
                              <button
                                class="btn btn-ssm btn-danger mr-2"
                                @click="deleteContact(contact)"
                              >
                                <span class="icon-user-times delete-contact-icon"></span>
                              </button>
                              <a class="mr-2">{{ contact.email }}</a>
                              <toggle-button
                                :value="isContactManager(contact)"
                                @change="toogleContactManager(contact)"
                                :labels="{checked: 'Manager', unchecked: 'Not manager'}"
                                :sync="true"
                                class="manager-switch"
                                :class="isContactManager(contact) ? 'manager-selected' : ''"
                              />
                            </li>
                            <li class="mt-1">
                              <button
                                class="btn btn-ssm btn-primary btn-success mr-2 d-inline"
                                @click="saveNewBusinessContact()"
                              >
                                <span class="icon-user-plus delete-contact-icon"></span>
                              </button>
                              <input
                                class="form-control d-inline new-email-input mr-2"
                                type="text"
                                placeholder="New email"
                                v-model="newBusinessContact.email"
                              />
                              <toggle-button
                                :value="isContactManager(newBusinessContact)"
                                @change="toogleContactManager(newBusinessContact)"
                                :labels="{checked: 'Manager', unchecked: 'Not manager'}"
                                :sync="true"
                                class="manager-switch"
                                :class="isContactManager(newBusinessContact) ? 'manager-selected' : ''"
                              />
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div class="col-8">
                      <div class="row d-flex justify-content-between align-items-start">
                        <div class="col-4">
                          <div class="d-flex align-items-center">
                            <div class>
                              <span class="icon-font contact-icon font-weight-bold mr-3"></span>
                            </div>
                            <div class="w-80">
                              <span class="font-weight-bold">Name</span>
                              <input
                                class="form-control"
                                type="text"
                                placeholder="Business name"
                                v-model="businessEdited.name"
                              />
                            </div>
                          </div>
                          <div class="d-flex align-items-center mt-3">
                            <div class>
                              <span class="icon-phone-call contact-icon mr-3"></span>
                            </div>
                            <div>
                              <span class="d-block font-weight-bold">Phone</span>
                              <input
                                class="form-control"
                                type="text"
                                placeholder="Business phone"
                                v-model="businessEdited.phone"
                              />
                            </div>
                          </div>
                          <div class="d-flex align-items-center mt-3">
                            <div class>
                              <span class="icon-map contact-icon font-weight-bold mr-3"></span>
                            </div>
                            <div class="w-80">
                              <span class="font-weight-bold">Address</span>
                              <input
                                class="form-control"
                                type="text"
                                placeholder="Business address"
                                v-model="businessEdited.address"
                              />
                            </div>
                          </div>
                          <div class="d-flex align-items-center mt-3">
                            <div class>
                              <span class="icon-map-o contact-icon mr-3"></span>
                            </div>
                            <div class="w-80">
                              <span class="d-block font-weight-bold">City</span>
                              <input
                                class="form-control"
                                type="text"
                                placeholder="Business website"
                                v-model="businessEdited.city"
                              />
                            </div>
                          </div>
                          <div class="d-flex align-items-center mt-3">
                            <div class>
                              <span class="icon-location font-weight-bold contact-icon mr-3"></span>
                            </div>
                            <div class="w-80">
                              <span class="d-block font-weight-bold">{{ $t('lang.label.country') }}</span>
                              <span>{{ businessEdited.country_name }}</span>
                            </div>
                          </div>
                        </div>
                        <div class="col-4">
                          <div class="d-flex align-items-center">
                            <div class>
                              <span class="icon-desktop1 contact-icon font-weight-bold mr-3"></span>
                            </div>
                            <div class="w-80">
                              <span class="d-block font-weight-bold">Website</span>
                              <input
                                class="form-control"
                                type="text"
                                placeholder="Business website"
                                v-model="businessEdited.domain"
                              />
                            </div>
                          </div>
                          <div class="d-flex align-items-center mt-3">
                            <div class>
                              <span class="icon-device_hub contact-icon mr-3"></span>
                            </div>
                            <div class="w-80">
                              <span class="d-block font-weight-bold">Contact person</span>
                              <input
                                class="form-control"
                                type="text"
                                placeholder="Business contact person"
                                v-model="businessEdited.contact_person"
                              />
                            </div>
                          </div>
                          <div class="d-flex align-items-center mt-3">
                            <div class>
                              <span class="icon-briefcase1 font-weight-bold contact-icon mr-3"></span>
                            </div>
                            <div class="w-80">
                              <span class="d-block font-weight-bold">Core business</span>
                              <span>{{ businessEdited.category_name }}</span>
                            </div>
                          </div>
                          <div class="d-flex align-items-center mt-3">
                            <div class>
                              <span class="icon-eyedropper font-weight-bold contact-icon mr-3"></span>
                            </div>
                            <div>
                              <span class="d-block font-weight-bold">Primary Color</span>
                              <div class="row mr-0 ml-0">
                                <input
                                  class="d-inline input-colors"
                                  type="color"
                                  v-model="businessEdited.primary_color"
                                />
                                <input
                                  class="d-inline m-auto"
                                  type="text"
                                  v-model="businessEdited.primary_color"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="col-4">
                          <div class="d-flex align-items-center">
                            <div class>
                              <span class="icon-tree contact-icon mr-3"></span>
                            </div>
                            <div class="w-80">
                              <span class="d-block font-weight-bold">Salaries</span>
                              <input
                                class="form-control"
                                type="text"
                                placeholder="Business salaries"
                                v-model="businessEdited.salaries"
                              />
                            </div>
                          </div>
                          <div class="d-flex align-items-center mt-3">
                            <div class>
                              <span class="icon-wallet font-weight-bold contact-icon mr-3"></span>
                            </div>
                            <div class="w-80">
                              <span class="d-block font-weight-bold">Budget</span>
                              <input
                                class="form-control"
                                type="text"
                                placeholder="Business budget"
                                v-model="businessEdited.budget"
                              />
                            </div>
                          </div>
                          <div class="d-flex align-items-center mt-3">
                            <div class>
                              <span class="icon-square-o contact-icon mr-3"></span>
                            </div>
                            <div class="w-80">
                              <span class="d-block font-weight-bold">Header white</span>
                              <toggle-button
                                :value="isHeaderWhite(businessEdited)"
                                @change="toogleHeaderWhite(businessEdited)"
                                :labels="{checked: 'Yes', unchecked: 'No'}"
                                :sync="true"
                              />
                            </div>
                          </div>
                          <div class="d-flex align-items-center mt-3">
                            <div class>
                              <span class="icon-eyedropper font-weight-bold contact-icon mr-3"></span>
                            </div>
                            <div>
                              <span class="d-block font-weight-bold">Secondary Color</span>
                              <div class="row mr-0 ml-0">
                                <input
                                  class="d-inline input-colors"
                                  type="color"
                                  v-model="businessEdited.secondary_color"
                                />
                                <input
                                  class="d-inline m-auto"
                                  type="text"
                                  v-model="businessEdited.secondary_color"
                                />
                              </div>
                            </div>
                          </div>
                          <div class="mt-5 text-right">
                            <button class="btn btn-sm btn-secondary" @click.once="closeEdition()">{{ $t('lang.button.cancel') }}</button>
                            <button
                              class="btn btn-primary btn-sm themed-button ml-2"
                              @click.once="saveEdition()"
                            >{{ $t('lang.button.save') }}</button>
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
    </div>
  </div>
</template>

<script>
import { businessesService, toolsService } from "@/_services";
import { logoMixin } from "@/_mixins";
import LoadingSpinner from "@/components/LoadingSpinner.vue";

export default {
  data() {
    return {
      businessEdited: {},
      businessContactsEdited: [],
      newBusinessContacts: [],
      deletedBusinessContacts: [],
      newBusinessContact: {
        email: "",
        email_source: 8,
        role: "",
        role_source: 8
      },
      reanalyzingLogo: false,
      alternativeLogos: []
    };
  },

  mixins: [logoMixin],

  components: {
    LoadingSpinner
  },

  props: {
    business: Object,
    businessContacts: Array
  },

  created() {
    this.businessEdited = { ...this.business };
    this.businessContactsEdited = JSON.parse(
      JSON.stringify(this.businessContacts)
    );
  },

  computed: {
    emptyAlternativeLogos() {
      return this.alternativeLogos.length === 0;
    }
  },

  methods: {
    closeEdition() {
      this.$emit("closeEdition");
    },

    saveEdition() {
      businessesService.update(this.businessEdited).then(business => {
        businessesService
          .updateBusinessContacts(
            this.businessEdited.id,
            this.getToUpdateBusinessContacts(),
            this.newBusinessContacts,
            this.deletedBusinessContacts
          )
          .then(businessContactsEdition => {
            this.$swal({
              type: "success",
              title: this.$t('lang.label.great'),
              text: this.$t('lang.label.businessandbusinesscontactsmodifiedsuccessfully'),
              showConfirmButton: false,
              timer: 2500
            }).then(result => {
              this.$emit("saveEdition");
            });
          });
      });
    },

    resetnewBusinessContact() {
      this.newBusinessContact.email = "";
      this.newBusinessContact.role = "";
    },

    isContactManager(contact) {
      return contact.role != null && contact.role.length !== 0;
    },

    toogleContactManager(contact) {
      contact.role = this.isContactManager(contact) ? "" : "Manager";
    },

    deleteContact(toDeleteContact) {
      if (
        this.newBusinessContacts.find(
          contact => contact.email === toDeleteContact.email
        )
      ) {
        this.newBusinessContacts = this.newBusinessContacts.filter(function(
          contact
        ) {
          return contact.email !== toDeleteContact.email;
        });
      } else {
        this.businessContactsEdited = this.businessContactsEdited.filter(
          function(contact) {
            return contact.email !== toDeleteContact.email;
          }
        );
        this.deletedBusinessContacts.push({ ...toDeleteContact });
      }
    },

    saveNewBusinessContact() {
      if (
        this.businessContactsEdited.length + this.newBusinessContacts.length <
        6
      ) {
        if (this.validEmail(this.newBusinessContact.email)) {
          if (
            !this.newBusinessContacts.find(
              contact => contact.email === this.newBusinessContact.email
            )
          ) {
            businessesService
              .getByBusinessContactEmail(this.newBusinessContact.email)
              .then(business => {
                if (!business) {
                  this.newBusinessContacts.push({ ...this.newBusinessContact });
                  this.resetnewBusinessContact();
                } else {
                  this.$swal({
                    type: "error",
                    title: this.$t('lang.label.error'),
                    text: `Email already exists in business named: ${business.name}`,
                    showConfirmButton: true
                  });
                }
              });
          } else {
          }
        } else {
          this.$swal({
            type: "error",
            title: this.$t('lang.label.error'),
            text: this.$t('lang.label.youmustenteravalidemail'),
            showConfirmButton: false,
            timer: 2500
          });
        }
      } else {
        this.$swal({
          type: "error",
          title: this.$t('lang.label.error'),
          text:
            "Contacts limit. A business couldn`t have more than 6 contacts!",
          showConfirmButton: false,
          timer: 2500
        });
      }
    },

    validEmail(email) {
      return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
    },

    getToUpdateBusinessContacts() {
      var toUpdateBusinessContacts = [];
      this.businessContactsEdited.forEach(editedContact => {
        this.businessContacts.forEach(contact => {
          if (
            editedContact.email == contact.email &&
            editedContact.role != contact.role
          ) {
            toUpdateBusinessContacts.push(editedContact);
          }
        });
      });
      return toUpdateBusinessContacts;
    },

    isHeaderWhite(business) {
      return business.headerwhite === "1";
    },

    toogleHeaderWhite(business) {
      business.headerwhite = business.headerwhite === "1" ? "0" : "1";
    },

    reanalyzeLogo() {
      this.reanalyzingLogo = true;
      toolsService.analyzeLogo(this.businessEdited.domain).then(logoResult => {
        this.businessEdited.logo = logoResult.logos;
        this.alternativeLogos = logoResult.logosalt;
        this.reanalyzingLogo = false;
      });
    },

    onLogoInputChange(e) {
      var files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;
      this.saveImage(files[0]);
    },

    saveImage(file) {
      this.reanalyzingLogo = true;
      toolsService.uploadImage(file).then(newLogo => {
        this.businessEdited.logo = newLogo;
        this.reanalyzingLogo = false;
      });
    }
  }
};
</script>