<template>
  <div
    class="contenedor d-flex flex-column justify-content-center align-items-center spinner-container titCard"
  >
    <h4>{{ message }}</h4>
  </div>
</template>

<script>
export default {
  props: {
    message: String
  }
};
</script>