<template>
  <header class="mutisig-wallet-header" flex="main:center cross:center">
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
  height: 40px;
  width: 100%;
  line-height: 40px;
  background-color: #fff;
  font-size: 16px;
}
</style>
