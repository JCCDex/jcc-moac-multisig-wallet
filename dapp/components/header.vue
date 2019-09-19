<template>
  <header
    class="multisig-wallet-header multisig-wallet-large-font-size"
    flex="main:center cross:center"
  >
    {{ title }}
  </header>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: ""
    }
  }
};
</script>
<style lang="scss">
.multisig-wallet-header {
  position: relative;
  height: 0.8rem;
  width: 100%;
  line-height: 0.8rem;
  background-color: #fff;
}
</style>
