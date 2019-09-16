<template>
  <div
    class="multisig-wallet-message-cell-container"
    flex="main:justify cross:center"
  >
    <div flex="cross:center">
      <div
        flex="main:center cross:center"
        style="height: 0.8rem; width:0.8rem;background-color: #F2F5FF;border-radius:0.4rem;"
      >
        <svg
          class="mutisig-wallet-icon mutisig-wallet-icon-large"
          aria-hidden="true"
        >
          <use xlink:href="#icon-withdraw" />
        </svg>
      </div>
      <div style="margin-left:0.19rem;">
        <div>
          <span class="mutisig-wallet-large-font-size" style="color: #0B1F5D;">
            {{ `提现申请` }}
          </span>
          <span
            class="mutisig-wallet-small-font-size"
            style="margin-left:0.28rem;color: #9EA4C4"
          >
            {{ `3分钟前` }}
          </span>
        </div>
        <div style="color: #6B6E73;text-align:left;margin-top:0.04rem;">
          {{ `xxx申请提现` }}
        </div>
      </div>
    </div>
    <i
      class="mutisig-wallet-arrow mutisig-wallet-arrow-right"
      style="bottom: 0.06rem;"
    />
  </div>
</template>
<script>
export default {
  props: {
    message: {
      type: Object,
      default() {
        return {};
      }
    }
  }
};
</script>
<style lang="scss">
.multisig-wallet-message-cell-container {
  height: 1.4rem;
  margin: 0 0.29rem 0 0.31rem;

  &:not(:last-child) {
    border-bottom: 0.01rem solid #e2e6f1;
  }
}
</style>
