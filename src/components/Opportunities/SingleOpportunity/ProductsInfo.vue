<template>
  <div class="card p-3 mt-5">
    <div v-for="(link, key) in links" :key="key" class="row" :class="(key === 0) ? '' : 'mt-2'">
      <div class="col-6">
        <span class="mr-2 d-inline" :class="productIcon(link.campaign_name)"></span>
        <p class="d-inline">{{ link.campaign_name }}</p>
      </div>
      <div class="col-3">
        <p>{{ link.creation_date | formatDate }}</p>
      </div>
      <div class="col-3 text-right">
        <span class="badge" :class="statusBadge(link.status)">{{ statusBadgeName(link.status).toUpperCase() }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { productIconMixin, statusBadgeMixin } from "@/_mixins/";

export default {
  mixins: [productIconMixin, statusBadgeMixin],

  props: {
    links: Array
  }
};
</script>