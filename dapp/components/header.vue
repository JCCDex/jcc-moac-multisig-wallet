<template>
  <header
    class="mutisig-wallet-header mutisig-wallet-large-font-size"
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
.mutisig-wallet-header {
  position: relative;
  height: 0.8rem;
  width: 100%;
  line-height: 0.8rem;
  background-color: #fff;
}
</style>
