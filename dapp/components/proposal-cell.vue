<template>
  <div
    class="mutisig-wallet-proposal-cell-container"
    flex="main:justify cross:center"
    @click="goto('/proposal/detail')"
  >
    <div flex="cross:center" style="width:calc(100% - 0.4rem)">
      <svg class="mutisig-wallet-icon" aria-hidden="true">
        >
        <use xlink:href="#icon-unselected" />
      </svg>
      <div
        style="margin-left:0.19rem;text-align: left;max-width:calc(100% - 0.8rem)"
      >
        <div>
          <span class="mutisig-wallet-large-font-size" style="color: #181C24;">
            {{ `提现申请` }}
          </span>
          <span
            class="mutisig-wallet-small-font-size"
            style="margin-left:0.28rem;color: #9EA4C4"
          >
            {{ `3分钟前` }}
          </span>
        </div>
        <div
          class="van-ellipsis"
          style="color: #6B6E73;text-align:left;margin-top:0.04rem;"
        >
          {{
            `xxx申请提现xxx申请提现xxx申请提现xxx申请提现xxx申请提现xxx申请提现xxx申请提现xxx申请提现xxx申请提现xxx申请提现`
          }}
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
  },
  methods: {
    goto(route) {
      this.$router.push(route);
    }
  }
};
</script>
<style lang="scss">
.mutisig-wallet-proposal-cell-container {
  height: 1.26rem;
  margin: 0 0.3rem;

  &:not(:last-child) {
    border-bottom: 0.01rem solid #e2e6f1;
  }
}
</style>
