<template>
  <div
    class="multisig-wallet-voter-cell-container"
    flex="main:justify cross:center"
  >
    <div flex="cross:center" style="width: calc(100% - 0.4rem)">
      <div style="width:100%">
        <div
          class="multisig-wallet-large-font-size"
          style="color: #0B1F5D;text-align:left;"
        >
          {{ `投票人1` }}
        </div>
        <div
          class="van-ellipsis"
          style="color: #6B6E73;text-align:left;margin-top:0.04rem;"
        >
          {{ `0xvpwupoqnzmsae3pmwtqzalopuyw7bvxcdmw0uey` }}
        </div>
      </div>
    </div>
    <i
      class="multisig-wallet-arrow multisig-wallet-arrow-right"
      style="bottom: 0.06rem;"
    />
  </div>
</template>
<script>
export default {
  props: {
    voter: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  methods: {}
};
</script>
<style lang="scss">
.multisig-wallet-voter-cell-container {
  height: 1.26rem;

  &:not(:last-child) {
    border-bottom: 0.01rem solid #e2e6f1;
  }
}
</style>
