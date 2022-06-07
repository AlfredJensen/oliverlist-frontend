<template>
  <div>
    <div class="btn-group" :class="direction">
      <button
        ref="buttondropdown"
        class="ml-2 rounded btn btn-sm btn-outline-primary effect-btn"
        :class="sending ? 'btn-secondary btn-loading' : 'btn-outline-primary'"
        data-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false"
      >
        <i class="icon icon-rocket"></i> {{ $t("lang.integrations.sendtocrm") }}
      </button>
      <div class="dropdown-menu p-3" aria-labelledby="dropdownMenuLink">
        <span
          v-if="loading"
          class="loadingres d-flex p-2 spinner-border loading-spinner mx-auto"
          role="status"
        >
        </span>
        <div v-else>
          <div class="fix-height">
            <a
              :class="'text-secondary'"
              v-for="(item, key) in crmUsers" :key="key"
              @click="sendToCrm(item)"
              class="dropdown-item p-1"
              href="#"
            >
              <img
                :src="require('@/assets/images/' + getLogo(item.crm_config_type_id))"
                class="opp-logo br-30" width="18px"
              />
              {{ item.email }}
            </a>
            <span class="px-3" v-if="Object.entries(crmUsers).lenght == 0">
              NO CRM
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import { crmService } from "@/_services";

export default {
  components: {
    LoadingSpinner,
    crmService,
  },
  data() {
    return {
      crmUsers: Array,
      loading: true,
      crmList: [
        {
          id: 1,
          name: "Pipedrive",
          logo: "pipedrive-logo.png",
          href: "https://oauth.pipedrive.com/oauth/authorize?response_type=code&client_id=44cd8a8a2d52a7df&redirect_uri=https://crm.oliverlist.com/1",
        },
        {
          id: 2,
          name: "Hubspot",
          logo: "hubspot-logo.png",
          href: "https://app.hubspot.com/oauth/authorize?client_id=459024f1-b968-4961-9f8f-d1833adc1521&redirect_uri=https://app.oliverlist.com/settings-account/integrations/2&scope=oauth%20crm.objects.contacts.read%20crm.objects.contacts.write%20crm.objects.companies.write%20crm.objects.companies.read%20crm.objects.deals.read%20crm.objects.deals.write",
        },
      ]
    };
  },

  methods: {
    sendToCrm(item) {
      this.$emit("sendToCrm", item.user_id)
    },
    getLogo(id){
      let field = this.crmList.find(field => field.id == id)
      if(field !== undefined){
        return field.logo
      }
      return false;
    }
  },
  props: {
    model: Object,
    sending: Boolean
  },
  created() {
    crmService.getUsers().then((response) => {
      if (response) {
        this.crmUsers = response;
      }
      this.loading = false;
    });
  },
};
</script>
<style scoped>
.fix-height {
  max-height: 243px;
  overflow-y: scroll;
}
</style>