<template>
  <div class="multisig-wallet-container">
    <div style="position: fixed; height: 100%; width: 100%; top: 0;">
      <div class="multisig-wallet-tab-bar">
        <div class="multisig-wallet-tabs multisig-wallet-tabs-bottom">
          <div
            class="multisig-wallet-tabs-content-wrap"
            style="touch-action: pan-x pan-y; position: relative; left: 0%;flex-direction: column"
          >
            <div
              ref="scroll"
              class="scroll-wrapper"
              style="margin-top:0.1rem; height: calc(100% - 0.1rem);"
            >
              <div class="multisig-wallet-message-detail-container">
                <p
                  class="multisig-wallet-large-font-size"
                  style="color: #0B1F5D"
                >
                  提现申请
                </p>
                <p
                  class="multisig-wallet-small-font-size"
                  style="color: #9EA4C4"
                >
                  提现时间：2019-10-07 11:00
                </p>
                <p>
                  申请钱包：0xdkwim2swijkdksyw7nuifncxvdrqskd9fkffqsljkwyrtsfkvn4fkwkxmiel
                </p>
                <p>已锁仓数量：100000MOAC</p>
                <p>提现数量：1000MOAC</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import BScroll from "@better-scroll/core";
export default {
  name: "MessageDetail",
  data() {
    return {};
  },
  mounted() {
    this.init();
  },
  updated() {
    this.bs.refresh();
  },
  beforeDestroy() {
    this.bs.destroy();
  },
  methods: {
    init() {
      this.bs = new BScroll(this.$refs.scroll, {
        scrollY: true,
        click: true
      });
    }
  }
};
</script>
<style lang="scss">
.multisig-wallet-message-detail-container {
  background-color: #fff;
  padding: 0.23rem;
  color: #6b6e73;

  > p {
    text-align: left;
    word-break: break-all;

    &:not(:first-child) {
      margin-top: 0.17rem;
    }
  }
}
</style>
