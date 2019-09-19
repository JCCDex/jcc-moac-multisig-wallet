<template>
  <div
    class="multisig-wallet-proposal-cell-container"
    flex="main:justify cross:center"
  >
    <div flex="cross:center" style="width:calc(100% - 0.4rem)">
      <svg
        v-if="!isProposed"
        class="multisig-wallet-icon"
        style="margin-right:0.19rem;"
        aria-hidden="true"
        @click="proposal.checked = !proposal.checked"
      >
        >
        <use :xlink:href="icon" />
      </svg>
      <div
        style="text-align: left;"
        :style="{ 'max-width': isProposed ? '100%' : 'calc(100% - 0.6rem)' }"
        @click="goto('/proposal/detail')"
      >
        <div>
          <span class="multisig-wallet-large-font-size" style="color: #181C24;">
            {{ `提现申请` }}
          </span>
          <span
            class="multisig-wallet-small-font-size"
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
      class="multisig-wallet-arrow multisig-wallet-arrow-right"
      style="bottom: 0.06rem;"
      @click="goto('/proposal/detail')"
    />
  </div>
</template>
<script>
export default {
  props: {
    proposal: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  computed: {
    isProposed() {
      return this.proposal.type === "proposed";
    },
    icon() {
      return this.proposal.checked ? "#icon-selected" : "#icon-unselected";
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
.multisig-wallet-proposal-cell-container {
  height: 1.26rem;
  margin: 0 0.3rem;

  &:not(:last-child) {
    border-bottom: 0.01rem solid #e2e6f1;
  }
}
</style>
