<template>
  <div style="position: relative">
    <input v-model="value" type="number" class="multisig-wallet-input" />
    <slot />
  </div>
</template>
<script>
export default {
  data() {
    return {
      value: ""
    };
  }
};
</script>
